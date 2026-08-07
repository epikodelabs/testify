import {
  BrowserPageBuilder,
} from './browser-page-builder';

describe('static browser page compatibility', () => {
  it('preserves the v1 parser-time boot sequence', () => {
    const builder =
      new BrowserPageBuilder({
        outDir: './dist',
        htmlOptions: {
          title: 'Jasmine Test Runner',
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
      } as any);

    const html =
      builder.buildStatic([
        'fixture.spec.mjs',
      ]);

    const boot0 =
      html.indexOf(
        'boot0.js',
      );

    const boot1 =
      html.indexOf(
        'boot1.js',
      );

    const moduleScript =
      html.indexOf(
        '<script type="module">',
      );

    const specImport =
      html.indexOf(
        'import "./fixture.spec.mjs";',
      );

    expect(boot0)
      .toBeGreaterThan(-1);

    expect(boot1)
      .toBeGreaterThan(
        boot0,
      );

    expect(moduleScript)
      .toBeGreaterThan(
        boot1,
      );

    expect(specImport)
      .toBeGreaterThan(
        moduleScript,
      );

    expect(html)
      .not.toContain(
        "document.createElement('script')",
      );
  });
});
