import fs from 'fs';
import path from 'path';

describe('Node generated ESM artifacts', () => {
  it('uses .mjs for the generated Testify runner', () => {
    const artifactsSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/node-build-artifacts.ts',
        ),
        'utf8',
      );

    expect(artifactsSource).toContain(
      'test-runner.mjs',
    );
  });
});
