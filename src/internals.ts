/**
 * Unstable Testify implementation APIs.
 *
 * No compatibility guarantee is made for this subpath.
 */
export {
  CatalogState,
  diffTestCatalogs,
  fingerprintTestCatalog,
} from './catalog-state';

export type {
  CatalogChangeSet,
} from './catalog-state';

export {
  PlanningEngine,
} from './planning-engine';

export type {
  PlanningEngineStats,
} from './planning-engine';

export {
  createExecutionPlan,
  createFileExecutionPlan,
  createSpecExecutionPlan,
  createSuiteExecutionPlan,
  partitionExecutionPlan,
  shardExecutionPlan,
} from './execution-plan';

export {
  summarizeExecutionResults,
} from './execution-result';

export {
  CatalogQuery,
} from './catalog-query-builder';

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
  createTestCatalogIndex,
  normalizeSearchText,
  searchIndexEntries,
} from './test-catalog-index';

export type {
  SearchIndexEntry,
  TestCatalogIndex,
} from './test-catalog-index';

export {
  findCatalogSpecs,
  findCatalogSuites,
  getSpecIdsForFiles,
  resolveTestSelector,
} from './test-selection';

export {
  embedClassSource,
  embedFunctionSource,
} from './embedded-source';
