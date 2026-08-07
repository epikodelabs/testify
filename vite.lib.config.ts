import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/testify/lib',
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/lib.ts'),
        v2: resolve(__dirname, 'src/v2.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        'fs',
        'path',
        'url',
        'module',
        'util',
        'os',
        'child_process',
      ],
    },
  },
});
