import {
  ConsoleReporter,
} from './console-reporter';

describe('ConsoleReporter output sink', () => {
  it('uses the injected print sink', () => {
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

    expect(
      messages.join(''),
    ).toContain(
      'Test Runner Started',
    );
  });

  it('prints a failed final status for jasmineDone global failures', () => {
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

    expect(
      messages.join(''),
    ).toContain(
      '1 TEST FAILED',
    );
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
        '1 passed · 1 failed',
      );

    expect(rendered)
      .toContain(
        'finished in 2.000s',
      );
  });
});
