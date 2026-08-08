import {
  RunnerSession,
} from './runner-session';
import type {
  TestCatalog,
} from './test-catalog';

describe('RunnerSession', () => {
  const catalog: TestCatalog = {
    suites: [
      {
        id: 'suite1',
        description: 'Forms',
        fullName: 'Forms',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'works',
        fullName: 'Forms works',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
    ],
  };

  it('plans and executes through one adapter', async () => {
    let executedIds:
      string[] = [];

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute(plan) {
            executedIds =
              plan.specIds;

            return plan.specIds.length;
          },
        },
      );

    const result =
      await session.runSuite(
        'suite1',
      );

    expect(result).toBe(1);
    expect(executedIds).toEqual([
      'spec1',
    ]);
  });

  it('exposes reusable plans', () => {
    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
        },
        () => ({
          random: true,
          seed: 42,
        }),
      );

    const plan =
      session.planFile(
        'forms.spec.mjs',
      );

    expect(plan.specIds).toEqual([
      'spec1',
    ]);
    expect(plan.random).toBeTrue();
    expect(plan.seed).toBe(42);
  });

  it('exposes concise Playground discovery methods', () => {
    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    expect(
      session.tests(),
    ).toHaveSize(1);

    expect(
      session.tests('works')[0]?.id,
    ).toBe('spec1');

    expect(
      session.suites('Forms')[0]?.id,
    ).toBe('suite1');

    expect(
      session.files(/forms/)[0]?.file,
    ).toBe('forms.spec.mjs');
  });

  it('reports session stats', () => {
    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    expect(
      session.stats(),
    ).toEqual({
      specs: 1,
      suites: 1,
      files: 1,
    });
  });

  it('keeps the same revision across equivalent catalog snapshots', () => {
    let currentCatalog =
      catalog;

    const session =
      new RunnerSession(
        () => currentCatalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    session.plan();

    currentCatalog = {
      ...catalog,
      suites:
        catalog.suites.map(
          (suite) => ({
            ...suite,
          }),
        ),
      specs:
        catalog.specs.map(
          (spec) => ({
            ...spec,
          }),
        ),
    };

    session.plan();

    expect(
      session.revision(),
    ).toBe(1);

  });
  it('exposes explicit refresh results', () => {
    let currentCatalog = catalog;

    const session =
      new RunnerSession(
        () => currentCatalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    expect(
      session.refresh(),
    ).toEqual({
      changed: false,
      previousRevision: 1,
      revision: 1,
      changes: jasmine.objectContaining({
        version: 1,
        changed: false,
      }),
    });

    currentCatalog = {
      ...catalog,
      specs: [
        ...catalog.specs,
        {
          id: 'spec2',
          description: 'also works',
          fullName: 'Forms also works',
          suiteId: 'suite1',
          file: 'forms.spec.mjs',
        },
      ],
    };

    const refresh =
      session.refresh();

    expect(refresh.changed).toBeTrue();
    expect(refresh.previousRevision).toBe(1);
    expect(refresh.revision).toBe(2);
    expect(
      refresh.changes.addedSpecIds,
    ).toEqual(['spec2']);
    expect(session.changes())
      .toBe(refresh.changes);
  });

  it('allows per-plan options to override session defaults', () => {
    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
        },
        () => ({
          random: false,
          seed: 1,
          stopOnFailure: false,
        }),
      );

    const plan =
      session.planSuite(
        'suite1',
        {
          random: true,
          seed: 42,
        },
      );

    expect(plan.random).toBeTrue();
    expect(plan.seed).toBe(42);
    expect(plan.stopOnFailure).toBeFalse();
  });

  it('keeps plans executable across unrelated catalog additions', async () => {
    let currentCatalog = catalog;
    let executions = 0;

    const session =
      new RunnerSession(
        () => currentCatalog,
        {
          async execute(plan) {
            executions++;
            return plan.specIds;
          },
        },
      );

    const plan =
      session.planSpec('spec1');

    currentCatalog = {
      ...catalog,
      specs: [
        ...catalog.specs,
        {
          id: 'spec2',
          description: 'new',
          fullName: 'Forms new',
          suiteId: 'suite1',
          file: 'forms.spec.mjs',
        },
      ],
    };

    const result =
      await session.execute(plan);

    expect(result).toEqual(['spec1']);
    expect(executions).toBe(1);
  });

  it('rejects a stale plan when selected specs disappear', async () => {
    let currentCatalog = catalog;

    const session =
      new RunnerSession(
        () => currentCatalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    const plan =
      session.planSpec('spec1');

    currentCatalog = {
      ...catalog,
      specs: [],
    };

    await expectAsync(
      session.execute(plan),
    ).toBeRejectedWithError(
      /Execution plan is stale; missing spec ids: spec1/,
    );
  });

  it('closes once and rejects later operations', async () => {
    let closes = 0;

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
          async close() {
            closes++;
          },
        },
      );

    expect(session.state).toBe('ready');

    const first = session.close();
    const second = session.close();

    expect(session.state).toBe('closing');

    await Promise.all([
      first,
      second,
    ]);

    expect(closes).toBe(1);
    expect(session.state).toBe('closed');

    await session.close();
    expect(closes).toBe(1);

    expect(() => session.plan())
      .toThrowError(
        /Testify session is closed/,
      );
  });

});
