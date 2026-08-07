import {
  getTestifyFile,
  getTestifyMetadata,
  setTestifyFile,
  setTestifyMetadata,
} from './test-metadata';

describe('Testify metadata registry', () => {
  it('stores metadata without mutating the target object', () => {
    const target: Record<string, unknown> = {};

    setTestifyFile(target, 'forms.spec.ts');

    expect(getTestifyFile(target)).toBe(
      'forms.spec.ts',
    );
    expect(
      Object.prototype.hasOwnProperty.call(
        target,
        '_filePath',
      ),
    ).toBeFalse();
  });

  it('merges metadata updates', () => {
    const target = {};

    setTestifyMetadata(target, {
      file: 'first.spec.ts',
    });
    setTestifyMetadata(target, {
      file: 'second.spec.ts',
    });

    expect(getTestifyMetadata(target)).toEqual({
      file: 'second.spec.ts',
    });
  });
});
