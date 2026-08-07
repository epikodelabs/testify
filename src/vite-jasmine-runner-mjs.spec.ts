import fs from 'fs';
import path from 'path';

describe('ViteJasmineRunner mjs pipeline', () => {
  it('strips the final .mjs before assigning Rollup input keys', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      ".replace(\\n            /\\\\.mjs$/,",
    );

    expect(source).not.toContain(
      ".replace(/\\\\.js$/, '')",
    );
  });

  it('instruments generated .mjs source modules', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      "'**/*.mjs'",
    );

    expect(source).toContain(
      '/\\\\.spec\\\\.mjs$/i',
    );
  });
});
