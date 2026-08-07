import fs from 'fs';
import path from 'path';

describe('NodeTestRunner facade', () => {
  it('delegates artifacts and execution to hosts', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/node-test-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'new NodeArtifactHost(',
    );

    expect(source).toContain(
      'new NodeExecutionHost(',
    );

    expect(source).not.toContain(
      'createNodeRunnerModuleSource',
    );

    expect(source).not.toContain(
      'CoverageReportGenerator',
    );

    expect(source).not.toContain(
      'NodeExecutionEnvironmentHost',
    );
  });
});
