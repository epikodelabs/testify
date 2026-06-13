import * as fs from "fs";
import { ConfigManager } from "./config-manager";
import { logger } from './logger';
import { PackageResolver } from "./package-resolver";
import { ProcessLock } from "./process-lock";
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { ViteJasmineRunner } from "./vite-jasmine-runner";
import { EXIT_CODES, getExitCode } from "./exit-codes";
import { CLIMessages } from "./log-messages";
import { setAnsiMode } from "./symbols";

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

  static async run(): Promise<void> {
    process.on('SIGINT', async () => {
      await this.cleanup();
      process.exit(EXIT_CODES.SIGINT);
    });

    const args = process.argv.slice(2);
    const helpRequested = args.includes('--help') || args.includes('-h');

    if (helpRequested) {
      this.printHelp();
      return;
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
    const silentLogs = args.includes('--silent') || args.includes('--quiet');
    const hasBrowserArg = browserIndex !== -1;
    const hasProjectArg = projectIndex !== -1;
    let browserName = 'chrome';
    let seedValue: number | undefined;
    let projectValue: string | undefined;

    if (seedIndex !== -1) {
      const raw = args[seedIndex + 1];
      const parsed = raw !== undefined && raw !== '' ? Number(raw) : NaN;
      if (!Number.isFinite(parsed)) {
        logger.error(CLIMessages.invalidSeed());
        process.exit(EXIT_CODES.INVALID_USAGE);
      }
      seedValue = parsed;
    }

    if (hasBrowserArg) {
      if (browserIndex + 1 < args.length && !args[browserIndex + 1].startsWith('-')) {
        browserName = args[browserIndex + 1];
      } else {
        logger.error(CLIMessages.browserArgMissing());
        process.exit(EXIT_CODES.INVALID_USAGE);
      }
    }

    if (hasProjectArg && projectIndex + 1 < args.length) {
      projectValue = args[projectIndex + 1];
    } else if (hasProjectArg) {
      logger.error(CLIMessages.projectArgMissing());
      process.exit(EXIT_CODES.INVALID_USAGE);
    }

    const preserveOutputsFlag = args.includes('--preserve');
    const preserveOutputsArg = preserveOutputsFlag ? true : undefined;

    if (initOnly) {
      ConfigManager.initViteJasmineConfig();
      return;
    }

    if (watch) {
      const invalidFlags: string[] = [];
      if (headless) invalidFlags.push('--headless');
      if (coverage) invalidFlags.push('--coverage');
      if (browserName === 'node') invalidFlags.push('--browser node');

      if (invalidFlags.length > 0) {
        logger.error(CLIMessages.watchIncompatibleFlags(invalidFlags));
        process.exit(EXIT_CODES.INVALID_USAGE);
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
        } else {
          logger.error(CLIMessages.couldNotResolveProject(projectValue));
          process.exit(EXIT_CODES.INVALID_USAGE);
        }
      }

      if (ansiFlag) {
        setAnsiMode();
      }

      config = {
        ...config,
        headless: headless || browserName === 'node' ? true : (config.headless || false),
        coverage: coverage ? true : (config.coverage || false),
        browser: hasBrowserArg ? browserName : (config.browser || 'chrome'),
        watch: watch ? true : (config.watch || false),
        suppressConsoleLogs: silentLogs ? true : config.suppressConsoleLogs,
        srcDirs: normalizeDirConfig(config.srcDirs, './src'),
        testDirs: normalizeDirConfig(config.testDirs, './tests'),
        preserveOutputs: preserveOutputsArg ?? !!config.preserveOutputs,
        project: projectValue ?? config.project,
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

      if (watch) {
        await runner.watch();
      } else {
        await runner.start();
      }

      lock.releaseSync();
    } catch (error) {
      logger.error(CLIMessages.failedToStartTestRunner(error));
      process.exit(getExitCode(error));
    }
  }

  private static printHelp(): void {
    for (const line of CLIMessages.helpLines()) {
      logger.println(line);
    }
  }
}
