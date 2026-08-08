import {
  embedClassSource,
} from './embedded-source';
import type {
  TestCatalog,
} from './test-catalog';
import type {
  TestSelector,
} from './test-selection';
import type {
  ExecutionPlan,
  ExecutionPlanOptions,
  PlannedExecution,
} from './execution-plan';
import type {
  FileListRow,
  SuiteListRow,
  TestListRow,
} from './catalog-query';
import {
  PlanningEngine,
} from './planning-engine';
import type {
  CatalogChangeSet,
} from './catalog-state';
import {
  CatalogQuery,
} from './catalog-query-builder';

export interface RunnerSessionAdapter<TResult> {
  execute(
    plan: ExecutionPlan,
  ): Promise<TResult>;

  close?():
    | void
    | Promise<void>;
}

export interface RunnerSessionOptions
  extends ExecutionPlanOptions {}

export type RunnerSessionState =
  | 'ready'
  | 'closing'
  | 'closed';

export interface RunnerSessionRefreshResult {
  changed: boolean;
  previousRevision: number;
  revision: number;
  changes: CatalogChangeSet;
}

export class RunnerSession<TResult> {
  private readonly planner:
    PlanningEngine;

  private stateValue:
    RunnerSessionState =
      'ready';

  private closePromise:
    Promise<void> | null = null;

  constructor(
    private readonly getCatalogValue:
      () => TestCatalog,
    private readonly adapter:
      RunnerSessionAdapter<TResult>,
    private readonly getOptions:
      () => RunnerSessionOptions =
        () => ({}),
  ) {
    this.planner =
      new PlanningEngine(
        this.getCatalogValue(),
      );
  }

  get state(): RunnerSessionState {
    return this.stateValue;
  }

  refresh():
    RunnerSessionRefreshResult {
    this.assertOpen();

    const previousRevision =
      this.planner.version;

    const changes =
      this.planner.update(
        this.getCatalogValue(),
      );

    return {
      changed: changes.changed,
      previousRevision,
      revision: this.planner.version,
      changes,
    };
  }

  revision(): number {
    this.refresh();

    return this.planner.version;
  }

  changes(): CatalogChangeSet {
    this.assertOpen();

    return this.planner.changes;
  }

  tests(
    selector?: string | RegExp,
  ): TestListRow[] {
    this.refresh();

    return new CatalogQuery(
      this.planner.catalog,
    ).tests(
      selector,
    );
  }

  suites(
    selector?: string | RegExp,
  ): SuiteListRow[] {
    this.refresh();

    return new CatalogQuery(
      this.planner.catalog,
    ).suites(
      selector,
    );
  }

  files(
    selector?: string | RegExp,
  ): FileListRow[] {
    this.refresh();

    return new CatalogQuery(
      this.planner.catalog,
    ).files(
      selector,
    );
  }

  stats(): {
    specs: number;
    suites: number;
    files: number;
  } {
    this.refresh();
    const catalog = this.planner.catalog;

    return {
      specs: catalog.specs.length,
      suites: catalog.suites.length,
      files: this.files().length,
    };
  }

  plan(
    selector?: TestSelector,
    options: ExecutionPlanOptions = {},
  ): PlannedExecution {
    this.refresh();

    return this.planner.plan(
      selector,
      {
        ...this.getOptions(),
        ...options,
      },
    );
  }

  planSpec(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): PlannedExecution {
    return this.plan(
      { spec: selector },
      options,
    );
  }

  planSuite(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): PlannedExecution {
    return this.plan(
      { suite: selector },
      options,
    );
  }

  planFile(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): PlannedExecution {
    return this.plan(
      { file: selector },
      options,
    );
  }

  shard(
    plan: PlannedExecution,
    index: number,
    count: number,
  ): PlannedExecution;
  shard(
    plan: ExecutionPlan,
    index: number,
    count: number,
  ): ExecutionPlan;
  shard(
    plan: ExecutionPlan,
    index: number,
    count: number,
  ): ExecutionPlan {
    this.assertOpen();

    return this.planner.shard(
      plan,
      index,
      count,
    );
  }

  partition(
    plan: PlannedExecution,
    count: number,
  ): PlannedExecution[];
  partition(
    plan: ExecutionPlan,
    count: number,
  ): ExecutionPlan[];
  partition(
    plan: ExecutionPlan,
    count: number,
  ): ExecutionPlan[] {
    this.assertOpen();

    return this.planner.partition(
      plan,
      count,
    );
  }

  async execute(
    plan: ExecutionPlan,
  ): Promise<TResult> {
    this.assertOpen();
    this.refresh();
    this.validatePlan(plan);

    return await this.adapter.execute(
      plan,
    );
  }

  run(
    selector?: TestSelector,
    options: ExecutionPlanOptions = {},
  ): Promise<TResult> {
    return this.execute(
      this.plan(
        selector,
        options,
      ),
    );
  }

  runSpec(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): Promise<TResult> {
    return this.execute(
      this.planSpec(
        selector,
        options,
      ),
    );
  }

  runSuite(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): Promise<TResult> {
    return this.execute(
      this.planSuite(
        selector,
        options,
      ),
    );
  }

  runFile(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): Promise<TResult> {
    return this.execute(
      this.planFile(
        selector,
        options,
      ),
    );
  }

  close(): Promise<void> {
    if (this.stateValue === 'closed') {
      return Promise.resolve();
    }

    if (this.closePromise) {
      return this.closePromise;
    }

    this.stateValue = 'closing';

    this.closePromise =
      Promise.resolve()
        .then(() =>
          this.adapter.close?.(),
        )
        .then(
          () => undefined,
        )
        .finally(() => {
          this.stateValue = 'closed';
        });

    return this.closePromise;
  }

  private assertOpen(): void {
    if (this.stateValue !== 'ready') {
      throw new Error(
        'Testify session is closed.',
      );
    }
  }

  private validatePlan(
    plan: ExecutionPlan,
  ): void {
    if (
      plan.catalogVersion === undefined ||
      plan.catalogVersion ===
        this.planner.version
    ) {
      return;
    }

    const knownSpecIds =
      this.planner.index.specById;

    const missing =
      plan.specIds.filter(
        (id) =>
          !knownSpecIds.has(id),
      );

    if (!missing.length) {
      return;
    }

    throw new Error(
      `Execution plan is stale; missing spec ids: ${missing.join(', ')}.`,
    );
  }
}

export function getEmbeddedRunnerSessionSource():
  string {
  return embedClassSource(
    'RunnerSession',
    RunnerSession,
  );
}


export type TestifyRunnerSession =
  RunnerSession<
    import('./execution-result')
      .ExecutionResult
  >;
