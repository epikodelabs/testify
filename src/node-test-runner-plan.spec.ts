import fs from 'fs';
import path from 'path';
import {
  createNodeRunnerModuleSource,
} from './node-runner-module-source';

describe('NodeTestRunner execution-plan integration', () => {
  it('keeps planning in the generated Node runner and delegates execution through NodeExecutionHost', () => {
    const runnerSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/node-test-runner.ts',
        ),
        'utf8',
      );

    expect(
      runnerSource,
    ).toContain(
      'NodeExecutionHost',
    );

    expect(
      runnerSource,
    ).toContain(
      'selector:',
    );

    const generatedSource =
      createNodeRunnerModuleSource({
        jasmineCoreUrl:
          'file:///jasmine-core.mjs',
        imports: '',
        config: {
          browser: 'node',
          outDir:
            './dist/.vite-jasmine-build',
          srcDirs: ['./src'],
          testDirs: ['./src'],
          exclude: [],
          jasmineConfig: {
            env: {
              random: false,
              seed: 0,
              stopSpecOnExpectationFailure:
                false,
            },
          },
        } as any,
      });

    expect(
      generatedSource,
    ).toContain(
      'createExecutionPlan(',
    );

    expect(
      generatedSource,
    ).toContain(
      'executeNodePlan(',
    );
  });
});
