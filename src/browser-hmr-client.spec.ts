import {
  getBrowserHmrClientScript,
} from './browser-hmr-client';

describe('browser HMR registration boundary', () => {
  const source =
    getBrowserHmrClientScript();

  it('imports an updated spec exactly once per HMR application path', () => {
    const importMatches =
      source.match(
        /import\s*\(/g,
      ) ?? [];

    expect(
      importMatches.length,
    ).toBe(1);
  });

  it('detaches old registrations before importing the replacement spec', () => {
    const detachIndex =
      source.indexOf(
        'detachFilePathSuites(filePath);',
      );

    const importIndex =
      source.indexOf(
        'import(',
      );

    expect(detachIndex)
      .toBeGreaterThan(-1);

    expect(importIndex)
      .toBeGreaterThan(detachIndex);
  });

  it('stores the single imported module in the HMR registry', () => {
    expect(source).toContain(
      'moduleRegistry.set(',
    );

    expect(source).not.toContain(
      'let newModule = null',
    );

    expect(source).not.toContain(
      'hotUpdateSpec(update.path, newModule)',
    );
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
