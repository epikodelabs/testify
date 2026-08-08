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

    let lastExecutionResult = null;

    async function rememberExecution(
      work,
    ) {
      const result =
        await work();

      lastExecutionResult =
        result;

      return result;
    }

    const warnDeprecated = (() => {
      const shown = new Set();

      return (name, replacement) => {
        if (shown.has(name)) return;
        shown.add(name);

        console.warn(
          \`[Testify v2] runner.\${name}() is deprecated. Use \${replacement}.\`,
        );
      };
    })();


    function printRunnerHelp() {
      const lines = [
        'Testify interactive runner',
        '',
        'Discover',
        '  runner.listTests()              List tests with test ID and suite ID',
        '  runner.listSuites()             List suites and suite IDs',
        '  runner.listFiles()              List test files and spec counts',
        '',
        'Run',
        '  await runner.run()              Run all tests',
        "  await runner.runTest('<test>')  Run matching test(s)",
        "  await runner.runSuite('<suite>') Run matching suite(s)",
        "  await runner.runFile('<file>')  Run tests from matching file(s)",
        '',
        'Search',
        "  runner.findTests('snapshot')",
        "  runner.findSuites('Membrane')",
        "  runner.findFiles('lazy')",
        '  Strings and regular expressions are supported.',
        '',
        'Plan / inspect',
        '  runner.stats()                  Catalog counts',
        '  runner.catalog()                Raw test catalog',
        '  runner.revision()               Catalog revision',
        '  runner.planningStats()          Planning cache statistics',
        '  runner.plan(selector)           Create an execution plan',
        '  runner.planSpec(selector)',
        '  runner.planSuite(selector)',
        '  runner.planFile(selector)',
        '  await runner.execute(plan)',
        '',
        'Advanced',
        '  runner.shard(plan, index, count)',
        '  runner.partition(plan, count)',
        '  runner.setSeed(12345)',
        '  runner.resetSeed()',
        '  runner.reload()                 Reload the browser',
        '',
        'Examples',
        '  runner.listTests()',
        "  await runner.runTest('spec42')",
        "  await runner.runSuite('suite12')",
        "  await runner.runFile('lazy-snapshots.spec.js')",
      ];

      console.log(lines.join('\\n'));
      return lines;
    }

    function formatSelector(selector) {
      if (selector instanceof RegExp) {
        return selector.toString();
      }

      return JSON.stringify(selector);
    }

    async function runSelection(
      kind,
      selector,
      findMatches,
      runMatches,
      listCommand,
    ) {
      if (
        selector === undefined ||
        selector === null ||
        selector === ''
      ) {
        console.warn(
          `[Testify] Missing ${kind} selector.`,
        );

        console.info(
          `Try ${listCommand}`,
        );

        return summarizeExecutionResults([]);
      }

      const matches =
        findMatches(selector);

      if (!matches.length) {
        console.warn(
          `[Testify] No ${kind}s matched ${formatSelector(selector)}.`,
        );

        console.info(
          `Try ${listCommand}`,
        );

        return summarizeExecutionResults([]);
      }

      if (matches.length > 1) {
        console.info(
          `[Testify] ${matches.length} ${kind}s matched ${formatSelector(selector)}.`,
        );

        console.table(
          matches,
        );
      }

      return runMatches(
        selector,
      );
    }

    globalThis.runner = {
      session,

      help: printRunnerHelp,

      catalog: () =>
        session.catalog(),

      index: () =>
        session.index(),

      stats: () =>
        session.stats(),

      revision: () =>
        session.revision(),

      planningStats: () =>
        session.planningStats(),

      listTests: () => {
        const rows =
          session.listTests();
        console.table(rows);
        return rows;
      },

      listSuites: () => {
        const rows =
          session.listSuites();
        console.table(rows);
        return rows;
      },

      listFiles: () => {
        const rows =
          session.listFiles();
        console.table(rows);
        return rows;
      },

      findTests: (selector) =>
        session.findTests(selector),

      findSuites: (selector) =>
        session.findSuites(selector),

      findFiles: (selector) =>
        session.findFiles(selector),

      plan: (selector) =>
        session.plan(selector),

      planSpec: (selector) =>
        session.planSpec(selector),

      planSuite: (selector) =>
        session.planSuite(selector),

      planFile: (selector) =>
        session.planFile(selector),

      shard: (
        plan,
        index,
        count,
      ) =>
        session.shard(
          plan,
          index,
          count,
        ),

      partition: (
        plan,
        count,
      ) =>
        session.partition(
          plan,
          count,
        ),

      execute: (plan) =>
        session.execute(plan),

      run: (selector) =>
        rememberExecution(
          () =>
            session.run(
              selector,
            ),
        ),

      runTest: (selector) =>
        rememberExecution(
          () =>
            runSelection(
              'test',
              selector,
              (value) =>
                session.findTests(value),
              (value) =>
                session.runSpec(value),
              'runner.listTests() or runner.findTests(...)',
            ),
        ),

      runSuite: (selector) =>
        rememberExecution(
          () =>
            runSelection(
              'suite',
              selector,
              (value) =>
                session.findSuites(value),
              (value) =>
                session.runSuite(value),
              'runner.listSuites() or runner.findSuites(...)',
            ),
        ),

      runFile: (selector) =>
        rememberExecution(
          () =>
            runSelection(
              'file',
              selector,
              (value) =>
                session.findFiles(value),
              (value) =>
                session.runFile(value),
              'runner.listFiles() or runner.findFiles(...)',
            ),
        ),

      last: () =>
        lastExecutionResult,

      // Compatibility helper retained for v1 callers.
      runTests: (...args) => {
        warnDeprecated(
          'runTests',
          'runner.run() or runner.session.run()',
        );

        return rememberExecution(\n          () => runTests(...args),\n        );
      },

      setSeed,
      resetSeed,

      reload: () =>
        location.reload(),
    };

    console.log(
      '%c✅ Testify runner ready!',
      'color: green; font-weight: bold;',
    );
    console.log(
      '💡 Browser console: runner.help() · runner.listTests() · runner.last()',
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