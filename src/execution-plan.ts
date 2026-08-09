import type {
  TestCatalog,
  TestCatalogSpec,
} from './test-catalog';
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

export interface ExecutionPlanTest {
  readonly id: string;
  readonly description: string;
  readonly fullName: string;
  readonly suiteId?: string;
  readonly file?: string;
}

export type ExecutionPlanPredicate = (
  test: ExecutionPlanTest,
  index: number,
  tests: readonly ExecutionPlanTest[],
) => unknown;

export interface PlannedExecution
  extends ExecutionPlan {
  tests(): readonly ExecutionPlanTest[];

  filter(
    predicate: ExecutionPlanPredicate,
  ): PlannedExecution;

  slice(
    start?: number,
    end?: number,
  ): PlannedExecution;

  add(
    plan: PlannedExecution,
  ): PlannedExecution;

  subtract(
    plan: PlannedExecution,
  ): PlannedExecution;

  intersect(
    plan: PlannedExecution,
  ): PlannedExecution;

  not(): PlannedExecution;
}

export interface ExecutionPlanOptions {
  random?: boolean;
  seed?: number;
  stopOnFailure?: boolean;
}

function snapshotExecutionPlanTest(
  spec: TestCatalogSpec,
): ExecutionPlanTest {
  return Object.freeze({
    id: spec.id,
    description: spec.description,
    fullName: spec.fullName,
    suiteId: spec.suiteId,
    file: spec.file,
  });
}

function getExecutionPlanUniverse(
  plan: PlannedExecution,
): readonly ExecutionPlanTest[] {
  return (
    plan as PlannedExecution & {
      readonly __testifyPlanUniverse:
        readonly ExecutionPlanTest[];
    }
  ).__testifyPlanUniverse;
}

function assertCompatibleExecutionPlans(
  left: PlannedExecution,
  right: PlannedExecution,
): void {
  if (!isPlannedExecution(right)) {
    throw new TypeError(
      'Execution plan operation expects another planned execution.',
    );
  }

  if (
    left.catalogVersion !== undefined &&
    right.catalogVersion !== undefined &&
    left.catalogVersion !== right.catalogVersion
  ) {
    throw new Error(
      'Cannot combine execution plans from different catalog revisions.',
    );
  }

  const leftUniverse =
    getExecutionPlanUniverse(left);
  const rightUniverse =
    getExecutionPlanUniverse(right);

  if (
    leftUniverse.length !==
      rightUniverse.length ||
    leftUniverse.some(
      (test, index) =>
        test.id !==
        rightUniverse[index]?.id,
    )
  ) {
    throw new Error(
      'Cannot combine execution plans from different catalogs.',
    );
  }
}

function attachExecutionPlanOperations(
  plan: ExecutionPlan,
  testSnapshot: readonly ExecutionPlanTest[],
  universeSnapshot: readonly ExecutionPlanTest[],
): PlannedExecution {
  const tests = [...testSnapshot];
  const universe = [...universeSnapshot];

  Object.defineProperty(
    tests,
    '__testifyCollectionKind',
    {
      enumerable: false,
      configurable: false,
      writable: false,
      value: 'tests',
    },
  );

  Object.freeze(tests);
  Object.freeze(universe);

  const createDerivedPlan = (
    selected: readonly ExecutionPlanTest[],
    options: {
      clearShard?: boolean;
    } = {},
  ): PlannedExecution => {
    const nextPlan =
      cloneExecutionPlanData(
        plan,
        selected.map(
          (test) => test.id,
        ),
      );

    if (options.clearShard) {
      delete nextPlan.shard;
    }

    return attachExecutionPlanOperations(
      nextPlan,
      selected,
      universe,
    );
  };

  Object.defineProperties(
    plan,
    {
      __testifyPlanUniverse: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: universe,
      },
      tests: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: () => tests,
      },
      filter: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (
          predicate: ExecutionPlanPredicate,
        ) => {
          if (
            typeof predicate !== 'function'
          ) {
            throw new TypeError(
              'Execution plan filter expects a predicate function.',
            );
          }

          return createDerivedPlan(
            tests.filter(
              (test, index) =>
                Boolean(
                  predicate(
                    test,
                    index,
                    tests,
                  ),
                ),
            ),
          );
        },
      },
      slice: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (
          start?: number,
          end?: number,
        ) =>
          createDerivedPlan(
            tests.slice(
              start,
              end,
            ),
          ),
      },
      add: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (
          other: PlannedExecution,
        ) => {
          const current =
            plan as PlannedExecution;

          assertCompatibleExecutionPlans(
            current,
            other,
          );

          const selectedIds =
            new Set(
              tests.map(
                (test) => test.id,
              ),
            );
          const selected = [...tests];

          for (const test of other.tests()) {
            if (!selectedIds.has(test.id)) {
              selectedIds.add(test.id);
              selected.push(test);
            }
          }

          return createDerivedPlan(
            selected,
            { clearShard: true },
          );
        },
      },
      subtract: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (
          other: PlannedExecution,
        ) => {
          const current =
            plan as PlannedExecution;

          assertCompatibleExecutionPlans(
            current,
            other,
          );

          const excluded =
            new Set(other.specIds);

          return createDerivedPlan(
            tests.filter(
              (test) =>
                !excluded.has(test.id),
            ),
          );
        },
      },
      intersect: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (
          other: PlannedExecution,
        ) => {
          const current =
            plan as PlannedExecution;

          assertCompatibleExecutionPlans(
            current,
            other,
          );

          const included =
            new Set(other.specIds);

          return createDerivedPlan(
            tests.filter(
              (test) =>
                included.has(test.id),
            ),
          );
        },
      },
      not: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: () => {
          const excluded =
            new Set(plan.specIds);

          return createDerivedPlan(
            universe.filter(
              (test) =>
                !excluded.has(test.id),
            ),
            { clearShard: true },
          );
        },
      },
    },
  );

  return plan as PlannedExecution;
}

function cloneExecutionPlanData(
  plan: ExecutionPlan,
  specIds: string[] = [...plan.specIds],
): ExecutionPlan {
  return {
    ...plan,
    specIds: [...specIds],
    source: {
      ...plan.source,
    },
    shard:
      plan.shard
        ? { ...plan.shard }
        : undefined,
  };
}

export function createPlannedExecution(
  plan: ExecutionPlan,
  catalog: TestCatalog,
): PlannedExecution {
  const universe =
    catalog.specs.map(
      snapshotExecutionPlanTest,
    );

  const testsById =
    new Map(
      universe.map(
        (test) => [
          test.id,
          test,
        ] as const,
      ),
    );

  const tests =
    plan.specIds.flatMap(
      (id) => {
        const test =
          testsById.get(id);

        return test
          ? [test]
          : [];
      },
    );

  return attachExecutionPlanOperations(
    plan,
    tests,
    universe,
  );
}

export function isPlannedExecution(
  plan: ExecutionPlan,
): plan is PlannedExecution {
  const candidate =
    plan as Partial<PlannedExecution>;

  return (
    typeof candidate.tests === 'function' &&
    typeof candidate.filter === 'function' &&
    typeof candidate.slice === 'function' &&
    typeof candidate.add === 'function' &&
    typeof candidate.subtract === 'function' &&
    typeof candidate.intersect === 'function' &&
    typeof candidate.not === 'function' &&
    Array.isArray(
      (candidate as PlannedExecution & {
        __testifyPlanUniverse?: unknown;
      }).__testifyPlanUniverse,
    )
  );
}

export function createExecutionPlan(
  catalog: TestCatalog,
  selector?: TestSelector,
  options: ExecutionPlanOptions = {},
): PlannedExecution {
  const specIds =
    selector === undefined
      ? catalog.specs.map(
          (spec) => spec.id,
        )
      : resolveTestSelector(
          catalog,
          selector,
        );

  return createPlannedExecution(
    {
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
    },
    catalog,
  );
}

export function createSpecExecutionPlan(
  catalog: TestCatalog,
  selector: string | RegExp,
  options: ExecutionPlanOptions = {},
): PlannedExecution {
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
): PlannedExecution {
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
): PlannedExecution {
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
  plan: PlannedExecution,
  index: number,
  count: number,
): PlannedExecution;
export function shardExecutionPlan(
  plan: ExecutionPlan,
  index: number,
  count: number,
): ExecutionPlan;
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

  const selectedIds =
    plan.specIds.filter(
      (
        _,
        specIndex,
      ) =>
        specIndex % count ===
        index,
    );

  const sharded: ExecutionPlan = {
    ...cloneExecutionPlanData(
      plan,
      selectedIds,
    ),
    shard: {
      index,
      count,
    },
  };

  if (!isPlannedExecution(plan)) {
    return sharded;
  }

  const selectedIdsSet =
    new Set(selectedIds);

  return attachExecutionPlanOperations(
    sharded,
    plan.tests().filter(
      (test) =>
        selectedIdsSet.has(
          test.id,
        ),
    ),
    getExecutionPlanUniverse(plan),
  );
}

export function partitionExecutionPlan(
  plan: PlannedExecution,
  count: number,
): PlannedExecution[];
export function partitionExecutionPlan(
  plan: ExecutionPlan,
  count: number,
): ExecutionPlan[];
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
    snapshotExecutionPlanTest,
    cloneExecutionPlanData,
    getExecutionPlanUniverse,
    assertCompatibleExecutionPlans,
    attachExecutionPlanOperations,
    createPlannedExecution,
    isPlannedExecution,
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