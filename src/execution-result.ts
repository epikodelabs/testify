export interface ExecutionSpecResult {
  id: string;
  description: string;
  fullName?: string;
  status:
    | 'passed'
    | 'failed'
    | 'pending'
    | 'excluded'
    | 'disabled'
    | 'incomplete'
    | string;
  duration?: number;
  failedExpectations?: unknown[];
  pendingReason?: string;
}

export interface ExecutionResult {
  specResults: ExecutionSpecResult[];
  total: number;
  passed: number;
  failed: number;
  pending: number;
  duration?: number;
  exitCode?: number;
}

export function summarizeExecutionResults(
  specResults: ExecutionSpecResult[],
  options: {
    duration?: number;
    exitCode?: number;
  } = {},
): ExecutionResult {
  let passed = 0;
  let failed = 0;
  let pending = 0;

  for (const result of specResults) {
    if (result.status === 'passed') {
      passed++;
    } else if (result.status === 'failed') {
      failed++;
    } else if (
      result.status === 'pending' ||
      result.status === 'excluded' ||
      result.status === 'disabled'
    ) {
      pending++;
    }
  }

  return {
    specResults,
    total: specResults.length,
    passed,
    failed,
    pending,
    duration: options.duration,
    exitCode: options.exitCode,
  };
}
