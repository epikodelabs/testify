import {
  ConsoleReporter,
} from './console-reporter';
import { ANSI_FULL_REGEX } from './utils';
import { renderTerminalPanel } from './ink-output';
import { SYMBOLS } from './symbols';
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
      .toMatch(
        /1 passed\s+[•*]\s+1 failed/,
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

  it('names and classifies a Jasmine-disabled spec in the final summary', () => {
    const messages: string[] = [];
    const reporter = new ConsoleReporter({
      showColors: false,
      print: (...args) => messages.push(args.join('')),
    });

    reporter.jasmineStarted({ totalTime: 0 });
    reporter.specStarted({
      id: 'disabled-spec',
      description: 'is disabled',
      fullName: 'focused suite is disabled',
    });
    reporter.specDone({
      id: 'disabled-spec',
      status: 'disabled',
      fullName: 'focused suite is disabled',
    });
    reporter.jasmineDone({ overallStatus: 'incomplete', totalTime: 1 });

    const rendered = messages.join('');
    expect(rendered).toContain('1 disabled');
    expect(rendered).toContain('[disabled] focused suite is disabled');
  });

  it('keeps execution dots on the live result row at the panel body width', () => {
    const originalColumns = process.stdout.columns;
    const originalForceColor = process.env.FORCE_COLOR;
    const originalNoColor = process.env.NO_COLOR;
    // Pin the terminal width so the row budget is deterministic, and force
    // color so renderTerminalPanel takes Ink's wrapping path under test.
    Object.defineProperty(process.stdout, 'columns', { value: 80, configurable: true });
    process.env.FORCE_COLOR = '1';
    delete process.env.NO_COLOR;

    try {
      const reporter = new ConsoleReporter({ showColors: true, print: () => {} });
      const catalog = {
        suites: [{ id: 'suite-nested', description: 'nested suite', fullName: 'nested suite' }],
        specs: [
          { id: 'nested-one', description: 'one', fullName: 'nested suite one', suiteId: 'suite-nested' },
          { id: 'nested-two', description: 'two', fullName: 'nested suite two', suiteId: 'suite-nested' },
        ],
      };

      reporter.setCatalog(catalog);
      reporter.jasmineStarted({
        totalSpecsDefined: catalog.specs.length,
        order: { random: false },
      });
      reporter.suiteStarted(catalog.suites[0]);
      for (const spec of catalog.specs) {
        reporter.specStarted(spec);
        reporter.specDone({ ...spec, status: 'passed', duration: 1 });
      }

      const internal = reporter as any;
      const line = internal.getResultSuiteLine(internal.suiteById.get('suite-nested'));
      const row = internal.renderResultTableRow(line).replace(ANSI_FULL_REGEX, '');

      // The glyph column is right-aligned: a row wider than the panel body
      // wraps, and the live table only reads frame[3] back, so wrapped
      // execution dots disappeared from the TEST RESULTS table entirely.
      expect(row).toContain('2 specs');
      expect(row).toContain(`${SYMBOLS.passed}${SYMBOLS.passed}`);
      expect(renderTerminalPanel(' ', [' ', line], 'green', true).split('\n').length).toBe(5);
    } finally {
      Object.defineProperty(process.stdout, 'columns', { value: originalColumns, configurable: true });
      if (originalForceColor === undefined) delete process.env.FORCE_COLOR;
      else process.env.FORCE_COLOR = originalForceColor;
      if (originalNoColor === undefined) delete process.env.NO_COLOR;
      else process.env.NO_COLOR = originalNoColor;
    }
  });

});
// Process-level failures are captured outside Jasmine and merged only when the
// run completes, so they cannot overwrite the live TEST RESULTS surface.
describe('ConsoleReporter deferred process failures', () => {
  it('renders an externally captured uncaught exception after the test run', () => {
    const messages: string[] = [];
    const reporter = new ConsoleReporter({
      showColors: false,
      print: (...args) => {
        messages.push(args.join(''));
      },
    });

    reporter.jasmineStarted({
      totalTime: 0,
    });

    reporter.recordGlobalFailure({
      globalErrorType: 'uncaughtException',
      message: 'background callback exploded',
      stack: 'Error: background callback exploded\n    at fixture.ts:10:3',
    });

    const result: any = {
      overallStatus: 'passed',
      failedExpectations: [],
      totalTime: 0,
    };

    reporter.jasmineDone(result);

    const rendered = messages.join('');
    expect(result.overallStatus).toBe('failed');
    expect(result.failedExpectations).toHaveSize(1);
    expect(rendered).toContain('GLOBAL ERRORS');
    expect(rendered).toContain('uncaughtException');
    expect(rendered).toContain('background callback exploded');
  });
});
