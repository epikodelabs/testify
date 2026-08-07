import type { ExecutionPlan } from './execution-plan';
import type { ExecutionResult } from './execution-result';

export interface NodeExecutionEnvironment {
  configure(
    options: Record<string, unknown>,
  ): void;
  execute(): void | Promise<void>;
}

export async function executeNodePlan(
  env: NodeExecutionEnvironment,
  plan: ExecutionPlan,
): Promise<void> {
  const specIdSet =
    new Set(plan.specIds);

  env.configure({
    random: plan.random,
    seed: plan.seed,
    stopOnSpecFailure:
      plan.stopOnFailure ?? false,
    specFilter: (
      spec: { id: string },
    ) => specIdSet.has(spec.id),
  });

  await env.execute();
}

export function getEmbeddedNodeExecutionAdapterSource():
  string {
  return [
    executeNodePlan,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
