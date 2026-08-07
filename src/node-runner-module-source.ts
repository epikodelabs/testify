import type { ViteJasmineConfig } from './vite-jasmine-config';
import { EXIT_CODES } from './exit-codes';
import { NodeRunnerMessages } from './log-messages';
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

  const messages = {
    unhandledRejection:
      NodeRunnerMessages.unhandledRejection(''),
    uncaughtException:
      NodeRunnerMessages.uncaughtException(''),
    caughtSignal:
      NodeRunnerMessages.caughtSignal(''),
    errorDuringExecution:
      NodeRunnerMessages.errorDuringExecution(''),
  };

  return `// Auto-generated in-process Jasmine test runner
import { pathToFileURL } from 'url';

function replacePlaceholders(text) {
  if (!text) return text;

  const useEmoji =
    process.stdout?.isTTY &&
    !process.env.NO_EMOJI;

  return text
    .replace(/%check%/g, useEmoji ? '✅' : '[OK]')
    .replace(/%cross%/g, useEmoji ? '❌' : '[ERROR]')
    .replace(/%warn%/g, useEmoji ? '⚠️' : '[WARN]')
    .replace(/%info%/g, useEmoji ? 'ℹ️' : '[INFO]');
}

${jasmineRuntimeSource}

${catalogIndexSource}

${executionPlanSource}

${nodeExecutionAdapterSource}

${catalogQuerySource}

${runnerSessionSource}

let jasmineRuntime = null;
let currentSession = null;

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
  const envValue =
    process.env.TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS;

  const shouldSilenceConsole =
    envValue === '1' ||
    envValue?.toLowerCase() === 'true';

  const originalConsole = {};

  const restoreConsole = () => {
    for (
      const [method, value] of
      Object.entries(originalConsole)
    ) {
      console[method] = value;
    }
  };

  if (shouldSilenceConsole) {
    const silentMethods = [
      'log',
      'info',
      'debug',
      'trace',
      'warn',
      'table',
    ];

    for (const method of silentMethods) {
      if (
        typeof console[method] === 'function'
      ) {
        originalConsole[method] =
          console[method];

        console[method] = () => {};
      }
    }
  }

  return new Promise((resolve) => {
    const ownedHandlers = [];

    const onUnhandledRejection = (error) => {
      console.error(
        replacePlaceholders(
          ${JSON.stringify("UNHANDLED_REJECTION_PLACEHOLDER")}
        ) +
        (
          error instanceof Error
            ? error.message
            : String(error)
        )
      );

      process.exit(
        ${EXIT_CODES.INTERNAL_ERROR}
      );
    };

    const onUncaughtException = (error) => {
      console.error(
        replacePlaceholders(
          ${JSON.stringify("UNCAUGHT_EXCEPTION_PLACEHOLDER")}
        ) +
        (
          error instanceof Error
            ? error.message
            : String(error)
        )
      );

      process.exit(
        ${EXIT_CODES.INTERNAL_ERROR}
      );
    };

    process.on(
      'unhandledRejection',
      onUnhandledRejection,
    );

    process.on(
      'uncaughtException',
      onUncaughtException,
    );

    ownedHandlers.push(
      {
        event: 'unhandledRejection',
        handler: onUnhandledRejection,
      },
      {
        event: 'uncaughtException',
        handler: onUncaughtException,
      },
    );

    if (
      import.meta.url ===
      pathToFileURL(process.argv[1]).href
    ) {
      const onExit = (signal) => {
        console.log(
          replacePlaceholders(
            ${JSON.stringify("CAUGHT_SIGNAL_PLACEHOLDER")}
          ) + signal
        );

        process.exit(
          signal === 'SIGTERM'
            ? ${EXIT_CODES.SIGTERM}
            : ${EXIT_CODES.SIGINT}
        );
      };

      process.on('SIGINT', onExit);
      process.on('SIGTERM', onExit);

      ownedHandlers.push(
        {
          event: 'SIGINT',
          handler: onExit,
        },
        {
          event: 'SIGTERM',
          handler: onExit,
        },
      );
    }

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

        await currentSession.run(
          selector,
        );

        const failures =
          reporter &&
          typeof reporter === 'object'
            ? reporter.failureCount || 0
            : 0;

        const pending =
          reporter &&
          typeof reporter === 'object'
            ? (
                reporter.pendingSpecs?.length ||
                0
              )
            : 0;

        if (failures > 0) {
          resolve(
            ${EXIT_CODES.TEST_FAILURES}
          );
        } else if (pending > 0) {
          resolve(
            ${EXIT_CODES.SUCCESS_WITH_PENDING}
          );
        } else {
          resolve(
            ${EXIT_CODES.SUCCESS}
          );
        }
      } catch (error) {
        console.error(
          replacePlaceholders(
            ${JSON.stringify("ERROR_DURING_EXECUTION_PLACEHOLDER")}
          ) +
          (
            error instanceof Error
              ? error.message
              : String(error)
          )
        );

        if (
          error instanceof Error &&
          error.stack
        ) {
          console.error(
            error.stack,
          );
        }

        resolve(
          ${EXIT_CODES.INTERNAL_ERROR}
        );
      } finally {
        currentSession = null;
        jasmineRuntime = null;
        restoreConsole();

        for (const h of ownedHandlers) {
          process.off(
            h.event,
            h.handler,
          );
        }
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
      'UNHANDLED_REJECTION_PLACEHOLDER',
      messages.unhandledRejection,
    )
    .replace(
      'UNCAUGHT_EXCEPTION_PLACEHOLDER',
      messages.uncaughtException,
    )
    .replace(
      'CAUGHT_SIGNAL_PLACEHOLDER',
      messages.caughtSignal,
    )
    .replace(
      'ERROR_DURING_EXECUTION_PLACEHOLDER',
      messages.errorDuringExecution,
    )
    .replace(
      'JASMINE_CORE_URL_PLACEHOLDER',
      jasmineCoreUrl,
    );
}
