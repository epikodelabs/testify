// test-runner.ts
import { spawn, ChildProcess } from 'node:child_process';
import path from 'node:path';
import { ConsoleReporter } from './console-reporter';
import { HostAdapter } from './host-adapter';
import { logger } from './console-repl';
import { CompoundReporter } from './compound-reporter';
import { CoverageReporter } from './coverage-reporter';

export interface TestRunnerOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  reporter?: jasmine.CustomReporter;
  file?: string; // child entry file
  coverage?: boolean;
}

export class NodeTestRunner {
  private child?: ChildProcess;
  private reporter: jasmine.CustomReporter;
  private adapter?: HostAdapter;
  private options: TestRunnerOptions;

  constructor(options: TestRunnerOptions = {}) {
    this.options = options;
    this.reporter = options.reporter ?? new ConsoleReporter();
  }

  async start(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (this.child) {
        (this.reporter as any).testsAborted('Test process already running');
        reject('Test process already running');
      }

      const childFile = path.resolve(this.options.cwd || process.cwd(), this.options.file || 'test-runner.js');
      logger.println(`🚀 Starting child process...`);

      this.child = spawn('node', [childFile], {
        cwd: this.options.cwd ?? process.cwd(),
        env: { ...process.env, ...(this.options.env || {}), NODE_ENV: 'test' },
        stdio: ['inherit', 'pipe', 'pipe', 'ipc'], // include IPC
      });

      if (this.child) {
        this.child.stdout!.on("data", d => logger.print(d.toString()));
        this.child.stderr!.on("data", d => logger.error(d.toString()));

        // connect HostAdapter
        this.adapter = new HostAdapter(this.child, this.reporter);

        this.child.on('exit', (code) => {
          this.child = undefined;
          resolve(code || 0);
        });

        this.child.on('error', (err) => {
          (this.reporter as any).jasmineFailed(`Child process error: ${err.message}`);
          reject(err.message);
        });
      }
    }); 
  }

  send(message: any): void {
    if (!this.child || !this.child.connected) {
      (this.reporter as any).testsAborted('Cannot send message — no child process');
      return;
    }
    this.child.send(message);
  }

  async stop(): Promise<void> {
    if (!this.child) return;
    try {
      this.child.send({ type: 'shutdown' });
    } catch (_) {
      this.child.kill('SIGTERM');
    }
    this.child = undefined;
  }

  restart(): void {
    this.stop();
    setTimeout(() => this.start(), 300);
  }
}
