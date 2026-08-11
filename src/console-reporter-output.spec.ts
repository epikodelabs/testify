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
});
