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

export function getEmbeddedExecutionPlanSource():
  string {
  return [
    inferSelectorKind,
    createExecutionPlan,
    createSpecExecutionPlan,
    createSuiteExecutionPlan,
    createFileExecutionPlan,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
