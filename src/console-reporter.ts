import util from 'util';
import { logger } from './logger';
import { wrapLine, visibleWidth, ANSI_FULL_REGEX, normalize, normalizeStackTrace } from './utils';
import { EXIT_CODES } from './exit-codes';
import { getMaxWidth, isAnsiMode } from './ansi-constants';
import { ReporterMessages } from './log-messages';
import { SYMBOLS, replacePlaceholders } from './symbols';
import {
  renderTerminalPanel,
  renderTerminalStage,
  renderTerminalText,
  PANEL_RULE,
} from './ink-output';

export interface EnvironmentInfo {
  node: string;
  platform: string;
  arch: string;
  cwd: string;
  memory: string;
  pid: number;
  uptime: string;
  userAgent?: UserAgent;
}

export interface UserAgent {
  userAgent: string;
  appName: string;
  appVersion: string;
  platform: string;
  vendor: string;
  language: string;
  languages: string[];
}

export interface TestSpec {
  id: string;
  description: string;
  fullName: string;
  status: 'passed' | 'failed' | 'pending' | 'incomplete' | 'skipped' | 'running';
  duration?: number;
  failedExpectations?: any[];
  pendingReason?: string;
  /** Source file, when the catalog supplied one (TestCatalogSpec.file). Used to group failures. */
  file?: string;
}

export interface TestSuite {
  id: string;
  description: string;
  fullName: string;
  specs: TestSpec[];
  children: TestSuite[];
  parent?: TestSuite;
  status?: TestStatus;
}

export type TestStatus = 'passed' | 'failed' | 'pending' | 'skipped' | 'running' | 'incomplete';

export interface ConsoleReporterOptions {
  showColors?: boolean;
  print?: (...args: any[]) => void;
}

export class ConsoleReporter {
  private print: (...args: any[]) => void;
  private showColors: boolean;
  private specCount: number;
  private executableSpecCount: number;
  private failureCount: number;
  private failedSpecs: any[];
  private globalFailures: any[];
  private pendingSpecs: any[];
  private startTime: number;
  private config: any | null = null;
  private envInfo: EnvironmentInfo | null;
  private rootSuite: TestSuite;
  private currentSuite: TestSuite | null;
  private suiteStack: TestSuite[];
  private currentSpec: TestSpec | null;
  private suiteById: Map<string, TestSuite> = new Map();
  private specById: Map<string, TestSpec> = new Map();
  /** Suite ids that have actually received suiteDone(), for an accurate live progress count. */
  private completedSuiteIds: Set<string> = new Set();
  private get lineWidth(): number { return getMaxWidth(); }
  private interruptHandlersRegistered: boolean = false;
  private interrupted = false;
  private orderedSuites: any[] | null = null;
  private orderedSpecs: any[] | null = null;
  private isTTY: boolean;
  private resultPanelLines: string[] | null = null;
  /** Counts captured by printSummary for the final status box recap. */
  private summaryStats: { passed: number; failed: number; pending: number; totalTime: number } | null = null;

  constructor(options: ConsoleReporterOptions = {}) {
    this.print =
      options.print ??
      ((...args) =>
        process.stdout.write(
          util.format(...args),
        ));
    this.showColors = options.showColors ?? this.detectColorSupport();
    this.isTTY = !isAnsiMode() && (process.stdout.isTTY ?? false);
    this.config = null;
    this.specCount = 0;
    this.executableSpecCount = 0;
    this.failureCount = 0;
    this.failedSpecs = [];
    this.globalFailures = [];
    this.pendingSpecs = [];
    this.startTime = 0;

    this.envInfo = null;
    this.rootSuite = this.createRootSuite();
    this.currentSuite = null;
    this.suiteStack = [this.rootSuite];
    this.currentSpec = null;
  }

  getFailureCount(): number {
    return this.failureCount;
  }

  // Detect if terminal supports colors
  private detectColorSupport(): boolean {
    if (isAnsiMode()) return false;
    if (process.env.NO_COLOR) return false;
    if (process.env.FORCE_COLOR === '1' || process.env.FORCE_COLOR === 'true' || process.env.FORCE_COLOR) return true;
    return process.stdout.isTTY ?? false;
  }

  private createRootSuite(): TestSuite {
    return {
      id: 'suite0',
      description: 'Jasmine__TopLevel__Suite',
      fullName: '',
      specs: [],
      children: [],
      status: 'skipped'
    };
  }

  private buildSuiteTree(config: any) {
    // Create root suite
    this.rootSuite = this.createRootSuite();
    this.suiteById.clear();
    this.specById.clear();
    this.suiteStack = [this.rootSuite];
    this.currentSuite = null;
    this.currentSpec = null;

    this.suiteById.set(this.rootSuite.id, this.rootSuite);

    const orderedSuites = this.orderedSuites;
    // 1️⃣ Register suites
    if (orderedSuites) {
      orderedSuites.forEach((suiteConfig: any) => {
        const suite = {
          id: suiteConfig.id,
          description: this.normalizeDescription(suiteConfig.description ?? suiteConfig.id),
          fullName: suiteConfig.fullName ?? suiteConfig.id,
          specs: [],
          children: [],
          parent: undefined,
          status: 'skipped' as const // default until executed
        };
        this.suiteById.set(suite.id, suite);
      });
    }

    // 2️⃣ Attach specs to their suites (skip root)
    const orderedSpecs = this.orderedSpecs;
    if (orderedSpecs) {
      orderedSpecs.forEach((specConfig: any) => {
        const spec = {
          id: specConfig.id,
          description: specConfig.description ?? specConfig.id,
          fullName: specConfig.fullName ?? specConfig.id,
          status: 'skipped' as const,
          file: specConfig.file,
        };

        this.specById.set(spec.id, spec);

        const parentSuiteId =
          specConfig.suiteId ?? this.findSuiteIdForSpec(specConfig);
        const parentSuite = this.suiteById.get(parentSuiteId);

        if (parentSuite && parentSuite.id !== this.rootSuite.id) {
          parentSuite.specs.push(spec);
        } else {
          // orphaned spec → does not belong to any known suite
          this.rootSuite.specs.push(spec);
        }
      });
    }

    // 3️⃣ Attach suites to their parents
    if (orderedSuites) {
      orderedSuites.forEach((suiteConfig: any) => {
        const suite = this.suiteById.get(suiteConfig.id);
        if (!suite) return;

        const parentSuiteId =
          suiteConfig.parentSuiteId ?? this.findParentSuiteId(suiteConfig);
        const parentSuite =
          this.suiteById.get(parentSuiteId) ?? this.rootSuite;

        if (parentSuite.id !== suite.id) {
          suite.parent = parentSuite;
          if (!parentSuite.children.includes(suite)) {
            parentSuite.children.push(suite);
          }
        }
      });
    }

    // Debug summary
    const totalSuites = this.orderedSuites?.length; // real suites (root excluded)
    const totalSpecs = this.orderedSpecs?.length;   // all specs
    logger.preparationStep(
      'READY',
      ReporterMessages.suiteTreeBuilt(totalSuites, totalSpecs),
      true,
    );
  }

  countSpecs(suite: TestSuite) {
    let total = suite.specs.length;
    for (const child of suite.children) {
      total += this.countSpecs(child);
    }
    return total;
  }

  private normalizeDescription(desc: any): string {
    if (typeof desc === 'string') return desc;
    if (desc?.en) return desc.en;
    return JSON.stringify(desc);
  }

  private findSuiteIdForSpec(specConfig: any): string {
    // Try to find suite ID from spec's fullName or other hints
    // This is a fallback - ideally suiteId should be in the config
    if (specConfig.suiteId) return specConfig.suiteId;

    // If we have a fullName, try to match it with suite fullNames
    if (specConfig.fullName) {
      for (const [id, suite] of this.suiteById) {
        if (id !== this.rootSuite.id && specConfig.fullName.startsWith(suite.fullName)) {
          return id;
        }
      }
    }

    return this.rootSuite.id;
  }

  private findParentSuiteId(suiteConfig: any): string {
    if (suiteConfig.parentSuiteId) return suiteConfig.parentSuiteId;

    // Try to deduce from fullName
    if (suiteConfig.fullName) {
      const parts = suiteConfig.fullName.split(' ');
      if (parts.length > 1) {
        const parentFullName = parts.slice(0, -1).join(' ');
        for (const [id, suite] of this.suiteById) {
          if (suite.fullName === parentFullName) {
            return id;
          }
        }
      }
    }

    return this.rootSuite.id;
  }

  userAgent(message: any, suites: any, specs: any) {
    this.envInfo = this.gatherEnvironmentInfo();
    this.orderedSuites = Array.isArray(suites) ? suites : null;
    this.orderedSpecs = Array.isArray(specs) ? specs : null;

    if (message) {
      const userAgent = { ...message };
      delete userAgent?.timestamp;
      delete userAgent?.type;
      this.envInfo = {
        ...this.envInfo,
        userAgent
      };
    }
  }

  /**
   * Supplies the Node runner's catalog. Browser transports provide the two
   * arrays through `userAgent`; the in-process runner already has the catalog
   * in its canonical `{ suites, specs }` form.
   */
  setCatalog(catalog: any) {
    this.orderedSuites = Array.isArray(catalog?.suites)
      ? catalog.suites
      : null;
    this.orderedSpecs = Array.isArray(catalog?.specs)
      ? catalog.specs
      : null;
  }

  jasmineStarted(config: any) {
    this.startTime = Date.now();
    this.specCount = 0;
    this.executableSpecCount = 0;
    this.failureCount = 0;
    this.config = config;
    this.failedSpecs = [];
    this.globalFailures = [];
    this.pendingSpecs = [];
    this.rootSuite = this.createRootSuite();
    this.suiteStack = [this.rootSuite];
    this.currentSuite = null;
    this.currentSpec = null;
    this.interrupted = false;
    this.resultPanelLines = null;
    this.summaryStats = null;
    this.completedSuiteIds = new Set();

    this.buildSuiteTree(config);
    this.setupInterruptHandler();

    this.print('\n');
    this.printBox('Test Runner Started', 'cyan', this.runHeaderLines(config));
    this.printEnvironmentInfo();
  }

  /** Facts shown under the "Test Runner Started" title: scope, order, start time. */
  private runHeaderLines(config: any): string[] {
    const specCount = this.orderedSpecs?.length ?? config?.totalSpecsDefined ?? 0;
    const suiteCount = Math.max(0, this.suiteById.size - 1); // root excluded
    const order = config?.order?.random ? 'random order' : 'sequential order';
    const startedAt = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const scope = `${specCount} spec${specCount === 1 ? '' : 's'} · ${suiteCount} suite${suiteCount === 1 ? '' : 's'}`;
    return [
      this.colored('white', scope) + this.colored('gray', `  ·  ${order}`),
      this.colored('gray', `started at ${startedAt}`),
    ];
  }

  suiteStarted(config: any) {
    if (this.interrupted) return;

    // Try to get or create the suite node
    let suite = this.suiteById.get(config.id);
    const parentSuite = this.suiteStack[this.suiteStack.length - 1];

    if (!suite) {
      // Create new suite node if not built from config
      suite = {
        id: config.id,
        description: config.description,
        fullName: config.fullName,
        specs: [],
        children: [],
        parent: parentSuite,
        status: 'running'
      };
      this.suiteById.set(suite.id, suite);
    } else {
      suite.status = 'running';
      suite.parent = parentSuite;
    }

    // Attach to parent if not already
    if (parentSuite && !parentSuite.children.includes(suite)) {
      parentSuite.children.push(suite);
    }

    // Push to stack
    this.suiteStack.push(suite);
    this.currentSuite = suite;
  }

  specStarted(config: any) {
    if (this.interrupted) return;

    const spec = this.specById.get(config.id) ?? {
      id: config.id,
      description: config.description,
      fullName: config.fullName,
      status: 'running',
      file: config.file,
    };

    // The catalog may not have carried a file for every spec (e.g. dynamically
    // registered ones); fill it in from the live config if it shows up here.
    if (!spec.file && config.file) spec.file = config.file;

    spec.status = 'running';
    this.specById.set(spec.id, spec);
    this.currentSpec = spec;

    // Attach to current suite
    if (this.currentSuite) {
      if (!this.currentSuite.specs.includes(spec)) {
        this.currentSuite.specs.push(spec);
      }
    } else {
      // Fallback to root if somehow outside any suite
      this.rootSuite.specs.push(spec);
    }

    this.updateStatusLine();
  }

  specDone(result: any) {
    if (this.interrupted) return;

    this.specCount++;

    // Defensively handle both spec-level status and suite-level overallStatus
    const status = result?.status ?? result?.overallStatus;
    if (!status) return;

    const spec = this.specById.get(result.id);
    if (spec) {
      spec.status = status;
      spec.duration = result.duration;
      spec.failedExpectations = result.failedExpectations;
      spec.pendingReason = result.pendingReason;
      // jasmine's raw SpecResult doesn't carry a file; attach the one we
      // tracked from the catalog so failure grouping has something to key on.
      if (!result.file && spec.file) result.file = spec.file;
    }

    switch (status) {
      case 'passed':
        this.executableSpecCount++;
        break;
      case 'failed':
        this.failureCount++;
        this.failedSpecs.push(result);
        this.executableSpecCount++;
        break;
      case 'pending':
        this.pendingSpecs.push(result);
        this.executableSpecCount++;
        break;
      default:
        break;
    }

    this.currentSpec = null;
    this.updateStatusLine();
  }

  suiteDone(result: any) {
    if (this.interrupted) return;

    const suite = this.suiteStack[this.suiteStack.length - 1];
    if (!suite) return;

    // Mark suite result
    suite.status = this.determineSuiteStatusFromInternal(suite);
    this.completedSuiteIds.add(suite.id);

    // Preserve live feedback while the final report is assembled separately.
    // Passing suites are intentionally silent here — they're already listed
    // once, correctly, in the final SUITES summary panel. Printing a line per
    // passing suite here just duplicates that and drowns out real signal.
    const needsAttention = suite.status === 'failed' || suite.status === 'pending' || suite.status === 'incomplete';
    if (needsAttention) {
      if (this.showColors) {
        this.printLiveSuiteProgress(suite);
      } else {
        this.printSuiteLine(suite);
        this.print('\n');
      }
    }

    // Pop from stack
    this.suiteStack.pop();
    this.currentSuite = this.suiteStack[this.suiteStack.length - 1] ?? null;
  }

  jasmineDone(result?: any) {
    const globalFailures =
      Array.isArray(
        result?.failedExpectations,
      )
        ? result.failedExpectations
        : [];

    this.globalFailures =
      globalFailures;
    this.failureCount =
      this.failedSpecs.length +
      globalFailures.length;

    const totalTimeMs =
      typeof result?.totalTime === 'number'
        ? result.totalTime
        : Date.now() - this.startTime;

    const totalTime = totalTimeMs / 1000;

    this.clearCurrentLine();

    if (this.showColors) this.resultPanelLines = [];
    this.printTestConfiguration(this.config, true);

    // Filter out stale specs (e.g., retried specs that later passed)
    const actualFailedSpecs = this.failedSpecs.filter(s => s.status === 'failed' || s.overallStatus === 'failed');
    const actualPendingSpecs = this.pendingSpecs.filter(s => s.status === 'pending' || s.overallStatus === 'pending');

    if (actualFailedSpecs.length > 0) {
      this.failedSpecs = actualFailedSpecs;
      this.printFailures();
    } else {
      this.failedSpecs = [];
    }

    this.failureCount =
      this.failedSpecs.length +
      this.globalFailures.length;

    if (this.globalFailures.length > 0) {
      this.printGlobalFailures();
    }

    if (actualPendingSpecs.length > 0) {
      this.pendingSpecs = actualPendingSpecs;
      this.printPendingSpecs();
    } else {
      this.pendingSpecs = [];
    }

    if (this.showColors) {
      this.calculateSuiteStatuses(this.rootSuite);
      const attentionLines = this.getAttentionLines();
      if (attentionLines.length > 0) {
        this.appendResultSection(
          'DEMANDING ATTENTION',
          [],
          'yellow',
        );
      }
    }

    this.printSummary(totalTime);

    this.flushResultPanel();

    this.print('\n');
    this.printFinalStatus(result?.overallStatus);

    this.print('\n\n');
    this.removeInterruptHandler();
  }

  /** Mark all specs and suites that were never executed as skipped */
  markUnexecutedAsSkipped() {
    // Mark the currently running spec as incomplete (if exists)
    if (this.currentSpec) {
      if (!this.currentSpec.status || this.currentSpec.status === "running") {
        this.currentSpec.status = "incomplete";
      }
    }

    // Mark the currently running suite as incomplete (if exists)
    if (this.currentSuite && this.currentSuite.id !== this.rootSuite.id) {
      if (!this.currentSuite.status || this.currentSuite.status === "running") {
        this.currentSuite.status = "incomplete";
      }
    }

    // All other unexecuted specs are skipped
    for (const [id, spec] of this.specById) {
      if (this.currentSpec && id === this.currentSpec.id) continue;
      if (!spec.status || spec.status === "running") {
        spec.status = "skipped";
      }
    }

    // All other unexecuted suites are skipped
    for (const [id, suite] of this.suiteById) {
      if (id === this.rootSuite.id) continue;
      if (this.currentSuite && id === this.currentSuite.id) continue;
      if (!suite.status || suite.status === "running") {
        suite.status = "skipped";
      }
    }
  }

  testsAborted(message?: string): number {
    if (this.interrupted) {
      return message === 'SIGTERM' ? EXIT_CODES.SIGTERM : EXIT_CODES.SIGINT;
    }
    this.interrupted = true;

    if (this.isTTY) {
      // Clear the status line (which is on the line above)
      this.print('\r\x1b[1A'); // Move up one line
      this.clearCurrentLine();  // Clear that line
      this.clearCurrentLine();  // Clear current line
      this.print('\n');
    }

    // Mark all unexecuted specs as skipped
    this.markUnexecutedAsSkipped();

    // A reporter may be exercised directly in tests before jasmineStarted().
    // In that case there is no meaningful elapsed time yet.
    const totalTime =
      this.startTime > 0
        ? (
            Date.now() -
            this.startTime
          ) / 1000
        : 0;

    // Filter out stale specs before printing
    const actualFailedSpecs = this.failedSpecs.filter(s => s.status === 'failed' || s.overallStatus === 'failed');
    if (actualFailedSpecs.length > 0) {
      this.failedSpecs = actualFailedSpecs;
      this.printFailures();
    } else {
      this.failedSpecs = [];
    }

    // Print test tree
    this.printTestTree();

    // Print summary
    this.print('\n');
    this.printSummary(totalTime);

    this.print('\n');
    this.printBox(ReporterMessages.testsInterrupted(), 'yellow');
    this.print('\n');
    this.removeInterruptHandler();

    return message === 'SIGTERM' ? EXIT_CODES.SIGTERM : EXIT_CODES.SIGINT;
  }

  /** Determine suite status based on its specs and children */
  private determineSuiteStatusFromInternal(suite: TestSuite): TestStatus {
    // Leaf suite: check specs
    if (suite.specs.length > 0) {
      if (suite.specs.some(s => s.status === 'failed')) return 'failed';
      if (suite.specs.some(s => s.status === 'incomplete')) return 'incomplete';
      if (suite.specs.some(s => s.status === 'running')) return 'incomplete';
      if (suite.specs.some(s => s.status === 'pending')) return 'pending';
      if (suite.specs.every(s => s.status === 'skipped')) return 'skipped';
      if (suite.specs.every(s => s.status === 'passed' || s.status === 'skipped')) return 'passed';
    }
  
    // If no specs, check children
    if (suite.children.length > 0) {
      if (suite.children.some(c => this.determineSuiteStatusFromInternal(c) === 'failed')) return 'failed';
      if (suite.children.some(c => this.determineSuiteStatusFromInternal(c) === 'incomplete')) return 'incomplete';
      if (suite.children.some(c => this.determineSuiteStatusFromInternal(c) === 'pending')) return 'pending';
      if (suite.children.every(c => this.determineSuiteStatusFromInternal(c) === 'skipped')) return 'skipped';
      if (suite.children.every(c => ['passed', 'skipped'].includes(this.determineSuiteStatusFromInternal(c)))) return 'passed';
    }
  
    // Default for empty suites or suites with only passed/skipped specs/children
    return suite.specs.length > 0 || suite.children.length > 0 ? 'passed' : 'skipped';
  }

  private setupInterruptHandler() {
    // Intentionally no-op: process-lifecycle and signal handling are owned by
    // the CLI entry point so the test runner library never kills the process.
  }

  private removeInterruptHandler() {
    // Intentionally no-op: the CLI owns signal handling.
  }

  private clearCurrentLine() {
    if (!this.isTTY) return;
    this.print('\x1b[2K\r');
  }

  private updateStatusLine() {
    if (!this.isTTY || !this.currentSuite) return;

    const total = this.specById.size;
    if (total === 0) return;

    const suiteName = this.currentSuite.description;
    const statusText = `\n  ${this.colored('dim', SYMBOLS.arrow)} ${suiteName} ${this.colored('gray', `(${this.specCount}/${total})`)}`;
    this.clearCurrentLine();
    this.print(statusText);
    this.print('\r\x1b[1A');
  }

  private printSuiteLine(suite: TestSuite) {
    const description = this.suiteDisplayName(suite);
    const suiteName = this.colored('brightBlue', description);
    const dots = suite.specs.map(spec => this.getSpecSymbol(spec));
    const prefix = '  ';
    const maxWidth = this.lineWidth;

    const visibleNameLength = visibleWidth(suiteName);
    const dotsLength = dots.reduce((sum, dot) => sum + visibleWidth(dot), 0);
    const totalLength = prefix.length + visibleNameLength + 1 + dotsLength;

    if (totalLength <= maxWidth) {
      // Fits on one line
      const spaces = ' '.repeat(maxWidth - totalLength);
      this.print(prefix + suiteName + ' ' + spaces + dots.join(''));
    } else {
      // Does not fit: use the suite-name line too, then wrap remaining dots right-aligned
      const availableForName = maxWidth - prefix.length;
      let truncatedName = suiteName;
      if (visibleNameLength > availableForName) {
        // Truncate name with three dots if it does not fit on its own line
        const rawName = description;
        const ellipsis = '...';
        truncatedName = this.colored('brightBlue', rawName.substring(0, Math.max(0, availableForName - ellipsis.length)) + ellipsis);
      }

      this.print(prefix + truncatedName);

      // Fit as many dots as possible on the same line as the suite name, right-aligned
      const firstLineCapacity = Math.max(0, maxWidth - prefix.length - visibleWidth(truncatedName) - 1);
      const firstLineDots: string[] = [];
      let firstLineWidth = 0;
      let remainingDots = dots;

      for (const dot of dots) {
        const dotWidth = visibleWidth(dot);
        if (firstLineWidth + dotWidth > firstLineCapacity && firstLineDots.length > 0) break;
        firstLineDots.push(dot);
        firstLineWidth += dotWidth;
        remainingDots = remainingDots.slice(1);
      }

      if (firstLineDots.length > 0) {
        const spaces = ' '.repeat(firstLineCapacity - firstLineWidth);
        this.print(' ' + spaces + firstLineDots.join(''));
      }

      // Print remaining dots on subsequent lines, each chunk right-aligned
      this.printWrappedDots(remainingDots, prefix, maxWidth);
    }
  }

  private printWrappedDots(dots: string[], prefix: string, maxWidth: number) {
    const lineCapacity = maxWidth - prefix.length;
    if (lineCapacity <= 0) return;

    let currentLineWidth = 0;
    let currentLineDots: string[] = [];

    for (const dot of dots) {
      const dotWidth = visibleWidth(dot);
      if (dotWidth > lineCapacity) continue; // should not happen for single-char dots

      if (currentLineWidth + dotWidth > lineCapacity && currentLineDots.length > 0) {
        // Flush current line right-aligned
        const spaces = ' '.repeat(lineCapacity - currentLineWidth);
        this.print('\n' + prefix + spaces + currentLineDots.join(''));
        currentLineDots = [];
        currentLineWidth = 0;
      }

      currentLineDots.push(dot);
      currentLineWidth += dotWidth;
    }

    // Flush remaining dots
    if (currentLineDots.length > 0) {
      const spaces = ' '.repeat(lineCapacity - currentLineWidth);
      this.print('\n' + prefix + spaces + currentLineDots.join(''));
    }
  }

  private getSpecDots(suite: TestSuite): string {
    return suite.specs.map(spec => this.getSpecSymbol(spec)).join('');
  }

  private getSpecSymbol(spec: TestSpec): string {
    if (!this.showColors) {
      switch (spec.status) {
        case 'passed': return SYMBOLS.passed;
        case 'failed': return SYMBOLS.failed;
        case 'pending': return SYMBOLS.pending;
        default: return '';
      }
    }
    switch (spec.status) {
      case 'passed':
        return this.colored('brightGreen', SYMBOLS.passed);
      case 'failed':
        return this.colored('brightRed', SYMBOLS.failed);
      case 'pending':
        return this.colored('brightYellow', SYMBOLS.pending);
      default:
        return '';
    }
  }

  private compressDots(suite: TestSuite, sideCount: number): string {
    const dots = suite.specs.map(spec => this.getSpecSymbol(spec));

    if (dots.length <= sideCount * 2) {
      return dots.join('');
    }

    const start = dots.slice(0, sideCount).join('');
    const end = dots.slice(-sideCount).join('');
    const ellipsis = this.colored('gray', '...');

    return start + ellipsis + end;
  }

  private countVisualDots(dotsString: string): number {
    return dotsString.replace(/\x1b\[[0-9;]*m/g, '').length;
  }

  private separator(): string {
    return '  ' + SYMBOLS.box_h.repeat(this.lineWidth - 2);
  }

  private printLiveSuiteProgress(suite: TestSuite): void {
    const { color } = this.getSuiteSymbol(suite.status ?? 'incomplete');
    const totalSuites = Math.max(0, this.suiteById.size - 1);
    const completedSuites = this.completedSuiteIds.size;
    const dots = this.getSpecDots(suite);
    const progress = this.colored('gray', `(${completedSuites}/${totalSuites})`);
    const status = this.colored(color, (suite.status ?? 'incomplete').toUpperCase());
    const description = `${status}  ${this.suiteDisplayName(suite)}${dots ? `  ${dots}` : ''}  ${progress}`;

    this.print(renderTerminalStage('SUITE', description, color === 'brightRed' ? 'red' : color === 'brightYellow' ? 'yellow' : 'cyan') + '\n');
  }

  private resultRule(): string {
    return PANEL_RULE;
  }

  private appendResultSection(title: string, lines: string[], color: string): boolean {
    if (!this.resultPanelLines || lines.length === 0) return false;
    if (this.resultPanelLines.length > 0) this.resultPanelLines.push('', this.resultRule(), '');
    this.resultPanelLines.push(this.colored(['bold', color], title), ...lines);
    return true;
  }

  private flushResultPanel(): void {
    if (!this.resultPanelLines) return;
    this.print('\n' + renderTerminalPanel(
      'TEST CONFIGURATION',
      this.resultPanelLines,
      this.failureCount > 0 ? 'red' : this.pendingSpecs.length > 0 ? 'yellow' : 'magenta',
    ) + '\n');
    this.resultPanelLines = null;
  }

  /**
   * Groups failedSpecs by their source file, in first-seen order, but only
   * when every failing spec actually has a `file` (from the catalog). If any
   * spec is missing one, grouping would be misleading (an unlabeled bucket
   * next to labeled ones), so this returns null and the caller falls back to
   * the flat list unchanged.
   */
  private groupFailedSpecsByFile(): Array<{ file: string; specs: any[] }> | null {
    if (this.failedSpecs.length === 0) return null;
    if (!this.failedSpecs.every(spec => typeof spec.file === 'string' && spec.file)) return null;

    const order: string[] = [];
    const byFile = new Map<string, any[]>();
    for (const spec of this.failedSpecs) {
      if (!byFile.has(spec.file)) {
        byFile.set(spec.file, []);
        order.push(spec.file);
      }
      byFile.get(spec.file)!.push(spec);
    }
    return order.map(file => ({ file, specs: byFile.get(file)! }));
  }

  private printFailures() {
    const groups = this.groupFailedSpecsByFile();

    if (this.showColors) {
      const lines: string[] = [];
      let globalIndex = 0;
      const renderSpec = (spec: any) => {
        globalIndex++;
        const durationSuffix = this.formatSpecDuration(spec);
        lines.push(this.colored('white', `${globalIndex}. ${spec.fullName}`) + durationSuffix);
        const expectations = spec.failedExpectations ?? [];
        for (const expectation of expectations) {
          const messageLines = wrapLine(normalize(expectation.message), this.lineWidth - 4, 0);
          lines.push(...messageLines.map(line => this.colored('brightRed', `${SYMBOLS.cross} ${line}`)));
          if (expectation.stack) {
            lines.push(...wrapLine(this.prepareStackTrace(expectation.stack), this.lineWidth - 4, 0)
              .map(line => this.colored('gray', line)));
          }
        }
        if (expectations.length === 0 && !(spec.passedExpectations?.length > 0)) {
          // failSpecWithNoExpectations produces a failure with no expectations at all.
          // Surface that explicitly instead of leaving a bare, unexplained failure header.
          lines.push(this.colored('brightRed', `${SYMBOLS.cross} Spec has no expectations`));
        }
      };

      if (groups) {
        groups.forEach((group, groupIndex) => {
          lines.push(
            this.colored(['bold', 'white'], group.file) +
            this.colored('gray', `  (${group.specs.length} failed)`),
          );
          group.specs.forEach((spec, specIndex) => {
            renderSpec(spec);
            if (specIndex < group.specs.length - 1) lines.push('');
          });
          if (groupIndex < groups.length - 1) lines.push('');
        });
      } else {
        this.failedSpecs.forEach((spec, index) => {
          renderSpec(spec);
          if (index < this.failedSpecs.length - 1) lines.push('');
        });
      }

      if (this.appendResultSection('FAILURES', lines, 'red')) return;
      this.print('\n' + renderTerminalPanel('FAILURES', lines, 'red') + '\n');
      return;
    }

    this.print('\n');
    this.printSectionHeader('FAILURES', 'red');
    this.print(this.colored('red', this.separator() + '\n'));

    if (!this.failedSpecs.length) return;

    let globalIndex = 0;
    const printSpec = (spec: any) => {
      globalIndex++;
      // Print numbered spec header, with duration when known
      const durationSuffix = this.formatSpecDuration(spec);
      const header = wrapLine(`${globalIndex}) ${spec.fullName}${durationSuffix}`, this.lineWidth, 1);
      header.forEach(line => (this.print(this.colored("white", `  ${line.trimStart()}`)), this.print('\n')));

      if (spec.failedExpectations?.length > 0) {
        spec.failedExpectations.forEach((expectation: any, exIndex: number) => {
          const messageLines = wrapLine(`${SYMBOLS.cross} ${normalize(expectation.message)}`, this.lineWidth, 0);
          // Continuation lines of same message
          messageLines.forEach(line => (this.print(this.colored('brightRed', `  ${line.trimStart()}`)), this.print('\n')));

          // Stack trace — lightly indented and gray
          if (expectation.stack) {
            const stackLines = wrapLine(this.prepareStackTrace(expectation.stack), this.lineWidth, 0);
            stackLines.forEach(line => (this.print(this.colored('gray', `  ${line.trimStart()}`)), this.print('\n')));
          }

          // Space between multiple expectations for same spec
          if (exIndex < spec.failedExpectations.length - 1) this.print('\n');
        });
      } else if (!(spec.passedExpectations?.length > 0)) {
        // failSpecWithNoExpectations produces a failure with no expectations at all.
        // Without this, the spec header above would be the only output — no explanation.
        this.print(this.colored('brightRed', `  ${SYMBOLS.cross} Spec has no expectations`));
        this.print('\n');
      }
    };

    if (groups) {
      groups.forEach(group => {
        this.print(this.colored('bold', `  ${group.file}`) + this.colored('gray', `  (${group.specs.length} failed)\n`));
        group.specs.forEach(spec => {
          printSpec(spec);
          // Extra spacing between specs
          this.print('\n');
        });
      });
    } else {
      this.failedSpecs.forEach(spec => {
        printSpec(spec);
        // Extra spacing between specs
        this.print('\n');
      });
    }
  }

  private printGlobalFailures() {
    if (this.showColors) {
      const lines: string[] = [];
      this.globalFailures.forEach((failure, index) => {
        const label = failure.globalErrorType || failure.type || 'global error';
        lines.push(this.colored('white', `${index + 1}. ${label}`));
        lines.push(...wrapLine(normalize(failure.message ?? String(failure)), this.lineWidth - 8, 0)
          .map(line => this.colored('brightRed', `  ${SYMBOLS.cross} ${line}`)));
        if (failure.stack) {
          lines.push(...wrapLine(this.prepareStackTrace(failure.stack), this.lineWidth - 10, 0)
            .map(line => this.colored('gray', `    ${line}`)));
        }
        if (index < this.globalFailures.length - 1) lines.push('');
      });
      if (this.appendResultSection('GLOBAL ERRORS', lines, 'red')) return;
      this.print('\n' + renderTerminalPanel('GLOBAL ERRORS', lines, 'red') + '\n');
      return;
    }

    this.print('\n');
    this.printSectionHeader(
      'GLOBAL ERRORS',
      'red',
    );
    this.print(
      this.colored(
        'red',
        this.separator() + '\n',
      ),
    );

    this.globalFailures.forEach(
      (failure, idx) => {
        const label =
          failure.globalErrorType ||
          failure.type ||
          'global error';
        const message =
          normalize(
            failure.message ??
              String(failure),
          );
        const header = wrapLine(
          `${idx + 1}) ${label}`,
          this.lineWidth,
          0,
        );
        header.forEach(
          (line) => (
            this.print(
              this.colored(
                'white',
                `  ${line.trimStart()}`,
              ),
            ),
            this.print('\n')
          ),
        );

        const messageLines =
          wrapLine(
            `${SYMBOLS.cross} ${message}`,
            this.lineWidth,
            0,
          );
        messageLines.forEach(
          (line) => (
            this.print(
              this.colored(
                'brightRed',
                `  ${line.trimStart()}`,
              ),
            ),
            this.print('\n')
          ),
        );

        if (failure.stack) {
          const stackLines =
            wrapLine(
              this.prepareStackTrace(
                failure.stack,
              ),
              this.lineWidth,
              0,
            );
          stackLines.forEach(
            (line) => (
              this.print(
                this.colored(
                  'gray',
                  `  ${line.trimStart()}`,
                ),
              ),
              this.print('\n')
            ),
          );
        }

        this.print('\n');
      },
    );
  }

  private printPendingSpecs() {
    if (this.showColors) {
      const lines = this.pendingSpecs.flatMap((spec, index) => {
        const headerLines = wrapLine(`${index + 1}. ${spec.fullName}`, this.lineWidth - 6, 0)
          .map(line => this.colored('brightYellow', `${SYMBOLS.pending} ${line}`));
        const reason = this.pendingReasonText(spec);
        const reasonLines = wrapLine(reason, this.lineWidth - 8, 0)
          .map(line => this.colored('dim', `    ${line}`));
        return [...headerLines, ...reasonLines];
      });
      if (this.appendResultSection('PENDING', lines, 'yellow')) return;
      this.print('\n' + renderTerminalPanel('PENDING', lines, 'yellow') + '\n');
      return;
    }

    this.print('\n');
    this.printSectionHeader('PENDING', 'yellow');
    this.print(this.colored('yellow', this.separator() + '\n'));

    this.pendingSpecs.forEach((spec, idx) => {
      // Print numbered spec header with wrapping
      const header = wrapLine(`${this.colored('brightYellow', SYMBOLS.pending)} ${this.colored('white', spec.fullName)}`, this.lineWidth, 1, 'word');
      header.forEach(line => (this.print(line), this.print('\n')));

      // Print the reason the spec is pending — previously captured but never shown.
      const reasonLines = wrapLine(this.pendingReasonText(spec), this.lineWidth - 4, 0);
      reasonLines.forEach(line => (this.print(this.colored('dim', `    ${line}`)), this.print('\n')));
    });
  }

  private pendingReasonText(spec: any): string {
    return spec.pendingReason && spec.pendingReason !== ''
      ? spec.pendingReason
      : 'No reason given';
  }

  /** Slower than this and the duration gets flagged instead of just stated. */
  private static readonly SLOW_SPEC_MS = 500;

  /** Formats a millisecond duration compactly for inline use ("620ms", "1.20s"). */
  private formatDuration(ms: number): string {
    return ms >= 1000
      ? `${(ms / 1000).toFixed(2)}s`
      : `${Math.round(ms)}ms`;
  }

  /**
   * Normalizes a raw stack for display: one frame per line, and frames pointing
   * at Jasmine's own internals ("at <Jasmine>") dropped — they are noise when
   * diagnosing a spec failure, unless they are all there is.
   */
  private prepareStackTrace(raw: string): string {
    const normalized = normalizeStackTrace(raw);
    const frames = normalized.split('\n');
    const userFrames = frames.filter(line => !/^at <Jasmine>/.test(line));
    return userFrames.length > 0 ? userFrames.join('\n') : normalized;
  }

  /** Renders " (123ms)", flagged " (1.2s, slow)" past the slow threshold, or "" when unknown. */
  private formatSpecDuration(spec: TestSpec): string {
    if (typeof spec.duration !== 'number' || Number.isNaN(spec.duration)) return '';
    const slow = spec.duration >= ConsoleReporter.SLOW_SPEC_MS;
    const rendered = slow ? `${this.formatDuration(spec.duration)}, slow` : this.formatDuration(spec.duration);
    return ' ' + this.colored(slow ? 'brightYellow' : 'gray', `(${rendered})`);
  }

  private computeOverallStatus(jasmineOverallStatus?: string): 'passed' | 'failed' | 'incomplete' {
    if (this.failureCount > 0) return 'failed';

    const hasIncompleteSpec = [...this.specById.values()].some(
      (spec) => spec.status === 'incomplete' || spec.status === 'running'
    );

    const hasIncompleteSuite = [...this.suiteById.values()].some(
      (suite) => suite.status === 'incomplete' || suite.status === 'running'
    );
  
    if (this.interrupted || hasIncompleteSpec || hasIncompleteSuite || jasmineOverallStatus === 'incomplete') {
      return 'incomplete';
    }
  
    return 'passed';
  }

  private printFinalStatus(jasmineOverallStatus?: string) {
    const overallStatus = this.computeOverallStatus(jasmineOverallStatus);
    const recap = this.finalStatusRecapLines();
    if (overallStatus === 'passed') {
      const msg = this.pendingSpecs.length === 0
        ? ReporterMessages.allTestsPassed()
        : ReporterMessages.allTestsPassedWithPending(this.pendingSpecs.length);
      this.printBox(msg, 'green', recap);
    } else if (overallStatus === 'failed') {
      this.printBox(ReporterMessages.testsFailed(this.failureCount), 'red', recap);
    } else if (overallStatus === 'incomplete') {
      this.printBox(ReporterMessages.testsIncomplete(), 'yellow', recap);
    } else {
      this.printBox(ReporterMessages.unknownStatus(overallStatus), 'red', recap);
    }
  }

  /** Counts + duration recap printed inside the final status box. */
  private finalStatusRecapLines(): string[] {
    const stats = this.summaryStats;
    if (!stats) return [];

    const counts: string[] = [];
    if (stats.passed > 0) counts.push(`${stats.passed} passed`);
    if (stats.failed > 0) counts.push(`${stats.failed} failed`);
    if (stats.pending > 0) counts.push(`${stats.pending} pending`);

    return [
      ...(counts.length > 0 ? [this.colored('white', counts.join(' · '))] : []),
      this.colored('gray', `finished in ${stats.totalTime.toFixed(3)}s`),
    ];
  }

  private printTestTree() {
    if (this.showColors) {
      this.calculateSuiteStatuses(this.rootSuite);
      const lines = this.getAttentionLines();
      this.print('\n' + renderTerminalPanel(
        'DEMANDING ATTENTION',
        lines.length > 0
          ? lines
          : [this.colored('brightGreen', `${SYMBOLS.checked} All suites completed successfully`)],
        'yellow',
      ) + '\n');
      return;
    }

    this.print(this.colored('bold', '  Demanding Attention\n'));
    this.print(this.colored('gray', this.separator() + '\n'));

    // Calculate suite statuses starting from root (recursively covers all suites)
    this.calculateSuiteStatuses(this.rootSuite);

    // Print all top-level suites (those whose parent is rootSuite)
    let hasProblems = false;

    for (const [id, suite] of this.suiteById) {
      // Skip root suite itself
      if (suite.id === this.rootSuite.id) continue;

      // Only print top-level suites (direct children of root)
      // Their children will be printed recursively
      if (!suite.parent || suite.parent.id === this.rootSuite.id) {
        if (this.printProblemSuite(suite, 1)) {
          hasProblems = true;
        }
      }
    }

    if (!hasProblems) {
      this.print('  ' + this.colored('brightGreen', SYMBOLS.checked) + ' ' + this.colored('dim', 'All suites completed successfully\n'));
    }
  }

  private calculateSuiteStatuses(suite: TestSuite): TestStatus {
    const childStatuses = suite.children.map(child => this.calculateSuiteStatuses(child));

    // Normalize spec statuses first
    for (const spec of suite.specs) {
      if (!spec.status) {
        spec.status = 'skipped';
      } else if (spec.status === 'running') {
        spec.status = 'incomplete';
      }
    }

    const specs = suite.specs;
    const failedCount = specs.filter(s => s.status === 'failed').length;
    const pendingCount = specs.filter(s => s.status === 'pending').length;
    const incompleteCount = specs.filter(s => s.status === 'incomplete' || s.status === 'running').length;
    const skippedCount = specs.filter(s => s.status === 'skipped').length;

    const hasFailedChildren = childStatuses.includes('failed');
    const hasPendingChildren = childStatuses.includes('pending') || childStatuses.includes('running');
    const hasIncompleteChildren = childStatuses.includes('incomplete');

    // 🚨 FIX: Check incomplete status BEFORE passed status
    if (failedCount > 0 || hasFailedChildren) {
      suite.status = 'failed';
    } else if (incompleteCount > 0 || hasIncompleteChildren) {
      suite.status = 'incomplete';  // This should come before pending/passed
    } else if (pendingCount > 0 || hasPendingChildren) {
      suite.status = 'pending';
    } else if (skippedCount > 0) {
      suite.status = 'skipped';
    } else {
      suite.status = 'passed';
    }

    return suite.status;
  }

  /** Print only suites/specs that need attention */
  printProblemSuite(suite: TestSuite, indentLevel: number = 0): boolean {
    if (suite.id === this.rootSuite.id) return false;

    const indent = "  ".repeat(indentLevel);
    let hasProblems = false;

    // --- 1️⃣ Process children ---
    let childHasProblems = false;
    for (const child of suite.children) {
      if (this.printProblemSuite(child, indentLevel + 1)) {
        childHasProblems = true;
        hasProblems = true;
      }
    }

    // --- 2️⃣ Determine if this suite is a problem node ---
    const isProblemSuite = ["failed", "pending", "incomplete", "skipped"].includes(suite.status!);

    if (isProblemSuite || childHasProblems) {
      hasProblems = true;

      if (isProblemSuite) {
        const { symbol, color } = this.getSuiteSymbol(suite.status!);
        const specs = suite.specs;
        const specCount = specs.length;

        const failed = specs.filter(s => s.status === "failed").length;
        const pending = specs.filter(s => s.status === "pending").length;
        const incomplete = specs.filter(s => s.status === "incomplete").length;
        const skipped = specs.filter(s => s.status === "skipped").length;
        const passed = specs.filter(s => s.status === "passed").length;

        const statusParts: string[] = [];

        // Show status based on the suite's overall status
        switch (suite.status) {
          case "failed":
            if (failed > 0) statusParts.push(`${failed} failed`);
            if (passed > 0) statusParts.push(`${passed} passed`);
            if (pending > 0) statusParts.push(`${pending} pending`);
            if (incomplete > 0) statusParts.push(`${incomplete} incomplete`);
            if (skipped > 0) statusParts.push(`${skipped} skipped`);
            break;

          case "incomplete":
            if (incomplete > 0) statusParts.push(`${incomplete} incomplete`);
            if (passed > 0) statusParts.push(`${passed} passed`);
            if (failed > 0) statusParts.push(`${failed} failed`);
            if (pending > 0) statusParts.push(`${pending} pending`);
            break;

          case "pending":
            if (pending > 0) statusParts.push(`${pending} pending`);
            if (passed > 0) statusParts.push(`${passed} passed`);
            if (failed > 0) statusParts.push(`${failed} failed`);
            break;

          case "skipped":
            statusParts.push(`${specCount} skipped`);
            break;

          case "passed":
            statusParts.push(`${specCount} passed`);
            break;
        }

        // Add child suite count if applicable
        if (suite.children.length > 0) {
          statusParts.push(`${suite.children.length} child suite${suite.children.length !== 1 ? "s" : ""}`);
        }

        const details = statusParts.length ? this.colored("gray", ` (${statusParts.join(", ")})`) : "";
        // Truncate description so status details stay on the same line.
        const rawDesc = this.suiteDisplayName(suite);
        const statusSymbol = this.colored(color, symbol);
        const prefix = `${indent}${statusSymbol} `;
        const availableForDesc = Math.max(0, this.lineWidth - visibleWidth(prefix) - visibleWidth(details));
        const truncatedDesc =
          availableForDesc > 0 && visibleWidth(rawDesc) > availableForDesc
            ? this.truncateString(rawDesc, availableForDesc)
            : rawDesc;
        const desc = suite.status === "incomplete" ? this.colored("yellow", truncatedDesc) : truncatedDesc;

        this.print(`${prefix}${desc}${details}\n`);
      } else if (childHasProblems) {
        // Visual grouping for parent of problem children
        const hasNonSkippedChildProblems = suite.children.some(c =>
          ["failed", "pending", "incomplete"].includes(c.status!)
        );
        if (hasNonSkippedChildProblems) {
          const arrow = this.colored("brightBlue", SYMBOLS.arrow_down_right);
          const prefix = `${indent}${arrow} `;
          const rawDesc = this.suiteDisplayName(suite);
          const availableForDesc = Math.max(0, this.lineWidth - visibleWidth(prefix));
          const truncatedDesc =
            availableForDesc > 0 && visibleWidth(rawDesc) > availableForDesc
              ? this.truncateString(rawDesc, availableForDesc)
              : rawDesc;
          this.print(`${prefix}${this.colored("dim", truncatedDesc)}\n`);
        }
      }
    }

    return hasProblems;
  }

  private getSuiteSymbol(status: 'failed' | 'pending' | 'skipped' | 'incomplete' | 'passed' | 'running'): { symbol: string; color: string } {
    if (!this.showColors) {
      switch (status) {
        case 'failed': return { symbol: SYMBOLS.cross, color: 'brightRed' };
        case 'pending': return { symbol: SYMBOLS.pending, color: 'brightYellow' };
        case 'skipped': return { symbol: SYMBOLS.skip, color: 'gray' };
        case 'incomplete': return { symbol: SYMBOLS.incomplete, color: 'cyan' };
        case 'passed': return { symbol: SYMBOLS.checked, color: 'brightGreen' };
        default: return { symbol: '?', color: 'white' };
      }
    }
    switch (status) {
      case 'failed':
        return { symbol: SYMBOLS.cross, color: 'brightRed' };
      case 'pending':
        return { symbol: SYMBOLS.pending, color: 'brightYellow' };
      case 'skipped':
        return { symbol: SYMBOLS.skip, color: 'gray' };
      case 'incomplete':
        return { symbol: SYMBOLS.incomplete, color: 'cyan' };
      case 'passed':
        return { symbol: SYMBOLS.checked, color: 'brightGreen' };
      default:
        return { symbol: '?', color: 'white' };
    }
  }

  private printBox(text: string, color: string, detailLines: string[] = []) {
    text = replacePlaceholders(text);
    const strippedText = text.replace(ANSI_FULL_REGEX, '');

    if (!this.showColors) {
      const strippedDetails = detailLines.map(line => line.replace(ANSI_FULL_REGEX, ''));
      const contentWidth =
        Math.max(visibleWidth(strippedText), ...strippedDetails.map(visibleWidth));
      const border =
        '-'.repeat(contentWidth + 4);
      const row = (text: string) => `  |  ${text.padEnd(contentWidth)}  |\n`;

      this.print(
        `  +${border}+\n`,
      );

      this.print(row(strippedText));

      for (const detail of strippedDetails) {
        this.print(row(detail));
      }

      this.print(
        `  +${border}+\n`,
      );

      return;
    }

    this.print(renderTerminalPanel(text, detailLines, color) + '\n');
  }

  private printSectionHeader(text: string, color: string) {
    this.print(this.colored('bold', this.colored(color, `  ${text}\n`)));
  }

  private printDivider() {
    this.print(this.colored('gray', this.separator() + '\n'));
  }

  private printSummary(totalTime: number) {
    // Count specs by their actual status
    let passed = 0;
    let failed = 0;
    let pending = 0;
    let skipped = 0;
    let incomplete = 0;
    let notRun = 0;

    // Iterate through all specs to get accurate counts
    for (const [id, spec] of this.specById) {
      switch (spec.status) {
        case 'passed':
          passed++;
          break;
        case 'failed':
          failed++;
          break;
        case 'pending':
          pending++;
          break;
        case 'skipped':
          skipped++;
          break;
        case 'incomplete':
          incomplete++;
          break;
        default:
          // Specs that never got a status are "not run"
          notRun++;
          break;
      }
    }

    const totalSpecs = this.specById.size;
    const executed = passed + failed + pending;
    const duration = `${totalTime.toFixed(3)}s`;
    const suiteCount = Math.max(0, this.suiteById.size - 1); // root excluded

    // The final status box prints right after this and reuses the counts.
    this.summaryStats = { passed, failed, pending, totalTime };

    // Build the existing summary facts, then give them a dedicated Ink panel.
    const rightInfo = `total: ${totalSpecs}  suites: ${suiteCount}  time: ${duration}`;

    // Derived run statistics: share of green specs and execution throughput.
    const statsParts: string[] = [];
    if (totalSpecs > 0 && executed > 0) {
      statsParts.push(`pass rate: ${Math.round((passed / totalSpecs) * 100)}%`);
    }
    if (totalTime > 0 && executed > 0) {
      statsParts.push(`${(executed / totalTime).toFixed(1)} specs/s`);
    }

    // The slowest spec is worth naming once its duration becomes non-trivial.
    let slowest: { name: string; duration: number } | null = null;
    for (const spec of this.specById.values()) {
      if (typeof spec.duration === 'number' && !Number.isNaN(spec.duration)) {
        if (!slowest || spec.duration > slowest.duration) {
          slowest = { name: spec.fullName, duration: spec.duration };
        }
      }
    }
    const slowestLine = slowest !== null && slowest.duration >= 100
      ? `slowest: ${slowest.name} (${this.formatDuration(slowest.duration)})`
      : null;

    const parts: string[] = [];

    if (passed > 0)
      parts.push(this.colored('brightGreen', `${SYMBOLS.checked} Passed: ${passed}`));

    if (failed > 0)
      parts.push(this.colored('brightRed', `${SYMBOLS.cross} Failed: ${failed}`));

    if (pending > 0)
      parts.push(this.colored('brightYellow', `${SYMBOLS.pending} Pending: ${pending}`));

    if (incomplete > 0)
      parts.push(this.colored('cyan', `${SYMBOLS.incomplete} Incomplete: ${incomplete}`));

    if (skipped > 0)
      parts.push(this.colored('gray', `${SYMBOLS.skip} Skipped: ${skipped}`));

    if (notRun > 0)
      parts.push(this.colored('gray', `${SYMBOLS.not_run} Not Run: ${notRun}`));

    if (!this.showColors) {
      const lineWidth = this.lineWidth;
      const title = '  Test Summary';
      const spacing = Math.max(1, lineWidth - title.length - rightInfo.length);
      this.print('\n');
      this.print(title + ' '.repeat(spacing) + rightInfo + '\n');
      this.print(this.separator() + '\n');
      if (statsParts.length > 0) {
        this.print(`  ${statsParts.join('  ·  ')}\n`);
      }
      this.print(parts.length > 0
        ? `  ${parts.join('  |  ')}\n`
        : '  (no specs executed)\n');
      if (slowestLine) {
        this.print(`  ${this.colored('gray', slowestLine)}\n`);
      }
      return;
    }

    const summaryLines = [
      rightInfo,
      ...(statsParts.length > 0 ? [statsParts.join('  ·  ')] : []),
      parts.length > 0 ? parts.join('  |  ') : '(no specs executed)',
      ...(slowestLine ? [this.colored('gray', slowestLine)] : []),
    ];
    if (this.appendResultSection(
      'TEST SUMMARY',
      summaryLines,
      failed > 0 ? 'red' : pending > 0 ? 'yellow' : 'green',
    )) return;

    this.print('\n');
    this.print(renderTerminalPanel(
      'TEST SUMMARY',
      summaryLines,
      failed > 0 ? 'red' : pending > 0 ? 'yellow' : 'green',
    ) + '\n');
  }

  private colored(style: string | string[], text: string): string {
    if (!this.showColors) return text.replace(ANSI_FULL_REGEX, '');
    const styles = Array.isArray(style) ? style : [style];
    const color = styles.find(styleName => styleName !== 'bold' && styleName !== 'dim');

    return renderTerminalText(text, {
      color: color === 'brightGreen'
        ? 'greenBright'
        : color === 'brightRed'
          ? 'redBright'
          : color === 'brightYellow'
            ? 'yellowBright'
            : color === 'brightBlue'
              ? 'blueBright'
              : color === 'brightCyan'
                ? 'cyanBright'
                : color,
      bold: styles.includes('bold'),
      dimColor: styles.includes('dim'),
    });
  }

  private gatherEnvironmentInfo(): EnvironmentInfo {
    const memUsage = process.memoryUsage();
    const memTotal = Math.round(memUsage.heapTotal / 1024 / 1024);
    const uptime = Math.round(process.uptime());

    return {
      node: process.version,
      platform: `${process.platform} ${process.arch}`,
      arch: process.arch,
      cwd: process.cwd(),
      memory: `${memTotal} MB`,
      pid: process.pid,
      uptime: `${uptime}s`,
    };
  }

  /** A label/value row with the label column aligned across panels. */
  private factRow(label: string, value: string): string {
    return `${label.padEnd(12)} ${value}`;
  }

  private printEnvironmentInfo() {
    if (!this.envInfo) this.envInfo = this.gatherEnvironmentInfo();

    if (this.showColors) {
      this.print('\n');
      this.print(renderTerminalPanel(
        'ENVIRONMENT',
        [
          this.factRow('Node.js', this.envInfo.node),
          this.factRow('Platform', this.envInfo.platform),
          this.factRow('Architecture', this.envInfo.arch),
          this.factRow('Process', `${this.envInfo.pid} · uptime ${this.envInfo.uptime}`),
          this.factRow('Memory', `${this.envInfo.memory} heap`),
          this.factRow('Directory', this.envInfo.cwd),
        ],
        'blue',
      ) + '\n');

      if (this.envInfo.userAgent) this.printUserAgentInfo(this.envInfo.userAgent);
      return;
    }

    this.print('\n');
    this.print(this.colored('bold', '  Environment\n'));
    this.print(this.colored('gray', this.separator() + '\n'));

    this.print(this.colored('cyan', '  Node.js:   ') + this.colored('white', `${this.envInfo.node}\n`));
    this.print(this.colored('cyan', '  Platform:  ') + this.colored('white', `${this.envInfo.platform}\n`));
    this.print(this.colored('cyan', '  Arch:      ') + this.colored('white', `${this.envInfo.arch}\n`));

    this.print(this.colored('cyan', '  PID:       ') + this.colored('white', `${this.envInfo.pid}\n`));
    this.print(this.colored('cyan', '  Uptime:    ') + this.colored('white', `${this.envInfo.uptime}\n`));
    this.print(this.colored('cyan', '  Memory:    ') + this.colored('white', `${this.envInfo.memory} heap\n`));

    if (this.envInfo.userAgent) {
      this.printUserAgentInfo(this.envInfo.userAgent);
    }

    this.print('\n');
    this.printLabeledField('Directory:  ', this.envInfo.cwd, 'gray', true);
  }

  private detectBrowser(userAgent: string): { name: string; version: string } {
    let name = 'Unknown';
    let version = '';

    const ua = userAgent.toLowerCase();

    if (/firefox\/(\d+\.\d+)/.test(ua)) {
      name = 'Firefox';
      version = ua.match(/firefox\/(\d+\.\d+)/)![1];
    } else if (/edg\/(\d+\.\d+)/.test(ua)) {
      name = 'Edge';
      version = ua.match(/edg\/(\d+\.\d+)/)![1];
    } else if (/chrome\/(\d+\.\d+)/.test(ua)) {
      name = 'Chrome';
      version = ua.match(/chrome\/(\d+\.\d+)/)![1];
    } else if (/safari\/(\d+\.\d+)/.test(ua) && /version\/(\d+\.\d+)/.test(ua)) {
      name = 'Safari';
      version = ua.match(/version\/(\d+\.\d+)/)![1];
    } else if (/opr\/(\d+\.\d+)/.test(ua)) {
      name = 'Opera';
      version = ua.match(/opr\/(\d+\.\d+)/)![1];
    }

    return { name, version };
  }

  private printUserAgentInfo(userAgent: UserAgent) {
    const { name: browserName, version: browserVersion } = this.detectBrowser(userAgent.userAgent);

    if (this.showColors) {
      const lines = [
        this.factRow('Browser', `${browserName} ${browserVersion}`.trimEnd()),
        this.factRow('User agent', userAgent.userAgent),
      ];
      if (userAgent.platform) lines.push(this.factRow('Platform', userAgent.platform));
      if (userAgent.vendor) lines.push(this.factRow('Vendor', userAgent.vendor));
      if (userAgent.language) lines.push(this.factRow('Language', userAgent.language));
      if (userAgent.languages?.length > 0) lines.push(this.factRow('Languages', userAgent.languages.join(', ')));

      this.print('\n');
      this.print(renderTerminalPanel('BROWSER / NAVIGATOR', lines, 'blue') + '\n');
      return;
    }

    this.print('\n');
    this.print(this.colored('bold', '  Browser/Navigator\n'));
    this.print(this.colored('gray', this.separator() + '\n'));

    this.printLabeledField('User Agent: ', userAgent.userAgent, 'white');
    this.printLabeledField('Browser:    ', `${browserName} ${browserVersion}`, 'white');

    if (userAgent.platform) {
      this.printLabeledField('Platform:   ', userAgent.platform, 'white');
    }

    if (userAgent.vendor) {
      this.printLabeledField('Vendor:     ', userAgent.vendor, 'white');
    }

    if (userAgent.language) {
      this.printLabeledField('Language:   ', userAgent.language, 'white');
    }

    if (userAgent.languages?.length > 0) {
      const langs = userAgent.languages.join(', ');
      this.printLabeledField('Languages:  ', langs, 'white');
    }
  }

  private printLabeledField(label: string, value: string, valueColor: string, fromStart: boolean = false): void {
    const prefix = `  ${this.colored('cyan', label)}`;
    const available = Math.max(0, this.lineWidth - visibleWidth(prefix));
    const displayValue = available > 3 && visibleWidth(value) > available
      ? this.truncateString(value, available, fromStart)
      : value;
    this.print(prefix + this.colored(valueColor, `${displayValue}\n`));
  }

  private truncateString(str: string, maxLength: number, fromStart: boolean = false): string {
    if (str.length <= maxLength) return str;

    if (fromStart) {
      return '...' + str.slice(-(maxLength - 3));
    }
    return str.substring(0, maxLength - 3) + '...';
  }

  private printTestConfiguration(config: any, includeSuites = false) {
    if (!config || Object.keys(config).length === 0) return;

    const orderRow =
      config.order?.random !== void 0
        ? this.factRow('Order', config.order.random ? 'random' : 'sequential')
        : null;

    const seedRow =
      config.order?.seed !== void 0 ? this.factRow('Seed', String(config.order.seed)) : null;

    const orderRows = [orderRow, seedRow].filter(Boolean) as string[];

    const parts = [];

    if (config.stopOnSpecFailure !== void 0)
      parts.push(
        this.colored("magenta", "Fail Fast:") +
        " " +
        this.colored("white", config.stopOnSpecFailure ? `${SYMBOLS.checked} enabled` : `${SYMBOLS.cross} disabled`)
      );

    if (config.stopSpecOnExpectationFailure !== void 0)
      parts.push(
        this.colored("magenta", "Stop Spec:") +
        " " +
        this.colored("white", config.stopSpecOnExpectationFailure ? `${SYMBOLS.checked} enabled` : `${SYMBOLS.cross} disabled`)
      );

    if (config.failSpecWithNoExpectations !== void 0)
      parts.push(
        this.colored("magenta", "No Expect:") +
        " " +
        this.colored("white", config.failSpecWithNoExpectations ? `${SYMBOLS.checked} fail` : `${SYMBOLS.cross} pass`)
      );

    const orderLines = orderRows.length > 0 ? orderRows : [this.factRow('Order', 'default')];

    if (this.showColors) {
      const suiteLines = includeSuites ? this.getSuiteSummaryLines() : [];
      if (this.resultPanelLines) {
        this.resultPanelLines.push(
          ...orderLines,
          ...(parts.length > 0 ? [parts.join('  ·  ')] : []),
          ...(suiteLines.length > 0
            ? ['', this.colored(['bold', 'brightBlue'], 'SUITES'), this.resultRule(), ...suiteLines]
            : []),
        );
        return;
      }
      this.print('\n');
      this.print(renderTerminalPanel(
        'TEST CONFIGURATION',
        [
          ...orderLines,
          ...(parts.length > 0 ? [parts.join('  ·  ')] : []),
          ...(suiteLines.length > 0 ? ['', 'SUITES', ...suiteLines] : []),
        ],
        'magenta',
      ) + '\n');
      return;
    }

    this.print('\n');
    this.print('  Test Configuration\n');
    this.print(this.separator() + '\n');
    for (const row of orderLines) {
      this.print(`  ${row}\n`);
    }
    if (parts.length > 0) {
      this.print(`  ${parts.join('  |  ')}\n`);
    }
    if (includeSuites) {
      for (const line of this.getSuiteSummaryLines()) this.print(`  ${line}\n`);
    }
  }

  private getAttentionLines(): string[] {
    const lines: string[] = [];
    const visit = (suite: TestSuite, depth: number) => {
      const status = suite.status ?? 'skipped';
      const hasAttention = ['failed', 'pending', 'incomplete', 'skipped'].includes(status);
      if (hasAttention) {
        const tone = status === 'failed'
          ? 'brightRed'
          : status === 'pending'
            ? 'brightYellow'
            : status === 'incomplete'
              ? 'cyan'
              : 'gray';
        const label = status === 'incomplete' ? 'INCOMPLETE' : status.toUpperCase();
        const counts = suite.specs.length > 0
          ? ` · ${suite.specs.length} spec${suite.specs.length === 1 ? '' : 's'}`
          : '';
        lines.push(`${'  '.repeat(Math.min(depth, 6))}${this.colored(tone, label.padEnd(10))} ${this.suiteDisplayName(suite)}${this.colored('gray', counts)}`);
      }
      for (const child of suite.children) visit(child, depth + 1);
    };

    for (const suite of this.rootSuite.children) visit(suite, 0);
    return lines;
  }

  private getSuiteSummaryLines(): string[] {
    const lines: string[] = [];
    // The Ink panel consumes two border columns and two padding columns.
    const contentWidth = Math.max(32, this.lineWidth - 4);
    const visit = (suite: TestSuite, depth: number) => {
      const symbols = this.getSpecDots(suite);
      const description = this.suiteDisplayName(suite);
      const status = suite.status ?? this.determineSuiteStatusFromInternal(suite);
      const statusText = status === 'passed'
        ? this.colored('brightGreen', 'PASS')
        : status === 'failed'
          ? this.colored('brightRed', 'FAIL')
          : status === 'pending'
            ? this.colored('brightYellow', 'PEND')
            : this.colored('gray', status.toUpperCase());
      const indent = '  '.repeat(Math.min(depth, 6));
      const prefix = `${indent}${statusText}  `;
      const specCountSuffix = suite.specs.length > 0
        ? this.colored('gray', ` · ${suite.specs.length} spec${suite.specs.length === 1 ? '' : 's'}`)
        : '';
      const symbolWidth = visibleWidth(symbols);
      const availableNameWidth = Math.max(
        1,
        contentWidth - visibleWidth(prefix) - visibleWidth(specCountSuffix) - (symbolWidth > 0 ? symbolWidth + 1 : 0),
      );
      const name = visibleWidth(description) > availableNameWidth
        ? this.truncateString(description, availableNameWidth)
        : description;
      const padding = symbolWidth > 0
        ? ' '.repeat(Math.max(1, contentWidth - visibleWidth(prefix) - visibleWidth(name) - visibleWidth(specCountSuffix) - symbolWidth))
        : '';

      lines.push(`${prefix}${name}${specCountSuffix}${padding}${symbols}`);
      for (const child of suite.children) visit(child, depth + 1);
    };

    for (const suite of this.rootSuite.children) visit(suite, 0);
    return lines;
  }

  private suiteDisplayName(suite: TestSuite): string {
    if (typeof suite.description === 'string' && suite.description) return suite.description;
    if (typeof suite.fullName === 'string' && suite.fullName) return suite.fullName;
    return suite.id || '(unnamed suite)';
  }
}
