import {
  getBrowserPlaygroundFormattersSource,
} from './browser-playground-formatters';

describe('Testify Playground DevTools formatters', () => {
  function installFormatter(): any {
    const previous =
      (globalThis as any).devtoolsFormatters;

    (globalThis as any).devtoolsFormatters = [];

    const source =
      getBrowserPlaygroundFormattersSource();

    const install = new Function(
      source +
        '\nreturn installTestifyPlaygroundFormatters;',
    )();

    install();

    const formatter =
      (globalThis as any)
        .devtoolsFormatters[0];

    (globalThis as any).devtoolsFormatters =
      previous;

    return formatter;
  }

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () =>
        new Function(
          getBrowserPlaygroundFormattersSource(),
        ),
    ).not.toThrow();
  });

  it('formats a planned execution without changing its data shape', () => {
    const formatter =
      installFormatter();

    const tests = Object.freeze([
      Object.freeze({
        id: 'spec-1',
        description: 'restores snapshot',
        fullName:
          'Membrane restores snapshot',
        suiteId: 'suite-1',
        file: 'src/lazy.spec.mjs',
      }),
    ]);

    const plan: any = {
      specIds: ['spec-1'],
      random: false,
      catalogVersion: 7,
      source: {
        kind: 'suite',
      },
    };

    Object.defineProperties(plan, {
      tests: {
        enumerable: false,
        value: () => tests,
      },
      filter: {
        enumerable: false,
        value: () => plan,
      },
      slice: {
        enumerable: false,
        value: () => plan,
      },
    });

    const header =
      formatter.header(plan);

    expect(
      JSON.stringify(header),
    ).toContain(
      'Execution Plan',
    );

    expect(
      JSON.stringify(header),
    ).toContain(
      '1 tests',
    );

    expect(
      JSON.stringify(
        formatter.body(plan),
      ),
    ).toContain(
      'Membrane restores snapshot',
    );

    expect(
      JSON.stringify(plan),
    ).toBe(
      '{"specIds":["spec-1"],"random":false,"catalogVersion":7,"source":{"kind":"suite"}}',
    );
  });

  it('formats test, suite, file, and result collections by identity', () => {
    const formatter =
      installFormatter();

    const tests = [{
      suiteId: 'suite-1',
      id: 'spec-1',
      name: 'works',
      fullName: 'Forms works',
      file: 'forms.spec.mjs',
    }];

    const suites = [{
      parentSuiteId: '',
      id: 'suite-1',
      name: 'Forms',
      fullName: 'Forms',
      file: 'forms.spec.mjs',
    }];

    const files = [{
      file: 'forms.spec.mjs',
      specs: 3,
    }];

    const results = [{
      id: 'spec-1',
      description: 'works',
      fullName: 'Forms works',
      status: 'failed',
      failedExpectations: [{}],
    }];

    expect(
      JSON.stringify(
        formatter.header(tests),
      ),
    ).toContain('Tests');

    expect(
      JSON.stringify(
        formatter.header(suites),
      ),
    ).toContain('Suites');

    expect(
      JSON.stringify(
        formatter.header(files),
      ),
    ).toContain('Files');

    expect(
      JSON.stringify(
        formatter.header(results),
      ),
    ).toContain('Results');

    expect(
      JSON.stringify(
        formatter.body(results),
      ),
    ).toContain('Forms works');
  });

  it('formats explicitly identified empty collections', () => {
    const formatter =
      installFormatter();

    const tests: any[] = [];
    Object.defineProperty(
      tests,
      '__testifyCollectionKind',
      { value: 'tests' },
    );

    expect(
      JSON.stringify(
        formatter.header(tests),
      ),
    ).toContain('Tests');

    expect(
      formatter.hasBody(tests),
    ).toBeTrue();
  });

  it('formats execution results and execution records', () => {
    const formatter =
      installFormatter();

    const plan: any = {
      specIds: ['spec-1'],
      random: false,
      source: { kind: 'all' },
      tests: () => [{
        id: 'spec-1',
        description: 'works',
        fullName: 'Forms works',
      }],
      filter: () => plan,
      slice: () => plan,
    };

    const result = {
      specResults: [{
        id: 'spec-1',
        description: 'works',
        fullName: 'Forms works',
        status: 'passed',
      }],
      total: 1,
      passed: 1,
      failed: 0,
      pending: 0,
    };

    const record = {
      plan,
      result,
      intent: { kind: 'all' },
      revision: 3,
    };

    expect(
      JSON.stringify(
        formatter.header(result),
      ),
    ).toContain(
      'Execution Result',
    );

    expect(
      JSON.stringify(
        formatter.header(record),
      ),
    ).toContain(
      'Execution',
    );
  });
});
