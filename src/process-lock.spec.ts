import fs from 'fs';
import os from 'os';
import path from 'path';
import { ProcessLock } from './process-lock';
import { EXIT_CODES } from './exit-codes';

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

  it('preserves a live lock when process inspection fails', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-lock-'));
    const lock = new ProcessLock(undefined, 4321, tempRoot);
    fs.writeFileSync(lock.getPidFilePath(), '123456');
    spyOn(process, 'kill').and.returnValue(true);
    spyOn<any>(lock, 'getProcessName').and.rejectWith(new Error('tasklist unavailable'));
    try {
      await expectAsync(lock.acquire()).toBeRejectedWith(jasmine.objectContaining({ exitCode: EXIT_CODES.CONFIG_ERROR }));
      expect(fs.readFileSync(lock.getPidFilePath(), 'utf8')).toBe('123456');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('does not remove a lock acquired by another process', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-lock-'));
    const lock = new ProcessLock(undefined, 4321, tempRoot);
    fs.writeFileSync(lock.getPidFilePath(), '123456');
    try {
      lock.releaseSync();
      expect(fs.existsSync(lock.getPidFilePath())).toBeTrue();
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('treats dead PID probes as normal and permission-denied probes as alive', async () => {
    const lock = new ProcessLock();
    const error = Object.assign(new Error('dead'), { code: 'ESRCH' });
    spyOn(process, 'kill').and.throwError(error);
    expect(await (lock as any).isAlive(123456)).toBeFalse();
    error.code = 'EPERM';
    expect(await (lock as any).isAlive(123456)).toBeTrue();
  });
});
