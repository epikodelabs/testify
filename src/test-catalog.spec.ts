import {
  createTestCatalogFromJasmineEnv,
} from './test-catalog';
import {
  getSpecIdsForSuites,
  resolveTestSelector,
} from './test-selection';

describe('TestCatalog', () => {
  const makeSpec = (
    id: string,
    description: string,
    fullName: string,
  ) => ({
    id,
    description,
    getFullName: () => fullName,
  });

  const makeSuite = (
    id: string,
    description: string,
    fullName: string,
    children: any[] = [],
  ) => ({
    id,
    description,
    children,
    getFullName: () => fullName,
  });

  it('captures suite parent ids and spec suite ids from the Jasmine tree', () => {
    const leaf = makeSpec(
      'spec1',
      'works',
      'Parent Child works',
    );

    const child = makeSuite(
      'suite2',
      'Child',
      'Parent Child',
      [leaf],
    );

    const parent = makeSuite(
      'suite1',
      'Parent',
      'Parent',
      [child],
    );

    const top = makeSuite(
      'suite0',
      'Jasmine__TopLevel__Suite',
      '',
      [parent],
    );

    const env = {
      topSuite: () => top,
    } as unknown as jasmine.Env;

    const catalog =
      createTestCatalogFromJasmineEnv(env);

    expect(catalog.rootSuiteId).toBe('suite0');
    expect(catalog.suites).toEqual([
      {
        id: 'suite1',
        description: 'Parent',
        fullName: 'Parent',
        parentSuiteId: undefined,
      },
      {
        id: 'suite2',
        description: 'Child',
        fullName: 'Parent Child',
        parentSuiteId: 'suite1',
      },
    ]);

    expect(catalog.specs).toEqual([
      {
        id: 'spec1',
        description: 'works',
        fullName: 'Parent Child works',
        suiteId: 'suite2',
      },
    ]);
  });

  it('resolves suite ids to every descendant spec', () => {
    const catalog = {
      suites: [
        {
          id: 'suite1',
          description: 'Parent',
          fullName: 'Parent',
        },
        {
          id: 'suite2',
          description: 'Child',
          fullName: 'Parent Child',
          parentSuiteId: 'suite1',
        },
      ],
      specs: [
        {
          id: 'spec1',
          description: 'one',
          fullName: 'Parent one',
          suiteId: 'suite1',
        },
        {
          id: 'spec2',
          description: 'two',
          fullName: 'Parent Child two',
          suiteId: 'suite2',
        },
      ],
    };

    expect(
      getSpecIdsForSuites(
        catalog,
        ['suite1'],
      ),
    ).toEqual(['spec1', 'spec2']);

    expect(
      resolveTestSelector(
        catalog,
        'suite1',
      ),
    ).toEqual(['spec1', 'spec2']);
  });
});


describe('TestCatalog file ownership', () => {
  it('captures file ownership from Jasmine metadata', () => {
    const spec = {
      id: 'spec1',
      description: 'works',
      _filePath: 'forms.spec.js',
      getFullName: () => 'Forms works',
    };

    const suite = {
      id: 'suite1',
      description: 'Forms',
      _filePath: 'forms.spec.js',
      children: [spec],
      getFullName: () => 'Forms',
    };

    const top = {
      id: 'suite0',
      description: 'Jasmine__TopLevel__Suite',
      children: [suite],
      getFullName: () => '',
    };

    const env = {
      topSuite: () => top,
    } as unknown as jasmine.Env;

    const catalog =
      createTestCatalogFromJasmineEnv(env);

    expect(catalog.suites[0]!.file).toBe(
      'forms.spec.js',
    );
    expect(catalog.specs[0]!.file).toBe(
      'forms.spec.js',
    );
  });
});
