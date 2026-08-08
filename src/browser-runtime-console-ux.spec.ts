import {
  getBrowserRuntimeScript,
} from './browser-runtime';

describe('Browser runtime runner console UX', () => {
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
      'help: printRunnerHelp',
    );

    expect(source).toContain(
      'runner.listTests()',
    );

    expect(source).toContain(
      'runner.listSuites()',
    );

    expect(source).toContain(
      'runner.listFiles()',
    );

    expect(source).toContain(
      "await runner.runTest('<test>')",
    );

    expect(source).toContain(
      "await runner.runSuite('<suite>')",
    );

    expect(source).toContain(
      "await runner.runFile('<file>')",
    );

    expect(source).toContain(
      "console.log(lines.join('\\\\n'))",
    );
  });

  it('prints only a concise startup hint', () => {
    expect(source).toContain(
      '✅ Testify runner ready!',
    );

    expect(source).toContain(
      'Browser console: runner.help() · runner.listTests() · runner.listSuites()',
    );
  });

  it('gives actionable feedback for missing selectors', () => {
    expect(source).toContain(
      '[Testify] Missing ${kind} selector.',
    );

    expect(source).toContain(
      'Try ${listCommand}',
    );
  });

  it('gives actionable feedback when selectors match nothing', () => {
    expect(source).toContain(
      '[Testify] No ${kind}s matched ${formatSelector(selector)}.',
    );

    expect(source).toContain(
      'runner.listTests() or runner.findTests(...)',
    );

    expect(source).toContain(
      'runner.listSuites() or runner.findSuites(...)',
    );

    expect(source).toContain(
      'runner.listFiles() or runner.findFiles(...)',
    );
  });

  it('shows ambiguous matches before running them', () => {
    expect(source).toContain(
      '[Testify] ${matches.length} ${kind}s matched ${formatSelector(selector)}.',
    );

    expect(source).toContain(
      'console.table(',
    );
  });

  it('wraps test, suite, and file execution through one selection helper', () => {
    expect(source).toContain(
      'runTest: (selector) =>',
    );

    expect(source).toContain(
      "runSelection(\\n          'test'",
    );

    expect(source).toContain(
      "runSelection(\\n          'suite'",
    );

    expect(source).toContain(
      "runSelection(\\n          'file'",
    );
  });
});
