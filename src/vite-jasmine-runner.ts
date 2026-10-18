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
import { runNodeCli } from './node-cli-runner';
import { ViteConfigBuilder } from './vite-config-builder';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { ConsoleReporter } from './console-reporter';
import { IstanbulInstrumenter } from './istanbul-instrumenter';
import { WebSocketManager } from './websocket-manager';
import { CoverageHost } from './coverage-host';
import { HmrManager } from './hmr-manager';
import { logger } from './logger';
import { setAnsiMode } from './symbols';
import { RunnerMessages } from './log-messages';
import { ExitCodeError, EXIT_CODES } from './exit-codes';
import { getExecutionExitCode } from './cli-result-adapter';

const { build: viteBuild } = await import('vite');

type PreprocessResult = 'built' | 'no-specs';

export class ViteJasmineRunner extends EventEmitter {
  private viteCache: any = null;
  private config: ViteJasmineConfig;
  private fileDiscovery: FileDiscoveryService;
  private viteConfigBuilder: ViteConfigBuilder;
  private htmlGenerator: HtmlGenerator;
  private browserManager: BrowserManager;
  private preparedBrowserType: import('playwright').BrowserType | null = null;
  private httpServerManager: HttpServerManager;
  private nodeTestRunner: NodeTestRunner;
  private webSocketManager: WebSocketManager | null = null;
  private consoleReporter: ConsoleReporter;
  private instrumenter: IstanbulInstrumenter;
  private coverageHost: CoverageHost;
  private hmrManager: HmrManager | null = null;
  private started = false;
  private cleanupPromise: Promise<void> | null = null;
  /** Resolves the promise returned by the active watch()/headed run. */
  private finishResolve: ((code: number) => void) | null = null;
  private primarySrcDir: string;
  private primaryTestDir: string;
  private aborting = false;
  private abortExitCode: number = EXIT_CODES.SIGINT;
  private assertActive(): void {
    if (this.aborting) throw new ExitCodeError(this.abortExitCode, 'Tests aborted by user');
  }
  private shouldPreserve(): boolean {
    return !!this.config.preserveOutputs;
  }

  private preparationIdentity(): string {
    if (this.config.browser === 'node') return 'NODE';
    const browser = String(this.config.browser ?? 'chrome').toUpperCase();
    if (this.config.watch) return `WATCH · ${browser}`;
    return `${this.config.headless ? 'HEADLESS' : 'HEADED'} · ${browser}`;
  }

  private preparationSteps() {
    const common = [
      { label: 'DISCOVER', message: 'Discover test files' },
      { label: 'CONFIG', message: 'Prepare build configuration' },
      { label: 'OUTPUT', message: this.shouldPreserve() ? 'Preserve existing output' : 'Prepare output directory' },
      { label: 'BUILD', message: 'Build test modules' },
      { label: 'INSTRUMENT', message: 'Instrument compiled modules' },
    ];

    if (this.config.browser === 'node') {
      return [
        ...common,
        { label: 'RUNNER', message: 'Prepare in-process test runner' },
        { label: 'EXECUTE', message: 'Start Node test session' },
      ];
    }

    const browser = String(this.config.browser ?? 'chrome');
    if (this.config.watch) {
      return [
        ...common,
        { label: 'PAGE', message: 'Prepare HMR test page' },
        { label: 'BROWSER', message: `Ensure ${browser} is installed` },
        { label: 'PORT', message: 'Acquire test server port' },
        { label: 'SERVER', message: 'Start test server' },
        { label: 'HMR', message: 'Start HMR watcher' },
        { label: 'WS', message: 'Prepare real-time reporting' },
        { label: 'EXECUTE', message: `Open ${browser}` },
        { label: 'READY', message: 'Watching for changes' },
      ];
    }

    return [
      ...common,
      { label: 'PAGE', message: 'Prepare browser test page' },
      { label: 'BROWSER', message: `Ensure ${browser} is installed` },
      { label: 'PORT', message: 'Acquire test server port' },
      { label: 'SERVER', message: 'Start test server' },
      { label: 'EXECUTE', message: `Start ${browser} test session` },
    ];
  }

  private beginPreparation(): void {
    logger.preparationStart(
      this.config.headless ? RunnerMessages.startingHeadless() : RunnerMessages.startingServer(),
    );
    this.refreshPreparationPlan();
  }

  private refreshPreparationPlan(): void {
    logger.preparationContextLabel(this.preparationIdentity());
    logger.preparationPlan(this.preparationSteps());
  }

  private cleanOutputDirectory(): void {
    const outDir = path.resolve(this.config.outDir);
    const lockFilePath =
      this.config.lockFilePath
        ? path.resolve(this.config.lockFilePath)
        : null;

    if (!lockFilePath || path.dirname(lockFilePath) !== outDir) {
      fs.rmSync(outDir, { recursive: true, force: true });
      return;
    }

    const lockFileName = path.basename(lockFilePath);
    for (const entry of fs.readdirSync(outDir)) {
      if (entry === lockFileName) {
        continue;
      }

      fs.rmSync(path.join(outDir, entry), { recursive: true, force: true });
    }
  }

  private async prepareBrowser(): Promise<void> {
    if (this.config.browser === 'node') return;

    const browser = this.config.browser ?? 'chrome';
    logger.preparationStep('BROWSER', `Ensuring ${browser} is installed...`);
    this.preparedBrowserType = await this.browserManager.checkBrowser(browser);
    if (this.preparedBrowserType) {
      logger.preparationComplete('BROWSER');
    }
  }
  
  constructor(config: ViteJasmineConfig) {
    super();

    const configuredJasmineEnv = config.jasmineConfig?.env ?? {};
    const configuredSeed = (configuredJasmineEnv as any).seed;
    const randomSeed =
      configuredJasmineEnv.random === true &&
      (!Number.isFinite(configuredSeed) || Number(configuredSeed) === 0)
        ? Math.floor(1 + Math.random() * 0x7ffffffe)
        : configuredSeed;
    const jasmineConfig =
      randomSeed === configuredSeed
        ? config.jasmineConfig
        : {
            ...config.jasmineConfig,
            env: {
              ...configuredJasmineEnv,
              seed: randomSeed,
            },
          };

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
      browser: config.browser ?? 'chrome',
      port: config.port ?? 8888,
      headless: config.headless ?? false,
      watch: config.watch ?? false,
      jasmineConfig,
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
    this.coverageHost = new CoverageHost(
      !!this.config.coverage,
    );
    this.consoleReporter = new ConsoleReporter();
    this.nodeTestRunner = new NodeTestRunner(this.config, {
      reporter: this.consoleReporter,
      cwd: this.config.outDir,
      file: 'test-runner.mjs',
      coverage: this.config.coverage,
      suppressConsoleLogs: this.config.suppressConsoleLogs
    });
  }



  private describeConfiguredTestDirs(): string {
    const configured =
      Array.isArray(this.config.testDirs)
        ? this.config.testDirs
        : [this.config.testDirs];

    const relativeDirs =
      configured
        .filter((dir): dir is string => !!dir)
        .map((dir) => {
          const relative =
            norm(
              path.relative(
                process.cwd(),
                dir,
              ),
            );

          return relative.length > 0
            ? relative
            : '.';
        });

    return relativeDirs.length > 0
      ? relativeDirs.join(', ')
      : norm(
          path.relative(
            process.cwd(),
            this.primaryTestDir,
          ),
        ) || '.';
  }

  async preprocess(): Promise<PreprocessResult> {
    try {
      logger.preparationStep('DISCOVER', 'Discovering test files...');
      let { srcFiles, specFiles: discoveredSpecFiles } = await this.fileDiscovery.discoverSources();
      const normalizeSpecFile = (value: string) =>
        norm(value)
          .replace(/^\.\//, '')
          .replace(/\.(?:[cm]?[jt]sx?)$/i, '');
      const selectedFile = this.config.fileFilter
        ? normalizeSpecFile(this.config.fileFilter)
        : undefined;
      const selector = selectedFile ?? '';
      const matchesSelector = (file: string) => {
            const candidate = normalizeSpecFile(
              norm(path.relative(process.cwd(), file)),
            );
            return (
              candidate === selector ||
              candidate.endsWith('/' + selector) ||
              path.posix.basename(candidate) === path.posix.basename(selector)
            );
          };

      let specFiles = selectedFile
        ? discoveredSpecFiles.filter(matchesSelector)
        : discoveredSpecFiles;

      if (selectedFile && specFiles.length === 0 && this.config.browser !== 'node') {
        const { specFiles: allSpecFiles } = await this.fileDiscovery.discoverAllSources();
        const nodeOnlyMatches = allSpecFiles.filter(matchesSelector);

        if (nodeOnlyMatches.length > 0) {
          // The requested spec belongs to the Node host graph. Switch the
          // isolated run to the Node pipeline instead of handing its imports
          // to Vite's browser resolver.
          this.config.browser = 'node';
          this.config.headless = true;
          this.refreshPreparationPlan();
          ({ srcFiles, specFiles: discoveredSpecFiles } = await this.fileDiscovery.discoverSources());
          specFiles = discoveredSpecFiles.filter(matchesSelector);
        }
      }

      if (specFiles.length === 0) {
        logger.preparationStep(
          'DISCOVER',
          RunnerMessages.noTestFilesFound(
            this.describeConfiguredTestDirs(),
          ),
          true,
        );
        return 'no-specs';
      }

      logger.preparationStep(
        'DISCOVER',
        RunnerMessages.discoveringTestFiles(specFiles.length, srcFiles.length),
        true,
      );

      const entryFiles = [...srcFiles, ...specFiles];
      const selectedSpecArtifacts = specFiles.map((file) =>
        this.fileDiscovery.getOutputName(file),
      );
      logger.preparationStep(
        'CONFIG',
        RunnerMessages.preparingBuildConfiguration(),
      );
      const viteConfig = this.viteConfigBuilder.createViteConfig(entryFiles);
      logger.preparationComplete('CONFIG');
      if (this.shouldPreserve()) logger.preparationStep('OUTPUT', 'Preserving existing output', true);
      const input: Record<string, string> = {};
 
      const entryKeyFromOutput = (
        file: string,
      ) =>
        this.fileDiscovery
          .getOutputName(
            file,
          )
          .replace(
            /\.mjs$/,
            '',
          );

      for (const file of entryFiles) {
        input[entryKeyFromOutput(file)] = file;
      }

      if (fs.existsSync(this.config.outDir) && !this.shouldPreserve()) {
        logger.preparationStep('OUTPUT', RunnerMessages.cleaningOutputDirectory());
        this.cleanOutputDirectory();
        logger.preparationComplete('OUTPUT');
      }

      if (!fs.existsSync(this.config.outDir)) {
        fs.mkdirSync(this.config.outDir, { recursive: true });
        logger.preparationStep('OUTPUT', 'Created output directory', true);
      }

      viteConfig.build!.rolldownOptions!.input = input;

      logger.preparationStep('BUILD', RunnerMessages.buildingFiles(Object.keys(input).length));
      this.viteCache = await viteBuild(viteConfig);
      logger.preparationComplete('BUILD');

      const moduleFiles =
        (
          await glob(
            path
              .join(
                this.config.outDir,
                '**/*.mjs',
              )
              .replace(
                /\\/g,
                '/',
              ),
          )
        ).filter(
          (file) =>
            !/\.spec\.mjs$/i.test(
              file,
            ),
        );

      if (moduleFiles.length > 0) {
        logger.preparationStep(
          'INSTRUMENT',
          RunnerMessages.instrumentingModules(moduleFiles.length),
        );
      }

      for (
        const moduleFile of
        moduleFiles
      ) {
        const result =
          await this.instrumenter
            .instrumentFile(
              moduleFile,
            );

        const outFile =
          path.join(
            this.config.outDir,
            path.relative(
              this.config.outDir,
              moduleFile,
            ),
          );
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, result.code, 'utf-8');
        
        // Update source map if it was modified during instrumentation
        if (result.sourceMap) {
          const mapFile = outFile + '.map';
          fs.writeFileSync(mapFile, JSON.stringify(result.sourceMap, null, 2), 'utf-8');
        }
      }

      if (moduleFiles.length > 0) logger.preparationComplete('INSTRUMENT');

      const htmlPath = path.join(this.config.outDir, 'index.html');
      const preserveHtml = this.shouldPreserve() && fs.existsSync(htmlPath);
      if (!(this.config.headless && this.config.browser === 'node') && !preserveHtml) {
        logger.preparationStep('PAGE', 'Generating browser test page...');
        if (this.config.watch) {
          await this.htmlGenerator.generateHtmlFileWithHmr();
        } else {
          await this.htmlGenerator.generateHtmlFile(selectedSpecArtifacts);
        }
        logger.preparationStep(
          'PAGE',
          this.config.watch
            ? RunnerMessages.generatedHmrTestPage()
            : RunnerMessages.generatedTestPage(),
          true,
        );
      } else if (preserveHtml) {
        logger.preparationStep('PAGE', RunnerMessages.preservingExistingHtml(), true);
      }

      const runnerPath = path.join(this.config.outDir, 'test-runner.mjs');
      const preserveRunner = this.shouldPreserve() && fs.existsSync(runnerPath);
      if (this.config.headless && this.config.browser === 'node' && !preserveRunner) {
        logger.preparationStep('RUNNER', 'Generating in-process test runner...');
        this.nodeTestRunner.generateTestRunner();
        logger.preparationComplete('RUNNER');
      } else if (this.config.headless && this.config.browser === 'node' && preserveRunner) {
        logger.preparationStep('RUNNER', RunnerMessages.preservingExistingRunner(), true);
      }

      return 'built';
    } catch (error) {
      logger.error(RunnerMessages.preprocessFailed(error));
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    this.cleanupPromise ??= (async () => {
      // A failed close must not prevent the other resources from closing.
      const results = await Promise.allSettled([
        this.webSocketManager ? undefined : this.hmrManager?.stop(),
        this.webSocketManager?.cleanup(),
        this.browserManager.closeBrowser(),
      ]);
      this.hmrManager = null;
      this.webSocketManager = null;
      results.push(...await Promise.allSettled([this.httpServerManager.cleanup()]));
      const failures = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected');
      if (failures.length) throw new AggregateError(failures.map(result => result.reason), 'Test runner cleanup failed');
    })();
    return this.cleanupPromise;
  }

  abort(message?: string): number {
    this.aborting = true;
    this.abortExitCode = message === 'SIGTERM' ? EXIT_CODES.SIGTERM : EXIT_CODES.SIGINT;
    // Signal the browser manager to stop any running browser immediately.
    // Node-runner mode has no cooperative cancel; it will exit via the
    // CLI's process.exit() after cleanup.
    this.browserManager.abort((message ?? 'SIGINT') as NodeJS.Signals);
    const exitCode = this.consoleReporter.hasCompletedRun()
      ? (message === 'SIGTERM' ? EXIT_CODES.SIGTERM : EXIT_CODES.SIGINT)
      : this.consoleReporter.testsAborted(message);
    // Programmatic abort must also release callers awaiting watch()/start();
    // the CLI path process.exit()s, but embedders would hang otherwise.
    this.finishResolve?.(exitCode);
    this.finishResolve = null;
    return exitCode;
  }

  async start(): Promise<number> {
    // `start()` is intentionally one-shot. Watch/HMR has its own explicit
    // entrypoint (`watch()`), used by the CLI only when --watch is present.
    if (this.started) {
      throw new ExitCodeError(
        EXIT_CODES.INVALID_USAGE,
        'ViteJasmineRunner.start()/watch() was already called; create a new runner for another run.',
      );
    }
    this.started = true;
    this.config.watch = false;

    this.beginPreparation();

    try {
      const preprocessResult = await this.preprocess();
      this.assertActive();
      if (preprocessResult === 'no-specs') {
        logger.flushPreparation();
        return EXIT_CODES.SUCCESS;
      }
      await this.prepareBrowser();
      this.assertActive();
    } catch (error) {
      // preprocess() logs its failure into the card with step attribution;
      // re-logging here would render the same error twice. Only wrap it.
      // Discovery/build/config failures are user-fixable inputs, so they map
      // to CONFIG_ERROR; INTERNAL_ERROR stays reserved for Testify defects.
      throw error instanceof ExitCodeError
        ? error
        : new ExitCodeError(EXIT_CODES.CONFIG_ERROR, String(error), { cause: error });
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
    if (this.started) {
      throw new ExitCodeError(
        EXIT_CODES.INVALID_USAGE,
        'ViteJasmineRunner.start()/watch() was already called; create a new runner for another run.',
      );
    }
    if (this.config.headless || this.config.browser === 'node') {
      logger.error(RunnerMessages.watchOnlyHeaded());
      return EXIT_CODES.CONFIG_ERROR;
    }
    this.started = true;

    this.config.watch = true;
    this.beginPreparation();
    try {
      const preprocessResult = await this.preprocess();
      this.assertActive();
      if (preprocessResult === 'no-specs') {
        logger.flushPreparation();
        return EXIT_CODES.SUCCESS;
      }
      await this.prepareBrowser();
      this.assertActive();
    } catch (error) {
      throw error instanceof ExitCodeError
        ? error
        : new ExitCodeError(EXIT_CODES.CONFIG_ERROR, String(error), { cause: error });
    }
    return await this.runWatchMode();
  }

  private async runWatchMode(): Promise<number> {
    logger.preparationStep('SERVER', 'Starting test server...');
    const server = await this.httpServerManager.startServer();
    this.assertActive();
    logger.preparationStep('SERVER', RunnerMessages.testServerRunning(this.config.port!), true);

    logger.preparationStep('HMR', RunnerMessages.startingHmrWatcher());

    this.webSocketManager = new WebSocketManager(this.fileDiscovery, this.config, server, this.consoleReporter);
    this.hmrManager = new HmrManager(this.fileDiscovery, this.config, this.viteConfigBuilder, this.viteCache);

    this.webSocketManager.enableHmr(this.hmrManager);
    await this.hmrManager.start();
    this.assertActive();
    logger.preparationComplete('HMR');

    logger.preparationStep('WS', RunnerMessages.webSocketReady(), true);
    logger.preparationStep('EXECUTE', RunnerMessages.startingBrowserTestSession());
    logger.preparationStep('READY', RunnerMessages.pressCtrlCToStop(), true);
    logger.flushPreparation();

    let shuttingDown = false;
    const watchFinishedPromise = new Promise<number>((resolve) => {
      this.finishResolve = resolve;
    });

    const shutdown = async (source: 'browser' | 'session') => {
      if (shuttingDown) return;
      shuttingDown = true;

      if (this.aborting) {
        // Ctrl+C already owns the terminal shutdown sequence.
      } else if (source === 'session') {
        logger.println(RunnerMessages.sessionExitRequested());
        await this.browserManager.closeBrowser();
      } else {
        logger.println(RunnerMessages.browserWindowClosed());
      }

      await this.cleanup();
      this.finishResolve?.(EXIT_CODES.SUCCESS);
      this.finishResolve = null;
    };

    this.webSocketManager.on(
      'sessionExitRequested',
      () => {
        shutdown('session').catch((error) => {
          logger.error(RunnerMessages.sessionExitCleanupFailed(error));
          this.finishResolve?.(EXIT_CODES.INTERNAL_ERROR);
          this.finishResolve = null;
        });
      },
    );

    const onBrowserClose = async () => {
      await shutdown('browser').catch((error) => {
        logger.error(RunnerMessages.sessionExitCleanupFailed(error));
        this.finishResolve?.(EXIT_CODES.INTERNAL_ERROR);
        this.finishResolve = null;
      });
    };

    try {
      await this.browserManager.openBrowser(
        this.config.port!,
        onBrowserClose,
        { exitOnClose: false },
      );
    } catch (error) {
      // BrowserManager owns launch diagnostics. The runner owns propagation and
      // cleanup only, otherwise the same Playwright failure is rendered twice.
      await this.cleanup();
      if (this.aborting) return this.abortExitCode;
      if (error instanceof ExitCodeError) return error.exitCode;
      return EXIT_CODES.INTERNAL_ERROR;
    }

    // Keep the runner alive until an explicit shutdown signal or browser close.
    return watchFinishedPromise;
  }

  private async runHeadlessBrowserMode(): Promise<number> {
    logger.preparationStep('SERVER', 'Starting test server...');
    const server = await this.httpServerManager.startServer();
    this.assertActive();
    await this.httpServerManager.waitForServerReady(`http://localhost:${this.config.port}/index.html`, 10000);
    logger.preparationStep('SERVER', RunnerMessages.testServerRunning(this.config.port!), true);
    this.webSocketManager = new WebSocketManager(this.fileDiscovery, this.config, server, this.consoleReporter);

    let testSuccess = false;
    let coveragePromise: Promise<void> | undefined;
    let testsCompletedResolve: (() => void) | null = null;
    const testsCompletedPromise = new Promise<void>((resolve) => {
      testsCompletedResolve = resolve;
    });
    this.webSocketManager.on('testsCompleted', ({ success, coverage }) => {
      testSuccess = success;
      coveragePromise =
        this.coverageHost.generate(
          coverage,
        ).catch((error) => {
          logger.error(RunnerMessages.coverageGenerationFailed(error));
        });
      testsCompletedResolve?.();
    });

    const browserType = this.preparedBrowserType ?? await this.browserManager.checkBrowser(this.config.browser!);

    if (!browserType) {
      logger.warn(RunnerMessages.headlessBrowserUnavailable());
      this.config.browser = 'node';
      this.config.headless = true;
      this.refreshPreparationPlan();
      logger.preparationStep('RUNNER', 'Generating in-process test runner...');
      this.nodeTestRunner.generateTestRunner();
      logger.preparationComplete('RUNNER');

      try {
        const result =
          await runNodeCli(this.nodeTestRunner, { handleSignals: false, setProcessExitCode: false });

        return getExecutionExitCode(
          result,
        );
      } catch (error) {
        // NodeTestRunner.start() logs its own failure with the stack; owning
        // the exit code here keeps the CLI backstop from rendering the same
        // error a second time. Cleanup runs in the finally below.
        if (error instanceof ExitCodeError) return error.exitCode;
        return EXIT_CODES.INTERNAL_ERROR;
      } finally {
        await this.cleanup();
      }
    }

    try {
      logger.preparationStep('EXECUTE', RunnerMessages.startingBrowserTestSession());
      logger.flushPreparation();
      await this.browserManager.runHeadlessBrowserTests(browserType, this.config.port!);
      // Wait for the jasmineDone WebSocket message to be processed so the final
      // summary is printed before we tear down the WebSocket server and exit.
      let completionTimedOut = false;
      let completionTimeout: NodeJS.Timeout | undefined;
      const testsCompletedTimeout = new Promise<void>((_, reject) => {
        completionTimeout = setTimeout(() => {
          completionTimedOut = true;
          reject(new Error('Timed out waiting for test completion message'));
        }, 5000);
      });
      try {
        await Promise.race([testsCompletedPromise, testsCompletedTimeout]).catch((error) => {
          logger.error(RunnerMessages.testsCompletedTimeout(error.message));
        });
      } finally {
        clearTimeout(completionTimeout);
      }
      // An infrastructure timeout (the bridge died before reporting
      // jasmineDone) is not a test failure: report it as an internal error
      // instead of a red run with zero failing specs.
      if (completionTimedOut) {
        await this.cleanup();
        return EXIT_CODES.INTERNAL_ERROR;
      }
      if (coveragePromise) await coveragePromise.catch((error) => {
        logger.error(RunnerMessages.coverageGenerationFailed(error));
      });
      await this.cleanup();
      if (!testSuccess) {
        return EXIT_CODES.TEST_FAILURES;
      }
      return EXIT_CODES.SUCCESS;
    } catch (error) {
      if (error instanceof ExitCodeError) {
        if (coveragePromise) await coveragePromise.catch((error) => { logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`); });
        await this.cleanup();
        return error.exitCode;
      }
      logger.error(RunnerMessages.browserTestExecutionFailed(error));
      if (coveragePromise) await coveragePromise.catch((error) => { logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`); });
      await this.cleanup();
      return EXIT_CODES.INTERNAL_ERROR;
    }
  }

  private async runHeadlessNodeMode(): Promise<number> {
    try {
      const result =
        await runNodeCli(this.nodeTestRunner, { handleSignals: false, setProcessExitCode: false });

      return getExecutionExitCode(
        result,
      );
    } catch (error) {
      // NodeTestRunner.start() already logged the execution error with its
      // stack; swallowing here keeps the CLI backstop from re-rendering it.
      if (error instanceof ExitCodeError) return error.exitCode;
      return EXIT_CODES.INTERNAL_ERROR;
    }
  }

  private async runHeadedBrowserMode(): Promise<number> {
    logger.preparationStep('SERVER', 'Starting test server...');
    const server = await this.httpServerManager.startServer();
    this.assertActive();
    logger.preparationStep('SERVER', RunnerMessages.testServerRunning(this.config.port!), true);
    let testsCompleted = false;
    let testSuccess = false;
    let finishHeadedRunPromise: Promise<void> | undefined;
    this.webSocketManager = new WebSocketManager(this.fileDiscovery, this.config, server, this.consoleReporter);

    const finishHeadedRun = async (coverage: Record<string, any> | undefined): Promise<void> => {
      await this.coverageHost.generate(
        coverage,
      ).catch((error) => {
        logger.error(RunnerMessages.coverageGenerationFailed(error));
      });
      await this.browserManager.closeBrowser();
    };

    this.webSocketManager.on('testsCompleted', ({ success, coverage }) => {
      if (testsCompleted) {
        return;
      }
      testsCompleted = true;
      testSuccess = success;
      finishHeadedRunPromise = finishHeadedRun(coverage).catch((error) => {
        logger.error(RunnerMessages.finishHeadedRunFailed(error));
      });
    });

    const runFinishedPromise = new Promise<number>((resolve) => {
      this.finishResolve = resolve;
    });
    const resolveRun = (code: number) => {
      this.finishResolve?.(code);
      this.finishResolve = null;
    };

    const onBrowserClose = async () => {
      try {
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
          await finishHeadedRunPromise.catch((error) => { logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`); });
        }
        await this.cleanup();
        if (!testsCompleted) {
          resolveRun(EXIT_CODES.SIGINT);
          return;
        }
        if (!testSuccess) {
          resolveRun(EXIT_CODES.TEST_FAILURES);
          return;
        }
        resolveRun(EXIT_CODES.SUCCESS);
      } catch (error) {
        logger.error(RunnerMessages.sessionExitCleanupFailed(error));
        resolveRun(EXIT_CODES.INTERNAL_ERROR);
      }
    };

    try {
      logger.preparationStep('EXECUTE', RunnerMessages.startingBrowserTestSession());
      logger.flushPreparation();
      await this.browserManager.openBrowser(
        this.config.port!,
        onBrowserClose,
      );
    } catch (error) {
      // BrowserManager owns launch diagnostics. The runner owns propagation and
      // cleanup only, otherwise the same Playwright failure is rendered twice.
      await this.cleanup();
      if (this.aborting) return this.abortExitCode;
      if (error instanceof ExitCodeError) return error.exitCode;
      return EXIT_CODES.INTERNAL_ERROR;
    }

    // Keep the runner alive until the browser closes or an explicit shutdown signal.
    return runFinishedPromise;
  }
}
