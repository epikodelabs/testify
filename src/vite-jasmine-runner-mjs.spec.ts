import fs from 'fs';
import path from 'path';

describe('ViteJasmineRunner mjs pipeline', () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        'src/vite-jasmine-runner.ts',
      ),
      'utf8',
    );

  it('strips the final .mjs before assigning Rolldown input keys', () => {
    expect(source).toContain(
      '/\\.mjs$/',
    );

    expect(source).not.toContain(
      "/\\.js$/",
    );
  });

  it('instruments generated .mjs source modules', () => {
    expect(source).toContain(
      '**/*.mjs',
    );

    expect(source).toContain(
      '/\\.spec\\.mjs$/i',
    );
  });
});
