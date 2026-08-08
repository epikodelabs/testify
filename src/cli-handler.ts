import * as fs from "fs";
import * as path from "path";
import { ConfigManager } from "./config-manager";
import { logger } from './logger';
import { PackageResolver } from "./package-resolver";
import { ProcessLock } from "./process-lock";
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { ViteJasmineRunner } from "./vite-jasmine-runner";
import { EXIT_CODES, ExitCodeError, getExitCode } from "./exit-codes";
import { CLIMessages } from "./log-messages";
import { setAnsiMode } from "./symbols";
import { ProjectSetup } from "./project-setup";

export function createViteJasmineRunner(config: ViteJasmineConfig): ViteJasmineRunner {
  return new ViteJasmineRunner(config);
}

export class CLIHandler {
  private static runner: ViteJasmineRunner | null = null;

  static async cleanup(): Promise<void> {
    if (this.runner) {
      await this.runner.cleanup();
      this.runner = null;
    }
  }

  static async run(): Promise<number> {
    let shuttingDown = false;
    let sigintCount = 0;
    process.on('SIGINT', async () => {
      sigintCount += 1;
      if (sigintCount > 1) {
        // Second Ctrl+C: cleanup is hung or too slow, force exit now.
        process.exit(EXIT_CODES.SIGINT);
        return;
      }
      if (shuttingDown) return;
      shuttingDown = true;

      const exitCode = this.runner?.abort('SIGINT') ?? EXIT_CODES.SIGINT;
      try {
        await Promise.race([
          this.cleanup(),
          new Promise<void>((_, reject) => setTimeout(() => reject(new Error('cleanup timeout')), 5000))
        ]);
      } catch {
        // Cleanup timed out or failed; force exit anyway.
      }
      process.exit(exitCode);
    });

    const args = process.argv.slice(2);
    const helpRequested = args.includes('--help') || args.includes('-h');

    if (helpRequested) {
      this.printHelp();
      return EXIT_CODES.SUCCESS;
    }

    const initOnly = args.includes('init');
    const watch = args.includes('--watch');
    const headless = args.includes('--headless');
    const coverage = args.includes('--coverage');
    const exclusive = args.includes('--exclusive');
    const browserIndex = args.findIndex((a) => a === '--browser');
    const ansiFlag = args.includes('--ansi');
    const seedIndex = args.findIndex((a) => a === '--seed');
    const projectIndex = args.findIndex((a) => a === '--project');
    const portIndex = args.findIndex((a) => a === '--port');
    const silentLogs = args.includes('--silent') || args.includes('--quiet');
    const hasBrowserArg = browserIndex !== -1;
    const hasProjectArg = projectIndex !== -1;
    let browserName = 'chrome';
    let seedValue: number | undefined;
    let projectValue: string | undefined;
    let portValue: number | undefined;

    if (seedIndex !== -1) {
      const raw = args[seedIndex + 1];
      const parsed = raw !== undefined && raw !== '' ? Number(raw) : NaN;
      if (!Number.isFinite(parsed)) {
        logger.error(CLIMessages.invalidSeed());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid seed value');
      }
      seedValue = parsed;
    }

    if (hasBrowserArg) {
      if (browserIndex + 1 < args.length && !args[browserIndex + 1].startsWith('-')) {
        browserName = args[browserIndex + 1];
      } else {
        logger.error(CLIMessages.browserArgMissing());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Missing browser argument');
      }
    }

    if (hasProjectArg && projectIndex + 1 < args.length) {
      projectValue = args[projectIndex + 1];
    } else if (hasProjectArg) {
      logger.error(CLIMessages.projectArgMissing());
      throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Missing project argument');
    }

    const hasPortArg = portIndex !== -1;
    if (hasPortArg) {
      if (portIndex + 1 < args.length && !args[portIndex + 1].startsWith('-')) {
        const parsed = Number(args[portIndex + 1]);
        if (!Number.isFinite(parsed) || parsed < 1 || parsed > 65535 || !Number.isInteger(parsed)) {
          logger.error(CLIMessages.invalidPort());
          throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid port value');
        }
        portValue = parsed;
      } else {
        logger.error(CLIMessages.portArgMissing());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Missing port argument');
      }
    }

    const preserveOutputsFlag = args.includes('--preserve');
    const preserveOutputsArg = preserveOutputsFlag ? true : undefined;

    if (initOnly) {
      try {
        ConfigManager.initViteJasmineConfig();
        ProjectSetup.configure(process.cwd());
        return EXIT_CODES.SUCCESS;
      } catch (error) {
        logger.error(CLIMessages.failedToInitializeProject(error));
        return getExitCode(error);
      }
    }

    if (watch) {
      const invalidFlags: string[] = [];
      if (headless) invalidFlags.push('--headless');
      if (coverage) invalidFlags.push('--coverage');
      if (browserName === 'node') invalidFlags.push('--browser node');

      if (invalidFlags.length > 0) {
        logger.error(CLIMessages.watchIncompatibleFlags(invalidFlags));
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, `Incompatible watch flags: ${invalidFlags.join(', ')}`);
      }
    }

    try {
      const normalizeDirConfig = (
        dirConfig: string | string[] | undefined,
        fallback: string,
      ): string[] => {
        if (!dirConfig) return [fallback];
        if (Array.isArray(dirConfig)) {
          return dirConfig.length > 0 ? dirConfig : [fallback];
        }
        return [dirConfig];
      };

      let config = ConfigManager.loadViteJasmineBrowserConfig('testify.json');

      if (projectValue) {
        const resolver = new PackageResolver();
        const resolved = await resolver.resolve(projectValue, config.tsconfig);
        if (resolved) {
          projectValue = resolved;
          if (!config.tsconfig) {
            const projectTsconfig = this.findProjectTsconfig(projectValue);
            if (projectTsconfig) {
              config = {
                ...config,
                tsconfig: projectTsconfig,
              };
            }
          }
        } else {
          logger.error(CLIMessages.couldNotResolveProject(projectValue));
          throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, `Could not resolve project: ${projectValue}`);
        }
      }

      if (ansiFlag) {
        setAnsiMode();
      }

      config = {
        ...config,
        headless:
          headless ||
          browserName === 'node'
            ? true
            : watch
              ? false
              : (config.headless || false),
        coverage: coverage ? true : (config.coverage || false),
        browser: hasBrowserArg ? browserName : (config.browser || 'chrome'),
        // CLI contract: plain `testify` always performs a one-shot run.
        // Watch/HMR is opt-in through `--watch`; a stale `watch` value in
        // testify.json must not change the default CLI behavior.
        watch,
        suppressConsoleLogs: silentLogs ? true : config.suppressConsoleLogs,
        srcDirs: normalizeDirConfig(config.srcDirs, './src'),
        testDirs: normalizeDirConfig(config.testDirs, './tests'),
        preserveOutputs: preserveOutputsArg ?? !!config.preserveOutputs,
        project: projectValue ?? config.project,
        port: portValue ?? config.port,
        ansi: ansiFlag ? true : config.ansi,
      };

      if (config.ansi) {
        setAnsiMode();
      }

      if (seedValue !== undefined) {
        const env = config.jasmineConfig?.env ?? {};
        config.jasmineConfig = {
          ...config.jasmineConfig,
          env: {
            ...env,
            seed: seedValue,
          },
        };
      }

      if (config.preserveOutputs) {
        logger.println(CLIMessages.preserveOutputsEnabled());
      }

      const lock = new ProcessLock(config.project, config.port ?? 8888);
      await lock.acquire(exclusive);
      process.on('exit', () => lock.releaseSync());

      const runner = createViteJasmineRunner(config);
      this.runner = runner;

      const exitCode = watch ? await runner.watch() : await runner.start();

      lock.releaseSync();
      return exitCode;
    } catch (error) {
      logger.error(CLIMessages.failedToStartTestRunner(error));
      return getExitCode(error);
    }
  }

  private static printHelp(): void {
    for (const line of CLIMessages.helpLines()) {
      logger.println(line);
    }
  }

  private static findProjectTsconfig(projectDir: string): string | undefined {
    const candidates = [
      'tsconfig.spec.json',
      'tsconfig.test.json',
      'tsconfig.jasmine.json',
      'tsconfig.json',
      'tsconfig.lib.json',
      'tsconfig.app.json',
    ];

    for (const candidate of candidates) {
      const candidatePath = path.join(projectDir, candidate);
      if (fs.existsSync(candidatePath)) {
        return candidatePath;
      }
    }

    return undefined;
  }
}
