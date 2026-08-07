import {
  createTestCatalogFromJasmineEnv,
  getEmbeddedTestCatalogSource,
  type TestCatalog,
} from './test-catalog';

export interface NodeJasmineRuntimeOptions {
  reporter?: jasmine.CustomReporter;
  resetReporters?: boolean;
}

export interface NodeJasmineRuntime {
  jasmineEnv: jasmine.Env;
  jasmineInstance: any;
  catalog: TestCatalog;
  utils: {
    getCatalog: () => TestCatalog;
    getAllSpecs: () => any[];
    getAllSuites: () => any[];
    getOrderedSpecs: (seed: unknown, random: boolean) => any[];
    getOrderedSuites: (seed: unknown, random: boolean) => any[];
  };
}

export function getAllSpecsFromEnv(jasmineEnv: jasmine.Env): any[] {
  const specs: any[] = [];
  const topSuite = jasmineEnv?.topSuite?.();
  if (!topSuite) return specs;

  const traverse = (suite: any) => {
    suite.children?.forEach((child: any) => {
      if (child && typeof child.id === 'string' && !child.children) {
        specs.push(child);
      }
      if (child?.children) {
        traverse(child);
      }
    });
  };

  traverse(topSuite);
  return specs;
}

export function getAllSuitesFromEnv(jasmineEnv: jasmine.Env): any[] {
  const suites: any[] = [];
  const topSuite = jasmineEnv?.topSuite?.();
  if (!topSuite) return suites;

  const traverse = (suite: any) => {
    suites.push(suite);
    suite.children?.forEach((child: any) => {
      if (child?.children) {
        traverse(child);
      }
    });
  };

  traverse(topSuite);
  return suites;
}

export function orderJasmineItems(
  jasmineInstance: any,
  items: any[],
  seed: unknown,
  random: boolean
): any[] {
  if (!random) return items;

  const OrderCtor = jasmineInstance?.Order;
  try {
    const order = new OrderCtor({ random, seed });
    return typeof order.sort === 'function' ? order.sort(items) : items;
  } catch {
    return items;
  }
}

export function createJasmineRuntimeUtils(
  jasmineEnv: jasmine.Env,
  jasmineInstance: any,
) {
  return {
    getCatalog: () =>
      createTestCatalogFromJasmineEnv(jasmineEnv),
    getAllSpecs: () =>
      getAllSpecsFromEnv(jasmineEnv),
    getAllSuites: () =>
      getAllSuitesFromEnv(jasmineEnv),
    getOrderedSpecs: (
      seed: unknown,
      random: boolean,
    ) =>
      orderJasmineItems(
        jasmineInstance,
        getAllSpecsFromEnv(jasmineEnv),
        seed,
        random,
      ),
    getOrderedSuites: (
      seed: unknown,
      random: boolean,
    ) =>
      orderJasmineItems(
        jasmineInstance,
        getAllSuitesFromEnv(jasmineEnv),
        seed,
        random,
      ),
  };
}

export function exposeNodeJasmineGlobals(
  jasmineRequire: any,
  jasmineInstance: any,
  jasmineEnv: jasmine.Env,
  utils: NodeJasmineRuntime['utils']
): void {
  Object.assign(
    globalThis,
    jasmineRequire.interface(
      jasmineInstance,
      jasmineEnv,
    ),
  );

  globalThis.jasmine = {
    ...(globalThis.jasmine ?? {}),
    ...jasmineInstance,
    ...utils,
  };
}

export function initializeNodeJasmineEnvironment(
  jasmineRequire: any,
  options: NodeJasmineRuntimeOptions = {}
): NodeJasmineRuntime {
  const jasmineInstance =
    jasmineRequire.core(jasmineRequire);
  const jasmineEnv =
    jasmineInstance.getEnv();
  const utils =
    createJasmineRuntimeUtils(
      jasmineEnv,
      jasmineInstance,
    );

  exposeNodeJasmineGlobals(
    jasmineRequire,
    jasmineInstance,
    jasmineEnv,
    utils,
  );

  if (
    options.resetReporters !== false &&
    typeof jasmineEnv.clearReporters === 'function'
  ) {
    jasmineEnv.clearReporters();
  }

  if (
    options.reporter &&
    typeof jasmineEnv.addReporter === 'function'
  ) {
    jasmineEnv.addReporter(options.reporter);
  }

  return {
    jasmineEnv,
    jasmineInstance,
    catalog: utils.getCatalog(),
    utils,
  };
}

export function getEmbeddedNodeJasmineRuntimeSource(): string {
  return [
    getEmbeddedTestCatalogSource(),
    [
      getAllSpecsFromEnv,
      getAllSuitesFromEnv,
      orderJasmineItems,
      createJasmineRuntimeUtils,
      exposeNodeJasmineGlobals,
      initializeNodeJasmineEnvironment,
    ]
      .map((fn) => fn.toString())
      .join('\n\n'),
  ].join('\n\n');
}
