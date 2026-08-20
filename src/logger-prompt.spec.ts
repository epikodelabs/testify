import fs from 'fs';
import path from 'path';

describe('Logger prompt styling', () => {
  const source = fs.readFileSync(
    path.resolve(
      process.cwd(),
      'src/logger.ts',
    ),
    'utf8',
  );

  it('uses a thicker prompt marker for interactive output', () => {
    expect(source).toContain(
      "> ",
    );
    expect(source).toContain(
      "plainPrompt = '> '",
    );
  });
});
