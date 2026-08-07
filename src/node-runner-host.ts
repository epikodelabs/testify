import * as fs from 'fs';
import { pathToFileURL } from 'url';
import { norm } from './utils';
import type { TestSelector } from './test-selection';

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
