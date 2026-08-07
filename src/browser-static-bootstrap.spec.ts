import {
  getStaticBrowserBootstrapScript,
} from './browser-static-bootstrap';

describe('static browser bootstrap', () => {
  it('loads Jasmine boot1 before importing specs', () => {
    const source =
      getStaticBrowserBootstrapScript({
        preludeModules: [],
        specFiles: [
          'fixture.spec.js',
        ],
      });

    const boot0Index =
      source.indexOf(
        'boot0.js',
      );

    const boot1Index =
      source.indexOf(
        'boot1.js',
      );

    const specIndex =
      source.indexOf(
        'fixture.spec.js',
      );

    expect(boot0Index)
      .toBeGreaterThan(-1);

    expect(boot1Index)
      .toBeGreaterThan(
        boot0Index,
      );

    expect(specIndex)
      .toBeGreaterThan(
        boot1Index,
      );
  });

  it('keeps the Jasmine HTML reporter boot sequence', () => {
    const source =
      getStaticBrowserBootstrapScript({
        preludeModules: [],
        specFiles: [],
      });

    expect(source).toContain(
      '/jasmine-core/boot0.js',
    );

    expect(source).toContain(
      '/jasmine-core/boot1.js',
    );
  });
});
