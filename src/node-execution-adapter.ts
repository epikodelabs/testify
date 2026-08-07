import type { ExecutionPlan } from './execution-plan';
import {
  summarizeExecutionResults,
  type ExecutionResult,
  type ExecutionSpecResult,
} from './execution-result';

export interface NodeExecutionEnvironment {
  configure(
    options: Record<string, unknown>,
  ): void;

  addReporter?(
    reporter: {
      jasmineStarted?(): void;
      specDone?(
        result: ExecutionSpecResult,
      ): void;
      jasmineDone?(): void;
    },
  ): void;

  execute(): void | Promise<void>;
}

export async function executeNodePlan(
  env: NodeExecutionEnvironment,
  plan: ExecutionPlan,
): Promise<ExecutionResult> {
  const specIdSet =
    new Set(plan.specIds);

  const specResults:
    ExecutionSpecResult[] = [];

  env.addReporter?.({
    jasmineStarted() {
      specResults.length = 0;
    },

    specDone(result) {
      if (specIdSet.has(result.id)) {
        specResults.push(result);
      }
    },
  });

  env.configure({
    random: plan.random,
    seed: plan.seed,
    stopOnSpecFailure:
      plan.stopOnFailure ?? false,
    specFilter: (
      spec: { id: string },
    ) => specIdSet.has(spec.id),
  });

  const startedAt =
    Date.now();

  await env.execute();

  return summarizeExecutionResults(
    specResults,
    {
      duration:
        Date.now() - startedAt,
    },
  );
}

export function getEmbeddedNodeExecutionAdapterSource():
  string {
  return [
    summarizeExecutionResults,
    executeNodePlan,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
