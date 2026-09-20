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

  it('generates a usable seed for random runs without one', () => {
    const plan =
      createExecutionPlan(
        catalog,
        undefined,
        { random: true },
      );

    expect(
      plan.seed,
    ).toBeGreaterThan(0);

    expect(
      createExecutionPlan(
        catalog,
        undefined,
        { random: true, seed: 42 },
      ).seed,
    ).toBe(42);

    expect(
      createExecutionPlan(catalog)
        .seed,
    ).toBeUndefined();
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


  it('supports plan set operations', () => {
    const all =
      createExecutionPlan(catalog);
    const forms =
      all.filter(
        (test) =>
          test.file === 'forms.spec.mjs',
      );
    const second =
      all.filter(
        (test) =>
          test.id === 'spec2',
      );
    const other =
      all.filter(
        (test) =>
          test.id === 'spec3',
      );

    expect(
      second.add(other).specIds,
    ).toEqual([
      'spec2',
      'spec3',
    ]);

    expect(
      forms.subtract(second).specIds,
    ).toEqual([
      'spec1',
    ]);

    expect(
      forms.intersect(second).specIds,
    ).toEqual([
      'spec2',
    ]);

    expect(
      forms.not().specIds,
    ).toEqual([
      'spec3',
    ]);
  });

  it('keeps set operations immutable and preserves left-plan options', () => {
    const left =
      createExecutionPlan(
        catalog,
        undefined,
        {
          random: true,
          seed: 42,
          stopOnFailure: true,
        },
      ).slice(0, 1);
    const right =
      createExecutionPlan(catalog)
        .slice(1, 3);

    const combined =
      left.add(right);

    expect(left.specIds).toEqual([
      'spec1',
    ]);
    expect(combined.specIds).toEqual([
      'spec1',
      'spec2',
      'spec3',
    ]);
    expect(combined.random).toBeTrue();
    expect(combined.seed).toBe(42);
    expect(combined.stopOnFailure).toBeTrue();
  });

  it('rejects plan operations across catalog revisions', () => {
    const left =
      createExecutionPlan(catalog);
    const right =
      createExecutionPlan(catalog);

    left.catalogVersion = 1;
    right.catalogVersion = 2;

    expect(
      () => left.add(right),
    ).toThrowError(
      /different catalog revisions/,
    );
  });

  it('rejects plan operations across different catalogs', () => {
    const left =
      createExecutionPlan(catalog);
    const right =
      createExecutionPlan({
        ...catalog,
        specs: catalog.specs.slice(0, 2),
      });

    expect(
      () => left.intersect(right),
    ).toThrowError(
      /different catalogs/,
    );
  });

  it('derives passed, failed, and unresolved plans from execution results', () => {
    const plan =
      createExecutionPlan(catalog);
    plan.catalogVersion = 7;

    const result: any = {
      specResults: [
        {
          id: 'spec1',
          description: 'one',
          status: 'passed',
        },
        {
          id: 'spec2',
          description: 'two',
          status: 'failed',
        },
      ],
      total: 2,
      passed: 1,
      failed: 1,
      pending: 0,
    };

    Object.defineProperty(
      result,
      '__testifyCatalogVersion',
      { value: 7 },
    );

    expect(
      plan.where(result, 'passed').specIds,
    ).toEqual(['spec1']);
    expect(
      plan.where(result, 'failed').specIds,
    ).toEqual(['spec2']);
    expect(
      plan.where(result, 'unresolved').specIds,
    ).toEqual(['spec3']);
  });

  it('treats non-terminal statuses as unresolved', () => {
    const plan =
      createExecutionPlan(catalog);

    const result: any = {
      specResults: [
        { id: 'spec1', description: 'one', status: 'pending' },
        { id: 'spec2', description: 'two', status: 'incomplete' },
        { id: 'spec3', description: 'three', status: 'disabled' },
      ],
      total: 3,
      passed: 0,
      failed: 0,
      pending: 2,
    };

    expect(
      plan.where(result, 'unresolved').specIds,
    ).toEqual([
      'spec1',
      'spec2',
      'spec3',
    ]);
  });

  it('classifies only tests from the current plan', () => {
    const plan =
      createExecutionPlan(catalog)
        .slice(0, 2);

    const result: any = {
      specResults: [
        { id: 'spec1', description: 'one', status: 'passed' },
        { id: 'spec2', description: 'two', status: 'failed' },
        { id: 'spec3', description: 'three', status: 'passed' },
      ],
      total: 3,
      passed: 2,
      failed: 1,
      pending: 0,
    };

    expect(plan.where(result, 'passed').specIds)
      .toEqual(['spec1']);
    expect(plan.where(result, 'failed').specIds)
      .toEqual(['spec2']);
    expect(plan.where(result, 'unresolved').specIds)
      .toEqual([]);
  });

  it('rejects outcome selection from a different catalog revision', () => {
    const plan =
      createExecutionPlan(catalog);
    plan.catalogVersion = 1;

    const result: any = {
      specResults: [],
      total: 0,
      passed: 0,
      failed: 0,
      pending: 0,
    };

    Object.defineProperty(
      result,
      '__testifyCatalogVersion',
      { value: 2 },
    );

    expect(
      () => plan.where(result, 'failed'),
    ).toThrowError(
      /different catalog revision/,
    );
  });

  it('rejects results containing tests outside the plan catalog', () => {
    const plan =
      createExecutionPlan(catalog);
    const result: any = {
      specResults: [
        { id: 'foreign', description: 'foreign', status: 'failed' },
      ],
      total: 1,
      passed: 0,
      failed: 1,
      pending: 0,
    };

    expect(
      () => plan.where(result, 'failed'),
    ).toThrowError(
      /outside this plan catalog/,
    );
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
    expect(serialized.add)
      .toBeUndefined();
    expect(serialized.subtract)
      .toBeUndefined();
    expect(serialized.intersect)
      .toBeUndefined();
    expect(serialized.not)
      .toBeUndefined();
    expect(serialized.passed)
      .toBeUndefined();
    expect(serialized.failed)
      .toBeUndefined();
    expect(serialized.unresolved)
      .toBeUndefined();
    expect(serialized.specIds).toEqual([
      'spec1',
      'spec2',
      'spec3',
    ]);
  });

  it('rejects unknown outcome selectors', () => {
    const plan = createExecutionPlan(catalog);
    const result: any = {
      specResults: [],
      total: 0,
      passed: 0,
      failed: 0,
      pending: 0,
    };

    expect(() =>
      plan.where(result, 'unknown' as any),
    ).toThrowError(
      TypeError,
      'Execution plan where expects passed, failed, or unresolved.',
    );
  });

});
