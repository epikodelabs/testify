import * as fs from 'fs';
import { pathToFileURL } from 'url';
import { norm } from './utils';
import type { TestSelector } from './test-selection';
import type {
  ExecutionResult,
} from './execution-result';

export interface NodeRunnerModule {
  run(
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<ExecutionResult>;
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

    console.error(
      '[Testify debug] importing generated runner:',
      moduleUrl,
    );

    try {
      const runnerModule =
        await import(
          moduleUrl
        ) as NodeRunnerModule;

      console.error(
        '[Testify debug] generated runner exports:',
        Object.keys(
          runnerModule,
        ).sort(),
      );

      this.runnerModule =
        runnerModule;

      return runnerModule;
    } catch (error) {
      console.error(
        '[Testify debug] generated runner import failed:',
        error instanceof Error
          ? error.stack ??
            error.message
          : error,
      );

      throw error;
    }
  }

  async run(
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<ExecutionResult> {
    const runner =
      this.runnerModule ??
      await this.load();

    return runner.run(
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
