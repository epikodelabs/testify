import { ConfigManager } from "./config-manager";
import * as path from "path";
import { logger } from "./console-repl";
import { ImportEntry, ViteJasmineConfig } from "./vite-jasmine-config";
import { ViteJasmineRunner } from "./vite-jasmine-runner";

export function createViteJasmineRunner(config: ViteJasmineConfig): ViteJasmineRunner {
  return new ViteJasmineRunner(config);
}

export class CLIHandler {
  static async run(): Promise<void> {
    const args = process.argv.slice(2);
    const helpRequested = args.includes('--help') || args.includes('-h');

    if (helpRequested) {
      this.printHelp();
      return;
    }
    const initOnly = args.includes('init');
    const watch = args.includes('--watch');
    const headless = args.includes('--headless');
    const coverage = args.includes('--coverage');
    const browserIndex = args.findIndex(a => a === '--browser');
    const silentLogs = args.includes('--silent') || args.includes('--quiet');
    const hasBrowserArg = browserIndex !== -1;
    let browserName: string = 'chrome';
    
    if (hasBrowserArg && browserIndex + 1 < args.length) {
      browserName = args[browserIndex + 1];
    }

    const preserveOutputsFlag = args.includes('--preserve');
    const preserveOutputsArg = preserveOutputsFlag ? true : undefined;

    // Handle init
    if (initOnly) {
      ConfigManager.initViteJasmineConfig();
      return;
    }

    // Enforce exclusivity of --watch
    if (watch) {
      const invalidFlags: string[] = [];
      if (headless) invalidFlags.push('--headless');
      if (coverage) invalidFlags.push('--coverage');
      
      if (invalidFlags.length > 0) {
        logger.error(`❌ The --watch flag cannot be used with: ${invalidFlags.join(', ')}`);
        process.exit(1);
      }
    }

    try {
      type RunnerConfig = ViteJasmineConfig;
      const normalizeDirConfig = (
        dirConfig: string | string[] | undefined,
        fallback: string
      ): string[] => {
        if (!dirConfig) return [fallback];
        if (Array.isArray(dirConfig)) {
          return dirConfig.length > 0 ? dirConfig : [fallback];
        }
        return [dirConfig];
      };

      let config = ConfigManager.loadViteJasmineBrowserConfig('ts-test-runner.json') as RunnerConfig;
      
      // Merge CLI args with config file, CLI takes precedence
      config = {
        ...config,
        headless: headless ? true : (config.headless || false),
        coverage: coverage ? true : (config.coverage || false),
        browser: hasBrowserArg ? browserName : (config.browser || 'chrome'),
        watch: watch ? true : (config.watch || false),
        suppressConsoleLogs: silentLogs ? true : config.suppressConsoleLogs,
        srcDirs: normalizeDirConfig(config.srcDirs, './src'),
        testDirs: normalizeDirConfig(config.testDirs, './tests'),
        preserveOutputs: preserveOutputsArg ?? !!config.preserveOutputs,
      };

      if (config.preserveOutputs) {
        logger.println(`🛑 Preserve outputs enabled (skip regenerating index.html and test-runner.js when present).`);
      }

      const runner = createViteJasmineRunner(config);

      if (watch) {
        await runner.watch();
      } else {
        await runner.start();
      }
    } catch (error) {
      logger.error(`❌ Failed to start test runner: ${error}`);
      process.exit(1);
    }
  }

  private static printHelp(): void {
    logger.println('ts-test-runner — run your Jasmine tests across browsers, headless, or Node.js.');
    logger.println('');
    logger.println('Usage:');
    logger.println('  npx ts-test-runner [options]');
    logger.println('  npx ts-test-runner init               # scaffold ts-test-runner.json');
    logger.println('');
    logger.println('Options:');
    logger.println('  --headless           Run tests in the default Playwright browser without UI');
    logger.println('  --browser <name>     Target browser (chrome|chromium|firefox|webkit)');
    logger.println('  --watch              Launch browser mode + HMR for rapid feedback (cannot be headless)');
    logger.println('  --coverage           Generate Istanbul coverage reports after the run');
    logger.println('  --silent / --quiet    Suppress console logs when running in Node.js mode');
    logger.println('  --preserve           Skip regenerating index.html and test-runner.js when outputs exist');
    logger.println('  --help, -h           Show this help message');
    logger.println('');
    logger.println('Configuration:');
    logger.println('  ts-test-runner.json keeps your src/test dirs, browser, port, coverage, and HTML options.');
    logger.println('  Use --preserve after the first run if you need to debug manually generated assets.');
    logger.println('');
    logger.println('Tip:');
    logger.println('  npx ts-test-runner --headless --browser node   # fastest Node.js test execution');
    logger.println('  npx ts-test-runner --headless                  # run headless Chrome for browser APIs');
    logger.println('');
    logger.println('Playwright Browsers:');
    logger.println('  npx playwright install                         # install all supported browsers');
    logger.println('  npx playwright install chromium                # install only Chromium');
  }
}
