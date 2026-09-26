import type {
  TestSelector,
} from './test-selection';
import type {
  ExecutionGlobalFailure,
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
  private readonly selector: TestSelector | undefined;
  private readonly reporter:
    jasmine.CustomReporter;

  private externalGlobalFailures:
    ExecutionGlobalFailure[] = [];

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
    this.selector = options.selector ?? config.selector;
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

  recordGlobalFailure(
    failure: ExecutionGlobalFailure,
  ): void {
    const signature =
      this.globalFailureSignature(
        failure,
      );

    if (
      !this.externalGlobalFailures.some(
        (candidate) =>
          this.globalFailureSignature(
            candidate,
          ) === signature,
      )
    ) {
      this.externalGlobalFailures.push(
        failure,
      );
    }

    const reporter =
      this.reporter as jasmine.CustomReporter & {
        recordGlobalFailure?: (
          failure: ExecutionGlobalFailure,
        ) => void;
      };

    reporter.recordGlobalFailure?.(
      failure,
    );
  }

  private globalFailureSignature(
    failure: ExecutionGlobalFailure,
  ): string {
    return [
      String(
        failure.globalErrorType ?? '',
      ),
      String(failure.message ?? ''),
      String(failure.stack ?? ''),
    ].join('\n@@\n');
  }

  private mergeExternalGlobalFailures(
    result: ExecutionResult,
  ): void {
    const globalFailures =
      Array.isArray(result.globalFailures)
        ? [...result.globalFailures]
        : [];

    for (
      const failure
      of this.externalGlobalFailures
    ) {
      const signature =
        this.globalFailureSignature(
          failure,
        );

      if (
        !globalFailures.some(
          (candidate) =>
            this.globalFailureSignature(
              candidate,
            ) === signature,
        )
      ) {
        globalFailures.push(failure);
      }
    }

    result.globalFailures =
      globalFailures;
    this.externalGlobalFailures = [];
  }

  async start():
    Promise<ExecutionResult> {
    if (this.isRunning) {
      logger.error(
        NodeRunnerMessages
          .testProcessAlreadyRunning(),
      );

      throw new Error(
        'Test process already running',
      );
    }

    this.isRunning = true;

    try {
      logger.preparationStep(
        'EXECUTE',
        NodeRunnerMessages
          .startingTestRunner(),
      );
      logger.flushPreparation();

      const result =
        await this.execution
          .run(
            this.reporter,
            {
              cwd: this.options.cwd,
              env: this.options.env,
              file: this.options.file,
              suppressConsoleLogs:
                this.options
                  .suppressConsoleLogs,
              selector:
                this.selector,
            },
          );

      this.mergeExternalGlobalFailures(
        result,
      );

      return result;
    } catch (error: unknown) {
      this.externalGlobalFailures = [];

      const details =
        error instanceof Error
          ? error.stack ??
            error.message
          : String(error);

      logger.error(
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