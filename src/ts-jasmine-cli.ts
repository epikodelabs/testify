import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { logger } from './console-repl';

const packageRoot = path.resolve(__dirname, '..');
const packageRequire = createRequire(path.join(packageRoot, 'package.json'));

interface RunnerArgs {
  spec: string;
  random: boolean;
  stopOnFail: boolean;
  seed?: number;
  help: boolean;
}

function printHelp(): void {
  logger.println('ts-jasmine-cli: run a single Jasmine spec in Node');
  logger.println('');
  logger.println('Usage:');
  logger.println('  ts-jasmine-cli --spec <path-to-spec>');
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
}

function parseArgs(argv: string[]): RunnerArgs {
  const args = argv.slice(2);
  const get = (flag: string) => {
    const index = args.indexOf(flag);
    if (index === -1) return undefined;
    return args[index + 1];
  };

  const help = args.includes('--help') || args.includes('-h');
  const specRaw = get('--spec');

  if (help) {
    return {
      spec: specRaw ? path.resolve(process.cwd(), specRaw) : '',
      random: args.includes('--random'),
      stopOnFail: args.includes('--stop-on-fail'),
      seed: get('--seed') ? Number(get('--seed')) : undefined,
      help: true,
    };
  }

  if (!specRaw) {
    logger.error('ERROR: Missing required --spec <path>');
    logger.println('');
    printHelp();
    process.exit(1);
  }

  const spec = path.resolve(process.cwd(), specRaw);
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
  };
}

function isTypeScriptLike(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.ts' || ext === '.tsx' || ext === '.mts' || ext === '.cts';
}

function hasEsmLoader(): boolean {
  const fromNodeOptions = (process.env.NODE_OPTIONS ?? '').split(/\s+/g).filter(Boolean);
  const argv = [...process.execArgv, ...fromNodeOptions];
  return argv.includes('--loader') || argv.some((a) => a.startsWith('--loader='));
}

function findNearestTsconfig(startDir: string): string | null {
  let current = path.resolve(startDir);
  while (true) {
    const candidate = path.join(current, 'tsconfig.json');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

async function respawnWithLoader(args: RunnerArgs): Promise<never> {
  const { spawn } = await import('child_process');

  const tsconfig = findNearestTsconfig(path.dirname(args.spec));
  const env: NodeJS.ProcessEnv = { ...process.env };
  if (tsconfig) env.TS_NODE_PROJECT = tsconfig;
  env.TS_NODE_TRANSPILE_ONLY ??= 'true';

  const loaderPath = path.join(packageRoot, 'esm-loader.mjs');
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
      ...process.argv.slice(2),
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
  const jasmineCorePath = packageRequire.resolve('jasmine-core/lib/jasmine-core/jasmine.js');
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
  return { jasmineEnv, jasmineInstance };
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
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
