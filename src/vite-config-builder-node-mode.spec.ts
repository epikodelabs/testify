import {
  ViteConfigBuilder,
} from './vite-config-builder';

describe('ViteConfigBuilder Node mode', () => {
  it('uses a normal multi-entry ESM build instead of SSR mode', () => {
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

    expect(
      config.build?.ssr,
    ).toBeUndefined();

    expect(
      config.build?.modulePreload,
    ).toBeFalse();

    const rolldown =
      config.build
        ?.rolldownOptions as any;

    expect(
      rolldown.input,
    ).toBeDefined();

    expect(
      rolldown.output
        .entryFileNames,
    ).toBe(
      '[name].mjs',
    );

    expect(
      typeof rolldown.external,
    ).toBe(
      'function',
    );
  });
});
