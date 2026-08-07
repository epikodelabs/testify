import type {
  TestCatalog,
} from './test-catalog';
import type {
  TestSelector,
} from './test-selection';
import {
  createExecutionPlan,
  createFileExecutionPlan,
  createSpecExecutionPlan,
  createSuiteExecutionPlan,
  type ExecutionPlan,
  type ExecutionPlanOptions,
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
  createTestCatalogIndex,
  type TestCatalogIndex,
} from './test-catalog-index';

export interface RunnerSessionAdapter<TResult> {
  execute(
    plan: ExecutionPlan,
  ): Promise<TResult>;
}

export interface RunnerSessionOptions
  extends ExecutionPlanOptions {}

export class RunnerSession<TResult> {
  private indexedCatalog:
    TestCatalog | null = null;

  private catalogIndexValue:
    TestCatalogIndex | null = null;

  constructor(
    private readonly getCatalogValue:
      () => TestCatalog,
    private readonly adapter:
      RunnerSessionAdapter<TResult>,
    private readonly getOptions:
      () => RunnerSessionOptions =
        () => ({}),
  ) {}

  catalog(): TestCatalog {
    return this.getCatalogValue();
  }

  index(): TestCatalogIndex {
    const catalog =
      this.catalog();

    if (
      catalog !== this.indexedCatalog ||
      !this.catalogIndexValue
    ) {
      this.indexedCatalog =
        catalog;

      this.catalogIndexValue =
        createTestCatalogIndex(
          catalog,
        );
    }

    return this.catalogIndexValue;
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

  plan(
    selector?: TestSelector,
  ): ExecutionPlan {
    return createExecutionPlan(
      this.catalog(),
      selector,
      this.getOptions(),
    );
  }

  planSpec(
    selector: string | RegExp,
  ): ExecutionPlan {
    return createSpecExecutionPlan(
      this.catalog(),
      selector,
      this.getOptions(),
    );
  }

  planSuite(
    selector: string | RegExp,
  ): ExecutionPlan {
    return createSuiteExecutionPlan(
      this.catalog(),
      selector,
      this.getOptions(),
    );
  }

  planFile(
    selector: string | RegExp,
  ): ExecutionPlan {
    return createFileExecutionPlan(
      this.catalog(),
      selector,
      this.getOptions(),
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
