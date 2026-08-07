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
});
