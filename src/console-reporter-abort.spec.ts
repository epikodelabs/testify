import util from 'util';
import {
  ConsoleReporter,
} from './console-reporter';
import {
  EXIT_CODES,
} from './exit-codes';

describe('ConsoleReporter abort', () => {
  it('returns the SIGINT exit code without writing to process stdout', () => {
    const output: string[] = [];

    const reporter =
      new ConsoleReporter({
        showColors: false,
        print: (...args) => {
          output.push(
            util.format(
              ...args,
            ),
          );
        },
      });

    expect(
      reporter.testsAborted(),
    ).toBe(
      EXIT_CODES.SIGINT,
    );

    const rendered =
      output.join('');

    expect(rendered)
      .toContain(
        'TESTS INTERRUPTED',
      );

    expect(rendered)
      .toContain(
        'time: 0.000s',
      );
  });

  it('returns the SIGTERM exit code when requested', () => {
    const reporter =
      new ConsoleReporter({
        showColors: false,
        print: () => {},
      });

    expect(
      reporter.testsAborted(
        'SIGTERM',
      ),
    ).toBe(
      EXIT_CODES.SIGTERM,
    );
  });
});
