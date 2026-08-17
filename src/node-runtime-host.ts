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
  async run(
    host: NodeRunnerHost,
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<ExecutionResult> {
    if (process.env.TESTIFY_DEBUG === '1') {
      console.error(
        '[Testify debug] runner file:',
        host.file,
      );
    }

    try {
      await host.load();
    } catch (error) {
      if (process.env.TESTIFY_DEBUG === '1') {
        console.error(
          '[Testify debug] failure occurred while loading test-runner.mjs',
        );
      }
      throw error;
    }

    if (process.env.TESTIFY_DEBUG === '1') {
      console.error(
        '[Testify debug] generated runner loaded; starting run()',
      );
    }

    try {
      return await host.run(
        reporter,
        selector,
      );
    } catch (error) {
      if (process.env.TESTIFY_DEBUG === '1') {
        console.error(
          '[Testify debug] failure occurred inside run():',
          error instanceof Error
            ? error.stack ??
              error.message
            : error,
        );
      }
      throw error;
    }
  }
}
