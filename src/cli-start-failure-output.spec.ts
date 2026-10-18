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
      selectSpecFiles: async () => {},
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

  it('does not re-log a failure the runner already reported into the card', async () => {
    process.argv = ['node', 'testify'];
    spyOn(cliDependencies, 'createViteJasmineRunner').and.returnValue({
      selectSpecFiles: async () => {},
      start: async () => {
        throw new ExitCodeError(EXIT_CODES.INTERNAL_ERROR, 'simulated build failure');
      },
      watch: async () => 0,
      cleanup: async () => undefined,
      abort: () => 0,
    } as any);
    const errorSpy = spyOn(logger, 'error');
    spyOn(logger, 'flushPreparation').and.stub();
    // The runner's own diagnostics are recorded as preparation errors; the
    // backstay must stay silent so one failure never renders twice.
    spyOn(logger, 'hasPreparationErrors').and.returnValue(true);

    const exitCode = await CLIHandler.run();

    expect(exitCode).toBe(EXIT_CODES.INTERNAL_ERROR);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('releases its lock, cleans up, and removes its handlers after repeated failures', async () => {
    process.argv = ['node', 'testify'];
    const events = ['SIGINT', 'SIGTERM', 'exit'] as const;
    const before = events.map(event => process.listenerCount(event));
    const cleanup = jasmine.createSpy('cleanup').and.resolveTo();
    spyOn(cliDependencies, 'createViteJasmineRunner').and.returnValue({
      selectSpecFiles: async () => {},
      start: async () => { throw new Error('failed startup'); }, cleanup,
    } as any);
    spyOn(logger, 'error');
    spyOn(logger, 'flushPreparation');
    for (let attempt = 0; attempt < 2; attempt++) {
      expect(await CLIHandler.run()).toBe(EXIT_CODES.INTERNAL_ERROR);
      expect(events.map(event => process.listenerCount(event))).toEqual(before);
    }
    expect(cleanup).toHaveBeenCalledTimes(2);
    expect(ProcessLock.prototype.releaseSync).toHaveBeenCalledTimes(2);
  });

  it('finishes file selection before opening preparation or acquiring the process lock', async () => {
    process.argv = ['node', 'testify', '--file', 'login.spec.ts'];
    const events: string[] = [];
    let choose!: () => void;
    const selected = new Promise<void>(resolve => { choose = resolve; });
    spyOn(cliDependencies, 'createViteJasmineRunner').and.returnValue({
      selectSpecFiles: async () => { await selected; events.push('selection'); },
      start: async () => { events.push('execution'); return 0; },
      cleanup: async () => {},
    } as any);
    const preparation = spyOn(logger, 'preparationStart').and.callFake(() => { events.push('preparation'); return true; });
    (ProcessLock.prototype.acquire as jasmine.Spy).and.callFake(async () => { events.push('lock'); });
    const running = CLIHandler.run();
    await Promise.resolve();
    expect(preparation).not.toHaveBeenCalled();
    expect(ProcessLock.prototype.acquire).not.toHaveBeenCalled();
    choose();
    expect(await running).toBe(0);
    expect(events).toEqual(['selection', 'preparation', 'lock', 'execution']);
  });

  it('rejects unmatched files without beginning preparation or acquiring a lock', async () => {
    process.argv = ['node', 'testify', '--file', 'login.spec.ts'];
    spyOn(cliDependencies, 'createViteJasmineRunner').and.returnValue({
      selectSpecFiles: async () => { throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'No spec file matches'); },
    } as any);
    const preparation = spyOn(logger, 'preparationStart');
    spyOn(logger, 'error');
    expect(await CLIHandler.run()).toBe(EXIT_CODES.INVALID_USAGE);
    expect(preparation).not.toHaveBeenCalled();
    expect(ProcessLock.prototype.acquire).not.toHaveBeenCalled();
  });
});
