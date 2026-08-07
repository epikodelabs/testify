import {
  PlanningEngine,
} from './planning-engine';
import type {
  TestCatalog,
} from './test-catalog';

describe('PlanningEngine', () => {
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
        description: 'one',
        fullName: 'Forms one',
        suiteId: 'suite1',
        file: 'forms.spec.js',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Forms two',
        suiteId: 'suite1',
        file: 'forms.spec.js',
      },
      {
        id: 'spec3',
        description: 'three',
        fullName: 'Forms three',
        suiteId: 'suite1',
        file: 'forms.spec.js',
      },
    ],
  };

  it('caches equivalent plans within a catalog revision', () => {
    const planner =
      new PlanningEngine(
        catalog,
      );

    planner.plan({
      suite: 'suite1',
    });

    planner.plan({
      suite: 'suite1',
    });

    expect(
      planner.stats(),
    ).toEqual({
      catalogVersion: 1,
      cachedPlans: 1,
      cacheHits: 1,
      cacheMisses: 1,
    });
  });

  it('invalidates plans only when catalog content changes', () => {
    const planner =
      new PlanningEngine(
        catalog,
      );

    planner.plan();

    planner.update({
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
    });

    expect(
      planner.stats()
        .cachedPlans,
    ).toBe(1);

    planner.update({
      ...catalog,
      specs:
        catalog.specs.slice(
          0,
          2,
        ),
    });

    expect(
      planner.stats()
        .cachedPlans,
    ).toBe(0);

    expect(
      planner.version,
    ).toBe(2);
  });

  it('partitions a plan without overlap', () => {
    const planner =
      new PlanningEngine(
        catalog,
      );

    const partitions =
      planner.partition(
        planner.plan(),
        2,
      );

    expect(
      partitions[0]
        .specIds,
    ).toEqual([
      'spec1',
      'spec3',
    ]);

    expect(
      partitions[1]
        .specIds,
    ).toEqual([
      'spec2',
    ]);
  });
});
