import {
  BrowserManager,
} from './browser-manager';
import type {
  ViteJasmineConfig,
} from './vite-jasmine-config';
import { logger } from './logger';

describe('BrowserManager headed startup', () => {
  function createManager(): BrowserManager {
    return new BrowserManager({
      browser: 'chrome',
      headless: false,
    } as ViteJasmineConfig);
  }

  it('propagates browser launch failures', async () => {
    spyOn(logger, 'println');
    spyOn(logger, 'error');
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
    spyOn(logger, 'println');
    spyOn(logger, 'error');
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

  it('buffers page errors during a completed headless run instead of logging over live results', async () => {
    const errorSpy = spyOn(logger, 'error');
    spyOn(logger, 'warn');
    spyOn(logger, 'println');
    const manager = new BrowserManager({
      browser: 'chrome',
      headless: true,
      jasmineConfig: {
        env: {
          timeout: 1000,
        },
      },
    } as ViteJasmineConfig);

    const handlers = new Map<string, (...args: any[]) => void>();
    const page = {
      setDefaultTimeout() {},
      on(event: string, handler: (...args: any[]) => void) {
        handlers.set(event, handler);
      },
      async goto() {
        handlers.get('pageerror')?.(
          new Error('rejected from spec'),
        );
      },
      async waitForFunction() {},
    };
    const browser = {
      async newPage() {
        return page;
      },
      async close() {},
    };
    const browserType = {
      async launch() {
        return browser;
      },
    };

    await expectAsync(
      manager.runHeadlessBrowserTests(
        browserType as any,
        8888,
      ),
    ).toBeResolvedTo(true);

    expect(errorSpy).not.toHaveBeenCalled();
  });


  it('logs buffered page errors when the headless browser session itself fails', async () => {
    const errorSpy = spyOn(logger, 'error');
    spyOn(logger, 'warn');
    spyOn(logger, 'println');
    const manager = new BrowserManager({
      browser: 'chrome',
      headless: true,
      jasmineConfig: {
        env: {
          timeout: 1000,
        },
      },
    } as ViteJasmineConfig);

    const handlers = new Map<string, (...args: any[]) => void>();
    const sessionFailure =
      new Error('browser session failed');
    const page = {
      setDefaultTimeout() {},
      on(event: string, handler: (...args: any[]) => void) {
        handlers.set(event, handler);
      },
      async goto() {
        handlers.get('pageerror')?.(
          new Error('rejected before jasmine completed'),
        );
      },
      async waitForFunction() {
        throw sessionFailure;
      },
    };
    const browser = {
      async newPage() {
        return page;
      },
      async close() {},
    };
    const browserType = {
      async launch() {
        return browser;
      },
    };

    await expectAsync(
      manager.runHeadlessBrowserTests(
        browserType as any,
        8888,
      ),
    ).toBeRejectedWith(
      sessionFailure,
    );

    expect(
      errorSpy.calls.allArgs()
        .flat()
        .join('\n'),
    ).toContain(
      'rejected before jasmine completed',
    );
  });

});
