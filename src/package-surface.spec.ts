import * as testify from './lib';
import * as internals from './internals';

describe('Testify 2 package surface', () => {
  it('exposes the stable engine at the root', () => {
    const rootSurface =
      testify as Record<
        string,
        unknown
      >;

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
      Object.keys(
        rootSurface,
      ),
    ).not.toContain(
      'PlanningEngine',
    );

    expect(
      rootSurface[
        'PlanningEngine'
      ],
    ).toBeUndefined();

    expect(
      Object.keys(
        rootSurface,
      ),
    ).not.toContain(
      'CatalogState',
    );

    expect(
      rootSurface[
        'CatalogState'
      ],
    ).toBeUndefined();

    expect(
      Object.keys(
        rootSurface,
      ),
    ).not.toContain(
      'NodeExecutionHost',
    );

    expect(
      rootSurface[
        'NodeExecutionHost'
      ],
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
