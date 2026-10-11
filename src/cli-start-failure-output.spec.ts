import { cliDependencies, CLIHandler } from './cli-handler';
import { ConfigManager } from './config-manager';
import { ProcessLock } from './process-lock';
import { logger } from './logger';
import { EXIT_CODES, ExitCodeError } from './exit-codes';

describe('Testify CLI start-failure reporting', () => {
  let originalArgv: string[];
  const previousSuppression = (globalThis as any).__testifySuppressLogs;

  beforeEach(() => {
    originalArgv = process.argv;
    process.setMaxListeners(50);
    // Suppression keeps the shared logger singleton state-free: the run below
    // must not leave an open preparation card buffering later suite output.
    (globalThis as any).__testifySuppressLogs = true;
    spyOn(ConfigManager, 'loadViteJasmineBrowserConfig').and.returnValue({
      srcDirs: ['./src'],
      testDirs: ['./tests'],
      exclude: [],
      outDir: './dist/.vite-jasmine-build',
      preserveOutputs: false,
      browser: 'chrome',
      headless: false,
      coverage: false,
      port: 8888,
    } as any);
    spyOn(ProcessLock.prototype, 'acquire').and.resolveTo(undefined);
    spyOn(ProcessLock.prototype, 'releaseSync').and.stub();
    spyOn(ProcessLock.prototype, 'getPidFilePath').and.returnValue('/tmp/testify.pid');
  });

  afterEach(() => {
    process.argv = originalArgv;
    if (previousSuppression === undefined) {
      delete (globalThis as any).__testifySuppressLogs;
    } else {
      (globalThis as any).__testifySuppressLogs = previousSuppression;
    }
  });

  it('flushes the buffered preparation card when the runner start fails', async () => {
    process.argv = ['node', 'testify'];
    spyOn(cliDependencies, 'createViteJasmineRunner').and.returnValue({
      start: async () => {
        throw new ExitCodeError(EXIT_CODES.INTERNAL_ERROR, 'simulated build failure');
      },
      watch: async () => 0,
      cleanup: async () => undefined,
      abort: () => 0,
    } as any);
    const errorSpy = spyOn(logger, 'error');
    const flushSpy = spyOn(logger, 'flushPreparation');

    const exitCode = await CLIHandler.run();

    expect(exitCode).toBe(EXIT_CODES.INTERNAL_ERROR);
    expect(errorSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
  });
});
