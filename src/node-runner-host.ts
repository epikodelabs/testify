import * as fs from 'fs';
import { pathToFileURL } from 'url';
import { norm } from './utils';
import type { TestSelector } from './test-selection';
import type {
  FileListRow,
  SuiteListRow,
  TestListRow,
} from './catalog-query';
import type {
  ExecutionResult,
} from './execution-result';

export interface NodeRunnerModule {
  runTests(
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<number>;

  runTest?(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<number>;

  runSuite?(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<number>;

  runFile?(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<number>;

  getCatalog?(): unknown;
  getSession?(): unknown;
  getStats?(): {
    specs: number;
    suites: number;
    files: number;
  };
  getIndex?(): unknown;
  getLastExecutionResult?(): ExecutionResult | null;
  listTests?(): TestListRow[];
  listSuites?(): SuiteListRow[];
  listFiles?(): FileListRow[];
  findTests?(selector: string | RegExp): TestListRow[];
  findSuites?(selector: string | RegExp): SuiteListRow[];
  findFiles?(selector: string | RegExp): FileListRow[];
}

export class NodeRunnerHost {
  private runnerModule:
    NodeRunnerModule | null = null;

  constructor(
    private readonly runnerFile: string,
  ) {}

  write(source: string): void {
    fs.writeFileSync(
      this.runnerFile,
      source,
    );
  }

  async load(
    cacheBust = true,
  ): Promise<NodeRunnerModule> {
    const fileUrl =
      pathToFileURL(
        this.runnerFile,
      ).href;

    const moduleUrl =
      cacheBust
        ? `${fileUrl}?t=${Date.now()}`
        : fileUrl;

    this.runnerModule =
      await import(moduleUrl);

    return this.runnerModule;
  }

  async execute(
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<number> {
    const runner =
      this.runnerModule ??
      await this.load();

    return runner.runTests(
      reporter,
      selector,
    );
  }

  async run(
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<number> {
    return this.execute(
      reporter,
      selector,
    );
  }

  async runSpec(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<number> {
    const runner =
      this.runnerModule ??
      await this.load();

    if (runner.runTest) {
      return runner.runTest(
        reporter,
        selector,
      );
    }

    return runner.runTests(
      reporter,
      { spec: selector },
    );
  }

  async runSuite(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<number> {
    const runner =
      this.runnerModule ??
      await this.load();

    if (runner.runSuite) {
      return runner.runSuite(
        reporter,
        selector,
      );
    }

    return runner.runTests(
      reporter,
      { suite: selector },
    );
  }

  async runFile(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<number> {
    const runner =
      this.runnerModule ??
      await this.load();

    if (runner.runFile) {
      return runner.runFile(
        reporter,
        selector,
      );
    }

    return runner.runTests(
      reporter,
      { file: selector },
    );
  }

  getSession(): unknown {
    return this.runnerModule
      ?.getSession?.();
  }

  getStats(): {
    specs: number;
    suites: number;
    files: number;
  } {
    return this.runnerModule
      ?.getStats?.() ?? {
        specs: 0,
        suites: 0,
        files: 0,
      };
  }

  getIndex(): unknown {
    return this.runnerModule
      ?.getIndex?.();
  }

  getLastExecutionResult():
    ExecutionResult | null {
    return this.runnerModule
      ?.getLastExecutionResult?.() ??
      null;
  }

  listTests(): TestListRow[] {
    return this.runnerModule
      ?.listTests?.() ??
      [];
  }

  listSuites(): SuiteListRow[] {
    return this.runnerModule
      ?.listSuites?.() ??
      [];
  }

  listFiles(): FileListRow[] {
    return this.runnerModule
      ?.listFiles?.() ??
      [];
  }

  findTests(
    selector: string | RegExp,
  ): TestListRow[] {
    return this.runnerModule
      ?.findTests?.(selector) ??
      [];
  }

  findSuites(
    selector: string | RegExp,
  ): SuiteListRow[] {
    return this.runnerModule
      ?.findSuites?.(selector) ??
      [];
  }

  findFiles(
    selector: string | RegExp,
  ): FileListRow[] {
    return this.runnerModule
      ?.findFiles?.(selector) ??
      [];
  }

  clear(): void {
    this.runnerModule = null;
  }

  get loadedModule():
    | NodeRunnerModule
    | null {
    return this.runnerModule;
  }

  get file(): string {
    return norm(
      this.runnerFile,
    );
  }
}
