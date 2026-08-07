import { getTestifyFile } from './test-metadata';

export interface TestCatalogSuite {
  id: string;
  description: string;
  fullName: string;
  parentSuiteId?: string;
  file?: string;
}

export interface TestCatalogSpec {
  id: string;
  description: string;
  fullName: string;
  suiteId?: string;
  file?: string;
}

export interface TestCatalog {
  rootSuiteId?: string;
  suites: TestCatalogSuite[];
  specs: TestCatalogSpec[];
}

function getItemDescription(item: any): string {
  if (typeof item?.description === 'string') {
    return item.description;
  }

  return item?.id ?? '';
}

function getItemFullName(item: any): string {
  if (typeof item?.getFullName === 'function') {
    return item.getFullName();
  }

  return getItemDescription(item);
}

function getItemFile(item: any): string | undefined {
  return getTestifyFile(item);
}

function isSuite(item: any): boolean {
  return !!item && Array.isArray(item.children);
}

function isSpec(item: any): boolean {
  return (
    !!item &&
    typeof item.id === 'string' &&
    !Array.isArray(item.children)
  );
}

export function createTestCatalogFromJasmineEnv(
  jasmineEnv: jasmine.Env,
): TestCatalog {
  const topSuite = jasmineEnv?.topSuite?.();

  if (!topSuite) {
    return {
      suites: [],
      specs: [],
    };
  }

  const suites: TestCatalogSuite[] = [];
  const specs: TestCatalogSpec[] = [];

  const traverseSuite = (
    suite: any,
    parentSuiteId?: string,
    includeInCatalog = true,
  ): void => {
    if (includeInCatalog) {
      const file =
        getItemFile(
          suite,
        );

      suites.push({
        id: suite.id,
        description:
          getItemDescription(
            suite,
          ),
        fullName:
          getItemFullName(
            suite,
          ),
        parentSuiteId,
        ...(file
          ? { file }
          : {}),
      });
    }

    const owningSuiteId = includeInCatalog
      ? suite.id
      : undefined;

    for (const child of suite.children ?? []) {
      if (isSuite(child)) {
        traverseSuite(
          child,
          owningSuiteId,
          true,
        );
        continue;
      }

      if (isSpec(child)) {
        const file =
          getItemFile(
            child,
          ) ??
          getItemFile(
            suite,
          );

        specs.push({
          id: child.id,
          description:
            getItemDescription(
              child,
            ),
          fullName:
            getItemFullName(
              child,
            ),
          suiteId:
            owningSuiteId,
          ...(file
            ? { file }
            : {}),
        });
      }
    }
  };

  // Jasmine's top suite is an implementation root rather than an authored
  // suite. Keep its id as metadata but expose only authored suites.
  traverseSuite(topSuite, undefined, false);

  return {
    rootSuiteId:
      typeof topSuite.id === 'string'
        ? topSuite.id
        : undefined,
    suites,
    specs,
  };
}

export function getCatalogSpecIds(
  catalog: TestCatalog,
): string[] {
  return catalog.specs.map((spec) => spec.id);
}

export function getCatalogSuiteIds(
  catalog: TestCatalog,
): string[] {
  return catalog.suites.map((suite) => suite.id);
}

export function getEmbeddedTestCatalogSource(): string {
  return [
    getItemDescription,
    getItemFullName,
    getItemFile,
    isSuite,
    isSpec,
    createTestCatalogFromJasmineEnv,
    getCatalogSpecIds,
    getCatalogSuiteIds,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}


export function getCatalogFiles(
  catalog: TestCatalog,
): string[] {
  return [
    ...new Set(
      [
        ...catalog.suites.map((suite) => suite.file),
        ...catalog.specs.map((spec) => spec.file),
      ].filter(
        (file): file is string => !!file,
      ),
    ),
  ].sort();
}

export function getSpecIdsForFile(
  catalog: TestCatalog,
  file: string,
): string[] {
  return catalog.specs
    .filter((spec) => spec.file === file)
    .map((spec) => spec.id);
}