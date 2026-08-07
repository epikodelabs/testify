import {
  ViteConfigBuilder,
} from './vite-config-builder';

describe('ViteConfigBuilder Node resolution', () => {
  it('uses Node resolution, external packages, and no vendor chunking', () => {
    const builder =
      new ViteConfigBuilder({
        srcDirs: ['./src'],
        testDirs: ['./src'],
        outDir:
          './dist/.vite-jasmine-build',
        browser: 'node',
        jasmineConfig: {
          env: {
            random: false,
            seed: 0,
            stopSpecOnExpectationFailure:
              false,
          },
        },
      } as any);

    const config =
      builder.createViteConfig([
        './src/example.ts',
      ]);

    const rolldown =
      config.build
        ?.rolldownOptions as any;

    expect(
      config.build?.ssr,
    ).toBeTrue();

    expect(
      rolldown.output
        .manualChunks,
    ).toBeUndefined();

    expect(
      rolldown.output
        .chunkFileNames,
    ).toBe(
      '[name].mjs',
    );

    expect(
      rolldown.external(
        'events',
      ),
    ).toBeTrue();

    expect(
      rolldown.external(
        'playwright',
      ),
    ).toBeTrue();

    expect(
      rolldown.external(
        './local-module',
      ),
    ).toBeFalse();
  });
});
