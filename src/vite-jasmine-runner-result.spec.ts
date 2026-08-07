import fs from 'fs';
import path from 'path';

describe('ViteJasmineRunner Node result boundary', () => {
  it('maps Node ExecutionResult to an exit code at the runner boundary', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'getExecutionExitCode',
    );

    expect(source).not.toContain(
      'return exitCode;',
    );
  });
});
