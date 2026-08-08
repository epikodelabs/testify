import {
  beginTestifyRegistrationScope,
  endTestifyRegistrationScope,
  getCurrentTestifyRegistrationFile,
  getTestifyFile,
  normalizeTestifyFilePath,
  setTestifyFile,
} from './test-metadata';

describe('Testify file identity normalization', () => {
  it('normalizes leading slashes and Windows separators', () => {
    expect(
      normalizeTestifyFilePath(
        '\\\\tests\\\\forms.spec.mjs',
      ),
    ).toBe(
      'tests/forms.spec.mjs',
    );

    expect(
      normalizeTestifyFilePath(
        '/tests/forms.spec.mjs',
      ),
    ).toBe(
      'tests/forms.spec.mjs',
    );
  });

  it('stores canonical file metadata', () => {
    const item = {};

    setTestifyFile(
      item,
      '\\\\forms__abc.spec.mjs',
    );

    expect(
      getTestifyFile(item),
    ).toBe(
      'forms__abc.spec.mjs',
    );
  });

  it('canonicalizes registration scopes', () => {
    beginTestifyRegistrationScope(
      '/nested\\\\forms.spec.mjs',
    );

    try {
      expect(
        getCurrentTestifyRegistrationFile(),
      ).toBe(
        'nested/forms.spec.mjs',
      );
    } finally {
      endTestifyRegistrationScope();
    }
  });
});
