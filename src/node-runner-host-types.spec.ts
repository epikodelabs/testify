import type {
  ExecutionResult,
} from './execution-result';
import type {
  TestSelector,
} from './test-selection';
import {
  NodeRunnerHost,
} from './node-runner-host';

describe('NodeRunnerHost typed surface', () => {
  it('exposes one typed run operation', () => {
    const host =
      new NodeRunnerHost(
        'test-runner.mjs',
      );

    const run:
      (
        reporter: jasmine.CustomReporter,
        selector?: TestSelector,
      ) => Promise<ExecutionResult> =
        host.run.bind(host);

    void run;
  });
});
