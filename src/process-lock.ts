import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { logger } from './logger';
import { ProcessLockMessages } from './log-messages';
import { norm } from './utils';
import { EXIT_CODES, ExitCodeError } from './exit-codes';

export class ProcessLock {
  private pidFile: string;

  constructor(projectPath?: string, port?: number, lockDir?: string) {
    const cwd = norm(path.resolve(lockDir ?? process.cwd()));
    const parts: string[] = ['testify'];
    if (projectPath) {
      const sanitized = norm(path.resolve(projectPath))
        .replace(/^\//, '')
        .replace(/\//g, '_');
      parts.push(sanitized);
    }
    if (port !== undefined) {
      parts.push(String(port));
    }
    this.pidFile = path.join(cwd, `.${parts.join('-')}.pid`);
  }

  async acquire(killPrevious: boolean = true): Promise<void> {
    if (killPrevious) {
      await this.releasePrevious();
    }
    fs.mkdirSync(path.dirname(this.pidFile), { recursive: true });
    fs.writeFileSync(this.pidFile, String(process.pid), 'utf-8');
  }

  releaseSync(): void {
    try {
      if (fs.existsSync(this.pidFile) && fs.readFileSync(this.pidFile, 'utf8').trim() !== String(process.pid)) return;
      this.unlinkPidFileSync();
    } catch (error) {
      logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`);
      // ignore
    }
  }

  private async releasePrevious(): Promise<void> {
    try {
      if (!fs.existsSync(this.pidFile)) return;

      const raw = fs.readFileSync(this.pidFile, 'utf-8').trim();
      const pid = parseInt(raw, 10);
      if (!Number.isSafeInteger(pid) || pid <= 0) {
        this.unlinkPidFileSync();
        return;
      }
      if (pid === process.pid) {
        throw new Error('Another Testify runner in this process already owns the lock');
      }

      // Check if process is still alive
      try {
        process.kill(pid, 0);
      } catch (err: any) {
        if (err.code === 'EPERM') {
          // Process exists but we lack permission to query it (e.g. debugger attached).
          // Assume it's alive and proceed with the kill attempt.
        } else if (err.code === 'ESRCH') {
          // Stale PID file
          logger.println(ProcessLockMessages.staleLockFile(pid));
          this.unlinkPidFileSync();
          return;
        } else {
          throw err;
        }
      }

      // Verify the process is actually a Node process before killing it
      const processName = await this.getProcessName(pid);
      if (!processName || !/node/i.test(processName)) {
        logger.println(ProcessLockMessages.nonNodeProcess(pid, processName || 'unknown'));
        this.unlinkPidFileSync();
        return;
      }

      // Try graceful tree termination
      await this.killProcessTree(pid, false);
      await this.waitForExit(pid, 2000);

      // Force-kill the entire tree if still alive
      const stillAlive = await this.isAlive(pid);
      if (stillAlive) {
        await this.killProcessTree(pid, true);
        await this.waitForExit(pid, 2000);
      }

      // Verify final state and log
      const finalAlive = await this.isAlive(pid);
      if (finalAlive) {
        throw new Error(ProcessLockMessages.couldNotTerminate(pid));
      } else {
        logger.println(ProcessLockMessages.terminatedPrevious(pid));
      }
      this.unlinkPidFileSync();
    } catch (error) {
      throw new ExitCodeError(EXIT_CODES.CONFIG_ERROR, `Unable to acquire the previous Testify process lock: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
    }
  }

  private unlinkPidFileSync(): void {
    try {
      fs.unlinkSync(this.pidFile);
    } catch (error: any) {
      if (error?.code === 'ENOENT') {
        return;
      }
      throw error;
    }
  }

  private static readonly BROWSER_NAMES = /chrome|chromium|firefox|webkit|safari|edge/i;

  /**
   * Kill the target process and any browser children it may have spawned.
   * On Windows we enumerate children by ParentPID and only kill browsers.
   * On Unix we recursively find descendants and only kill browsers.
   */
  private async killProcessTree(pid: number, force: boolean): Promise<void> {
    // 1. Kill the main testify process (proven method on both platforms)
    try {
      if (process.platform === 'win32') {
        process.kill(pid);
      } else {
        process.kill(pid, force ? 'SIGKILL' : 'SIGTERM');
      }
    } catch (error) {
      logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`);
      // ignore — may already be gone
    }

    // 2. Find and kill only browser children — never touch unrelated descendants
    if (process.platform === 'win32') {
      const children = await this.getWindowsChildren(pid);
      for (const child of children) {
        if (ProcessLock.BROWSER_NAMES.test(child.name)) {
          try {
            process.kill(child.pid);
          } catch (error) {
            logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`);
            // ignore
          }
        }
      }
    } else {
      const descendants = await this.getDescendantPids(pid);
      for (const childPid of descendants) {
        const name = await this.getProcessName(childPid);
        if (name && ProcessLock.BROWSER_NAMES.test(name)) {
          try {
            process.kill(childPid, force ? 'SIGKILL' : 'SIGTERM');
          } catch (error) {
            logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`);
            // ignore
          }
        }
      }
    }
  }

  /**
   * Enumerate direct children of a PID on Windows.
   * Returns [{ pid, name }] for each child process.
   */
  private async getWindowsChildren(pid: number): Promise<Array<{ pid: number; name: string }>> {
    return new Promise((resolve, reject) => {
      exec(`powershell -NoProfile -NonInteractive -Command "Get-CimInstance Win32_Process -Filter 'ParentProcessId = ${pid}' | Select-Object Name,ProcessId | ConvertTo-Csv -NoTypeInformation"`, { encoding: 'utf-8' }, (error, stdout) => {
        if (error) {
          reject(new Error(`Unable to enumerate children of process ${pid}`, { cause: error }));
          return;
        }
        const lines = stdout.trim().split(/\r?\n/).filter((l) => l.trim());
        const children: Array<{ pid: number; name: string }> = [];
        for (const line of lines) {
          // CSV format: "Image Name","PID","Session Name","Session#","Mem Usage"
          const match = line.match(/^"([^"]+)","(\d+)"/);
          if (match) {
            children.push({ name: match[1], pid: parseInt(match[2], 10) });
          }
        }
        resolve(children);
      });
    });
  }

  /**
   * Recursively collect all descendant PIDs of the given PID on Unix.
   * Returns an empty array on Windows.
   */
  private async getDescendantPids(pid: number): Promise<number[]> {
    if (process.platform === 'win32') {
      return [];
    }

    const directChildren = await new Promise<number[]>((resolve, reject) => {
      exec('ps -axo pid=,ppid=', { encoding: 'utf-8' }, (error, stdout) => {
        if (error) {
          reject(new Error(`Unable to enumerate children of process ${pid}`, { cause: error }));
          return;
        }
        const pids = stdout
          .trim()
          .split(/\r?\n/)
          .map(line => line.trim().split(/\s+/).map(Number))
          .filter(([, parent]) => parent === pid)
          .map(([child]) => child)
          .filter(Number.isFinite);
        resolve(pids);
      });
    });

    const allDescendants: number[] = [...directChildren];
    for (const childPid of directChildren) {
      const grandchildren = await this.getDescendantPids(childPid);
      allDescendants.push(...grandchildren);
    }

    return [...new Set(allDescendants)];
  }

  private async isAlive(pid: number): Promise<boolean> {
    try {
      process.kill(pid, 0);
      return true;
    } catch (error: any) {
      if (error.code === 'ESRCH') return false;
      if (error.code === 'EPERM') return true;
      throw error;
    }
  }

  private async waitForExit(pid: number, timeoutMs: number): Promise<void> {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const mainAlive = await this.isAlive(pid);

      if (!mainAlive) {
        if (process.platform === 'win32') {
          // On Windows the main process is the only thing holding the port;
          // browser children don't keep sockets open.
          return;
        }
        // On Unix make sure no descendants are still running
        const descendants = await this.getDescendantPids(pid);
        const anyAlive = descendants.length > 0;
        if (!anyAlive) {
          return;
        }
      }

      await new Promise((r) => setTimeout(r, 100));
    }
  }

  private async getProcessName(pid: number): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const cmd = process.platform === 'win32'
        ? `tasklist /FI "PID eq ${pid}" /FO CSV /NH`
        : `ps -p ${pid} -o comm=`;

      exec(cmd, { encoding: 'utf-8' }, (error, stdout) => {
        if (error) {
          reject(new Error(`Unable to inspect process ${pid}`, { cause: error }));
          return;
        }
        const output = stdout.trim();
        if (process.platform === 'win32') {
          const match = output.match(/^"([^"]+)"/);
          resolve(match ? match[1] : null);
        } else {
          resolve(output || null);
        }
      });
    });
  }

  getPidFilePath(): string {
    return this.pidFile;
  }
}
