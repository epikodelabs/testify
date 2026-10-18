import { EventEmitter } from 'events';
import http from 'http';
import { BrowserManager } from './browser-manager';
import { HttpServerManager } from './http-server-manager';
import { WebSocketManager } from './websocket-manager';
import { ViteJasmineRunner } from './vite-jasmine-runner';
import { NodeExecutionHost } from './node-execution-host';
import { NodeProcessHost } from './node-process-host';
import { EXIT_CODES, ExitCodeError } from './exit-codes';
import { Logger, logger } from './logger';
import { HmrManager } from './hmr-manager';

describe('Error signaling boundaries', () => {
  beforeEach(() => {
    spyOn(logger, 'error');
    spyOn(logger, 'warn');
    spyOn(logger, 'flushPreparation');
  });

  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    it(`preserves ${signal} during browser launch and closes a late browser`, async () => {
      const before = process.listenerCount(signal);
      const manager = new BrowserManager({} as any);
      let finishLaunch!: (browser: any) => void;
      const launch = new Promise<any>(resolve => { finishLaunch = resolve; });
      const running = manager.runHeadlessBrowserTests({ launch: () => launch } as any, 8888);
      manager.abort(signal);
      await expectAsync(running).toBeRejectedWith(jasmine.objectContaining({
        exitCode: signal === 'SIGINT' ? EXIT_CODES.SIGINT : EXIT_CODES.SIGTERM,
      }));
      const close = jasmine.createSpy('close').and.resolveTo();
      finishLaunch({ close });
      await launch;
      await Promise.resolve();
      expect(close).toHaveBeenCalledTimes(1);
      expect(process.listenerCount(signal)).toBe(before);
    });
  }

  function fakeServer(): any {
    const server: any = new EventEmitter();
    server.listening = false;
    server.listen = jasmine.createSpy('listen');
    server.close = jasmine.createSpy('close').and.callFake((callback: () => void) => {
      server.listening = false;
      callback();
    });
    return server;
  }

  it('shares concurrent server startup and closes the listener once', async () => {
    const manager = new HttpServerManager({ port: 8888 } as any);
    const server = fakeServer();
    spyOn<any>(manager, 'createHttpServer').and.returnValue(server);
    const first = manager.startServer();
    const second = manager.startServer();
    server.listening = true;
    server.listen.calls.first().args[1]();
    expect(await first).toBe(server);
    expect(await second).toBe(server);
    expect(server.listen).toHaveBeenCalledTimes(1);
    await manager.cleanup();
    await manager.cleanup();
    expect(server.close).toHaveBeenCalledTimes(1);
  });

  it('settles server startup when cleanup cancels a port retry', async () => {
    jasmine.clock().install();
    try {
      const manager = new HttpServerManager({ port: 8888 } as any);
      const server = fakeServer();
      const create = spyOn<any>(manager, 'createHttpServer').and.returnValue(server);
      const starting = manager.startServer();
      const rejection = expectAsync(starting).toBeRejectedWith(jasmine.any(ExitCodeError));
      server.emit('error', Object.assign(new Error('busy'), { code: 'EADDRINUSE' }));
      await manager.cleanup();
      await rejection;
      jasmine.clock().tick(4000);
      expect(create).toHaveBeenCalledTimes(1);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  function socketManager(scanDir = async (): Promise<string[]> => []): WebSocketManager {
    return new WebSocketManager({ scanDir } as any, { outDir: 'dist' } as any, http.createServer(), {
      jasmineDone() {},
    } as any);
  }

  it('reports completion despite malformed coverage', async () => {
    const manager = socketManager();
    const completed = jasmine.createSpy('completed');
    manager.on('testsCompleted', completed);
    (manager as any).handleWebSocketMessage({ type: 'jasmineDone', overallStatus: 'passed', coverage: '{broken' });
    expect(completed).toHaveBeenCalledOnceWith({ success: true, hasPending: false, coverage: null });
    expect(logger.error).toHaveBeenCalledTimes(1);
    await manager.cleanup();
  });

  it('treats all-skipped browser runs as success while preserving failure precedence', async () => {
    const manager = socketManager();
    const completed = jasmine.createSpy('completed');
    manager.on('testsCompleted', completed);
    (manager as any).handleWebSocketMessage({ type: 'specDone', status: 'pending' });
    (manager as any).handleWebSocketMessage({ type: 'jasmineDone', overallStatus: 'incomplete' });
    expect(completed).toHaveBeenCalledWith({ success: true, hasPending: true, coverage: null });
    (manager as any).handleWebSocketMessage({ type: 'specDone', status: 'failed' });
    (manager as any).handleWebSocketMessage({ type: 'jasmineDone', overallStatus: 'incomplete' });
    expect(completed.calls.mostRecent().args[0].success).toBeFalse();
    await manager.cleanup();
  });

  it('installs socket listeners before a failing HMR scan settles', async () => {
    let rejectScan!: (error: Error) => void;
    const scan = new Promise<string[]>((_, reject) => { rejectScan = reject; });
    const manager = socketManager(() => scan);
    (manager as any).hmrEnabled = true;
    const socket: any = new EventEmitter();
    socket.readyState = 1;
    socket.send = jasmine.createSpy('send');
    (manager as any).wss.emit('connection', socket);
    expect(socket.listenerCount('message')).toBe(1);
    expect(socket.listenerCount('error')).toBe(1);
    rejectScan(new Error('scan failed'));
    await Promise.resolve();
    await Promise.resolve();
    expect(socket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'hmr:connected', specFiles: [], enabled: true }));
    socket.readyState = 3;
    await manager.cleanup();
  });

  it('closes remaining runner resources when watcher cleanup rejects', async () => {
    const runner = Object.create(ViteJasmineRunner.prototype) as any;
    const failure = new Error('watcher close failed');
    runner.hmrManager = { stop: jasmine.createSpy('stop').and.rejectWith(failure) };
    runner.webSocketManager = null;
    runner.browserManager = { closeBrowser: jasmine.createSpy('closeBrowser').and.resolveTo() };
    runner.httpServerManager = { cleanup: jasmine.createSpy('cleanup').and.resolveTo() };
    await expectAsync(runner.cleanup()).toBeRejectedWith(jasmine.any(AggregateError));
    expect(runner.browserManager.closeBrowser).toHaveBeenCalledTimes(1);
    expect(runner.httpServerManager.cleanup).toHaveBeenCalledTimes(1);
    await expectAsync(runner.cleanup()).toBeRejected();
    expect(runner.httpServerManager.cleanup).toHaveBeenCalledTimes(1);
  });

  for (const scenario of ['error', 'stop'] as const) {
    it(`settles HMR startup on ${scenario} before ready and closes only once`, async () => {
      const manager = new HmrManager({} as any, {} as any, { createPathAliases: () => ({}) } as any);
      const watcher: any = new EventEmitter();
      watcher.close = jasmine.createSpy('close').and.resolveTo();
      spyOn<any>(manager, 'initializeTrackedFiles').and.resolveTo();
      spyOn<any>(manager, 'buildDependencyGraph').and.resolveTo();
      spyOn<any>(manager, 'createWatcher').and.returnValue(watcher);
      const starting = manager.start();
      const rejected = expectAsync(starting).toBeRejected();
      await Promise.resolve();
      await Promise.resolve();
      if (scenario === 'error') watcher.emit('error', new Error('watch unavailable'));
      else await manager.stop();
      await rejected;
      await manager.stop();
      await manager.stop();
      expect(watcher.close).toHaveBeenCalledTimes(1);
    });
  }

  it('keeps a successful Node result when coverage generation rejects', async () => {
    const result = { specResults: [], total: 1, passed: 1, failed: 0, pending: 0 };
    const host = new NodeExecutionHost(
      { resolveRunner: () => ({}) } as any,
      { run: async () => result } as any,
      { generateGlobal: async () => { throw new Error('coverage failed'); } } as any,
    );
    expect(await host.run({})).toBe(result);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('allows Node process failure capture without taking signal ownership', () => {
    const before = process.listenerCount('SIGINT');
    const host = new NodeProcessHost({ handleSignals: false });
    try {
      host.attach();
      expect(process.listenerCount('SIGINT')).toBe(before);
    } finally {
      host.detach();
    }
  });

  function browserRunner(): any {
    const runner = Object.create(ViteJasmineRunner.prototype) as any;
    runner.config = { port: 8888, browser: 'chrome' };
    runner.fileDiscovery = {};
    runner.consoleReporter = {};
    runner.httpServerManager = { startServer: async () => http.createServer(), waitForServerReady: async () => {} };
    runner.preparedBrowserType = {};
    runner.coverageHost = { generate: jasmine.createSpy('generate').and.resolveTo() };
    runner.browserManager = {};
    spyOn(runner, 'cleanup').and.callFake(async () => { await runner.webSocketManager?.cleanup(); });
    return runner;
  }

  it('keeps successful headless results when asynchronous coverage fails', async () => {
    const runner = browserRunner();
    runner.coverageHost.generate.and.rejectWith(new Error('coverage failed'));
    runner.browserManager.runHeadlessBrowserTests = async () => {
      runner.webSocketManager.emit('testsCompleted', { success: true, coverage: {} });
    };
    expect(await runner.runHeadlessBrowserMode()).toBe(EXIT_CODES.SUCCESS);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('reports missing completion messages as infrastructure failures', async () => {
    jasmine.clock().install();
    try {
      const runner = browserRunner();
      runner.browserManager.runHeadlessBrowserTests = async () => {};
      const running = runner.runHeadlessBrowserMode();
      for (let step = 0; step < 8; step++) await Promise.resolve();
      jasmine.clock().tick(5001);
      expect(await running).toBe(EXIT_CODES.INTERNAL_ERROR);
      expect(runner.cleanup).toHaveBeenCalledTimes(1);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('closes a headed browser and succeeds even if coverage rejects', async () => {
    const runner = browserRunner();
    let onClose!: () => Promise<void>;
    runner.browserManager.openBrowser = async (_port: number, callback: () => Promise<void>) => { onClose = callback; };
    runner.browserManager.closeBrowser = jasmine.createSpy('closeBrowser').and.resolveTo();
    runner.coverageHost.generate.and.rejectWith(new Error('coverage failed'));
    const running = runner.runHeadedBrowserMode();
    for (let step = 0; step < 5; step++) await Promise.resolve();
    runner.webSocketManager.emit('testsCompleted', { success: true, coverage: {} });
    for (let step = 0; step < 5; step++) await Promise.resolve();
    expect(runner.browserManager.closeBrowser).toHaveBeenCalledTimes(1);
    await onClose();
    expect(await running).toBe(EXIT_CODES.SUCCESS);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('resolves an embedded watch caller with the abort signal code', async () => {
    const runner = Object.create(ViteJasmineRunner.prototype) as any;
    runner.consoleReporter = { hasCompletedRun: () => true };
    runner.browserManager = { abort: jasmine.createSpy('abort') };
    const completion = new Promise(resolve => { runner.finishResolve = resolve; });
    expect(runner.abort('SIGTERM')).toBe(EXIT_CODES.SIGTERM);
    expect(await completion).toBe(EXIT_CODES.SIGTERM);
    expect(runner.finishResolve).toBeNull();
  });

  it('rejects reentrant starts before touching resources', async () => {
    const runner = Object.create(ViteJasmineRunner.prototype) as any;
    runner.started = true;
    await expectAsync(runner.start()).toBeRejectedWith(jasmine.objectContaining({ exitCode: EXIT_CODES.INVALID_USAGE }));
    await expectAsync(runner.watch()).toBeRejectedWith(jasmine.objectContaining({ exitCode: EXIT_CODES.INVALID_USAGE }));
  });

  it('routes runtime and failed preparation diagnostics to stderr', () => {
    const suppressed = (globalThis as any).__testifySuppressLogs;
    (globalThis as any).__testifySuppressLogs = false;
    const stdout = spyOn(process.stdout, 'write').and.returnValue(true);
    const stderr = spyOn(process.stderr, 'write').and.returnValue(true);
    try {
      const output = new Logger();
      output.error('runtime diagnostic');
      output.preparationStart('');
      output.error('preparation diagnostic');
      output.flushPreparation();
      output.error('post-flush diagnostic');
      const errors = stderr.calls.allArgs().map(args => String(args[0])).join('');
      expect(errors).toContain('runtime diagnostic');
      expect(errors).toContain('preparation diagnostic');
      expect(errors).toContain('post-flush diagnostic');
      expect(stdout.calls.allArgs().map(args => String(args[0])).join('')).not.toContain('diagnostic');
    } finally {
      (globalThis as any).__testifySuppressLogs = suppressed;
    }
  });
});
