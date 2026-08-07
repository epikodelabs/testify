import fs from 'fs';
import path from 'path';

describe('testify CLI default behavior', () => {
  it('runs CLIHandler when bin/testify is invoked without a command', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/index.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'CLIHandler.run()',
    );

    expect(source).not.toContain(
      "args.length === 0",
    );
  });
});
