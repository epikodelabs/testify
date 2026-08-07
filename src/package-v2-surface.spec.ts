import fs from 'fs';
import path from 'path';

describe('Testify v2 package surface', () => {
  it('publishes the temporary /v2 subpath', () => {
    const pkg = JSON.parse(
      fs.readFileSync(
        path.resolve(process.cwd(), 'package.json'),
        'utf8',
      ),
    );

    expect(pkg.exports['./v2']).toBe(
      './lib/v2.js',
    );
  });
});
