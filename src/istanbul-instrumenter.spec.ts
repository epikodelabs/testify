import { IstanbulInstrumenter } from './istanbul-instrumenter';
import type { ViteJasmineConfig } from './vite-jasmine-config';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

describe('IstanbulInstrumenter', () => {
  const config = (outDir: string): ViteJasmineConfig => ({
    srcDirs: ['src'],
    testDirs: ['tests'],
    exclude: [],
    outDir,
    coverage: true,
    preserveOutputs: false,
  });

  const withTempOutDir = (
    fn: (outDir: string) => Promise<void>,
  ): Promise<void> => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-coverage-'));
    return fn(outDir).finally(() =>
      fs.rmSync(outDir, { recursive: true, force: true }),
    );
  };

  it('leaves vendor chunks uninstrumented', async () => {
    await withTempOutDir(async outDir => {
      for (const name of ['vendor.mjs', 'vendor2.mjs', 'vendor3.mjs']) {
        const file = path.join(outDir, name);
        fs.writeFileSync(file, 'export const x = 1;\n', 'utf-8');
        const result = await new IstanbulInstrumenter(
          config(outDir),
        ).instrumentFile(file);
        expect(result.code).toBe('export const x = 1;\n');
      }
    });
  });

  it('instruments first-party modules at the outDir root', async () => {
    await withTempOutDir(async outDir => {
      const file = path.join(outDir, 'counter.mjs');
      fs.writeFileSync(file, 'export const x = 1;\n', 'utf-8');
      const result = await new IstanbulInstrumenter(
        config(outDir),
      ).instrumentFile(file);
      expect(result.code).toContain('__coverage__');
    });
  });

  it('still skips spec modules when coverage is enabled', async () => {
    await withTempOutDir(async outDir => {
      const file = path.join(outDir, 'thing.spec.mjs');
      fs.writeFileSync(file, 'export const x = 1;\n', 'utf-8');
      const result = await new IstanbulInstrumenter(
        config(outDir),
      ).instrumentFile(file);
      expect(result.code).toBe('export const x = 1;\n');
    });
  });

  it('does not treat a nested vendor-named module as a vendor chunk', async () => {
    await withTempOutDir(async outDir => {
      const nested = path.join(outDir, 'lib');
      fs.mkdirSync(nested, { recursive: true });
      const file = path.join(nested, 'vendor.mjs');
      fs.writeFileSync(file, 'export const x = 1;\n', 'utf-8');
      const result = await new IstanbulInstrumenter(
        config(outDir),
      ).instrumentFile(file);
      expect(result.code).toContain('__coverage__');
    });
  });
});
