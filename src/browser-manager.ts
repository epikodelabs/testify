import { spawn, execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { logger } from './logger';
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { sanitizeTerminalText } from './utils';
import type * as PlayWright from 'playwright';
import { EXIT_CODES, ExitCodeError } from './exit-codes';
import { BrowserMessages } from './log-messages';

const runtimeRequire = createRequire(import.meta.url);

export class BrowserManager {
  private playwright: typeof PlayWright | null = null;
  private currentBrowser: PlayWright.Browser | null = null;
  private currentPage: PlayWright.Page | null = null;
  private abortCallback: ((signal: NodeJS.Signals) => void) | null = null;
  private installChild: ReturnType<typeof spawn> | null = null;
  private abortSignal: NodeJS.Signals | null = null;

  constructor(private config: ViteJasmineConfig) {}

  private assertActive(): void {
    if (this.abortSignal) throw new ExitCodeError(
      this.abortSignal === 'SIGTERM' ? EXIT_CODES.SIGTERM : EXIT_CODES.SIGINT,
      'Tests aborted by user',
    );
  }

  private async getPlaywright(): Promise<typeof PlayWright> {
    if (!this.playwright) {
      this.playwright = await import('playwright');
    }
    return this.playwright!;
  }

  private resolveBrowserType(
    playwright: typeof PlayWright,
    name: string
  ): {
    type: PlayWright.BrowserType;
    normalized: string;
    installName: 'chromium' | 'firefox' | 'webkit';
  } | null {
    switch (name.toLowerCase()) {
      case 'chromium':
      case 'chrome':
        return {
          type: playwright.chromium,
          normalized: 'chrome',
          installName: 'chromium',
        };
      case 'firefox':
        return {
          type: playwright.firefox,
          normalized: 'firefox',
          installName: 'firefox',
        };
      case 'webkit':
      case 'safari':
        return {
          type: playwright.webkit,
          normalized: 'safari',
          installName: 'webkit',
        };
      default:
        return null;
    }
  }

  async checkBrowser(browserName: string): Promise<PlayWright.BrowserType | null> {
    try {
      this.assertActive();
      const playwright = await this.getPlaywright();
      const resolved = this.resolveBrowserType(playwright, browserName);
      if (!resolved) {
        logger.warn(BrowserMessages.unknownBrowserFallback(browserName));
        return null;
      }
      await this.ensureBrowserInstalled(resolved.type, resolved.installName);
      this.assertActive();
      return resolved.type;
    } catch (err: any) {
      if (this.abortSignal) this.assertActive();
      if (err.code === 'MODULE_NOT_FOUND') {
        logger.println(BrowserMessages.playwrightNotInstalled(browserName));
        logger.println(BrowserMessages.playwrightInstallTip());
      } else {
        logger.error(BrowserMessages.browserExecutionFailed(browserName, err.message));
      }
      return null;
    }
  }

  /** Install only the browser revision required by this local Playwright copy. */
  private async ensureBrowserInstalled(
    browserType: PlayWright.BrowserType,
    browserName: 'chromium' | 'firefox' | 'webkit',
  ): Promise<void> {
    const executablePath = browserType.executablePath?.();
    if (!executablePath || existsSync(executablePath)) return;

    const playwrightPackage = runtimeRequire.resolve('playwright/package.json');
    const cliPath = join(dirname(playwrightPackage), 'cli.js');

    // The installer draws its own progress (carriage returns, ANSI, multi-line
    // bars). Inheriting stdout would interleave that with the cursor-diffed
    // preparation card and corrupt the layout, so capture it instead and only
    // surface a compact tail when the install actually fails.
    logger.preparationStep('BROWSER', BrowserMessages.installingBrowserRevision(browserName));
    let captured = '';
    const capture = (chunk: Buffer | string): void => {
      captured = (captured + chunk.toString()).slice(-64 * 1024);
    };

    await new Promise<void>((resolve, reject) => {
      const install = spawn(
        process.execPath,
        [cliPath, 'install', browserName],
        { stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32', windowsHide: true },
      );
      this.installChild = install;
      install.stdout?.on('data', capture);
      install.stderr?.on('data', capture);
      install.once('error', (error) => {
        this.installChild = null;
        reject(error);
      });
      install.once('close', (code) => {
        this.installChild = null;
        if (code === 0) resolve();
        else {
          const tail = sanitizeTerminalText(captured).split('\n').filter(Boolean).slice(-15).join('\n');
          reject(new Error(
            `Playwright browser installation exited with code ${code ?? 'unknown'}.` +
            (tail ? `\n${tail}` : ''),
          ));
        }
      });
    });

    if (!existsSync(executablePath)) {
      throw new Error(`Playwright did not install ${browserName} at ${executablePath}.`);
    }

    logger.preparationComplete('BROWSER', BrowserMessages.installedBrowserRevision(browserName));
  }

  async runHeadlessBrowserTests(browserType: PlayWright.BrowserType, port: number): Promise<boolean> {
    let browser: PlayWright.Browser | null = null;
    let interrupted = false;
    let interruptSignal: NodeJS.Signals | null = null;
    const interruptError = new Error('Interrupted');
    let interruptReject: ((error: Error) => void) | null = null;
    const interruptPromise = new Promise<never>((_, reject) => {
      interruptReject = reject;
    });
    // A signal can arrive while launch/newPage/goto are still pending, before
    // Promise.race below ever consumes this promise. Attach a no-op handler so
    // the early rejection is not also reported as an unhandledRejection.
    interruptPromise.catch(() => {
      // Intentionally observed here; the race below propagates cancellation.
    });

    const abortRun = (signal: NodeJS.Signals) => {
      if (interrupted) return;
      interrupted = true;
      interruptSignal = signal;
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

    const pageErrors: Error[] = [];

    try {
      const launching = browserType.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }).then(async (launched) => {
        if (interrupted) {
          await launched.close();
          throw interruptError;
        }
        return launched;
      });
      browser = await Promise.race([launching, interruptPromise]);
      this.currentBrowser = browser;

      const page = await Promise.race([browser.newPage(), interruptPromise]);
      page.setDefaultTimeout(0);

      // Unified console and error logging
      page.on('console', (msg: PlayWright.ConsoleMessage) => {
        const text = msg.text();
        const type = msg.type();
        if (text.match(/error|failed/i)) {
          if (type === 'error') logger.error(BrowserMessages.browserConsoleError(text));
          else if (type === 'warning') logger.warn(BrowserMessages.browserConsoleWarn(text));
        }
      });

      // Browser test failures are reported through the in-page Jasmine bridge.
      // Keep Playwright's duplicate pageerror signal buffered so it cannot
      // overwrite the reporter-owned live TEST RESULTS surface. If the browser
      // session itself fails before Jasmine can finish, the buffered error is
      // emitted from the catch path below.
      page.on('pageerror', (error: Error) => {
        pageErrors.push(error);
      });
      page.on('requestfailed', (request: PlayWright.Request) => logger.error(BrowserMessages.requestFailed(request.url(), request.failure()?.errorText)));

      // 'load' rather than 'networkidle': the runner page keeps long-lived
      // connections (WebSocket bridge, HMR), so the network never idles and
      // this navigation would time out even after a fully green run. Test
      // completion is awaited explicitly via the jasmineFinished probe below.
      await Promise.race([
        page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'load', timeout: 120000 }),
        interruptPromise,
      ]);

      await Promise.race([
        page.waitForFunction(() => (window as any).jasmineFinished === true, undefined, {
          timeout: this.config.jasmineConfig?.env?.timeout ?? 120000
        }),
        interruptPromise
      ]);

      await new Promise(resolve => setTimeout(resolve, 500));

      // A passing run can still carry page-level errors the spec results never
      // captured (a bridge crash after jasmineFinished, for example). They were
      // buffered to protect the live results table; surface them now.
      const seenPageErrors = new Set<string>();
      for (const pageError of pageErrors) {
        const signature = pageError.stack ?? pageError.message;
        if (seenPageErrors.has(signature)) continue;
        seenPageErrors.add(signature);
        logger.warn(BrowserMessages.pageErrorDuringPassingRun(pageError.message));
      }

      return true; // Success determined by WebSocket messages
    } catch (error) {
      if (interrupted || error === interruptError) {
        throw new ExitCodeError(
          interruptSignal === 'SIGTERM' ? EXIT_CODES.SIGTERM : EXIT_CODES.SIGINT,
          'Tests aborted by user',
        );
      }
      const seenPageErrors = new Set<string>();
      for (const pageError of pageErrors) {
        const signature = pageError.stack ?? pageError.message;
        if (seenPageErrors.has(signature)) continue;
        seenPageErrors.add(signature);
        logger.error(
          BrowserMessages.pageError(
            pageError.message,
          ),
        );
      }
      // The runner's catch owns the session-level diagnostic; rethrow only, so
      // the same failure is not rendered twice.
      throw error;
    } finally {
      this.abortCallback = null;
      process.removeListener('SIGINT', sigintHandler);
      process.removeListener('SIGTERM', sigtermHandler);
      if (browser) {
        await browser.close().catch((error) => {
          logger.error(BrowserMessages.browserCloseFailed(error));
        });
      }
      this.currentBrowser = null;
    }
  }

  abort(signal: NodeJS.Signals): void {
    this.abortSignal ??= signal;
    this.abortCallback?.(signal);
    // An in-flight browser download must not outlive the aborted run.
    const installer = this.installChild;
    if (installer?.pid) {
      if (process.platform === 'win32') {
        execFile('taskkill', ['/PID', String(installer.pid), '/T', '/F'], { windowsHide: true }, (error) => {
          if (error && this.installChild === installer) {
            logger.warn(`Unable to stop the browser installer tree: ${error.message}`);
            installer.kill();
          }
        });
      } else {
        try {
          process.kill(-installer.pid, 'SIGTERM');
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ESRCH') {
            logger.warn(`Unable to stop the browser installer tree: ${String(error)}`);
            installer.kill();
          }
        }
      }
    } else {
      installer?.kill();
    }
    // Also close any browser (headed, watch, or headless) immediately so the
    // process does not hang on long-running navigation/test execution.
    if (this.currentBrowser) {
      this.closeBrowser().catch((error) => {
        logger.error(BrowserMessages.browserCloseFailed(error));
      });
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
      this.assertActive();
      const playwright = await this.getPlaywright();
      let resolved = this.resolveBrowserType(playwright, browserName);

      if (!resolved) {
        logger.warn(BrowserMessages.unknownBrowserFallbackToChrome(browserName));
        resolved = {
          type: playwright.chromium,
          normalized: 'chrome',
          installName: 'chromium',
        };
        browserName = 'chrome';
      }

      await this.ensureBrowserInstalled(
        resolved.type,
        resolved.installName,
      );
      this.assertActive();

      browser = await resolved.type.launch({
        headless: this.config.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.currentBrowser = browser;
      this.assertActive();

      const page = await browser.newPage();
      this.currentBrowser = browser;
      this.currentPage = page;
      await page.goto(url);

      // Handle browser close event (keep handler sync to avoid unhandled rejections)
      const exitOnClose = options?.exitOnClose !== false;
      page.on('close', () => {
        Promise.resolve(onBrowserClose?.()).then(() => {
          // The caller is responsible for process exit; do not kill the process here.
        }).catch((error) => {
          logger.error(BrowserMessages.browserCloseCallbackFailed(error));
        }).finally(() => {
          this.clearBrowserState();
        });
      });

    } catch (error: any) {
      if (browser && browser.isConnected()) {
        await browser.close().catch((closeError) => {
          logger.error(BrowserMessages.browserCloseFailed(closeError));
        });
      }

      this.clearBrowserState();

      if (this.abortSignal) this.assertActive();

      if (error.code === 'MODULE_NOT_FOUND') {
        logger.println(BrowserMessages.playwrightNotInstalled(browserName));
        logger.println(BrowserMessages.playwrightInstallTip());
      } else {
        logger.error(
          BrowserMessages.failedToOpenBrowser(
            error?.message ?? String(error),
          ),
        );
      }

      throw error;
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
