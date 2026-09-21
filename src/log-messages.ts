// ─── Emoji/symbol placeholders ────────────────────────────────────────────────
// Replace these with actual emoji or terminal symbols at render time if desired.
// They are intentionally kept as plain ASCII placeholders so the strings remain
// portable and easy to localise / override.
import { toConsoleSafe } from './ascii-sanitizer';

// %checked%       → ✅  (success / done)
// %cross%         → x  (error / failure)
// %error%         → ERROR prompt (logger-resolved)
// %warn%          → WARN prompt (logger-resolved)
// %info%          → 💡  (informational)
// %globe%         → 🌐  (browser / network)
// %doc%           → 📄  (file / document)
// %puzzle%        → 🧩  (suite tree)
// %stop%          → 🛑  (abort / halt)
// %bulb%          → 📌  (tip / hint)
// %rocket%        → 🚀  (launch / start)
// %hourglass%     → ⏳  (waiting / retry)
// %circle_green%  → 🟢  (process ready)
// %plus%          → ➕  (added)
// %minus%         → ➖  (removed)
// %folder%        → 📁  (directory)
// %box%           → 📦  (build / package)
// %refresh%       → 🔄  (reload / restart)
// %broom%         → 🧹  (cleanup / stale)
// %lock%          → 🔒  (lock / terminate)
// %fire%          → 🔥  (HMR)
// %satellite%     → 📡  (server ready)
// %ok%            → 👌  (ready / hint)
// %eyes%          → 👀  (watch mode)
// %plug%          → 🔌  (connected)

// ─── browser-manager.ts ───────────────────────────────────────────────────────

export const BrowserMessages = {
  unknownBrowserFallback: (name: string) =>
    `%warn% Unknown browser "${name}", falling back to Node.js mode`,

  playwrightNotInstalled: (name: string) =>
    `%info% Playwright runtime not available. Browser "${name}" not available.`,

  playwrightInstallTip: () =>
    `%bulb% Tip: Reinstall dependencies, then install browsers explicitly:\n   npx playwright install`,

  browserExecutionFailed: (name: string, message: string) =>
    `%error% Browser execution failed for "${name}": ${message}`,

  navigatingToTestPage: () =>
    `%globe% Navigating to test page...`,

  testsAbortedByUser: () =>
    `%stop% Tests aborted by user (Ctrl+C)`,

  browserCloseFailed: (error: unknown) =>
    `Failed to close browser: ${error instanceof Error ? error.message : String(error)}`,
  browserCloseCallbackFailed: (error: unknown) =>
    `Browser close callback failed: ${error instanceof Error ? error.message : String(error)}`,
  testExecutionFailed: (error: unknown) =>
    `%error% Test execution failed: ${error}`,

  browserConsoleError: (text: string) =>
    `%error% ${text}`,

  browserConsoleWarn: (text: string) =>
    `%warn% ${text}`,

  pageError: (message: string) =>
    `%error% Page error: ${message}`,

  requestFailed: (url: string, errorText: string | undefined) =>
    `%error% ${url}, ${errorText}`,

  unknownBrowserFallbackToChrome: (name: string) =>
    `%warn%  Unknown browser "${name}", using Chrome instead`,

  browserNotInstalled: (name: string) =>
    `%error% Browser "${name}" is not installed.`,

  browserInstallTip: (name: string) =>
    `%bulb% Tip: Install it by running: npx playwright install ${name.toLowerCase()}`,

  openingBrowser: (name: string) =>
    `%globe% Opening ${name} browser...`,

  playwrightNotInstalledManual: (url: string) =>
    `%info% Playwright runtime not available. Please open browser manually: ${url}`,

  playwrightAutoOpenTip: () =>
    `%bulb% Tip: Install browsers explicitly to enable automatic browser opening:\n   npx playwright install`,

  failedToOpenBrowser: (message: string) =>
    `%error% Failed to open browser: ${message}`,

  openBrowserManually: (url: string) =>
    `%bulb% Please open browser manually: ${url}`,

  failedToCloseBrowser: (error: unknown) =>
    `%error% Failed to close browser: ${error}`,
};

// ─── cli-handler.ts ───────────────────────────────────────────────────────────

export const CLIMessages = {
  invalidSeed: () =>
    `%error% Invalid --seed value (expected a number).`,

  failedToInitializeProject: (error: unknown) =>
    `%error% Failed to initialize testify config: ${error}`,

  browserArgMissing: () =>
    `%error% --browser requires a browser name (chrome|chromium|firefox|webkit|node).`,

  projectArgMissing: () =>
    `%error% --project requires a package name or path.`,

  portArgMissing: () =>
    `%error% --port requires a number between 1 and 65535.`,

  invalidPort: () =>
    `%error% Invalid --port value (expected an integer between 1 and 65535).`,

  configArgMissing: () =>
    `%error% --config requires a path to a config file.`,

  timeoutArgMissing: () =>
    `%error% --timeout requires a number of milliseconds.`,

  invalidTimeout: () =>
    `%error% Invalid --timeout value (expected a positive integer, in milliseconds).`,

  fileArgMissing: () =>
    `%error% --file / -f requires a spec filename.`,

  suiteArgMissing: () =>
    `%error% --suite / -s requires a suite name.`,

  unknownCommand: (command: string) =>
    `%error% Unknown command: ${command}`,

  invalidArguments: (error: unknown) =>
    `%error% Invalid command line arguments: ${error instanceof Error ? error.message : String(error)}`,

  watchIncompatibleFlags: (flags: string[]) =>
    `%error% The --watch flag cannot be used with: ${flags.join(', ')}`,

  couldNotResolveProject: (name: string) =>
    `%error% Could not resolve project "${name}". It is not a directory and not a known package name.`,

  preserveOutputsEnabled: () =>
    `%info% Preserve outputs enabled (skip regenerating index.html and test-runner.mjs when present).`,

  failedToStartTestRunner: (error: unknown) =>
    `%error% Failed to start test runner: ${toConsoleSafe(String(error))}`,

  // Help text — kept as a single block so the caller can println() each line
  helpLines: (): string[] => [
    'testify - simple test execution for real browsers and Node.js.',
    '',
    'Usage:',
    '  npx testify [options]',
    '  npx testify init               # prepare editor and debugging support',
    '',
    'Options:',
    '  --headless           Run tests in the default Playwright browser without UI',
    '  --browser, -b <name> Target browser (chrome|chromium|firefox|webkit|node)',
    '  --watch, -w          Launch browser mode + HMR for rapid feedback (cannot be headless)',
    '  --coverage, -c       Generate Istanbul coverage reports after the run',
    '  --file, -f <file>    Run specs from the matching spec filename',
    '  --suite, -s <name>   Run the matching suite (descendants included)',
    '  --seed <number>      Seed used for randomization order',
    '  --random             Force randomized spec order (overrides testify.json)',
    '  --no-random          Force sequential spec order (overrides testify.json)',
    '  --bail               Stop on the first expectation failure',
    '  --timeout <ms>       Per-spec timeout, in milliseconds',
    '  --port <number>      Override the runner port',
    '  --silent, --quiet, -q  Suppress console logs when running in Node.js mode',
    '  --preserve           Skip regenerating index.html and test-runner.mjs when outputs exist',
    '  --ansi               Use plain ASCII output (no colors, emoji, or cursor control)',
    '  --project, -p <name> Run tests only for the specified package or directory',
    '  --config <path>      Use a config file other than ./testify.json',
    '  --exclusive          Close any previously running testify instance before starting',
    '  --version, -v        Print the installed testify version',
    '  --help, -h           Show this help message',
    '',
    'Smart defaults:',
    '  Testify handles the usual setup path without much ceremony.',
    '  Use --preserve when you want to inspect generated assets by hand.',
    '',
    'Tip:',
    '  npx testify --browser node              # fastest route for non-DOM specs',
    '  npx testify --watch                     # fast feedback with HMR',
    '  npx testify --headless                  # quiet browser run for CI',
    '  npx testify -f forms.spec.ts            # run one spec file',
    '  npx testify -s "Validation"            # run one suite',
    '  npx testify --bail --seed 42            # stop on first failure, reproducible order',
    '  npx testify --config ci.testify.json    # run with an alternate config file',
    '',
    'Playwright Browsers:',
    '  npx playwright install                         # install all supported browsers',
    '  npx playwright install chromium                # install only Chromium',
  ],
};

// ─── config-manager.ts ────────────────────────────────────────────────────────

export const ConfigMessages = {
  failedToParseConfig: (error: unknown) =>
    `%error% Failed to parse existing testify.json: ${error}`,

  failedToCreateConfig: (error: unknown) =>
    `%error% Failed to create default testify.json: ${error}`,

  createdDefaultConfig: (path: string) =>
    `%info% Created default test runner config at ${path}`,

  configAlreadyExists: (path: string) =>
    `%info% Config already exists at ${path}`,

  failedToWriteConfig: (error: unknown) =>
    `%error% Failed to write testify.json: ${error}`,

  generatedDefaultConfig: (path: string) =>
    `%info% Generated default Vite Jasmine config at ${path}`,
};

// ─── console-reporter.ts ─────────────────────────────────────────────────────

export const ReporterMessages = {
  suiteTreeBuilt: (suites: number | undefined, specs: number | undefined) =>
    `%puzzle% Suite tree built (${suites} suites, ${specs} specs).`,

  testsInterrupted: () =>
    `[STOP] TESTS INTERRUPTED`,

  allTestsPassed: () =>
    `[OK] ALL TESTS PASSED`,

  allTestsPassedWithPending: (pendingCount: number) =>
    `[OK] ALL TESTS PASSED (${pendingCount} skipped)`,

  testsFailed: (count: number) =>
    `[ERROR] ${count} TEST${count === 1 ? '' : 'S'} FAILED`,

  testsIncomplete: () =>
    `[WARN] TESTS INCOMPLETE`,

  unknownStatus: (status: string) =>
    `[WARN] UNKNOWN STATUS: ${status}`,
};

// ─── coverage-report-generator.ts ────────────────────────────────────────────

export const CoverageMessages = {
  rawCoverageSaved: (path: string) =>
    `%doc% Raw coverage saved to ${path}`,

  failedToWriteCoverage: (error: unknown) =>
    `%error% Failed to write coverage file: ${error}`,

  coverageReportsGenerated: () =>
    `%checked% Coverage reports generated successfully`,
};

// ─── file-discovery-service.ts ───────────────────────────────────────────────

export const FileDiscoveryMessages = {
  errorDiscoveringFiles: (error: unknown) =>
    `%error% Error discovering files: ${error}`,
};

// ─── host-adapter.ts ─────────────────────────────────────────────────────────

export const HostAdapterMessages = {
  ipcEventError: (message: string) =>
    `%error% Error processing IPC event: ${message}`,

  childProcessReady: () =>
    `%circle_green% Child test process ready`,

  unknownMessageType: (type: string) =>
    `%warn% Unknown message type: ${type}`,
};

// ─── http-server-manager.ts ──────────────────────────────────────────────────

export const HttpServerMessages = {
  serverRunning: (port: number) =>
    `%rocket% Test server running at http://localhost:${port}`,

  portBusyRetrying: (port: number) =>
    `%hourglass% Port ${port} is busy. Waiting 3s before reclaiming it...`,

  failedToKillProcess: (port: number, message: string, stderr: string) =>
    `%error% Failed to kill process on port ${port}: ${message}\n${stderr}`,

  portReclaimed: (port: number) =>
    `%checked% Port ${port} reclaimed.`,

  portStillBusy: (port: number) =>
    `%error% Port ${port} is still busy after reclaim attempt.`,

  serverError: (error: unknown) =>
    `%error% ${error}`,
};

// ─── hmr-manager.ts ──────────────────────────────────────────────────────────

export const HmrMessages = {
  fileFilterUpdated: (filter: unknown) =>
    `%checked% File filter updated: ${filter}`,

  rebuildModeSet: (mode: string) =>
    `%checked% Rebuild mode set to: ${mode}`,

  sourceChangeStrategySet: (strategy: string) =>
    `%checked% Source change strategy set to: ${strategy}`,

  cannotExtractDependencies: (filePath: string, message: string) =>
    `%error% Could not extract dependencies from ${filePath}: ${message}`,

  watchingFiles: (count: number, mode: string, strategy: string) =>
    `%checked% HMR watching ${count} files (mode: ${mode}, strategy: ${strategy})`,

  fileAdded: (type: string, output: string) =>
    `%plus% ${type} file added: ${output}`,

  fileRemoved: (type: string, output: string) =>
    `%minus% ${type} file removed: ${output}`,

  directoryAdded: (type: string, output: string) =>
    `%folder% ${type} directory added: ${output}`,

  directoryRemoved: (type: string, output: string) =>
    `%folder% ${type} directory removed: ${output}`,

  foundFilesInDirectory: (count: number, type: string) =>
    `%box% Found ${count} ${type} files in new directory`,

  errorInHandleFileAdd: (error: unknown) =>
    `%error% Error in handleFileAdd: ${error}`,

  errorInHandleFileRemove: (error: unknown) =>
    `%error% Error in handleFileRemove: ${error}`,

  errorInHandleDirectoryAdd: (error: unknown) =>
    `%error% Error in handleDirectoryAdd: ${error}`,

  errorInHandleDirectoryRemove: (error: unknown) =>
    `%error% Error in handleDirectoryRemove: ${error}`,

  skippingRebuildNonExistent: (filePath: string) =>
    `%warn%  Skipping rebuild for non-existent file: ${filePath}`,

  rebuildFailed: (error: unknown) =>
    `%error% Rebuild failed: ${toConsoleSafe(String(error))}`,

  skippingDeletedFileFromQueue: (file: string) =>
    `%warn%  Skipping deleted file from rebuild queue: ${file}`,

  skippingDeletedFileFromDirectChanges: (file: string) =>
    `%warn%  Skipping deleted file from direct changes: ${file}`,

  allQueuedFilesDeleted: () =>
    `%warn%  All queued files were deleted, skipping rebuild`,

  noValidFilesToRebuild: () =>
    `%warn%  No valid files to rebuild after filtering`,

  noValidSourceOrTestFiles: () =>
    `%warn%  No valid source or test files to build after filtering`,

  rebuildSummary: (changed: number, total: number, source: number, test: number) => {
    const fileCount = (count: number) => `${count} file${count === 1 ? '' : 's'}`;
    const categories = [`${source} source`, `${test} test`];
    const other = total - source - test;
    if (other > 0) categories.push(`${other} other`);
    return `%box% Changed: ${fileCount(changed)} → Rebuilding: ${fileCount(total)} (${categories.join(', ')})`;
  },

  viteBuildFailed: (error: unknown) =>
    `%error% Vite build failed: ${toConsoleSafe(String(error))}`,

  retryingWithFilteredEntries: () =>
    `%refresh% Retrying build with filtered entry points...`,

  allEntryPointsDeleted: () =>
    `%warn%  All entry points were deleted, skipping build`,

  viteBuildCompleted: (ms: number) =>
    `%box% Vite rebuild completed in ${ms}ms`,

  rebuildComplete: (type: string, count: number, ms: number) =>
    `%checked% Rebuild complete (${type}): ${count} files in ${ms}ms`,

  watcherStopped: () =>
    `%checked% HMR watcher stopped`,
};

// ─── html-generator.ts ───────────────────────────────────────────────────────

export const HtmlMessages = {
  noJsFilesForHtml: () =>
    `%warn%  No JS files found for HTML generation.`,

  generatedTestPage: (relativePath: string) =>
    `%doc% Generated test page: ${relativePath}`,

  generatedHmrTestPage: (relativePath: string) =>
    `%doc% Generated HMR-enabled test page: ${relativePath}`,

  faviconNotFound: (faviconPath: string) =>
    `%warn%  Favicon not found at ${faviconPath}, using default <link>`,
};

// ─── node-test-runner.ts ─────────────────────────────────────────────────────
// Note: these keys are used inside the generated JS runner template via
// logger.log('key', ...args) calls embedded as string literals.

export const NodeRunnerMessages = {
  noJsFilesForRunner: () =>
    `%warn%  No JS files found to generate test runner.`,

  generatedInProcessRunner: (path: string) =>
    `%doc% Generated in-process test runner: ${path}`,

  startingTestRunner: () =>
    `%rocket% Starting in-process test runner...`,

  testExecutionError: (message: string) =>
    `%error% Test execution error: ${message}`,

  testProcessAlreadyRunning: () =>
    `%error% Test process is already running`,

  unhandledRejection: (error: string) =>
    `%error% ${error}`,

  uncaughtException: (error: string) =>
    `%error% ${error}`,

  caughtSignal: (signal: string) =>
    `%stop% Caught signal: ${signal}`,

  errorDuringExecution: (message: string) =>
    `%error% Error during test execution: ${message}`,

  failedToRunTests: (message: string) =>
    `%error% Failed to run tests: ${message}`,
};

// ─── process-lock.ts ─────────────────────────────────────────────────────────

export const ProcessLockMessages = {
  staleLockFile: (pid: number) =>
    `%broom% Stale lock file found (PID ${pid} is gone). Removing.`,

  nonNodeProcess: (pid: number, name: string) =>
    `%warn%  PID ${pid} does not appear to be a Node process (${name}). Skipping kill.`,

  couldNotTerminate: (pid: number) =>
    `%error% Could not terminate previous testify instance (PID ${pid}).`,

  terminatedPrevious: (pid: number) =>
    `%lock% Terminated previous testify instance (PID ${pid}).`,
};

// ─── ts-jasmine-cli.ts ────────────────────────────────────────────────────────

export const JasmineCLIMessages = {
  unknownCommand: (command: string) =>
    `%error% Unknown command: ${command}`,

  missingSpecArg: () =>
    `%error% Missing required --spec <path>`,

  specFileNotFound: (spec: string) =>
    `%error% Spec file not found: ${spec}`,

  invalidSeedValue: (value: string) =>
    `%error% Invalid --seed value: ${value}`,

  notRunningInVsCode: () =>
    `%error% \`npx jasmine init\` is only supported when run from VS Code.`,

  openVsCodeTerminalHint: () =>
    `%info% Open VS Code, then run this from the integrated terminal (Terminal -> New Terminal).`,

  createdVsCodeLaunchConfig: (path: string) =>
    `%info% Created VS Code launch config at ${path}`,

  addedVsCodeConfiguration: (name: string) =>
    `Added configuration: ${name}`,

  failedToParseVsCodeConfig: (path: string) =>
    `%error% Failed to parse existing VS Code launch config: ${path}`,

  addConfigManually: () =>
    `%info% Add this configuration manually:`,

  vsCodeConfigAlreadyContains: (name: string) =>
    `%info% VS Code launch config already contains: ${name}`,

  updatedVsCodeLaunchConfig: (path: string) =>
    `%info% Updated VS Code launch config at ${path}`,

  unhandledRejection: (message: string) =>
    `%error% ${message}`,

  uncaughtException: (message: string) =>
    `%error% ${message}`,

  failedToRunJasmine: (stack: string) =>
    `%error% Failed to run jasmine: ${stack}`,
};

// ─── vite-config-builder.ts ──────────────────────────────────────────────────

export const ViteConfigMessages = {
  noFilesToBuild: () =>
    `%error% No files found to build`,

  incrementalBuild: (count: number) =>
    `%box% Incremental build: ${count} files`,

  tsconfigParseFailed: (error: unknown) =>
    `%error% tsconfig parse failed: ${error}`,
};

// ─── vite-jasmine-runner.ts ──────────────────────────────────────────────────

export const RunnerMessages = {
  startingHeadless: () =>
    `%rocket% Starting Jasmine Test Runner (Headless)...`,

  startingServer: () =>
    `%rocket% Starting Jasmine Test Server...`,

  noTestFilesFound: (locations: string) =>
    `%info% No matching spec files found in ${locations}. Nothing to run.`,

  buildFailed: (error: unknown) =>
    `%error% Build failed: ${toConsoleSafe(String(error))}`,

  preprocessFailed: (error: unknown) =>
    `%error% Preprocessing failed: ${toConsoleSafe(String(error))}`,

  invalidNodeHeadedMode: () =>
    `%error% Invalid configuration: Node.js runner cannot run in headed mode.`,

  watchOnlyHeaded: () =>
    `%error% --watch mode is only supported in headed browser environments.`,

  startingWatchMode: () =>
    `%eyes% Starting Jasmine Test Runner in Watch Mode...`,

  startingHmrWatcher: () =>
    `%fire% Starting HMR file watcher...`,

  webSocketReady: () =>
    `%satellite% WebSocket server ready`,

  pressCtrlCToStop: () =>
    `%ok% Press Ctrl+C to stop the server`,

  browserWindowClosed: () =>
    `%refresh% Browser window closed`,

  sessionExitRequested: () =>
    `%stop% Testify Playground requested session exit`,

  headlessBrowserUnavailable: () =>
    `%warn%  Headless browser not available. Falling back to Node.js runner.`,

  browserTestExecutionFailed: () =>
    `%error% Browser test execution failed. Need to install browser binaries?`,

  nodeTestExecutionFailed: (message: string) =>
    `%error% Node test execution failed: ${message}`,

  webSocketReadyWithReporting: () =>
    `%satellite% WebSocket server ready for real-time test reporting`,

  browserWindowClosedPrematurely: () =>
    `%refresh% Browser window closed prematurely`,

  finishHeadedRunFailed: (error: unknown) =>
    `%error% Failed to finish headed browser run: ${error}`,

  preservingExistingHtml: () =>
    `%info% Preserving existing index.html (no regeneration).`,

  preservingExistingRunner: () =>
    `%info% Preserving existing test-runner.mjs (no regeneration).`,

  buildingFiles: (count: number) =>
    `%box% Building ${count} files...`,

  cleaningOutputDirectory: () =>
    `%broom% Cleaning output directory...`,

  discoveringTestFiles: (specCount: number, sourceCount: number) =>
    `%search% Found ${specCount} spec ${specCount === 1 ? 'file' : 'files'} and ${sourceCount} source ${sourceCount === 1 ? 'file' : 'files'}.`,

  preparingBuildConfiguration: () =>
    `%gear% Preparing build configuration...`,

  instrumentingModules: (count: number) =>
    `%tool% Instrumenting ${count} compiled ${count === 1 ? 'module' : 'modules'}...`,

  generatingTestPage: () =>
    `%page% Generating test page...`,

  generatedTestPage: () =>
    `%page% Generated test page: index.html`,

  generatedHmrTestPage: () =>
    `%doc% Generated HMR-enabled test page: index.html`,

  testServerRunning: (port: number) =>
    `%rocket% Test server running at http://localhost:${port}`,

  startingBrowserTestSession: () =>
    `%rocket% Starting browser test session...`,

  testsCompletedTimeout: (message: string) =>
    `%error% ${message}`,
};

// ─── websocket-manager.ts ────────────────────────────────────────────────────

export const WebSocketMessages = {
  clientConnected: () =>
    `%plug% WebSocket client connected`,

  failedToParseMessage: (error: unknown) =>
    `%error% Failed to parse WebSocket message: ${error}`,

  websocketError: (error: unknown) =>
    `%error% WebSocket error: ${error}`,

  hmrClientReady: () =>
    `%fire% Client HMR runtime ready`,

  hmrClientError: (message: string) =>
    `%error% HMR error on client: ${message}`,

  unknownMessageType: (type: string) =>
    `%warn%  Unknown WebSocket message type: ${type}`,

  errorHandlingMessage: (error: unknown) =>
    `%error% Error handling WebSocket message: ${error}`,

  hmrEnabled: () =>
    `%fire% HMR enabled on WebSocket server`,

  errorClosingClient: (error: unknown) =>
    `%error% Error closing WebSocket client: ${error}`,
};
