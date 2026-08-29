import fs from 'fs';
import os from 'os';
import path from 'path';
import { ProcessLock } from './process-lock';

describe('ProcessLock', () => {
  it('writes the PID lock file into the configured output directory', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-lock-'));
    const outDir = path.join(tempRoot, 'output');
    const lock = new ProcessLock(undefined, 4321, outDir);
    const expectedPath = path.join(outDir, '.testify-4321.pid');

    try {
      await lock.acquire(false);

      expect(fs.existsSync(expectedPath)).toBeTrue();
      expect(lock.getPidFilePath()).toBe(expectedPath);
      expect(fs.readFileSync(expectedPath, 'utf-8').trim()).toBe(String(process.pid));
    } finally {
      lock.releaseSync();
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('ignores missing pid files during sync release', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-lock-'));
    const lock = new ProcessLock(undefined, 4321, tempRoot);

    expect(() => lock.releaseSync()).not.toThrow();

    fs.rmSync(tempRoot, { recursive: true, force: true });
  });
});
