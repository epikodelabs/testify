import {
  BrowserManager,
} from './browser-manager';
import type {
  ViteJasmineConfig,
} from './vite-jasmine-config';

describe('BrowserManager headed startup', () => {
  function createManager(): BrowserManager {
    return new BrowserManager({
      browser: 'chrome',
      headless: false,
    } as ViteJasmineConfig);
  }

  it('propagates browser launch failures', async () => {
    const manager = createManager();
    const failure = new Error(
      'browser launch failed',
    );

    (manager as any).getPlaywright =
      async () => ({
        chromium: {
          async launch() {
            throw failure;
          },
        },
      });

    await expectAsync(
      manager.openBrowser(8888),
    ).toBeRejectedWith(failure);

    expect(
      (manager as any).currentBrowser,
    ).toBeNull();
    expect(
      (manager as any).currentPage,
    ).toBeNull();
  });

  it('closes and clears a browser when navigation fails', async () => {
    const manager = createManager();
    const failure = new Error(
      'navigation failed',
    );
    let closes = 0;

    const browser = {
      isConnected: () => true,
      async close() {
        closes++;
      },
      async newPage() {
        return {
          async goto() {
            throw failure;
          },
          on() {},
        };
      },
    };

    (manager as any).getPlaywright =
      async () => ({
        chromium: {
          async launch() {
            return browser;
          },
        },
      });

    await expectAsync(
      manager.openBrowser(8888),
    ).toBeRejectedWith(failure);

    expect(closes).toBe(1);
    expect(
      (manager as any).currentBrowser,
    ).toBeNull();
    expect(
      (manager as any).currentPage,
    ).toBeNull();
  });
});
