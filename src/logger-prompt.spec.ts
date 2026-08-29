import fs from 'fs';
import path from 'path';

describe('Logger prompt styling', () => {
  const source = fs.readFileSync(
    path.resolve(
      process.cwd(),
      'src/logger.ts',
    ),
    'utf8',
  );

  it('uses a thicker prompt marker for interactive output', () => {
    expect(source).toContain(
      '> ',
    );
    expect(source).toContain(
      "plainPrompt = '> '",
    );
  });

  it('uses the %error% prefix to drive error formatting', () => {
    expect(source).toContain(
      "const errorToken =",
    );
    expect(source).toContain(
      "'%error% ';",
    );
    expect(source).toContain(
      'this.errorPrefix() +',
    );
  });

  it('uses the %warn% prefix to drive warning badge formatting', () => {
    expect(source).toContain(
      "const warnToken =",
    );
    expect(source).toContain(
      "'%warn% ';",
    );
    expect(source).toContain(
      'this.warnPrefix() +',
    );
  });

  it('exposes a dedicated warn logger method', () => {
    expect(source).toContain(
      'warn(msg: string)',
    );
    expect(source).toContain(
      'forceWarnPrefix',
    );
  });
});
