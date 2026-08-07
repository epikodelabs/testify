import {
  FileDiscoveryService,
} from './file-discovery-service';
import {
  ViteConfigBuilder,
} from './vite-config-builder';

describe('generated module extension', () => {
  const config = {
    srcDirs: ['./src'],
    testDirs: ['./tests'],
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
  } as any;

  it('keeps Rollup entry names extensionless', () => {
    const builder =
      new ViteConfigBuilder(
        config,
      );

    const viteConfig =
      builder.createViteConfig([
        './src/example.ts',
        './tests/example.spec.ts',
      ]);

    const input =
      viteConfig
        .build
        ?.rollupOptions
        ?.input as
          Record<string, string>;

    for (
      const name of
      Object.keys(input)
    ) {
      expect(name)
        .not.toMatch(
          /\.(?:js|mjs)$/,
        );
    }
  });

  it('lets Rollup append .mjs exactly once', () => {
    const builder =
      new ViteConfigBuilder(
        config,
      );

    const viteConfig =
      builder.createViteConfig([
        './src/example.ts',
        './tests/example.spec.ts',
      ]);

    const output =
      viteConfig
        .build
        ?.rollupOptions
        ?.output as any;

    expect(
      output.entryFileNames,
    ).toBe(
      '[name].mjs',
    );

    expect(
      output.chunkFileNames,
    ).toBe(
      'vendor.mjs',
    );
  });

  it('reports final source/spec names with one .mjs suffix', () => {
    const discovery =
      new FileDiscoveryService(
        config,
      );

    expect(
      discovery.getOutputName(
        './src/example.ts',
      ),
    ).toMatch(
      /__[\da-f]{8}\.mjs$/,
    );

    expect(
      discovery.getOutputName(
        './tests/example.spec.ts',
      ),
    ).toMatch(
      /__[\da-f]{8}\.spec\.mjs$/,
    );
  });
});
