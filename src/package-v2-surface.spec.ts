import * as v2 from './v2';
import * as internals from './v2-internals';

describe('Testify v2 package surface', () => {
  it('keeps the stable surface focused', () => {
    expect(v2.RunnerSession)
      .toBeDefined();

    expect(v2.createExecutionPlan)
      .toBeDefined();

    expect(v2.summarizeExecutionResults)
      .toBeDefined();

    expect(
      (v2 as any).PlanningEngine,
    ).toBeUndefined();

    expect(
      (v2 as any).CatalogState,
    ).toBeUndefined();

    expect(
      (v2 as any).applyExecutionExitCode,
    ).toBeUndefined();

    expect(
      (v2 as any).NodeExecutionHost,
    ).toBeUndefined();
  });

  it('keeps advanced planning internals opt-in', () => {
    expect(internals.PlanningEngine)
      .toBeDefined();

    expect(internals.CatalogState)
      .toBeDefined();
  });
});
