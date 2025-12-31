import fs from 'fs';
import path from 'path';
import { builtinModules } from 'module';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  plugins: [
    copy({
      targets: [
        { src: 'postinstall.script', dest: 'dist/testify/', rename: 'postinstall.mjs' },
        { src: 'assets/favicon.ico', dest: 'dist/testify/assets/' },
      ],
      hook: 'writeBundle',
      flatten: false
    })
  ],
  build: {
    target: 'node22',
    outDir: 'dist/testify/',
    emptyOutDir: false,
    lib: {
      entry: path.resolve('index.ts'),
      formats: ['es'],
      fileName: () => 'lib/index.js'
    },
    minify: false,
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: path.resolve(__dirname, './src/index.ts'),
      output: {
        entryFileNames: 'bin/testify',
        format: 'es',
        banner: `#!/usr/bin/env node
import { createRequire as ___createRequire } from 'module';
const require = ___createRequire(import.meta.url);

const ___fileURLToPath = require('url').fileURLToPath;
const ___path = require('path');

const __filename = ___fileURLToPath(import.meta.url);
const __dirname = ___path.dirname(__filename);
`,
        inlineDynamicImports: true,
        manualChunks: undefined,
        // Ensure externals stay as bare specifiers (avoid absolute Windows paths in ESM)
        paths: (id) => {
          const match = id.match(/node_modules[\\/](.+?)([\\/]|$)/);
          return match ? match[1] : id;
        }
      },
      external: (id) => {
        if (id.includes('node_modules')) return true;
        return isExternal(id);
      }
    }
  }
});
