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
  getEmbeddedCatalogStateSource,
} from './catalog-state';
import {
  getEmbeddedPlanningEngineSource,
} from './planning-engine';
import {
  getEmbeddedCatalogQuerySource,
} from './catalog-query';
import {
  getEmbeddedNameHelperSource,
} from './embedded-source';

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

  const nameHelperSource =
    getEmbeddedNameHelperSource();

  const catalogIndexSource =
    getEmbeddedTestCatalogIndexSource();

  const executionPlanSource =
    getEmbeddedExecutionPlanSource();

  const nodeExecutionAdapterSource =
    getEmbeddedNodeExecutionAdapterSource();

  const catalogQuerySource =
    getEmbeddedCatalogQuerySource();

  const catalogStateSource =
    getEmbeddedCatalogStateSource();

  const planningEngineSource =
    getEmbeddedPlanningEngineSource();

  const runnerSessionSource =
    getEmbeddedRunnerSessionSource();

  return `// Auto-generated in-process Jasmine test runner
${nameHelperSource}

${jasmineRuntimeSource}

${catalogIndexSource}

${executionPlanSource}

${nodeExecutionAdapterSource}

${catalogQuerySource}

${catalogStateSource}

${planningEngineSource}

${runnerSessionSource}

export async function run(reporter, selector) {
  const jasmineCore =
    await import(
      ${JSON.stringify("JASMINE_CORE_URL_PLACEHOLDER")}
    );

  const jasmineRequire =
    jasmineCore.default;

  const jasmineRuntime =
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

  const session =
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

  try {
    return await session.run(
      selector,
    );
  } finally {
    await session.close();
  }
}
`
    .replace(
      'JASMINE_CORE_URL_PLACEHOLDER',
      jasmineCoreUrl,
    );
}
