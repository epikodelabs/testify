import { logger } from './logger';
import { ViteJasmineConfig } from "./vite-jasmine-config";
import type * as PlayWright from 'playwright';
import { EXIT_CODES, ExitCodeError } from './exit-codes';
import { BrowserMessages } from './log-messages';

export class BrowserManager {
  private playwright: typeof PlayWright | null = null;
  private currentBrowser: PlayWright.Browser | null = null;
  private currentPage: PlayWright.Page | null = null;
  private abortCallback: ((signal: NodeJS.Signals) => void) | null = null;

  constructor(private config: ViteJasmineConfig) {}

  private async getPlaywright(): Promise<typeof PlayWright> {
    if (!this.playwright) {
      this.playwright = await import('playwright');
    }
    return this.playwright!;
  }

  private resolveBrowserType(
    playwright: typeof PlayWright,
    name: string
  ): { type: PlayWright.BrowserType; normalized: string } | null {
    switch (name.toLowerCase()) {
      case 'chromium':
      case 'chrome':
        return { type: playwright.chromium, normalized: 'chrome' };
      case 'firefox':
        return { type: playwright.firefox, normalized: 'firefox' };
      case 'webkit':
      case 'safari':
        return { type: playwright.webkit, normalized: 'safari' };
      default:
        return null;
    }
  }

  async checkBrowser(browserName: string): Promise<PlayWright.BrowserType | null> {
    try {
      const playwright = await this.getPlaywright();
      const resolved = this.resolveBrowserType(playwright, browserName);
      if (!resolved) {
        logger.println(BrowserMessages.unknownBrowserFallback(browserName));
        return null;
      }
      return resolved.type;
    } catch (err: any) {
      if (err.code === 'MODULE_NOT_FOUND') {
        logger.println(BrowserMessages.playwrightNotInstalled(browserName));
        logger.println(BrowserMessages.playwrightInstallTip());
      } else {
        logger.error(BrowserMessages.browserExecutionFailed(browserName, err.message));
      }
      return null;
    }
  }

  async runHeadlessBrowserTests(browserType: PlayWright.BrowserType, port: number): Promise<boolean> {
    let browser: PlayWright.Browser | null = null;
    let interrupted = false;
    const interruptError = new Error('Interrupted');
    let interruptReject: ((error: Error) => void) | null = null;
    const interruptPromise = new Promise<never>((_, reject) => {
      interruptReject = reject;
    });

    const abortRun = (signal: NodeJS.Signals) => {
      if (interrupted) return;
      interrupted = true;
      if (interruptReject) {
        interruptReject(interruptError);
        interruptReject = null;
      }
    };
    this.abortCallback = abortRun;

    const sigintHandler = () => abortRun('SIGINT');
    const sigtermHandler = () => abortRun('SIGTERM');
    process.on('SIGINT', sigintHandler);
    process.on('SIGTERM', sigtermHandler);

    try {
      browser = await browserType.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.currentBrowser = browser;

      const page = await browser.newPage();
      page.setDefaultTimeout(0);

      // Unified console and error logging
      page.on('console', (msg: PlayWright.ConsoleMessage) => {
        const text = msg.text();
        const type = msg.type();
        if (text.match(/error|failed/i)) {
          if (type === 'error') logger.error(BrowserMessages.browserConsoleError(text));
          else if (type === 'warning') logger.println(BrowserMessages.browserConsoleWarn(text));
        }
      });

      page.on('pageerror', (error: Error) => logger.error(BrowserMessages.pageError(error.message)));
      page.on('requestfailed', (request: PlayWright.Request) => logger.error(BrowserMessages.requestFailed(request.url(), request.failure()?.errorText)));

      logger.println(BrowserMessages.navigatingToTestPage());
      await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle', timeout: 120000 });

      await Promise.race([
        page.waitForFunction(() => (window as any).jasmineFinished === true, {
          timeout: this.config.jasmineConfig?.env?.timeout ?? 120000
        }),
        interruptPromise
      ]);

      await new Promise(resolve => setTimeout(resolve, 500));

      return true; // Success determined by WebSocket messages
    } catch (error) {
      if (interrupted || error === interruptError) {
        logger.printRaw('\n\n');
        logger.println(BrowserMessages.testsAbortedByUser());
        throw new ExitCodeError(EXIT_CODES.SIGINT, 'Tests aborted by user');
      }
      logger.error(BrowserMessages.testExecutionFailed(error));
      throw error;
    } finally {
      this.abortCallback = null;
      process.removeListener('SIGINT', sigintHandler);
      process.removeListener('SIGTERM', sigtermHandler);
      if (browser) {
        await browser.close().catch(() => {});
      }
      this.currentBrowser = null;
    }
  }

  abort(signal: NodeJS.Signals): void {
    this.abortCallback?.(signal);
    // Also close any browser (headed, watch, or headless) immediately so the
    // process does not hang on long-running navigation/test execution.
    if (this.currentBrowser) {
      this.closeBrowser().catch(() => {});
    }
  }

  async openBrowser(
    port: number,
    onBrowserClose?: () => Promise<number | void>,
    options?: { exitOnClose?: boolean }
  ): Promise<void> {
    let browserName = this.config.browser || 'chrome';
    const url = `http://localhost:${port}/index.html`;

    let browser: PlayWright.Browser | null = null;
    try {
      const playwright = await this.getPlaywright();
      let resolved = this.resolveBrowserType(playwright, browserName);

      if (!resolved) {
        logger.println(BrowserMessages.unknownBrowserFallbackToChrome(browserName));
        resolved = { type: playwright.chromium, normalized: 'chrome' };
        browserName = 'chrome';
      }

      logger.println(BrowserMessages.openingBrowser(browserName));
      browser = await resolved.type.launch({
        headless: this.config.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      this.currentBrowser = browser;
      this.currentPage = page;
      await page.goto(url);

      // Handle browser close event (keep handler sync to avoid unhandled rejections)
      const exitOnClose = options?.exitOnClose !== false;
      page.on('close', () => {
        Promise.resolve(onBrowserClose?.()).then(() => {
          // The caller is responsible for process exit; do not kill the process here.
        }).catch(() => {}).finally(() => {
          this.clearBrowserState();
        });
      });

    } catch (error: any) {
      if (browser && browser.isConnected()) {
        await browser.close().catch(() => {});
      }
      if (error.code === 'MODULE_NOT_FOUND') {
        logger.println(BrowserMessages.playwrightNotInstalledManual(url));
        logger.println(BrowserMessages.playwrightAutoOpenTip());
      } else {
        logger.error(BrowserMessages.failedToOpenBrowser(error.message));
        logger.println(BrowserMessages.openBrowserManually(url));
      }
    }
  }

  private clearBrowserState(): void {
    this.currentPage = null;
    this.currentBrowser = null;
  }

  async closeBrowser(): Promise<void> {
    if (!this.currentBrowser) return;

    try {
      await this.currentBrowser.close();
    } catch (error: any) {
      logger.error(BrowserMessages.failedToCloseBrowser(error?.message ?? error));
    } finally {
      this.clearBrowserState();
    }
  }
}
