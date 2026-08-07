import util from 'util';
import { logger } from './logger';
import { wrapLine, visibleWidth, ANSI_FULL_REGEX, normalize } from './utils';
import { EXIT_CODES } from './exit-codes';
import { getMaxWidth, isAnsiMode } from './ansi-constants';
import { ReporterMessages } from './log-messages';
import { SYMBOLS, replacePlaceholders } from './symbols';
import type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';

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
}

export class ConsoleReporter {
  private print: (...args: any[]) => void;
  private showColors: boolean;
  private specCount: number;
  private executableSpecCount: number;
  private failureCount: number;
  private failedSpecs: any[];
  private pendingSpecs: any[];
  private ansi: Record<string, string>;
  private startTime: number;
  private config: any | null = null;
  private envInfo: EnvironmentInfo | null;
  private rootSuite: TestSuite;
  private currentSuite: TestSuite | null;
  private suiteStack: TestSuite[];
  private currentSpec: TestSpec | null;
  private suiteById: Map<string, TestSuite> = new Map();
  private specById: Map<string, TestSpec> = new Map();
  private get lineWidth(): number { return getMaxWidth(); }
  private interruptHandlersRegistered: boolean = false;
  private interrupted = false;
  private isTTY: boolean;
  private catalog: TestCatalog | null = null;

  constructor(options: ConsoleReporterOptions = {}) {
    this.print = (...args) => process.stdout.write(util.format(...args));
    this.showColors = options.showColors ?? this.detectColorSupport();
    this.isTTY = !isAnsiMode() && (process.stdout.isTTY ?? false);
    this.specCount = 0;
    this.executableSpecCount = 0;
    this.failureCount = 0;
    this.failedSpecs = [];
    this.pendingSpecs = [];
    this.startTime = 0;
    this.envInfo = null;
    this.rootSuite = this.createRootSuite();
    this.currentSuite = null;
    this.suiteStack = [this.rootSuite];
    this.currentSpec = null;
    this.ansi = {
      green: '\x1B[32m',
      brightGreen: '\x1B[92m',
      red: '\x1B[31m',
      brightRed: '\x1B[91m',
      yellow: '\x1B[33m',
      brightYellow: '\x1B[93m',
      blue: '\x1B[34m',
      brightBlue: '\x1B[94m',
      cyan: '\x1B[36m',
      brightCyan: '\x1B[96m',
      magenta: '\x1B[35m',
      gray: '\x1B[90m',
      white: '\x1B[97m',
      bold: '\x1B[1m',
      dim: '\x1B[2m',
      none: '\x1B[0m',
    };
  }

  setCatalog(catalog: TestCatalog): void {
    this.catalog = catalog;
    this.buildSuiteTreeFromCatalog(catalog);
  }

  getCatalog(): TestCatalog | null {
    return this.catalog;
  }

  getFailureCount(): number {
    return this.failureCount;
  }

  private detectColorSupport(): boolean {
    if (isAnsiMode()) return false;
    if (process.env.NO_COLOR) return false;
    if (process.env.FORCE_COLOR === '1' || process.env.FORCE_COLOR === 'true' || process.env.FORCE_COLOR) return true;
    return process.stdout.isTTY ?? false;
  }

  private createRootSuite(): TestSuite {
    return {
      id: this.catalog?.rootSuiteId ?? 'suite0',
      description: 'Jasmine__TopLevel__Suite',
      fullName: '',
      specs: [],
      children: [],
      status: 'skipped',
    };
  }

  private toReporterSuite(source: TestCatalogSuite): TestSuite {
    return {
      id: source.id,
      description: this.normalizeDescription(source.description ?? source.id),
      fullName: source.fullName ?? source.id,
      specs: [],
      children: [],
      status: 'skipped',
    };
  }

  private toReporterSpec(source: TestCatalogSpec): TestSpec {
    return {
      id: source.id,
      description: source.description ?? source.id,
      fullName: source.fullName ?? source.id,
      status: 'skipped',
    };
  }

  private buildSuiteTreeFromCatalog(catalog: TestCatalog): void {
    this.rootSuite = this.createRootSuite();
    this.suiteById.clear();
    this.specById.clear();
    this.suiteStack = [this.rootSuite];
    this.currentSuite = null;
    this.currentSpec = null;

    this.suiteById.set(this.rootSuite.id, this.rootSuite);

    for (const suiteConfig of catalog.suites) {
      const suite = this.toReporterSuite(suiteConfig);
      this.suiteById.set(suite.id, suite);
    }

    for (const suiteConfig of catalog.suites) {
      const suite = this.suiteById.get(suiteConfig.id);
      if (!suite) continue;

      const parent = suiteConfig.parentSuiteId
        ? this.suiteById.get(suiteConfig.parentSuiteId)
        : this.rootSuite;

      const parentSuite = parent ?? this.rootSuite;
      suite.parent = parentSuite;
      parentSuite.children.push(suite);
    }

    for (const specConfig of catalog.specs) {
      const spec = this.toReporterSpec(specConfig);
      this.specById.set(spec.id, spec);

      const parentSuite = specConfig.suiteId
        ? this.suiteById.get(specConfig.suiteId)
        : undefined;

      (parentSuite ?? this.rootSuite).specs.push(spec);
    }

    logger.println(
      ReporterMessages.suiteTreeBuilt(
        catalog.suites.length,
        catalog.specs.length,
      ),
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

  userAgent(agentInfo: any, suitesOrCatalog: any, specs?: any) {
    if (
      suitesOrCatalog &&
      Array.isArray(suitesOrCatalog.suites) &&
      Array.isArray(suitesOrCatalog.specs)
    ) {
      this.setCatalog(suitesOrCatalog as TestCatalog);
    } else if (!this.catalog && Array.isArray(suitesOrCatalog) && Array.isArray(specs)) {
      // Compatibility bridge for v1 callers. Convert legacy arrays once, without
      // guessing hierarchy here; callers should migrate to passing TestCatalog.
      this.setCatalog({
        suites: suitesOrCatalog.map((suite: any) => ({
          id: suite.id,
          description: suite.description ?? suite.id,
          fullName: suite.fullName ?? suite.id,
          parentSuiteId: suite.parentSuiteId,
          file: suite.file,
        })),
        specs: specs.map((spec: any) => ({
          id: spec.id,
          description: spec.description ?? spec.id,
          fullName: spec.fullName ?? spec.id,
          suiteId: spec.suiteId,
          file: spec.file,
        })),
      });
    }

    if (agentInfo) {
      this.envInfo = {
        ...this.gatherEnvironmentInfo(),
        userAgent: agentInfo,
      };
    }
  }

  jasmineStarted(suiteInfo: any) {
    this.startTime = Date.now();
    this.specCount = suiteInfo?.totalSpecsDefined ?? this.catalog?.specs.length ?? 0;
    this.executableSpecCount = suiteInfo?.totalTime ? this.specCount : this.specCount;
    this.failureCount = 0;
    this.failedSpecs = [];
    this.pendingSpecs = [];
  }

  suiteStarted(result: any) {
    const suite = this.suiteById.get(result.id);
    if (!suite) return;

    suite.status = 'running';
    this.currentSuite = suite;
    this.suiteStack.push(suite);
  }

  specStarted(result: any) {
    const spec = this.specById.get(result.id);
    if (!spec) return;

    spec.status = 'running';
    this.currentSpec = spec;
  }

  specDone(result: any) {
    const spec = this.specById.get(result.id);
    if (!spec) return;

    spec.status = result.status;
    spec.failedExpectations = result.failedExpectations;
    spec.pendingReason = result.pendingReason;

    if (result.status === 'failed') {
      this.failureCount += 1;
      this.failedSpecs.push(result);
    } else if (result.status === 'pending') {
      this.pendingSpecs.push(result);
    }

    this.currentSpec = null;
  }

  suiteDone(result: any) {
    const suite = this.suiteById.get(result.id);
    if (!suite) return;

    suite.status = result.status;
    if (this.suiteStack[this.suiteStack.length - 1]?.id === suite.id) {
      this.suiteStack.pop();
    }
    this.currentSuite = this.suiteStack[this.suiteStack.length - 1] ?? null;
  }

  testsAborted(
    _message?: string,
  ): number {
    if (!this.interrupted) {
      this.interrupted = true;

      this.print(
        this.colored(
          'brightYellow',
          `
  ${ReporterMessages.testsInterrupted()}
`,
        ),
      );
    }

    return EXIT_CODES.SIGINT;
  }

  jasmineDone(result: any) {
    const duration = Date.now() - this.startTime;
    const failed = this.failureCount;
    const pending = this.pendingSpecs.length;

    if (result?.overallStatus === 'failed' || failed > 0) {
      this.print(this.colored('brightRed', `\n  ${SYMBOLS.cross_mark} ${failed} failed\n`));
    } else if (pending > 0) {
      this.print(this.colored('brightYellow', `\n  ${SYMBOLS.pending} ${pending} pending\n`));
    } else {
      this.print(this.colored('brightGreen', `\n  ${SYMBOLS.check_mark} All specs passed\n`));
    }

    this.print(this.colored('gray', `  ${duration}ms\n`));
  }

  private colored(style: string | string[], text: string): string {
    if (!this.showColors) return text.replace(ANSI_FULL_REGEX, '');
    const styles = Array.isArray(style) ? style : [style];
    const seq = styles.map(s => this.ansi[s] ?? '').join('');
    return `${seq}${text}${this.ansi.none}`;
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
}
