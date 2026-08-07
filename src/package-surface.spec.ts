import * as testify from './lib';
import * as internals from './internals';

describe('Testify 2 package surface', () => {
  it('exposes the stable engine at the root', () => {
    expect(
      testify.RunnerSession,
    ).toBeDefined();

    expect(
      testify.createExecutionPlan,
    ).toBeDefined();

    expect(
      testify.summarizeExecutionResults,
    ).toBeDefined();

    expect(
      (testify as any)
        .PlanningEngine,
    ).toBeUndefined();

    expect(
      (testify as any)
        .CatalogState,
    ).toBeUndefined();

    expect(
      (testify as any)
        .NodeExecutionHost,
    ).toBeUndefined();
  });

  it('keeps advanced planning internals opt-in', () => {
    expect(
      internals.PlanningEngine,
    ).toBeDefined();

    expect(
      internals.CatalogState,
    ).toBeDefined();
  });
});