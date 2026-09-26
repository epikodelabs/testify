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

    expect(
      build.emptyOutDir,
    ).toBeFalse();
  });

  it('keeps Vite silent so Testify owns terminal output', () => {
    const builder =
      new ViteConfigBuilder({
        srcDirs: ['./src'],
        testDirs: ['./src'],
        outDir:
          './dist/.vite-jasmine-build',
        browser: 'node',
        viteConfig: {
          logLevel: 'info',
          clearScreen: true,
        },
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

    expect(config.logLevel)
      .toBe('silent');

    expect(config.clearScreen)
      .toBeFalse();
  });

});
