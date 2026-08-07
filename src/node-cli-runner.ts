import type {
  ExecutionResult,
} from './execution-result';
import {
  applyExecutionExitCode,
} from './cli-result-adapter';
import {
  NodeTestRunner,
} from './node-test-runner';

export async function runNodeCli(
  runner: NodeTestRunner,
): Promise<ExecutionResult> {
  const result =
    await runner.start();

  applyExecutionExitCode(
    result,
  );

  return result;
}
