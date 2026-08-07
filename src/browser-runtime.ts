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
  getEmbeddedCatalogQuerySource,
} from './catalog-query';

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

  const runnerSessionSource =
    getEmbeddedRunnerSessionSource();

  return `
(function(globalThis) {
  ${catalogSource}

  ${catalogIndexSource}

  ${selectionSource}

  ${executionPlanSource}

  ${catalogQuerySource}

  ${runnerSessionSource}

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
        '✅ Jasmine environment found',
      );
    } catch (error) {
      console.error(
        '⚠️  Jasmine environment not found:',
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

    const inBrowserReporter = {
      results: [],
      currentSpecIdSet: null,

      jasmineStarted() {
        this.results = [];
      },

      specStarted(config) {
        if (
          this.currentSpecIdSet?.has(
            config.id,
          )
        ) {
          console.log(
            \`▶️ Running [\${config.id}]: \${config.description}\`,
          );
        }
      },

      specDone(result) {
        if (
          !this.currentSpecIdSet?.has(
            result.id,
          )
        ) {
          return;
        }

        this.results.push(result);

        console.log(
          \`[\${result.status.toUpperCase()}] \${result.description}\`,
        );

        result.failedExpectations?.forEach(
          (failure) =>
            console.error(
              '❌',
              failure.message,
              failure.stack
                ? '\\n' + failure.stack
                : '',
            ),
        );
      },

      jasmineDone() {
        if (originalSpecFilter !== null) {
          env.configure({
            specFilter:
              originalSpecFilter,
          });
        }

        isExecuting = false;
      },
    };

    env.addReporter(
      inBrowserReporter,
    );

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
          '⚠️  Execution already in progress. Please wait...',
        );
        return [];
      }

      if (!plan.specIds.length) {
        return [];
      }

      return new Promise((resolve) => {
        isExecuting = true;

        inBrowserReporter.results = [];

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
          () => {
            originalDone.call(
              inBrowserReporter,
            );

            resolve(
              inBrowserReporter.results,
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

    async function runTests(filters) {
      const catalog = getCatalog();

      if (filters === undefined) {
        return executePlan(
          createExecutionPlan(
            catalog,
            undefined,
            currentPlanOptions(),
          ),
        );
      }

      const filterArr =
        Array.isArray(filters)
          ? filters
          : [filters];

      const specIds = [
        ...new Set(
          filterArr.flatMap(
            (filter) =>
              resolveTestSelector(
                catalog,
                { spec: filter },
              ),
          ),
        ),
      ];

      if (!specIds.length) {
        console.warn(
          'No matching specs found for:',
          filters,
        );
        return [];
      }

      return executePlan({
        specIds,
        ...currentPlanOptions(),
        source: {
          kind: 'spec',
        },
      });
    }

    async function runTest(filter) {
      if (Array.isArray(filter)) {
        throw new Error(
          'runTest() only accepts a single spec or RegExp, not an array.',
        );
      }

      return executePlan(
        createSpecExecutionPlan(
          getCatalog(),
          filter,
          currentPlanOptions(),
        ),
      );
    }

    async function runSuite(selector) {
      const plan =
        createSuiteExecutionPlan(
          getCatalog(),
          selector,
          currentPlanOptions(),
        );

      if (!plan.specIds.length) {
        console.warn(
          'No matching suites found for:',
          selector,
        );
        return [];
      }

      return executePlan(plan);
    }

    async function runFile(selector) {
      const plan =
        createFileExecutionPlan(
          getCatalog(),
          selector,
          currentPlanOptions(),
        );

      if (!plan.specIds.length) {
        console.warn(
          'No matching spec files found for:',
          selector,
        );
        return [];
      }

      return executePlan(plan);
    }

    async function run(selector) {
      const plan =
        createExecutionPlan(
          getCatalog(),
          selector,
          currentPlanOptions(),
        );

      if (!plan.specIds.length) {
        console.warn(
          'No matching tests found for:',
          selector,
        );
        return [];
      }

      return executePlan(plan);
    }

    function listTests() {
      const rows =
        session.listTests();

      console.table(rows);
      return rows;
    }

    function listSuites() {
      const rows =
        session.listSuites();

      console.table(rows);
      return rows;
    }

    function listFiles() {
      const rows =
        session.listFiles();

      console.table(rows);
      return rows;
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

    globalThis.runner = {
      session,
      execute: (plan) =>
        session.execute(plan),
      run: (selector) =>
        session.run(selector),
      runTests,
      runTest: (selector) =>
        session.runSpec(selector),
      runSuite: (selector) =>
        session.runSuite(selector),
      runFile: (selector) =>
        session.runFile(selector),
      listTests,
      listSuites,
      listFiles,
      findTests: (selector) =>
        session.findTests(selector),
      findSuites: (selector) =>
        session.findSuites(selector),
      findFiles: (selector) =>
        session.findFiles(selector),
      catalog: getCatalog,
      setSeed,
      resetSeed,
      reload: () =>
        location.reload(),
    };

    console.log(
      '%c✅ Testify runner ready!',
      'color: green; font-weight: bold;',
    );
  }

  init().catch((error) => {
    console.error(
      'Failed to initialize runner:',
      error,
    );
  });
})(window);
`;
}
