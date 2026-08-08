import {
  RunnerSession,
} from './runner-session';
import type {
  TestCatalog,
} from './test-catalog';

function createCatalog(
  specIds: string[],
): TestCatalog {
  return {
    rootSuiteId: 'root',
    suites: [
      {
        id: 'suite1',
        description: 'Example',
        fullName: 'Example',
        file: 'example.spec.mjs',
      },
    ],
    specs:
      specIds.map(
        (id) => {
          const number =
            id.replace(
              /^spec/,
              '',
            );

          return {
            id,
            description:
              `spec ${number}`,
            fullName:
              `Example spec ${number}`,
            suiteId: 'suite1',
            file:
              'example.spec.mjs',
          };
        },
      ),
  };
}

describe('RunnerSession HMR lifecycle', () => {
  it('advances catalog revision and invalidates plans when a spec is added', () => {
    let catalog =
      createCatalog([
        'spec1',
      ]);

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute(plan) {
            return plan.specIds;
          },
        },
      );

    const firstPlan =
      session.plan();

    expect(
      firstPlan.specIds,
    ).toEqual([
      'spec1',
    ]);

    expect(
      session.revision(),
    ).toBe(1);

    expect(
      session.planningStats()
        .cachedPlans,
    ).toBe(1);

    catalog =
      createCatalog([
        'spec1',
        'spec2',
      ]);

    expect(
      session.listTests().map(
        (test) => test.id,
      ),
    ).toEqual([
      'spec1',
      'spec2',
    ]);

    expect(
      session.revision(),
    ).toBe(2);

    expect(
      session.planningStats()
        .cachedPlans,
    ).toBe(0);

    const secondPlan =
      session.plan();

    expect(
      secondPlan.specIds,
    ).toEqual([
      'spec1',
      'spec2',
    ]);

    expect(
      secondPlan.catalogVersion,
    ).toBe(2);
  });

  it('drops removed specs from queries and future plans', () => {
    let catalog =
      createCatalog([
        'spec1',
        'spec2',
      ]);

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute(plan) {
            return plan.specIds;
          },
        },
      );

    session.plan();

    catalog =
      createCatalog([
        'spec2',
      ]);

    expect(
      session.listTests().map(
        (test) => test.id,
      ),
    ).toEqual([
      'spec2',
    ]);

    expect(
      session.findTests(
        'spec 1',
      ),
    ).toEqual([]);

    const plan =
      session.plan();

    expect(
      plan.specIds,
    ).toEqual([
      'spec2',
    ]);

    expect(
      session.revision(),
    ).toBe(2);
  });

  it('replans against replacement Jasmine ids after HMR re-registration', async () => {
    let catalog =
      createCatalog([
        'spec1',
      ]);

    let executedIds:
      string[] = [];

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute(plan) {
            executedIds =
              [...plan.specIds];

            return executedIds;
          },
        },
      );

    const oldPlan =
      session.planSpec(
        'Example spec 1',
      );

    expect(
      oldPlan.specIds,
    ).toEqual([
      'spec1',
    ]);

    // HMR detaches the old Jasmine registration and imports the spec again.
    // Jasmine may assign a fresh runtime id even when authored structure is
    // unchanged, so the session must observe the new catalog and replan.
    catalog = {
      ...createCatalog([
        'spec9',
      ]),
      specs: [
        {
          id: 'spec9',
          description:
            'spec 1',
          fullName:
            'Example spec 1',
          suiteId:
            'suite1',
          file:
            'example.spec.mjs',
        },
      ],
    };

    await session.runSpec(
      'Example spec 1',
    );

    expect(
      executedIds,
    ).toEqual([
      'spec9',
    ]);

    expect(
      session.revision(),
    ).toBe(2);

    expect(
      session.changes()
        .removedSpecIds,
    ).toEqual([
      'spec1',
    ]);

    expect(
      session.changes()
        .addedSpecIds,
    ).toEqual([
      'spec9',
    ]);
  });

  it('keeps the revision stable for an equivalent catalog snapshot', () => {
    let catalog =
      createCatalog([
        'spec1',
      ]);

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute(plan) {
            return plan.specIds;
          },
        },
      );

    session.plan();

    catalog = {
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
