import type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';

export interface SearchIndexEntry {
  id: string;
  text: string;
}

export interface TestCatalogIndex {
  specById: Map<string, TestCatalogSpec>;
  suiteById: Map<string, TestCatalogSuite>;
  childSuiteIdsByParentId: Map<string, string[]>;
  specIdsBySuiteId: Map<string, string[]>;
  specIdsByFile: Map<string, string[]>;
  specSearch: SearchIndexEntry[];
  suiteSearch: SearchIndexEntry[];
  fileSearch: SearchIndexEntry[];
}

export function normalizeSearchText(
  ...values: Array<string | undefined>
): string {
  return values
    .filter(
      (value): value is string =>
        !!value,
    )
    .join('\n')
    .toLocaleLowerCase();
}

export function searchIndexEntries(
  entries: SearchIndexEntry[],
  selector: string | RegExp,
): string[] {
  if (typeof selector === 'string') {
    const needle =
      selector.toLocaleLowerCase();

    return entries
      .filter(
        (entry) =>
          entry.text.includes(
            needle,
          ),
      )
      .map(
        (entry) => entry.id,
      );
  }

  return entries
    .filter((entry) => {
      selector.lastIndex = 0;
      return selector.test(
        entry.text,
      );
    })
    .map(
      (entry) => entry.id,
    );
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

  const specSearch: SearchIndexEntry[] = [];
  const suiteSearch: SearchIndexEntry[] = [];
  const fileSearchMap =
    new Map<string, SearchIndexEntry>();

  for (const suite of catalog.suites) {
    suiteById.set(
      suite.id,
      suite,
    );

    suiteSearch.push({
      id: suite.id,
      text: normalizeSearchText(
        suite.id,
        suite.description,
        suite.fullName,
        suite.file,
      ),
    });

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

    specSearch.push({
      id: spec.id,
      text: normalizeSearchText(
        spec.id,
        spec.description,
        spec.fullName,
        spec.file,
      ),
    });

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

      if (!fileSearchMap.has(spec.file)) {
        fileSearchMap.set(
          spec.file,
          {
            id: spec.file,
            text: normalizeSearchText(
              spec.file,
            ),
          },
        );
      }
    }
  }

  return {
    specById,
    suiteById,
    childSuiteIdsByParentId,
    specIdsBySuiteId,
    specIdsByFile,
    specSearch,
    suiteSearch,
    fileSearch: [
      ...fileSearchMap.values(),
    ],
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
    normalizeSearchText,
    searchIndexEntries,
    createTestCatalogIndex,
    getDescendantSuiteIdsFromIndex,
    getSpecIdsForSuitesFromIndex,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
