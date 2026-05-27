import * as fs from 'fs';
import * as path from 'path';
import { norm } from './utils';

export class ProcessLock {
  private pidFile: string;

  constructor(projectPath?: string) {
    const cwd = norm(process.cwd());
    if (projectPath) {
      const sanitized = norm(path.resolve(projectPath))
        .replace(/^\//, '')
        .replace(/\//g, '_');
      this.pidFile = path.join(cwd, `.testify-${sanitized}.pid`);
    } else {
      this.pidFile = path.join(cwd, '.testify.pid');
    }
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

      // Force kill if still alive
      try {
        process.kill(pid, 0);
        if (process.platform === 'win32') {
          process.kill(pid);
        } else {
          process.kill(pid, 'SIGKILL');
        }
      } catch {
        // Already exited or can't kill
      }

      fs.unlinkSync(this.pidFile);
    } catch {
      // Ignore any errors during cleanup
    }
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
