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
        file: 'forms.spec.js',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Forms two',
        suiteId: 'suite1',
        file: 'forms.spec.js',
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
        'forms.spec.js',
      ).specIds,
    ).toEqual([
      'spec1',
      'spec2',
    ]);
  });
});
