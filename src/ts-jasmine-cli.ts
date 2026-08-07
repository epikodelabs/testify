import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import util from 'util';
import { register } from 'tsx/esm/api';
import { registerTestifyRelativeResolver } from './node-relative-resolver';
import { logger } from './logger';
import { JasmineCLIMessages } from './log-messages';
import { AwaitableJasmineConsoleReporter } from './jasmine-console-reporter';
import { initializeNodeJasmineEnvironment } from './jasmine-node-runtime';
import JSONCleaner from './json-cleaner';
import { norm } from './utils';
import { EXIT_CODES } from './exit-codes';
import { ProjectSetup } from './project-setup';

const packageRequire = createRequire(import.meta.url);

// Keep runtime imports opaque to Vite. These paths are selected at runtime and
// must be handled by Node/tsx rather than Vite's browser preload transform.
const nativeImport = new Function(
  'specifier',
  'return import(specifier);',
) as (specifier: string) => Promise<any>;

interface RunnerArgs {
  spec: string;
  random: boolean;
  stopOnFail: boolean;
  seed?: number;
  help: boolean;
  initLaunchConfig: boolean;
}

const vscodeLaunchConfigName = 'Debug current spec (jasmine)';

function getRuntimeEnv(): NodeJS.ProcessEnv {
  const runtimeProcess = (globalThis as any).process as NodeJS.Process | undefined;
  return runtimeProcess?.env ?? {};
}

function isRunningInVsCode(): boolean {
  const env = getRuntimeEnv();
  return (
    env.TERM_PROGRAM === 'vscode' ||
    typeof env.VSCODE_PID === 'string' ||
    typeof env.VSCODE_CWD === 'string' ||
    typeof env.VSCODE_INSPECTOR_OPTIONS === 'string'
  );
}

function printHelp(): void {
  logger.println('jasmine: run a single Jasmine spec in Node');
  logger.println('');
  logger.println('Usage:');
  logger.println('  npx jasmine --spec <path-to-spec>');
  logger.println('  npx jasmine init');
  logger.println('');
  logger.println('Commands:');
  logger.println('  init                Configure Jasmine types and create/update .vscode/launch.json');
  logger.println('');
  logger.println('Options:');
  logger.println('  --spec <path>        Path to a single spec file');
  logger.println('  --random             Randomize spec order');
  logger.println('  --seed <number>      Seed used for randomization');
  logger.println('  --stop-on-fail       Stop on first expectation failure');
  logger.println('  --help               Show this help');
  logger.println('');
  logger.println('TypeScript specs are loaded through tsx using the nearest tsconfig.json.');
  logger.println('');
  logger.println('VS Code debug config name:');
  logger.println(`  ${vscodeLaunchConfigName}`);
}

function parseArgs(argv: string[]): RunnerArgs {
  const args = argv.slice(2);
  const get = (flag: string) => {
    const index = args.indexOf(flag);
    if (index === -1) return undefined;
    return args[index + 1];
  };

  const help = args.includes('--help') || args.includes('-h');
  const command = args[0];
  const initLaunchConfig = args.includes('--init-launch-config') || command === 'init';
  const specRaw = get('--spec');

  if (help) {
    return {
      spec: specRaw ? norm(path.resolve(process.cwd(), specRaw)) : '',
      random: args.includes('--random'),
      stopOnFail: args.includes('--stop-on-fail'),
      seed: get('--seed') ? Number(get('--seed')) : undefined,
      help: true,
      initLaunchConfig,
    };
  }

  if (command && !command.startsWith('-') && command !== 'init') {
    logger.error(JasmineCLIMessages.unknownCommand(command));
    logger.println('');
    printHelp();
    process.exit(EXIT_CODES.INVALID_USAGE);
  }

  if (initLaunchConfig) {
    return {
      spec: specRaw ? norm(path.resolve(process.cwd(), specRaw)) : '',
      random: args.includes('--random'),
      stopOnFail: args.includes('--stop-on-fail'),
      seed: get('--seed') ? Number(get('--seed')) : undefined,
      help: false,
      initLaunchConfig: true,
    };
  }

  if (!specRaw) {
    logger.error(JasmineCLIMessages.missingSpecArg());
    logger.println('');
    printHelp();
    process.exit(EXIT_CODES.INVALID_USAGE);
  }

  const spec = norm(path.resolve(process.cwd(), specRaw));
  if (!fs.existsSync(spec)) {
    logger.error(JasmineCLIMessages.specFileNotFound(spec));
    process.exit(EXIT_CODES.CONFIG_ERROR);
  }

  const seedRaw = get('--seed');
  if (seedRaw !== undefined && !Number.isFinite(Number(seedRaw))) {
    logger.error(JasmineCLIMessages.invalidSeedValue(seedRaw!));
    process.exit(EXIT_CODES.INVALID_USAGE);
  }

  return {
    spec,
    random: args.includes('--random'),
    stopOnFail: args.includes('--stop-on-fail'),
    seed: seedRaw ? Number(seedRaw) : undefined,
    help: false,
    initLaunchConfig: false,
  };
}

function safeStringify(value: unknown): string {
  if (value instanceof Error) {
    return value.stack ?? safeStringify(value.message);
  }

  try {
    const str = String(value);
    if (str !== '[object Object]') {
      return str;
    }
  } catch {
    // fall through to inspect/JSON fallback
  }

  if (value && typeof value === 'object') {
    const constructor = (value as object).constructor?.name ?? 'Object';
    try {
      const inspected = util.inspect(value, { depth: 5, showHidden: true });
      return constructor === 'Object' ? inspected : `${constructor} ${inspected}`;
    } catch {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        // fall through
      }
    }
  }

  try {
    return JSON.stringify(value);
  } catch {
    return '[object Object]';
  }
}



function findNearestTsconfig(startDir: string): string | null {
  let current = norm(path.resolve(startDir));
  while (true) {
    const candidate = norm(path.join(current, 'tsconfig.json'));
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function getDefaultVsCodeLaunchConfiguration(): Record<string, unknown> {
  return {
    type: 'node',
    request: 'launch',
    name: vscodeLaunchConfigName,
    runtimeExecutable: 'node',
    runtimeArgs: ['--enable-source-maps'],
    program: '${workspaceFolder}/node_modules/@epikodelabs/testify/bin/jasmine',
    args: ['--spec', '${file}'],
    cwd: '${workspaceFolder}',
    console: 'integratedTerminal',
    skipFiles: ['<node_internals>/**'],
  };
}

function initVsCodeLaunchConfig(): void {
  const vscodeDir = norm(path.resolve(process.cwd(), '.vscode'));
  const launchJsonPath = norm(path.join(vscodeDir, 'launch.json'));
  const config = getDefaultVsCodeLaunchConfiguration();

  fs.mkdirSync(vscodeDir, { recursive: true });

  if (!fs.existsSync(launchJsonPath)) {
    const launchJson = { version: '0.2.0', configurations: [config] };
    fs.writeFileSync(launchJsonPath, `${JSON.stringify(launchJson, null, 2)}\n`);
    logger.println(JasmineCLIMessages.createdVsCodeLaunchConfig(launchJsonPath));
    logger.println(JasmineCLIMessages.addedVsCodeConfiguration(vscodeLaunchConfigName));
    return;
  }

  const raw = fs.readFileSync(launchJsonPath, 'utf-8');
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    try {
      parsed = new JSONCleaner().parse(raw);
    } catch (error) {
      logger.error(JasmineCLIMessages.failedToParseVsCodeConfig(launchJsonPath));
      logger.error(String(error));
      logger.println('');
      logger.println(JasmineCLIMessages.addConfigManually());
      logger.println(`${JSON.stringify(getDefaultVsCodeLaunchConfiguration(), null, 2)}`);
      process.exit(EXIT_CODES.CONFIG_ERROR);
    }
  }

  if (!parsed || typeof parsed !== 'object') parsed = {};
  if (!Array.isArray(parsed.configurations)) parsed.configurations = [];

  const programSuffix = '/bin/jasmine';
  const existingIndex = parsed.configurations.findIndex((c: any) => {
    if (!c || typeof c !== 'object') return false;
    if (c.name === vscodeLaunchConfigName) return true;

    const program = typeof c.program === 'string' ? c.program.replace(/\\/g, '/') : '';
    const args = Array.isArray(c.args) ? c.args : [];
    return program.endsWith(programSuffix) && args.includes('--spec');
  });

  parsed.version ??= '0.2.0';

  if (existingIndex !== -1) {
    parsed.configurations[existingIndex] = config;
    fs.writeFileSync(launchJsonPath, `${JSON.stringify(parsed, null, 2)}\n`);
    logger.println(JasmineCLIMessages.updatedVsCodeLaunchConfig(launchJsonPath));
    return;
  }

  parsed.configurations.unshift(config);
  fs.writeFileSync(launchJsonPath, `${JSON.stringify(parsed, null, 2)}\n`);
  logger.println(JasmineCLIMessages.updatedVsCodeLaunchConfig(launchJsonPath));
  logger.println(JasmineCLIMessages.addedVsCodeConfiguration(vscodeLaunchConfigName));
}

async function loadJasmine() {
  const jasmineCorePath = norm(packageRequire.resolve('jasmine-core/lib/jasmine-core/jasmine.js'));
  const jasmineCore = await nativeImport(pathToFileURL(jasmineCorePath).href);
  const jasmineRequire = jasmineCore.default;
  return initializeNodeJasmineEnvironment(jasmineRequire, { resetReporters: false });
}

function registerSpecRuntime(specPath: string): () => Promise<void> {
  const tsconfig = findNearestTsconfig(path.dirname(specPath));

  // Register tsx first. It installs its own CommonJS resolver; Testify then
  // wraps that resolver to add bundler-style relative path compatibility.
  const unregisterTsx = register({
    tsconfig: tsconfig ?? false,
  });
  const unregisterRelativeResolver = registerTestifyRelativeResolver();

  return async () => {
    try {
      unregisterRelativeResolver();
    } finally {
      await unregisterTsx();
    }
  };
}

async function loadSpec(specPath: string): Promise<void> {
  await nativeImport(pathToFileURL(specPath).href);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    process.exit(EXIT_CODES.SUCCESS);
  }

  if (args.initLaunchConfig) {
    ProjectSetup.configure(process.cwd());
    initVsCodeLaunchConfig();

    if (!isRunningInVsCode()) {
      logger.println('VS Code was not detected, but .vscode/launch.json was configured successfully.');
    }

    process.exit(EXIT_CODES.SUCCESS);
  }


  const { jasmineEnv } = await loadJasmine();

  process.on('unhandledRejection', (error) => {
    logger.error(JasmineCLIMessages.unhandledRejection(safeStringify(error)));
    process.exit(EXIT_CODES.INTERNAL_ERROR);
  });
  process.on('uncaughtException', (error) => {
    logger.error(JasmineCLIMessages.uncaughtException(safeStringify(error)));
    process.exit(EXIT_CODES.INTERNAL_ERROR);
  });

  jasmineEnv.configure({
    random: args.random,
    stopSpecOnExpectationFailure: args.stopOnFail,
    seed: args.seed,
  });

  const reporter = new AwaitableJasmineConsoleReporter();
  jasmineEnv.addReporter(reporter);

  const unregisterRuntime = registerSpecRuntime(args.spec);
  let result: Awaited<typeof reporter.complete> | undefined;

  try {
    await loadSpec(args.spec);
    await jasmineEnv.execute();
    result = await reporter.complete;
  } finally {
    await unregisterRuntime();
  }

  let exitCode: number;
  if (result?.overallStatus === 'failed') {
    exitCode = EXIT_CODES.TEST_FAILURES;
  } else if (result?.overallStatus === 'incomplete') {
    exitCode = EXIT_CODES.SUCCESS_WITH_PENDING;
  } else {
    exitCode = EXIT_CODES.SUCCESS;
  }
  process.exit(exitCode);
}

main().catch((error) => {
  if (error instanceof Error) {
    logger.error(JasmineCLIMessages.failedToRunJasmine(safeStringify(error)));
  } else {
    const stack = new Error().stack ?? '';
    const value = safeStringify(error);
    logger.error(
      JasmineCLIMessages.failedToRunJasmine(
        `thrown non-Error value: ${value}\n${stack}`,
      ),
    );
  }
  process.exit(EXIT_CODES.INTERNAL_ERROR);
});
