import http from 'http';
import { WebSocketManager } from './websocket-manager';

describe('WebSocketManager', () => {
  it('forwards Jasmine start metadata rather than the WebSocket envelope', async () => {
    const jasmineStarted = jasmine.createSpy('jasmineStarted');
    const manager = new WebSocketManager(
      { scanDir: async () => [] } as any,
      { outDir: 'dist' } as any,
      http.createServer(),
      {
        jasmineStarted,
        suiteStarted() {},
        specStarted() {},
        specDone() {},
        suiteDone() {},
        jasmineDone() {},
      },
    );

    const suiteInfo = {
      totalSpecsDefined: 1,
      order: { random: true, seed: '42' },
    };
    (manager as any).handleWebSocketMessage({
      type: 'jasmineStarted',
      data: suiteInfo,
    });

    expect(jasmineStarted).toHaveBeenCalledOnceWith(suiteInfo);
    await manager.cleanup();
  });

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
