import type {
  TestCatalog,
} from './test-catalog';
import {
  findCatalogSpecs,
  findCatalogSuites,
  getSpecIdsForFiles,
  type TestSelector,
} from './test-selection';
import {
  listCatalogFiles,
  listCatalogSuites,
  listCatalogTests,
  type FileListRow,
  type SuiteListRow,
  type TestListRow,
} from './catalog-query';

export class CatalogQuery {
  constructor(
    private readonly catalog:
      TestCatalog,
  ) {}

  tests(
    selector?: string | RegExp,
  ): TestListRow[] {
    if (!selector) {
      return listCatalogTests(
        this.catalog,
      );
    }

    const ids =
      new Set(
        findCatalogSpecs(
          this.catalog,
          selector,
        ).map(
          (spec) => spec.id,
        ),
      );

    return listCatalogTests(
      this.catalog,
    ).filter(
      (row) =>
        ids.has(row.id),
    );
  }

  suites(
    selector?: string | RegExp,
  ): SuiteListRow[] {
    if (!selector) {
      return listCatalogSuites(
        this.catalog,
      );
    }

    const ids =
      new Set(
        findCatalogSuites(
          this.catalog,
          selector,
        ).map(
          (suite) => suite.id,
        ),
      );

    return listCatalogSuites(
      this.catalog,
    ).filter(
      (row) =>
        ids.has(row.id),
    );
  }

  files(
    selector?: string | RegExp,
  ): FileListRow[] {
    const rows =
      listCatalogFiles(
        this.catalog,
      );

    if (!selector) {
      return rows;
    }

    const ids =
      new Set(
        getSpecIdsForFiles(
          this.catalog,
          selector,
        ),
      );

    return rows.filter(
      (row) =>
        this.catalog.specs.some(
          (spec) =>
            spec.file === row.file &&
            ids.has(spec.id),
        ),
    );
  }

  selector(
    selector: TestSelector,
  ): TestSelector {
    return selector;
  }
}
