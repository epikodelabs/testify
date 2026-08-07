import { createTestCatalogFromJasmineEnv } from './test-catalog';
import type { TestCatalog } from './test-catalog';

export function createBrowserTestCatalog(
  env: jasmine.Env,
): TestCatalog {
  return createTestCatalogFromJasmineEnv(env);
}
