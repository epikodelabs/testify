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

  it('keeps previous execution state private', async () => {
    const harness = createHarness();

    try {
      await harness.session.runSuite(
        'Forms',
      );

      expect(
        harness.session.last,
      ).toBeUndefined();
      expect(
        harness.session.failures,
      ).toBeUndefined();
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
        harness.executedPlans.at(-1)
          .source.kind,
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
        harness.executedPlans.at(-1),
      ).toBe(plan);
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
        harness.executedPlans.at(-1)
          .catalogVersion,
      ).toBe(2);
    } finally {
      harness.restore();
    }
  });

  it('keeps discovery collections observable even when empty', () => {
    const harness = createHarness();

    try {
      const tests =
        harness.session.tests('missing');

      expect(
        (tests as any).__testifyCollectionKind,
      ).toBe('tests');
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

  it('keeps searchable help synchronized with the execution language', () => {
    const harness = createHarness();

    try {
      const help =
        harness.session.help();

      expect(
        (help as any).__testifyCollectionKind,
      ).toBe('help');

      const usages = help.map(
        (entry: any) => entry.usage,
      );

      for (const command of [
        'session.tests(selector?)',
        'session.suites(selector?)',
        'session.files(selector?)',
        'await session.rerun()',
        'await session.retry()',
        'session.plan(selector?, options?)',
        'plan.tests()',
        'plan.filter(test => ...)',
        'plan.slice(start, end)',
        'plan.add(other)',
        'plan.subtract(other)',
        'plan.intersect(other)',
        'plan.not()',
        'plan.passed(result)',
        'plan.failed(result)',
        'plan.unresolved(result)',
        'await session.execute(plan)',
        'session.refresh()',
        'await session.exit()',
      ]) {
        expect(usages).toContain(command);
      }

      expect(usages).not.toContain(
        'session.last()',
      );
      expect(usages).not.toContain(
        'session.failures()',
      );

      expect(
        (help as any).__testifyHelp,
      ).toEqual(jasmine.objectContaining({
        usage: 'session.help(query?)',
        sections: [
          'discover',
          'run',
          'plan',
          'session',
        ],
        accepts: 'section name or free-text search',
      }));

      const planHelp =
        harness.session.help('plan');

      expect(planHelp.length)
        .toBeGreaterThan(0);
      expect(
        planHelp.every(
          (entry: any) =>
            [
              entry.section,
              entry.usage,
              entry.description,
            ].some((value: string) =>
              value.toLowerCase().includes('plan'),
            ),
        ),
      ).toBeTrue();

      expect(
        () => harness.session.help(123),
      ).toThrowError(
        TypeError,
        'session.help(query?) expects a string query.',
      );

      const missing =
        harness.session.help('definitely-missing');

      expect(missing).toHaveSize(0);
      expect(
        (missing as any).__testifyCollectionKind,
      ).toBe('help');
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
