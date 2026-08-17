// ─── cli-handler.ts ───────────────────────────────────────────────────────────

export const CLIMessages = {
  invalidSeed: () =>
    `%cross% Invalid --seed value (expected a number).`,

  failedToInitializeProject: (error: unknown) =>
    `%cross% Failed to initialize testify config: ${error}`,

  browserArgMissing: () =>
    `%cross% --browser requires a browser name (chrome|chromium|firefox|webkit|node).`,

  projectArgMissing: () =>
    `%cross% --project requires a package name or path.`,

  portArgMissing: () =>
    `%cross% --port requires a number between 1 and 65535.`,

  invalidPort: () =>
    `%cross% Invalid --port value (expected an integer between 1 and 65535).`,

  configArgMissing: () =>
    `%cross% --config requires a path to a config file.`,

  timeoutArgMissing: () =>
    `%cross% --timeout requires a number of milliseconds.`,

  invalidTimeout: () =>
    `%cross% Invalid --timeout value (expected a positive integer, in milliseconds).`,

  fileArgMissing: () =>
    `%cross% --file / -f requires a spec filename.`,

  suiteArgMissing: () =>
    `%cross% --suite / -s requires a suite name.`,

  unknownCommand: (command: string) =>
    `%cross% Unknown command: ${command}`,

  invalidArguments: (error: unknown) =>
    `%cross% Invalid command line arguments: ${error instanceof Error ? error.message : String(error)}`,

  watchIncompatibleFlags: (flags: string[]) =>
    `%cross% The --watch flag cannot be used with: ${flags.join(', ')}`,

  couldNotResolveProject: (name: string) =>
    `%cross% Could not resolve project "${name}". It is not a directory and not a known package name.`,

  preserveOutputsEnabled: () =>
    `%info% Preserve outputs enabled (skip regenerating index.html and test-runner.mjs when present).`,

  failedToStartTestRunner: (error: unknown) =>
    `%cross% Failed to start test runner: ${error}`,

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
