import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { createRequire } from 'module';
import { globSync } from 'glob';
import picomatch from 'picomatch';
import { InlineConfig } from 'vite';
import type { WarningHandlerWithDefault } from 'rollup';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import JSONCleaner from './json-cleaner';
import { logger } from './logger';
import { ViteConfigMessages } from './log-messages';

const nodeRequire = createRequire(import.meta.url);

interface ResolvedTsconfigAliases {
  aliases: Record<string, string>;
  baseUrl: string;
}

interface ResolvedTsconfigData extends ResolvedTsconfigAliases {
  compilerOptions: Record<string, any>;
}

interface PackageManifest {
  name?: string;
  main?: string;
  module?: string;
  browser?: string;
  exports?: unknown;
}

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

    if (this.config.exclude?.some(p => picomatch.isMatch(dirPath, p, { dot: true }))) {
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
  /* Input map (flattened, deterministic)               */
  /* -------------------------------------------------- */

  private buildInputMap(files: string[]): Record<string, string> {
    const map: Record<string, string> = {};

    for (const file of files) {
      if (this.isTypeOnlyModule(file)) {
        continue;
      }
      const outputName =
        this.buildOutputName(
          file,
        );
      map[outputName] = norm(file);
    }

    return map;
  }

  private buildOutputName(filePath: string): string {
    const srcDirs = this.srcDirs().map((dir) => norm(path.resolve(dir)));
    const testDirs = this.testDirs().map((dir) => norm(path.resolve(dir)));
    const normalizedPath = norm(path.resolve(filePath));

    const matchDir = (dirs: string[]): string | null => {
      for (const candidate of dirs) {
        if (normalizedPath === candidate || normalizedPath.startsWith(`${candidate}/`)) {
          return candidate;
        }
      }
      return null;
    };

    const baseSrc = matchDir(srcDirs) ?? srcDirs[0] ?? norm(path.resolve('./src'));
    const baseTest = matchDir(testDirs) ?? testDirs[0] ?? baseSrc;
    const base = baseTest ?? baseSrc;

    const relativePath = path.relative(base, normalizedPath);
    const relativeNormalized = norm(relativePath);
    const relativeWithoutExt = relativeNormalized.replace(/\.(ts|js|mjs)$/, '');
    const isSpecFile = relativeWithoutExt.endsWith('.spec');
    const stemPath = isSpecFile
      ? relativeWithoutExt.slice(0, -'.spec'.length)
      : relativeWithoutExt;

    const sanitizeSegment = (segment: string) => {
      if (segment === '..') return 'up';
      if (segment === '.') return 'dot';
      return segment;
    };

    const segments = stemPath.split('/').filter(Boolean).map(sanitizeSegment);
    const fileName = segments.pop() ?? sanitizeSegment(path.basename(stemPath) || 'index');

    const sanitizedBaseName =
      segments.length > 0 ? `${segments.join('_')}__${fileName}` : fileName;
    const hash = createHash('sha1').update(normalizedPath).digest('hex').slice(0, 8);

    if (isSpecFile) {
      return `${sanitizedBaseName}__${hash}.spec`;
    }

    return `${sanitizedBaseName}__${hash}`;
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
        if (warning.code === 'EMPTY_BUNDLE') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      };

      const tsconfigData = this.loadResolvedTsconfigData();
      const isNodeTarget = this.config.browser === 'node';

      return {
        root: process.cwd(),
        configFile: incremental ? false : undefined,

        build: {
          outDir: this.config.outDir,
          emptyOutDir: !incremental,
          sourcemap: true,
          target: 'es2022',
          minify: false,
          // Enable SSR build for Node.js target to bypass browser dynamic import wrappers
          ssr: isNodeTarget ? true : undefined,
          modulePreload: isNodeTarget ? false : true,

          rollupOptions: {
            input,
            preserveEntrySignatures: incremental
              ? 'allow-extension'
              : 'strict',

            onwarn,

            output: {
              format: 'es',
              entryFileNames: '[name].mjs',
              chunkFileNames: 'vendor.mjs',
              manualChunks: id => this.vendorChunk(id)
            }
          }
        },

        resolve: { alias: this.createPathAliases() },
        esbuild: {
          target: 'es2022',
          keepNames: false,
          tsconfigRaw: tsconfigData ? { compilerOptions: tsconfigData.compilerOptions } : undefined,
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
      logger.error(ViteConfigMessages.noFilesToBuild());
    }

    return this.normalizeGeneratedOutput(
      this.normalizeAliasConfig(
        this.mergeUserConfig(
          this.baseConfig(
            this.inputMap,
            false,
          ),
        ),
      ),
    );
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

    logger.println(ViteConfigMessages.incrementalBuild(Object.keys(this.inputMap).length));

    return this.normalizeGeneratedOutput(
      this.normalizeAliasConfig(
        this.mergeUserConfig(
          this.baseConfig(
            this.inputMap,
            true,
            cache,
          ),
        ),
      ),
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

    // Deep-merge nested objects so user settings augment rather than replace defaults
    const merge = (a: any, b: any): any => {
      if (!b) return a;
      if (typeof b !== 'object' || Array.isArray(b)) return b;
      const result = { ...a };
      for (const key of Object.keys(b)) {
        result[key] = merge(a?.[key], b[key]);
      }
      return result;
    };

    return merge(base, user);
  }

  private normalizeGeneratedOutput(
    config: InlineConfig,
  ): InlineConfig {
    const rollupOptions =
      config.build
        ?.rollupOptions;

    if (!rollupOptions) {
      return config;
    }

    const output =
      Array.isArray(
        rollupOptions.output,
      )
        ? rollupOptions.output.map(
            (entry) => ({
              ...entry,
              entryFileNames:
                '[name].mjs',
              chunkFileNames:
                'vendor.mjs',
            }),
          )
        : {
            ...(rollupOptions.output ?? {}),
            entryFileNames:
              '[name].mjs',
            chunkFileNames:
              'vendor.mjs',
          };

    return {
      ...config,
      build: {
        ...config.build,
        rollupOptions: {
          ...rollupOptions,
          output,
        },
      },
    };
  }

  private normalizeAliasConfig(config: InlineConfig): InlineConfig {
    if (!config.resolve?.alias) {
      return config;
    }

    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: this.normalizeAliasEntries(config.resolve.alias),
      },
    };
  }

  private normalizeAliasEntries(alias: NonNullable<InlineConfig['resolve']>['alias']) {
    if (Array.isArray(alias)) {
      return alias.map((entry) => ({
        ...entry,
        replacement: this.normalizeAliasReplacement(entry.replacement),
      }));
    }

    const normalized: Record<string, string> = {};
    for (const [find, replacement] of Object.entries(alias!)) {
      normalized[find] = this.normalizeAliasReplacement(replacement);
    }

    return normalized;
  }

  private normalizeAliasReplacement(replacement: string): string {
    if (!replacement) {
      return replacement;
    }

    if (path.isAbsolute(replacement)) {
      return norm(replacement);
    }

    if (replacement.startsWith('./') || replacement.startsWith('../')) {
      return norm(path.resolve(process.cwd(), replacement));
    }

    return replacement;
  }

  /* -------------------------------------------------- */
  /* tsconfig aliases                                   */
  /* -------------------------------------------------- */

  private loadResolvedTsconfigData(): ResolvedTsconfigData | null {
    try {
      const tsconfigPath = path.resolve(this.config.tsconfig ?? 'tsconfig.json');
      if (!fs.existsSync(tsconfigPath)) return null;

      return this.resolveTsconfigData(tsconfigPath);
    } catch (err) {
      logger.error(ViteConfigMessages.tsconfigParseFailed(err));
      return null;
    }
  }

  private createPathAliases(): Record<string, string> {
    return {
      ...(this.loadResolvedTsconfigData()?.aliases ?? {}),
      ...this.createProjectBuildAliases(),
    };
  }

  private createProjectBuildAliases(): Record<string, string> {
    if (!this.config.project) {
      return {};
    }

    const projectPackageJsonPath = path.join(
      path.resolve(this.config.project),
      'package.json'
    );

    if (!fs.existsSync(projectPackageJsonPath)) {
      return {};
    }

    const cleaner = new JSONCleaner();
    let projectPackage: PackageManifest;

    try {
      projectPackage = cleaner.parse<PackageManifest>(
        fs.readFileSync(projectPackageJsonPath, 'utf8')
      );
    } catch {
      return {};
    }

    if (!projectPackage.name) {
      return {};
    }

    const builtPackageRoot = this.findBuiltPackageRoot(projectPackage.name);
    if (!builtPackageRoot) {
      return {};
    }

    try {
      const builtPackageJsonPath = path.join(builtPackageRoot, 'package.json');
      const builtPackage = cleaner.parse<PackageManifest>(
        fs.readFileSync(builtPackageJsonPath, 'utf8')
      );

      return this.resolveBuiltPackageAliases(
        projectPackage.name,
        builtPackageRoot,
        builtPackage
      );
    } catch {
      return {};
    }
  }

  private findBuiltPackageRoot(packageName: string): string | null {
    const candidates = globSync('dist/**/package.json', {
      absolute: true,
      nodir: true,
      ignore: ['**/node_modules/**'],
    }).sort((a, b) => a.length - b.length || a.localeCompare(b));

    const cleaner = new JSONCleaner();

    for (const candidate of candidates) {
      try {
        const manifest = cleaner.parse<PackageManifest>(
          fs.readFileSync(candidate, 'utf8')
        );
        if (manifest.name === packageName) {
          return norm(path.dirname(candidate));
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  private resolveBuiltPackageAliases(
    packageName: string,
    builtPackageRoot: string,
    manifest: PackageManifest
  ): Record<string, string> {
    const aliases: Record<string, string> = {};
    const exportsField = manifest.exports;

    if (exportsField && typeof exportsField === 'object' && !Array.isArray(exportsField)) {
      const exportMap = exportsField as Record<string, unknown>;

      const rootEntry = this.resolvePackageExportTarget(
        exportMap['.'] ?? exportMap,
        builtPackageRoot
      );
      if (rootEntry) {
        aliases[packageName] = rootEntry;
      }

      for (const [key, value] of Object.entries(exportMap)) {
        if (key === '.' || !key.startsWith('./')) {
          continue;
        }

        const resolvedTarget = this.resolvePackageExportTarget(
          value,
          builtPackageRoot
        );
        if (!resolvedTarget) {
          continue;
        }

        aliases[`${packageName}/${key.slice(2)}`] = resolvedTarget;
      }
    } else {
      const rootEntry = this.resolvePackageExportTarget(exportsField, builtPackageRoot);
      if (rootEntry) {
        aliases[packageName] = rootEntry;
      }
    }

    if (!aliases[packageName]) {
      const fallbackEntry = this.resolvePackageMainEntry(
        packageName,
        builtPackageRoot,
        manifest
      );
      if (fallbackEntry) {
        aliases[packageName] = fallbackEntry;
      }
    }

    return aliases;
  }

  private resolvePackageExportTarget(
    target: unknown,
    builtPackageRoot: string
  ): string | null {
    if (!target) {
      return null;
    }

    if (typeof target === 'string') {
      return this.resolveBuiltFileTarget(target, builtPackageRoot);
    }

    if (Array.isArray(target)) {
      for (const candidate of target) {
        const resolved = this.resolvePackageExportTarget(candidate, builtPackageRoot);
        if (resolved) {
          return resolved;
        }
      }
      return null;
    }

    if (typeof target !== 'object') {
      return null;
    }

    const record = target as Record<string, unknown>;
    const preferredKeys = [
      'browser',
      'import',
      'module',
      'default',
      'development',
      'production',
      'node',
      'require',
    ];

    for (const key of preferredKeys) {
      if (!(key in record)) {
        continue;
      }

      const resolved = this.resolvePackageExportTarget(record[key], builtPackageRoot);
      if (resolved) {
        return resolved;
      }
    }

    for (const value of Object.values(record)) {
      const resolved = this.resolvePackageExportTarget(value, builtPackageRoot);
      if (resolved) {
        return resolved;
      }
    }

    return null;
  }

  private resolveBuiltFileTarget(
    relativeTarget: string,
    builtPackageRoot: string
  ): string | null {
    if (!relativeTarget.startsWith('.')) {
      return null;
    }

    const resolvedPath = path.resolve(builtPackageRoot, relativeTarget);
    if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
      return null;
    }

    return norm(resolvedPath);
  }

  private resolvePackageMainEntry(
    packageName: string,
    builtPackageRoot: string,
    manifest: PackageManifest
  ): string | null {
    for (const field of [manifest.module, manifest.main, manifest.browser]) {
      const resolved = this.resolvePackageExportTarget(field, builtPackageRoot);
      if (resolved) {
        return resolved;
      }
    }

    const packageBaseName = packageName.split('/').pop() ?? packageName;
    const fallbacks = [
      `./fesm2022/${packageBaseName}.mjs`,
      `./esm2022/${packageBaseName}.mjs`,
      './index.mjs',
      './index.js',
    ];

    for (const candidate of fallbacks) {
      const resolved = this.resolveBuiltFileTarget(candidate, builtPackageRoot);
      if (resolved) {
        return resolved;
      }
    }

    return null;
  }

  private resolveTsconfigData(
    tsconfigPath: string,
    seen = new Set<string>()
  ): ResolvedTsconfigData {
    const normalizedTsconfigPath = norm(path.resolve(tsconfigPath));
    if (seen.has(normalizedTsconfigPath)) {
      return {
        aliases: {},
        baseUrl: path.dirname(normalizedTsconfigPath),
        compilerOptions: {},
      };
    }

    seen.add(normalizedTsconfigPath);

    const cleaner = new JSONCleaner();
    const configDir = path.dirname(normalizedTsconfigPath);
    const tsconfig = cleaner.parse<any>(fs.readFileSync(normalizedTsconfigPath, 'utf8'));
    const compilerOptions = tsconfig.compilerOptions ?? {};

    let inherited: ResolvedTsconfigData = {
      aliases: {},
      baseUrl: configDir,
      compilerOptions: {},
    };

    if (typeof tsconfig.extends === 'string' && tsconfig.extends.trim().length > 0) {
      const extendsPath = this.resolveExtendedTsconfigPath(tsconfig.extends, configDir);
      if (extendsPath && fs.existsSync(extendsPath)) {
        inherited = this.resolveTsconfigData(extendsPath, seen);
      }
    }

    const baseUrl = compilerOptions.baseUrl
      ? path.resolve(configDir, compilerOptions.baseUrl)
      : inherited.baseUrl;

    const aliases = { ...inherited.aliases };
    const paths = compilerOptions.paths ?? {};

    for (const [alias, values] of Object.entries(paths)) {
      if (!Array.isArray(values) || !values.length) continue;

      aliases[alias.replace(/\/\*$/, '')] = norm(
        path.resolve(baseUrl, String(values[0]).replace(/\/\*$/, ''))
      );
    }

    const mergedCompilerOptions = {
      ...inherited.compilerOptions,
      ...compilerOptions,
    };

    delete mergedCompilerOptions.paths;
    delete mergedCompilerOptions.baseUrl;

    return {
      aliases,
      baseUrl,
      compilerOptions: mergedCompilerOptions,
    };
  }

  private resolveExtendedTsconfigPath(extendsRef: string, configDir: string): string | null {
    const localCandidates = this.candidateTsconfigPaths(path.resolve(configDir, extendsRef));
    for (const candidate of localCandidates) {
      if (fs.existsSync(candidate)) return candidate;
    }

    try {
      return nodeRequire.resolve(extendsRef);
    } catch {}

    for (const candidate of this.candidateTsconfigPaths(extendsRef)) {
      try {
        return nodeRequire.resolve(candidate);
      } catch {}
    }

    return null;
  }

  private candidateTsconfigPaths(basePath: string): string[] {
    const candidates = [basePath];

    if (!basePath.endsWith('.json')) {
      candidates.push(`${basePath}.json`);
    }

    candidates.push(path.join(basePath, 'tsconfig.json'));

    return [...new Set(candidates.map((candidate) => path.resolve(candidate)))];
  }
}
