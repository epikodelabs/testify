import path from 'path';
import { builtinModules } from 'module';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const builtinExternals = new Set(builtinModules);

const isExternal = (id: string) => {
  if (id.startsWith('node:')) return true;
  if (builtinExternals.has(id)) return true;
  return false;
};

export default defineConfig({
  build: {
    target: 'node22',
    ssr: true,
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, './src/lib.ts'),
      external: (id) => isExternal(id),
      output: {
        entryFileNames: 'testify/lib/index.js',
        format: 'es',
        inlineDynamicImports: true,
        manualChunks: undefined,
        paths: (id) => {
          const match = id.match(/node_modules[\\/](.+?)([\\/]|$)/);
          return match ? match[1] : id;
        }
      }
    }
  },
  esbuild: {
    keepNames: true,
  }
});