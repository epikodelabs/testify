import { BrowserPageBuilder } from './browser-page-builder';
import type { ViteJasmineConfig } from './vite-jasmine-config';

describe('BrowserPageBuilder', () => {
  const config = {
    outDir: 'dist/.vite-jasmine-build',
    htmlOptions: {
      title: 'Testify',
      preludeModules: [],
    },
    jasmineConfig: {
      env: {
        random: false,
        seed: 0,
        stopSpecOnExpectationFailure: false,
      },
    },
  } as unknown as ViteJasmineConfig;

  it('passes static spec files into the static bootstrap', () => {
    const builder =
      new BrowserPageBuilder(config);

    const html = builder.buildStatic([
      'forms.spec.js',
      'binding.spec.mjs',
    ]);

    expect(html).toContain(
      'forms.spec.js',
    );
    expect(html).toContain(
      'binding.spec.mjs',
    );
  });

  it('uses the shared BrowserPage renderer for HMR mode', () => {
    const builder =
      new BrowserPageBuilder(config);

    const html = builder.buildHmr();

    expect(html).toContain(
      '<!DOCTYPE html>',
    );
    expect(html).toContain(
      'Jasmine Test Runner',
    );
  });
});
