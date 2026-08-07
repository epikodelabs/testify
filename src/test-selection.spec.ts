import {
  resolveTestSelector,
  getSpecIdsForSuites,
} from './test-selection';
import type { TestCatalog } from './test-catalog';

describe('TestSelector', () => {
  const catalog: TestCatalog = {
    rootSuiteId: 'suite0',
    suites: [
      {
        id: 'suite1',
        description: 'Forms',
        fullName: 'Forms',
      },
      {
        id: 'suite2',
        description: 'Bindings',
        fullName: 'Forms Bindings',
        parentSuiteId: 'suite1',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'creates fields',
        fullName: 'Forms creates fields',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'binds controls',
        fullName: 'Forms Bindings binds controls',
        suiteId: 'suite2',
        file: 'bindings.spec.mjs',
      },
    ],
  };

  it('resolves an exact spec id', () => {
    expect(resolveTestSelector(catalog, 'spec2')).toEqual(['spec2']);
  });

  it('resolves an exact suite id including descendant suites', () => {
    expect(resolveTestSelector(catalog, 'suite1')).toEqual(['spec1', 'spec2']);
  });

  it('resolves suite regular expressions', () => {
    expect(
      resolveTestSelector(catalog, { suite: /Bindings/ }),
    ).toEqual(['spec2']);
  });

  it('resolves spec regular expressions without selecting suites', () => {
    expect(
      resolveTestSelector(catalog, { spec: /binds/ }),
    ).toEqual(['spec2']);
  });

  it('resolves file selectors', () => {
    expect(
      resolveTestSelector(
        catalog,
        { file: 'bindings.spec.mjs' },
      ),
    ).toEqual(['spec2']);
  });

  it('resolves file regular expressions', () => {
    expect(
      resolveTestSelector(
        catalog,
        { file: /forms\.spec/ },
      ),
    ).toEqual(['spec1']);
  });
});
