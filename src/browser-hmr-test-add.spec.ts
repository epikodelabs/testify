import {
  getBrowserHmrClientScript,
} from './browser-hmr-client';

describe('browser HMR new spec contract', () => {
  const source =
    getBrowserHmrClientScript();

  it('uses the normal hot-update transaction for a newly built spec', () => {
    expect(source).toContain(
      'await hotUpdateSpec(',
    );

    expect(source).toContain(
      'detachFilePathSuites(filePath);',
    );

    expect(source).toContain(
      'withTestifyRegistrationScope(',
    );
  });

  it('imports the new spec exactly once', () => {
    const importMatches =
      source.match(
        /import\s*\(/g,
      ) ?? [];

    expect(
      importMatches.length,
    ).toBe(1);
  });

  it('does not require a dedicated test-add browser branch', () => {
    expect(source).not.toContain(
      "update.type === 'test-add'",
    );
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
