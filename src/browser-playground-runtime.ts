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
  const baseTests =
    session.tests.bind(session);
  const baseSuites =
    session.suites.bind(session);
  const baseFiles =
    session.files.bind(session);
  const basePlan =
    session.plan.bind(session);
  const basePlanSpec =
    session.planSpec.bind(session);
  const basePlanSuite =
    session.planSuite.bind(session);
  const basePlanFile =
    session.planFile.bind(session);

  function observableCollection(
    kind,
    values,
  ) {
    Object.defineProperty(
      values,
      '__testifyCollectionKind',
      {
        enumerable: false,
        configurable: true,
        writable: false,
        value: kind,
      },
    );

    return values;
  }

  let lastExecution = null;

  function emptyResult() {
    return summarizeExecutionResults([]);
  }

  async function executeRecordedPlan(
    plan,
    intent,
  ) {
    const result =
      await executeSessionPlan(
        plan,
      );

    lastExecution = {
      plan,
      result,
      intent,
      revision:
        plan.catalogVersion ??
        session.revision(),
    };

    return result;
  }

  function collectFailures() {
    const failed =
      lastExecution?.result?.specResults?.filter(
        (result) =>
          result.status === 'failed',
      ) ?? [];

    if (!lastExecution) {
      console.info(
        '[Testify] Nothing has run yet.',
      );

      return observableCollection(
        'results',
        [],
      );
    }

    if (!failed.length) {
      console.info(
        '[Testify] No failures in the last run.',
      );

      return observableCollection(
        'results',
        [],
      );
    }

    return observableCollection(
      'results',
      failed,
    );
  }

  function resolveFailureSpecIds(
    failures,
    tests,
  ) {
    const failedNames =
      new Set(
        failures
          .map(
            (result) =>
              result.fullName,
          )
          .filter(Boolean),
      );

    const failedIds =
      new Set(
        failures.map(
          (result) =>
            result.id,
        ),
      );

    return tests
      .filter(
        (test) =>
          failedIds.has(
            test.id,
          ) ||
          failedNames.has(
            test.fullName,
          ),
      )
      .map(
        (test) =>
          test.id,
      );
  }

  function planIntent(intent) {
    switch (intent?.kind) {
      case 'all':
        return basePlan();

      case 'run':
        return basePlan(
          intent.selector,
          intent.options,
        );

      case 'spec':
        return basePlanSpec(
          intent.selector,
          intent.options,
        );

      case 'suite':
        return basePlanSuite(
          intent.selector,
          intent.options,
        );

      case 'file':
        return basePlanFile(
          intent.selector,
          intent.options,
        );

      case 'retry': {
        const plan =
          basePlan(
            undefined,
            currentPlanOptions(),
          );
        const specIds =
          resolveFailureSpecIds(
            intent.failures,
            plan.tests(),
          );

        if (!specIds.length) {
          return null;
        }

        const selectedIds =
          new Set(specIds);

        return plan
          .filter(
            (test) =>
              selectedIds.has(
                test.id,
              ),
          );
      }

      case 'plan':
      default:
        return lastExecution?.plan ?? null;
    }
  }

  async function rerunLastExecution() {
    if (!lastExecution) {
      console.info(
        '[Testify] Nothing to rerun yet.',
      );

      return emptyResult();
    }

    const plan =
      planIntent(
        lastExecution.intent,
      );

    if (!plan) {
      console.warn(
        '[Testify] The previous selection is no longer present in the current catalog.',
      );

      return emptyResult();
    }

    return executeRecordedPlan(
      plan,
      lastExecution.intent,
    );
  }

  async function retryFailures() {
    const failures =
      collectFailures();

    if (!failures.length) {
      return emptyResult();
    }

    const intent = {
      kind: 'retry',
      failures: failures.map(
        (result) => ({
          id: result.id,
          fullName: result.fullName,
        }),
      ),
    };

    const plan =
      planIntent(intent);

    if (!plan) {
      console.warn(
        '[Testify] Previous failures are no longer present in the current catalog.',
      );

      return emptyResult();
    }

    return executeRecordedPlan(
      plan,
      intent,
    );
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

      return emptyResult();
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

      return emptyResult();
    }

    if (matches.length > 1) {
      console.info(
        '[Testify] ' + matches.length + ' ' + kind + 's matched ' + formatSelector(selector) + '.',
      );

      console.info(
        observableCollection(
          kind === 'spec'
            ? 'tests'
            : kind === 'suite'
              ? 'suites'
              : 'files',
          matches,
        ),
      );
    }

    const intent = {
      kind,
      selector,
      options,
    };

    return executeRecordedPlan(
      planMatches(
        selector,
        options,
      ),
      intent,
    );
  }

  function printSessionHelp() {
    const lines = [
      'Testify Playground session',
      '',
      'Discover',
      '  session.tests(selector?)                 Tests in the current catalog',
      '  session.suites(selector?)                Suites in the current catalog',
      '  session.files(selector?)                 Files in the current catalog',
      '',
      'Run',
      '  await session.run(selector?, options?)   New intent → fresh plan → execute',
      "  await session.runSpec('<spec>', options?)",
      "  await session.runSuite('<suite>', options?)",
      "  await session.runFile('<file>', options?)",
      '  await session.rerun()                    Previous intent → fresh plan → execute',
      '  await session.retry()                    Previous failures → fresh plan → execute',
      '',
      'Inspect',
      '  session.last()                           Last execution record',
      '  session.failures()                       Failures from the last execution',
      '',
      'Plan',
      '  session.plan(selector?, options?)        Resolve intent without executing',
      '  session.planSpec(selector, options?)',
      '  session.planSuite(selector, options?)',
      '  session.planFile(selector, options?)',
      '  plan.tests()                             Exact tests selected by the plan',
      '  plan.filter(test => ...)                 Create a filtered plan',
      '  plan.slice(start, end)                   Create a positional subset',
      '  await session.execute(plan)              Execute this exact plan',
      '  session.shard(plan, index, count)',
      '  session.partition(plan, count)',
      '',
      'Session',
      '  session.state',
      '  session.stats()',
      '  session.revision()',
      '  session.changes()',
      '  session.refresh()',
      '  session.setSeed(12345)',
      '  session.resetSeed()',
      '  session.reload()',
      '  await session.exit()',
      '',
      'Every Playground value is designed to be useful when inspected directly.',
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

      tests: (selector) =>
        observableCollection(
          'tests',
          baseTests(selector),
        ),

      suites: (selector) =>
        observableCollection(
          'suites',
          baseSuites(selector),
        ),

      files: (selector) =>
        observableCollection(
          'files',
          baseFiles(selector),
        ),

      execute: (plan) =>
        executeRecordedPlan(
          plan,
          {
            kind: 'plan',
          },
        ),

      run: (
        selector,
        options = {},
      ) => {
        const intent =
          selector === undefined
            ? {
                kind: 'all',
              }
            : {
                kind: 'run',
                selector,
                options,
              };

        return executeRecordedPlan(
          session.plan(
            selector,
            options,
          ),
          intent,
        );
      },

      runSpec: (
        selector,
        options = {},
      ) =>
        runSelection(
          'spec',
          selector,
          options,
          (value) =>
            session.tests(value),
          (value, nextOptions) =>
            session.planSpec(
              value,
              nextOptions,
            ),
          'session.tests(...)',
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
            session.suites(value),
          (value, nextOptions) =>
            session.planSuite(
              value,
              nextOptions,
            ),
          'session.suites(...)',
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
            session.files(value),
          (value, nextOptions) =>
            session.planFile(
              value,
              nextOptions,
            ),
          'session.files(...)',
        ),

      last: () =>
        lastExecution,

      failures:
        collectFailures,

      rerun:
        rerunLastExecution,

      retry:
        retryFailures,

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
    '💡 Browser console: session.help() · session.tests() · session.retry()',
  );

  return session;
}
`;
}
