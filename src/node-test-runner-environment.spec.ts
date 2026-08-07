import fs from 'fs';
import path from 'path';

describe('NodeTestRunner environment boundary', () => {
  it('delegates execution to NodeExecutionHost, which owns environment mutation', () => {
    const runnerSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/node-test-runner.ts',
        ),
        'utf8',
      );

    const executionSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/node-execution-host.ts',
        ),
        'utf8',
      );

    expect(runnerSource).toContain(
      'new NodeExecutionHost(',
    );

    expect(runnerSource).not.toContain(
      'new NodeExecutionEnvironmentHost(',
    );

    expect(executionSource).toContain(
      'new NodeExecutionEnvironmentHost(',
    );

    expect(runnerSource).not.toContain(
      "process.env.NODE_ENV = 'test'",
    );
  });
});
