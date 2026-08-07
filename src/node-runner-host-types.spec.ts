import type {
  FileListRow,
  SuiteListRow,
  TestListRow,
} from './catalog-query';
import type {
  ExecutionResult,
} from './execution-result';
import {
  NodeRunnerHost,
} from './node-runner-host';

describe('NodeRunnerHost typed surfaces', () => {
  it('exposes typed query/result methods', () => {
    const host =
      new NodeRunnerHost(
        'test-runner.mjs',
      );

    const tests: TestListRow[] =
      host.listTests();

    const suites: SuiteListRow[] =
      host.listSuites();

    const files: FileListRow[] =
      host.listFiles();

    const result:
      ExecutionResult | null =
        host.getLastExecutionResult();

    void tests;
    void suites;
    void files;
    void result;
  });
});
