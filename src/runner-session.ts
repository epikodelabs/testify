import {
  embedClassSource,
} from './embedded-source';
import type {
  TestCatalog,
} from './test-catalog';
import {
  findCatalogSpecs,
  findCatalogSuites,
  type TestSelector,
} from './test-selection';
import type {
  ExecutionPlan,
  ExecutionPlanOptions,
} from './execution-plan';
import {
  listCatalogFiles,
  listCatalogSuites,
  listCatalogTests,
  type FileListRow,
  type SuiteListRow,
  type TestListRow,
} from './catalog-query';
import {
  searchIndexEntries,
  type TestCatalogIndex,
} from './test-catalog-index';
import {
  PlanningEngine,
  type PlanningEngineStats,
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

  catalog(): TestCatalog {
    this.refresh();

    return this.planner.catalog;
  }

  index(): TestCatalogIndex {
    this.refresh();

    return this.planner.index;
  }

  revision(): number {
    this.refresh();

    return this.planner.version;
  }

  changes(): CatalogChangeSet {
    this.assertOpen();

    return this.planner.changes;
  }

  planningStats():
    PlanningEngineStats {
    this.refresh();

    return this.planner.stats();
  }

  invalidatePlans(): void {
    this.assertOpen();
    this.planner.invalidate();
  }


  query(): CatalogQuery {
    return new CatalogQuery(
      this.catalog(),
    );
  }

  tests(
    selector?: string | RegExp,
  ): TestListRow[] {
    return this.query().tests(
      selector,
    );
  }

  suites(
    selector?: string | RegExp,
  ): SuiteListRow[] {
    return this.query().suites(
      selector,
    );
  }

  files(
    selector?: string | RegExp,
  ): FileListRow[] {
    return this.query().files(
      selector,
    );
  }

  listTests(): TestListRow[] {
    return listCatalogTests(
      this.catalog(),
    );
  }

  listSuites(): SuiteListRow[] {
    return listCatalogSuites(
      this.catalog(),
    );
  }

  listFiles(): FileListRow[] {
    return listCatalogFiles(
      this.catalog(),
    );
  }

  findTests(
    selector: string | RegExp,
  ): TestListRow[] {
    const catalog =
      this.catalog();

    const selectedIds =
      new Set(
        findCatalogSpecs(
          catalog,
          selector,
        ).map(
          (spec) => spec.id,
        ),
      );

    return listCatalogTests(
      catalog,
    ).filter(
      (row) =>
        selectedIds.has(
          row.id,
        ),
    );
  }

  findSuites(
    selector: string | RegExp,
  ): SuiteListRow[] {
    const catalog =
      this.catalog();

    const selectedIds =
      new Set(
        findCatalogSuites(
          catalog,
          selector,
        ).map(
          (suite) => suite.id,
        ),
      );

    return listCatalogSuites(
      catalog,
    ).filter(
      (row) =>
        selectedIds.has(
          row.id,
        ),
    );
  }

  stats(): {
    specs: number;
    suites: number;
    files: number;
  } {
    const catalog = this.catalog();

    return {
      specs: catalog.specs.length,
      suites: catalog.suites.length,
      files: this.files().length,
    };
  }

  findFiles(
    selector: string | RegExp,
  ): FileListRow[] {
    const index =
      this.index();

    const fileIds =
      new Set(
        searchIndexEntries(
          index.fileSearch,
          selector,
        ),
      );

    return listCatalogFiles(
      this.catalog(),
    ).filter(
      (row) =>
        fileIds.has(
          row.file,
        ),
    );
  }

  plan(
    selector?: TestSelector,
    options: ExecutionPlanOptions = {},
  ): ExecutionPlan {
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
  ): ExecutionPlan {
    return this.plan(
      { spec: selector },
      options,
    );
  }

  planSuite(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): ExecutionPlan {
    return this.plan(
      { suite: selector },
      options,
    );
  }

  planFile(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): ExecutionPlan {
    return this.plan(
      { file: selector },
      options,
    );
  }

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