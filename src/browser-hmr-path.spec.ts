import {
  getBrowserHmrClientScript,
} from './browser-hmr-client';

describe('browser HMR path identity', () => {
  const source =
    getBrowserHmrClientScript();

  it('normalizes update and catalog file paths before comparing them', () => {
    expect(source).toContain(
      'normalizeHmrPath(filePath)',
    );

    expect(source).toContain(
      "spec.file ?? ''",
    );

    expect(source).toContain(
      "suite.file ?? ''",
    );

    expect(source).not.toContain(
      'spec.file === filePath',
    );

    expect(source).not.toContain(
      'suite.file === filePath',
    );
  });

  it('normalizes the module registry key and import path', () => {
    expect(source).toContain(
      'const normalizedFilePath =',
    );

    expect(source).toContain(
      'moduleRegistry.set(',
    );

    expect(source).toContain(
      "'/' +",
    );
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
