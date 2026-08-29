import {
  BrowserPageBuilder,
} from './browser-page-builder';
import {
  getJasmineBrowserAssets,
} from './jasmine-browser-assets';
import type {
  ViteJasmineConfig,
} from './vite-jasmine-config';

describe('BrowserPageBuilder static reporter bridge', () => {
  it('includes the WebSocket reporter and static spec imports', () => {
    const jasmineAssets =
      getJasmineBrowserAssets();

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
      jasmineAssets.jasmineScriptUrl,
    );

    expect(html).toContain(
      jasmineAssets.jasmineHtmlScriptUrl,
    );

    for (
      const bootScriptUrl of
      jasmineAssets.bootScriptUrls
    ) {
      expect(html).toContain(
        bootScriptUrl,
      );
    }

    expect(html).toContain(
      jasmineAssets.cssUrl,
    );

    expect(html).toContain(
      'import "./forms.spec.mjs";',
    );
  });
});
