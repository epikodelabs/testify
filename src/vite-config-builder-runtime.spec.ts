import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { ViteConfigBuilder } from './vite-config-builder';

for (const browser of ['node', 'chrome'] as const) {
  describe(`ViteConfigBuilder runtime helpers (${browser})`, () => {
    it('builds and runs decorated sources without a consumer runtime dependency', async () => {
      const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-runtime-'));
      const previousCwd = process.cwd();
      try {
        fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify({ type: 'module' }));
        fs.writeFileSync(path.join(directory, 'tsconfig.json'), JSON.stringify({
          compilerOptions: { target: 'ES2022', experimentalDecorators: true },
        }));
        const entry = path.join(directory, 'fixture.ts');
        fs.writeFileSync(entry, `
          function mark(target: any) { target.decorated = true; }
          @mark
          export class Fixture { static decorated = false; }
          export const decorated = Fixture.decorated;
        `);
        expect(fs.existsSync(path.join(directory, 'node_modules'))).toBeFalse();
        process.chdir(directory);
        const builder = new ViteConfigBuilder({
          srcDirs: ['./'], testDirs: [], exclude: [], outDir: './output', browser,
          preserveOutputs: false,
          viteConfig: { plugins: [{ name: 'consumer-plugin' }] },
        } as any);
        const config = builder.createViteConfig([entry]);
        config.configFile = false;
        const entryName = Object.keys(config.build!.rolldownOptions!.input as Record<string, string>)[0];
        await build(config);
        const output = path.join(directory, 'output');
        const modules = fs.readdirSync(output).filter(file => file.endsWith('.mjs'));
        for (const file of modules) {
          const code = fs.readFileSync(path.join(output, file), 'utf8');
          expect(code).not.toMatch(/(?:from\s*|import\s*)["']@oxc-project\/runtime/);
        }
        const result = await import(pathToFileURL(path.join(output, `${entryName}.mjs`)).href);
        expect(result.decorated).toBeTrue();
      } finally {
        process.chdir(previousCwd);
        fs.rmSync(directory, { recursive: true, force: true });
      }
    });
  });
}
