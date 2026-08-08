import fs from 'fs';
import path from 'path';

describe('HMR source/test classification', () => {
  it('classifies specs by filename when srcDirs and testDirs overlap', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/hmr-manager.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      '/\\.spec\\\\.(?:ts|tsx|js|jsx|mts|cts|mjs)$/i',
    );

    expect(source).toContain(
      '!this.isTestFile(',
    );
  });

  it('does not classify every file in testDirs as a test', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/hmr-manager.ts',
        ),
        'utf8',
      );

    expect(source).not.toContain(
      'return normalized.startsWith(this.primaryTestDir);',
    );
  });
});
