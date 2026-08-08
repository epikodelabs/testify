import {
  getBrowserHmrClientScript,
} from './browser-hmr-client';

describe('browser HMR removed spec contract', () => {
  const source =
    getBrowserHmrClientScript();

  it('detaches a removed spec without re-importing it', () => {
    expect(source).toContain(
      "update.type === 'test-remove'",
    );

    expect(source).toContain(
      'detachFilePathSuites(',
    );

    expect(source).toContain(
      'moduleRegistry.delete(',
    );
  });

  it('keeps one import path for normal hot updates', () => {
    const importMatches =
      source.match(
        /import\s*\(/g,
      ) ?? [];

    expect(
      importMatches.length,
    ).toBe(1);
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
