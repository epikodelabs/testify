import fs from 'fs';
import path from 'path';
import { RunnerMessages } from './log-messages';

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


  it('surfaces missing specs as a preparation warning rather than a successful discovery', () => {
    expect(
      RunnerMessages.noTestFilesFound('src'),
    ).toBe(
      '%warn% No matching spec files found in src. Nothing to run.',
    );
  });

  it('maps the no-specs preprocess result to a success exit code', () => {
    const successBranches =
      source.match(
        /if \(preprocessResult === 'no-specs'\) \{\s*(?:logger\.flushPreparation\(\);\s*)?return EXIT_CODES\.SUCCESS;\s*\}/g,
      ) ?? [];

    expect(
      successBranches.length,
    ).toBeGreaterThanOrEqual(2);
  });
});