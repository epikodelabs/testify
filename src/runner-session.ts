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
}

export interface RunnerSessionOptions
  extends ExecutionPlanOptions {}

export class RunnerSession<TResult> {
  private readonly planner:
    PlanningEngine;

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

  catalog(): TestCatalog {
    this.syncCatalog();

    return this.planner.catalog;
  }

  index(): TestCatalogIndex {
    this.syncCatalog();

    return this.planner.index;
  }

  revision(): number {
    this.syncCatalog();

    return this.planner.version;
  }

  changes(): CatalogChangeSet {
    this.syncCatalog();

    return this.planner.changes;
  }

  planningStats():
    PlanningEngineStats {
    this.syncCatalog();

    return this.planner.stats();
  }

  invalidatePlans(): void {
    this.planner.invalidate();
  }


  query(): CatalogQuery {
    return new CatalogQuery(
      this.catalog(),
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
      files: this.listFiles().length,
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
  ): ExecutionPlan {
    this.syncCatalog();

    return this.planner.plan(
      selector,
      this.getOptions(),
    );
  }

  planSpec(
    selector: string | RegExp,
  ): ExecutionPlan {
    return this.plan({
      spec: selector,
    });
  }

  planSuite(
    selector: string | RegExp,
  ): ExecutionPlan {
    return this.plan({
      suite: selector,
    });
  }

  planFile(
    selector: string | RegExp,
  ): ExecutionPlan {
    return this.plan({
      file: selector,
    });
  }

  shard(
    plan: ExecutionPlan,
    index: number,
    count: number,
  ): ExecutionPlan {
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
    return this.planner.partition(
      plan,
      count,
    );
  }

  private syncCatalog(): void {
    this.planner.update(
      this.getCatalogValue(),
    );
  }

  execute(
    plan: ExecutionPlan,
  ): Promise<TResult> {
    return this.adapter.execute(plan);
  }

  run(
    selector?: TestSelector,
  ): Promise<TResult> {
    return this.execute(
      this.plan(selector),
    );
  }

  runSpec(
    selector: string | RegExp,
  ): Promise<TResult> {
    return this.execute(
      this.planSpec(selector),
    );
  }

  runSuite(
    selector: string | RegExp,
  ): Promise<TResult> {
    return this.execute(
      this.planSuite(selector),
    );
  }

  runFile(
    selector: string | RegExp,
  ): Promise<TResult> {
    return this.execute(
      this.planFile(selector),
    );
  }
}

export function getEmbeddedRunnerSessionSource():
  string {
  return [
    RunnerSession,
  ]
    .map((value) => value.toString())
    .join('\n\n');
}


export type TestifyRunnerSession =
  RunnerSession<
    import('./execution-result')
      .ExecutionResult
  >;
