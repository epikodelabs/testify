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
    let revision = 1;

    const createPlan = (
      specIds: string[],
      source: any,
      options: any = {},
    ) => {
      const descriptors =
        specIds.map(
          (id) => ({
            id,
            description: id,
            fullName: id,
            file: 'fixture.spec.ts',
          }),
        );

      const plan: any = {
        specIds: [...specIds],
        source,
        catalogVersion: revision,
        ...options,
      };

      plan.tests = () => descriptors;
      plan.filter = (predicate: any) => {
        const selected = descriptors.filter(predicate);
        return createPlan(
          selected.map((test) => test.id),
          source,
          options,
        );
      };
      plan.slice = (start?: number, end?: number) => {
        const selected = descriptors.slice(start, end);
        return createPlan(
          selected.map((test) => test.id),
          source,
          options,
        );
      };

      return plan;
    };

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
      plan: (selector?: any, options: any = {}) =>
        createPlan(
          ['failed-spec', 'spec-1'],
          selector === undefined
            ? { kind: 'all' }
            : { kind: 'selector', selector },
          options,
        ),
      planSpec: (selector: any, options: any = {}) =>
        createPlan(
          ['spec-1'],
          { kind: 'spec', selector },
          options,
        ),
      planSuite: (selector: any, options: any = {}) =>
        createPlan(
          ['spec-1'],
          { kind: 'suite', selector },
          options,
        ),
      planFile: (selector: any, options: any = {}) =>
        createPlan(
          ['spec-1'],
          { kind: 'file', selector },
          options,
        ),
      tests: () => [{ id: 'spec-1' }],
      suites: () => [{ id: 'suite-1' }],
      files: () => [{ file: 'fixture.spec.ts' }],
      catalog: () => ({
        specs: [
          {
            id: 'failed-spec',
            fullName: 'failed-spec',
          },
          {
            id: 'spec-1',
            fullName: 'spec-1',
          },
        ],
      }),
      revision: () => revision,
      setRevision(value: number) {
        revision = value;
      },
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

  it('stores one execution record behind last()', async () => {
    const harness = createHarness();

    try {
      await harness.session.runSuite(
        'Forms',
      );

      const last =
        harness.session.last();

      expect(last.plan.source.kind)
        .toBe('suite');
      expect(last.result.specResults)
        .toHaveSize(1);
      expect(last.intent).toEqual({
        kind: 'suite',
        selector: 'Forms',
        options: {},
      });
      expect(last.revision).toBe(1);
    } finally {
      harness.restore();
    }
  });

  it('rerun replans the previous intent against the current revision', async () => {
    const harness = createHarness();

    try {
      await harness.session.runSuite(
        'Forms',
      );

      harness.session.setRevision(2);

      await harness.session.rerun();

      expect(
        harness.executedPlans,
      ).toHaveSize(2);
      expect(
        harness.executedPlans.at(-1)
          .catalogVersion,
      ).toBe(2);
      expect(
        harness.session.last().intent.kind,
      ).toBe('suite');
    } finally {
      harness.restore();
    }
  });

  it('execute records an exact-plan intent and rerun reuses that plan', async () => {
    const harness = createHarness();

    try {
      const plan = {
        specIds: ['spec-1'],
        source: {
          kind: 'spec',
          selector: 'spec-1',
        },
        catalogVersion: 1,
      };

      await harness.session.execute(plan);
      harness.session.setRevision(2);
      await harness.session.rerun();

      expect(
        harness.executedPlans.at(-1),
      ).toBe(plan);
      expect(
        harness.session.last().intent.kind,
      ).toBe('plan');
    } finally {
      harness.restore();
    }
  });

  it('failures derives failures from the last execution', async () => {
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

      expect(
        harness.session.failures(),
      ).toHaveSize(1);
    } finally {
      harness.restore();
    }
  });

  it('retry resolves previous failures against the current catalog', async () => {
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

      harness.session.setRevision(2);

      await harness.session.retry();

      expect(
        harness.executedPlans.at(-1)
          .specIds,
      ).toEqual(['failed-spec']);
      expect(
        harness.executedPlans.at(-1)
          .catalogVersion,
      ).toBe(2);
      expect(
        harness.session.last().intent.kind,
      ).toBe('retry');
    } finally {
      harness.restore();
    }
  });

  it('keeps discovery and failure collections observable even when empty', async () => {
    const harness = createHarness();

    try {
      const tests =
        harness.session.tests('missing');

      expect(
        (tests as any).__testifyCollectionKind,
      ).toBe('tests');

      const failures =
        harness.session.failures();

      expect(
        (failures as any).__testifyCollectionKind,
      ).toBe('results');
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

  it('keeps help synchronized with the execution language', () => {
    const harness = createHarness();

    try {
      const help =
        harness.session.help();

      for (const command of [
        'session.tests()',
        'session.suites()',
        'session.files()',
        'session.last()',
        'session.failures()',
        'await session.rerun()',
        'await session.retry()',
        'session.refresh()',
        'session.plan(selector, options)',
        'plan.tests()',
        'plan.filter(test => ...)',
        'plan.slice(start, end)',
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

      expect(
        help.some(
          (line: string) =>
            line.includes(
              'useful when inspected directly',
            ),
        ),
      ).toBeTrue();

      for (const removed of [
        'session.failed()',
        'session.rerunFailed()',
        'session.lastPlan()',
      ]) {
        expect(
          help.some(
            (line: string) =>
              line.includes(removed),
          ),
        ).toBeFalse();
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
