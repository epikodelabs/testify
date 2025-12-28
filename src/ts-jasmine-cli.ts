import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { inspect as utilInspect } from 'util';
import { logger } from './console-repl';
import JSONCleaner from './json-cleaner';
import { norm } from './utils';

const packageRoot = norm(path.resolve(__dirname, '..'));
const packageRequire = createRequire(path.join(packageRoot, 'package.json'));

interface RunnerArgs {
  spec: string;
  random: boolean;
  stopOnFail: boolean;
  seed?: number;
  help: boolean;
  initLaunchConfig: boolean;
}

const vscodeLaunchConfigName = 'Debug current spec (ts-jasmine-cli)';

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
  logger.println('ts-jasmine-cli: run a single Jasmine spec in Node');
  logger.println('');
  logger.println('Usage:');
  logger.println('  npx ts-jasmine-cli --spec <path-to-spec>');
  logger.println('  npx ts-jasmine-cli init');
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
    '  node --loader @actioncrew/ts-test-runner/esm-loader.mjs ./node_modules/@actioncrew/ts-test-runner/bin/ts-jasmine-cli --spec <file>',
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
    logger.error(`ERROR: Unknown command: ${command}`);
    logger.println('');
    printHelp();
    process.exit(1);
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
    logger.error('ERROR: Missing required --spec <path>');
    logger.println('');
    printHelp();
    process.exit(1);
  }

  const spec = norm(path.resolve(process.cwd(), specRaw));
  if (!fs.existsSync(spec)) {
    logger.error(`ERROR: Spec file not found: ${spec}`);
    process.exit(1);
  }

  const seedRaw = get('--seed');
  return {
    spec,
    random: args.includes('--random'),
    stopOnFail: args.includes('--stop-on-fail'),
    seed: seedRaw ? Number(seedRaw) : undefined,
    help: false,
    initLaunchConfig: false,
  };
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
    runtimeArgs: ['--loader', '@actioncrew/ts-test-runner/esm-loader.mjs', '--enable-source-maps'],
    program: '${workspaceFolder}/node_modules/@actioncrew/ts-test-runner/bin/ts-jasmine-cli',
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
    logger.println(`Created VS Code launch config at ${launchJsonPath}`);
    logger.println(`Added configuration: ${vscodeLaunchConfigName}`);
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
      logger.error(`ERROR: Failed to parse existing VS Code launch config: ${launchJsonPath}`);
      logger.error(String(error));
      logger.println('');
      logger.println('Add this configuration manually:');
      logger.println(`${JSON.stringify(getDefaultVsCodeLaunchConfiguration(), null, 2)}`);
      process.exit(1);
    }
  }

  if (!parsed || typeof parsed !== 'object') parsed = {};
  if (!Array.isArray(parsed.configurations)) parsed.configurations = [];

  const programSuffix = '/bin/ts-jasmine-cli';
  const alreadyHasConfig = parsed.configurations.some((c: any) => {
    if (!c || typeof c !== 'object') return false;
    if (c.name === vscodeLaunchConfigName) return true;

    const program = typeof c.program === 'string' ? c.program.replace(/\\/g, '/') : '';
    const args = Array.isArray(c.args) ? c.args : [];
    return program.endsWith(programSuffix) && args.includes('--spec');
  });

  if (alreadyHasConfig) {
    logger.println(`VS Code launch config already contains: ${vscodeLaunchConfigName}`);
    return;
  }

  parsed.version ??= '0.2.0';
  parsed.configurations.unshift(config);
  fs.writeFileSync(launchJsonPath, `${JSON.stringify(parsed, null, 2)}\n`);
  logger.println(`Updated VS Code launch config at ${launchJsonPath}`);
  logger.println(`Added configuration: ${vscodeLaunchConfigName}`);
}

async function respawnWithLoader(args: RunnerArgs): Promise<never> {
  const { spawn } = await import('child_process');

  const tsconfig = findNearestTsconfig(path.dirname(args.spec));
  const env: NodeJS.ProcessEnv = { ...getRuntimeEnv() };
  if (tsconfig) env.TS_NODE_PROJECT = tsconfig;
  env.TS_NODE_TRANSPILE_ONLY ??= 'true';

  const loaderPath = norm(path.join(packageRoot, 'esm-loader.mjs'));
  const loaderSpecifier = fs.existsSync(loaderPath)
    ? pathToFileURL(loaderPath).href
    : '@actioncrew/ts-test-runner/esm-loader.mjs';

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

  child.on('exit', (code) => process.exit(code ?? 1));

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await new Promise((r) => setTimeout(r, 1_000_000));
  }
}

async function loadJasmine() {
  const jasmineCorePath = norm(packageRequire.resolve('jasmine-core/lib/jasmine-core/jasmine.js'));
  const jasmineCore = await import(pathToFileURL(jasmineCorePath).href);
  const jasmineRequire = jasmineCore.default;
  const jasmineInstance = jasmineRequire.core(jasmineRequire);
  const jasmineEnv = jasmineInstance.getEnv();

  Object.assign(globalThis, jasmineRequire.interface(jasmineInstance, jasmineEnv));
  globalThis.jasmine = {
    ...(globalThis.jasmine ?? {}),
    ...jasmineInstance,
  };

  jasmineEnv.clearReporters();
  jasmineEnv.addReporter(createStandardConsoleReporter());
  return { jasmineEnv, jasmineInstance };
}

function formatValue(value: unknown): string {
  return utilInspect(value, { depth: 6, maxArrayLength: 50, breakLength: 80, colors: false });
}

function formatExpectation(ex: any): string[] {
  const parts: string[] = [];
  if (ex?.matcherName) parts.push(`Matcher: ${ex.matcherName}`);
  if ('actual' in ex) parts.push(`Actual: ${formatValue(ex.actual)}`);
  if ('expected' in ex) parts.push(`Expected: ${formatValue(ex.expected)}`);
  return parts;
}

function createStandardConsoleReporter(): Record<string, unknown> {
  const write = (text: string) => process.stdout.write(text);

  let startedAt = 0;
  let specCount = 0;
  let failedCount = 0;
  let pendingCount = 0;

  const failedSpecs: Array<{
    fullName: string;
    failedExpectations?: Array<{
      message: string;
      stack?: string;
      matcherName?: string;
      actual?: unknown;
      expected?: unknown;
    }>;
  }> = [];

  const pendingSpecs: Array<{
    fullName: string;
    pendingReason?: string;
  }> = [];

  return {
    jasmineStarted() {
      startedAt = Date.now();
      write('Started\n');
    },
    specDone(result: any) {
      specCount += 1;

      switch (result?.status) {
        case 'passed':
          write('.');
          break;
        case 'failed':
          failedCount += 1;
          failedSpecs.push({
            fullName: String(result?.fullName ?? result?.description ?? 'Unknown spec'),
            failedExpectations: Array.isArray(result?.failedExpectations)
              ? result.failedExpectations.map((e: any) => ({
                  message: String(e?.message ?? ''),
                  stack: e?.stack ? String(e.stack) : undefined,
                  matcherName: e?.matcherName,
                  actual: e?.actual,
                  expected: e?.expected,
                }))
              : undefined,
          });
          write('F');
          break;
        case 'pending':
          pendingCount += 1;
          pendingSpecs.push({
            fullName: String(result?.fullName ?? result?.description ?? 'Unknown spec'),
            pendingReason: result?.pendingReason ? String(result.pendingReason) : undefined,
          });
          write('*');
          break;
        default:
          // 'excluded'/'disabled' or unknown statuses
          write('-');
          break;
      }
    },
    jasmineDone() {
      const elapsedMs = startedAt ? Date.now() - startedAt : 0;
      const elapsedSec = (elapsedMs / 1000).toFixed(3);

      write('\n');
      write(`Finished in ${elapsedSec}s\n`);

      const parts = [`${specCount} spec${specCount === 1 ? '' : 's'}`];
      if (failedCount) parts.push(`${failedCount} failure${failedCount === 1 ? '' : 's'}`);
      if (pendingCount) parts.push(`${pendingCount} pending`);
      write(parts.join(', ') + '\n');

      if (failedSpecs.length) {
        failedSpecs.forEach((spec, i) => {
          write(`\n${i + 1}) ${spec.fullName}\n`);
          const expectations = spec.failedExpectations ?? [];
          for (const ex of expectations) {
            if (ex.message) write(`${ex.message}\n`);
            const details = formatExpectation(ex);
            for (const line of details) {
              write(`${line}\n`);
            }
            if (ex.stack) write(`${ex.stack}\n`);
          }
        });
      }

      if (pendingSpecs.length) {
        write('\nPending:\n');
        pendingSpecs.forEach((spec, i) => {
          write(`${i + 1}) ${spec.fullName}\n`);
          if (spec.pendingReason) write(`${spec.pendingReason}\n`);
        });
      }
    },
  };
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (args.initLaunchConfig) {
    if (!isRunningInVsCode()) {
      logger.error('ERROR: `npx ts-jasmine-cli init` is only supported when run from VS Code.');
      logger.println('');
      logger.println('Open VS Code, then run this from the integrated terminal (Terminal -> New Terminal).');
      process.exit(1);
    }
    initVsCodeLaunchConfig();
    process.exit(0);
  }

  // `npx ts-jasmine-cli --spec test.spec.ts` starts Node without an ESM loader, so TS (and tsconfig paths)
  // won't resolve. For normal CLI runs, transparently re-spawn with the packaged loader.
  // For debugging, launch Node with the loader explicitly so breakpoints stay in one process.
  if (isTypeScriptLike(args.spec) && !hasEsmLoader() && !process.execArgv.join(' ').includes('--inspect')) {
    await respawnWithLoader(args);
  }

  const { jasmineEnv } = await loadJasmine();

  process.on('unhandledRejection', (error) => {
    logger.error(`ERROR: Unhandled rejection: ${error}`);
    process.exit(1);
  });
  process.on('uncaughtException', (error) => {
    logger.error(`ERROR: Uncaught exception: ${error}`);
    process.exit(1);
  });

  await import(pathToFileURL(args.spec).href);

  jasmineEnv.configure({
    random: args.random,
    stopSpecOnExpectationFailure: args.stopOnFail,
    seed: args.seed,
  });

  let failureCount = 0;
  const completion = new Promise<void>((resolve) => {
    jasmineEnv.addReporter({
      specDone(result: any) {
        if (result.status === 'failed') failureCount += 1;
      },
      jasmineDone() {
        resolve();
      },
    });
  });

  jasmineEnv.execute();
  await completion;

  process.exit(failureCount === 0 ? 0 : 1);
}

main().catch((error) => {
  logger.error(`ERROR: Failed to run ts-jasmine-cli: ${error.stack ?? error}`);
  process.exit(1);
});
