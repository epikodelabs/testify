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

  it('captures browser async errors and attributes them to the active spec', () => {
    const source =
      getBrowserWebSocketReporterScript({
        initialSeed: 0,
        initialRandom: false,
      });

    expect(source).toContain(
      "window.addEventListener(\n      'unhandledrejection'",
    );

    expect(source).toContain(
      "window.addEventListener(\n      'error'",
    );

    expect(source).toContain(
      'this.currentSpecId = null;',
    );

    expect(source).toContain(
      'self.mergePendingSpecFailures(result)',
    );

    expect(source).toContain(
      'self.collectRunLevelFailures(result)',
    );
  });
});
