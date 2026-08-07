import fs from 'fs';
import path from 'path';

describe('ViteJasmineRunner coverage boundary', () => {
  it('uses CoverageHost instead of constructing coverage generators inline', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'CoverageHost',
    );

    expect(source).not.toContain(
      'new CoverageReportGenerator',
    );
  });
});
