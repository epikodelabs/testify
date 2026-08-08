import {
  createExecutionPlan,
  createFileExecutionPlan,
  createSuiteExecutionPlan,
} from './execution-plan';
import type {
  TestCatalog,
} from './test-catalog';

describe('ExecutionPlan', () => {
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
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Forms two',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
    ],
  };

  it('creates an all-tests plan', () => {
    const plan =
      createExecutionPlan(catalog);

    expect(plan.specIds).toEqual([
      'spec1',
      'spec2',
    ]);
    expect(plan.source.kind).toBe(
      'all',
    );
  });

  it('creates a suite plan', () => {
    expect(
      createSuiteExecutionPlan(
        catalog,
        'suite1',
      ).specIds,
    ).toEqual([
      'spec1',
      'spec2',
    ]);
  });

  it('creates a file plan', () => {
    expect(
      createFileExecutionPlan(
        catalog,
        'forms.spec.mjs',
      ).specIds,
    ).toEqual([
      'spec1',
      'spec2',
    ]);
  });
});

describe('ExecutionPlan programmable selection', () => {
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
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Forms two',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec3',
        description: 'three',
        fullName: 'Other three',
        file: 'other.spec.mjs',
      },
    ],
  };

  it('exposes immutable test descriptors in plan order', () => {
    const plan =
      createExecutionPlan(catalog);

    expect(
      plan.tests().map(
        (test) => test.id,
      ),
    ).toEqual([
      'spec1',
      'spec2',
      'spec3',
    ]);

    expect(
      Object.isFrozen(
        plan.tests(),
      ),
    ).toBeTrue();

    expect(
      Object.isFrozen(
        plan.tests()[0],
      ),
    ).toBeTrue();
  });

  it('filters into a new plan without mutating the original', () => {
    const plan =
      createExecutionPlan(
        catalog,
        undefined,
        {
          random: true,
          seed: 42,
          stopOnFailure: true,
        },
      );

    const filtered =
      plan.filter(
        (test) =>
          test.file ===
          'forms.spec.mjs',
      );

    expect(plan.specIds).toEqual([
      'spec1',
      'spec2',
      'spec3',
    ]);

    expect(filtered.specIds).toEqual([
      'spec1',
      'spec2',
    ]);

    expect(filtered.random).toBeTrue();
    expect(filtered.seed).toBe(42);
    expect(filtered.stopOnFailure).toBeTrue();
    expect(filtered.source).toEqual(
      plan.source,
    );
  });

  it('supports chained filtering and slicing', () => {
    const plan =
      createExecutionPlan(catalog)
        .filter(
          (test) =>
            test.fullName.startsWith(
              'Forms',
            ),
        )
        .slice(1);

    expect(plan.specIds).toEqual([
      'spec2',
    ]);

    expect(
      plan.tests().map(
        (test) => test.fullName,
      ),
    ).toEqual([
      'Forms two',
    ]);
  });

  it('keeps plan operations out of serialized execution data', () => {
    const plan =
      createExecutionPlan(catalog);

    const serialized =
      JSON.parse(
        JSON.stringify(plan),
      );

    expect(serialized.tests)
      .toBeUndefined();
    expect(serialized.filter)
      .toBeUndefined();
    expect(serialized.slice)
      .toBeUndefined();
    expect(serialized.specIds).toEqual([
      'spec1',
      'spec2',
      'spec3',
    ]);
  });
});
