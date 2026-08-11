import {
  getEmbeddedTestCatalogSource,
} from './test-catalog';
import {
  getEmbeddedTestCatalogIndexSource,
} from './test-catalog-index';
import {
  getEmbeddedTestSelectionSource,
} from './test-selection';
import {
  getEmbeddedExecutionPlanSource,
} from './execution-plan';
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
  summarizeExecutionResults,
} from './execution-result';
import {
  getBrowserPlaygroundRuntimeSource,
} from './browser-playground-runtime';
import {
  getBrowserPlaygroundFormattersSource,
} from './browser-playground-formatters';

export interface BrowserRuntimeScriptOptions {
  stopOnSpecFailure: boolean;
  initialSeed: number;
  initialRandom: boolean;
}

export function getBrowserRuntimeScript(
  options: BrowserRuntimeScriptOptions,
): string {
  const {
    stopOnSpecFailure,
    initialSeed,
    initialRandom,
  } = options;

  const catalogSource =
    getEmbeddedTestCatalogSource();

  const catalogIndexSource =
    getEmbeddedTestCatalogIndexSource();

  const selectionSource =
    getEmbeddedTestSelectionSource();

  const executionPlanSource =
    getEmbeddedExecutionPlanSource();

  const catalogQuerySource =
    getEmbeddedCatalogQuerySource();

  const executionResultSource = [
    summarizeExecutionResults,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');

  const catalogStateSource =
    getEmbeddedCatalogStateSource();

  const planningEngineSource =
    getEmbeddedPlanningEngineSource();

  const runnerSessionSource =
    getEmbeddedRunnerSessionSource();

  const playgroundFormattersSource =
    getBrowserPlaygroundFormattersSource();

  const playgroundRuntimeSource =
    getBrowserPlaygroundRuntimeSource();

  return `
(function(globalThis) {
  ${catalogSource}

  ${catalogIndexSource}

  ${selectionSource}

  ${executionPlanSource}

  ${catalogQuerySource}

  ${executionResultSource}

  ${catalogStateSource}

  ${planningEngineSource}

  ${runnerSessionSource}

  ${playgroundFormattersSource}

  ${playgroundRuntimeSource}

  async function waitForJasmine(
    maxAttempts = 50,
    interval = 100,
  ) {
    return new Promise(
      (resolve, reject) => {
        let attempts = 0;

        function check() {
          if (globalThis.jasmine?.getEnv) {
            resolve(
              globalThis.jasmine.getEnv(),
            );
            return;
          }

          if (attempts >= maxAttempts) {
            reject(
              new Error(
                'Jasmine environment not found after waiting',
              ),
            );
            return;
          }

          attempts++;
          setTimeout(
            check,
            interval,
          );
        }

        check();
      },
    );
  }

  async function init() {
    let env;

    try {
      env = await waitForJasmine();
      console.log(
        'вњ… Jasmine environment found',
      );
    } catch (error) {
      console.error(
        'вљ пёЏ  Jasmine environment not found:',
        error.message,
      );
      return;
    }

    let random = ${initialRandom};
    let seed = ${initialSeed};
    const stopOnFailure =
      ${stopOnSpecFailure};

    env.configure({
      random,
      stopOnSpecFailure: stopOnFailure,
      seed,
      autoCleanClosures: false,
    });

    function getCatalog() {
      return createTestCatalogFromJasmineEnv(
        env,
      );
    }

    function getAllSpecs() {
      return getCatalog().specs;
    }

    function getAllSuites() {
      return getCatalog().suites;
    }

    function orderCatalogItems(
      items,
      currentSeed,
      currentRandom,
    ) {
      if (!currentRandom) return items;

      try {
        const order =
          new globalThis.jasmine.Order({
            random: currentRandom,
            seed: currentSeed,
          });

        return order.sort?.(items) ?? items;
      } catch {
        return items;
      }
    }

    function getOrderedSpecs(
      currentSeed,
      currentRandom,
    ) {
      return orderCatalogItems(
        getAllSpecs(),
        currentSeed,
        currentRandom,
      );
    }

    function getOrderedSuites(
      currentSeed,
      currentRandom,
    ) {
      return orderCatalogItems(
        getAllSuites(),
        currentSeed,
        currentRandom,
      );
    }

    globalThis.jasmine = {
      ...globalThis.jasmine,
      getCatalog,
      getAllSpecs,
      getAllSuites,
      getOrderedSpecs,
      getOrderedSuites,
    };

    let originalSpecFilter = null;
    let isExecuting = false;
    let currentSpecId = null;
    let errorHooksInstalled = false;

    function failureSignature(
      failure,
    ) {
      return [
        failure?.message || '',
        failure?.stack || '',
      ].join('\\n@@\\n');
    }

    function dedupeFailures(
      failures,
      excludedSignatures,
    ) {
      const seen = new Set();
      const deduped = [];

      for (const failure of failures || []) {
        const signature =
          failureSignature(
            failure,
          );

        if (
          excludedSignatures?.has(
            signature,
          ) ||
          seen.has(signature)
        ) {
          continue;
        }

        seen.add(signature);
        deduped.push(failure);
      }

      return deduped;
    }

    function describeThrownValue(
      value,
    ) {
      if (value instanceof Error) {
        return {
          message:
            value.message ||
            String(value),
          stack:
            value.stack ||
            value.message ||
            String(value),
        };
      }

      if (
        value &&
        typeof value === 'object'
      ) {
        const message =
          typeof value.message ===
          'string'
            ? value.message
            : (() => {
                try {
                  return JSON.stringify(
                    value,
                  );
                } catch {
                  return String(value);
                }
              })();

        return {
          message,
          stack:
            typeof value.stack ===
            'string'
              ? value.stack
              : undefined,
        };
      }

      return {
        message:
          typeof value === 'string'
            ? value
            : String(value),
        stack: undefined,
      };
    }

    function createFailure(
      type,
      value,
    ) {
      const details =
        describeThrownValue(
          value,
        );

      return {
        matcherName: '',
        passed: false,
        globalErrorType: type,
        message:
          details.message,
        stack: details.stack,
      };
    }

    const inBrowserReporter = {
      results: [],
      globalFailures: [],
      pendingSpecFailures: new Map(),
      attributedFailureSignatures:
        new Set(),
      currentSpecIdSet: null,

      jasmineStarted() {
        this.results = [];
        this.globalFailures = [];
        this.pendingSpecFailures.clear();
        this.attributedFailureSignatures.clear();
        currentSpecId = null;
      },

      recordAsyncFailure(
        type,
        value,
      ) {
        const failure =
          createFailure(
            type,
            value,
          );
        const signature =
          failureSignature(
            failure,
          );

        if (currentSpecId) {
          const pending =
            this.pendingSpecFailures.get(
              currentSpecId,
            ) ?? [];

          if (
            !pending.some(
              (entry) =>
                failureSignature(
                  entry,
                ) === signature,
            )
          ) {
            pending.push(
              failure,
            );
            this.pendingSpecFailures.set(
              currentSpecId,
              pending,
            );
          }

          this.attributedFailureSignatures.add(
            signature,
          );
          return;
        }

        if (
          this.globalFailures.some(
            (entry) =>
              failureSignature(
                entry,
              ) === signature,
          )
        ) {
          return;
        }

        this.globalFailures.push(
          failure,
        );
      },

      specStarted(config) {
        currentSpecId =
          config.id;

        if (
          this.currentSpecIdSet?.has(
            config.id,
          )
        ) {
          console.log(
            \`в–¶пёЏ Running [\${config.id}]: \${config.description}\`,
          );
        }
      },

      specDone(result) {
        const pending =
          this.pendingSpecFailures.get(
            result.id,
          ) ?? [];
        const mergedResult =
          pending.length > 0
            ? {
                ...result,
                status:
                  'failed',
                failedExpectations:
                  dedupeFailures([
                    ...(Array.isArray(
                      result.failedExpectations,
                    )
                      ? result.failedExpectations
                      : []),
                    ...pending,
                  ]),
              }
            : result;

        this.pendingSpecFailures.delete(
          result.id,
        );

        if (currentSpecId === result.id) {
          currentSpecId =
            null;
        }

        if (
          !this.currentSpecIdSet?.has(
            result.id,
          )
        ) {
          return;
        }

        this.results.push(
          mergedResult,
        );

        console.log(
          \`[\${mergedResult.status.toUpperCase()}] \${mergedResult.description}\`,
        );

        mergedResult.failedExpectations?.forEach(
          (failure) =>
            console.error(
              'вќЊ',
              failure.message,
              failure.stack
                ? '\\n' + failure.stack
                : '',
            ),
        );
      },

      jasmineDone(result) {
        currentSpecId = null;
        this.globalFailures =
          dedupeFailures(
            [
              ...(
                Array.isArray(
                  result?.failedExpectations,
                )
                  ? result.failedExpectations
                  : []
              ),
              ...this.globalFailures,
            ],
            this.attributedFailureSignatures,
          );

        if (originalSpecFilter !== null) {
          env.configure({
            specFilter:
              originalSpecFilter,
          });
        }

        isExecuting = false;
      },
    };

    function installErrorHooks() {
      if (errorHooksInstalled) {
        return;
      }

      errorHooksInstalled =
        true;

      window.addEventListener(
        'unhandledrejection',
        (event) => {
          inBrowserReporter.recordAsyncFailure(
            'unhandledRejection',
            event.reason,
          );
        },
      );

      window.addEventListener(
        'error',
        (event) => {
          if (event.error) {
            inBrowserReporter.recordAsyncFailure(
              'error',
              event.error,
            );
            return;
          }

          const location =
            typeof event.filename ===
              'string' &&
            event.filename
              ? event.filename +
                ':' +
                event.lineno +
                ':' +
                event.colno
              : undefined;

          inBrowserReporter.recordAsyncFailure(
            'error',
            {
              message:
                event.message ||
                'Uncaught browser error',
              stack: location,
            },
          );
        },
      );
    }

    env.addReporter(
      inBrowserReporter,
    );

    installErrorHooks();

    function resetEnvironment() {
      const resetNode = (node) => {
        if (node.result) {
          node.result = {
            status: 'pending',
            failedExpectations: [],
            passedExpectations: [],
          };
        }

        node.children?.forEach(
          resetNode,
        );
      };

      resetNode(
        env.topSuite(),
      );
    }

    async function executePlan(plan) {
      if (isExecuting) {
        console.warn(
          'вљ пёЏ  Execution already in progress. Please wait...',
        );
        return summarizeExecutionResults([]);
      }

      if (!plan.specIds.length) {
        return summarizeExecutionResults([]);
      }

      return new Promise((resolve) => {
        isExecuting = true;

        inBrowserReporter.results = [];
        inBrowserReporter.globalFailures = [];
        inBrowserReporter.pendingSpecFailures.clear();
        inBrowserReporter.attributedFailureSignatures.clear();
        currentSpecId = null;

        const specIdSet =
          new Set(plan.specIds);

        inBrowserReporter.currentSpecIdSet =
          specIdSet;

        if (originalSpecFilter === null) {
          originalSpecFilter =
            env.specFilter;
        }

        resetEnvironment();

        env.configure({
          random: plan.random,
          seed: plan.seed,
          stopOnSpecFailure:
            plan.stopOnFailure ??
            false,
          specFilter: (spec) =>
            specIdSet.has(spec.id),
          autoCleanClosures: false,
        });

        const originalDone =
          inBrowserReporter.jasmineDone;

        inBrowserReporter.jasmineDone =
          (result) => {
            originalDone.call(
              inBrowserReporter,
              result,
            );

            resolve(
              summarizeExecutionResults(
                inBrowserReporter.results,
                {
                  globalFailures:
                    inBrowserReporter.globalFailures,
                },
              ),
            );

            inBrowserReporter.jasmineDone =
              originalDone;
          };

        env.execute();
      });
    }

    function currentPlanOptions() {
      return {
        random,
        seed,
        stopOnFailure,
      };
    }

    function setSeed(nextSeed) {
      const parsed =
        Number(nextSeed);

      if (!Number.isFinite(parsed)) {
        console.warn(
          'Invalid seed (expected a number).',
        );
        return seed;
      }

      random = true;
      seed = parsed;

      env.configure({
        random,
        seed,
      });

      return seed;
    }

    function resetSeed() {
      random = false;
      seed = ${initialSeed};

      env.configure({
        random,
        seed,
      });

      return seed;
    }

    const session =
      new RunnerSession(
        getCatalog,
        {
          execute: executePlan,
        },
        currentPlanOptions,
      );

    installTestifyPlaygroundFormatters();

    installTestifyPlayground(
      session,
      {
        currentPlanOptions,
        setSeed,
        resetSeed,
        summarizeExecutionResults,
      },
    );
  }

  init().catch((error) => {
    console.error(
      'Failed to initialize Testify Playground:',
      error,
    );
  });
})(window);
`;
}
