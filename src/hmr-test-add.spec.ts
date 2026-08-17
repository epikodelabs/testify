import fs from 'fs';
import path from 'path';

describe('HMR new spec contract', () => {
  it('awaits the rebuild before completing a file-add operation', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/hmr-manager.ts',
        ),
        'utf8',
      );

    expect(source.replace(/\s+/g, '')).toContain(
      "awaitthis.queueRebuild(filePath,'add',",
    );
  });

  it('keeps added specs on the spec-entry rebuild path', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/hmr-manager.ts',
        ),
        'utf8',
      );

    expect(source.replace(/\s+/g, '')).toContain(
      '.createViteConfigForFiles(validTestFiles,',
    );

    expect(source).not.toContain(
      '[...validSourceFiles, ...validTestFiles]',
    );
  });
});
