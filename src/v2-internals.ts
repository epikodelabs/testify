/**
 * Unstable Testify v2 implementation APIs.
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
  normalizeSearchText,
  searchIndexEntries,
} from './test-catalog-index';

export type {
  SearchIndexEntry,
} from './test-catalog-index';
