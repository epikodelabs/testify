import { renderTerminalPanel, renderTerminalText } from './ink-output';
import { isAnsiMode, supportsColor } from './ansi-constants';

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
/**
 * A reporter that prints spec and suite results to the console.
 * A ConsoleReporter is installed by default.
 */
export class JasmineConsoleReporter implements jasmine.CustomReporter {
  private output: (message: string) => void = (message) => process.stdout.write(message);
  private buffer = '';
  private showColors = true;
  private specCount = 0;
  private executableSpecCount = 0;
  private failureCount = 0;
  private failedSpecs: jasmine.SpecResult[] = [];
  private pendingSpecs: jasmine.SpecResult[] = [];
  private externalGlobalFailures: Array<{
    message: string;
    stack?: string;
    globalErrorType?: string;
  }> = [];
  private alwaysListPendingSpecs = true;

  private get separator(): string {
    return isAnsiMode() || !process.stdout.isTTY ? '*' : '•';
  }
  private failedSuites: jasmine.SuiteResult[] = [];
  private stackFilter: (stack: string) => string = (stack) => stack;
  private slowSpecs: Array<{ fullName: string; duration: number }> = [];

  randomSeedReproductionCmd(seed: number | string) {
    return 'jasmine --random=true --seed=' + seed;
  }

  recordGlobalFailure(failure: {
    message: string;
    stack?: string;
    globalErrorType?: string;
  }): void {
    const signature = [
      failure.globalErrorType ?? '',
      failure.message,
      failure.stack ?? '',
    ].join('\n@@\n');

    const duplicate =
      this.externalGlobalFailures.some(
        (candidate) =>
          [
            candidate.globalErrorType ?? '',
            candidate.message,
            candidate.stack ?? '',
          ].join('\n@@\n') === signature,
      );

    if (!duplicate) {
      this.externalGlobalFailures.push(
        failure,
      );
    }
  }

  private mergeExternalGlobalFailures(
    result: jasmine.JasmineDoneInfo,
  ): void {
    if (this.externalGlobalFailures.length === 0) {
      return;
    }

    const current =
      Array.isArray(result.failedExpectations)
        ? [...result.failedExpectations]
        : [];
    const normalizeMessage = (value: unknown) =>
      String(value ?? '')
        .replace(
          /^Unhandled promise rejection:\s*/i,
          '',
        )
        .replace(
          /^Uncaught exception:\s*/i,
          '',
        )
        .replace(
          /^Error:\s*/i,
          '',
        )
        .trim();

    for (const failure of this.externalGlobalFailures) {
      const message =
        normalizeMessage(
          failure.message,
        );
      const duplicate =
        current.some((candidate: any) => {
          const candidateMessage =
            normalizeMessage(
              candidate?.message ??
                String(candidate),
            );

          return (
            candidateMessage === message ||
            (message.length > 0 &&
              candidateMessage.includes(message)) ||
            (candidateMessage.length > 0 &&
              message.includes(candidateMessage))
          );
        });

      if (!duplicate) {
        current.push(
          failure as any,
        );
      }
    }

    this.externalGlobalFailures = [];
    (result as any).failedExpectations = current;
    if (current.length > 0 && result.overallStatus !== 'failed') {
      (result as any).overallStatus = 'failed';
    }
  }

  /**
   * Configures the reporter.
   */
  setOptions(options: ConsoleReporterOptions) {
    if (options.print) {
      this.output = options.print;
    }

    this.showColors = options.showColors ?? this.showColors;
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

  jasmineStarted(options: jasmine.JasmineStartedInfo) {
    this.specCount = 0;
    this.executableSpecCount = 0;
    this.failureCount = 0;
    this.failedSpecs = [];
    this.pendingSpecs = [];
    this.failedSuites = [];
    this.slowSpecs = [];
    if (options?.order?.random) {
      this.print('Randomized with seed ' + options.order.seed);
      this.printNewline();
    }
    this.print('Started');
    this.printNewline();
  }

  jasmineDone(result: jasmine.JasmineDoneInfo) {
    this.mergeExternalGlobalFailures(
      result,
    );

    if (result.failedExpectations) {
      this.failureCount += result.failedExpectations.length;
    }

    this.flush(true);
    this.printNewline();
    this.printNewline();
    if (this.failedSpecs.length > 0 && !this.useRichUi()) {
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
        this.print('Skipped:');
      }
      for (let i = 0; i < this.pendingSpecs.length; i++) {
        this.pendingSpecDetails(this.pendingSpecs[i], i + 1);
      }
    }

    if (this.useRichUi()) {
      this.printRichSummary(result);
      this.flush(true);
      return;
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
          ' skipped ' +
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

  specDone(result: jasmine.SpecResult) {
    this.specCount++;

    if (typeof result.duration === 'number' && result.duration >= 500) {
      this.slowSpecs.push({ fullName: result.fullName, duration: result.duration });
    }

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

  suiteDone(result: jasmine.SuiteResult) {
    if (result.failedExpectations && result.failedExpectations.length > 0) {
      this.failureCount++;
      this.failedSuites.push(result);
    }
  }

  reporterCapabilities = { parallel: true };

  private printNewline() {
    this.print('\n');
  }

  /** Batch dot fragments while still flushing complete lines immediately. */
  private print(message: string): void {
    this.buffer += message;
    this.flush();
  }

  private flush(force = false): void {
    if (!this.buffer) return;

    const completeLength = this.buffer.lastIndexOf('\n') + 1;
    if (completeLength > 0) {
      this.output(this.buffer.slice(0, completeLength));
      this.buffer = this.buffer.slice(completeLength);
    }

    const visibleBuffer = this.buffer.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '');
    if (force || visibleBuffer.length >= (process.stdout.columns ?? 80)) {
      this.output(this.buffer);
      this.buffer = '';
    }
  }

  private useRichUi(): boolean {
    return this.showColors && supportsColor();
  }

  private colored(color: 'green' | 'red' | 'yellow', str: string) {
    return this.showColors ? renderTerminalText(str, { color }) : str;
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
    if (this.useRichUi()) {
      this.flush(true);
      const expectation = result.failedExpectations?.[0];
      const message = expectation?.message?.split('\n')[0] || 'Spec failed without an expectation message.';
      const stack = expectation?.stack
        ? this.stackFilter(expectation.stack).split('\n').slice(0, 5)
        : [];
      this.print(renderTerminalPanel(
        `✕ ${result.fullName}`,
        [this.colored('red', message), ...stack.map(line => renderTerminalText(line, { dimColor: true }))],
        'red',
      ) + '\n');
      this.flush(true);
      return;
    }

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
    if (this.useRichUi()) {
      this.flush(true);
      const expectation = result.failedExpectations[0];
      const message = expectation?.message?.split('\n')[0] || 'Suite failed without an expectation message.';
      const stack = expectation?.stack
        ? this.stackFilter(expectation.stack).split('\n').slice(0, 5)
        : [];
      this.print(renderTerminalPanel(
        `✕ Suite error: ${result.fullName}`,
        [this.colored('red', message), ...stack.map(line => renderTerminalText(line, { dimColor: true }))],
        'red',
      ) + '\n');
      this.flush(true);
      return;
    }

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
    if (this.useRichUi()) {
      this.flush(true);
      const reason = result.pendingReason || 'No reason given';
      this.print(renderTerminalPanel(
        `◌ Skipped ${this.separator} ${pendingSpecNumber}`,
        [result.fullName, renderTerminalText(reason, { dimColor: true })],
        'yellow',
      ) + '\n');
      this.flush(true);
      return;
    }

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

  private printRichSummary(result: jasmine.JasmineDoneInfo): void {
    const passed = this.executableSpecCount - this.failureCount - this.pendingSpecs.length;
    const seconds = result.totalTime / 1000;
    const lines = [
      `${this.colored('green', `✓ ${Math.max(0, passed)} passed`)}  ${this.colored('red', `✕ ${this.failureCount} failed`)}  ${this.colored('yellow', `◌ ${this.pendingSpecs.length} skipped`)}`,
    ];

    const slowest = [...this.slowSpecs].sort((a, b) => b.duration - a.duration).slice(0, 3);
    for (const spec of slowest) {
      lines.push(renderTerminalText(`Slow: ${spec.fullName} (${spec.duration}ms)`, { dimColor: true }));
    }
    if (result.order?.random) {
      lines.push(renderTerminalText(`Re-run: ${this.randomSeedReproductionCmd(result.order.seed)}`, { dimColor: true }));
    }
    if (result.overallStatus === 'incomplete') lines.push(this.colored('yellow', `Incomplete: ${result.incompleteReason}`));

    this.print(renderTerminalPanel(`TEST RUN ${this.separator} ${seconds.toFixed(3)}s`, lines, this.failureCount > 0 ? 'red' : 'green') + '\n');
  }
}

export class AwaitableJasmineConsoleReporter extends JasmineConsoleReporter {
  private resolveComplete?: (result: jasmine.JasmineDoneInfo) => void;
  readonly complete: Promise<jasmine.JasmineDoneInfo>;

  constructor() {
    super();
    this.complete = new Promise<jasmine.JasmineDoneInfo>((resolve) => {
      this.resolveComplete = resolve;
    });
  }

  jasmineDone(result: jasmine.JasmineDoneInfo) {
    super.jasmineDone(result);
    this.resolveComplete?.(result);
  }
}