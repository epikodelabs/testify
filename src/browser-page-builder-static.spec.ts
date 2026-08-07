import {
  BrowserPageBuilder,
} from './browser-page-builder';
import type {
  ViteJasmineConfig,
} from './vite-jasmine-config';

describe('BrowserPageBuilder static reporter bridge', () => {
  it('includes the WebSocket reporter and static spec imports', () => {
    const builder =
      new BrowserPageBuilder({
        outDir:
          'dist/.vite-jasmine-build',
        htmlOptions: {
          title: 'Testify',
          preludeModules: [],
        },
        jasmineConfig: {
          env: {
            random: false,
            seed: 0,
            stopSpecOnExpectationFailure:
              false,
          },
        },
      } as unknown as ViteJasmineConfig);

    const html =
      builder.buildStatic([
        'forms.spec.mjs',
      ]);

    expect(html).toContain(
      'WebSocketEventForwarder',
    );

    expect(html).toContain(
      'boot0.js',
    );

    expect(html).toContain(
      'boot1.js',
    );

    expect(html).toContain(
      'import "./forms.spec.mjs";',
    );
  });
});
