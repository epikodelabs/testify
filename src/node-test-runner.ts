// test-runner.ts
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import { ConsoleReporter } from './console-reporter';
import { CoverageReportGenerator } from './coverage-report-generator';
import { EXIT_CODES } from './exit-codes';
import { logger } from './logger';
import { NodeRunnerMessages } from './log-messages';
import { resolveNodePreludeModules } from './prelude-modules';
import { getEmbeddedNodeJasmineRuntimeSource } from './jasmine-node-runtime';

export interface TestRunnerOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  reporter?: jasmine.CustomReporter;
  file?: string; // test runner entry file (generated)
  coverage?: boolean;
  suppressConsoleLogs?: boolean;
}

export class NodeTestRunner {
  private reporter: jasmine.CustomReporter;
  private options: TestRunnerOptions;
  private isRunning = false;
  private runnerModule: any = null;
  private config: ViteJasmineConfig;

  constructor(config: ViteJasmineConfig, options: TestRunnerOptions = {}) {
    this.config = config;
    this.options = options;
    this.reporter = options.reporter ?? new ConsoleReporter();
  }

  private resolveJasmineCoreUrl(): string {
    const require = createRequire(import.meta.url);
    const jasmineCorePath = require.resolve('jasmine-core/lib/jasmine-core/jasmine.js');
    return pathToFileURL(jasmineCorePath).href;
  }

  /**
   * Generate in-process test runner entry file that:
   * - Bootstraps Jasmine
   * - Imports compiled spec bundles
   * - Exposes a stable API: runTests, getOrderedSpecs/Suites, getTestCounts
   */
  generateTestRunner(): void {
    const outDir = this.config.outDir;
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const builtSpecFiles = fs
      .readdirSync(outDir)
      .filter((f) => /\.spec\.js$/i.test(f))
      .sort();

    if (builtSpecFiles.length === 0) {
      logger.println(NodeRunnerMessages.noJsFilesForRunner());
      return;
    }

    const imports = [
      ...resolveNodePreludeModules(this.config, outDir).map(
        (specifier) => `    await import(${JSON.stringify(specifier)});`
      ),
      ...builtSpecFiles.map((file) => `    await import('./${file}');`)
    ].join('\n');

    const runnerContent = this.generateRunnerTemplate(imports);
    const testRunnerPath = norm(path.join(outDir, 'test-runner.js'));
    fs.writeFileSync(testRunnerPath, runnerContent);
    logger.println(NodeRunnerMessages.generatedInProcessRunner(norm(path.relative(outDir, testRunnerPath))));
  }

  /**
   * Template for the generated ESM runner file.
   * NOTE: This is emitted as JS, so keep syntax JS-friendly.
   */
  private generateRunnerTemplate(imports: string): string {
    const jasmineCoreUrl = this.resolveJasmineCoreUrl();
    const jasmineRuntimeSource = getEmbeddedNodeJasmineRuntimeSource();
    const messages = {
      unhandledRejection: NodeRunnerMessages.unhandledRejection(''),
      uncaughtException: NodeRunnerMessages.uncaughtException(''),
      caughtSignal: NodeRunnerMessages.caughtSignal(''),
      errorDuringExecution: NodeRunnerMessages.errorDuringExecution(''),
      failedToRunTests: NodeRunnerMessages.failedToRunTests(''),
    };

    return `// Auto-generated in-process Jasmine test runner
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

// Generated runner module location for ESM
const runnerFilePath = fileURLToPath(import.meta.url);
const runnerDirectory = dirname(runnerFilePath);

// ---------------------------
// Symbol/emoji replacement (embedded in generated runner)
// ---------------------------
function replacePlaceholders(text) {
  if (!text) return text;
  const useEmoji = process.stdout?.isTTY && !process.env.NO_EMOJI;
  return text
    .replace(/%check%/g, useEmoji ? 'вњ…' : '[OK]')
    .replace(/%cross%/g, useEmoji ? 'вќЊ' : '[ERROR]')
    .replace(/%warn%/g, useEmoji ? 'вљ пёЏ' : '[WARN]')
    .replace(/%info%/g, useEmoji ? 'в„№пёЏ' : '[INFO]')
    .replace(/%globe%/g, useEmoji ? 'рџЊђ' : '[BROWSER]')
    .replace(/%doc%/g, useEmoji ? 'рџ“„' : '[FILE]')
    .replace(/%puzzle%/g, useEmoji ? 'рџ§©' : '[TREE]')
    .replace(/%stop%/g, useEmoji ? 'рџ›‘' : '[STOP]')
    .replace(/%bulb%/g, useEmoji ? 'рџ’Ў' : '[TIP]')
    .replace(/%rocket%/g, useEmoji ? 'рџљЂ' : '[START]')
    .replace(/%hourglass%/g, useEmoji ? 'вЏі' : '[WAIT]')
    .replace(/%circle_green%/g, useEmoji ? 'рџџў' : '[READY]')
    .replace(/%plus%/g, useEmoji ? 'вћ•' : '[ADD]')
    .replace(/%minus%/g, useEmoji ? 'вћ–' : '[REM]')
    .replace(/%folder%/g, useEmoji ? 'рџ“Ѓ' : '[DIR]')
    .replace(/%box%/g, useEmoji ? 'рџ“¦' : '[BUILD]')
    .replace(/%refresh%/g, useEmoji ? 'рџ”„' : '[RETRY]')
    .replace(/%broom%/g, useEmoji ? 'рџ§№' : '[CLEAN]')
    .replace(/%lock%/g, useEmoji ? 'рџ”’' : '[LOCK]')
    .replace(/%fire%/g, useEmoji ? 'рџ”Ґ' : '[HMR]')
    .replace(/%satellite%/g, useEmoji ? 'рџ“Ў' : '[WS]')
    .replace(/%ok%/g, useEmoji ? 'рџ‘Њ' : '[OK]')
    .replace(/%eyes%/g, useEmoji ? 'рџ‘Ђ' : '[WATCH]')
    .replace(/%plug%/g, useEmoji ? 'рџ”Њ' : '[CONN]');
}

${jasmineRuntimeSource}

// Jasmine runtime
let jasmineRuntime = null;

// ---------------------------
// Introspection helpers
// ---------------------------
export function getAllSpecs() {
  return jasmineRuntime?.utils.getAllSpecs() ?? [];
}

export function getAllSuites() {
  return jasmineRuntime?.utils.getAllSuites() ?? [];
}

export function getOrderedSpecs(seed, random) {
  return jasmineRuntime?.utils.getOrderedSpecs(seed, random) ?? [];
}

export function getOrderedSuites(seed, random) {
  return jasmineRuntime?.utils.getOrderedSuites(seed, random) ?? [];
}

// ---------------------------
// Main runTests entrypoint
// ---------------------------
export async function runTests(reporter) {
  const envValue = process.env.TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS;
  const shouldSilenceConsole =
    envValue === '1' || envValue?.toLowerCase() === 'true';
  const originalConsole = {};

  const restoreConsole = () => {
    for (const [method, value] of Object.entries(originalConsole)) {
      console[method] = value;
    }
  };

  if (shouldSilenceConsole) {
    const silentMethods = ['log', 'info', 'debug', 'trace', 'warn', 'table'];
    for (const method of silentMethods) {
      if (typeof console[method] === 'function') {
        originalConsole[method] = console[method];
        console[method] = () => {};
      }
    }
  }

  return new Promise((resolve) => {
    // Track handlers for cleanup to prevent leaks when module is cached/reused
    const ownedHandlers = [];

    const onUnhandledRejection = (error) => {
      console.error(replacePlaceholders(${JSON.stringify(messages.unhandledRejection)}) + (error instanceof Error ? error.message : String(error)));
      process.exit(${EXIT_CODES.INTERNAL_ERROR});
    };
    process.on('unhandledRejection', onUnhandledRejection);
    ownedHandlers.push({ event: 'unhandledRejection', handler: onUnhandledRejection });

    const onUncaughtException = (error) => {
      console.error(replacePlaceholders(${JSON.stringify(messages.uncaughtException)}) + (error instanceof Error ? error.message : String(error)));
      process.exit(${EXIT_CODES.INTERNAL_ERROR});
    };
    process.on('uncaughtException', onUncaughtException);
    ownedHandlers.push({ event: 'uncaughtException', handler: onUncaughtException });

    // Only attach SIGINT/SIGTERM handlers if running as CLI entry
    if (import.meta.url === pathToFileURL(process.argv[1]).href) {
      function onExit(signal) {
        console.log(replacePlaceholders(${JSON.stringify(messages.caughtSignal)}) + signal);
        process.exit(signal === 'SIGTERM' ? ${EXIT_CODES.SIGTERM} : ${EXIT_CODES.SIGINT});
      }
      process.on('SIGINT', onExit);
      process.on('SIGTERM', onExit);
      ownedHandlers.push({ event: 'SIGINT', handler: onExit }, { event: 'SIGTERM', handler: onExit });
    }

    (async function () {
      try {
        const jasmineCore = await import(${JSON.stringify(jasmineCoreUrl)});
        const jasmineRequire = jasmineCore.default;
        jasmineRuntime = initializeNodeJasmineEnvironment(jasmineRequire, { reporter });
        const { jasmineEnv, utils } = jasmineRuntime;

${imports}

        // Configure env from template (inlined from ViteJasmineConfig)
        const random = ${this.config.jasmineConfig?.env?.random ?? false};
        const stopOnSpecFailure = ${this.config.jasmineConfig?.env?.stopSpecOnExpectationFailure ?? false};
        const seed = ${(this.config.jasmineConfig?.env as any)?.seed ?? 0};

        jasmineEnv.configure({
          random,
          stopOnSpecFailure,
          seed
        });

        // Get ordered specs and suites based on configuration
        const orderedSpecs = utils.getOrderedSpecs(seed, random).map(spec => ({
          id: spec.id,
          description: spec.description,
          fullName: spec.getFullName ? spec.getFullName() : spec.description
        }));

        const orderedSuites = utils.getOrderedSuites(seed, random).map(suite => ({
          id: suite.id,
          description: suite.description,
          fullName: suite.getFullName ? suite.getFullName() : suite.description
        }));

        // Execute tests - this will populate spec results
        reporter.userAgent(undefined, orderedSuites, orderedSpecs);
        await jasmineEnv.execute();

        const failures = reporter && typeof reporter === 'object'
          ? reporter.failureCount || 0
          : 0;
        const pending = reporter && typeof reporter === 'object'
          ? (reporter.pendingSpecs?.length || 0)
          : 0;
        if (failures > 0) {
          resolve(${EXIT_CODES.TEST_FAILURES});
        } else if (pending > 0) {
          resolve(${EXIT_CODES.SUCCESS_WITH_PENDING});
        } else {
          resolve(${EXIT_CODES.SUCCESS});
        }
      } catch (error) {
        console.error(replacePlaceholders(${JSON.stringify(messages.errorDuringExecution)}) + (error instanceof Error ? error.message : String(error)));
        if (error instanceof Error && error.stack) console.error(error.stack);
        resolve(${EXIT_CODES.INTERNAL_ERROR});
      } finally {
        jasmineRuntime = null;
        restoreConsole();
        // Remove all tracked handlers to prevent leaks on module re-import
        for (const h of ownedHandlers) {
          process.off(h.event, h.handler);
        }
      }
    })();
  });
}

// ---------------------------
// CLI entry (backward compat)
// ---------------------------
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  (async () => {
    try {
      const consoleReporterPath = join(runnerDirectory, '../lib/console-reporter.js');
      const consoleReporterModule = await import(pathToFileURL(consoleReporterPath).href);
      const ConsoleReporter = consoleReporterModule.ConsoleReporter;

      const failures = await runTests(new ConsoleReporter());
      process.exit(failures);
    } catch (error) {
      console.error(replacePlaceholders(${JSON.stringify(messages.failedToRunTests)}) + (error instanceof Error ? error.message : String(error)));
      process.exit(${EXIT_CODES.INTERNAL_ERROR});
    }
  })();
}
`;
  }

  /**
   * Start the test runner in the current (host) process.
   */
  async start(): Promise<number> {
    if (this.isRunning) {
      logger.println(NodeRunnerMessages.testProcessAlreadyRunning());
      return Promise.reject(new Error('Test process already running'));
    }

    this.isRunning = true;

    // Apply env overrides once per run
    if (this.options.env) {
      for (const [key, value] of Object.entries(this.options.env)) {
        if (value == null) delete process.env[key];
        else process.env[key] = value;
      }
    }
    process.env.NODE_ENV = 'test';

    const shouldSilenceConsole = !!this.options.suppressConsoleLogs;
    const previousSuppressConsole = process.env.TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS;
    if (shouldSilenceConsole) {
      process.env.TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS = '1';
    }

    try {
      const childFile = path.resolve(
        this.options.cwd || process.cwd(),
        this.options.file || path.join(this.config.outDir, 'test-runner.js'),
      );

      logger.println(NodeRunnerMessages.startingTestRunner());
      const fileUrl = pathToFileURL(childFile).href;

      this.runnerModule = await import(`${fileUrl}?t=${Date.now()}`);

      if (typeof this.runnerModule.runTests === 'function') {
        const exitCode: number = await this.runnerModule.runTests(this.reporter);
        const coverage = (globalThis as any).__coverage__;
        if (coverage) {
          const cov = new CoverageReportGenerator();
          await cov.generate(coverage);
        }
        return exitCode;
      } else {
        logger.println(NodeRunnerMessages.runnerDoesNotExportRunTests());
        return EXIT_CODES.INTERNAL_ERROR;
      }
    } catch (error: any) {
      logger.println(NodeRunnerMessages.testExecutionError(error.message));
      throw error;
    } finally {
      if (shouldSilenceConsole) {
        if (previousSuppressConsole === undefined) {
          delete process.env.TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS;
        } else {
          process.env.TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS = previousSuppressConsole;
        }
      }
      this.isRunning = false;
    }
  }
  async stop(): Promise<void> {
    this.isRunning = false;
    // nothing else to tear down in host mode (yet)
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }
}
