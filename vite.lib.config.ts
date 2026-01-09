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
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, './src/lib.ts'),
      name: 'TsTestRunner',
      formats: ['es'],
      fileName: () => `testify/lib/index.js`
    },
    minify: false,
    sourcemap: false,
    rollupOptions: {
      external: (id) => isExternal(id),
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
        // Ensure externals stay as bare specifiers (avoid absolute Windows paths in ESM)
        paths: (id) => {
          const match = id.match(/node_modules[\\/](.+?)([\\/]|$)/);
          return match ? match[1] : id;
        }
      }
    }
  },
  // Ensure TypeScript declarations are generated
  esbuild: {
    // Keep class names for better debugging
    keepNames: true,
  }
});
