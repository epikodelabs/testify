import * as fs from "fs";
import * as path from "path";
import { Command, CommanderError } from 'commander';
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

// Keep runtime construction replaceable for tests. ESM namespace exports are
// read-only, so Jasmine cannot safely spy on `createViteJasmineRunner` itself.
export const cliDependencies = {
  createViteJasmineRunner,
};

// ─── argv parsing ───────────────────────────────────────────────────────────
// Commander defines the public command contract in one place. Validation that
// depends on multiple flags remains below, close to the runner configuration.

interface ParsedCli {
  helpRequested: boolean;
  versionRequested: boolean;
  initOnly: boolean;
  watch: boolean;
  headless: boolean;
  coverage: boolean;
  exclusive: boolean;
  ansiFlag: boolean;
  silentLogs: boolean;
  preserveOutputsFlag: boolean;
  hasBrowserArg: boolean;
  hasProjectArg: boolean;
  browserName: string;
  seedValue?: number;
  projectValue?: string;
  portValue?: number;
  configFileName: string;
  bail: boolean;
  randomValue?: boolean;
  timeoutValue?: number;
  fileValue?: string;
  suiteValue?: string;
}

/**
 * Reads a flag that requires a string value (e.g. `--browser chrome`).
 * Returns `undefined` when the flag was not passed at all, and throws an
 * ExitCodeError (with the supplied message) when the flag was passed but no
 * usable value followed it -- either because it was the last token, or
 * because the next token was itself another flag.
 */
function requireStringValue(value: string | boolean | undefined, missingMessage: () => string): string | undefined {
  if (value === undefined) return undefined;
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (normalized.length === 0 || normalized.startsWith('-')) {
    logger.error(missingMessage());
    throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, missingMessage());
  }
  return normalized;
}

export class CLIHandler {
  private static runner: ViteJasmineRunner | null = null;

  static async cleanup(): Promise<void> {
    if (this.runner) {
      await this.runner.cleanup();
      this.runner = null;
    }
  }

  private static parseCliArgs(argv: string[]): ParsedCli {
    const program = new Command()
      .name('testify')
      .helpOption(false)
      .allowUnknownOption(false)
      .option('-h, --help')
      .option('-v, --version')
      .option('-w, --watch')
      .option('--headless')
      .option('-c, --coverage')
      .option('--exclusive')
      .option('-b, --browser <name>')
      .option('--ansi')
      .option('--seed <number>')
      .option('-p, --project <name>')
      .option('--port <number>')
      .option('--silent')
      .option('-q, --quiet')
      .option('--preserve')
      .option('--config <path>')
      .option('--bail')
      .option('--random')
      .option('--no-random')
      .option('--timeout <ms>')
      .option('-f, --file <file>')
      .option('-s, --suite <name>')
      .exitOverride()
      .configureOutput({
        // CLIHandler owns diagnostics so its error format stays consistent.
        writeOut: () => undefined,
        writeErr: () => undefined,
      });

    try {
      program.parse(argv, { from: 'user' });
    } catch (error) {
      const detail = error instanceof CommanderError ? error.message : String(error);
      logger.error(CLIMessages.invalidArguments(detail));
      throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid command line arguments');
    }

    const v = program.opts<Record<string, string | boolean | undefined>>();
    const positionals = program.args as string[];

    const hasBrowserArg = v.browser !== undefined;
    const browserRaw = requireStringValue(v.browser, CLIMessages.browserArgMissing);
    const browserName = browserRaw ?? 'chrome';

    const hasProjectArg = v.project !== undefined;
    const projectValue = requireStringValue(v.project, CLIMessages.projectArgMissing);

    const configFileName = requireStringValue(v.config, CLIMessages.configArgMissing) ?? 'testify.json';
    const fileValue = requireStringValue(v.file, CLIMessages.fileArgMissing);
    const suiteValue = requireStringValue(v.suite, CLIMessages.suiteArgMissing);

    const unknownPositionals = positionals.filter((value) => value !== 'init');
    if (unknownPositionals.length > 0 || positionals.filter((value) => value === 'init').length > 1) {
      logger.error(CLIMessages.unknownCommand(unknownPositionals[0] ?? 'init'));
      throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Unknown command');
    }

    const seedRaw = requireStringValue(v.seed, CLIMessages.invalidSeed);
    let seedValue: number | undefined;
    if (seedRaw !== undefined) {
      const parsed = Number(seedRaw);
      if (!Number.isFinite(parsed)) {
        logger.error(CLIMessages.invalidSeed());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid seed value');
      }
      seedValue = parsed;
    }

    const portRaw = requireStringValue(v.port, CLIMessages.portArgMissing);
    let portValue: number | undefined;
    if (portRaw !== undefined) {
      const parsed = Number(portRaw);
      if (!Number.isFinite(parsed) || parsed < 1 || parsed > 65535 || !Number.isInteger(parsed)) {
        logger.error(CLIMessages.invalidPort());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid port value');
      }
      portValue = parsed;
    }

    const timeoutRaw = requireStringValue(v.timeout, CLIMessages.timeoutArgMissing);
    let timeoutValue: number | undefined;
    if (timeoutRaw !== undefined) {
      const parsed = Number(timeoutRaw);
      if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
        logger.error(CLIMessages.invalidTimeout());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid timeout value');
      }
      timeoutValue = parsed;
    }

    // `--no-random` is declared as commander's negation of `--random`, so an
    // unset flag pair leaves `random` undefined; only a value set from the
    // command line should override the config file.
    const randomSource = program.getOptionValueSource('random');
    const randomValue = randomSource === 'cli' ? v.random === true : undefined;

    return {
      helpRequested: v.help === true,
      versionRequested: v.version === true,
      initOnly: positionals.includes('init'),
      watch: v.watch === true,
      headless: v.headless === true,
      coverage: v.coverage === true,
      exclusive: v.exclusive === true,
      ansiFlag: v.ansi === true,
      silentLogs: v.silent === true || v.quiet === true,
      preserveOutputsFlag: v.preserve === true,
      hasBrowserArg,
      hasProjectArg,
      browserName,
      seedValue,
      projectValue,
      portValue,
      configFileName,
      bail: v.bail === true,
      randomValue,
      timeoutValue,
      fileValue,
      suiteValue,
    };
  }

  private static printVersion(): void {
    const packageFiles = [
      new URL('../package.json', import.meta.url),
      new URL('../../package.json', import.meta.url),
    ];
    const packageFile =
      packageFiles.find((candidate) =>
        fs.existsSync(candidate),
      );

    if (!packageFile) {
      logger.printlnRaw('testify (version unknown)');
      return;
    }

    try {
      const pkg = JSON.parse(
        fs.readFileSync(
          packageFile,
          'utf8',
        ),
      );
      logger.printlnRaw(`testify ${pkg.version}`);
    } catch (error) {
      logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`);
      logger.printlnRaw('testify (version unknown)');
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
      } catch (error) {
        logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`);
        // Cleanup timed out or failed; force exit anyway.
      }
      process.exit(exitCode);
    });

    const rawArgs = process.argv.slice(2);

    let parsed: ParsedCli;
    try {
      parsed = this.parseCliArgs(rawArgs);
    } catch (error) {
      return getExitCode(error);
    }

    if (parsed.helpRequested) {
      this.printHelp();
      return EXIT_CODES.SUCCESS;
    }

    if (parsed.versionRequested) {
      this.printVersion();
      return EXIT_CODES.SUCCESS;
    }

    const {
      initOnly,
      watch,
      headless,
      coverage,
      exclusive,
      browserName,
      ansiFlag,
      seedValue,
      projectValue: initialProjectValue,
      portValue,
      configFileName,
      bail,
      randomValue,
      timeoutValue,
      fileValue,
      suiteValue,
    } = parsed;
    let projectValue = initialProjectValue;

    const preserveOutputsArg = parsed.preserveOutputsFlag ? true : undefined;

    if (initOnly) {
      try {
        ConfigManager.initViteJasmineConfig(configFileName);
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
        return EXIT_CODES.INVALID_USAGE;
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

      let config = ConfigManager.loadViteJasmineBrowserConfig(configFileName);

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
          return EXIT_CODES.INVALID_USAGE;
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
        browser: parsed.hasBrowserArg ? browserName : (config.browser || 'chrome'),
        // CLI contract: plain `testify` always performs a one-shot run.
        // Watch/HMR is opt-in through `--watch`; a stale `watch` value in
        // testify.json must not change the default CLI behavior.
        watch,
        suppressConsoleLogs: parsed.silentLogs ? true : config.suppressConsoleLogs,
        srcDirs: normalizeDirConfig(config.srcDirs, './src'),
        testDirs: normalizeDirConfig(config.testDirs, './tests'),
        preserveOutputs: preserveOutputsArg ?? !!config.preserveOutputs,
        project: projectValue ?? config.project,
        port: portValue ?? config.port,
        ansi: ansiFlag ? true : config.ansi,
        fileFilter: fileValue ?? config.fileFilter,
        selector:
          suiteValue
            ? { suite: suiteValue }
            : config.selector,
      };

      if (config.ansi) {
        setAnsiMode();
      }

      // Seed randomization for random runs without a seed is owned by the
      // ViteJasmineRunner constructor, the single funnel for CLI and
      // programmatic use alike.
      if (seedValue !== undefined || randomValue !== undefined || bail || timeoutValue !== undefined) {
        const env = config.jasmineConfig?.env ?? {};
        config.jasmineConfig = {
          ...config.jasmineConfig,
          env: {
            ...env,
            ...(seedValue !== undefined ? { seed: seedValue } : {}),
            ...(randomValue !== undefined ? { random: randomValue } : {}),
            ...(bail ? { stopSpecOnExpectationFailure: true } : {}),
            ...(timeoutValue !== undefined ? { timeout: timeoutValue } : {}),
          },
        };
      }

      // Begin this before the process lock is acquired so any ordinary setup
      // notices are retained in the preparation card.
      logger.preparationStart('');

      if (config.preserveOutputs) {
        logger.println(CLIMessages.preserveOutputsEnabled());
      }

      const resolvedOutDir = path.resolve(config.outDir ?? path.join(process.cwd(), 'dist/.vite-jasmine-build/'));
      const lock = new ProcessLock(config.project, config.port ?? 8888, resolvedOutDir);
      await lock.acquire(exclusive);
      process.on('exit', () => lock.releaseSync());

      const runner = cliDependencies.createViteJasmineRunner({
        ...config,
        lockFilePath: lock.getPidFilePath(),
      });
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
