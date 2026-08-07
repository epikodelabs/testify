import type {
  TestCatalog,
} from './test-catalog';
import type {
  TestSelector,
} from './test-selection';
import {
  createExecutionPlan,
  partitionExecutionPlan,
  shardExecutionPlan,
  type ExecutionPlan,
  type ExecutionPlanOptions,
} from './execution-plan';
import {
  CatalogState,
  type CatalogChangeSet,
} from './catalog-state';
import type {
  TestCatalogIndex,
} from './test-catalog-index';

export interface PlanningEngineStats {
  catalogVersion: number;
  cachedPlans: number;
  cacheHits: number;
  cacheMisses: number;
}

export class PlanningEngine {
  private readonly state:
    CatalogState;

  private readonly planCache =
    new Map<
      string,
      ExecutionPlan
    >();

  private cacheHitsValue = 0;
  private cacheMissesValue = 0;

  constructor(
    catalog: TestCatalog,
  ) {
    this.state =
      new CatalogState(
        catalog,
      );
  }

  get catalog(): TestCatalog {
    return this.state.catalog;
  }

  get index(): TestCatalogIndex {
    return this.state.index;
  }

  get version(): number {
    return this.state.version;
  }

  get changes():
    CatalogChangeSet {
    return this.state.changes;
  }

  update(
    catalog: TestCatalog,
  ): CatalogChangeSet {
    const changes =
      this.state.update(
        catalog,
      );

    if (changes.changed) {
      this.planCache.clear();
    }

    return changes;
  }

  plan(
    selector?: TestSelector,
    options:
      ExecutionPlanOptions = {},
  ): ExecutionPlan {
    const key =
      createPlanCacheKey(
        this.version,
        selector,
        options,
      );

    const cached =
      this.planCache.get(key);

    if (cached) {
      this.cacheHitsValue++;

      return cloneExecutionPlan(
        cached,
      );
    }

    this.cacheMissesValue++;

    const plan =
      createExecutionPlan(
        this.catalog,
        selector,
        options,
      );

    plan.catalogVersion =
      this.version;

    this.planCache.set(
      key,
      cloneExecutionPlan(
        plan,
      ),
    );

    return plan;
  }

  shard(
    plan: ExecutionPlan,
    index: number,
    count: number,
  ): ExecutionPlan {
    return shardExecutionPlan(
      plan,
      index,
      count,
    );
  }

  partition(
    plan: ExecutionPlan,
    count: number,
  ): ExecutionPlan[] {
    return partitionExecutionPlan(
      plan,
      count,
    );
  }

  invalidate(): void {
    this.planCache.clear();
  }

  stats():
    PlanningEngineStats {
    return {
      catalogVersion:
        this.version,
      cachedPlans:
        this.planCache.size,
      cacheHits:
        this.cacheHitsValue,
      cacheMisses:
        this.cacheMissesValue,
    };
  }
}

function createPlanCacheKey(
  version: number,
  selector: TestSelector | undefined,
  options: ExecutionPlanOptions,
): string {
  return [
    version,
    serializeSelector(
      selector,
    ),
    options.random ?? false,
    options.seed ?? '',
    options.stopOnFailure ?? false,
  ].join('|');
}

function serializeSelector(
  selector:
    | TestSelector
    | undefined,
): string {
  if (selector === undefined) {
    return 'all';
  }

  if (
    typeof selector === 'string'
  ) {
    return `text:${selector}`;
  }

  if (
    selector instanceof RegExp
  ) {
    return [
      'regexp',
      selector.source,
      selector.flags,
    ].join(':');
  }

  if (selector.spec) {
    return `spec:${serializeSelectorValue(
      selector.spec,
    )}`;
  }

  if (selector.suite) {
    return `suite:${serializeSelectorValue(
      selector.suite,
    )}`;
  }

  if (selector.file) {
    return `file:${serializeSelectorValue(
      selector.file,
    )}`;
  }

  return 'empty';
}

function serializeSelectorValue(
  selector: string | RegExp,
): string {
  return typeof selector ===
    'string'
    ? selector
    : `/${selector.source}/${selector.flags}`;
}

function cloneExecutionPlan(
  plan: ExecutionPlan,
): ExecutionPlan {
  return {
    ...plan,
    specIds: [
      ...plan.specIds,
    ],
    source: {
      ...plan.source,
    },
    shard:
      plan.shard
        ? { ...plan.shard }
        : undefined,
  };
}

export function getEmbeddedPlanningEngineSource():
  string {
  return [
    createPlanCacheKey,
    serializeSelector,
    serializeSelectorValue,
    cloneExecutionPlan,
    PlanningEngine,
  ]
    .map(
      (value) =>
        value.toString(),
    )
    .join('\n\n');
}
