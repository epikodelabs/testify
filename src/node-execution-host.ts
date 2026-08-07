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

  async execute(
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

    return environment.run(
      async () => {
        const host =
          this.artifacts
            .resolveRunner(
              options.cwd,
              options.file,
            );

        const result =
          await this.runtime.execute(
            host,
            reporter,
            options.selector,
          );

        await this.coverage
          .generateGlobal();

        return result;
      },
    );
  }
}
