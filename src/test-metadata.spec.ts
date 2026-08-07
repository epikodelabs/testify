import {
  beginTestifyRegistrationScope,
  captureTestifyRegistration,
  endTestifyRegistrationScope,
  getCurrentTestifyRegistrationFile,
  getTestifyFile,
  getTestifyMetadata,
  setTestifyFile,
  setTestifyMetadata,
  withTestifyRegistrationScope,
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

  it('captures registrations within a file scope', () => {
    const suite = {};
    const test = {};

    beginTestifyRegistrationScope('forms.spec.ts');

    try {
      captureTestifyRegistration(suite);
      captureTestifyRegistration(test);
    } finally {
      endTestifyRegistrationScope();
    }

    expect(getTestifyFile(suite)).toBe('forms.spec.ts');
    expect(getTestifyFile(test)).toBe('forms.spec.ts');
    expect(getCurrentTestifyRegistrationFile()).toBeUndefined();
  });

  it('restores nested registration scopes', async () => {
    const outer = {};
    const inner = {};
    const after = {};

    await withTestifyRegistrationScope(
      'outer.spec.ts',
      async () => {
        captureTestifyRegistration(outer);

        await withTestifyRegistrationScope(
          'inner.spec.ts',
          async () => {
            captureTestifyRegistration(inner);
          },
        );

        captureTestifyRegistration(after);
      },
    );

    expect(getTestifyFile(outer)).toBe('outer.spec.ts');
    expect(getTestifyFile(inner)).toBe('inner.spec.ts');
    expect(getTestifyFile(after)).toBe('outer.spec.ts');
  });
});
