import type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';

export interface TestListRow {
  suiteId: string;
  id: string;
  name: string;
  fullName: string;
  file: string;
}

export interface SuiteListRow {
  parentSuiteId: string;
  id: string;
  name: string;
  fullName: string;
  file: string;
}

export interface FileListRow {
  file: string;
  specs: number;
}

export function listCatalogTests(
  catalog: TestCatalog,
): TestListRow[] {
  return catalog.specs.map(
    (spec) => ({
      suiteId: spec.suiteId ?? '',
      id: spec.id,
      name: spec.description,
      fullName: spec.fullName,
      file: spec.file ?? '',
    }),
  );
}

export function listCatalogSuites(
  catalog: TestCatalog,
): SuiteListRow[] {
  return catalog.suites.map(
    (suite) => ({
      parentSuiteId:
        suite.parentSuiteId ?? '',
      id: suite.id,
      name: suite.description,
      fullName: suite.fullName,
      file: suite.file ?? '',
    }),
  );
}

export function listCatalogFiles(
  catalog: TestCatalog,
): FileListRow[] {
  const counts =
    new Map<string, number>();

  for (const spec of catalog.specs) {
    if (!spec.file) continue;

    counts.set(
      spec.file,
      (counts.get(spec.file) ?? 0) + 1,
    );
  }

  return [...counts.entries()]
    .sort(([a], [b]) =>
      a.localeCompare(b),
    )
    .map(
      ([file, specs]) => ({
        file,
        specs,
      }),
    );
}

export function orderCatalogRows<T extends {
  id?: string;
}>(
  rows: T[],
  orderIds: string[],
): T[] {
  const order =
    new Map(
      orderIds.map(
        (id, index) =>
          [id, index],
      ),
    );

  return [...rows].sort(
    (a, b) =>
      (order.get(a.id ?? '') ??
        Number.MAX_SAFE_INTEGER) -
      (order.get(b.id ?? '') ??
        Number.MAX_SAFE_INTEGER),
  );
}

export function getEmbeddedCatalogQuerySource():
  string {
  return [
    listCatalogTests,
    listCatalogSuites,
    listCatalogFiles,
    orderCatalogRows,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
