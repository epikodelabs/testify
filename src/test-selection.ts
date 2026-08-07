import {
  createTestCatalogIndex,
  getSpecIdsForSuitesFromIndex,
  searchIndexEntries,
} from './test-catalog-index';
import type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';

export type TestSelector =
  | string
  | RegExp
  | {
      spec?: string | RegExp;
      suite?: string | RegExp;
      file?: string | RegExp;
    };

function matchesText(
  selector: string | RegExp,
  ...values: Array<string | undefined>
): boolean {
  if (typeof selector === 'string') {
    return values.some(
      (value) =>
        value === selector ||
        value?.includes(selector),
    );
  }

  return values.some((value) => {
    if (!value) return false;
    selector.lastIndex = 0;
    return selector.test(value);
  });
}

export function findCatalogSpecs(
  catalog: TestCatalog,
  selector: string | RegExp,
): TestCatalogSpec[] {
  const index =
    createTestCatalogIndex(
      catalog,
    );

  return searchIndexEntries(
    index.specSearch,
    selector,
  )
    .map(
      (id) =>
        index.specById.get(id),
    )
    .filter(
      (
        spec,
      ): spec is TestCatalogSpec =>
        !!spec,
    );
}

export function findCatalogSuites(
  catalog: TestCatalog,
  selector: string | RegExp,
): TestCatalogSuite[] {
  const index =
    createTestCatalogIndex(
      catalog,
    );

  return searchIndexEntries(
    index.suiteSearch,
    selector,
  )
    .map(
      (id) =>
        index.suiteById.get(id),
    )
    .filter(
      (
        suite,
      ): suite is TestCatalogSuite =>
        !!suite,
    );
}

export function getDescendantSuiteIds(
  catalog: TestCatalog,
  suiteIds: Iterable<string>,
): Set<string> {
  const selected = new Set(suiteIds);
  let changed = true;

  while (changed) {
    changed = false;

    for (const suite of catalog.suites) {
      if (
        suite.parentSuiteId &&
        selected.has(suite.parentSuiteId) &&
        !selected.has(suite.id)
      ) {
        selected.add(suite.id);
        changed = true;
      }
    }
  }

  return selected;
}

export function getSpecIdsForSuites(
  catalog: TestCatalog,
  suiteIds: Iterable<string>,
): string[] {
  const selectedSuites =
    getDescendantSuiteIds(catalog, suiteIds);

  return catalog.specs
    .filter(
      (spec) =>
        !!spec.suiteId &&
        selectedSuites.has(spec.suiteId),
    )
    .map((spec) => spec.id);
}

export function getSpecIdsForFiles(
  catalog: TestCatalog,
  selector: string | RegExp,
): string[] {
  const index =
    createTestCatalogIndex(
      catalog,
    );

  if (typeof selector === 'string') {
    const exact =
      index.specIdsByFile.get(
        selector,
      );

    if (exact) {
      return [...exact];
    }
  }

  const matchingFiles =
    searchIndexEntries(
      index.fileSearch,
      selector,
    );

  return matchingFiles.flatMap(
    (file) =>
      index.specIdsByFile.get(
        file,
      ) ?? [],
  );
}

export function resolveTestSelector(
  catalog: TestCatalog,
  selector: TestSelector,
): string[] {
  if (typeof selector === 'string') {
    const index =
      createTestCatalogIndex(catalog);

    const exactSpec =
      index.specById.get(selector);

    if (exactSpec) {
      return [exactSpec.id];
    }

    const exactSuite =
      index.suiteById.get(selector);

    if (exactSuite) {
      return getSpecIdsForSuitesFromIndex(
        index,
        [exactSuite.id],
      );
    }

    return findCatalogSpecs(
      catalog,
      selector,
    ).map((spec) => spec.id);
  }

  if (selector instanceof RegExp) {
    return findCatalogSpecs(
      catalog,
      selector,
    ).map((spec) => spec.id);
  }

  if (selector.spec) {
    return findCatalogSpecs(
      catalog,
      selector.spec,
    ).map((spec) => spec.id);
  }

  if (selector.suite) {
    const suites = findCatalogSuites(
      catalog,
      selector.suite,
    );

    return getSpecIdsForSuitesFromIndex(
      createTestCatalogIndex(catalog),
      suites.map((suite) => suite.id),
    );
  }

  if (selector.file) {
    return getSpecIdsForFiles(
      catalog,
      selector.file,
    );
  }

  return [];
}


export function getEmbeddedTestSelectionSource(): string {
  return [
    createTestCatalogIndex,
    getSpecIdsForSuitesFromIndex,
    searchIndexEntries,
    matchesText,
    findCatalogSpecs,
    findCatalogSuites,
    getDescendantSuiteIds,
    getSpecIdsForSuites,
    getSpecIdsForFiles,
    resolveTestSelector,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
