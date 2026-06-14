import * as fs from 'fs';
import * as path from 'path';
import { norm } from './utils';
import { glob } from 'glob';
import { EventEmitter } from 'events';
import { BrowserManager } from './browser-manager';
import { FileDiscoveryService } from './file-discovery-service';
import { HtmlGenerator } from './html-generator';
import { HttpServerManager } from './http-server-manager';
import { NodeTestRunner } from './node-test-runner';
import { ViteConfigBuilder } from './vite-config-builder';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { ConsoleReporter } from './console-reporter';
import { IstanbulInstrumenter } from './istanbul-instrumenter';
import { WebSocketManager } from './websocket-manager';
import { CoverageReportGenerator } from './coverage-report-generator';
import { HmrManager } from './hmr-manager';
import { logger } from './logger';
import { setAnsiMode } from './symbols';
import { RunnerMessages } from './log-messages';
import { ExitCodeError, EXIT_CODES } from './exit-codes';

const { build: viteBuild } = await import('vite');

export class ViteJasmineRunner extends EventEmitter {
  private viteCache: any = null;
  private config: ViteJasmineConfig;
  private fileDiscovery: FileDiscoveryService;
  private viteConfigBuilder: ViteConfigBuilder;
  private htmlGenerator: HtmlGenerator;
  private browserManager: BrowserManager;
  private httpServerManager: HttpServerManager;
  private nodeTestRunner: NodeTestRunner;
  private webSocketManager: WebSocketManager | null = null;
  private consoleReporter: ConsoleReporter;
  private instrumenter: IstanbulInstrumenter;
  private hmrManager: HmrManager | null = null;
  private completePromiseResolve: (() => void) | null = null;
  private completePromise = new Promise<void>((resolve, reject) => { this.completePromiseResolve = resolve; });
  private primarySrcDir: string;
  private primaryTestDir: string;
  private shouldPreserve(): boolean {
    return !!this.config.preserveOutputs;
  }
  
  constructor(config: ViteJasmineConfig) {
    super();

    const cwd = norm(process.cwd());
    let normalizedSrcDirs = (Array.isArray(config.srcDirs) ? config.srcDirs : [config.srcDirs ?? './src'])
      .filter(Boolean)
      .map(norm);
    let normalizedTestDirs = (Array.isArray(config.testDirs) ? config.testDirs : [config.testDirs ?? './tests'])
      .filter(Boolean)
      .map(norm);

    if (config.project) {
      const projectPath = norm(path.resolve(config.project));
      const scopeToProject = (dirs: string[]): string[] => {
        return dirs.map((dir) => {
          const resolved = norm(path.resolve(dir));
          if (resolved.startsWith(projectPath + '/')) {
            return resolved;
          }
          return norm(path.join(projectPath, dir));
        });
      };
      normalizedSrcDirs = scopeToProject(normalizedSrcDirs);
      normalizedTestDirs = scopeToProject(normalizedTestDirs);
    }

    this.primarySrcDir = normalizedSrcDirs[0] ?? cwd;
    this.primaryTestDir = normalizedTestDirs[0] ?? cwd;
    
    this.config = {
      ...config,
      browser: config.browser ?? 'node',
      port: config.port ?? 8888,
      headless: config.headless ?? true,
      watch: config.watch ?? false,
      srcDirs: normalizedSrcDirs,
      testDirs: normalizedTestDirs,
      outDir: norm(config.outDir ?? path.join(cwd, 'dist/.vite-jasmine-build/')),
    };

    if (this.config.ansi) {
      setAnsiMode();
    }

    this.fileDiscovery = new FileDiscoveryService(this.config);
    this.viteConfigBuilder = new ViteConfigBuilder(this.config);
    this.htmlGenerator = new HtmlGenerator(this.fileDiscovery, this.config);
    this.browserManager = new BrowserManager(this.config);
    this.httpServerManager = new HttpServerManager(this.config);
    this.instrumenter = new IstanbulInstrumenter(this.config);
    this.consoleReporter = new ConsoleReporter();
    this.nodeTestRunner = new NodeTestRunner(this.config, {
      reporter: this.consoleReporter,
      cwd: this.config.outDir,
      file: 'test-runner.js',
      coverage: this.config.coverage,
      suppressConsoleLogs: this.config.suppressConsoleLogs
    });
  }



  async preprocess(): Promise<void> {
    try {
      const { srcFiles, specFiles } = await this.fileDiscovery.discoverSources();
      if (specFiles.length === 0) {
        throw new ExitCodeError(EXIT_CODES.CONFIG_ERROR, 'No test files found');
      }

      const entryFiles = [...srcFiles, ...specFiles];
      const viteConfig = this.viteConfigBuilder.createViteConfig(entryFiles);
      const input: Record<string, string> = {};

      const entryKeyFromOutput = (file: string) =>
        this.fileDiscovery.getOutputName(file).replace(/\.js$/, '');

      for (const file of entryFiles) {
        input[entryKeyFromOutput(file)] = file;
      }

      if (!fs.existsSync(this.config.outDir)) {
        fs.mkdirSync(this.config.outDir, { recursive: true });
      }

      viteConfig.build!.rollupOptions!.input = input;

      logger.println(RunnerMessages.buildingFiles(Object.keys(input).length));
      this.viteCache = await viteBuild(viteConfig);

      const jsFiles = (await glob(path.join(this.config.outDir, '**/*.js').replace(/\\/g, '/')))
        .filter((f) => !/\.spec\.js$/i.test(f));

      for (const jsFile of jsFiles) {
        const result = await this.instrumenter.instrumentFile(jsFile);
        const outFile = path.join(this.config.outDir, path.relative(this.config.outDir, jsFile));
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, result.code, 'utf-8');
        
        // Update source map if it was modified during instrumentation
        if (result.sourceMap) {
          const mapFile = outFile + '.map';
          fs.writeFileSync(mapFile, JSON.stringify(result.sourceMap, null, 2), 'utf-8');
        }
      }

      const htmlPath = path.join(this.config.outDir, 'index.html');
      const preserveHtml = this.shouldPreserve() && fs.existsSync(htmlPath);
      if (!(this.config.headless && this.config.browser === 'node') && !preserveHtml) {
        if (this.config.watch) {
          await this.htmlGenerator.generateHtmlFileWithHmr();
        } else {
          await this.htmlGenerator.generateHtmlFile();
        }
      } else if (preserveHtml) {
        logger.println(RunnerMessages.preservingExistingHtml());
      }

      const runnerPath = path.join(this.config.outDir, 'test-runner.js');
      const preserveRunner = this.shouldPreserve() && fs.existsSync(runnerPath);
      if (this.config.headless && this.config.browser === 'node' && !preserveRunner) {
        this.nodeTestRunner.generateTestRunner();
      } else if (this.config.headless && this.config.browser === 'node' && preserveRunner) {
        logger.println(RunnerMessages.preservingExistingRunner());
      }
    } catch (error) {
      logger.error(RunnerMessages.preprocessFailed(error));
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    if (this.hmrManager) {
      await this.hmrManager.stop();
      this.hmrManager = null;
    }
    if (this.webSocketManager) {
      await this.webSocketManager.cleanup();
      this.webSocketManager = null;
    }
    await this.httpServerManager.cleanup();
  }

  abort(message?: string): number {
    return this.consoleReporter.testsAborted(message);
  }

  async start(): Promise<number> {
    if (this.config.watch) {
      // if watch mode requested, redirect to dedicated watch() entry
      return this.watch();
    }

    logger.println(this.config.headless ? RunnerMessages.startingHeadless() : RunnerMessages.startingServer());

    try {
      await this.preprocess();
    } catch (error) {
      logger.error(RunnerMessages.buildFailed(error));
      throw error instanceof ExitCodeError ? error : new ExitCodeError(EXIT_CODES.INTERNAL_ERROR, String(error));
    }

    if (this.config.headless && this.config.browser !== 'node') {
      return await this.runHeadlessBrowserMode();
    } else if (this.config.headless && this.config.browser === 'node') {
      return await this.runHeadlessNodeMode();
    } else if (!this.config.headless && this.config.browser === 'node') {
      logger.error(RunnerMessages.invalidNodeHeadedMode());
      return EXIT_CODES.CONFIG_ERROR;
    } else {
      return await this.runHeadedBrowserMode();
    }
  }

  async watch(): Promise<number> {
    if (this.config.headless || this.config.browser === 'node') {
      logger.error(RunnerMessages.watchOnlyHeaded());
      return EXIT_CODES.CONFIG_ERROR;
    }

    this.config.watch = true;
    logger.println(RunnerMessages.startingWatchMode());
    await this.preprocess();
    return await this.runWatchMode();
  }

  private async runWatchMode(): Promise<number> {
    logger.println(RunnerMessages.startingHmrWatcher());

    const server = await this.httpServerManager.startServer();
    
    this.webSocketManager = new WebSocketManager(this.fileDiscovery, this.config, server, this.consoleReporter);
    this.hmrManager = new HmrManager(this.fileDiscovery, this.config, this.viteConfigBuilder, this.viteCache);

    this.webSocketManager.enableHmr(this.hmrManager);
    await this.hmrManager.start();

    logger.println(RunnerMessages.webSocketReady());
    logger.println(RunnerMessages.pressCtrlCToStop());

    let shuttingDown = false;
    let watchFinishedResolve: ((code: number) => void) | null = null;
    const watchFinishedPromise = new Promise<number>((resolve) => {
      watchFinishedResolve = resolve;
    });

    const onBrowserClose = async () => {
      if (shuttingDown) return;
      shuttingDown = true;
      logger.println(RunnerMessages.browserWindowClosed());
      await this.cleanup();
      watchFinishedResolve?.(EXIT_CODES.SUCCESS);
    };

    await this.browserManager.openBrowser(this.config.port!, onBrowserClose, { exitOnClose: false });

    // Keep the runner alive until an explicit shutdown signal or browser close.
    return watchFinishedPromise;
  }

  private async runHeadlessBrowserMode(): Promise<number> {
    const server = await this.httpServerManager.startServer();
    await this.httpServerManager.waitForServerReady(`http://localhost:${this.config.port}/index.html`, 10000);
    this.webSocketManager = new WebSocketManager(this.fileDiscovery, this.config, server, this.consoleReporter);

    let testSuccess = false;
    let testHasPending = false;
    let coveragePromise: Promise<void> | undefined;
    let testsCompletedResolve: (() => void) | null = null;
    const testsCompletedPromise = new Promise<void>((resolve) => {
      testsCompletedResolve = resolve;
    });
    this.webSocketManager.on('testsCompleted', ({ success, hasPending, coverage }) => {
      testSuccess = success;
      testHasPending = hasPending;
      if (this.config.coverage) {
        const cov = new CoverageReportGenerator();
        coveragePromise = cov.generate(coverage);
      }
      testsCompletedResolve?.();
    });

    const browserType = await this.browserManager.checkBrowser(this.config.browser!);

    if (!browserType) {
      logger.println(RunnerMessages.headlessBrowserUnavailable());
      this.nodeTestRunner.generateTestRunner();
      const exitCode = await this.nodeTestRunner.start();
      await this.cleanup();
      return exitCode;
    }

    try {
      await this.browserManager.runHeadlessBrowserTests(browserType, this.config.port!);
      // Wait for the jasmineDone WebSocket message to be processed so the final
      // summary is printed before we tear down the WebSocket server and exit.
      const testsCompletedTimeout = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('Timed out waiting for test completion message')), 5000);
      });
      await Promise.race([testsCompletedPromise, testsCompletedTimeout]).catch((error) => {
        logger.println(RunnerMessages.testsCompletedTimeout(error.message));
      });
      if (coveragePromise) await coveragePromise;
      await this.cleanup();
      if (!testSuccess) {
        return EXIT_CODES.TEST_FAILURES;
      }
      return testHasPending ? EXIT_CODES.SUCCESS_WITH_PENDING : EXIT_CODES.SUCCESS;
    } catch (error) {
      if (error instanceof ExitCodeError) {
        if (coveragePromise) await coveragePromise.catch(() => {});
        await this.cleanup();
        return error.exitCode;
      }
      logger.error(RunnerMessages.browserTestExecutionFailed());
      if (coveragePromise) await coveragePromise.catch(() => {});
      await this.cleanup();
      return EXIT_CODES.INTERNAL_ERROR;
    }
  }

  private async runHeadlessNodeMode(): Promise<number> {
    try {
      const exitCode = await this.nodeTestRunner.start();
      if (this.config.coverage) {
        const coverage = (globalThis as any).__coverage__;
        const cov = new CoverageReportGenerator();
        await cov.generate(coverage);
      }
      return exitCode;
    } catch (error: any) {
      logger.error(RunnerMessages.nodeTestExecutionFailed(error.message ?? String(error)));
      return EXIT_CODES.INTERNAL_ERROR;
    }
  }

  private async runHeadedBrowserMode(): Promise<number> {
    const server = await this.httpServerManager.startServer();
    let testsCompleted = false;
    let testSuccess = false;
    let testHasPending = false;
    let finishHeadedRunPromise: Promise<void> | undefined;
    this.webSocketManager = new WebSocketManager(this.fileDiscovery, this.config, server, this.consoleReporter);

    logger.println(RunnerMessages.webSocketReadyWithReporting());
    logger.println(RunnerMessages.pressCtrlCToStop());

    const finishHeadedRun = async (coverage: Record<string, any> | undefined): Promise<void> => {
      if (this.config.coverage) {
        const cov = new CoverageReportGenerator();
        await cov.generate(coverage!);
      }
      await this.browserManager.closeBrowser();
    };

    this.webSocketManager.on('testsCompleted', ({ success, hasPending, coverage }) => {
      if (testsCompleted) {
        return;
      }
      testsCompleted = true;
      testSuccess = success;
      testHasPending = hasPending;
      finishHeadedRunPromise = finishHeadedRun(coverage);
      finishHeadedRunPromise.catch((error) => {
        logger.error(RunnerMessages.finishHeadedRunFailed(error));
      });
    });

    let runFinishedResolve: ((code: number) => void) | null = null;
    const runFinishedPromise = new Promise<number>((resolve) => {
      runFinishedResolve = resolve;
    });

    const onBrowserClose = async () => {
      const promise = new Promise<void>((resolve) => {
        if (!testsCompleted) {
          setImmediate(() => {
            logger.clearLine();
            logger.printRaw('\n');
            logger.clearLine();
            this.consoleReporter.testsAborted();
            logger.clearLine();
            logger.printRaw('\n');
            logger.println(RunnerMessages.browserWindowClosedPrematurely());
            resolve();
          });
        } else {
          resolve();
        }
      });

      await promise;
      // Wait for finishHeadedRun to complete before cleanup and exit
      if (finishHeadedRunPromise) {
        await finishHeadedRunPromise.catch(() => {});
      }
      await this.cleanup();
      if (!testsCompleted) {
        runFinishedResolve?.(EXIT_CODES.SIGINT);
        return;
      }
      if (!testSuccess) {
        runFinishedResolve?.(EXIT_CODES.TEST_FAILURES);
        return;
      }
      runFinishedResolve?.(testHasPending ? EXIT_CODES.SUCCESS_WITH_PENDING : EXIT_CODES.SUCCESS);
    };

    await this.browserManager.openBrowser(this.config.port!, onBrowserClose);

    // Keep the runner alive until the browser closes or an explicit shutdown signal.
    return runFinishedPromise;
  }
}
