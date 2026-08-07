import {
  ConsoleReporter,
} from './console-reporter';
import {
  EXIT_CODES,
} from './exit-codes';

describe('ConsoleReporter abort', () => {
  it('returns the SIGINT exit code', () => {
    const reporter =
      new ConsoleReporter({
        showColors: false,
      });

    expect(
      reporter.testsAborted(),
    ).toBe(
      EXIT_CODES.SIGINT,
    );
  });
});
