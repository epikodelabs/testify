export function getBrowserPlaygroundRuntimeSource(): string {
  return `
function installTestifyPlayground(
  session,
  context,
) {
  const {
    currentPlanOptions,
    setSeed,
    resetSeed,
    summarizeExecutionResults,
  } = context;

  const executeSessionPlan =
    session.execute.bind(session);

  let lastExecutionResult = null;
  let lastExecutionPlan = null;

  async function rememberExecution(
    work,
  ) {
    const result =
      await work();

    lastExecutionResult =
      result;

    return result;
  }

  async function executeRememberedPlan(
    plan,
  ) {
    lastExecutionPlan =
      plan;

    return rememberExecution(
      () =>
        executeSessionPlan(
          plan,
        ),
    );
  }

  function replanLastExecution() {
    if (!lastExecutionPlan) {
      return null;
    }

    const source =
      lastExecutionPlan.source;

    if (
      !source ||
      source.kind === 'all'
    ) {
      return session.plan();
    }

    return session.plan(
      source.selector,
    );
  }

  async function rerunLastExecution() {
    const plan =
      replanLastExecution();

    if (!plan) {
      console.info(
        '[Testify] Nothing to rerun yet.',
      );

      return summarizeExecutionResults([]);
    }

    return executeRememberedPlan(
      plan,
    );
  }

  function getFailedResults() {
    const failed =
      lastExecutionResult?.specResults?.filter(
        (result) =>
          result.status === 'failed',
      ) ?? [];

    if (!lastExecutionResult) {
      console.info(
        '[Testify] No execution result yet.',
      );

      return [];
    }

    if (!failed.length) {
      console.info(
        '[Testify] No failed specs in the last run.',
      );

      return [];
    }

    console.table(
      failed.map(
        (result) => ({
          id:
            result.id,
          name:
            result.description,
          fullName:
            result.fullName ?? '',
          failures:
            result.failedExpectations?.length ?? 0,
        }),
      ),
    );

    return failed;
  }

  async function rerunFailedExecution() {
    const failed =
      getFailedResults();

    if (!failed.length) {
      return summarizeExecutionResults([]);
    }

    const catalog =
      session.catalog();

    const failedNames =
      new Set(
        failed
          .map(
            (result) =>
              result.fullName,
          )
          .filter(Boolean),
      );

    const failedIds =
      new Set(
        failed.map(
          (result) =>
            result.id,
        ),
      );

    const specIds =
      catalog.specs
        .filter(
          (spec) =>
            failedIds.has(
              spec.id,
            ) ||
            failedNames.has(
              spec.fullName,
            ),
        )
        .map(
          (spec) =>
            spec.id,
        );

    if (!specIds.length) {
      console.warn(
        '[Testify] Failed specs are no longer present in the current catalog.',
      );

      return summarizeExecutionResults([]);
    }

    return executeRememberedPlan({
      specIds,
      ...currentPlanOptions(),
      source: {
        kind: 'selector',
        selector: undefined,
      },
      catalogVersion:
        session.revision(),
    });
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
    options,
    findMatches,
    planMatches,
    listCommand,
  ) {
    if (
      selector === undefined ||
      selector === null ||
      selector === ''
    ) {
      console.warn(
        '[Testify] Missing ' + kind + ' selector.',
      );

      console.info(
        'Try ' + listCommand,
      );

      return summarizeExecutionResults([]);
    }

    const matches =
      findMatches(selector);

    if (!matches.length) {
      console.warn(
        '[Testify] No ' + kind + 's matched ' + formatSelector(selector) + '.',
      );

      console.info(
        'Try ' + listCommand,
      );

      return summarizeExecutionResults([]);
    }

    if (matches.length > 1) {
      console.info(
        '[Testify] ' + matches.length + ' ' + kind + 's matched ' + formatSelector(selector) + '.',
      );

      console.table(
        matches,
      );
    }

    return executeRememberedPlan(
      planMatches(
        selector,
        options,
      ),
    );
  }

  function printSessionHelp() {
    const lines = [
      'Testify Playground session',
      '',
      'Discover',
      '  session.tests()                         List tests; optional string/RegExp selector',
      '  session.suites()                        List suites; optional string/RegExp selector',
      '  session.files()                         List files; optional string/RegExp selector',
      '',
      'Run',
      '  await session.run(selector, options)    Run all or selected tests',
      "  await session.runSpec('<spec>', options)",
      "  await session.runSuite('<suite>', options)",
      "  await session.runFile('<file>', options)",
      '',
      'Inspect / rerun',
      '  session.last()                          Last execution result',
      '  session.lastPlan()                      Last execution plan',
      '  session.failed()                        Failed specs from the last run',
      '  await session.rerun()                   Re-plan and rerun the last selection',
      '  await session.rerunFailed()             Rerun failed specs against current catalog',
      '',
      'Session',
      '  session.state',
      '  session.stats()',
      '  session.revision()',
      '  session.changes()',
      '  session.refresh()',
      '  session.planningStats()',
      '',
      'Plan',
      '  session.plan(selector, options)',
      '  session.planSpec(selector, options)',
      '  session.planSuite(selector, options)',
      '  session.planFile(selector, options)',
      '  await session.execute(plan)',
      '  session.shard(plan, index, count)',
      '  session.partition(plan, count)',
      '',
      'Advanced',
      '  session.query()',
      '  session.catalog()',
      '  session.index()',
      '  session.invalidatePlans()',
      '  session.setSeed(12345)',
      '  session.resetSeed()',
      '  session.reload()',
      '  await session.exit()',
    ];

    console.log(
      lines.join('\\n'),
    );

    return lines;
  }

  Object.assign(
    session,
    {
      help:
        printSessionHelp,

      execute:
        executeRememberedPlan,

      run: (
        selector,
        options = {},
      ) =>
        executeRememberedPlan(
          session.plan(
            selector,
            options,
          ),
        ),

      runSpec: (
        selector,
        options = {},
      ) =>
        runSelection(
          'spec',
          selector,
          options,
          (value) =>
            session.findTests(value),
          (value, nextOptions) =>
            session.planSpec(
              value,
              nextOptions,
            ),
          'session.tests() or session.query().tests(...)',
        ),

      runSuite: (
        selector,
        options = {},
      ) =>
        runSelection(
          'suite',
          selector,
          options,
          (value) =>
            session.findSuites(value),
          (value, nextOptions) =>
            session.planSuite(
              value,
              nextOptions,
            ),
          'session.suites() or session.query().suites(...)',
        ),

      runFile: (
        selector,
        options = {},
      ) =>
        runSelection(
          'file',
          selector,
          options,
          (value) =>
            session.findFiles(value),
          (value, nextOptions) =>
            session.planFile(
              value,
              nextOptions,
            ),
          'session.files() or session.query().files(...)',
        ),

      last: () =>
        lastExecutionResult,

      lastPlan: () =>
        lastExecutionPlan,

      failed:
        getFailedResults,

      rerun:
        rerunLastExecution,

      rerunFailed:
        rerunFailedExecution,

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
  console.log(
    '💡 Browser console: session.help() · session.tests() · session.rerunFailed()',
  );

  return session;
}
`;
}
