import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';
import { logger } from './console-repl';
import { ConsoleReporter } from './console-reporter';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE_REQUIRE = createRequire(path.join(PACKAGE_ROOT, 'package.json'));

type OrderedSpec = { id: string; description: string; fullName: string };
type OrderedSuite = { id: string; description: string; fullName: string };

async function registerTsNode(specFile: string): Promise<void> {
  const ext = path.extname(specFile).toLowerCase();
  if (!['.ts', '.tsx', '.mts', '.cts'].includes(ext)) {
    return;
  }

  try {
    process.env.TS_NODE_PROJECT ??= path.resolve(process.cwd(), 'tsconfig.json');
    process.env.TS_NODE_TRANSPILE_ONLY ??= 'true';
    const tsNodePath = PACKAGE_REQUIRE.resolve('ts-node');
    const tsNodeModule = await import(pathToFileURL(tsNodePath).href);
    const registerFn =
      (tsNodeModule as any).register ??
      (tsNodeModule as any).default ??
      (tsNodeModule.default && tsNodeModule.default.register) ??
      null;

    if (typeof registerFn === 'function') {
      registerFn({
        transpileOnly: true,
        esm: true
      });
    } else {
      throw new Error('ts-node register function not found');
    }
  } catch (error: any) {
    logger.error(`❌ ts-node is required to run ts-cli with TypeScript specs.`);
    logger.error(`💡 install it with: npm install ts-node`);
    try {
      const tsNodeRegister = PACKAGE_REQUIRE.resolve('ts-node/register');
      const registerModule = await import(pathToFileURL(tsNodeRegister).href);
      if (typeof registerModule.register === 'function') {
        registerModule.register({ transpileOnly: true });
      } else if (typeof registerModule.default === 'function') {
        registerModule.default({ transpileOnly: true });
      } else {
        throw error;
      }
    } catch {
      throw error;
    }
  }
}

function parseSpecArgument(): string {
  const args = process.argv.slice(2);
  const specIndex = args.findIndex((arg) => arg === '--spec');
  if (specIndex === -1 || !args[specIndex + 1]) {
    logger.error('❌ Usage: ts-cli --spec path/to/your.spec.ts');
    process.exit(1);
  }
  const specPath = path.resolve(process.cwd(), args[specIndex + 1]);
  if (!fs.existsSync(specPath)) {
    logger.error(`❌ Spec file not found: ${specPath}`);
    process.exit(1);
  }
  return specPath;
}

const isSuite = (node: jasmine.Spec | jasmine.Suite): node is jasmine.Suite =>
  'children' in node && Array.isArray((node as jasmine.Suite).children);

function getAllSpecs(jasmineEnv: jasmine.Env): jasmine.Spec[] {
  const specs: jasmine.Spec[] = [];
  const traverse = (suite: jasmine.Suite) => {
    suite.children?.forEach((child) => {
      if (child && typeof child.id === 'string' && !isSuite(child)) {
        specs.push(child);
      }
      if (child && isSuite(child)) {
        traverse(child);
      }
    });
  };
  traverse(jasmineEnv.topSuite());
  return specs;
}

function getAllSuites(jasmineEnv: jasmine.Env): jasmine.Suite[] {
  const suites: jasmine.Suite[] = [];
  const traverse = (suite: jasmine.Suite) => {
    suites.push(suite);
    suite.children?.forEach((child) => {
      if (child && isSuite(child)) traverse(child);
    });
  };
  traverse(jasmineEnv.topSuite());
  return suites;
}

function orderSpecs(
  jasmineInstance: jasmine.Jasmine,
  specs: jasmine.Spec[],
  seed: number,
  random: boolean
): jasmine.Spec[] {
  if (!random) return specs;
  const OrderCtor = (jasmineInstance as any).Order;
  try {
    const order = new OrderCtor({ random, seed });
    return typeof order.sort === 'function' ? order.sort(specs) : specs;
  } catch {
    return specs;
  }
}

function orderSuites(
  jasmineInstance: jasmine.Jasmine,
  suites: jasmine.Suite[],
  seed: number,
  random: boolean
): jasmine.Suite[] {
  if (!random) return suites;
  const OrderCtor = (jasmineInstance as any).Order;
  try {
    const order = new OrderCtor({ random, seed });
    return typeof order.sort === 'function' ? order.sort(suites) : suites;
  } catch {
    return suites;
  }
}

async function loadJasmine(reporter: ConsoleReporter) {
  const jasmineCorePath = PACKAGE_REQUIRE.resolve('jasmine-core/lib/jasmine-core/jasmine.js');
  const jasmineCore = await import(pathToFileURL(jasmineCorePath).href);
  const jasmineRequire = jasmineCore.default;
  const jasmineInstance = jasmineRequire.core(jasmineRequire);
  const jasmineEnv = jasmineInstance.getEnv();

  Object.assign(globalThis, jasmineRequire.interface(jasmineInstance, jasmineEnv));
  globalThis.jasmine = { ...globalThis.jasmine, ...jasmineInstance };

  jasmineEnv.clearReporters();
  jasmineEnv.addReporter(reporter);

  return { jasmineEnv, jasmineInstance };
}

async function main() {
  const specFile = parseSpecArgument();
  await registerTsNode(specFile);

  const reporter = new ConsoleReporter();
  const { jasmineEnv, jasmineInstance } = await loadJasmine(reporter);

  process.on('unhandledRejection', (error) => {
    logger.error(`❌ Unhandled rejection: ${error}`);
    process.exit(1);
  });
  process.on('uncaughtException', (error) => {
    logger.error(`❌ Uncaught exception: ${error}`);
    process.exit(1);
  });

  await import(pathToFileURL(specFile).href);

  const random = false;
  const stopOnSpecFailure = false;
  const seed = 0;

  jasmineEnv.configure({
    random,
    stopSpecOnExpectationFailure: stopOnSpecFailure,
    seed
  });

  const orderedSpecs: OrderedSpec[] = orderSpecs(
    jasmineInstance,
    getAllSpecs(jasmineEnv),
    seed,
    random
  ).map((spec) => ({
    id: spec.id,
    description: spec.description,
    fullName: (spec as any).getFullName ? (spec as any).getFullName() : spec.description
  }));

  const orderedSuites: OrderedSuite[] = orderSuites(
    jasmineInstance,
    getAllSuites(jasmineEnv),
    seed,
    random
  ).map((suite) => ({
    id: suite.id,
    description: suite.description,
    fullName: (suite as any).getFullName ? (suite as any).getFullName() : suite.description
  }));

  await new Promise((resolve) => setTimeout(resolve, 300));
  reporter.userAgent(undefined, orderedSuites, orderedSpecs);

  await jasmineEnv.execute();

  const failures = reporter.getFailureCount();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  logger.error(`❌ Failed to run ts-cli: ${error.stack ?? error}`);
  process.exit(1);
});
