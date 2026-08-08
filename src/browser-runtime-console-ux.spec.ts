import {
  getBrowserRuntimeScript,
} from './browser-runtime';

describe('Browser runtime Playground console UX', () => {
  const source =
    getBrowserRuntimeScript({
      stopOnSpecFailure: false,
      initialSeed: 0,
      initialRandom: false,
    });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });

  it('exposes concise interactive help', () => {
    expect(source).toContain(
      'function printSessionHelp()',
    );

    expect(source).toContain(
      'session.tests()',
    );

    expect(source).toContain(
      'session.suites()',
    );

    expect(source).toContain(
      'session.files()',
    );

    expect(source).toContain(
      "await session.runSpec('<spec>', options?)",
    );

    expect(source).toContain(
      "await session.runSuite('<suite>', options?)",
    );

    expect(source).toContain(
      "await session.runFile('<file>', options?)",
    );

    expect(source).toContain(
      "lines.join('\\\\n')",
    );
  });

  it('prints only a concise startup hint', () => {
    expect(source).toContain(
      '✅ Testify Playground ready!',
    );

    expect(source).toContain(
      'Browser console: session.help() · session.tests() · session.retry()',
    );
  });

  it('gives actionable feedback for missing selectors', () => {
    expect(source).toContain(
      "'[Testify] Missing ' + kind + ' selector.'",
    );

    expect(source).toContain(
      "'Try ' + listCommand",
    );
  });

  it('gives actionable feedback when selectors match nothing', () => {
    expect(source).toContain(
      "'[Testify] No ' + kind + 's matched ' + formatSelector(selector) + '.'",
    );

    expect(source).toContain(
      'session.tests(...)',
    );

    expect(source).toContain(
      'session.suites(...)',
    );

    expect(source).toContain(
      'session.files(...)',
    );
  });

  it('shows ambiguous matches before running them', () => {
    expect(source).toContain(
      "'[Testify] ' + matches.length + ' ' + kind + 's matched ' + formatSelector(selector) + '.'",
    );

    expect(source).toContain(
      'observableCollection(',
    );

    expect(source).not.toContain(
      'console.table(',
    );
  });

  it('wraps spec, suite, and file execution through one selection helper', () => {
    expect(source).toContain(
      'runSpec: (',
    );

    expect(source).toContain(
      "runSelection(\n            'spec'",
    );

    expect(source).toContain(
      "runSelection(\n            'suite'",
    );

    expect(source).toContain(
      "runSelection(\n            'file'",
    );
  });
});
