import * as fs from 'fs';
import * as path from 'path';
import { InlineConfig } from 'vite';
import type { WarningHandlerWithDefault } from 'rollup';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import JSONCleaner from './json-cleaner';
import { logger } from './console-repl';
import { minimatch } from 'minimatch';

export class ViteConfigBuilder {
  private inputMap: Record<string, string> = {};

  private static readonly DEFAULT_EXCLUDED_DIRS = new Set([
    'node_modules',
    'dist',
    'build',
    '.git',
    '.vite',
    '.cache',
    '.turbo'
  ]);

  constructor(private readonly config: ViteJasmineConfig) {}

  /* -------------------------------------------------- */
  /* Helpers                                            */
  /* -------------------------------------------------- */

  private preserveRoot(): string {
    return this.config.viteBuildOptions?.preserveModulesRoot ?? '.';
  }

  private normalizeDirs(
    value: string | string[] | undefined,
    fallback: string
  ): string[] {
    if (!value) return [fallback];
    return Array.isArray(value) ? value : [value];
  }

  private srcDirs(): string[] {
    return this.normalizeDirs(this.config.srcDirs, './src');
  }

  private testDirs(): string[] {
    return this.normalizeDirs(this.config.testDirs, './tests');
  }

  private shouldSkipDirectory(dirPath: string): boolean {
    const name = path.basename(dirPath);

    if (ViteConfigBuilder.DEFAULT_EXCLUDED_DIRS.has(name)) {
      return true;
    }

    if (this.config.exclude?.some(p =>
      minimatch(dirPath, p, { dot: true })
    )) {
      return true;
    }

    return false;
  }

  private isValidSourceFile(file: string, isTest: boolean): boolean {
    const ext = path.extname(file).toLowerCase();
    if (!['.ts', '.js', '.mjs'].includes(ext)) return false;
    if (file.endsWith('.d.ts')) return false;

    const isTestFile = /\.spec\.|\.test\./.test(file);
    return isTest ? isTestFile : !isTestFile;
  }

  /* -------------------------------------------------- */
  /* Synchronous discovery                              */
  /* -------------------------------------------------- */

  private discoverFilesSync(): string[] {
    const all: string[] = [];

    for (const dir of this.srcDirs()) {
      if (fs.existsSync(dir)) all.push(...this.walk(dir, false));
    }

    for (const dir of this.testDirs()) {
      if (fs.existsSync(dir)) all.push(...this.walk(dir, true));
    }

    return [...new Set(all)];
  }

  private walk(dir: string, isTest: boolean): string[] {
    const out: string[] = [];

    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);

      if (e.isDirectory()) {
        if (this.shouldSkipDirectory(full)) continue;
        out.push(...this.walk(full, isTest));
        continue;
      }

      if (e.isFile() && this.isValidSourceFile(full, isTest)) {
        out.push(full);
      }
    }

    return out;
  }

  /* -------------------------------------------------- */
  /* Input map (flattened, collision-safe)              */
  /* -------------------------------------------------- */

  private buildInputMap(files: string[]): Record<string, string> {
    const map: Record<string, string> = {};

    for (const file of files) {
      if (this.isTypeOnlyModule(file)) {
        continue;
      }
      const rel = path
        .relative(this.preserveRoot(), file)
        .replace(/\.(ts|js|mjs)$/, '');

      // collision-safe flattened name
      const flatName = Buffer.from(rel).toString('hex');
      map[flatName] = norm(file);
    }

    return map;
  }

  private isTypeOnlyModule(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.ts', '.mts', '.cts'].includes(ext)) return false;
    if (filePath.endsWith('.d.ts')) return true;

    let content = '';
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      return false;
    }

    const stripCommentsAndStrings = (input: string): string => {
      let out = input.replace(/\/\*[\s\S]*?\*\//g, '');
      out = out.replace(/\/\/.*$/gm, '');
      out = out.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, '');
      return out;
    };

    const code = stripCommentsAndStrings(content);

    if (/\bexport\s+\*\s+from\b/.test(code)) return false;
    if (/\bexport\s+default\b/.test(code)) return false;
    if (/\bexport\s+(const|let|var|function|class|enum)\b/.test(code)) return false;
    if (/\bimport\s+(?!type\b)/.test(code)) return false;
    if (/\b(const|let|var|function|class|enum)\b/.test(code)) return false;

    for (const match of code.matchAll(/export\s*(?:type\s*)?\{([^}]*)\}/g)) {
      const specList = match[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const spec of specList) {
        const cleaned = spec.replace(/^type\s+/, '').trim();
        if (cleaned.length > 0 && !spec.startsWith('type ')) {
          return false;
        }
      }
    }

    return true;
  }

  /* -------------------------------------------------- */
  /* Vendor chunk logic                                 */
  /* -------------------------------------------------- */

  private vendorChunk(id: string): string | undefined {
    if (id.includes('node_modules')) return 'vendor';
    return;
  }

  /* -------------------------------------------------- */
  /* Base config factory                                */
  /* -------------------------------------------------- */

  private baseConfig(
    input: Record<string, string>,
    incremental: boolean,
    viteCache?: any
  ): InlineConfig {
    const onwarn: WarningHandlerWithDefault = (warning, warn) => {
      // Ignore empty bundle warnings
      if (warning.code === 'EMPTY_BUNDLE') return;
      
      // Optionally suppress circular dependency warnings
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      
      // Pass through all other warnings
      warn(warning);
    };

    return {
      root: process.cwd(),
      configFile: incremental ? false : undefined,

      build: {
        outDir: this.config.outDir,
        emptyOutDir: !incremental,
        sourcemap: true,
        target: 'es2022',
        minify: false,

        rollupOptions: {
          input,
          cache: viteCache,
          preserveEntrySignatures: incremental
            ? 'allow-extension'
            : 'strict',

          // 🔥 Suppress empty bundle warnings
          onwarn,

          output: {
            format: 'es',

            // 🔥 flattened local outputs
            entryFileNames: '[name].js',

            // 🔥 single vendor bundle
            chunkFileNames: 'vendor.js',

            manualChunks: id => this.vendorChunk(id)
          }
        }
      },

      resolve: { alias: this.createPathAliases() },
      esbuild: { 
        target: 'es2022', 
        keepNames: false,
        treeShaking: true // Enable tree shaking for type imports
      },
      define: { 'process.env.NODE_ENV': '"test"' },
      logLevel: 'warn'
    };
  }

  /* -------------------------------------------------- */
  /* FULL BUILD                                         */
  /* -------------------------------------------------- */

  createViteConfig(entryFiles?: string[]): InlineConfig {
    const files = entryFiles && entryFiles.length > 0 ? entryFiles : this.discoverFilesSync();
    this.inputMap = this.buildInputMap(files);

    if (!Object.keys(this.inputMap).length) {
      logger.error('❌ No files found to build');
    }

    logger.println(`📦 Building ${Object.keys(this.inputMap).length} modules`);

    return this.mergeUserConfig(this.baseConfig(this.inputMap, false));
  }

  /* -------------------------------------------------- */
  /* INCREMENTAL BUILD                                  */
  /* -------------------------------------------------- */

  createViteConfigForFiles(
    sourceFiles: string[],
    testFilesOrCache?: string[] | any,
    viteCache?: any
  ): InlineConfig {
    const testFiles = Array.isArray(testFilesOrCache) ? testFilesOrCache : [];
    const cache = Array.isArray(testFilesOrCache) ? viteCache : testFilesOrCache;
    const changedFiles = [...sourceFiles, ...testFiles];
    const updates = this.buildInputMap(changedFiles);
    this.inputMap = { ...this.inputMap, ...updates };

    for (const [k, v] of Object.entries(this.inputMap)) {
      if (!fs.existsSync(v)) delete this.inputMap[k];
    }

    logger.println(
      `📦 Incremental build: ${Object.keys(this.inputMap).length} files`
    );

    return this.mergeUserConfig(
      this.baseConfig(this.inputMap, true, cache)
    );
  }

  removeFromInputMap(filePath: string): void {
    const normalized = norm(filePath);
    for (const [key, value] of Object.entries(this.inputMap)) {
      if (value === normalized || !fs.existsSync(value)) {
        delete this.inputMap[key];
      }
    }
  }

  removeMultipleFromInputMap(filePaths: string[]): void {
    const normalizedSet = new Set(filePaths.map(norm));
    for (const [key, value] of Object.entries(this.inputMap)) {
      if (normalizedSet.has(value) || !fs.existsSync(value)) {
        delete this.inputMap[key];
      }
    }
  }

  /* -------------------------------------------------- */
  /* Safe user config merge                             */
  /* -------------------------------------------------- */

  private mergeUserConfig(base: InlineConfig): InlineConfig {
    const user = this.config.viteConfig;
    if (!user) return base;

    return {
      ...base,
      ...user,
      build: {
        ...base.build,
        ...user.build,
        rollupOptions: {
          ...base.build?.rollupOptions,
          ...user.build?.rollupOptions
        }
      }
    };
  }

  /* -------------------------------------------------- */
  /* tsconfig aliases                                   */
  /* -------------------------------------------------- */

  private createPathAliases(): Record<string, string> {
    const aliases: Record<string, string> = {};
    const cleaner = new JSONCleaner();

    try {
      const tsconfigPath = this.config.tsconfig ?? 'tsconfig.json';
      if (!fs.existsSync(tsconfigPath)) return aliases;

      const tsconfig = cleaner.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      const baseUrl = tsconfig.compilerOptions?.baseUrl ?? '.';
      const paths = tsconfig.compilerOptions?.paths ?? {};

      for (const [alias, values] of Object.entries(paths)) {
        if (!Array.isArray(values) || !values.length) continue;
        aliases[alias.replace(/\/\*$/, '')] = norm(
          path.resolve(baseUrl, values[0].replace(/\/\*$/, ''))
        );
      }
    } catch (err) {
      logger.error(`⚠️ tsconfig parse failed: ${err}`);
    }

    return aliases;
  }
}