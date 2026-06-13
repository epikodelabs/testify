// ─── Emoji/symbol placeholders ────────────────────────────────────────────────
// Replace these with actual emoji or terminal symbols at render time if desired.
// They are intentionally kept as plain ASCII placeholders so the strings remain
// portable and easy to localise / override.

// %check%         → ✅  (success / done)
// %cross%         → ❌  (error / failure)
// %warn%          → ⚠️   (warning)
// %info%          → ℹ️   (informational)
// %globe%         → 🌐  (browser / network)
// %doc%           → 📄  (file / document)
// %puzzle%        → 🧩  (suite tree)
// %stop%          → 🛑  (abort / halt)
// %bulb%          → 💡  (tip / hint)
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
    `%warn%  Unknown browser "${name}", falling back to Node.js mode`,

  playwrightNotInstalled: (name: string) =>
    `%info% Playwright not installed. Browser "${name}" not available.`,

  playwrightInstallTip: () =>
    `%bulb% Tip: Install Playwright to enable browser testing:\n   npm install playwright`,

  browserExecutionFailed: (name: string, message: string) =>
    `%cross% Browser execution failed for "${name}": ${message}`,

  navigatingToTestPage: () =>
    `%globe% Navigating to test page...`,

  testsAbortedByUser: () =>
    `%stop% Tests aborted by user (Ctrl+C)`,

  testExecutionFailed: (error: unknown) =>
    `%cross% Test execution failed: ${error}`,

  browserConsoleError: (text: string) =>
    `%cross% ${text}`,

  browserConsoleWarn: (text: string) =>
    `%warn% ${text}`,

  pageError: (message: string) =>
    `%cross% Page error: ${message}`,

  requestFailed: (url: string, errorText: string | undefined) =>
    `%cross% ${url}, ${errorText}`,

  unknownBrowserFallbackToChrome: (name: string) =>
    `%warn%  Unknown browser "${name}", using Chrome instead`,

  browserNotInstalled: (name: string) =>
    `%cross% Browser "${name}" is not installed.`,

  browserInstallTip: (name: string) =>
    `%bulb% Tip: Install it by running: npx playwright install ${name.toLowerCase()}`,

  openingBrowser: (name: string) =>
    `%globe% Opening ${name} browser...`,

  playwrightNotInstalledManual: (url: string) =>
    `%info% Playwright not installed. Please open browser manually: ${url}`,

  playwrightAutoOpenTip: () =>
    `%bulb% Tip: Install Playwright to enable automatic browser opening:\n   npm install playwright`,

  failedToOpenBrowser: (message: string) =>
    `%cross% Failed to open browser: ${message}`,

  openBrowserManually: (url: string) =>
    `%bulb% Please open browser manually: ${url}`,

  failedToCloseBrowser: (error: unknown) =>
    `%cross% Failed to close browser: ${error}`,
};

// ─── cli-handler.ts ───────────────────────────────────────────────────────────

export const CLIMessages = {
  invalidSeed: () =>
    `%cross% Invalid --seed value (expected a number).`,

  browserArgMissing: () =>
    `%cross% --browser requires a browser name (chrome|chromium|firefox|webkit|node).`,

  projectArgMissing: () =>
    `%cross% --project requires a package name or path.`,

  watchIncompatibleFlags: (flags: string[]) =>
    `%cross% The --watch flag cannot be used with: ${flags.join(', ')}`,

  couldNotResolveProject: (name: string) =>
    `%cross% Could not resolve project "${name}". It is not a directory and not a known package name.`,

  preserveOutputsEnabled: () =>
    `%info% Preserve outputs enabled (skip regenerating index.html and test-runner.js when present).`,

  failedToStartTestRunner: (error: unknown) =>
    `%cross% Failed to start test runner: ${error}`,

  // Help text — kept as a single block so the caller can println() each line
  helpLines: (): string[] => [
    'testify - run your Jasmine tests across browsers, headless, or Node.js.',
    '',
    'Usage:',
    '  npx testify [options]',
    '  npx testify init               # scaffold testify.json',
    '',
    'Options:',
    '  --headless           Run tests in the default Playwright browser without UI',
    '  --browser <name>     Target browser (chrome|chromium|firefox|webkit|node)',
    '  --watch              Launch browser mode + HMR for rapid feedback (cannot be headless)',
    '  --coverage           Generate Istanbul coverage reports after the run',
    '  --seed <number>      Seed used for randomization order',
    '  --silent / --quiet    Suppress console logs when running in Node.js mode',
    '  --preserve           Skip regenerating index.html and test-runner.js when outputs exist',
    '  --ansi               Use plain ASCII output (no colors, emoji, or cursor control)',
    '  --project <name>     Run tests only for the specified package or directory',
    '  --exclusive          Close any previously running testify instance before starting',
    '  --help, -h           Show this help message',
    '',
    'Configuration:',
    '  testify.json keeps your src/test dirs, browser, port, coverage, and HTML options.',
    '  Use --preserve after the first run if you need to debug manually generated assets.',
    '',
    'Tip:',
    '  npx testify --browser node              # fastest Node.js test execution',
    '  npx testify --headless                  # run headless Chrome for browser APIs',
    '',
    'Playwright Browsers:',
    '  npx playwright install                         # install all supported browsers',
    '  npx playwright install chromium                # install only Chromium',
  ],
};

// ─── config-manager.ts ────────────────────────────────────────────────────────

export const ConfigMessages = {
  failedToParseConfig: (error: unknown) =>
    `%cross% Failed to parse existing testify.json: ${error}`,

  failedToCreateConfig: (error: unknown) =>
    `%cross% Failed to create default testify.json: ${error}`,

  createdDefaultConfig: (path: string) =>
    `%info% Created default test runner config at ${path}`,

  configAlreadyExists: (path: string) =>
    `%info% Config already exists at ${path}`,

  failedToWriteConfig: (error: unknown) =>
    `%cross% Failed to write testify.json: ${error}`,

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
    `[OK] ALL TESTS PASSED (${pendingCount} pending)`,

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
    `%cross% Failed to write coverage file: ${error}`,

  coverageReportsGenerated: () =>
    `%check% Coverage reports generated successfully`,
};

// ─── file-discovery-service.ts ───────────────────────────────────────────────

export const FileDiscoveryMessages = {
  errorDiscoveringFiles: (error: unknown) =>
    `%cross% Error discovering files: ${error}`,
};

// ─── host-adapter.ts ─────────────────────────────────────────────────────────

export const HostAdapterMessages = {
  ipcEventError: (message: string) =>
    `%cross% Error processing IPC event: ${message}`,

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
    `%cross% Failed to kill process on port ${port}: ${message}\n${stderr}`,

  portReclaimed: (port: number) =>
    `%check% Port ${port} reclaimed.`,

  portStillBusy: (port: number) =>
    `%cross% Port ${port} is still busy after reclaim attempt.`,

  serverError: (error: unknown) =>
    `%cross% ${error}`,
};

// ─── hmr-manager.ts ──────────────────────────────────────────────────────────

export const HmrMessages = {
  fileFilterUpdated: (filter: unknown) =>
    `%check% File filter updated: ${filter}`,

  rebuildModeSet: (mode: string) =>
    `%check% Rebuild mode set to: ${mode}`,

  sourceChangeStrategySet: (strategy: string) =>
    `%check% Source change strategy set to: ${strategy}`,

  cannotExtractDependencies: (filePath: string, message: string) =>
    `%warn%  Could not extract dependencies from ${filePath}: ${message}`,

  watchingFiles: (count: number, mode: string, strategy: string) =>
    `%check% HMR watching ${count} files (mode: ${mode}, strategy: ${strategy})`,

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
    `%cross% Error in handleFileAdd: ${error}`,

  errorInHandleFileRemove: (error: unknown) =>
    `%cross% Error in handleFileRemove: ${error}`,

  errorInHandleDirectoryAdd: (error: unknown) =>
    `%cross% Error in handleDirectoryAdd: ${error}`,

  errorInHandleDirectoryRemove: (error: unknown) =>
    `%cross% Error in handleDirectoryRemove: ${error}`,

  skippingRebuildNonExistent: (filePath: string) =>
    `%warn%  Skipping rebuild for non-existent file: ${filePath}`,

  rebuildFailed: (error: unknown) =>
    `%cross% Rebuild failed: ${error}`,

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

  rebuildSummary: (changed: number, total: number, source: number, test: number) =>
    `%box% Changed: ${changed} files → Rebuilding: ${total} files (${source} source, ${test} test)`,

  viteBuildFailed: (error: unknown) =>
    `%cross% Vite build failed: ${error}`,

  retryingWithFilteredEntries: () =>
    `%refresh% Retrying build with filtered entry points...`,

  allEntryPointsDeleted: () =>
    `%warn%  All entry points were deleted, skipping build`,

  viteBuildCompleted: (ms: number) =>
    `%box% Vite rebuild completed in ${ms}ms`,

  rebuildComplete: (type: string, count: number, ms: number) =>
    `%check% Rebuild complete (${type}): ${count} files in ${ms}ms`,

  watcherStopped: () =>
    `%check% HMR watcher stopped`,
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

  runnerDoesNotExportRunTests: () =>
    `%cross% Runner module does not export runTests()`,

  testExecutionError: (message: string) =>
    `%cross% Test execution error: ${message}`,

  testProcessAlreadyRunning: () =>
    `%warn%  Test process is already running`,

  unhandledRejection: (error: string) =>
    `%cross% ${error}`,

  uncaughtException: (error: string) =>
    `%cross% ${error}`,

  caughtSignal: (signal: string) =>
    `%stop% Caught signal: ${signal}`,

  errorDuringExecution: (message: string) =>
    `%cross% Error during test execution: ${message}`,

  failedToRunTests: (message: string) =>
    `%cross% Failed to run tests: ${message}`,
};

// ─── process-lock.ts ─────────────────────────────────────────────────────────

export const ProcessLockMessages = {
  staleLockFile: (pid: number) =>
    `%broom% Stale lock file found (PID ${pid} is gone). Removing.`,

  nonNodeProcess: (pid: number, name: string) =>
    `%warn%  PID ${pid} does not appear to be a Node process (${name}). Skipping kill.`,

  couldNotTerminate: (pid: number) =>
    `%warn%  Could not terminate previous testify instance (PID ${pid}).`,

  terminatedPrevious: (pid: number) =>
    `%lock% Terminated previous testify instance (PID ${pid}).`,
};

// ─── ts-jasmine-cli.ts ────────────────────────────────────────────────────────

export const JasmineCLIMessages = {
  unknownCommand: (command: string) =>
    `%cross% Unknown command: ${command}`,

  missingSpecArg: () =>
    `%cross% Missing required --spec <path>`,

  specFileNotFound: (spec: string) =>
    `%cross% Spec file not found: ${spec}`,

  invalidSeedValue: (value: string) =>
    `%cross% Invalid --seed value: ${value}`,

  notRunningInVsCode: () =>
    `%cross% \`npx jasmine init\` is only supported when run from VS Code.`,

  openVsCodeTerminalHint: () =>
    `%info% Open VS Code, then run this from the integrated terminal (Terminal -> New Terminal).`,

  createdVsCodeLaunchConfig: (path: string) =>
    `%info% Created VS Code launch config at ${path}`,

  addedVsCodeConfiguration: (name: string) =>
    `Added configuration: ${name}`,

  failedToParseVsCodeConfig: (path: string) =>
    `%cross% Failed to parse existing VS Code launch config: ${path}`,

  addConfigManually: () =>
    `%info% Add this configuration manually:`,

  vsCodeConfigAlreadyContains: (name: string) =>
    `%info% VS Code launch config already contains: ${name}`,

  updatedVsCodeLaunchConfig: (path: string) =>
    `%info% Updated VS Code launch config at ${path}`,

  unhandledRejection: (error: unknown) =>
    `%cross% ${error}`,

  uncaughtException: (error: unknown) =>
    `%cross% ${error}`,

  failedToRunJasmine: (stack: string) =>
    `%cross% Failed to run jasmine: ${stack}`,
};

// ─── vite-config-builder.ts ──────────────────────────────────────────────────

export const ViteConfigMessages = {
  noFilesToBuild: () =>
    `%cross% No files found to build`,

  incrementalBuild: (count: number) =>
    `%box% Incremental build: ${count} files`,

  tsconfigParseFailed: (error: unknown) =>
    `%warn% tsconfig parse failed: ${error}`,
};

// ─── vite-jasmine-runner.ts ──────────────────────────────────────────────────

export const RunnerMessages = {
  startingHeadless: () =>
    `%rocket% Starting Jasmine Test Runner (Headless)...`,

  startingServer: () =>
    `%rocket% Starting Jasmine Test Server...`,

  buildFailed: (error: unknown) =>
    `%cross% Build failed: ${error}`,

  preprocessFailed: (error: unknown) =>
    `%cross% Preprocessing failed: ${error}`,

  invalidNodeHeadedMode: () =>
    `%cross% Invalid configuration: Node.js runner cannot run in headed mode.`,

  watchOnlyHeaded: () =>
    `%cross% --watch mode is only supported in headed browser environments.`,

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

  headlessBrowserUnavailable: () =>
    `%warn%  Headless browser not available. Falling back to Node.js runner.`,

  browserTestExecutionFailed: () =>
    `%cross% Browser test execution failed. Need to install playwright?`,

  nodeTestExecutionFailed: (message: string) =>
    `%cross% Node test execution failed: ${message}`,

  webSocketReadyWithReporting: () =>
    `%satellite% WebSocket server ready for real-time test reporting`,

  browserWindowClosedPrematurely: () =>
    `%refresh% Browser window closed prematurely`,

  finishHeadedRunFailed: (error: unknown) =>
    `%cross% Failed to finish headed browser run: ${error}`,

  preservingExistingHtml: () =>
    `%info%  Preserving existing index.html (no regeneration).`,

  preservingExistingRunner: () =>
    `%info%  Preserving existing test-runner.js (no regeneration).`,

  buildingFiles: (count: number) =>
    `%box% Building ${count} files...`,
};

// ─── websocket-manager.ts ────────────────────────────────────────────────────

export const WebSocketMessages = {
  clientConnected: () =>
    `%plug% WebSocket client connected`,

  failedToParseMessage: (error: unknown) =>
    `%cross% Failed to parse WebSocket message: ${error}`,

  websocketError: (error: unknown) =>
    `%cross% WebSocket error: ${error}`,

  hmrClientReady: () =>
    `%fire% Client HMR runtime ready`,

  hmrClientError: (message: string) =>
    `%cross% HMR error on client: ${message}`,

  unknownMessageType: (type: string) =>
    `%warn%  Unknown WebSocket message type: ${type}`,

  errorHandlingMessage: (error: unknown) =>
    `%cross% Error handling WebSocket message: ${error}`,

  hmrEnabled: () =>
    `%fire% HMR enabled on WebSocket server`,

  errorClosingClient: (error: unknown) =>
    `%cross% Error closing WebSocket client: ${error}`,
};
