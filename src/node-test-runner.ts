import type {
  TestSelector,
} from './test-selection';
import type {
  ExecutionResult,
} from './execution-result';
import type {
  ViteJasmineConfig,
} from './vite-jasmine-config';
import {
  ConsoleReporter,
} from './console-reporter';
import {
  logger,
} from './logger';
import {
  NodeRunnerMessages,
} from './log-messages';
import {
  NodeArtifactHost,
} from './node-artifact-host';
import {
  NodeRuntimeHost,
} from './node-runtime-host';
import {
  NodeExecutionHost,
} from './node-execution-host';
import {
  CoverageHost,
} from './coverage-host';

export interface TestRunnerOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  reporter?: jasmine.CustomReporter;
  file?: string;
  coverage?: boolean;
  suppressConsoleLogs?: boolean;
  selector?: TestSelector;
}

export class NodeTestRunner {
  private readonly reporter:
    jasmine.CustomReporter;

  private readonly artifacts:
    NodeArtifactHost;

  private readonly execution:
    NodeExecutionHost;

  private isRunning = false;

  constructor(
    config: ViteJasmineConfig,
    private readonly options:
      TestRunnerOptions = {},
  ) {
    this.reporter =
      options.reporter ??
      new ConsoleReporter();

    this.artifacts =
      new NodeArtifactHost(
        config,
      );

    this.execution =
      new NodeExecutionHost(
        this.artifacts,
        new NodeRuntimeHost(),
        new CoverageHost(
          !!options.coverage,
        ),
      );
  }

  generateTestRunner(): void {
    this.artifacts.generate();
  }

  async start():
    Promise<ExecutionResult> {
    if (this.isRunning) {
      logger.println(
        NodeRunnerMessages
          .testProcessAlreadyRunning(),
      );

      throw new Error(
        'Test process already running',
      );
    }

    this.isRunning = true;

    try {
      logger.println(
        NodeRunnerMessages
          .startingTestRunner(),
      );

      return await this.execution
        .execute(
          this.reporter,
          {
            cwd: this.options.cwd,
            env: this.options.env,
            file: this.options.file,
            suppressConsoleLogs:
              this.options
                .suppressConsoleLogs,
            selector:
              this.options.selector,
          },
        );
    } catch (error: unknown) {
      const details =
        error instanceof Error
          ? error.stack ??
            error.message
          : String(error);

      logger.println(
        NodeRunnerMessages
          .testExecutionError(
            details,
          ),
      );

      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    this.artifacts.clear();
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }
}