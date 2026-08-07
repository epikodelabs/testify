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
        file: 'forms.spec.js',
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
        'forms.spec.js',
      );

    expect(plan.specIds).toEqual([
      'spec1',
    ]);
    expect(plan.random).toBeTrue();
    expect(plan.seed).toBe(42);
  });

  it('queries catalog through the shared session', () => {
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
      session.listTests(),
    ).toHaveSize(1);

    expect(
      session.listSuites(),
    ).toHaveSize(1);

    expect(
      session.listFiles(),
    ).toEqual([
      {
        file: 'forms.spec.js',
        specs: 1,
      },
    ]);
  });

  it('memoizes an index for the current catalog instance', () => {
    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    const first =
      session.index();

    const second =
      session.index();

    expect(second).toBe(first);

    expect(
      first.specById.get(
        'spec1',
      )?.description,
    ).toBe('works');
  });

  it('queries indexed text through the session', () => {
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
      session.findTests(
        'works',
      )[0]?.id,
    ).toBe('spec1');

    expect(
      session.findSuites(
        'Forms',
      )[0]?.id,
    ).toBe('suite1');

    expect(
      session.findFiles(
        /forms/,
      )[0]?.file,
    ).toBe('forms.spec.js');
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

  it('reuses planning state across equivalent catalog snapshots', () => {
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

    expect(
      session.planningStats()
        .cacheHits,
    ).toBe(1);
  });
});
