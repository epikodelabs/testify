import type {
  ExecutionResult,
} from './execution-result';
import type {
  TestSelector,
} from './test-selection';
import {
  NodeExecutionEnvironmentHost,
} from './node-execution-environment-host';
import {
  NodeArtifactHost,
} from './node-artifact-host';
import {
  NodeRuntimeHost,
} from './node-runtime-host';
import {
  CoverageHost,
} from './coverage-host';

export interface NodeExecutionHostOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  file?: string;
  suppressConsoleLogs?: boolean;
  selector?: TestSelector;
}

export class NodeExecutionHost {
  constructor(
    private readonly artifacts:
      NodeArtifactHost,
    private readonly runtime:
      NodeRuntimeHost,
    private readonly coverage:
      CoverageHost,
  ) {}

  async run(
    reporter: jasmine.CustomReporter,
    options:
      NodeExecutionHostOptions = {},
  ): Promise<ExecutionResult> {
    const environment =
      new NodeExecutionEnvironmentHost({
        env: options.env,
        nodeEnv: 'test',
        suppressConsoleLogs:
          options.suppressConsoleLogs,
      });

    const result = await environment.run(
      async () => {
        const host =
          this.artifacts
            .resolveRunner(
              options.cwd,
              options.file,
            );

        const result =
          await this.runtime.run(
            host,
            reporter,
            options.selector,
          );

        return result;
      },
    );

    // The execution environment suppresses incidental test logging. Generate
    // coverage after it has restored the logger so the final report panel is
    // visible to the CLI user.
    await this.coverage.generateGlobal();

    return result;
  }
}
