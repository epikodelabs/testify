import type {
  ExecutionResult,
} from './execution-result';
import {
  applyExecutionExitCode,
} from './cli-result-adapter';
import {
  EXIT_CODES,
  getSignalExitCode,
} from './exit-codes';
import {
  NodeTestRunner,
} from './node-test-runner';
import {
  NodeProcessHost,
} from './node-process-host';
import {
  NodeRunnerMessages,
} from './log-messages';
import { logger } from './logger';

export async function runNodeCli(
  runner: NodeTestRunner,
): Promise<ExecutionResult> {
  let capturedProcessFailure = false;

  const recordProcessFailure = (
    globalErrorType: 'unhandledRejection' | 'uncaughtException',
    error: unknown,
  ) => {
    capturedProcessFailure = true;

    runner.recordGlobalFailure({
      globalErrorType,
      message:
        error instanceof Error
          ? error.message || String(error)
          : String(error),
      ...(
        error instanceof Error && error.stack
          ? { stack: error.stack }
          : {}
      ),
    });
  };

  const processHost =
    new NodeProcessHost({
      onUnhandledRejection(error) {
        recordProcessFailure(
          'unhandledRejection',
          error,
        );
      },

      onUncaughtException(error) {
        recordProcessFailure(
          'uncaughtException',
          error,
        );
      },

      onSignal(signal) {
        logger.println(
          NodeRunnerMessages
            .caughtSignal(
              signal,
            ),
        );

        process.exitCode =
          getSignalExitCode(
            signal,
          );

        void runner.stop();
      },
    });

  processHost.attach();

  try {
    const result =
      await runner.start();

    if (capturedProcessFailure) {
      result.exitCode =
        EXIT_CODES.INTERNAL_ERROR;
    }

    applyExecutionExitCode(
      result,
    );

    return result;
  } catch (error) {
    process.exitCode =
      EXIT_CODES.INTERNAL_ERROR;

    throw error;
  } finally {
    processHost.detach();
  }
}