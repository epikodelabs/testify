import { once } from 'events';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { pathToFileURL, fileURLToPath } from 'url';
import util from 'util';
import { logger } from './logger';
import { JasmineCLIMessages } from './log-messages';
import { AwaitableJasmineConsoleReporter } from './jasmine-console-reporter';
import { initializeNodeJasmineEnvironment } from './jasmine-node-runtime';
import JSONCleaner from './json-cleaner';
import { norm } from './utils';
import { EXIT_CODES, getSignalExitCode } from './exit-codes';

const cliFilePath = fileURLToPath(import.meta.url);
const cliDirectory = path.dirname(cliFilePath);
const packageRoot = norm(path.resolve(cliDirectory, '..'));
const packageRequire = createRequire(import.meta.url);

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
  logger.println('  init                Create/update .vscode/launch.json (VS Code debug; requires VS Code)');
  logger.println('');
  logger.println('Options:');
  logger.println('  --spec <path>        Path to a single spec file');
  logger.println('  --random             Randomize spec order');
  logger.println('  --seed <number>      Seed used for randomization');
  logger.println('  --stop-on-fail       Stop on first expectation failure');
  logger.println('  --help               Show this help');
  logger.println('');
  logger.println('TypeScript + tsconfig paths (recommended):');
  logger.println(
    '  node --loader @epikodelabs/testify/esm-loader.mjs ./node_modules/@epikodelabs/testify/bin/jasmine --spec <file>',
  );
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

function normalizeCliArgs(args: string[]): string[] {
  const normalized = [...args];
  for (let i = 0; i < normalized.length; i += 1) {
    if (normalized[i] === '--spec' && typeof normalized[i + 1] === 'string') {
      normalized[i + 1] = norm(normalized[i + 1]);
      i += 1;
    }
  }
  return normalized;
}

function isTypeScriptLike(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.ts' || ext === '.tsx' || ext === '.mts' || ext === '.cts';
}

function hasEsmLoader(): boolean {
  const fromNodeOptions = (getRuntimeEnv().NODE_OPTIONS ?? '').split(/\s+/g).filter(Boolean);
  const argv = [...process.execArgv, ...fromNodeOptions];
  return argv.includes('--loader') || argv.some((a) => a.startsWith('--loader='));
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
    runtimeArgs: ['--loader', '@epikodelabs/testify/esm-loader.mjs', '--enable-source-maps'],
    program: '${workspaceFolder}/node_modules/@epikodelabs/testify/bin/jasmine',
    args: ['--spec', '${file}'],
    env: {
      TS_NODE_PROJECT: '${workspaceFolder}/tsconfig.json',
    },
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
  const alreadyHasConfig = parsed.configurations.some((c: any) => {
    if (!c || typeof c !== 'object') return false;
    if (c.name === vscodeLaunchConfigName) return true;

    const program = typeof c.program === 'string' ? c.program.replace(/\\/g, '/') : '';
    const args = Array.isArray(c.args) ? c.args : [];
    return program.endsWith(programSuffix) && args.includes('--spec');
  });

  if (alreadyHasConfig) {
    logger.println(JasmineCLIMessages.vsCodeConfigAlreadyContains(vscodeLaunchConfigName));
    return;
  }

  parsed.version ??= '0.2.0';
  parsed.configurations.unshift(config);
  fs.writeFileSync(launchJsonPath, `${JSON.stringify(parsed, null, 2)}\n`);
  logger.println(JasmineCLIMessages.updatedVsCodeLaunchConfig(launchJsonPath));
  logger.println(JasmineCLIMessages.addedVsCodeConfiguration(vscodeLaunchConfigName));
}

async function respawnWithLoader(args: RunnerArgs): Promise<void> {
  const { spawn } = await import('child_process');

  const tsconfig = findNearestTsconfig(path.dirname(args.spec));
  const env: NodeJS.ProcessEnv = { ...getRuntimeEnv() };
  if (tsconfig) env.TS_NODE_PROJECT = tsconfig;
  env.TS_NODE_TRANSPILE_ONLY ??= 'true';

  const loaderPath = norm(path.join(packageRoot, 'esm-loader.mjs'));
  const loaderSpecifier = fs.existsSync(loaderPath)
    ? pathToFileURL(loaderPath).href
    : '@epikodelabs/testify/esm-loader.mjs';

  const child = spawn(
    process.execPath,
    [
      '--loader',
      loaderSpecifier,
      '--enable-source-maps',
      process.argv[1],
      ...normalizeCliArgs(process.argv.slice(2)),
    ],
    { stdio: 'inherit', env, cwd: process.cwd() },
  );

  let onCtrlC: NodeJS.SignalsListener | undefined;
  if (child.pid) {
    onCtrlC = () => child.kill('SIGINT');
    process.on('SIGINT', onCtrlC);
  }

  child.on('exit', (code, signal) => {
    if (onCtrlC) process.off('SIGINT', onCtrlC);
    process.exit(code ?? getSignalExitCode(signal));
  });

  await once(child, 'exit');
}

async function loadJasmine() {
  const jasmineCorePath = norm(packageRequire.resolve('jasmine-core/lib/jasmine-core/jasmine.js'));
  const jasmineCore = await import(pathToFileURL(jasmineCorePath).href);
  const jasmineRequire = jasmineCore.default;
  return initializeNodeJasmineEnvironment(jasmineRequire, { resetReporters: false });
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    process.exit(EXIT_CODES.SUCCESS);
  }

  if (args.initLaunchConfig) {
    if (!isRunningInVsCode()) {
      logger.error(JasmineCLIMessages.notRunningInVsCode());
      logger.println('');
      logger.println(JasmineCLIMessages.openVsCodeTerminalHint());
      process.exit(EXIT_CODES.INVALID_USAGE);
    }
    initVsCodeLaunchConfig();
    process.exit(EXIT_CODES.SUCCESS);
  }

  // `npx jasmine --spec test.spec.ts` starts Node without an ESM loader, so TS (and tsconfig paths)
  // won't resolve. For normal CLI runs, transparently re-spawn with the packaged loader.
  // For debugging, launch Node with the loader explicitly so breakpoints stay in one process.
  if (isTypeScriptLike(args.spec) && !hasEsmLoader() && !process.execArgv.join(' ').includes('--inspect')) {
    await respawnWithLoader(args);
    return; // Parent process must not continue after respawning child
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

  await import(pathToFileURL(args.spec).href);
  await jasmineEnv.execute();
  
  const result = await reporter.complete;
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
