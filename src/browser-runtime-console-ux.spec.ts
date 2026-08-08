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

  it('installs the Playground runtime', () => {
    expect(source).toContain(
      'function installTestifyPlayground(',
    );

    expect(source).toContain(
      'installTestifyPlayground(',
    );
  });

  it('installs Playground value formatters', () => {
    expect(source).toContain(
      'function installTestifyPlaygroundFormatters(',
    );

    expect(source).toContain(
      'installTestifyPlaygroundFormatters();',
    );
  });

  it('keeps the browser runtime wired to the session Playground', () => {
    expect(source).toContain(
      '✅ Testify Playground ready!',
    );

    expect(source).toContain(
      'globalThis.session = session;',
    );
  });
});
