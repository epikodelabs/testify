import fs from 'fs';
import os from 'os';
import path from 'path';
import { ProjectSetup } from './project-setup';

describe('ProjectSetup', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-setup-'));
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('adds jasmine when compilerOptions.types is explicitly constrained', () => {
    const tsconfigPath = path.join(root, 'tsconfig.json');
    fs.writeFileSync(
      tsconfigPath,
      JSON.stringify({ compilerOptions: { types: ['node'] } }, null, 2),
    );

    const result = ProjectSetup.configure(root);
    const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    expect(result.changed).toBeTrue();
    expect(config.compilerOptions.types).toEqual(['node', 'jasmine']);
  });

  it('creates compilerOptions.types with jasmine when the project has no explicit list', () => {
    const tsconfigPath = path.join(root, 'tsconfig.json');
    const initial = JSON.stringify({ compilerOptions: { strict: true } }, null, 2);
    fs.writeFileSync(tsconfigPath, initial);

    const result = ProjectSetup.configure(root);
    const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    expect(result.changed).toBeTrue();
    expect(config.compilerOptions.types).toEqual(['jasmine']);
  });

  it('creates compilerOptions and types when compilerOptions is missing entirely', () => {
    const tsconfigPath = path.join(root, 'tsconfig.json');
    fs.writeFileSync(tsconfigPath, JSON.stringify({ extends: './tsconfig.base.json' }, null, 2));

    const result = ProjectSetup.configure(root);
    const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    expect(result.changed).toBeTrue();
    expect(config.compilerOptions.types).toEqual(['jasmine']);
  });

  it('is idempotent when jasmine is already registered', () => {
    const tsconfigPath = path.join(root, 'tsconfig.json');
    fs.writeFileSync(
      tsconfigPath,
      JSON.stringify({ compilerOptions: { types: ['node', 'jasmine'] } }, null, 2),
    );

    const first = ProjectSetup.configure(root);
    const second = ProjectSetup.configure(root);
    const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    expect(first.changed).toBeFalse();
    expect(second.changed).toBeFalse();
    expect(config.compilerOptions.types).toEqual(['node', 'jasmine']);
  });
});
