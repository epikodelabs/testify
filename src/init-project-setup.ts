import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import JSONCleaner from './json-cleaner';
import { logger } from './logger';
import { ExitCodeError, EXIT_CODES } from './exit-codes';
import { CLIMessages } from './log-messages';

const JASMINE_TYPES_PACKAGE = '@types/jasmine';
const JASMINE_TYPE_NAME = 'jasmine';

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

interface TestifyPackageManifest {
  devDependencies?: Record<string, string>;
  testifySetup?: {
    jasmineTypesVersion?: string;
  };
}

function readJson<T = unknown>(jsonPath: string): T {
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as T;
}

function detectEol(text: string): string {
  return text.includes('\r\n') ? '\r\n' : '\n';
}

function resolvePackageManifestPath(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(currentDir, '../package.json'),
    path.resolve(currentDir, '../../package.json'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new ExitCodeError(
    EXIT_CODES.CONFIG_ERROR,
    CLIMessages.missingTestifyPackageMetadata(),
  );
}

function getJasmineTypesVersion(): string {
  const pkg = readJson<TestifyPackageManifest>(resolvePackageManifestPath());
  const version =
    pkg.testifySetup?.jasmineTypesVersion ??
    pkg.devDependencies?.[JASMINE_TYPES_PACKAGE];

  if (!version) {
    throw new ExitCodeError(
      EXIT_CODES.CONFIG_ERROR,
      CLIMessages.missingJasmineTypesVersion(),
    );
  }

  return version;
}

function projectHasDependency(
  projectPkg: Record<string, any>,
  packageName: string,
): boolean {
  return Boolean(
    projectPkg.dependencies?.[packageName] ||
    projectPkg.devDependencies?.[packageName] ||
    projectPkg.peerDependencies?.[packageName] ||
    projectPkg.optionalDependencies?.[packageName],
  );
}

function readProjectPackageJson(projectRoot: string): Record<string, any> {
  const projectPackageJsonPath = path.join(projectRoot, 'package.json');

  if (!fs.existsSync(projectPackageJsonPath)) {
    throw new ExitCodeError(
      EXIT_CODES.CONFIG_ERROR,
      CLIMessages.projectPackageJsonMissing(projectRoot),
    );
  }

  return readJson<Record<string, any>>(projectPackageJsonPath);
}

function detectPackageManager(projectRoot: string): PackageManager {
  const userAgent = process.env.npm_config_user_agent || '';

  if (userAgent.startsWith('pnpm/')) return 'pnpm';
  if (userAgent.startsWith('yarn/')) return 'yarn';
  if (userAgent.startsWith('bun/')) return 'bun';
  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(projectRoot, 'bun.lockb')) || fs.existsSync(path.join(projectRoot, 'bun.lock'))) {
    return 'bun';
  }
  return 'npm';
}

function installCommandArgs(
  packageManager: PackageManager,
  version: string,
): string[] {
  const spec = `${JASMINE_TYPES_PACKAGE}@${version}`;

  switch (packageManager) {
    case 'pnpm':
      return ['add', '-D', spec];
    case 'yarn':
      return ['add', '-D', spec];
    case 'bun':
      return ['add', '-d', spec];
    default:
      return ['install', '--save-dev', spec];
  }
}

function runPackageManager(
  packageManager: PackageManager,
  args: string[],
  cwd: string,
): void {
  const isWindows = process.platform === 'win32';
  const command = packageManager;

  logger.println(CLIMessages.installingJasmineTypes(packageManager));

  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: process.env,
    shell: isWindows,
  });

  if (result.error) {
    throw new ExitCodeError(
      EXIT_CODES.CONFIG_ERROR,
      CLIMessages.failedToInstallJasmineTypes(result.error),
    );
  }

  if (result.status !== 0) {
    throw new ExitCodeError(
      EXIT_CODES.CONFIG_ERROR,
      CLIMessages.failedToInstallJasmineTypes(
        `package manager exited with code ${result.status}`,
      ),
    );
  }
}

function installJasmineTypes(projectRoot: string): void {
  const projectPkg = readProjectPackageJson(projectRoot);

  if (projectHasDependency(projectPkg, JASMINE_TYPES_PACKAGE)) {
    logger.println(CLIMessages.jasmineTypesAlreadyDeclared());
    return;
  }

  const packageManager = detectPackageManager(projectRoot);
  const version = getJasmineTypesVersion();

  runPackageManager(
    packageManager,
    installCommandArgs(packageManager, version),
    projectRoot,
  );

  logger.println(CLIMessages.installedJasmineTypes(JASMINE_TYPES_PACKAGE, version));
}

function inferredTypesForProject(projectRoot: string): string[] {
  const projectPkg = readProjectPackageJson(projectRoot);
  const types = new Set<string>();

  if (projectHasDependency(projectPkg, '@types/node')) {
    types.add('node');
  }

  types.add(JASMINE_TYPE_NAME);

  return [...types];
}

function findTsconfigCandidates(projectRoot: string): string[] {
  const candidates = [
    'tsconfig.spec.json',
    'tsconfig.test.json',
    'tsconfig.jasmine.json',
    'tsconfig.json',
  ];

  return candidates
    .map((name) => path.join(projectRoot, name))
    .filter((candidate) => fs.existsSync(candidate));
}

function ensureJasmineTypeInTsconfig(projectRoot: string): void {
  const cleaner = new JSONCleaner();
  const tsconfigCandidates = findTsconfigCandidates(projectRoot);

  if (!tsconfigCandidates.length) {
    logger.println(CLIMessages.noProjectTsconfigFound());
    return;
  }

  for (const tsconfigPath of tsconfigCandidates) {
    const raw = fs.readFileSync(tsconfigPath, 'utf8');
    const config = cleaner.parse<Record<string, any>>(raw);
    const types = config.compilerOptions?.types;

    if (!Array.isArray(types)) {
      continue;
    }

    if (types.includes(JASMINE_TYPE_NAME)) {
      logger.println(CLIMessages.tsconfigAlreadyIncludesJasmine(path.basename(tsconfigPath)));
      return;
    }

    config.compilerOptions = config.compilerOptions || {};
    config.compilerOptions.types = [...types, JASMINE_TYPE_NAME];

    const eol = detectEol(raw);
    const serialized = JSON.stringify(config, null, 2).replace(/\n/g, eol) + eol;
    fs.writeFileSync(tsconfigPath, serialized);

    logger.println(CLIMessages.addedJasmineToTsconfig(path.basename(tsconfigPath)));
    return;
  }

  const tsconfigPath = tsconfigCandidates[0];
  const raw = fs.readFileSync(tsconfigPath, 'utf8');
  const config = cleaner.parse<Record<string, any>>(raw);
  const inferredTypes = inferredTypesForProject(projectRoot);

  config.compilerOptions = config.compilerOptions || {};
  config.compilerOptions.types = inferredTypes;

  const eol = detectEol(raw);
  const serialized = JSON.stringify(config, null, 2).replace(/\n/g, eol) + eol;
  fs.writeFileSync(tsconfigPath, serialized);

  logger.println(
    CLIMessages.createdTsconfigTypes(path.basename(tsconfigPath), inferredTypes),
  );
}

export async function initializeProjectForTestify(projectRoot = process.cwd()): Promise<void> {
  installJasmineTypes(projectRoot);
  ensureJasmineTypeInTsconfig(projectRoot);
}
