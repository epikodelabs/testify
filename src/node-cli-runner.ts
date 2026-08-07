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
  const processHost =
    new NodeProcessHost({
      onUnhandledRejection(error) {
        logger.error(
          NodeRunnerMessages
            .unhandledRejection(
              error instanceof Error
                ? error.message
                : String(error),
            ),
        );

        process.exitCode =
          EXIT_CODES.INTERNAL_ERROR;
      },

      onUncaughtException(error) {
        logger.error(
          NodeRunnerMessages
            .uncaughtException(
              error.message,
            ),
        );

        process.exitCode =
          EXIT_CODES.INTERNAL_ERROR;
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
