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
  getEmbeddedNameHelperSource,
} from './embedded-source';

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

  const nameHelperSource =
    getEmbeddedNameHelperSource();

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

  return `
(function(globalThis) {
  ${nameHelperSource}

  ${catalogSource}

  ${catalogIndexSource}

  ${selectionSource}

  ${executionPlanSource}

  ${catalogQuerySource}

  ${executionResultSource}

  ${catalogStateSource}

  ${planningEngineSource}

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
        return summarizeExecutionResults([]);
      }

      if (!plan.specIds.length) {
        return summarizeExecutionResults([]);
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
              summarizeExecutionResults(
                inBrowserReporter.results,
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
        return summarizeExecutionResults([]);
      }

      return executePlan({
        specIds,
        ...currentPlanOptions(),
        source: {
          kind: 'spec',
        },
      });
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

    function printSessionHelp() {
      const sections = [
        {
          title: 'Discover',
          commands: [
            'session.tests()',
            'session.suites()',
            'session.files()',
          ],
        },
        {
          title: 'Run',
          commands: [
            'await session.run(selector, options)',
            "await session.runSpec('spec id or text', options)",
            "await session.runSuite('suite id or text', options)",
            "await session.runFile('file name or text', options)",
          ],
        },
        {
          title: 'Session',
          commands: [
            'session.state',
            'session.stats()',
            'session.revision()',
            'session.changes()',
            'session.refresh()',
            'session.planningStats()',
          ],
        },
        {
          title: 'Plan',
          commands: [
            'session.plan(selector, options)',
            'session.planSpec(selector, options)',
            'session.planSuite(selector, options)',
            'session.planFile(selector, options)',
            'await session.execute(plan)',
            'session.shard(plan, index, count)',
            'session.partition(plan, count)',
          ],
        },
        {
          title: 'Advanced',
          commands: [
            'session.query()',
            'session.catalog()',
            'session.index()',
            'session.invalidatePlans()',
            'session.setSeed(12345)',
            'session.resetSeed()',
            'session.reload()',
            'await session.exit()',
          ],
        },
      ];

      const lines = [
        'Testify Playground session',
        ...sections.flatMap(
          (section) => [
            '',
            section.title,
            ...section.commands.map(
              (command) =>
                '  ' + command,
            ),
          ],
        ),
      ];

      console.group(
        '💡 Testify Playground commands',
      );

      for (const section of sections) {
        console.log(
          '📁 ' + section.title,
        );

        for (const command of section.commands) {
          console.log(
            '  ' + command,
          );
        }
      }

      console.log(
        '💡 Tip: run session.help() again any time.',
      );

      console.groupEnd();

      return lines;
    }

    Object.assign(
      session,
      {
        help: printSessionHelp,
        setSeed,
        resetSeed,
        reload: () =>
          location.reload(),
        exit: async () => {
          const host =
            globalThis.__testifyHost;

          if (!host?.send) {
            throw new Error(
              'Testify host connection is unavailable.',
            );
          }

          host.send({
            type: 'session:exit',
            timestamp: Date.now(),
          });
        },
      },
    );

    globalThis.session = session;

    console.log(
      '%c✅ Testify Playground ready!',
      'color: green; font-weight: bold;',
    );
    printSessionHelp();
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