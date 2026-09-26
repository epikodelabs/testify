import {
  JasmineConsoleReporter,
} from './jasmine-console-reporter';

describe('JasmineConsoleReporter global errors', () => {
  it('defers an externally captured promise rejection into the completed report', () => {
    const messages: string[] = [];
    const reporter =
      new JasmineConsoleReporter();

    reporter.setOptions({
      showColors: false,
      print: (message) => {
        messages.push(message);
      },
    });

    reporter.recordGlobalFailure({
      globalErrorType:
        'unhandledRejection',
      message:
        'authorization service unavailable',
      stack:
        'Error: authorization service unavailable',
    });

    reporter.jasmineStarted({
      totalSpecsDefined: 0,
      order: {
        random: false,
      },
    } as any);

    const result = {
      overallStatus: 'passed',
      failedExpectations: [],
      totalTime: 0,
      order: {
        random: false,
      },
    } as any;

    reporter.jasmineDone(result);

    expect(result.overallStatus)
      .toBe('failed');
    expect(result.failedExpectations)
      .toHaveSize(1);
    expect(messages.join(''))
      .toContain(
        'authorization service unavailable',
      );
  });

  it('defers an externally captured uncaught exception into the completed report', () => {
    const messages: string[] = [];
    const reporter =
      new JasmineConsoleReporter();

    reporter.setOptions({
      showColors: false,
      print: (message) => {
        messages.push(message);
      },
    });

    reporter.recordGlobalFailure({
      globalErrorType:
        'uncaughtException',
      message:
        'background callback exploded',
      stack:
        'Error: background callback exploded',
    });

    reporter.jasmineStarted({
      totalSpecsDefined: 0,
      order: {
        random: false,
      },
    } as any);

    const result = {
      overallStatus: 'passed',
      failedExpectations: [],
      totalTime: 0,
      order: {
        random: false,
      },
    } as any;

    reporter.jasmineDone(result);

    expect(result.overallStatus)
      .toBe('failed');
    expect(result.failedExpectations)
      .toHaveSize(1);
    expect(messages.join(''))
      .toContain(
        'background callback exploded',
      );
  });

});
