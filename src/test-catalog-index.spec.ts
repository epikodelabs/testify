import {
  createTestCatalogIndex,
  getDescendantSuiteIdsFromIndex,
  getSpecIdsForSuitesFromIndex,
} from './test-catalog-index';
import type {
  TestCatalog,
} from './test-catalog';

describe('TestCatalogIndex', () => {
  const catalog: TestCatalog = {
    suites: [
      {
        id: 'suite1',
        description: 'Root',
        fullName: 'Root',
      },
      {
        id: 'suite2',
        description: 'Child',
        fullName: 'Root Child',
        parentSuiteId: 'suite1',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'one',
        fullName: 'Root one',
        suiteId: 'suite1',
        file: 'root.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Root Child two',
        suiteId: 'suite2',
        file: 'child.spec.mjs',
      },
    ],
  };

  it('indexes specs, suites and files', () => {
    const index =
      createTestCatalogIndex(
        catalog,
      );

    expect(
      index.specById.get(
        'spec2',
      )?.description,
    ).toBe('two');

    expect(
      index.suiteById.get(
        'suite1',
      )?.description,
    ).toBe('Root');

    expect(
      index.specIdsByFile.get(
        'child.spec.mjs',
      ),
    ).toEqual([
      'spec2',
    ]);
  });

  it('finds descendant suites without scanning the full catalog repeatedly', () => {
    const index =
      createTestCatalogIndex(
        catalog,
      );

    expect(
      [
        ...getDescendantSuiteIdsFromIndex(
          index,
          ['suite1'],
        ),
      ],
    ).toEqual([
      'suite1',
      'suite2',
    ]);

    expect(
      getSpecIdsForSuitesFromIndex(
        index,
        ['suite1'],
      ),
    ).toEqual([
      'spec1',
      'spec2',
    ]);
  });
});
