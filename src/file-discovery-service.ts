import { glob } from "glob";
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { norm } from "./utils";
import * as fs from "fs/promises";
import { existsSync, statSync } from "fs";
import * as path from "path";
import { builtinModules } from "module";
import { createHash } from 'crypto';
import { logger } from './logger';
import { FileDiscoveryMessages } from './log-messages';

const NODE_BUILTIN_SPECIFIERS = new Set(
  builtinModules.map((specifier) => specifier.replace(/^node:/, '')),
);

const BROWSER_UNSUPPORTED_PACKAGES = new Set([
  'glob',
  'playwright',
  'playwright-core',
  'chromium-bidi',
  'ws',
  'istanbul-api',
  'istanbul-lib-coverage',
  'istanbul-lib-instrument',
  'istanbul-lib-report',
  'istanbul-lib-source-maps',
  'istanbul-reports',
]);

const BROWSER_UNSUPPORTED_GLOBAL_PATTERNS = [
  /\bprocess\s*(?:\.|\[)/,
  /\bBuffer\s*(?:\.|\[|\()/,
  /\b__dirname\b/,
  /\b__filename\b/,
];

/**
 * Upper bound for the cycle-refinement passes that make compatibility
 * verdicts independent of concurrent file walk order. A false verdict can
 * move at most one import edge per pass, so one pass per visited file is a
 * safe bound for every finite dependency graph.
 */
export class FileDiscoveryService {
  constructor(private config: ViteJasmineConfig) {}

  private getSrcDirConfigs(): string[] {
    const srcDirs = Array.isArray(this.config.srcDirs) ? this.config.srcDirs : [this.config.srcDirs];
    if (srcDirs.filter(Boolean).length === 0) return ['./src'];
    return srcDirs.filter(Boolean) as string[];
  }

  private getTestDirConfigs(): string[] {
    const testDirs = Array.isArray(this.config.testDirs) ? this.config.testDirs : [this.config.testDirs];
    if (testDirs.filter(Boolean).length === 0) return ['./tests'];
    return testDirs.filter(Boolean) as string[];
  }

  async scanDir(dir: string, pattern: string, exclude: string[] = []): Promise<string[]> {
    const cleanPattern = pattern.startsWith('/') || pattern.startsWith('**') 
      ? pattern 
      : `/${pattern}`;
    const basePath = norm(path.join(dir, cleanPattern)).replace(/^\//, '');
    
    try {
      let files = await glob(basePath, { absolute: true, ignore: exclude });
      return files.map((s) => norm(s));
    } catch (error) {
      logger.error(FileDiscoveryMessages.errorDiscoveringFiles(error));
      throw new Error("Failed to discover source and test files");
    }
  }

  async filterExistingFiles(paths: string[]): Promise<string[]> {
    const results = await Promise.all(
      paths.map(async (filePath) => {
        const normalizedPath = norm(filePath);
        return existsSync(normalizedPath) ? normalizedPath : null;
      })
    );
    return results.filter((p): p is string => p !== null);
  }

  async discoverSources(): Promise<{ srcFiles: string[]; specFiles: string[] }> {
    const { srcFiles, specFiles } = await this.discoverAllSources();

    return await this.filterBrowserCompatibleFiles(
      srcFiles,
      specFiles,
    );
  }

  async discoverAllSources(): Promise<{ srcFiles: string[]; specFiles: string[] }> {
    try {
      const defaultSrcExclude = ["**/node_modules/**", "**/*.spec.*"];
      const defaultTestExclude = ["**/node_modules/**"];
      const sharedExclude = this.config.exclude ?? [];

      const srcDirs = this.getSrcDirConfigs();
      const testDirs = this.getTestDirConfigs();

      const srcFiles: string[] = [];
      for (const inc of srcDirs) {
        const exclude = [...defaultSrcExclude, ...sharedExclude];
        const files = await this.scanDir(norm(inc), '/**/*.{ts,js,mjs}', exclude);
        srcFiles.push(...files);
      }

      const specFiles: string[] = [];
      for (const inc of testDirs) {
        const exclude = [...defaultTestExclude, ...sharedExclude];
        const files = await this.scanDir(norm(inc), '/**/*.spec.{ts,js,mjs}', exclude);
        specFiles.push(...files);
      }

      const dedupedSrcFiles =
        [...new Set(srcFiles)];

      const dedupedSpecFiles =
        [...new Set(specFiles)];

      return {
        srcFiles: dedupedSrcFiles,
        specFiles: dedupedSpecFiles,
      };
    } catch (error) {
      logger.error(FileDiscoveryMessages.errorDiscoveringFiles(error));
      throw new Error("Failed to discover source and test files");
    }
  }

  private async filterBrowserCompatibleFiles(
    srcFiles: string[],
    specFiles: string[],
  ): Promise<{
    srcFiles: string[];
    specFiles: string[];
  }> {
    if (this.config.browser === 'node') {
      return {
        srcFiles,
        specFiles,
      };
    }

    const compatibility =
      new Map<string, boolean>();

    const isCompatible = async (
      filePath: string,
      stack = new Set<string>(),
    ): Promise<boolean> => {
      const normalizedPath =
        norm(path.resolve(filePath));

      const cached =
        compatibility.get(
          normalizedPath,
        );

      if (cached !== undefined) {
        return cached;
      }

      if (stack.has(normalizedPath)) {
        // Optimistic: a cycle member's verdict is assumed from its caller.
        // The refinement passes below correct any wrong assumption, keeping
        // the final verdicts independent of file walk order.
        return true;
      }

      stack.add(normalizedPath);

      const result =
        await this.computeBrowserCompatibility(
          normalizedPath,
          async (importedPath) =>
            isCompatible(importedPath, stack),
        );

      stack.delete(normalizedPath);
      compatibility.set(
        normalizedPath,
        result,
      );

      return result;
    };

    await Promise.all(
      [...srcFiles, ...specFiles].map(
        (filePath) => isCompatible(filePath),
      ),
    );

    // A first-pass verdict can be wrongly optimistic when it was assumed
    // through an import cycle. Re-evaluate every visited file against the
    // completed map until it stabilizes: verdicts only ever move from true
    // to false, and every false has a concrete non-cyclic cause, so this
    // converges to the order-independent fixed point.
    for (
      let pass = 0;
      pass < compatibility.size;
      pass++
    ) {
      const reevaluated =
        await Promise.all(
          [...compatibility.keys()].map(
            async (filePath) => ({
              filePath,
              verdict:
                await this.computeBrowserCompatibility(
                  filePath,
                  async (importedPath) =>
                    compatibility.get(importedPath) ?? true,
                ),
            }),
          ),
        );

      let changed = false;
      for (
        const { filePath, verdict }
        of reevaluated
      ) {
        if (
          compatibility.get(filePath) !== verdict
        ) {
          compatibility.set(filePath, verdict);
          changed = true;
        }
      }

      if (!changed) break;
    }

    const kept = (files: string[]): string[] =>
      files.filter(
        (filePath) =>
          compatibility.get(
            norm(path.resolve(filePath)),
          ) === true,
      );

    const keptSrcFiles = kept(srcFiles);
    const keptSpecFiles = kept(specFiles);

    await this.reportBrowserExclusions(
      srcFiles,
      specFiles,
      keptSrcFiles,
      keptSpecFiles,
    );

    return {
      srcFiles: keptSrcFiles,
      specFiles: keptSpecFiles,
    };
  }

  /**
   * Explains why a file was excluded by tracing the shortest chain to the
   * first Node-only source or import in its dependency graph.
   */
  private async describeBrowserExclusion(
    filePath: string,
  ): Promise<string> {
    const relative = (file: string) =>
      path.relative(process.cwd(), file) || file;
    const visited = new Set<string>();
    const queue: Array<{ file: string; chain: string[] }> = [
      { file: filePath, chain: [relative(filePath)] },
    ];

    while (queue.length > 0) {
      const { file, chain } = queue.shift()!;
      if (chain.length > 8 || visited.has(file)) continue;
      visited.add(file);

      let source = '';
      try {
        source = await fs.readFile(file, 'utf8');
      } catch (error) {
        logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`);
        continue;
      }

      if (this.usesBrowserUnsupportedGlobals(source)) {
        return `${chain.join(' -> ')} (Node global in source)`;
      }

      for (
        const specifier
        of this.collectImportedSpecifiers(source)
      ) {
        if (this.isBrowserUnsupportedSpecifier(specifier)) {
          return `${chain.join(' -> ')} (imports "${specifier}")`;
        }

        const resolved =
          await this.resolveLocalImport(file, specifier);
        if (resolved) {
          queue.push({
            file: resolved,
            chain: [...chain, relative(resolved)],
          });
        }
      }
    }

    return `${relative(filePath)} (browser-incompatible import)`;
  }

  private async reportBrowserExclusions(
    srcFiles: string[],
    specFiles: string[],
    keptSrcFiles: string[],
    keptSpecFiles: string[],
  ): Promise<void> {
    const droppedSpecFiles =
      specFiles.filter(
        (file) => !keptSpecFiles.includes(file),
      );
    const droppedSrcFiles =
      srcFiles.filter(
        (file) => !keptSrcFiles.includes(file),
      );

    if (
      droppedSpecFiles.length === 0 &&
      droppedSrcFiles.length === 0
    ) {
      return;
    }

    const entries: string[] = [];
    for (
      const file
      of [...droppedSpecFiles, ...droppedSrcFiles]
    ) {
      entries.push(
        await this.describeBrowserExclusion(file),
      );
    }

    logger.warn(
      FileDiscoveryMessages.browserCompatibilityExcluded(
        droppedSpecFiles.length,
        droppedSrcFiles.length,
        entries,
      ),
    );
  }

  private async computeBrowserCompatibility(
    filePath: string,
    lookupImport: (
      importedPath: string,
    ) => Promise<boolean | undefined>,
  ): Promise<boolean> {
    let source = '';

    try {
      source =
        await fs.readFile(
          filePath,
          'utf8',
        );
    } catch (error) {
      logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`);
      return true;
    }

    const importedSpecifiers =
      this.collectImportedSpecifiers(
        source,
      );

    if (
      !this.usesEnvironmentSpecHelper(
        source,
      ) &&
      this.usesBrowserUnsupportedGlobals(
        source,
      )
    ) {
      return false;
    }

    for (
      const specifier of
      importedSpecifiers
    ) {
      if (
        this.isBrowserUnsupportedSpecifier(
          specifier,
        )
      ) {
        return false;
      }

      const resolvedImport =
        await this.resolveLocalImport(
          filePath,
          specifier,
        );

      if (
        resolvedImport &&
        (await lookupImport(
          resolvedImport,
        )) === false
      ) {
        return false;
      }
    }

    return true;
  }

  private usesEnvironmentSpecHelper(
    source: string,
  ): boolean {
    return /from\s*['"][^'"]*env\.spec['"]/.test(
      source,
    ) || /require\s*\(\s*['"][^'"]*env\.spec['"]\s*\)/.test(
      source,
    );
  }

  private usesBrowserUnsupportedGlobals(
    source: string,
  ): boolean {
    const code =
      this.stripCommentsAndStrings(
        source,
      );

    return BROWSER_UNSUPPORTED_GLOBAL_PATTERNS.some(
      (pattern) => {
        pattern.lastIndex = 0;
        return pattern.test(code);
      },
    );
  }

  private stripCommentsAndStrings(
    source: string,
  ): string {
    let output = source.replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    );

    output = output.replace(
      /\/\/.*$/gm,
      '',
    );

    output = output.replace(
      /'(?:\\.|[^'\\])*'/g,
      "''",
    );

    output = output.replace(
      /"(?:\\.|[^"\\])*"/g,
      '""',
    );

    output = output.replace(
      /`(?:\\.|[^`\\])*`/g,
      '``',
    );

    return output;
  }

  private collectImportedSpecifiers(
    source: string,
  ): string[] {
    const patterns = [
      /\bimport\s+[\s\S]*?\s+from\s*['"]([^'"]+)['"]/g,
      /\bexport\s+[\s\S]*?\s+from\s*['"]([^'"]+)['"]/g,
      /\bimport\s*['"]([^'"]+)['"]/g,
      /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    ];

    const specifiers: string[] = [];

    for (const pattern of patterns) {
      pattern.lastIndex = 0;

      for (
        const match of
        source.matchAll(pattern)
      ) {
        const specifier = match[1]?.trim();
        if (specifier) {
          specifiers.push(specifier);
        }
      }
    }

    return [...new Set(specifiers)];
  }

  private isBrowserUnsupportedSpecifier(
    specifier: string,
  ): boolean {
    if (
      specifier.startsWith('.') ||
      specifier.startsWith('/')
    ) {
      return false;
    }

    const normalizedSpecifier =
      specifier.replace(/^node:/, '');

    if (
      NODE_BUILTIN_SPECIFIERS.has(
        normalizedSpecifier,
      ) ||
      NODE_BUILTIN_SPECIFIERS.has(
        normalizedSpecifier.split('/')[0]!,
      )
    ) {
      return true;
    }

    const packageName =
      normalizedSpecifier.startsWith('@')
        ? normalizedSpecifier
            .split('/')
            .slice(0, 2)
            .join('/')
        : (normalizedSpecifier
            .split('/')[0] ??
          normalizedSpecifier);

    return BROWSER_UNSUPPORTED_PACKAGES.has(
      packageName,
    );
  }

  private async resolveLocalImport(
    importerPath: string,
    specifier: string,
  ): Promise<string | null> {
    if (
      !specifier.startsWith('.') &&
      !specifier.startsWith('/')
    ) {
      return null;
    }

    const basePath =
      specifier.startsWith('/')
        ? path.resolve(specifier)
        : path.resolve(
            path.dirname(importerPath),
            specifier,
          );

    const candidates = [
      basePath,
      `${basePath}.ts`,
      `${basePath}.js`,
      `${basePath}.mjs`,
      path.join(basePath, 'index.ts'),
      path.join(basePath, 'index.js'),
      path.join(basePath, 'index.mjs'),
    ];

    for (const candidate of candidates) {
      const stats = statSync(candidate, { throwIfNoEntry: false });
      if (stats?.isFile()) {
        return norm(candidate);
      }
    }

    return null;
  }

  getOutputName(filePath: string): string {
    const srcDirs = this.getSrcDirConfigs();
    const testDirs = this.getTestDirConfigs();
    const normalizedPath = norm(path.resolve(filePath));

    const resolveDirs = (dirs: string[]) =>
      dirs.map((dir) => norm(path.resolve(dir)));

    const normalizedSrcDirs = resolveDirs(srcDirs);
    const normalizedTestDirs = resolveDirs(testDirs);
    if (!normalizedSrcDirs.length) {
      normalizedSrcDirs.push(norm(path.resolve('./src')));
    }
    if (!normalizedTestDirs.length) {
      normalizedTestDirs.push(norm(path.resolve('./tests')));
    }

    const matchDir = (dirs: string[]): string | null => {
      for (const candidate of dirs) {
        if (
          normalizedPath === candidate ||
          normalizedPath.startsWith(`${candidate}/`)
        ) {
          return candidate;
        }
      }
      return null;
    };

    const baseTest = matchDir(normalizedTestDirs);
    const baseSrc = matchDir(normalizedSrcDirs) ?? normalizedSrcDirs[0];
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

    const hash = createHash('sha1')
      .update(normalizedPath)
      .digest('hex')
      .slice(0, 8);

    if (isSpecFile) {
      const prefix = segments.join('_');
      const flattened = prefix ? `${prefix}__${fileName}` : fileName;
      return `${flattened}__${hash}.spec.mjs`;
    }

    const sanitized =
      segments.length > 0 ? `${segments.join('_')}__${fileName}` : fileName;
    
    return `${sanitized}__${hash}.mjs`;
  }
}
