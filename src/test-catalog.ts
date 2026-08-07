export interface TestCatalogSuite {
  id: string;
  description: string;
  fullName: string;
  parentSuiteId?: string;
}

export interface TestCatalogSpec {
  id: string;
  description: string;
  fullName: string;
  suiteId?: string;
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
      suites.push({
        id: suite.id,
        description: getItemDescription(suite),
        fullName: getItemFullName(suite),
        parentSuiteId,
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
        specs.push({
          id: child.id,
          description: getItemDescription(child),
          fullName: getItemFullName(child),
          suiteId: owningSuiteId,
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
    isSuite,
    isSpec,
    createTestCatalogFromJasmineEnv,
    getCatalogSpecIds,
    getCatalogSuiteIds,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
