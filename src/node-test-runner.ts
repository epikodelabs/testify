// test-runner.ts
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import { logger } from './console-repl';
import { ConsoleReporter } from './console-reporter';
import { CoverageReportGenerator } from './coverage-report-generator';
import { EXIT_CODES } from './exit-codes';

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

    const builtFiles = fs
      .readdirSync(outDir)
      .filter((f) => f.endsWith('.js') && f !== 'test-runner.js')
      .sort();

    if (builtFiles.length === 0) {
      logger.println('⚠️  No JS files found for test runner generation.');
      return;
    }

    const imports = builtFiles.map((f) => `    await import('./${f}');`).join('\n');

    const runnerContent = this.generateRunnerTemplate(imports);
    const testRunnerPath = norm(path.join(outDir, 'test-runner.js'));
    fs.writeFileSync(testRunnerPath, runnerContent);
    logger.println(
      `🤖 Generated in-process test runner: ${norm(path.relative(outDir, testRunnerPath))}`,
    );
  }

  /**
   * Template for the generated ESM runner file.
   * NOTE: This is emitted as JS, so keep syntax JS-friendly.
   */
  private generateRunnerTemplate(imports: string): string {   
    const jasmineCoreUrl = this.resolveJasmineCoreUrl();
    return `// Auto-generated in-process Jasmine test runner
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

// __dirname / __filename for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __cwd = process.cwd();

// Jasmine internals
let jasmineInstance = null;
let jasmineEnv = null;

// ---------------------------
// Introspection helpers
// ---------------------------
export function getAllSpecs() {
  const specs = [];
  const traverse = (suite) => {
    suite.children?.forEach((child) => {
      if (child && typeof child.id === 'string' && !child.children) specs.push(child);
      if (child?.children) traverse(child);
    });
  };
  traverse(jasmineEnv.topSuite());
  return specs;
}

export function getAllSuites() {
  const suites = [];
  const traverse = (suite) => {
    suites.push(suite);
    suite.children?.forEach((child) => {
      if (child?.children) traverse(child);
    });
  };
  traverse(jasmineEnv.topSuite());
  return suites;
}

export function getOrderedSpecs(seed, random) {
  const all = getAllSpecs();
  if (!random) return all;

  const OrderCtor = jasmineInstance.Order;
  try {
    const order = new OrderCtor({ random, seed });
    return typeof order.sort === "function" ? order.sort(all) : all;
  } catch {
    return all;
  }
}

export function getOrderedSuites(seed, random) {
  const all = getAllSuites();
  if (!random) return all;

  const OrderCtor = jasmineInstance.Order;
  try {
    const order = new OrderCtor({ random, seed });
    return typeof order.sort === "function" ? order.sort(all) : all;
  } catch {
    return all;
  }
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
      console.error(\`❌ Unhandled Rejection: \${error}\`);
      process.exit(${EXIT_CODES.INTERNAL_ERROR});
    };
    process.on('unhandledRejection', onUnhandledRejection);
    ownedHandlers.push({ event: 'unhandledRejection', handler: onUnhandledRejection });

    const onUncaughtException = (error) => {
      console.error(\`❌ Uncaught Exception: \${error}\`);
      process.exit(${EXIT_CODES.INTERNAL_ERROR});
    };
    process.on('uncaughtException', onUncaughtException);
    ownedHandlers.push({ event: 'uncaughtException', handler: onUncaughtException });

    // Only attach SIGINT/SIGTERM handlers if running as CLI entry
    if (import.meta.url === pathToFileURL(process.argv[1]).href) {
      function onExit(signal) {
        console.log(\`\n⚙️  Caught \${signal}. Cleaning up...\`);
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

        jasmineInstance = jasmineRequire.core(jasmineRequire);
        jasmineEnv = jasmineInstance.getEnv();

        const utils = {
          getAllSpecs,
          getAllSuites,
          getOrderedSpecs,
          getOrderedSuites
        };
        
        // Expose jasmine globals (describe, it, beforeEach, etc.)
        Object.assign(globalThis, jasmineRequire.interface(jasmineInstance, jasmineEnv));
        globalThis.jasmine = { ...globalThis.jasmine, ...jasmineInstance, ...utils };

        jasmineEnv.clearReporters();
        jasmineEnv.addReporter(reporter);

${imports}
        
        // Configure env from template (inlined from ViteJasmineConfig)
        const random = ${this.config.jasmineConfig?.env?.random ?? false};
        const stopOnSpecFailure = ${this.config.jasmineConfig?.env?.stopSpecOnExpectationFailure ?? false};
        const seed = ${(this.config.jasmineConfig?.env as any)?.seed} ?? 0;

        jasmineEnv.configure({
          random,
          stopOnSpecFailure,
          seed
        });

        // Get ordered specs and suites based on configuration
        const orderedSpecs = getOrderedSpecs(seed, random).map(spec => ({
          id: spec.id,
          description: spec.description,
          fullName: spec.getFullName ? spec.getFullName() : spec.description
        }));

        const orderedSuites = getOrderedSuites(seed, random).map(suite => ({
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
        console.error(\`❌ Error during test execution: \${error}\`);
        console.error(error.stack);
        resolve(${EXIT_CODES.INTERNAL_ERROR});
      } finally {
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
      const consoleReporterPath = join(__dirname, '../lib/console-reporter.js');
      const consoleReporterModule = await import(pathToFileURL(consoleReporterPath).href);
      const ConsoleReporter = consoleReporterModule.ConsoleReporter;

      const failures = await runTests(new ConsoleReporter());
      process.exit(failures);
    } catch (error) {
      console.error(\`❌ Failed to run tests: \${error}\`);
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
      const message = 'Test process already running';
      (this.reporter as any).jasmineFailed?.(message);
      return Promise.reject(new Error(message));
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

      logger.println(`🚀 Starting test runner in current process...`);
      const fileUrl = pathToFileURL(childFile).href;

      this.runnerModule = await import(fileUrl);

      if (typeof this.runnerModule.runTests === 'function') {
        const exitCode: number = await this.runnerModule.runTests(this.reporter);
        const coverage = (globalThis as any).__coverage__;
        if (coverage) {
          const cov = new CoverageReportGenerator();
          await cov.generate(coverage);
        }
        return exitCode;
      } else {
        logger.error('⚠️  Test runner does not export runTests function');
        return EXIT_CODES.INTERNAL_ERROR;
      }
    } catch (error: any) {
      (this.reporter as any).jasmineFailed?.(`Test execution error: ${error.message}`);
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
