import { logger } from './logger';
import { ViteJasmineConfig } from "./vite-jasmine-config";
import type * as PlayWright from 'playwright';
import { EXIT_CODES, getSignalExitCode } from './exit-codes';
import { BrowserMessages } from './log-messages';

export class BrowserManager {
  private playwright: typeof PlayWright | null = null;
  private currentBrowser: PlayWright.Browser | null = null;
  private currentPage: PlayWright.Page | null = null;

  constructor(private config: ViteJasmineConfig) {}

  private async getPlaywright(): Promise<typeof PlayWright> {
    if (!this.playwright) {
      this.playwright = await import('playwright');
    }
    return this.playwright!;
  }

  async checkBrowser(browserName: string): Promise<PlayWright.BrowserType | null> {
    try {
      const playwright = await this.getPlaywright();
      
      let browser: PlayWright.BrowserType | null = null;
      switch (browserName.toLowerCase()) {
        case 'chromium':
        case 'chrome':
          browser = playwright.chromium;
          break;
        case 'firefox':
          browser = playwright.firefox;
          break;
        case 'webkit':
        case 'safari':
          browser = playwright.webkit;
          break;
        default:
          logger.println(BrowserMessages.unknownBrowserFallback(browserName));
          return null;
      }

      return browser;
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
    const browser = await browserType.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    page.setDefaultTimeout(0);

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
      if (!page.isClosed()) {
        void page.close().catch(() => {});
      }
      void browser.close().catch(() => {});
    };

    const sigintHandler = () => abortRun('SIGINT');
    const sigtermHandler = () => abortRun('SIGTERM');
    process.on('SIGINT', sigintHandler);
    process.on('SIGTERM', sigtermHandler);

    // Unified console and error logging
    page.on('console', (msg: any) => {
      const text = msg.text();
      const type = msg.type();
      if (text.match(/error|failed/i)) {
        if (type === 'error') logger.error(BrowserMessages.browserConsoleError(text));
        else if (type === 'warn') logger.println(BrowserMessages.browserConsoleWarn(text));
      }
    });

    page.on('pageerror', (error: any) => logger.error(BrowserMessages.pageError(error.message)));
    page.on('requestfailed', (request: any) => logger.error(BrowserMessages.requestFailed(request.url(), request.failure()?.errorText)));

    logger.println(BrowserMessages.navigatingToTestPage());
    await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle', timeout: 120000 });

    try {
      await Promise.race([
        page.waitForFunction(() => (window as any).jasmineFinished === true, {
          timeout: this.config.jasmineConfig?.env?.timeout ?? 120000
        }),
        interruptPromise
      ]);

      await new Promise(resolve => setTimeout(resolve, 500));
      await browser.close();
      
      return true; // Success determined by WebSocket messages
    } catch (error) {
      if (interrupted || error === interruptError) {
        logger.printRaw('\n\n');
        logger.println(BrowserMessages.testsAbortedByUser());
        await browser.close();
        return false;
      }
      logger.error(BrowserMessages.testExecutionFailed(error));
      await browser.close();
      throw error;
    } finally {
      process.removeListener('SIGINT', sigintHandler);
      process.removeListener('SIGTERM', sigtermHandler);
    }
  }

  async openBrowser(
    port: number,
    onBrowserClose?: () => Promise<void>,
    options?: { exitOnClose?: boolean }
  ): Promise<void> {
    let browserName = this.config.browser || 'chrome';
    const url = `http://localhost:${port}/index.html`;
    
    let browser: PlayWright.Browser | null = null;
    try {
      const playwright = await this.getPlaywright();
      let browserType: PlayWright.BrowserType | null = null;
      
      switch (browserName.toLowerCase()) {
        case 'chrome':
        case 'chromium':
          browserType = playwright.chromium;
          break;
        case 'firefox':
          browserType = playwright.firefox;
          break;
        case 'webkit':
        case 'safari':
          browserType = playwright.webkit;
          break;
        default:
          logger.println(BrowserMessages.unknownBrowserFallbackToChrome(browserName));
          browserType = playwright.chromium;
          browserName = 'chrome';
      }
      
      if (!browserType) {
        logger.println(BrowserMessages.browserNotInstalled(browserName));
        logger.println(BrowserMessages.browserInstallTip(browserName));
        return;
      }
      
      logger.println(BrowserMessages.openingBrowser(browserName));
      browser = await browserType.launch({ 
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
          if (exitOnClose && !onBrowserClose) {
            process.exit(EXIT_CODES.SUCCESS);
          }
        }).catch(() => {}).finally(() => {
          this.clearBrowserState();
        });
      });
      
    } catch (error: any) {
      if (browser && !browser.isConnected()) {
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
    if (!this.currentBrowser && !this.currentPage) {
      return;
    }

    try {
      if (this.currentBrowser) {
        await this.currentBrowser.close();
      } else if (this.currentPage && !this.currentPage.isClosed()) {
        await this.currentPage.close();
      }
    } catch (error: any) {
      logger.error(BrowserMessages.failedToCloseBrowser(error?.message ?? error));
    } finally {
      this.clearBrowserState();
    }
  }
}
