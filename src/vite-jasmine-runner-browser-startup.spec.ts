import fs from 'fs';
import path from 'path';

describe('ViteJasmineRunner headed browser startup', () => {
  const source = fs.readFileSync(
    path.resolve(
      process.cwd(),
      'src/vite-jasmine-runner.ts',
    ),
    'utf8',
  );

  it('cleans up and returns an internal error when browser startup rejects', () => {
    const startupFailureBranches =
      source.match(
        /catch \{\s*await this\.cleanup\(\);\s*return EXIT_CODES\.INTERNAL_ERROR;\s*\}/g,
      ) ?? [];

    expect(
      startupFailureBranches.length,
    ).toBeGreaterThanOrEqual(2);
  });

  it('does not wait on headed completion promises before startup succeeds', () => {
    const watchOpen = source.indexOf(
      'await this.browserManager.openBrowser(',
      source.indexOf(
        'private async runWatchMode',
      ),
    );
    const watchWait = source.indexOf(
      'return watchFinishedPromise;',
      watchOpen,
    );

    const headedOpen = source.indexOf(
      'await this.browserManager.openBrowser(',
      source.indexOf(
        'private async runHeadedBrowserMode',
      ),
    );
    const headedWait = source.indexOf(
      'return runFinishedPromise;',
      headedOpen,
    );

    expect(watchOpen).toBeGreaterThan(-1);
    expect(watchWait).toBeGreaterThan(
      watchOpen,
    );
    expect(headedOpen).toBeGreaterThan(-1);
    expect(headedWait).toBeGreaterThan(
      headedOpen,
    );
  });
});
