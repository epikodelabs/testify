export interface ConsoleReporterOptions {
  print?: (message: string) => void;
  showColors?: boolean;
  stackFilter?: (stack: string) => string;
  randomSeedReproductionCmd?: (seed: number | string) => string;
  alwaysListPendingSpecs?: boolean;
}

type FailureResult = {
  failedExpectations: Array<{ message: string; stack: string }>;
  passedExpectations?: Array<unknown>;
};

/**
 * A reporter that prints spec and suite results to the console.
 * A ConsoleReporter is installed by default.
 */
export class JasmineConsoleReporter implements jasmine.CustomReporter {
  private print: (message: string) => void = () => {};
  private showColors = false;
  private specCount = 0;
  private executableSpecCount = 0;
  private failureCount = 0;
  private failedSpecs: jasmine.SpecResult[] = [];
  private pendingSpecs: jasmine.SpecResult[] = [];
  private alwaysListPendingSpecs = true;
  private readonly ansi = {
    green: '\x1B[32m',
    red: '\x1B[31m',
    yellow: '\x1B[33m',
    none: '\x1B[0m',
  };
  private failedSuites: jasmine.SuiteResult[] = [];
  private stackFilter: (stack: string) => string = (stack) => stack;

  randomSeedReproductionCmd(seed: number | string) {
    return 'jasmine --random=true --seed=' + seed;
  }

  /**
   * Configures the reporter.
   */
  setOptions(options: ConsoleReporterOptions) {
    if (options.print) {
      this.print = options.print;
    }

    this.showColors = options.showColors || false;
    if (options.stackFilter) {
      this.stackFilter = options.stackFilter;
    }
    if (options.randomSeedReproductionCmd) {
      this.randomSeedReproductionCmd = options.randomSeedReproductionCmd;
    }

    if (options.alwaysListPendingSpecs !== undefined) {
      this.alwaysListPendingSpecs = options.alwaysListPendingSpecs;
    }
  }

  jasmineStarted(options: jasmine.JasmineStartedInfo, _done?: () => void) {
    this.specCount = 0;
    this.executableSpecCount = 0;
    this.failureCount = 0;
    if (options?.order?.random) {
      this.print('Randomized with seed ' + options.order.seed);
      this.printNewline();
    }
    this.print('Started');
    this.printNewline();
  }

  jasmineDone(result: jasmine.JasmineDoneInfo, _done?: () => void) {
    if (result.failedExpectations) {
      this.failureCount += result.failedExpectations.length;
    }

    this.printNewline();
    this.printNewline();
    if (this.failedSpecs.length > 0) {
      this.print('Failures:');
    }
    for (let i = 0; i < this.failedSpecs.length; i++) {
      this.specFailureDetails(this.failedSpecs[i], i + 1);
    }

    for (let i = 0; i < this.failedSuites.length; i++) {
      this.suiteFailureDetails(this.failedSuites[i]);
    }

    if (result.failedExpectations?.length > 0) {
      this.suiteFailureDetails({
        fullName: 'top suite',
        failedExpectations: result.failedExpectations,
      });
    }

    if (this.alwaysListPendingSpecs || result.overallStatus === 'passed') {
      if (this.pendingSpecs.length > 0) {
        this.print('Pending:');
      }
      for (let i = 0; i < this.pendingSpecs.length; i++) {
        this.pendingSpecDetails(this.pendingSpecs[i], i + 1);
      }
    }

    if (this.specCount > 0) {
      this.printNewline();

      if (this.executableSpecCount !== this.specCount) {
        this.print(
          'Ran ' +
            this.executableSpecCount +
            ' of ' +
            this.specCount +
            this.plural(' spec', this.specCount),
        );
        this.printNewline();
      }
      let specCounts =
        this.executableSpecCount +
        ' ' +
        this.plural('spec', this.executableSpecCount) +
        ', ' +
        this.failureCount +
        ' ' +
        this.plural('failure', this.failureCount);

      if (this.pendingSpecs.length) {
        specCounts +=
          ', ' +
          this.pendingSpecs.length +
          ' pending ' +
          this.plural('spec', this.pendingSpecs.length);
      }

      this.print(specCounts);
    } else {
      this.print('No specs found');
    }

    this.printNewline();

    const seconds = result ? result.totalTime / 1000 : 0;
    this.print('Finished in ' + seconds + ' ' + this.plural('second', seconds));
    this.printNewline();

    if (result && result.overallStatus === 'incomplete') {
      this.print('Incomplete: ' + result.incompleteReason);
      this.printNewline();
    }

    if (result.order?.random) {
      this.print('Randomized with seed ' + result.order.seed);
      this.print(' (' + this.randomSeedReproductionCmd(result.order.seed) + ')');
      this.printNewline();
    }
  }

  specDone(result: jasmine.SpecResult, _done?: () => void) {
    this.specCount++;

    if (result.status == 'pending') {
      this.pendingSpecs.push(result);
      this.executableSpecCount++;
      this.print(this.colored('yellow', '*'));
      return;
    }

    if (result.status == 'passed') {
      this.executableSpecCount++;
      this.print(this.colored('green', '.'));
      return;
    }

    if (result.status == 'failed') {
      this.failureCount++;
      this.failedSpecs.push(result);
      this.executableSpecCount++;
      this.print(this.colored('red', 'F'));
    }
  }

  suiteDone(result: jasmine.SuiteResult, _done?: () => void) {
    if (result.failedExpectations && result.failedExpectations.length > 0) {
      this.failureCount++;
      this.failedSuites.push(result);
    }
  }

  reporterCapabilities = { parallel: true };

  private printNewline() {
    this.print('\n');
  }

  private colored(color: keyof JasmineConsoleReporter['ansi'], str: string) {
    return this.showColors ? this.ansi[color] + str + this.ansi.none : str;
  }

  private plural(str: string, count: number) {
    return count == 1 ? str : str + 's';
  }

  private repeat(thing: string, times: number) {
    return Array.from({ length: times }, () => thing);
  }

  private indent(str: string, spaces: number) {
    const lines = (str || '').split('\n');
    return lines.map((line) => this.repeat(' ', spaces).join('') + line).join('\n');
  }

  private specFailureDetails(result: jasmine.SpecResult, failedSpecNumber: number) {
    this.printNewline();
    this.print(failedSpecNumber + ') ');
    this.print(result.fullName);
    this.printFailedExpectations(result);

    if (result.debugLogs?.length) {
      this.printNewline();
      this.print(this.indent('Debug logs:', 2));
      this.printNewline();

      for (const entry of result.debugLogs) {
        this.print(this.indent(`${entry.timestamp}ms: ${entry.message}`, 4));
        this.printNewline();
      }
    }
  }

  private suiteFailureDetails(result: jasmine.SuiteResult | (FailureResult & { fullName: string })) {
    this.printNewline();
    this.print('Suite error: ' + result.fullName);
    this.printFailedExpectations(result);
  }

  private printFailedExpectations(result: FailureResult) {
    for (let i = 0; i < result.failedExpectations.length; i++) {
      const failedExpectation = result.failedExpectations[i];
      this.printNewline();
      this.print(this.indent('Message:', 2));
      this.printNewline();
      this.print(this.colored('red', this.indent(failedExpectation.message, 4)));
      this.printNewline();
      this.print(this.indent('Stack:', 2));
      this.printNewline();
      this.print(this.indent(this.stackFilter(failedExpectation.stack), 4));
    }

    // When failSpecWithNoExpectations = true and a spec fails because of no expectations found,
    // jasmine-core reports it as a failure with no message.
    //
    // Therefore we assume that when there are no failed or passed expectations,
    // the failure was because of our failSpecWithNoExpectations setting.
    //
    // Same logic is used by jasmine.HtmlReporter, see https://github.com/jasmine/jasmine/blob/main/src/html/HtmlReporter.js
    if (
      result.failedExpectations.length === 0 &&
      Array.isArray(result.passedExpectations) &&
      result.passedExpectations.length === 0
    ) {
      this.printNewline();
      this.print(this.indent('Message:', 2));
      this.printNewline();
      this.print(this.colored('red', this.indent('Spec has no expectations', 4)));
    }

    this.printNewline();
  }

  private pendingSpecDetails(result: jasmine.SpecResult, pendingSpecNumber: number) {
    this.printNewline();
    this.printNewline();
    this.print(pendingSpecNumber + ') ');
    this.print(result.fullName);
    this.printNewline();
    let pendingReason = 'No reason given';
    if (result.pendingReason && result.pendingReason !== '') {
      pendingReason = result.pendingReason;
    }
    this.print(this.indent(this.colored('yellow', pendingReason), 2));
    this.printNewline();
  }
}

export default JasmineConsoleReporter;
