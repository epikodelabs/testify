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
    console.error(
      '[Testify debug] runner file:',
      host.file,
    );

    try {
      await host.load();
    } catch (error) {
      console.error(
        '[Testify debug] failure occurred while loading test-runner.mjs',
      );
      throw error;
    }

    console.error(
      '[Testify debug] generated runner loaded; starting runTests()',
    );

    try {
      return await host.execute(
        reporter,
        selector,
      );
    } catch (error) {
      console.error(
        '[Testify debug] failure occurred inside runTests():',
        error instanceof Error
          ? error.stack ??
            error.message
          : error,
      );
      throw error;
    }
  }
}