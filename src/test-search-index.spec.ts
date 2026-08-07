import {
  createTestCatalogIndex,
  searchIndexEntries,
} from './test-catalog-index';
import {
  findCatalogSpecs,
  findCatalogSuites,
  getSpecIdsForFiles,
} from './test-selection';
import type {
  TestCatalog,
} from './test-catalog';

describe('TestCatalog search index', () => {
  const catalog: TestCatalog = {
    suites: [
      {
        id: 'suite1',
        description: 'Membrane Forms',
        fullName: 'Membrane Forms',
        file: 'forms.spec.mjs',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'binds controls',
        fullName:
          'Membrane Forms binds controls',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'measures snapshots',
        fullName:
          'Performance measures snapshots',
        file:
          'performance.spec.mjs',
      },
    ],
  };

  it('builds normalized search entries', () => {
    const index =
      createTestCatalogIndex(
        catalog,
      );

    expect(
      searchIndexEntries(
        index.specSearch,
        'BIND',
      ),
    ).toEqual([
      'spec1',
    ]);
  });

  it('searches specs without direct catalog filtering', () => {
    expect(
      findCatalogSpecs(
        catalog,
        'snapshots',
      ).map(
        (spec) => spec.id,
      ),
    ).toEqual([
      'spec2',
    ]);
  });

  it('searches suites case-insensitively', () => {
    expect(
      findCatalogSuites(
        catalog,
        'membrane',
      ).map(
        (suite) => suite.id,
      ),
    ).toEqual([
      'suite1',
    ]);
  });

  it('searches files through file index', () => {
    expect(
      getSpecIdsForFiles(
        catalog,
        /performance/i,
      ),
    ).toEqual([
      'spec2',
    ]);
  });
});
