import fs from 'fs';
import path from 'path';
import JSONCleaner from './json-cleaner';
import { JasmineCLIMessages } from './log-messages';
import { logger } from './logger';
import { EXIT_CODES } from './exit-codes';
import { norm } from './utils';

export const vscodeLaunchConfigName = 'Debug current spec (jasmine)';

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

function writeVsCodeLaunchConfig(cwd: string): void {
  const vscodeDir = norm(path.resolve(cwd, '.vscode'));
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
  } catch (error) {
    logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`);
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

/**
 * Creates or updates `.vscode/launch.json` with the current single-spec
 * debug configuration. Existing jasmine-style entries are replaced in place
 * (including legacy ones that still carry the removed esm-loader), and
 * unrelated configurations are preserved. Shared by `testify init` and
 * `jasmine init`.
 */
export function configureVsCodeLaunchConfig(cwd: string): void {
  writeVsCodeLaunchConfig(cwd);

  if (!isRunningInVsCode()) {
    logger.println('VS Code was not detected, but .vscode/launch.json was configured successfully.');
  }
}
