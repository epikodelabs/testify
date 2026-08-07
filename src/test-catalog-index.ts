import type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';

export interface TestCatalogIndex {
  specById: Map<string, TestCatalogSpec>;
  suiteById: Map<string, TestCatalogSuite>;
  childSuiteIdsByParentId: Map<string, string[]>;
  specIdsBySuiteId: Map<string, string[]>;
  specIdsByFile: Map<string, string[]>;
}

export function createTestCatalogIndex(
  catalog: TestCatalog,
): TestCatalogIndex {
  const specById =
    new Map<string, TestCatalogSpec>();

  const suiteById =
    new Map<string, TestCatalogSuite>();

  const childSuiteIdsByParentId =
    new Map<string, string[]>();

  const specIdsBySuiteId =
    new Map<string, string[]>();

  const specIdsByFile =
    new Map<string, string[]>();

  for (const suite of catalog.suites) {
    suiteById.set(
      suite.id,
      suite,
    );

    if (suite.parentSuiteId) {
      const childIds =
        childSuiteIdsByParentId.get(
          suite.parentSuiteId,
        ) ?? [];

      childIds.push(
        suite.id,
      );

      childSuiteIdsByParentId.set(
        suite.parentSuiteId,
        childIds,
      );
    }
  }

  for (const spec of catalog.specs) {
    specById.set(
      spec.id,
      spec,
    );

    if (spec.suiteId) {
      const specIds =
        specIdsBySuiteId.get(
          spec.suiteId,
        ) ?? [];

      specIds.push(
        spec.id,
      );

      specIdsBySuiteId.set(
        spec.suiteId,
        specIds,
      );
    }

    if (spec.file) {
      const specIds =
        specIdsByFile.get(
          spec.file,
        ) ?? [];

      specIds.push(
        spec.id,
      );

      specIdsByFile.set(
        spec.file,
        specIds,
      );
    }
  }

  return {
    specById,
    suiteById,
    childSuiteIdsByParentId,
    specIdsBySuiteId,
    specIdsByFile,
  };
}

export function getDescendantSuiteIdsFromIndex(
  index: TestCatalogIndex,
  suiteIds: Iterable<string>,
): Set<string> {
  const selected =
    new Set(suiteIds);

  const queue =
    [...selected];

  while (queue.length > 0) {
    const suiteId =
      queue.shift()!;

    const childIds =
      index.childSuiteIdsByParentId.get(
        suiteId,
      ) ?? [];

    for (const childId of childIds) {
      if (selected.has(childId)) {
        continue;
      }

      selected.add(childId);
      queue.push(childId);
    }
  }

  return selected;
}

export function getSpecIdsForSuitesFromIndex(
  index: TestCatalogIndex,
  suiteIds: Iterable<string>,
): string[] {
  const selectedSuites =
    getDescendantSuiteIdsFromIndex(
      index,
      suiteIds,
    );

  const specIds: string[] = [];

  for (const suiteId of selectedSuites) {
    specIds.push(
      ...(
        index.specIdsBySuiteId.get(
          suiteId,
        ) ?? []
      ),
    );
  }

  return specIds;
}

export function getEmbeddedTestCatalogIndexSource():
  string {
  return [
    createTestCatalogIndex,
    getDescendantSuiteIdsFromIndex,
    getSpecIdsForSuitesFromIndex,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
