import fs from 'fs';
import path from 'path';

describe('Testify CLI watch contract', () => {
  it('makes watch mode explicit through --watch only', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/cli-handler.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'const watch = args.includes(\'--watch\')',
    );

    expect(source).toContain(
      'watch,',
    );

    expect(source).not.toContain(
      'config.watch || false',
    );
  });

  it('forces headed mode for watch even when config is headless', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/cli-handler.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      ': watch',
    );

    expect(source).toContain(
      '? false',
    );
  });

  it('keeps start() one-shot instead of redirecting to HMR', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'this.config.watch = false',
    );

    expect(source).not.toContain(
      'return this.watch();',
    );
  });

  it('keeps runner headless default false when config omits it', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'headless: config.headless ?? false',
    );
  });

  it('keeps runner browser default chrome when config omits it', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      "browser: config.browser ?? 'chrome'",
    );
  });
});
