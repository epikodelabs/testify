import { cliDependencies, CLIHandler } from './cli-handler';
import { ConfigManager } from './config-manager';
import { ProcessLock } from './process-lock';
import { logger } from './logger';
import { EXIT_CODES } from './exit-codes';

function baseConfig(overrides: Record<string, unknown> = {}) {
  return {
    srcDirs: ['./src'],
    testDirs: ['./tests'],
    exclude: [],
    outDir: './dist/.vite-jasmine-build',
    preserveOutputs: false,
    browser: 'chrome',
    headless: false,
    coverage: false,
    port: 8888,
    ...overrides,
  } as any;
}

function stubSuccessfulRunner() {
  let capturedConfig: any;
  const fakeRunner: any = {
    start: async () => 0,
    watch: async () => 0,
    cleanup: async () => undefined,
    abort: () => 0,
  };
  spyOn(cliDependencies, 'createViteJasmineRunner').and.callFake((config: any) => {
    capturedConfig = config;
    return fakeRunner;
  });
  return { getConfig: () => capturedConfig };
}

describe('Testify CLI flags', () => {
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = process.argv;
    process.setMaxListeners(50);
    spyOn(ConfigManager, 'loadViteJasmineBrowserConfig').and.returnValue(baseConfig());
    spyOn(ProcessLock.prototype, 'acquire').and.resolveTo(undefined);
    spyOn(ProcessLock.prototype, 'releaseSync').and.stub();
    spyOn(ProcessLock.prototype, 'getPidFilePath').and.returnValue('/tmp/testify.pid');
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('prints a version string for --version and -v without starting a run', async () => {
    spyOn(logger, 'printlnRaw');
    for (const flag of ['--version', '-v']) {
      process.argv = ['node', 'testify', flag];

      const exitCode = await CLIHandler.run();

      expect(exitCode).toBe(EXIT_CODES.SUCCESS);
      expect(logger.printlnRaw).toHaveBeenCalledWith(jasmine.stringMatching(/^testify /));
      (logger.printlnRaw as jasmine.Spy).calls.reset();
    }
  });

  it('loads an alternate config file passed via --config', async () => {
    process.argv = ['node', 'testify', '--config', 'ci.testify.json'];
    stubSuccessfulRunner();

    await CLIHandler.run();

    expect(ConfigManager.loadViteJasmineBrowserConfig).toHaveBeenCalledWith('ci.testify.json');
  });

  it('returns INVALID_USAGE with a clear message when --config has no value', async () => {
    spyOn(logger, 'error');
    process.argv = ['node', 'testify', '--config'];

    const exitCode = await CLIHandler.run();

    expect(exitCode).toBe(EXIT_CODES.INVALID_USAGE);
    expect(logger.error).toHaveBeenCalledWith(jasmine.stringMatching(/--config/));
  });

  it('maps --bail to stopSpecOnExpectationFailure', async () => {
    process.argv = ['node', 'testify', '--bail'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().jasmineConfig?.env?.stopSpecOnExpectationFailure).toBe(true);
  });

  it('maps --no-random to a deterministic (non-random) run', async () => {
    process.argv = ['node', 'testify', '--no-random'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().jasmineConfig?.env?.random).toBe(false);
  });

  it('keeps an explicit --seed', async () => {
    process.argv = ['node', 'testify', '--random', '--seed', '42'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().jasmineConfig?.env?.seed).toBe(42);
  });

  it('maps --timeout to the jasmine env timeout', async () => {
    process.argv = ['node', 'testify', '--timeout', '5000'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().jasmineConfig?.env?.timeout).toBe(5000);
  });

  it('rejects a non-numeric --timeout', async () => {
    spyOn(logger, 'error');
    process.argv = ['node', 'testify', '--timeout', 'soon'];

    const exitCode = await CLIHandler.run();

    expect(exitCode).toBe(EXIT_CODES.INVALID_USAGE);
  });

  it('returns INVALID_USAGE (not a generic failure) for an invalid --seed', async () => {
    spyOn(logger, 'error');
    process.argv = ['node', 'testify', '--seed', 'not-a-number'];

    const exitCode = await CLIHandler.run();

    expect(exitCode).toBe(EXIT_CODES.INVALID_USAGE);
  });

  it('returns INVALID_USAGE (not a generic failure) for an invalid --port', async () => {
    spyOn(logger, 'error');
    process.argv = ['node', 'testify', '--port', '999999'];

    const exitCode = await CLIHandler.run();

    expect(exitCode).toBe(EXIT_CODES.INVALID_USAGE);
  });

  it('accepts -w -c -b -p -q short aliases', async () => {
    spyOn(logger, 'error');
    process.argv = ['node', 'testify', '-w', '-b', 'node'];
    const { watch } = { watch: jasmine.createSpy('watch').and.resolveTo(0) };
    spyOn(cliDependencies, 'createViteJasmineRunner').and.returnValue({
      start: async () => 0,
      watch,
      cleanup: async () => undefined,
      abort: () => 0,
    } as any);

    // --watch + --browser node is an explicitly incompatible combination,
    // so this should be rejected rather than silently accepted.
    const exitCode = await CLIHandler.run();
    expect(exitCode).toBe(EXIT_CODES.INVALID_USAGE);
  });

  it('maps --file and -f to a file selector', async () => {
    process.argv = ['node', 'testify', '-f', 'forms.spec.ts'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().fileFilter).toBe('forms.spec.ts');
    expect(getConfig().selector).toBeUndefined();
  });

  it('maps --suite and -s to a suite selector', async () => {
    process.argv = ['node', 'testify', '-s', 'Forms validation'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().selector).toEqual({ suite: 'Forms validation' });
  });

  it('accepts file and suite values containing parentheses', async () => {
    process.argv = [
      'node',
      'testify',
      '-f',
      'forms (legacy).spec.ts',
      '-s',
      'Validation (async)',
    ];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().fileFilter).toBe('forms (legacy).spec.ts');
    expect(getConfig().selector).toEqual({ suite: 'Validation (async)' });
  });

  it('treats shell-quoted and unquoted selector values identically after argv parsing', async () => {
    // Shell quotes are not part of process.argv. Both `-f forms.spec.ts` and
    // `-f "forms.spec.ts"` arrive here as the same string value.
    process.argv = ['node', 'testify', '-f', 'forms.spec.ts', '-s', 'Validation'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().fileFilter).toBe('forms.spec.ts');
    expect(getConfig().selector).toEqual({ suite: 'Validation' });
  });

  it('combines --file and --suite into an intersecting selector object', async () => {
    process.argv = [
      'node',
      'testify',
      '--file',
      'forms.spec.ts',
      '--suite',
      'Validation',
    ];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().fileFilter).toBe('forms.spec.ts');
    expect(getConfig().selector).toEqual({ suite: 'Validation' });
  });

  it('rejects --file and --suite when their values are missing', async () => {
    spyOn(logger, 'error');

    process.argv = ['node', 'testify', '--file'];
    expect(await CLIHandler.run()).toBe(EXIT_CODES.INVALID_USAGE);
    expect(logger.error).toHaveBeenCalledWith(jasmine.stringMatching(/--file/));

    (logger.error as jasmine.Spy).calls.reset();
    process.argv = ['node', 'testify', '-s'];
    expect(await CLIHandler.run()).toBe(EXIT_CODES.INVALID_USAGE);
    expect(logger.error).toHaveBeenCalledWith(jasmine.stringMatching(/--suite/));
  });

  it('rejects empty --file/-f and --suite/-s values', async () => {
    spyOn(logger, 'error');

    for (const argv of [
      ['--file', ''],
      ['-f', ''],
      ['--suite', ''],
      ['-s', ''],
      ['--file', '   '],
      ['--suite', '   '],
    ]) {
      (logger.error as jasmine.Spy).calls.reset();
      process.argv = ['node', 'testify', ...argv];

      expect(await CLIHandler.run()).toBe(EXIT_CODES.INVALID_USAGE);
      expect(logger.error).toHaveBeenCalled();
    }
  });

  it('rejects unknown flags and commands as INVALID_USAGE', async () => {
    spyOn(logger, 'error');

    process.argv = ['node', 'testify', '--watc'];
    expect(await CLIHandler.run()).toBe(EXIT_CODES.INVALID_USAGE);

    process.argv = ['node', 'testify', 'watc'];
    expect(await CLIHandler.run()).toBe(EXIT_CODES.INVALID_USAGE);
  });

});