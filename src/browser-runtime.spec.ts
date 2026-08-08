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
      'installTestifyPlayground(',
    );
  });

  it('does not expose a separate runner facade', () => {
    expect(source).not.toContain(
      'globalThis.runner =',
    );
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
