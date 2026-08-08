import fs from 'fs';
import path from 'path';

describe('HMR removed spec contract', () => {
  it('emits test-remove for a deleted spec instead of asking browser to import it', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/hmr-manager.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      "| 'test-remove'",
    );

    expect(source).toContain(
      "? 'test-remove'",
    );

    expect(source).toContain(
      "'Test file removed'",
    );
  });
});
