import {
  executeNodePlan,
} from './node-execution-adapter';
import type {
  ExecutionPlan,
} from './execution-plan';

describe('NodeExecutionAdapter', () => {
  it('configures Jasmine from an execution plan', async () => {
    let configured:
      Record<string, unknown> | undefined;

    let executed = false;

    const env = {
      configure(
        options: Record<string, unknown>,
      ) {
        configured = options;
      },

      async execute() {
        executed = true;
      },
    };

    const plan: ExecutionPlan = {
      specIds: ['spec2'],
      random: true,
      seed: 123,
      stopOnFailure: true,
      source: {
        kind: 'spec',
      },
    };

    await executeNodePlan(
      env,
      plan,
    );

    expect(executed).toBeTrue();
    expect(configured?.random).toBeTrue();
    expect(configured?.seed).toBe(123);
    expect(
      configured?.stopOnSpecFailure,
    ).toBeTrue();

    const specFilter =
      configured?.specFilter as
        | ((spec: { id: string }) => boolean)
        | undefined;

    expect(
      specFilter?.({ id: 'spec2' }),
    ).toBeTrue();

    expect(
      specFilter?.({ id: 'spec1' }),
    ).toBeFalse();
  });
});
