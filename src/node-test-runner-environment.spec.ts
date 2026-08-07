import fs from 'fs';
import path from 'path';

describe('NodeTestRunner environment boundary', () => {
  it('delegates environment mutation and console suppression', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/node-test-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'new NodeExecutionEnvironmentHost(',
    );

    expect(source).not.toContain(
      'TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS',
    );

    expect(source).not.toContain(
      "process.env.NODE_ENV = 'test'",
    );

    expect(source).not.toContain(
      'Object.entries(\\n          this.options.env',
    );
  });
});
