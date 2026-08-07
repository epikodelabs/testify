import {
  getBrowserWebSocketReporterScript,
} from './browser-websocket-runtime';

describe('Browser WebSocket runtime', () => {
  it('receives ordering configuration explicitly', () => {
    const source =
      getBrowserWebSocketReporterScript({
        initialSeed: 42,
        initialRandom: true,
      });

    expect(source).toContain(
      'self.getOrderedSuites(42, true)',
    );

    expect(source).toContain(
      'self.getOrderedSpecs(42, true)',
    );
  });
});
