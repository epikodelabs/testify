import {
  CatalogState,
  fingerprintTestCatalog,
} from './catalog-state';
import type {
  TestCatalog,
} from './test-catalog';

describe('CatalogState', () => {
  const catalog: TestCatalog = {
    suites: [
      {
        id: 'suite1',
        description: 'Forms',
        fullName: 'Forms',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'one',
        fullName: 'Forms one',
        suiteId: 'suite1',
        file: 'forms.spec.js',
      },
    ],
  };

  it('keeps the same revision for equivalent catalog objects', () => {
    const state =
      new CatalogState(
        catalog,
      );

    const index =
      state.index;

    const change =
      state.update({
        rootSuiteId:
          catalog.rootSuiteId,
        suites:
          catalog.suites.map(
            (suite) => ({
              ...suite,
            }),
          ),
        specs:
          catalog.specs.map(
            (spec) => ({
              ...spec,
            }),
          ),
      });

    expect(change.changed)
      .toBeFalse();

    expect(state.version)
      .toBe(1);

    expect(state.index)
      .toBe(index);
  });

  it('increments revision and reports changes when catalog content changes', () => {
    const state =
      new CatalogState(
        catalog,
      );

    const change =
      state.update({
        ...catalog,
        specs: [
          ...catalog.specs,
          {
            id: 'spec2',
            description: 'two',
            fullName: 'Forms two',
            suiteId: 'suite1',
            file: 'forms.spec.js',
          },
        ],
      });

    expect(change.changed)
      .toBeTrue();

    expect(change.addedSpecIds)
      .toEqual([
        'spec2',
      ]);

    expect(state.version)
      .toBe(2);
  });

  it('fingerprints by content rather than object identity', () => {
    expect(
      fingerprintTestCatalog(
        catalog,
      ),
    ).toBe(
      fingerprintTestCatalog({
        ...catalog,
        suites:
          catalog.suites.map(
            (suite) => ({
              ...suite,
            }),
          ),
        specs:
          catalog.specs.map(
            (spec) => ({
              ...spec,
            }),
          ),
      }),
    );
  });
});
