/**
 * Stable Testify v2 public API.
 *
 * Runtime hosts, generated-source helpers, process adapters, and planning
 * implementation details intentionally stay outside this surface.
 */

export {
  RunnerSession,
} from './runner-session';

export type {
  RunnerSessionAdapter,
  RunnerSessionOptions,
  TestifyRunnerSession,
} from './runner-session';

export {
  createExecutionPlan,
  createFileExecutionPlan,
  createSpecExecutionPlan,
  createSuiteExecutionPlan,
  partitionExecutionPlan,
  shardExecutionPlan,
} from './execution-plan';

export type {
  ExecutionPlan,
  ExecutionPlanOptions,
} from './execution-plan';

export {
  summarizeExecutionResults,
} from './execution-result';

export type {
  ExecutionResult,
  ExecutionSpecResult,
} from './execution-result';

export {
  createTestCatalogIndex,
} from './test-catalog-index';

export type {
  TestCatalogIndex,
} from './test-catalog-index';

export {
  listCatalogFiles,
  listCatalogSuites,
  listCatalogTests,
} from './catalog-query';

export type {
  FileListRow,
  SuiteListRow,
  TestListRow,
} from './catalog-query';

export {
  findCatalogSpecs,
  findCatalogSuites,
  getSpecIdsForFiles,
  resolveTestSelector,
} from './test-selection';

export type {
  TestSelector,
} from './test-selection';

export type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';
