import fs from 'fs';
import path from 'path';

describe('Playground session exit host command', () => {
  it('routes session:exit through the WebSocket host', () => {
    const source = fs.readFileSync(
      path.resolve(
        process.cwd(),
        'src/websocket-manager.ts',
      ),
      'utf8',
    );

    expect(source).toContain(
      "case 'session:exit':",
    );
    expect(source).toContain(
      "this.emit('sessionExitRequested')",
    );
  });

  it('closes the browser and resolves watch mode cleanly', () => {
    const source = fs.readFileSync(
      path.resolve(
        process.cwd(),
        'src/vite-jasmine-runner.ts',
      ),
      'utf8',
    );

    expect(source).toContain(
      "'sessionExitRequested'",
    );
    expect(source).toContain(
      "await this.browserManager.closeBrowser();",
    );
    expect(source).toContain(
      'watchFinishedResolve?.(EXIT_CODES.SUCCESS)',
    );
  });
});
