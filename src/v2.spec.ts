import * as v2 from './v2';

describe('Testify v2 public surface', () => {
  it('exposes the core v2 primitives', () => {
    expect(v2.RunnerSession).toBeDefined();
    expect(v2.createExecutionPlan).toBeDefined();
    expect(v2.createTestCatalogIndex).toBeDefined();
    expect(v2.listCatalogTests).toBeDefined();
  });
});
