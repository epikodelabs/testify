import {
  ViteConfigBuilder,
} from './vite-config-builder';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

describe('ViteConfigBuilder Node resolution', () => {
  let tsconfigPath = '';

  beforeEach(() => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-tsconfig-'));
    tsconfigPath = path.join(root, 'tsconfig.json');
    fs.writeFileSync(tsconfigPath, JSON.stringify({
      compilerOptions: {
        paths: {
          '@epikodelabs/streamix': ['./projects/libraries/streamix/src/lib/index.ts'],
        },
      },
    }));
  });

  afterEach(() => {
    fs.rmSync(path.dirname(tsconfigPath), { recursive: true, force: true });
  });

  it('uses Node resolution, external packages, and no vendor chunking', () => {
    const builder =
      new ViteConfigBuilder({
        srcDirs: ['./src'],
        testDirs: ['./src'],
        outDir:
          './dist/.vite-jasmine-build',
        browser: 'node',
        tsconfig: tsconfigPath,
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

    expect(
      rolldown.external(
        '@epikodelabs/streamix',
      ),
    ).toBeFalse();

    expect(
      rolldown.external(
        '@epikodelabs/streamix/angular',
      ),
    ).toBeFalse();

    expect(
      config.resolve?.alias?.['@epikodelabs/streamix'],
    ).toContain(
      'projects/libraries/streamix/src/lib/index.ts',
    );
  });
});
