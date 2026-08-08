import {
  CatalogState,
} from './catalog-state';
import type {
  TestCatalog,
} from './test-catalog';

describe('CatalogState change retention', () => {
  const initial: TestCatalog = {
    rootSuiteId: 'root',
    suites: [
      {
        id: 'suite1',
        description: 'Example',
        fullName: 'Example',
        file: 'example.spec.mjs',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'one',
        fullName: 'Example one',
        suiteId: 'suite1',
        file: 'example.spec.mjs',
      },
    ],
  };

  it('does not erase the last structural change on an equivalent sync', () => {
    const state =
      new CatalogState(
        initial,
      );

    const updated: TestCatalog = {
      ...initial,
      specs: [
        {
          ...initial.specs[0],
          id: 'spec9',
        },
      ],
    };

    const change =
      state.update(
        updated,
      );

    expect(change.changed)
      .toBeTrue();

    expect(change.removedSpecIds)
      .toEqual([
        'spec1',
      ]);

    expect(change.addedSpecIds)
      .toEqual([
        'spec9',
      ]);

    const noChange =
      state.update({
        ...updated,
        suites:
          updated.suites.map(
            (suite) => ({
              ...suite,
            }),
          ),
        specs:
          updated.specs.map(
            (spec) => ({
              ...spec,
            }),
          ),
      });

    expect(noChange.changed)
      .toBeFalse();

    expect(state.version)
      .toBe(2);

    expect(state.changes.removedSpecIds)
      .toEqual([
        'spec1',
      ]);

    expect(state.changes.addedSpecIds)
      .toEqual([
        'spec9',
      ]);
  });
});
