import fs from 'fs';
import path from 'path';

describe('NodeTestRunner execution-plan integration', () => {
  it('routes generated execution through ExecutionPlan', () => {
    const source = fs.readFileSync(
      path.resolve(
        process.cwd(),
        'src/node-test-runner.ts',
      ),
      'utf8',
    );

    expect(source).toContain(
      'createExecutionPlan(',
    );

    expect(source).toContain(
      'executeNodePlan(',
    );

    expect(source).not.toContain(
      'await jasmineEnv.execute();',
    );
  });
});
