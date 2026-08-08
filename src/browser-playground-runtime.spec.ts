import {
  getBrowserPlaygroundRuntimeSource,
} from './browser-playground-runtime';

function loadInstaller(): (
  session: any,
  context: any,
) => any {
  const source =
    getBrowserPlaygroundRuntimeSource();

  return new Function(
    `${source}\nreturn installTestifyPlayground;`,
  )();
}

describe('Browser Playground runtime', () => {
  function createHarness() {
    const executedPlans: any[] = [];
    const hostMessages: any[] = [];

    const session: any = {
      state: 'ready',
      execute: async (plan: any) => {
        executedPlans.push(plan);
        return {
          specResults: plan.specIds.map(
            (id: string) => ({
              id,
              description: id,
              fullName: id,
              status:
                id === 'failed-spec'
                  ? 'failed'
                  : 'passed',
              failedExpectations:
                id === 'failed-spec'
                  ? [{}]
                  : [],
            }),
          ),
        };
      },
      plan: (selector?: any, options: any = {}) => ({
        specIds: ['spec-1'],
        source: selector === undefined
          ? { kind: 'all' }
          : { kind: 'selector', selector },
        catalogVersion: 1,
        ...options,
      }),
      planSpec: (selector: any, options: any = {}) => ({
        specIds: ['spec-1'],
        source: { kind: 'spec', selector },
        catalogVersion: 1,
        ...options,
      }),
      planSuite: (selector: any, options: any = {}) => ({
        specIds: ['spec-1'],
        source: { kind: 'suite', selector },
        catalogVersion: 1,
        ...options,
      }),
      planFile: (selector: any, options: any = {}) => ({
        specIds: ['spec-1'],
        source: { kind: 'file', selector },
        catalogVersion: 1,
        ...options,
      }),
      findTests: () => [{ id: 'spec-1' }],
      findSuites: () => [{ id: 'suite-1' }],
      findFiles: () => [{ file: 'fixture.spec.ts' }],
      catalog: () => ({
        specs: [
          {
            id: 'failed-spec',
            fullName: 'failed-spec',
          },
        ],
      }),
      revision: () => 1,
    };

    const previousHost =
      (globalThis as any).__testifyHost;
    const previousSession =
      (globalThis as any).session;

    (globalThis as any).__testifyHost = {
      send(message: any) {
        hostMessages.push(message);
      },
    };

    const install = loadInstaller();

    install(
      session,
      {
        currentPlanOptions: () => ({
          random: false,
          seed: 0,
          stopOnFailure: false,
        }),
        setSeed: () => 0,
        resetSeed: () => 0,
        summarizeExecutionResults: (
          specResults: any[],
        ) => ({ specResults }),
      },
    );

    return {
      session,
      executedPlans,
      hostMessages,
      restore() {
        (globalThis as any).__testifyHost =
          previousHost;
        (globalThis as any).session =
          previousSession;
      },
    };
  }

  it('installs the live RunnerSession as the Playground handle', () => {
    const harness = createHarness();

    try {
      expect(
        (globalThis as any).session,
      ).toBe(harness.session);
      expect(
        typeof harness.session.help,
      ).toBe('function');
      expect(
        typeof harness.session.exit,
      ).toBe('function');
    } finally {
      harness.restore();
    }
  });

  it('captures the last result and plan for reruns', async () => {
    const harness = createHarness();

    try {
      await harness.session.runSuite(
        'Forms',
      );

      expect(
        harness.session.lastPlan()
          .source.kind,
      ).toBe('suite');
      expect(
        harness.session.last()
          .specResults,
      ).toHaveSize(1);

      await harness.session.rerun();

      expect(
        harness.executedPlans,
      ).toHaveSize(2);
    } finally {
      harness.restore();
    }
  });

  it('reruns failed specs against the current catalog', async () => {
    const harness = createHarness();

    try {
      await harness.session.execute({
        specIds: ['failed-spec'],
        source: {
          kind: 'spec',
          selector: 'failed-spec',
        },
        catalogVersion: 1,
      });

      const failed =
        harness.session.failed();

      expect(failed).toHaveSize(1);

      await harness.session.rerunFailed();

      expect(
        harness.executedPlans.at(-1)
          .specIds,
      ).toEqual(['failed-spec']);
    } finally {
      harness.restore();
    }
  });

  it('sends exit through the host command channel', async () => {
    const harness = createHarness();

    try {
      await harness.session.exit();

      expect(
        harness.hostMessages[0]?.type,
      ).toBe('session:exit');
    } finally {
      harness.restore();
    }
  });

  it('keeps help synchronized with the Playground surface', () => {
    const harness = createHarness();

    try {
      const help =
        harness.session.help();

      for (const command of [
        'session.tests()',
        'session.suites()',
        'session.files()',
        'session.last()',
        'session.failed()',
        'await session.rerun()',
        'await session.rerunFailed()',
        'session.refresh()',
        'session.plan(selector, options)',
        'await session.execute(plan)',
        'await session.exit()',
      ]) {
        expect(
          help.some(
            (line: string) =>
              line.includes(command),
          ),
        ).toBeTrue();
      }
    } finally {
      harness.restore();
    }
  });

  it('generates syntactically valid browser JavaScript', () => {
    const source =
      getBrowserPlaygroundRuntimeSource();

    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
