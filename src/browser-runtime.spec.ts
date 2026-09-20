import {
  getBrowserRuntimeScript,
} from './browser-runtime';

describe('Browser runtime', () => {
  const source =
    getBrowserRuntimeScript({
      stopOnSpecFailure: false,
      initialSeed: 0,
      initialRandom: false,
    });

  it('wires the reusable session into the Playground installer', () => {
    expect(source).toContain(
      'new RunnerSession(',
    );

    expect(source).toContain(
      'installTestifyPlaygroundFormatters();',
    );

    expect(source).toContain(
      'installTestifyPlayground(',
    );
  });

  it('embeds the helper required by transformed browser sources', () => {
    expect(source).toContain(
      'function __name(target, value)',
    );
  });

  it('does not expose a separate runner facade', () => {
    expect(source).not.toContain(
      'globalThis.runner =',
    );
  });

  it('captures jasmineDone global failures in the execution result', () => {
    expect(source).toContain(
      'globalFailures:',
    );

    expect(source).toContain(
      'result?.failedExpectations',
    );
  });

  it('attributes async browser errors to the active spec before falling back to run-level failures', () => {
    expect(source).toContain(
      "window.addEventListener(\n        'unhandledrejection'",
    );

    expect(source).toContain(
      'pendingSpecFailures: new Map()',
    );

    expect(source).toContain(
      'currentSpecId =\n          config.id;',
    );

    expect(source).toContain(
      'status:\n                  \'failed\'',
    );

    expect(source).toContain(
      'this.attributedFailureSignatures',
    );
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
