import fs from 'fs';
import path from 'path';

describe('error logging convention', () => {
  it('does not silently swallow caught errors in Node-side source files', () => {
    const srcDir = path.resolve(process.cwd(), 'src');
    const files = fs.readdirSync(srcDir).filter((name) => name.endsWith('.ts') && !name.endsWith('.spec.ts'));
    const violations: string[] = [];

    for (const name of files) {
      const source = fs.readFileSync(path.join(srcDir, name), 'utf8');
      if (/catch\s*\{/.test(source)) violations.push(`${name}: bare catch`);
      if (/\.catch\(\s*\(\)\s*=>\s*\{\s*\}\s*\)/s.test(source)) violations.push(`${name}: empty promise catch`);
    }

    expect(violations).withContext(violations.join('\n')).toEqual([]);
  });
});
