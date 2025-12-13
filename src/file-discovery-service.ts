import { glob } from "glob";
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { norm } from "./utils";
import * as fs from "fs/promises";
import * as path from "path";
import { logger } from "./console-repl";

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
      logger.error(`❌ Error discovering files: ${error}`);
      throw new Error("Failed to discover source and test files");
    }
  }

  async filterExistingFiles(paths: string[]): Promise<string[]> {
    const existingFiles: string[] = [];
    
    await Promise.all(
      paths.map(async (filePath) => {
        const normalizedPath = norm(filePath);
        try {
          await fs.access(normalizedPath);
          existingFiles.push(normalizedPath);
        } catch {
          // File doesn't exist, skip it
        }
      })
    );
    
    return existingFiles;
  }

  async discoverSources(): Promise<{ srcFiles: string[]; specFiles: string[] }> {
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

      return { srcFiles: [...new Set(srcFiles)], specFiles: [...new Set(specFiles)] };
    } catch (error) {
      logger.error(`❌ Error discovering files: ${error}`);
      throw new Error("Failed to discover source and test files");
    }
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

    const sanitizeSegment = (segment: string) => {
      if (segment === '..') return 'up';
      if (segment === '.') return 'dot';
      return segment;
    };

    const segments = relativeWithoutExt.split('/').filter(Boolean);
    const sanitized =
      segments.length > 0
        ? segments.map(sanitizeSegment).join('_')
        : sanitizeSegment(path.basename(relativeWithoutExt) || 'index');

    return `${sanitized}.js`;
  }
}
