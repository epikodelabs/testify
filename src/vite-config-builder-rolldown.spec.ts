import {
  ViteConfigBuilder,
} from './vite-config-builder';

describe('ViteConfigBuilder Rolldown contract', () => {
  it('keeps input and output under rolldownOptions', () => {
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

    const build =
      config.build as any;

    expect(
      build.rolldownOptions,
    ).toBeDefined();

    expect(
      build.rolldownOptions.input,
    ).toBeDefined();

    expect(
      build.rolldownOptions.output,
    ).toBeDefined();

    expect(
      build.rollupOptions,
    ).toBeUndefined();
  });
});
