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
  return catalog.specs.filter((spec) =>
    matchesText(
      selector,
      spec.id,
      spec.description,
      spec.fullName,
    ),
  );
}

export function findCatalogSuites(
  catalog: TestCatalog,
  selector: string | RegExp,
): TestCatalogSuite[] {
  return catalog.suites.filter((suite) =>
    matchesText(
      selector,
      suite.id,
      suite.description,
      suite.fullName,
    ),
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

export function resolveTestSelector(
  catalog: TestCatalog,
  selector: TestSelector,
): string[] {
  if (typeof selector === 'string') {
    const exactSpec = catalog.specs.find(
      (spec) => spec.id === selector,
    );
    if (exactSpec) return [exactSpec.id];

    const exactSuite = catalog.suites.find(
      (suite) => suite.id === selector,
    );
    if (exactSuite) {
      return getSpecIdsForSuites(
        catalog,
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

    return getSpecIdsForSuites(
      catalog,
      suites.map((suite) => suite.id),
    );
  }

  return [];
}


export function getEmbeddedTestSelectionSource(): string {
  return [
    matchesText,
    findCatalogSpecs,
    findCatalogSuites,
    getDescendantSuiteIds,
    getSpecIdsForSuites,
    resolveTestSelector,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
