import fs from 'fs';
import os from 'os';
import path from 'path';
import { configureVsCodeLaunchConfig, vscodeLaunchConfigName } from './vscode-launch-config';

describe('configureVsCodeLaunchConfig', () => {
  let root: string;
  let originalSuppressLogs: unknown;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-launch-'));
    originalSuppressLogs =
      (globalThis as any).__testifySuppressLogs;
    (globalThis as any).__testifySuppressLogs = true;
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });

    if (originalSuppressLogs === undefined) {
      delete (globalThis as any).__testifySuppressLogs;
    } else {
      (globalThis as any).__testifySuppressLogs =
        originalSuppressLogs;
    }
  });

  const launchPath = () => path.join(root, '.vscode', 'launch.json');
  const readLaunch = () =>
    JSON.parse(fs.readFileSync(launchPath(), 'utf8'));

  it('creates .vscode/launch.json with the current debug configuration', () => {
    configureVsCodeLaunchConfig(root);

    const launch = readLaunch();
    expect(launch.version).toBe('0.2.0');
    expect(launch.configurations).toHaveSize(1);

    const config = launch.configurations[0];
    expect(config.name).toBe(vscodeLaunchConfigName);
    expect(config.program).toBe('${workspaceFolder}/node_modules/@epikodelabs/testify/bin/jasmine');
    expect(config.args).toEqual(['--spec', '${file}']);
    expect(JSON.stringify(config.runtimeArgs)).not.toContain('esm-loader');
  });

  it('replaces a legacy entry that still registers the removed esm-loader', () => {
    fs.mkdirSync(path.dirname(launchPath()), { recursive: true });
    fs.writeFileSync(launchPath(), `${JSON.stringify({
      version: '0.2.0',
      configurations: [
        {
          type: 'node',
          request: 'launch',
          name: 'Debug current spec file',
          runtimeExecutable: 'node',
          runtimeArgs: [
            '--loader',
            '@epikodelabs/testify/esm-loader.mjs',
            '--enable-source-maps',
          ],
          program: '${workspaceFolder}/node_modules/@epikodelabs/testify/bin/jasmine',
          args: ['--spec', '${file}'],
          cwd: '${workspaceFolder}',
          console: 'integratedTerminal',
          skipFiles: ['<node_internals>/**'],
        },
      ],
    }, null, 2)}\n`);

    configureVsCodeLaunchConfig(root);

    const launch = readLaunch();
    expect(launch.configurations).toHaveSize(1);
    expect(launch.configurations[0].name).toBe(vscodeLaunchConfigName);
    expect(launch.configurations[0].runtimeArgs).toEqual(['--enable-source-maps']);
    expect(JSON.stringify(launch.configurations[0])).not.toContain('esm-loader');
  });

  it('preserves unrelated configurations when updating', () => {
    fs.mkdirSync(path.dirname(launchPath()), { recursive: true });
    fs.writeFileSync(launchPath(), `${JSON.stringify({
      version: '0.2.0',
      configurations: [
        {
          type: 'chrome',
          request: 'launch',
          name: 'Debug in Chrome',
          url: 'http://localhost:4200/',
        },
        {
          type: 'node',
          request: 'launch',
          name: 'Old jasmine spec',
          program: '${workspaceFolder}/node_modules/@epikodelabs/testify/bin/jasmine',
          args: ['--spec', '${file}'],
        },
      ],
    }, null, 2)}\n`);

    configureVsCodeLaunchConfig(root);

    const launch = readLaunch();
    expect(launch.configurations).toHaveSize(2);
    expect(launch.configurations[0].name).toBe('Debug in Chrome');
    expect(launch.configurations[1].name).toBe(vscodeLaunchConfigName);
  });

  it('adds the configuration when no jasmine-style entry exists', () => {
    fs.mkdirSync(path.dirname(launchPath()), { recursive: true });
    fs.writeFileSync(launchPath(), `${JSON.stringify({
      version: '0.2.0',
      configurations: [
        {
          type: 'chrome',
          request: 'launch',
          name: 'Debug in Chrome',
          url: 'http://localhost:4200/',
        },
      ],
    }, null, 2)}\n`);

    configureVsCodeLaunchConfig(root);

    const launch = readLaunch();
    expect(launch.configurations).toHaveSize(2);
    expect(launch.configurations[0].name).toBe(vscodeLaunchConfigName);
    expect(launch.configurations[1].name).toBe('Debug in Chrome');
  });
});
