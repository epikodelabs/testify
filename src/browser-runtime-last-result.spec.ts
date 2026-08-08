import {
  getBrowserRuntimeScript,
} from './browser-runtime';

describe('Browser runtime last execution result', () => {
  const source =
    getBrowserRuntimeScript({
      stopOnSpecFailure: false,
      initialSeed: 0,
      initialRandom: false,
    });

  it('stores the most recent execution result', () => {
    expect(source).toContain(
      'let lastExecutionResult = null',
    );

    expect(source).toContain(
      'lastExecutionResult =',
    );

    expect(source).toContain(
      'last: () =>',
    );
  });

  it('routes all public execution helpers through result capture', () => {
    expect(source).toContain(
      'run: (selector) =>\\n        rememberExecution(',
    );

    expect(source).toContain(
      'runTest: (selector) =>\\n        rememberExecution(',
    );

    expect(source).toContain(
      'runSuite: (selector) =>\\n        rememberExecution(',
    );

    expect(source).toContain(
      'runFile: (selector) =>\\n        rememberExecution(',
    );

    expect(source).toContain(
      'return rememberExecution(',
    );
  });

  it('documents runner.last() in console help', () => {
    expect(source).toContain(
      'runner.last()',
    );
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
