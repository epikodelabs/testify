import fs from 'fs';
import path from 'path';
import { builtinModules } from 'module';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const configFilePath = fileURLToPath(import.meta.url);
const configDirectory = path.dirname(configFilePath);

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

const dependencyExternals = new Set([
  ...(pkg.bundleDependencies || []),
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'playwright-core',
  'fsevents'
]);

const builtinExternals = new Set(builtinModules);

const isExternal = (id: string) => {
  if (id.startsWith('node:')) return true;
  if (builtinExternals.has(id)) return true;

  return Array.from(dependencyExternals).some(
    (dep) => id === dep || id.startsWith(`${dep}/`)
  );
};

export default defineConfig({
  build: {
    target: 'node22',
    ssr: true,
    outDir: 'dist/testify/',
    emptyOutDir: false,
    minify: false,
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: path.resolve(configDirectory, './src/ts-jasmine-cli.ts'),
      output: {
        entryFileNames: 'bin/jasmine',
        format: 'es',
        inlineDynamicImports: true,
        banner: `#!/usr/bin/env node
import { createRequire as ___createRequire } from 'module';
const require = ___createRequire(import.meta.url);
`,
        manualChunks: undefined
      },
      external: (id) => {
        if (id.includes('node_modules')) return true;
        return isExternal(id);
      }
    }
  }
});
