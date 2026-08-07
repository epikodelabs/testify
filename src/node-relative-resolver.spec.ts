import fs from 'fs';
import os from 'os';
import path from 'path';
import { resolveRelativePath } from './node-relative-resolver';

describe('node relative resolver', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-resolver-'));
    fs.mkdirSync(path.join(root, 'tests'), { recursive: true });
    fs.mkdirSync(path.join(root, 'lib'), { recursive: true });

    fs.writeFileSync(path.join(root, 'tests', 'example.spec.ts'), '');
    fs.writeFileSync(path.join(root, 'tests', 'helper.ts'), '');
    fs.writeFileSync(path.join(root, 'lib', 'bind-form.ts'), '');
    fs.writeFileSync(path.join(root, 'lib', 'index.ts'), '');
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('resolves extensionless relative TypeScript files', () => {
    const parent = path.join(root, 'tests', 'example.spec.ts');

    expect(resolveRelativePath('../lib/bind-form', parent)).toBe(
      path.join(root, 'lib', 'bind-form.ts'),
    );

    expect(resolveRelativePath('./helper', parent)).toBe(
      path.join(root, 'tests', 'helper.ts'),
    );
  });

  it('resolves directory imports to TypeScript index files', () => {
    const parent = path.join(root, 'tests', 'example.spec.ts');

    expect(resolveRelativePath('../lib', parent)).toBe(
      path.join(root, 'lib', 'index.ts'),
    );
  });

  it('does not take ownership of package imports', () => {
    const parent = path.join(root, 'tests', 'example.spec.ts');

    expect(resolveRelativePath('some-package', parent)).toBeNull();
  });
});
