import fs from 'fs';
import path from 'path';

describe('Testify CLI watch contract', () => {
  it('makes watch mode explicit through --watch only', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/cli-handler.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      "'-w, --watch'",
    );

    expect(source).toContain(
      'watch,',
    );

    expect(source).not.toContain(
      'config.watch || false',
    );
  });

  it('forces headed mode for watch even when config is headless', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/cli-handler.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      ': watch',
    );

    expect(source).toContain(
      '? false',
    );
  });

  it('keeps start() one-shot instead of redirecting to HMR', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'this.config.watch = false',
    );

    expect(source).not.toContain(
      'return this.watch();',
    );
  });

  it('keeps runner headless default false when config omits it', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'headless: config.headless ?? false',
    );
  });

  it('keeps runner browser default chrome when config omits it', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      "browser: config.browser ?? 'chrome'",
    );
  });


  it('keeps watch lifecycle output inside the preparation section', () => {
    const runnerSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );
    const serverSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/http-server-manager.ts',
        ),
        'utf8',
      );
    const websocketSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/websocket-manager.ts',
        ),
        'utf8',
      );
    const hmrSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/hmr-manager.ts',
        ),
        'utf8',
      );

    expect(runnerSource).toContain(
      "return `WATCH · ${browser}`",
    );
    expect(runnerSource).toContain(
      '? RunnerMessages.generatedHmrTestPage()',
    );
    expect(runnerSource).toContain(
      "logger.preparationStep('HMR', RunnerMessages.startingHmrWatcher())",
    );
    expect(runnerSource).toContain(
      "logger.preparationStep('SERVER', RunnerMessages.testServerRunning(this.config.port!)",
    );
    expect(runnerSource).toContain(
      "logger.preparationStep('WS', RunnerMessages.webSocketReady()",
    );
    expect(runnerSource).toContain(
      "logger.preparationStep('READY', RunnerMessages.pressCtrlCToStop()",
    );
    expect(runnerSource).toContain(
      "{ label: 'PORT', message: 'Acquire test server port' }",
    );
    expect(serverSource).toContain(
      "logger.preparationStep('PORT', HttpServerMessages.portBusyRetrying(port))",
    );
    expect(serverSource).toContain(
      "logger.preparationStep('PORT', HttpServerMessages.portReclaimed(port))",
    );
    expect(serverSource).toContain(
      "logger.preparationStep('PORT', HttpServerMessages.portAcquired(port), true)",
    );
    expect(serverSource).toContain(
      'HttpServerMessages.failedToReleasePort(port)',
    );
    expect(serverSource).not.toContain(
      'err.message, stderr',
    );
    expect(websocketSource).toContain(
      "logger.preparationStep('HMR', WebSocketMessages.hmrEnabled())",
    );
    expect(hmrSource).not.toContain(
      'logger.println(HmrMessages.watcherStopped())',
    );
    expect(hmrSource).not.toContain(
      "logger.preparationStep('HMR', HmrMessages.watcherStopped())",
    );
  });

  it('uses the HMR page wording in watch mode', () => {
    const messagesSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/log-messages.ts',
        ),
        'utf8',
      );

    expect(messagesSource).toContain(
      'Generated HMR-enabled test page: index.html',
    );
  });
});
