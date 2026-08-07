import {
  listCatalogFiles,
  listCatalogSuites,
  listCatalogTests,
} from './catalog-query';
import type {
  TestCatalog,
} from './test-catalog';

describe('Catalog query helpers', () => {
  const catalog: TestCatalog = {
    suites: [
      {
        id: 'suite1',
        description: 'Forms',
        fullName: 'Forms',
        file: 'forms.spec.mjs',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'one',
        fullName: 'Forms one',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Forms two',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
    ],
  };

  it('lists tests', () => {
    expect(
      listCatalogTests(catalog),
    ).toEqual([
      {
        suiteId: 'suite1',
        id: 'spec1',
        name: 'one',
        fullName: 'Forms one',
        file: 'forms.spec.mjs',
      },
      {
        suiteId: 'suite1',
        id: 'spec2',
        name: 'two',
        fullName: 'Forms two',
        file: 'forms.spec.mjs',
      },
    ]);
  });

  it('lists suites', () => {
    expect(
      listCatalogSuites(catalog)[0],
    ).toEqual({
      parentSuiteId: '',
      id: 'suite1',
      name: 'Forms',
      fullName: 'Forms',
      file: 'forms.spec.mjs',
    });
  });

  it('groups files with spec counts', () => {
    expect(
      listCatalogFiles(catalog),
    ).toEqual([
      {
        file: 'forms.spec.mjs',
        specs: 2,
      },
    ]);
  });
});