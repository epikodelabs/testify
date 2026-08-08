import { glob } from "glob";
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { norm } from "./utils";
import * as fs from "fs/promises";
import * as path from "path";
import { builtinModules } from "module";
import { createHash } from 'crypto';
import { logger } from './logger';
import { FileDiscoveryMessages } from './log-messages';

const NODE_BUILTIN_MODULES = new Set(
  builtinModules.flatMap((name) => [
    name,
    name.startsWith('node:')
      ? name.slice(5)
      : `node:${name}`,
  ]),
);

const NODE_ONLY_PACKAGES = new Set([
  'chokidar',
  'glob',
  'playwright',
  'playwright-core',
  'rollup',
  'tsx',
  'vite',
  'ws',
]);

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
        try {
          await fs.access(normalizedPath);
          return normalizedPath;
        } catch {
          return null;
        }
      })
    );
    return results.filter((p): p is string => p !== null);
  }

  async discoverSources(): Promise<{
    srcFiles: string[];
    specFiles: string[];
    excludedSpecFiles: string[];
  }> {
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

      const uniqueSrcFiles =
        [...new Set(srcFiles)];
      const uniqueSpecFiles =
        [...new Set(specFiles)];

      const filteredSpecFiles =
        this.config.browser === 'node'
          ? uniqueSpecFiles
          : await this.filterBrowserCompatibleFiles(
              uniqueSpecFiles,
            );
      const excludedSpecFiles =
        uniqueSpecFiles.filter(
          (filePath) =>
            !filteredSpecFiles.includes(
              filePath,
            ),
        );

      return {
        srcFiles: uniqueSrcFiles,
        specFiles: filteredSpecFiles,
        excludedSpecFiles,
      };
    } catch (error) {
      logger.error(FileDiscoveryMessages.errorDiscoveringFiles(error));
      throw new Error("Failed to discover source and test files");
    }
  }

  private async filterBrowserCompatibleFiles(
    filePaths: string[],
  ): Promise<string[]> {
    const compatibilityCache =
      new Map<string, boolean>();

    const results = await Promise.all(
      filePaths.map(async (filePath) => {
        const compatible =
          await this.isBrowserCompatibleModule(
            filePath,
            compatibilityCache,
            new Set<string>(),
          );

        return compatible
          ? filePath
          : null;
      }),
    );

    return results.filter(
      (filePath): filePath is string =>
        filePath !== null,
    );
  }

  private async isBrowserCompatibleModule(
    filePath: string,
    compatibilityCache: Map<string, boolean>,
    activeStack: Set<string>,
  ): Promise<boolean> {
    const normalizedPath =
      norm(path.resolve(filePath));

    if (
      compatibilityCache.has(
        normalizedPath,
      )
    ) {
      return compatibilityCache.get(
        normalizedPath,
      ) as boolean;
    }

    if (activeStack.has(normalizedPath)) {
      return true;
    }

    activeStack.add(normalizedPath);

    try {
      const source =
        await fs.readFile(
          normalizedPath,
          'utf8',
        );

      const specifiers =
        this.extractRuntimeSpecifiers(
          source,
        );

      for (const specifier of specifiers) {
        if (
          NODE_BUILTIN_MODULES.has(
            specifier,
          ) ||
          NODE_ONLY_PACKAGES.has(
            specifier,
          )
        ) {
          compatibilityCache.set(
            normalizedPath,
            false,
          );
          return false;
        }

        if (
          !specifier.startsWith('.') &&
          !specifier.startsWith('/')
        ) {
          continue;
        }

        const resolvedImport =
          await this.resolveImportPath(
            specifier,
            normalizedPath,
          );

        if (!resolvedImport) {
          continue;
        }

        const compatible =
          await this.isBrowserCompatibleModule(
            resolvedImport,
            compatibilityCache,
            activeStack,
          );

        if (!compatible) {
          compatibilityCache.set(
            normalizedPath,
            false,
          );
          return false;
        }
      }

      compatibilityCache.set(
        normalizedPath,
        true,
      );
      return true;
    } catch {
      compatibilityCache.set(
        normalizedPath,
        false,
      );
      return false;
    } finally {
      activeStack.delete(
        normalizedPath,
      );
    }
  }

  private extractRuntimeSpecifiers(
    source: string,
  ): string[] {
    const specifiers =
      new Set<string>();
    const sanitizedSource =
      source
        .replace(
          /\/\*[\s\S]*?\*\//g,
          '',
        )
        .replace(
          /\/\/.*$/gm,
          '',
        );

    const fromPattern =
      /(?:import|export)\s+(?!type\b)[^'"]*?\sfrom\s*['"]([^'"]+)['"]/g;
    const sideEffectImportPattern =
      /import\s*['"]([^'"]+)['"]/g;
    const dynamicImportPattern =
      /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    const requirePattern =
      /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

    for (const pattern of [
      fromPattern,
      sideEffectImportPattern,
      dynamicImportPattern,
      requirePattern,
    ]) {
      for (const match of sanitizedSource.matchAll(pattern)) {
        const specifier = match[1]?.trim();
        if (specifier) {
          specifiers.add(specifier);
        }
      }
    }

    return [...specifiers];
  }

  private async resolveImportPath(
    specifier: string,
    importerPath: string,
  ): Promise<string | null> {
    const importerDir =
      path.dirname(importerPath);
    const candidateBase =
      specifier.startsWith('/')
        ? path.resolve(specifier)
        : path.resolve(
            importerDir,
            specifier,
          );

    const candidates = [
      candidateBase,
      `${candidateBase}.ts`,
      `${candidateBase}.mjs`,
      path.join(candidateBase, 'index.ts'),
      path.join(candidateBase, 'index.mjs'),
    ];

    for (const candidate of candidates) {
      try {
        const stats =
          await fs.stat(candidate);

        if (stats.isFile()) {
          return norm(candidate);
        }
      } catch {
        continue;
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
