// host-adapter.ts
import { ChildProcess } from 'node:child_process';
import { logger } from './console-repl';

export class HostAdapter {
  private queue: Array<() => Promise<void>> = [];
  private isProcessing = false;

  constructor(private child: ChildProcess, private reporter: jasmine.CustomReporter) {
    this.bindListeners();
  }

  private bindListeners() {
    this.child.on('message', (msg: any) => {
      if (!msg || typeof msg !== 'object') return;

      const { type, data } = msg;

      // Push all work into queue
      this.queue.push(() => this.handleMessage(type, data));

      // Start queue processor if idle
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) continue;

      try {
        await task();
      } catch (err) {
        logger.error(`❌ Error processing IPC event: ${(err as Error).message}`);
      }
    }

    this.isProcessing = false;
  }

  private async handleMessage(type: string, data: any) {
    switch (type) {
      case 'userAgent':
        await this.callReporter('userAgent', data);
        break;

      case 'ready':
        logger.println('🟢 Child test process ready');
        this.child.send({ type: 'hostReady', timestamp: Date.now() });
        break;

      case 'jasmineStarted':
        await this.callReporter('jasmineStarted', data);
        break;

      case 'suiteStarted':
        await this.callReporter('suiteStarted', data);
        break;

      case 'specStarted':
        await this.callReporter('specStarted', data);
        break;

      case 'specDone':
        await this.callReporter('specDone', data);
        break;

      case 'suiteDone':
        await this.callReporter('suiteDone', data);
        break;

      case 'jasmineDone':
        // merge coverage
        (globalThis as any).__coverage__ = data.coverage;
        await this.callReporter('jasmineDone', data.result);
        break;

      case 'testsAborted':
        await this.callReporter('testsAborted', data?.message);
        break;

      default:
        logger.println(`⚠️ Unknown message type: ${type}`);
    }
  }

  private async callReporter(method: any, ...args: any) {
    const fn = (this.reporter as any)[method];
    if (!fn) return;

    // jasmine callbacks can be sync or async → normalize to Promise
    return Promise.resolve(fn.call(this.reporter, ...args));
  }
}
