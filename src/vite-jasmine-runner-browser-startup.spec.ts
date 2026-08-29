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

  it('logs, cleans up, and returns an internal error when browser startup rejects', () => {
    const watchSection = source.slice(
      source.indexOf('private async runWatchMode'),
      source.indexOf('private async runHeadlessBrowserMode'),
    );
    const headedSection = source.slice(
      source.indexOf('private async runHeadedBrowserMode'),
    );

    for (const section of [
      watchSection,
      headedSection,
    ]) {
      expect(section).toContain(
        'await this.browserManager.openBrowser(',
      );
      expect(section).toContain(
        'logger.error(',
      );
      expect(section).toContain(
        'await this.cleanup();',
      );
      expect(section).toContain(
        'return EXIT_CODES.INTERNAL_ERROR;',
      );
    }
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