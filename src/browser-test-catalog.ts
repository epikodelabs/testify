import type { TestCatalog } from './test-catalog';

export function createBrowserTestCatalog(env: jasmine.Env): TestCatalog {
  const topSuite = env.topSuite();

  if (!topSuite) {
    return {
      suites: [],
      specs: [],
    };
  }

  const suites: TestCatalog['suites'] = [];
  const specs: TestCatalog['specs'] = [];

  const traverse = (
    suite: any,
    parentSuiteId?: string,
    includeSuite = true,
  ) => {
    if (includeSuite) {
      suites.push({
        id: suite.id,
        description: suite.description ?? suite.id,
        fullName:
          typeof suite.getFullName === 'function'
            ? suite.getFullName()
            : suite.description ?? suite.id,
        parentSuiteId,
      });
    }

    const suiteId = includeSuite
      ? suite.id
      : undefined;

    for (const child of suite.children ?? []) {
      if (Array.isArray(child.children)) {
        traverse(child, suiteId, true);
      } else if (typeof child.id === 'string') {
        specs.push({
          id: child.id,
          description: child.description ?? child.id,
          fullName:
            typeof child.getFullName === 'function'
              ? child.getFullName()
              : child.description ?? child.id,
          suiteId,
        });
      }
    }
  };

  traverse(topSuite, undefined, false);

  return {
    rootSuiteId: topSuite.id,
    suites,
    specs,
  };
}
