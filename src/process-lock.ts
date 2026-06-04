import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { logger } from './console-repl';
import { norm } from './utils';

export class ProcessLock {
  private pidFile: string;

  constructor(projectPath?: string, port?: number) {
    const cwd = norm(process.cwd());
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

  async acquire(): Promise<void> {
    await this.releasePrevious();
    fs.writeFileSync(this.pidFile, String(process.pid), 'utf-8');
  }

  releaseSync(): void {
    try {
      fs.unlinkSync(this.pidFile);
    } catch {
      // ignore
    }
  }

  private async releasePrevious(): Promise<void> {
    try {
      if (!fs.existsSync(this.pidFile)) return;

      const raw = fs.readFileSync(this.pidFile, 'utf-8').trim();
      const pid = parseInt(raw, 10);
      if (!Number.isFinite(pid)) {
        fs.unlinkSync(this.pidFile);
        return;
      }

      // Check if process is still alive
      try {
        process.kill(pid, 0);
      } catch {
        // Stale PID file
        logger.println(`🧹 Stale lock file found (PID ${pid} is gone). Removing.`);
        fs.unlinkSync(this.pidFile);
        return;
      }

      // Verify the process is actually a Node process before killing it
      const processName = await this.getProcessName(pid);
      if (!processName || !/node/i.test(processName)) {
        logger.println(`⚠️  PID ${pid} does not appear to be a Node process (${processName || 'unknown'}). Skipping kill.`);
        fs.unlinkSync(this.pidFile);
        return;
      }

      // Try graceful termination
      try {
        if (process.platform === 'win32') {
          process.kill(pid);
        } else {
          process.kill(pid, 'SIGTERM');
        }
        await this.waitForExit(pid, 2000);
      } catch {
        // ignore
      }

      // Check if process exited after graceful termination
      let isAlive = false;
      try {
        process.kill(pid, 0);
        isAlive = true;
      } catch {
        isAlive = false;
      }

      // Force kill if still alive
      if (isAlive) {
        try {
          if (process.platform === 'win32') {
            process.kill(pid);
          } else {
            process.kill(pid, 'SIGKILL');
          }
          await this.waitForExit(pid, 2000);
        } catch {
          // ignore
        }
      }

      // Verify final state and log
      try {
        process.kill(pid, 0);
        logger.println(`⚠️  Could not terminate previous testify instance (PID ${pid}).`);
      } catch {
        logger.println(`🔒 Terminated previous testify instance (PID ${pid}).`);
      }
      fs.unlinkSync(this.pidFile);
    } catch {
      // Ignore any errors during cleanup
    }
  }

  private async getProcessName(pid: number): Promise<string | null> {
    return new Promise((resolve) => {
      const cmd = process.platform === 'win32'
        ? `tasklist /FI "PID eq ${pid}" /FO CSV /NH`
        : `ps -p ${pid} -o comm=`;

      exec(cmd, { encoding: 'utf-8' }, (error, stdout) => {
        if (error) {
          resolve(null);
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

  private waitForExit(pid: number, timeoutMs: number): Promise<void> {
    return new Promise((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        try {
          process.kill(pid, 0);
        } catch {
          clearInterval(interval);
          resolve();
          return;
        }
        if (Date.now() - start > timeoutMs) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }
}
