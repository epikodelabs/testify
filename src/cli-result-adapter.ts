import { EXIT_CODES } from './exit-codes';
import type {
  ExecutionResult,
} from './execution-result';

export function getExecutionExitCode(
  result: ExecutionResult,
): number {
  if (
    typeof result.exitCode === 'number'
  ) {
    return result.exitCode;
  }

  if (result.failed > 0) {
    return EXIT_CODES.TEST_FAILURES;
  }

  if (result.pending > 0) {
    return EXIT_CODES.SUCCESS_WITH_PENDING;
  }

  return EXIT_CODES.SUCCESS;
}

export function applyExecutionExitCode(
  result: ExecutionResult,
): number {
  const exitCode =
    getExecutionExitCode(
      result,
    );

  process.exitCode =
    exitCode;

  return exitCode;
}
