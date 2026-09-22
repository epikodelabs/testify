import util from 'util';
import jasmineCore from 'jasmine-core';
import { logger } from './logger';
import { wrapLine, visibleWidth, ANSI_FULL_REGEX, normalize, normalizeStackTrace } from './utils';
import { EXIT_CODES } from './exit-codes';
import { getMaxWidth, isAnsiMode } from './ansi-constants';
import { ReporterMessages } from './log-messages';
import { SYMBOLS, replacePlaceholders } from './symbols';
import {
  renderTerminalPanel,
  renderTerminalText,
  PANEL_RULE,
  startLiveTerminalView,
  type LiveTerminalView,
} from './ink-output';

export interface EnvironmentInfo {
  node: string;
  jasmine: string;
  platform: string;
  arch: string;
  cwd: string;
  memory: string;
  pid: number;
  uptime: string;
  userAgent?: UserAgent;
}

function getJasmineVersion(): string {
  const version = typeof jasmineCore.version === 'function'
    ? jasmineCore.version()
    : jasmineCore.version;
  return version ? `v${version}` : 'unknown';
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
  private runStartedAt = '';
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
  // Terminal panels reserve a small right margin to avoid Windows auto-wrap.
  // Keep every row calculation inside that actual outer frame width.
  private get lineWidth(): number { return Math.max(24, getMaxWidth() - 2); }
  private interruptHandlersRegistered: boolean = false;
  private interrupted = false;
  private orderedSuites: any[] | null = null;
  private orderedSpecs: any[] | null = null;
  private isTTY: boolean;
  private resultPanelLines: string[] | null = null;
  /** The result panel is redrawn in place while the run is in progress. */
  private resultView: LiveTerminalView | null = null;
  private resultUpdateTimer: NodeJS.Timeout | null = null;
  /** An append-only table remains reliable after it has scrolled off-screen. */
  private appendOnlyResultTable = false;
  private appendedResultSuiteIds = new Set<string>();
  private runCompleted = false;
  private readonly usesDefaultPrint: boolean;
  /** Counts captured by printSummary for the final status box recap. */
  private summaryStats: { passed: number; failed: number; pending: number; totalTime: number } | null = null;

  /** Keep output readable in a terminal while preserving ASCII-only --ansi output. */
  private get separator(): string {
    return isAnsiMode() ? '*' : '•';
  }

  constructor(options: ConsoleReporterOptions = {}) {
    this.usesDefaultPrint = options.print === undefined;
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

  hasCompletedRun(): boolean {
    return this.runCompleted;
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

    // Jasmine may rebuild the tree while it plans execution. The final report
    // is the only place that should present its authoritative counts.
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
    // Watch/HMR can start a replacement Jasmine run before the preceding run
    // reached jasmineDone. Never let its metadata become rows of that older
    // result table.
    this.closeAppendOnlyResultTable();
    this.startTime = Date.now();
    this.runStartedAt = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
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
    this.runCompleted = false;
    this.resultPanelLines = null;
    this.summaryStats = null;
    this.completedSuiteIds = new Set();
    this.appendOnlyResultTable = false;
    this.appendedResultSuiteIds.clear();

    this.buildSuiteTree(config);
    this.setupInterruptHandler();

    this.printEnvironmentInfo();
    this.startResultView();
  }

  /** Facts shown under the "Test Runner Started" title: scope, order, start time. */
  private runHeaderLines(config: any): string[] {
    const specCount = this.orderedSpecs?.length ?? config?.totalSpecsDefined ?? 0;
    const suiteCount = Math.max(0, this.suiteById.size - 1);
    const order = config?.order?.random ? 'random order' : 'sequential order';
    const seed = config?.order?.random && config?.order?.seed !== void 0
      ? `seed ${config.order.seed}`
      : null;
    const startedAt = this.runStartedAt || new Date().toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });

    const scope = `${specCount} spec${specCount === 1 ? '' : 's'} ${this.separator} ${suiteCount} suite${suiteCount === 1 ? '' : 's'}`;
    return [
      this.colored('white', scope),
      this.colored('gray', [order, seed, `started at ${startedAt}`].filter(Boolean).join(`  ${this.separator}  `)),
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

    // Preserve interactive feedback while the final report is assembled.
    // Passing suites are intentionally silent here — they're already listed
    // once, correctly, in the final SUITES summary panel. Printing a line per
    // passing suite here just duplicates that and drowns out real signal.
    // Pop from stack
    this.suiteStack.pop();
    this.currentSuite = this.suiteStack[this.suiteStack.length - 1] ?? null;
    if (this.appendOnlyResultTable) {
      this.appendCompletedResultSuite(suite);
    } else {
      this.scheduleResultViewUpdate();
    }
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

    this.resultPanelLines = [];
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
    } else {
      this.pendingSpecs = [];
    }

    this.calculateSuiteStatuses(this.rootSuite);
    const attentionLines = this.getAttentionLines();
    if (attentionLines.length > 0) {
      this.appendResultSection(
        'DEMANDING ATTENTION',
        attentionLines,
        'yellow',
      );
    }

    this.printSummary(totalTime);

    this.flushResultPanel();
    this.runCompleted = true;
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
    const hadResultView = this.resultView !== null;
    this.stopResultView();
    this.closeAppendOnlyResultTable();

    if (this.isTTY && hadResultView) {
      // Clear the status line (which is on the line above)
      this.print('\r\x1b[1A'); // Move up one line
      this.clearCurrentLine();  // Clear that line
      this.clearCurrentLine();  // Clear current line
      this.print('\n');
    }

    // Mark all unexecuted specs as skipped
    this.markUnexecutedAsSkipped();

    // Filter out stale specs before printing
    const actualFailedSpecs = this.failedSpecs.filter(s => s.status === 'failed' || s.overallStatus === 'failed');
    if (actualFailedSpecs.length > 0) {
      this.failedSpecs = actualFailedSpecs;
      this.printFailures();
    } else {
      this.failedSpecs = [];
    }

    this.printBox(ReporterMessages.testsInterrupted(), 'yellow');
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
    if (this.appendOnlyResultTable) return;
    if (this.resultView) {
      // The interactive result table grows on completed suites only. Keeping
      // mutable per-spec counters outside this frame lets the terminal append
      // a row exactly as the PREPARING panel does, instead of repainting a
      // full table for every spec callback.
      return;
    }
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
    return this.getSpecIndicators(suite.specs);
  }

  /**
   * Preserve the per-spec glyphs while they fit; large suites become a compact
   * outcome tally instead of wrapping a wall of dots across several rows.
   */
  private getSpecIndicators(specs: readonly TestSpec[]): string {
    const dots = specs.map((spec) => this.getSpecSymbol(spec)).join('');
    if (visibleWidth(dots) <= 28) return dots;

    const counts = new Map<string, number>();
    for (const spec of specs) {
      const symbol = this.getSpecSymbol(spec);
      if (symbol) counts.set(symbol, (counts.get(symbol) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([symbol, count]) => `${symbol} ${count}`)
      .join('  ');
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

  private resultRule(): string {
    return PANEL_RULE;
  }

  private appendResultSection(title: string, lines: string[], color: string): boolean {
    if (!this.resultPanelLines || lines.length === 0) return false;
    if (this.resultPanelLines.length > 0) this.resultPanelLines.push(this.resultRule());
    this.resultPanelLines.push(this.colored(['bold', color], title), ...lines);
    return true;
  }

  private flushResultPanel(): void {
    if (!this.resultPanelLines) return;
    if (this.appendOnlyResultTable) {
      this.appendResultTableTrailer(this.resultPanelLines);
      this.appendOnlyResultTable = false;
      process.stdout.write('\n');
      this.resultPanelLines = null;
      return;
    }
    if (this.resultView) {
      // Do not repaint an indefinitely growing table at completion: cursor-up
      // sequences cannot reach rows that have scrolled out of the terminal's
      // viewport. Appending the final sections preserves one continuous table.
      this.resultView.update(this.getResultViewText(this.resultPanelLines));
      this.stopResultView(true);
      process.stdout.write('\n');
    } else {
      const panel = renderTerminalPanel(
        'TEST RESULTS',
        this.resultPanelLines,
        this.getRunTone(),
        this.showColors,
      );
      this.print(panel + '\n');
    }
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
    const lines: string[] = [];
    let globalIndex = 0;

    const renderSpec = (spec: any) => {
      globalIndex++;
      const durationSuffix = this.formatSpecDuration(spec);
      lines.push(this.colored('white', `${globalIndex}. ${spec.fullName}`) + durationSuffix);
      const expectations = spec.failedExpectations ?? [];
      for (const expectation of expectations) {
        const messageLines = wrapLine(
          this.formatFailureMessage(expectation.message),
          this.lineWidth - 4,
          0,
        );
        lines.push(...messageLines.map(line => this.colored('brightRed', `${SYMBOLS.cross} ${line}`)));
        if (expectation.stack) {
          lines.push(...wrapLine(this.prepareStackTrace(expectation.stack), this.lineWidth - 4, 0)
            .map(line => this.colored('gray', line)));
        }
      }
      if (expectations.length === 0 && !(spec.passedExpectations?.length > 0)) {
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
    this.print(renderTerminalPanel('FAILURES', lines, 'red', this.showColors) + '\n');
  }

  private runMetadataLines(config: any): string[] {
    return this.runHeaderLines(config);
  }

  private startResultView(): void {
    // Browser and isolated Node runners can forward output through a pipe.
    // That stream is not marked as a TTY even though the receiving terminal
    // supports ANSI and Ink panels, so do not let the intermediate isTTY flag
    // suppress the result table.
    if (!this.showColors || !this.usesDefaultPrint) return;
    // Unlike preparation, this table can contain hundreds of suites. Once a
    // table is taller than the viewport, ANSI cursor-up cannot reliably reach
    // its first row. Keep it append-only rather than emitting replacement
    // frames that become duplicate tables in scrollback.
    this.appendOnlyResultTable = true;
    this.appendedResultSuiteIds.clear();
    const panelLines = renderTerminalPanel(
      'TEST RESULTS',
      [...this.runMetadataLines(this.config), PANEL_RULE],
      this.getRunTone(),
      this.showColors,
    ).split('\n');
    const bottom = this.lastRenderedPanelLine(panelLines);
    const bottomIndex = panelLines.lastIndexOf(bottom);
    // Leave the bottom border at the cursor. Each appended suite replaces
    // only this line, exactly like the growing PREPARING panel.
    process.stdout.write(panelLines.slice(0, bottomIndex + 1).join('\n'));
  }

  private appendCompletedResultSuite(suite: TestSuite): void {
    if (this.appendedResultSuiteIds.has(suite.id)) return;
    this.appendedResultSuiteIds.add(suite.id);
    this.replaceResultTableBottom([this.getResultSuiteLine(suite)]);
  }

  private appendResultTableTrailer(lines: readonly string[]): void {
    const nonEmptyLines = lines.filter((line) => line !== '');
    const trailer = nonEmptyLines.length > 0 && nonEmptyLines[0] !== PANEL_RULE
      ? [PANEL_RULE, ...nonEmptyLines]
      : nonEmptyLines;
    this.replaceResultTableBottom(trailer);
  }

  private closeAppendOnlyResultTable(): void {
    if (!this.appendOnlyResultTable) return;
    process.stdout.write(`\r\x1b[2K\r${this.resultTableBottom()}\n`);
    this.appendOnlyResultTable = false;
  }

  private replaceResultTableBottom(lines: readonly string[]): void {
    const rows = lines.map((line) => this.renderResultTableRow(line)).join('\n');
    process.stdout.write(`\r\x1b[2K\r${rows}\n${this.resultTableBottom()}`);
  }

  private resultTableBottom(): string {
    const frame = renderTerminalPanel(' ', [], this.getRunTone(), this.showColors).split('\n');
    return this.lastRenderedPanelLine(frame);
  }

  private lastRenderedPanelLine(lines: readonly string[]): string {
    for (let index = lines.length - 1; index >= 0; index--) {
      if (lines[index] !== '') return lines[index];
    }
    return '';
  }

  private renderResultTableRow(line: string): string {
    // The third body row has the exact same width, borders, and ANSI styling
    // as a row in the full table; it avoids duplicating Ink's layout rules.
    // Ink omits an empty Text node. A space keeps separator rows in the body
    // so index 3 remains a content row rather than the panel's bottom border.
    const content = line === '' ? ' ' : line;
    const frame = renderTerminalPanel(' ', [' ', content], this.getRunTone(), this.showColors).split('\n');
    return frame[3] ?? line;
  }

  private updateResultView(): void {
    this.resultView?.update(this.getResultViewText());
  }

  /** Coalesce per-spec callbacks into a responsive, bounded redraw rate. */
  private scheduleResultViewUpdate(): void {
    if (!this.resultView || this.resultUpdateTimer) return;
    this.resultUpdateTimer = setTimeout(() => {
      this.resultUpdateTimer = null;
      this.updateResultView();
    }, 75);
  }

  private stopResultView(preserve = false): void {
    if (this.resultUpdateTimer) {
      clearTimeout(this.resultUpdateTimer);
      this.resultUpdateTimer = null;
    }
    if (!this.resultView) return;
    this.resultView.stop(preserve);
    this.resultView = null;
  }

  private getResultViewText(trailer: readonly string[] = []): string {
    const nonEmptyTrailer = trailer.filter((line) => line !== '');
    const separatedTrailer =
      nonEmptyTrailer.length > 0 && nonEmptyTrailer[0] !== PANEL_RULE
        ? [PANEL_RULE, ...nonEmptyTrailer]
        : nonEmptyTrailer;
    const lines = [
      ...this.runMetadataLines(this.config),
      PANEL_RULE,
      ...this.getResultSuiteLines(),
      ...separatedTrailer,
    ];
    return renderTerminalPanel(
      'TEST RESULTS',
      lines,
      this.getRunTone(),
    );
  }

  /** The interactive frame is itself a compact result signal. */
  private getRunTone(): 'green' | 'yellow' | 'red' {
    if (this.failureCount > 0 || this.globalFailures.length > 0) return 'red';
    if (this.pendingSpecs.length > 0) return 'yellow';
    return 'green';
  }

  private getResultSuiteLines(): string[] {
    const completedIds = [...this.completedSuiteIds];

    if (completedIds.length === 0) {
      return [this.colored('gray', 'Waiting for the first test result...')];
    }

    const lines = completedIds.flatMap((id) => {
      const suite = this.suiteById.get(id);
      return suite ? [this.getResultSuiteLine(suite)] : [];
    });
    return lines;
  }

  private getResultSuiteLine(suite: TestSuite): string {
    const symbols = this.getSpecDots(suite);
    const suffix = suite.specs.length > 0
      ? this.colored('gray', ` ${this.separator} ${suite.specs.length} spec${suite.specs.length === 1 ? '' : 's'}`)
      : '';
    // Leave one spare cell: Ink may wrap a Text node that lands exactly on
    // its content boundary in Windows terminals.
    const contentWidth = Math.max(31, this.lineWidth - 5);
    const availableName = Math.max(1, contentWidth - visibleWidth(suffix) - visibleWidth(symbols) - 1);
    const name = visibleWidth(this.suiteDisplayName(suite)) > availableName
      ? this.truncateString(this.suiteDisplayName(suite), availableName)
      : this.suiteDisplayName(suite);
    const padding = symbols
      ? ' '.repeat(Math.max(1, contentWidth - visibleWidth(name) - visibleWidth(suffix) - visibleWidth(symbols)))
      : '';
    return `${name}${suffix}${padding}${symbols}`;
  }

  /**
   * Jasmine can embed an entire compiled module in an assertion's actual
   * value. Keep both sides of the comparison visible, but never let that
   * diagnostic consume the report with generated source.
   */
  private formatFailureMessage(message: unknown): string {
    const normalized = normalize(String(message ?? 'Unknown expectation failure.'));
    const comparison = normalized.match(/^Expected '([\s\S]+)' to ([\s\S]+)$/);

    if (!comparison) {
      return this.truncateString(normalized, Math.max(120, this.lineWidth * 2));
    }

    const [, actual, expectation] = comparison;
    const preview = (value: string, limit: number) => {
      if (value.length <= limit) return value;
      const omitted = value.length - limit;
      return `${value.slice(0, limit)}... [${omitted.toLocaleString()} chars omitted]`;
    };

    return `Expected '${preview(actual, 72)}' to ${preview(expectation, 96)}`;
  }

  private printGlobalFailures() {
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
    this.print(renderTerminalPanel('GLOBAL ERRORS', lines, 'red', this.showColors) + '\n');
  }

  private printPendingSpecs() {
    const lines = this.pendingSpecs.flatMap((spec, index) => {
      const headerLines = wrapLine(`${index + 1}. ${spec.fullName}`, this.lineWidth - 6, 0)
        .map(line => this.colored('brightYellow', `${SYMBOLS.skip} ${line}`));
      const reason = this.pendingReasonText(spec);
      const reasonLines = wrapLine(reason, this.lineWidth - 8, 0)
        .map(line => this.colored('dim', `    ${line}`));
      return [...headerLines, ...reasonLines];
    });
    if (this.appendResultSection('SKIPPED', lines, 'yellow')) return;
    this.print(renderTerminalPanel('SKIPPED', lines, 'yellow', this.showColors) + '\n');
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
    if (stats.pending > 0) counts.push(`${stats.pending} skipped`);

    return [
      ...(counts.length > 0 ? [this.colored('white', counts.join(` ${this.separator} `))] : []),
      this.colored('gray', `finished in ${stats.totalTime.toFixed(3)}s`),
    ];
  }

  private calculateSuiteStatuses(suite: TestSuite): TestStatus {
    const childStatuses = suite.children.map(child => this.calculateSuiteStatuses(child));

    for (const spec of suite.specs) {
      if (!spec.status) spec.status = 'skipped';
      else if (spec.status === 'running') spec.status = 'incomplete';
    }

    const specs = suite.specs;
    const failedCount = specs.filter(s => s.status === 'failed').length;
    const pendingCount = specs.filter(s => s.status === 'pending').length;
    const incompleteCount = specs.filter(s => s.status === 'incomplete' || s.status === 'running').length;
    const skippedCount = specs.filter(s => s.status === 'skipped').length;

    if (failedCount > 0 || childStatuses.includes('failed')) {
      suite.status = 'failed';
    } else if (incompleteCount > 0 || childStatuses.includes('incomplete')) {
      suite.status = 'incomplete';
    } else if (pendingCount > 0 || childStatuses.includes('pending') || childStatuses.includes('running')) {
      suite.status = 'pending';
    } else if (skippedCount > 0) {
      suite.status = 'skipped';
    } else {
      suite.status = 'passed';
    }

    return suite.status;
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
    this.print(renderTerminalPanel(
      replacePlaceholders(text),
      detailLines,
      color,
      this.showColors,
    ) + '\n');
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
    // The final status box prints right after this and reuses the counts.
    this.summaryStats = { passed, failed, pending, totalTime };


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
      parts.push(this.colored('brightYellow', `${SYMBOLS.skip} Skipped: ${pending}`));

    if (incomplete > 0)
      parts.push(this.colored('cyan', `${SYMBOLS.incomplete} Incomplete: ${incomplete}`));

    if (skipped > 0)
      parts.push(this.colored('gray', `${SYMBOLS.skip} Skipped: ${skipped}`));

    if (notRun > 0)
      parts.push(this.colored('gray', `${SYMBOLS.not_run} Not Run: ${notRun}`));

    const completionRecap = [
      `${passed} passed`,
      ...(failed > 0 ? [`${failed} failed`] : []),
      ...(pending > 0 ? [`${pending} skipped`] : []),
      `finished in ${duration}`,
    ].join(` ${this.separator} `);

    const summaryLines = [
      ...(statsParts.length > 0 ? [statsParts.join(`  ${this.separator}  `)] : []),
      this.colored('gray', completionRecap),
      ...(slowestLine ? [this.colored('gray', slowestLine)] : []),
    ];
    if (this.appendResultSection(
      'TEST SUMMARY',
      summaryLines,
      failed > 0 ? 'red' : pending > 0 ? 'yellow' : 'green',
    )) return;

    this.print(renderTerminalPanel(
      'TEST SUMMARY',
      summaryLines,
      failed > 0 ? 'red' : pending > 0 ? 'yellow' : 'green',
      this.showColors,
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
      jasmine: getJasmineVersion(),
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

  /** Two compact facts make the runtime card easy to scan without losing data. */
  private factPair(
    leftLabel: string,
    leftValue: string,
    rightLabel: string,
    rightValue: string,
  ): string {
    const labelWidth = 12;
    const contentWidth = Math.max(40, this.lineWidth - 4);
    const valueWidth = Math.max(
      10,
      Math.floor((contentWidth - (labelWidth * 2) - 4) / 2),
    );
    const shorten = (value: string) =>
      value.length > valueWidth
        ? `...${value.slice(-(valueWidth - 3))}`
        : value;

    return `${leftLabel.padEnd(labelWidth)} ${shorten(leftValue).padEnd(valueWidth)}  ${rightLabel.padEnd(labelWidth)} ${shorten(rightValue)}`;
  }

  private printEnvironmentInfo() {
    if (!this.envInfo) this.envInfo = this.gatherEnvironmentInfo();
    const lines = [
      this.factPair('Node.js', this.envInfo.node, 'Jasmine', this.envInfo.jasmine),
      this.factPair('Platform', this.envInfo.platform, 'Architecture', this.envInfo.arch),
      this.factPair('Process', String(this.envInfo.pid), 'Uptime', this.envInfo.uptime),
      this.factRow('Memory', `${this.envInfo.memory} heap`),
      this.factRow('Directory', this.envInfo.cwd),
    ];
    this.print(renderTerminalPanel('ENVIRONMENT', lines, 'blue', this.showColors) + '\n');
    if (this.envInfo.userAgent) this.printUserAgentInfo(this.envInfo.userAgent);
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
    const lines = [
      this.factRow('Browser', `${browserName} ${browserVersion}`.trimEnd()),
      this.factRow('User agent', userAgent.userAgent),
    ];
    if (userAgent.platform) lines.push(this.factRow('Platform', userAgent.platform));
    if (userAgent.vendor) lines.push(this.factRow('Vendor', userAgent.vendor));
    if (userAgent.language) lines.push(this.factRow('Language', userAgent.language));
    if (userAgent.languages?.length > 0) lines.push(this.factRow('Languages', userAgent.languages.join(', ')));
    this.print(renderTerminalPanel('BROWSER / NAVIGATOR', lines, 'blue', this.showColors) + '\n');
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

    const parts: string[] = [];
    if (config.stopOnSpecFailure !== void 0) {
      parts.push(`Fail Fast: ${config.stopOnSpecFailure ? `${SYMBOLS.checked} enabled` : `${SYMBOLS.cross} disabled`}`);
    }
    if (config.stopSpecOnExpectationFailure !== void 0) {
      parts.push(`Stop Spec: ${config.stopSpecOnExpectationFailure ? `${SYMBOLS.checked} enabled` : `${SYMBOLS.cross} disabled`}`);
    }
    if (config.failSpecWithNoExpectations !== void 0) {
      parts.push(`No Expect: ${config.failSpecWithNoExpectations ? `${SYMBOLS.checked} fail` : `${SYMBOLS.cross} pass`}`);
    }

    // The interactive result table already owns the run metadata and suite
    // rows. Repeating them here would turn the completion update into a
    // second copy of the table.
    const liveResultTable = this.resultView !== null || this.appendOnlyResultTable;
    const suiteLines = includeSuites && !liveResultTable
      ? this.getSuiteSummaryLines()
      : [];
    const lines = [
      ...(liveResultTable ? [] : this.runMetadataLines(config)),
      ...(parts.length > 0 ? [parts.join(`  ${this.separator}  `)] : []),
      ...(suiteLines.length > 0 ? [PANEL_RULE, ...suiteLines] : []),
    ];

    if (this.resultPanelLines) {
      if (liveResultTable && lines.length > 0) {
        this.resultPanelLines.push(PANEL_RULE, ...lines);
      } else {
        this.resultPanelLines.push(...lines);
      }
      return;
    }
    this.print(renderTerminalPanel('TEST RUN', lines, 'magenta', this.showColors) + '\n');
  }

  private getAttentionLines(): string[] {
    const lines: string[] = [];
    const visit = (suite: TestSuite, depth: number) => {
      const status = suite.status ?? 'skipped';
      const hasAttention = ['incomplete', 'skipped'].includes(status);
      if (hasAttention) {
        const tone = status === 'incomplete' ? 'cyan' : 'gray';
        const label = status === 'incomplete' ? 'INCOMPLETE' : status.toUpperCase();
        const counts = suite.specs.length > 0
          ? ` ${this.separator} ${suite.specs.length} spec${suite.specs.length === 1 ? '' : 's'}`
          : '';
        lines.push(`${'  '.repeat(Math.min(depth, 6))}${this.colored(tone, label.padEnd(10))} ${this.suiteDisplayName(suite)}${this.colored('gray', counts)}`);
      }
      for (const child of suite.children) visit(child, depth + 1);
    };

    for (const suite of this.rootSuite.children) visit(suite, 0);
    return lines;
  }

  private getSuiteSummaryLines(): string[] {
    const entries: Array<{ line: string; status: TestStatus; specCount: number }> = [];
    // The Ink panel consumes two border columns and two padding columns.
    // Keep the suite glyph column on this same line rather than relying on
    // Ink's edge-of-cell wrapping behavior.
    const contentWidth = Math.max(31, this.lineWidth - 5);
    const visit = (suite: TestSuite, depth: number) => {
      const suiteSpecs = this.getSuiteSpecs(suite);
      const symbols = this.getSpecIndicators(suiteSpecs);
      const description = this.suiteDisplayName(suite);
      const status = suite.status ?? this.determineSuiteStatusFromInternal(suite);
      const indent = '  '.repeat(Math.min(depth, 6));
      const prefix = indent;
      const specCountSuffix = suiteSpecs.length > 0
        ? this.colored('gray', ` ${this.separator} ${suiteSpecs.length} spec${suiteSpecs.length === 1 ? '' : 's'}`)
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

      entries.push({
        line: `${prefix}${name}${specCountSuffix}${padding}${symbols}`,
        status,
        specCount: suiteSpecs.length,
      });
    };

    for (const suite of this.rootSuite.children) visit(suite, 0);

    return entries.map((entry) => entry.line);

  }

  /** Collapse nested suites into their nearest displayed parent. */
  private getSuiteSpecs(suite: TestSuite): TestSpec[] {
    return [
      ...suite.specs,
      ...suite.children.flatMap((child) => this.getSuiteSpecs(child)),
    ];
  }

  private suiteDisplayName(suite: TestSuite): string {
    if (typeof suite.description === 'string' && suite.description) return suite.description;
    if (typeof suite.fullName === 'string' && suite.fullName) return suite.fullName;
    return suite.id || '(unnamed suite)';
  }
}
