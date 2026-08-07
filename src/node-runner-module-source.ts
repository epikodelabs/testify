import type { ViteJasmineConfig } from './vite-jasmine-config';
import {
  getEmbeddedNodeJasmineRuntimeSource,
} from './jasmine-node-runtime';
import {
  getEmbeddedExecutionPlanSource,
} from './execution-plan';
import {
  getEmbeddedTestCatalogIndexSource,
} from './test-catalog-index';
import {
  getEmbeddedNodeExecutionAdapterSource,
} from './node-execution-adapter';
import {
  getEmbeddedRunnerSessionSource,
} from './runner-session';
import {
  getEmbeddedCatalogQuerySource,
} from './catalog-query';

export interface NodeRunnerModuleSourceOptions {
  jasmineCoreUrl: string;
  imports: string;
  config: ViteJasmineConfig;
}

export function createNodeRunnerModuleSource(
  options: NodeRunnerModuleSourceOptions,
): string {
  const {
    jasmineCoreUrl,
    imports,
    config,
  } = options;

  const jasmineRuntimeSource =
    getEmbeddedNodeJasmineRuntimeSource();

  const catalogIndexSource =
    getEmbeddedTestCatalogIndexSource();

  const executionPlanSource =
    getEmbeddedExecutionPlanSource();

  const nodeExecutionAdapterSource =
    getEmbeddedNodeExecutionAdapterSource();

  const catalogQuerySource =
    getEmbeddedCatalogQuerySource();

  const runnerSessionSource =
    getEmbeddedRunnerSessionSource();

  return `// Auto-generated in-process Jasmine test runner
${jasmineRuntimeSource}

${catalogIndexSource}

${executionPlanSource}

${nodeExecutionAdapterSource}

${catalogQuerySource}

${runnerSessionSource}

let jasmineRuntime = null;
let currentSession = null;

const warnedDeprecated =
  new Set();

function warnDeprecated(
  name,
  replacement,
) {
  if (warnedDeprecated.has(name)) {
    return;
  }

  warnedDeprecated.add(name);

  console.warn(
    \`[Testify v2] \${name}() is deprecated. Use \${replacement}.\`,
  );
}

export function getCatalog() {
  return jasmineRuntime?.utils.getCatalog() ?? {
    suites: [],
    specs: []
  };
}

export function getSession() {
  return currentSession;
}

export function getStats() {
  return currentSession?.stats?.() ?? {
    specs: 0,
    suites: 0,
    files: 0,
  };
}

export function getIndex() {
  return currentSession?.index?.() ?? null;
}

export function getAllSpecs() {
  warnDeprecated(
    'getAllSpecs',
    'getSession()?.listTests()',
  );
  return jasmineRuntime?.utils.getAllSpecs() ?? [];
}

export function getAllSuites() {
  warnDeprecated(
    'getAllSuites',
    'getSession()?.listSuites()',
  );
  return jasmineRuntime?.utils.getAllSuites() ?? [];
}

export function getOrderedSpecs(seed, random) {
  warnDeprecated(
    'getOrderedSpecs',
    'getSession()?.listTests()',
  );
  return jasmineRuntime?.utils.getOrderedSpecs(seed, random) ?? [];
}

export function getOrderedSuites(seed, random) {
  warnDeprecated(
    'getOrderedSuites',
    'getSession()?.listSuites()',
  );
  return jasmineRuntime?.utils.getOrderedSuites(seed, random) ?? [];
}

export function listTests() {
  return listCatalogTests(
    getCatalog(),
  );
}

export function listSuites() {
  return listCatalogSuites(
    getCatalog(),
  );
}

export function listFiles() {
  return listCatalogFiles(
    getCatalog(),
  );
}

export function findTests(selector) {
  return listCatalogTests(
    getCatalog(),
  ).filter(
    (row) =>
      findCatalogSpecs(
        getCatalog(),
        selector,
      ).some(
        (spec) => spec.id === row.id,
      ),
  );
}

export function findSuites(selector) {
  return listCatalogSuites(
    getCatalog(),
  ).filter(
    (row) =>
      findCatalogSuites(
        getCatalog(),
        selector,
      ).some(
        (suite) => suite.id === row.id,
      ),
  );
}

export function findFiles(selector) {
  const catalog = getCatalog();
  const index =
    createTestCatalogIndex(
      catalog,
    );

  const files =
    new Set(
      searchIndexEntries(
        index.fileSearch,
        selector,
      ),
    );

  return listCatalogFiles(
    catalog,
  ).filter(
    (row) =>
      files.has(row.file),
  );
}

export async function runTests(reporter, selector) {
  return new Promise((resolve, reject) => {
    (async function () {
      try {
        const jasmineCore =
          await import(
            ${JSON.stringify("JASMINE_CORE_URL_PLACEHOLDER")}
          );

        const jasmineRequire =
          jasmineCore.default;

        jasmineRuntime =
          initializeNodeJasmineEnvironment(
            jasmineRequire,
            { reporter },
          );

        const {
          jasmineEnv,
          utils,
        } = jasmineRuntime;

${imports}

        const catalog =
          utils.getCatalog();

        if (
          typeof reporter?.setCatalog ===
          'function'
        ) {
          reporter.setCatalog(catalog);
        } else if (
          typeof reporter?.userAgent ===
          'function'
        ) {
          reporter.userAgent(
            undefined,
            catalog,
          );
        }

        currentSession =
          new RunnerSession(
            () => catalog,
            {
              execute: (plan) =>
                executeNodePlan(
                  jasmineEnv,
                  plan,
                ),
            },
            () => ({
              random:
                ${config.jasmineConfig?.env?.random ?? false},
              seed:
                ${(config.jasmineConfig?.env as any)?.seed ?? 0},
              stopOnFailure:
                ${config.jasmineConfig?.env?.stopSpecOnExpectationFailure ?? false}
            }),
          );

        const result =
          await currentSession.run(
            selector,
          );

        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        currentSession = null;
        jasmineRuntime = null;
      }
    })();
  });
}

export async function runTest(
  reporter,
  selector
) {
  return runTests(
    reporter,
    { spec: selector }
  );
}

export async function runSuite(
  reporter,
  selector
) {
  return runTests(
    reporter,
    { suite: selector }
  );
}

export async function runFile(
  reporter,
  selector
) {
  return runTests(
    reporter,
    { file: selector }
  );
}
`
    .replace(
      'JASMINE_CORE_URL_PLACEHOLDER',
      jasmineCoreUrl,
    );
}
