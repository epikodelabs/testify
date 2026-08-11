import {
  summarizeExecutionResults,
} from './execution-result';

describe('ExecutionResult', () => {
  it('summarizes spec results', () => {
    const result =
      summarizeExecutionResults([
        {
          id: 'spec1',
          description: 'one',
          status: 'passed',
        },
        {
          id: 'spec2',
          description: 'two',
          status: 'failed',
        },
        {
          id: 'spec3',
          description: 'three',
          status: 'pending',
        },
      ]);

    expect(result.total).toBe(3);
    expect(result.passed).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.pending).toBe(1);
    expect(result.globalFailures).toEqual([]);
  });

  it('preserves global failures separately from spec results', () => {
    const result =
      summarizeExecutionResults(
        [],
        {
          globalFailures: [{
            message:
              'Unhandled promise rejection: Error: authorization service unavailable',
            globalErrorType:
              'unhandledRejection',
          }],
        },
      );

    expect(result.total).toBe(0);
    expect(result.failed).toBe(0);
    expect(result.globalFailures)
      .toHaveSize(1);
  });
});
