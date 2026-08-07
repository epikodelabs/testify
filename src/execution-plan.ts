import type { TestCatalog } from './test-catalog';
import {
  resolveTestSelector,
  type TestSelector,
} from './test-selection';

export interface ExecutionPlan {
  specIds: string[];
  random: boolean;
  seed?: number;
  stopOnFailure?: boolean;
  catalogVersion?: number;
  shard?: {
    index: number;
    count: number;
  };
  source: {
    kind:
      | 'all'
      | 'spec'
      | 'suite'
      | 'file'
      | 'selector';
    selector?: TestSelector;
  };
}

export interface ExecutionPlanOptions {
  random?: boolean;
  seed?: number;
  stopOnFailure?: boolean;
}

export function createExecutionPlan(
  catalog: TestCatalog,
  selector?: TestSelector,
  options: ExecutionPlanOptions = {},
): ExecutionPlan {
  const specIds =
    selector === undefined
      ? catalog.specs.map(
          (spec) => spec.id,
        )
      : resolveTestSelector(
          catalog,
          selector,
        );

  return {
    specIds: [...new Set(specIds)],
    random: options.random ?? false,
    seed: options.seed,
    stopOnFailure:
      options.stopOnFailure,
    source: {
      kind:
        selector === undefined
          ? 'all'
          : inferSelectorKind(
              selector,
            ),
      selector,
    },
  };
}

export function createSpecExecutionPlan(
  catalog: TestCatalog,
  selector: string | RegExp,
  options: ExecutionPlanOptions = {},
): ExecutionPlan {
  return createExecutionPlan(
    catalog,
    { spec: selector },
    options,
  );
}

export function createSuiteExecutionPlan(
  catalog: TestCatalog,
  selector: string | RegExp,
  options: ExecutionPlanOptions = {},
): ExecutionPlan {
  return createExecutionPlan(
    catalog,
    { suite: selector },
    options,
  );
}

export function createFileExecutionPlan(
  catalog: TestCatalog,
  selector: string | RegExp,
  options: ExecutionPlanOptions = {},
): ExecutionPlan {
  return createExecutionPlan(
    catalog,
    { file: selector },
    options,
  );
}

function inferSelectorKind(
  selector: TestSelector,
):
  | 'spec'
  | 'suite'
  | 'file'
  | 'selector' {
  if (
    typeof selector === 'string' ||
    selector instanceof RegExp
  ) {
    return 'selector';
  }

  if (selector.spec) return 'spec';
  if (selector.suite) return 'suite';
  if (selector.file) return 'file';

  return 'selector';
}

export function shardExecutionPlan(
  plan: ExecutionPlan,
  index: number,
  count: number,
): ExecutionPlan {
  if (
    !Number.isInteger(index) ||
    !Number.isInteger(count) ||
    count <= 0 ||
    index < 0 ||
    index >= count
  ) {
    throw new RangeError(
      'Invalid execution shard.',
    );
  }

  return {
    ...plan,
    specIds:
      plan.specIds.filter(
        (
          _,
          specIndex,
        ) =>
          specIndex % count ===
          index,
      ),
    shard: {
      index,
      count,
    },
  };
}

export function partitionExecutionPlan(
  plan: ExecutionPlan,
  count: number,
): ExecutionPlan[] {
  if (
    !Number.isInteger(count) ||
    count <= 0
  ) {
    throw new RangeError(
      'Execution partition count must be a positive integer.',
    );
  }

  return Array.from(
    { length: count },
    (_, index) =>
      shardExecutionPlan(
        plan,
        index,
        count,
      ),
  );
}

export function getEmbeddedExecutionPlanSource():
  string {
  return [
    inferSelectorKind,
    createExecutionPlan,
    createSpecExecutionPlan,
    createSuiteExecutionPlan,
    createFileExecutionPlan,
    shardExecutionPlan,
    partitionExecutionPlan,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
