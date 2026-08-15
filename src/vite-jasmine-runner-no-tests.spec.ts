import fs from 'fs';
import path from 'path';

describe('ViteJasmineRunner empty test discovery UX', () => {
  const source = fs.readFileSync(
    path.resolve(
      process.cwd(),
      'src/vite-jasmine-runner.ts',
    ),
    'utf8',
  );

  it('treats missing spec files as a clean no-op instead of a config error', () => {
    expect(source).toContain(
      "return 'no-specs';",
    );

    expect(source).not.toContain(
      "throw new ExitCodeError(EXIT_CODES.CONFIG_ERROR, 'No test files found');",
    );
  });

  it('maps the no-specs preprocess result to a success exit code', () => {
    const successBranches =
      source.match(
        /if \(preprocessResult === 'no-specs'\) \{\s*return EXIT_CODES\.SUCCESS;\s*\}/g,
      ) ?? [];

    expect(
      successBranches.length,
    ).toBeGreaterThanOrEqual(2);
  });
});
