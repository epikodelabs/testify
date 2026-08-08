import * as testify from './lib';
import * as internals from './internals';

describe('Testify 2 package surface', () => {
  it('keeps the stable root focused on Session/Plan/Result contracts', () => {
    const rootSurface =
      testify as Record<
        string,
        unknown
      >;

    expect(
      testify.RunnerSession,
    ).toBeDefined();

    for (const internalName of [
      'createExecutionPlan',
      'summarizeExecutionResults',
      'CatalogQuery',
      'createTestCatalogIndex',
      'listCatalogTests',
      'findCatalogSpecs',
      'PlanningEngine',
      'CatalogState',
    ]) {
      expect(
        Object.keys(rootSurface),
      ).not.toContain(
        internalName,
      );

      expect(
        rootSurface[internalName],
      ).toBeUndefined();
    }
  });

  it('keeps construction/query/planning helpers opt-in through internals', () => {
    expect(
      internals.createExecutionPlan,
    ).toBeDefined();

    expect(
      internals.summarizeExecutionResults,
    ).toBeDefined();

    expect(
      internals.CatalogQuery,
    ).toBeDefined();

    expect(
      internals.createTestCatalogIndex,
    ).toBeDefined();

    expect(
      internals.PlanningEngine,
    ).toBeDefined();

    expect(
      internals.CatalogState,
    ).toBeDefined();
  });
});
