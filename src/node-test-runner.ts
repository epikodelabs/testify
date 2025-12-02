// test-runner.ts
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import { logger } from './console-repl';
import { ConsoleReporter } from './console-reporter';

export interface TestRunnerOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  reporter?: jasmine.CustomReporter;
  file?: string; // test runner entry file (generated)
  coverage?: boolean;
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
// Cache for introspection data
let cachedOrderedSuites = null;
let cachedOrderedSpecs = null;

// Flag to track if imports have been processed
let importsProcessed = false;

// Function to force Jasmine to process registered suites/specs
function ensureImportsProcessed() {
  if (importsProcessed) return;
  
  // Jasmine processes describe/it calls synchronously during import,
  // but we need to ensure all suites are registered.
  // Accessing the topSuite forces Jasmine to process pending registrations.
  const root = jasmineEnv?.topSuite?.();
  if (root) {
    // Force Jasmine to process any pending suite/spec registrations
    // This is a bit of a hack, but accessing children should trigger processing
    const children = root.children || [];
    importsProcessed = true;
  }
}

function collectSpecsAndSuites() {
  if (!jasmineEnv) {
    return { orderedSuites: [], orderedSpecs: [] };
  }

  const root = jasmineEnv.topSuite?.();
  if (!root) {
    return { orderedSuites: [], orderedSpecs: [] };
  }

  // Return cached data if available
  if (cachedOrderedSuites && cachedOrderedSpecs) {
    return { orderedSuites: cachedOrderedSuites, orderedSpecs: cachedOrderedSpecs };
  }

  const orderedSuites = [];
  const orderedSpecs = [];

  // Helper to identify suite nodes
  function isSuite(node) {
    return node && 
           node.children !== undefined && 
           node !== root &&
           typeof node.execute === 'function';
  }

  // Helper to identify spec nodes
  function isSpec(node) {
    return node && 
           typeof node.getFullName === 'function' &&
           typeof node.execute === 'function' &&
           node.result !== undefined;
  }

  // Build a map for quick parent lookups
  const suiteMap = new Map();
  
  function walkSuite(suite, parentId = null, path = []) {
    if (!suite || !suite.id) return;

    const fullPath = [...path, suite.description].filter(Boolean);
    const suiteInfo = {
      id: suite.id,
      description: suite.description || 'Unnamed Suite',
      fullName: fullPath.join(' ') || suite.description || 'Unnamed Suite',
      parentSuiteId: parentId,
      children: [],
    };
    
    orderedSuites.push(suiteInfo);
    suiteMap.set(suite.id, suiteInfo);

    // Process children - store reference to actual spec object
    for (const child of suite.children || []) {
      if (isSpec(child)) {
        const specInfo = {
          id: child.id,
          description: child.description || 'Unnamed Spec',
          fullName: child.getFullName() || child.description || 'Unnamed Spec',
          suiteId: suite.id,
          _specRef: child, // Store reference to get live status
        };
        orderedSpecs.push(specInfo);
        suiteInfo.children.push(specInfo.id);
      }
    }

    // Recursively process child suites
    for (const child of suite.children || []) {
      if (isSuite(child)) {
        walkSuite(child, suite.id, fullPath);
      }
    }
  }

  // Process top-level suites (children of the synthetic root)
  for (const child of root.children || []) {
    if (isSuite(child)) {
      walkSuite(child, null, []);
    }
  }

  // Cache the results
  cachedOrderedSuites = orderedSuites;
  cachedOrderedSpecs = orderedSpecs;

  return { orderedSuites, orderedSpecs };
}

// Expose stable global API for external tooling
const utils = {
  getOrderedSuites() {
    const { orderedSuites } = collectSpecsAndSuites();
    return orderedSuites.map(suite => ({
      id: suite.id,
      description: suite.description,
      fullName: suite.fullName,
      parentSuiteId: suite.parentSuiteId,
      children: [...suite.children] // Return copy of children IDs
    }));
  },
  
  getOrderedSpecs() {
    const { orderedSpecs } = collectSpecsAndSuites();
    return orderedSpecs.map(spec => ({
      id: spec.id,
      description: spec.description,
      fullName: spec.fullName,
      suiteId: spec.suiteId,
      // Read live status from the spec reference
      status: spec._specRef?.result?.status || 'pending',
      duration: spec._specRef?.result?.duration,
      failedExpectations: spec._specRef?.result?.failedExpectations ? 
        [...spec._specRef.result.failedExpectations] : undefined,
      pendingReason: spec._specRef?.result?.pendingReason
    }));
  },
  
  getAllSuites() {
    return this.getOrderedSuites();
  },
  
  getAllSpecs() {
    return this.getOrderedSpecs();
  },
  
  getTestCounts() {
    const { orderedSuites, orderedSpecs } = collectSpecsAndSuites();
    return { 
      suites: orderedSuites.length, 
      specs: orderedSpecs.length 
    };
  },
  
  // Clear cache (useful for re-running tests)
  clearCache() {
    cachedOrderedSuites = null;
    cachedOrderedSpecs = null;
    importsProcessed = false;
  }
};

// Export utility functions via module
export function getOrderedSuites() {
  return utils.getOrderedSuites();
}
export function getOrderedSpecs() {
  return utils.getOrderedSpecs();
}
export function getAllSuites() {
  return utils.getAllSuites();
}
export function getAllSpecs() {
  return utils.getAllSpecs();
}
export function getTestCounts() {
  return utils.getTestCounts();
}

// ---------------------------
// Main runTests entrypoint
// ---------------------------
export async function runTests(reporter) {
  return new Promise((resolve) => {
    // Global error handlers
    process.on('unhandledRejection', (error) => {
      console.error(\`❌ Unhandled Rejection: \${error}\`);
      process.exit(1);
    });

    process.on('uncaughtException', (error) => {
      console.error(\`❌ Uncaught Exception: \${error}\`);
      process.exit(1);
    });

    (async function () {
      try {
        // Load jasmine-core from ts-test-runner's own node_modules
        const jasmineCorePath = join(
          __cwd,
          './node_modules/@actioncrew/ts-test-runner/node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
        );

        const jasmineCore = await import(pathToFileURL(jasmineCorePath).href);
        const jasmineRequire = jasmineCore.default;

        jasmineInstance = jasmineRequire.core(jasmineRequire);
        jasmineEnv = jasmineInstance.getEnv();

        // Expose jasmine globals (describe, it, beforeEach, etc.)
        Object.assign(globalThis, jasmineRequire.interface(jasmineInstance, jasmineEnv));
        globalThis.jasmine = {
          ...globalThis.jasmine,
          ...jasmineInstance,
          ...utils
        };

        // Clean shutdown
        function onExit(signal) {
          console.log(\`\\n⚙️  Caught \${signal}. Cleaning up...\`);
          process.exit(0);
        }
        process.on('SIGINT', onExit);
        process.on('SIGTERM', onExit);

        // Configure env from template (inlined from ViteJasmineConfig)
        jasmineEnv.configure({
          random: ${this.config.jasmineConfig?.env?.random ?? false},
          stopOnSpecFailure: ${
            this.config.jasmineConfig?.env?.stopSpecOnExpectationFailure ?? false
          },
        });

        jasmineEnv.clearReporters();
        jasmineEnv.addReporter(reporter);

${imports}

        // Ensure Jasmine has processed all suite/spec registrations
        ensureImportsProcessed();
        
        // Collect suite/spec structure (before execution, so reporter can access it)
        // Note: At this point, specs have no results yet
        collectSpecsAndSuites();
        
        // Notify reporter that we're ready
        reporter.userAgent(undefined);
        
        // Execute tests - this will populate spec results
        await jasmineEnv.execute();

        const failures = reporter.failureCount || 0;
        resolve(failures);
      } catch (error) {
        console.error(\`❌ Error during test execution: \${error}\`);
        console.error(error.stack);
        resolve(1);
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
      process.exit(failures === 0 ? 0 : 1);
    } catch (error) {
      console.error(\`❌ Failed to run tests: \${error}\`);
      process.exit(1);
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
      (this.reporter as any).testsAborted?.('Test process already running');
      return Promise.reject('Test process already running');
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

    try {
      const childFile = path.resolve(
        this.options.cwd || process.cwd(),
        this.options.file || path.join(this.config.outDir, 'test-runner.js'),
      );

      logger.println(`🚀 Starting test runner in current process...`);
      const fileUrl = pathToFileURL(childFile).href;

      this.runnerModule = await import(fileUrl);

      if (typeof this.runnerModule.runTests === 'function') {
        const failures: number = await this.runnerModule.runTests(this.reporter);
        return failures === 0 ? 0 : 1;
      } else {
        logger.error('⚠️  Test runner does not export runTests function');
        return 1;
      }
    } catch (error: any) {
      (this.reporter as any).jasmineFailed?.(`Test execution error: ${error.message}`);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }
  async stop(): Promise<void> {
    this.isRunning = false;
    // nothing else to tear down in host mode (yet)
  }

  async restart(): Promise<void> {
    await this.stop();
    setTimeout(() => this.start(), 300);
  }
}