import type {
  ExecutionResult,
} from './execution-result';
import type {
  TestSelector,
} from './test-selection';
import type {
  NodeRunnerHost,
} from './node-runner-host';

export class NodeRuntimeHost {
  async execute(
    host: NodeRunnerHost,
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<ExecutionResult> {
    await host.load();

    return host.execute(
      reporter,
      selector,
    );
  }
}
