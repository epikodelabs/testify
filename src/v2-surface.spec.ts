import * as v2 from './v2';

describe('Testify v2 surface', () => {
  it('keeps generated runtime internals out of the public v2 namespace', () => {
    expect(
      (v2 as any)
        .getEmbeddedRunnerSessionSource,
    ).toBeUndefined();

    expect(
      (v2 as any)
        .getEmbeddedExecutionPlanSource,
    ).toBeUndefined();
  });

  it('exposes the intended runtime/query primitives', () => {
    expect(v2.RunnerSession)
      .toBeDefined();

    expect(v2.resolveTestSelector)
      .toBeDefined();

    expect(v2.createTestCatalogIndex)
      .toBeDefined();
  });
});
