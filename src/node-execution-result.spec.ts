import {
  executeNodePlan,
} from './node-execution-adapter';
import type {
  ExecutionPlan,
} from './execution-plan';

describe('Node execution results', () => {
  it('returns the same ExecutionResult shape as browser execution', async () => {
    let reporter:
      | {
          specDone?(
            result: any,
          ): void;
        }
      | undefined;

    const env = {
      configure() {},

      addReporter(value: any) {
        reporter = value;
      },

      async execute() {
        reporter?.specDone?.({
          id: 'spec1',
          description: 'one',
          status: 'passed',
        });

        reporter?.specDone?.({
          id: 'spec2',
          description: 'two',
          status: 'failed',
        });
      },
    };

    const plan: ExecutionPlan = {
      specIds: [
        'spec1',
        'spec2',
      ],
      random: false,
      source: {
        kind: 'all',
      },
    };

    const result =
      await executeNodePlan(
        env,
        plan,
      );

    expect(result.total).toBe(2);
    expect(result.passed).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.specResults)
      .toHaveSize(2);
  });
});
