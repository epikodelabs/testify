import http from 'http';
import { WebSocketManager } from './websocket-manager';

describe('WebSocketManager', () => {
  it('treats jasmineDone global failures as an unsuccessful run', async () => {
    const manager =
      new WebSocketManager(
        {
          scanDir: async () => [],
        } as any,
        {
          outDir: 'dist',
        } as any,
        http.createServer(),
        {
          jasmineStarted() {},
          suiteStarted() {},
          specStarted() {},
          specDone() {},
          suiteDone() {},
          jasmineDone() {},
        },
      );

    const completion =
      new Promise<any>((resolve) => {
        manager.once(
          'testsCompleted',
          resolve,
        );
      });

    (manager as any).handleWebSocketMessage({
      type: 'jasmineStarted',
    });

    (manager as any).handleWebSocketMessage({
      type: 'jasmineDone',
      overallStatus: 'passed',
      failedExpectations: [{
        message:
          'Unhandled promise rejection: Error: authorization service unavailable',
      }],
    });

    await expectAsync(completion)
      .toBeResolvedTo(
        jasmine.objectContaining({
          success: false,
          hasPending: false,
        }),
      );

    await manager.cleanup();
  });
});
