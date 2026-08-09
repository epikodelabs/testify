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

  const helpEntries = Object.freeze([
    { section: 'Discover', usage: 'session.tests(selector?)', description: 'Tests in the current catalog' },
    { section: 'Discover', usage: 'session.suites(selector?)', description: 'Suites in the current catalog' },
    { section: 'Discover', usage: 'session.files(selector?)', description: 'Files in the current catalog' },

    { section: 'Run', usage: 'await session.run(selector?, options?)', description: 'Resolve new intent, create a fresh plan, and execute it' },
    { section: 'Run', usage: 'await session.runSpec(selector, options?)', description: 'Run matching specs' },
    { section: 'Run', usage: 'await session.runSuite(selector, options?)', description: 'Run matching suites' },
    { section: 'Run', usage: 'await session.runFile(selector, options?)', description: 'Run matching files' },
    { section: 'Run', usage: 'await session.rerun()', description: 'Repeat the previous execution intent against the current catalog' },
    { section: 'Run', usage: 'await session.retry()', description: 'Retry previous failures against the current catalog' },

    { section: 'Plan', usage: 'session.plan(selector?, options?)', description: 'Resolve test intent without executing it' },
    { section: 'Plan', usage: 'session.planSpec(selector, options?)', description: 'Create a plan from matching specs' },
    { section: 'Plan', usage: 'session.planSuite(selector, options?)', description: 'Create a plan from matching suites' },
    { section: 'Plan', usage: 'session.planFile(selector, options?)', description: 'Create a plan from matching files' },
    { section: 'Plan', usage: 'plan.tests()', description: 'Exact tests selected by the plan' },
    { section: 'Plan', usage: 'plan.filter(test => ...)', description: 'Create a filtered plan' },
    { section: 'Plan', usage: 'plan.slice(start, end)', description: 'Create a positional subset' },
    { section: 'Plan', usage: 'plan.add(other)', description: 'Combine compatible plans' },
    { section: 'Plan', usage: 'plan.subtract(other)', description: 'Remove tests contained in another compatible plan' },
    { section: 'Plan', usage: 'plan.intersect(other)', description: 'Keep tests shared by compatible plans' },
    { section: 'Plan', usage: 'plan.not()', description: 'Select the catalog complement of this plan' },
    { section: 'Plan', usage: 'plan.passed(result)', description: 'Keep tests that passed in the execution result' },
    { section: 'Plan', usage: 'plan.failed(result)', description: 'Keep tests that failed in the execution result' },
    { section: 'Plan', usage: 'plan.unresolved(result)', description: 'Keep tests without a definitive pass/fail outcome' },
    { section: 'Plan', usage: 'await session.execute(plan)', description: 'Execute this exact plan' },
    { section: 'Plan', usage: 'session.shard(plan, index, count)', description: 'Create one deterministic shard' },
    { section: 'Plan', usage: 'session.partition(plan, count)', description: 'Partition a plan into deterministic shards' },

    { section: 'Session', usage: 'session.state', description: 'Current session state' },
    { section: 'Session', usage: 'session.stats()', description: 'Current session statistics' },
    { section: 'Session', usage: 'session.revision()', description: 'Current catalog revision' },
    { section: 'Session', usage: 'session.changes()', description: 'Catalog changes from the latest refresh' },
    { section: 'Session', usage: 'session.refresh()', description: 'Refresh the current catalog' },
    { section: 'Session', usage: 'session.setSeed(12345)', description: 'Set the execution seed' },
    { section: 'Session', usage: 'session.resetSeed()', description: 'Reset the execution seed' },
    { section: 'Session', usage: 'session.reload()', description: 'Reload the Playground page' },
    { section: 'Session', usage: 'await session.exit()', description: 'Close the live session and browser' },
  ].map((entry) => Object.freeze(entry)));

  const helpSections = Object.freeze([
    'discover',
    'run',
    'plan',
    'session',
  ]);

  function sessionHelp(query) {
    if (
      query !== undefined &&
      typeof query !== 'string'
    ) {
      throw new TypeError(
        'session.help(query?) expects a string query.',
      );
    }

    const needle =
      query === undefined
        ? ''
        : query.trim().toLowerCase();

    const entries = !needle
      ? [...helpEntries]
      : helpEntries.filter((entry) =>
          [
            entry.section,
            entry.usage,
            entry.description,
          ].some((value) =>
            value.toLowerCase().includes(needle),
          ),
        );

    const help = observableCollection(
      'help',
      entries,
    );

    Object.defineProperty(
      help,
      '__testifyHelp',
      {
        enumerable: false,
        configurable: false,
        writable: false,
        value: Object.freeze({
          usage: 'session.help(query?)',
          query: needle || undefined,
          sections: helpSections,
          accepts: 'section name or free-text search',
        }),
      },
    );

    return help;
  }

  Object.assign(
    session,
    {
      help:
        sessionHelp,

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
