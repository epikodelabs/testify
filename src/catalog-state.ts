import {
  embedClassSource,
  embedFunctionSource,
} from './embedded-source';
import type {
  TestCatalog,
} from './test-catalog';
import {
  createTestCatalogIndex,
  type TestCatalogIndex,
} from './test-catalog-index';

export interface CatalogChangeSet {
  version: number;
  changed: boolean;
  addedSpecIds: string[];
  removedSpecIds: string[];
  addedSuiteIds: string[];
  removedSuiteIds: string[];
  addedFiles: string[];
  removedFiles: string[];
}

export function fingerprintTestCatalog(
  catalog: TestCatalog,
): string {
  const suites =
    catalog.suites.map(
      (suite) => [
        suite.id,
        suite.parentSuiteId ?? '',
        suite.description,
        suite.fullName,
        suite.file ?? '',
      ].join('\u001f'),
    );

  const specs =
    catalog.specs.map(
      (spec) => [
        spec.id,
        spec.suiteId ?? '',
        spec.description,
        spec.fullName,
        spec.file ?? '',
      ].join('\u001f'),
    );

  return [
    catalog.rootSuiteId ?? '',
    suites.join('\u001e'),
    specs.join('\u001e'),
  ].join('\u001d');
}

export function diffTestCatalogs(
  previous: TestCatalog | null,
  current: TestCatalog,
  version: number,
): CatalogChangeSet {
  if (!previous) {
    return {
      version,
      changed: true,
      addedSpecIds:
        current.specs.map(
          (spec) => spec.id,
        ),
      removedSpecIds: [],
      addedSuiteIds:
        current.suites.map(
          (suite) => suite.id,
        ),
      removedSuiteIds: [],
      addedFiles:
        collectCatalogFiles(
          current,
        ),
      removedFiles: [],
    };
  }

  const previousSpecIds =
    new Set(
      previous.specs.map(
        (spec) => spec.id,
      ),
    );

  const currentSpecIds =
    new Set(
      current.specs.map(
        (spec) => spec.id,
      ),
    );

  const previousSuiteIds =
    new Set(
      previous.suites.map(
        (suite) => suite.id,
      ),
    );

  const currentSuiteIds =
    new Set(
      current.suites.map(
        (suite) => suite.id,
      ),
    );

  const previousFiles =
    new Set(
      collectCatalogFiles(
        previous,
      ),
    );

  const currentFiles =
    new Set(
      collectCatalogFiles(
        current,
      ),
    );

  return {
    version,
    changed: true,
    addedSpecIds:
      setDifference(
        currentSpecIds,
        previousSpecIds,
      ),
    removedSpecIds:
      setDifference(
        previousSpecIds,
        currentSpecIds,
      ),
    addedSuiteIds:
      setDifference(
        currentSuiteIds,
        previousSuiteIds,
      ),
    removedSuiteIds:
      setDifference(
        previousSuiteIds,
        currentSuiteIds,
      ),
    addedFiles:
      setDifference(
        currentFiles,
        previousFiles,
      ),
    removedFiles:
      setDifference(
        previousFiles,
        currentFiles,
      ),
  };
}

function collectCatalogFiles(
  catalog: TestCatalog,
): string[] {
  return [
    ...new Set(
      [
        ...catalog.suites.map(
          (suite) => suite.file,
        ),
        ...catalog.specs.map(
          (spec) => spec.file,
        ),
      ].filter(
        (
          file,
        ): file is string =>
          !!file,
      ),
    ),
  ].sort();
}

function setDifference(
  left: Set<string>,
  right: Set<string>,
): string[] {
  return [...left].filter(
    (value) =>
      !right.has(value),
  );
}

export class CatalogState {
  private catalogValue:
    TestCatalog;

  private indexValue:
    TestCatalogIndex;

  private fingerprintValue:
    string;

  private versionValue = 1;

  private changesValue:
    CatalogChangeSet;

  constructor(
    catalog: TestCatalog,
  ) {
    this.catalogValue =
      catalog;

    this.indexValue =
      createTestCatalogIndex(
        catalog,
      );

    this.fingerprintValue =
      fingerprintTestCatalog(
        catalog,
      );

    this.changesValue =
      diffTestCatalogs(
        null,
        catalog,
        this.versionValue,
      );
  }

  get catalog(): TestCatalog {
    return this.catalogValue;
  }

  get index(): TestCatalogIndex {
    return this.indexValue;
  }

  get version(): number {
    return this.versionValue;
  }

  get fingerprint(): string {
    return this.fingerprintValue;
  }

  get changes():
    CatalogChangeSet {
    return this.changesValue;
  }

  update(
    catalog: TestCatalog,
  ): CatalogChangeSet {
    const fingerprint =
      fingerprintTestCatalog(
        catalog,
      );

    if (
      fingerprint ===
      this.fingerprintValue
    ) {
      this.catalogValue =
        catalog;

      this.changesValue = {
        version:
          this.versionValue,
        changed: false,
        addedSpecIds: [],
        removedSpecIds: [],
        addedSuiteIds: [],
        removedSuiteIds: [],
        addedFiles: [],
        removedFiles: [],
      };

      return this.changesValue;
    }

    const previous =
      this.catalogValue;

    this.versionValue++;

    this.catalogValue =
      catalog;

    this.indexValue =
      createTestCatalogIndex(
        catalog,
      );

    this.fingerprintValue =
      fingerprint;

    this.changesValue =
      diffTestCatalogs(
        previous,
        catalog,
        this.versionValue,
      );

    return this.changesValue;
  }
}

export function getEmbeddedCatalogStateSource():
  string {
  return [
    embedFunctionSource(
      collectCatalogFiles,
    ),
    embedFunctionSource(
      setDifference,
    ),
    embedFunctionSource(
      fingerprintTestCatalog,
    ),
    embedFunctionSource(
      diffTestCatalogs,
    ),
    embedClassSource(
      'CatalogState',
      CatalogState,
    ),
  ].join('\n\n');
}
