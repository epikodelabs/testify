// host-adapter.ts
import { ChildProcess } from 'node:child_process';
import { ConsoleReporter } from './console-reporter';
import { logger } from './console-repl';

export class HostAdapter {
  constructor(private child: ChildProcess, private reporter: ConsoleReporter) {
    this.bindListeners();
  }

  private bindListeners() {
    this.child.on('message', async (msg: any) => {
      if (!msg || typeof msg !== 'object') return;
      const { type, data } = msg;

      switch (type) {
        case 'userAgent':
          this.reporter.userAgent(data);
          break;
        case 'jasmineStarted':
          await this.reporter.jasmineStarted(data);
          this.child.send({ type: 'hostReady', timestamp: Date.now()});
          break;
        case 'suiteStarted':
          this.reporter.suiteStarted(data);
          break;
        case 'specStarted':
          this.reporter.specStarted(data);
          break;
        case 'specDone':
          this.reporter.specDone(data);
          break;
        case 'suiteDone':
          this.reporter.suiteDone(data);
          break;
        case 'jasmineDone':
          this.reporter.jasmineDone(data);
          break;
        case 'testsAborted':
          this.reporter.testsAborted(data?.message);
          break;
        case 'ready':
          logger.println('🟢 Child test process ready');
          break;
        default:
          logger.println(`⚠️  Unknown message type: ${type}`);
      }
    });
  }
}
