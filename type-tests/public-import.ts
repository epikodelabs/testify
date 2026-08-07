import {
  RunnerSession,
  createExecutionPlan,
  createTestCatalogIndex,
  listCatalogTests,
  partitionExecutionPlan,
  resolveTestSelector,
  summarizeExecutionResults,
  type ExecutionPlan,
  type ExecutionResult,
  type TestCatalog,
  type TestSelector,
  type TestifyRunnerSession,
} from '@epikodelabs/testify';

const catalog: TestCatalog = {
  suites: [],
  specs: [],
};

const selector: TestSelector =
  'spec1';

const plan: ExecutionPlan =
  createExecutionPlan(
    catalog,
    selector,
  );

const partitions =
  partitionExecutionPlan(
    plan,
    2,
  );

const result: ExecutionResult =
  summarizeExecutionResults([]);

createTestCatalogIndex(
  catalog,
);

listCatalogTests(
  catalog,
);

resolveTestSelector(
  catalog,
  selector,
);

void RunnerSession;
void partitions;
void result;

declare const session:
  TestifyRunnerSession;

void session;
