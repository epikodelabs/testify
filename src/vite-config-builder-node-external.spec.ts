import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  ViteConfigBuilder,
} from './vite-config-builder';

describe('ViteConfigBuilder Node externals', () => {
  it('keeps package dependencies external in Node builds', () => {
    const directory =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-node-external-',
        ),
      );

    const previousCwd =
      process.cwd();

    try {
      fs.writeFileSync(
        path.join(
          directory,
          'package.json',
        ),
        JSON.stringify({
          dependencies: {
            playwright: '1.0.0',
          },
          devDependencies: {
            vite: '8.0.0',
          },
        }),
      );

      process.chdir(
        directory,
      );

      const builder =
        new ViteConfigBuilder({
          srcDirs: ['./src'],
          testDirs: ['./tests'],
          exclude: [],
          outDir: './dist',
          browser: 'node',
          preserveOutputs: false,
        } as any);

      const config =
        builder.createViteConfig([]);

      const external =
        config.build
          ?.rolldownOptions
          ?.external as
            ((id: string) => boolean);

      expect(
        external('playwright'),
      ).toBeTrue();

      expect(
        external(
          'playwright/lib/index',
        ),
      ).toBeTrue();

      expect(
        external('vite'),
      ).toBeTrue();

      expect(
        external('./local-module'),
      ).toBeFalse();
    } finally {
      process.chdir(
        previousCwd,
      );

      fs.rmSync(
        directory,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });

  it('does not externalize package dependencies for browser builds', () => {
    const builder =
      new ViteConfigBuilder({
        srcDirs: ['./src'],
        testDirs: ['./tests'],
        exclude: [],
        outDir: './dist',
        browser: 'chrome',
        preserveOutputs: false,
      } as any);

    const config =
      builder.createViteConfig([]);

    expect(
      config.build
        ?.rolldownOptions
        ?.external,
    ).toBeUndefined();
  });
});
