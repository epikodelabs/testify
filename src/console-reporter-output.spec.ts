import {
  ConsoleReporter,
} from './console-reporter';
import { setAnsiMode } from './ansi-constants';

describe('ConsoleReporter output sink', () => {
  it('uses the injected print sink for the completed run report', () => {
    const messages: string[] = [];

    const reporter =
      new ConsoleReporter({
        showColors: false,
        print: (...args) => {
          messages.push(
            args.join(''),
          );
        },
      });

    reporter.jasmineStarted({
      totalTime: 0,
    });

    reporter.jasmineDone({
      overallStatus: 'passed',
      totalTime: 0,
    });

    expect(
      messages.join(''),
    ).toContain(
        'TEST RESULTS',
    );
  });

  it('includes global failures in the completed run report', () => {
    const messages: string[] = [];

    const reporter =
      new ConsoleReporter({
        showColors: false,
        print: (...args) => {
          messages.push(
            args.join(''),
          );
        },
      });

    reporter.jasmineStarted({
      totalTime: 0,
    });

    reporter.jasmineDone({
      overallStatus: 'passed',
      failedExpectations: [{
        message:
          'Unhandled promise rejection: Error: authorization service unavailable',
        globalErrorType:
          'unhandledRejection',
      }],
      totalTime: 0,
    });

    expect(messages.join('')).toContain('GLOBAL ERRORS');
  });

  it('reports run facts, pass rate, slowest spec and a final recap', () => {
    const messages: string[] = [];

    const reporter =
      new ConsoleReporter({
        showColors: false,
        print: (...args) => {
          messages.push(
            args.join(''),
          );
        },
      });

    reporter.jasmineStarted({
      totalTime: 0,
    });

    reporter.specStarted({
      id: 'spec1',
      description: 'passes',
      fullName: 'suite passes',
    });

    reporter.specDone({
      id: 'spec1',
      status: 'passed',
      fullName: 'suite passes',
      duration: 120,
    });

    reporter.specStarted({
      id: 'spec2',
      description: 'fails',
      fullName: 'suite fails',
    });

    reporter.specDone({
      id: 'spec2',
      status: 'failed',
      fullName: 'suite fails',
      duration: 30,
      failedExpectations: [{
        message: 'Expected 1 to be 2.',
      }],
    });

    reporter.jasmineDone({
      overallStatus: 'failed',
      totalTime: 2000,
    });

    const rendered =
      messages.join('');

    expect(rendered)
      .toContain(
        'started at',
      );

    expect(rendered)
      .toContain(
        'pass rate: 50%',
      );

    expect(rendered)
      .toContain(
        '1.0 specs/s',
      );

    expect(rendered)
      .toContain(
        'slowest: suite passes (120ms)',
      );

    expect(rendered)
      .toContain(
        '1 passed • 1 failed',
      );

    expect(rendered)
      .toContain(
        'finished in 2.000s',
      );
  });

  it('uses an ASCII asterisk as the separator in ANSI mode', () => {
    const messages: string[] = [];
    const originalNoEmoji = process.env.NO_EMOJI;
    const originalNoColor = process.env.NO_COLOR;
    setAnsiMode();

    try {
      const reporter = new ConsoleReporter({
        showColors: false,
        print: (...args) => messages.push(args.join('')),
      });

      reporter.jasmineStarted({ totalTime: 0 });
      reporter.specStarted({
        id: 'passing-spec',
        description: 'passing spec',
        fullName: 'passing spec',
      });
      reporter.specDone({
        id: 'passing-spec',
        status: 'passed',
        fullName: 'passing spec',
        duration: 10,
      });
      reporter.specStarted({
        id: 'failing-spec',
        description: 'failing spec',
        fullName: 'failing spec',
      });
      reporter.specDone({
        id: 'failing-spec',
        status: 'failed',
        fullName: 'failing spec',
        duration: 10,
        failedExpectations: [{ message: 'Expected true to be false.' }],
      });
      reporter.jasmineDone({ overallStatus: 'failed', totalTime: 20 });

      expect(messages.join('')).toContain('1 passed * 1 failed');
    } finally {
      setAnsiMode(false);
      if (originalNoEmoji === undefined) delete process.env.NO_EMOJI;
      else process.env.NO_EMOJI = originalNoEmoji;
      if (originalNoColor === undefined) delete process.env.NO_COLOR;
      else process.env.NO_COLOR = originalNoColor;
    }
  });

  it('labels Jasmine pending specs as skipped in report output', () => {
    const messages: string[] = [];
    const reporter = new ConsoleReporter({
      showColors: false,
      print: (...args) => messages.push(args.join('')),
    });

    reporter.jasmineStarted({ totalTime: 0 });
    reporter.specStarted({
      id: 'skipped-spec',
      description: 'skipped spec',
      fullName: 'skipped spec',
    });
    reporter.specDone({
      id: 'skipped-spec',
      status: 'pending',
      fullName: 'skipped spec',
      pendingReason: 'Not applicable to this environment.',
    });
    reporter.jasmineDone({ overallStatus: 'passed', totalTime: 1 });

    const rendered = messages.join('');
    expect(rendered).toContain('1 skipped');
    expect(rendered.toLowerCase()).not.toContain('pending');
  });
});
