import {
  getEmbeddedTestMetadataSource,
} from './test-metadata-runtime';

describe('embedded Testify metadata path identity', () => {
  it('embeds the same canonical path normalization used by HMR', () => {
    const source =
      getEmbeddedTestMetadataSource();

    expect(source).toContain(
      'function normalizeTestifyFilePath(file)',
    );

    expect(source).toContain(
      'normalizeTestifyFilePath(file)',
    );

    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
