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
      if (/catch\s*\(\s*_\w*\s*(?::[^)]*)?\)/.test(source)) violations.push(`${name}: discarded caught error`);
      if (/\.catch\(\s*\(\)\s*=>\s*\{\s*\}\s*\)/s.test(source)) violations.push(`${name}: empty promise catch`);
      // These guard common regressions; behavioral specs verify the actual
      // failure boundaries. This is deliberately not a TypeScript parser.
      if (/\.(?:on|once|addListener)\(\s*['"][^'"]+['"]\s*,\s*async\b/.test(source)) {
        violations.push(`${name}: async EventEmitter callback must use an observed promise`);
      }
      if (/\.(?:on|once)\(\s*['"]error['"]\s*,\s*\(\s*\)\s*=>/.test(source)) {
        violations.push(`${name}: error event listener discards its diagnostic`);
      }
      for (const match of source.matchAll(/\.catch\(\s*\(\s*\)\s*=>\s*\{([^}]*)\}/g)) {
        if (!/\/\/|\/\*/.test(match[1])) violations.push(`${name}: discarded rejection requires an ownership/recovery comment`);
      }
      for (const match of source.matchAll(/\bvoid\s+[\w.]+\([^;]*;/g)) {
        if (!match[0].includes('.catch(')) violations.push(`${name}: detached call requires a rejection handler`);
      }
    }

    expect(violations).withContext(violations.join('\n')).toEqual([]);
  });
});
