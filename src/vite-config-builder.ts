import * as fs from 'fs';
import * as path from 'path';
import { InlineConfig } from "vite";
import { ViteJasmineConfig, ImportEntry } from "./vite-jasmine-config";
import { norm } from './utils';
import JSONCleaner from './json-cleaner';
import { logger } from './console-repl';
import { minimatch } from 'minimatch';
import glob from 'fast-glob';

export class ViteConfigBuilder {
  inputMap: Record<string, string> = {};

  constructor(private config: ViteJasmineConfig) {}

  private getPreserveModulesRoot(): string {
    return this.config.viteBuildOptions?.preserveModulesRoot ?? '.';
  }

  private getImportEntries(): ImportEntry[] {
    const imports = (this.config.imports ?? []) as any[];
    const normalized: ImportEntry[] = [];

    imports.forEach((entry, index) => {
      if (!entry) return;
      if (typeof entry === 'string') {
        const fallbackName = path.basename(entry, path.extname(entry)) || `import_${index}`;
        normalized.push({ name: fallbackName, path: entry });
        return;
      }
      if (typeof entry.path === 'string') {
        const name = entry.name || path.basename(entry.path, path.extname(entry.path)) || `import_${index}`;
        normalized.push({ name, path: entry.path });
      }
    });

    return normalized;
  }

  /**
   * Normalize directory configuration to array format
   * Supports legacy string values and arrays of strings for backward compatibility.
   */
  private normalizeDirConfig(dirConfig: string | string[] | undefined, fallback?: string): string[] {
    if ((!dirConfig || (Array.isArray(dirConfig) && dirConfig.length === 0)) && fallback) {
      return [fallback];
    }
    if (!dirConfig) return [];
    return Array.isArray(dirConfig) ? dirConfig : [dirConfig];
  }

  /**
   * Extract base path from a directory string or glob, falling back to provided default when using globs.
   */
  private getDirBase(dirPath: string, fallback: string): string {
    const rawPath = dirPath;
    if (!rawPath) return fallback;

    if (rawPath.includes('*')) {
      const base = rawPath.split('*')[0];
      const dirName = path.dirname(base);
      return dirName || fallback;
    }

    return rawPath;
  }

  /**
   * Get all source directories with their configs
   */
  private getSrcDirConfigs(): string[] {
    return this.normalizeDirConfig(this.config.srcDirs, './src');
  }

  /**
   * Get all test directories with their configs
   */
  private getTestDirConfigs(): string[] {
    return this.normalizeDirConfig(this.config.testDirs, './tests');
  }

  /**
   * Discover files based on DirConfig
   */
  private async discoverFilesInDir(dirPath: string, isTest: boolean = false): Promise<string[]> {
    const paths = Array.isArray(dirPath) ? dirPath : [dirPath];

    const patterns: string[] = [];
    
    for (const p of paths) {
      if (p.includes('*')) {
        patterns.push(p);
      } else if (fs.existsSync(p)) {
        const defaultPattern = isTest ? '**/*.spec.{ts,js,mjs}' : '**/*.{ts,js,mjs}';
        patterns.push(path.join(p, defaultPattern));
      } else {
        logger.println(`⚠️  Directory not found: ${p}`);
      }
    }
    
    if (patterns.length === 0) {
      return [];
    }
    
    // Default exclusions
    const defaultExcludes = [
      '**/node_modules/**',
      '**/*.d.ts',
      '**/dist/**',
      '**/build/**'
    ];
    
    const excludePatterns = [
      ...defaultExcludes,
      ...(this.config.exclude ?? [])
    ];

    try {
      const files = await glob(patterns, {
        ignore: excludePatterns,
        absolute: true,
        onlyFiles: true
      });
      
      return files;
    } catch (error) {
      logger.error(`❌ Error discovering files with patterns ${patterns.join(', ')}: ${error}`);
      return [];
    }
  }

  /**
   * Build input map from discovered files
   */
  private async buildInputMapFromDirs(): Promise<Record<string, string>> {
    let inputMap: Record<string, string> = {};
    
    const srcDirConfigs = this.getSrcDirConfigs();
    const testDirConfigs = this.getTestDirConfigs();
    
    // Discover source files from all src directories
    let allSrcFiles: string[] = [];
    for (const dirConfig of srcDirConfigs) {
      const files = await this.discoverFilesInDir(dirConfig, false);
      allSrcFiles.push(...files);
    }
    
    // Discover test files from all test directories
    let allTestFiles: string[] = [];
    for (const dirConfig of testDirConfigs) {
      const files = await this.discoverFilesInDir(dirConfig, true);
      allTestFiles.push(...files);
    }
    
    // Remove duplicates
    allSrcFiles = [...new Set(allSrcFiles)];
    allTestFiles = [...new Set(allTestFiles)];
    
    // Add source files to input map
    allSrcFiles.forEach(file => {
      const relPath = path
        .relative(this.getPreserveModulesRoot(), file)
        .replace(/\.(ts|js|mjs)$/, '');
      const key = relPath.replace(/[\/\\]/g, '_');
      inputMap[key] = norm(file);
    });

    // Add test files to input map
    const primaryTestDir = testDirConfigs.length > 0 ? 
      this.getDirBase(testDirConfigs[0], './tests') : 
      './tests';
    allTestFiles.forEach(file => {
      const relPath = path.relative(primaryTestDir, file).replace(/\.spec\.(ts|js|mjs)$/, '');
      const key = `${relPath.replace(/[\/\\]/g, '_')}.spec`;
      inputMap[key] = norm(file);
    });

    // Add import files to input map
    const importEntries = this.getImportEntries();
    if (importEntries.length > 0) {
      importEntries.forEach((entry, index) => {
        if (fs.existsSync(entry.path)) {
          const safeName = entry.name.replace(/[\\/\s]/g, '_');
          const key = `__import_${index}_${safeName}`;
          inputMap[key] = norm(entry.path);
        } else {
          logger.println(`⚠️  Import file not found: ${entry.path}`);
        }
      });
    }

    logger.println(`🎯 Built input map: ${Object.keys(inputMap).length} entries (${allSrcFiles.length} source(s), ${allTestFiles.length} test(s), ${importEntries.length} import(s))`);
    
    return inputMap;
  }

  /**
   * Filter files based on exclude patterns
   */
  private filterFiles(files: string[], basePath: string, exclude?: string[]): string[] {
    if (!exclude || exclude.length === 0) {
      return files;
    }

    return files.filter(file => {
      const relativePath = path.relative(basePath, file);
      return !exclude.some(pattern => minimatch(relativePath, pattern) || minimatch(file, pattern));
    });
  }

  /**
   * Legacy method: Build input map from file lists
   */
  private buildInputMap(srcFiles: string[], testFiles: string[]): Record<string, string> {
    let inputMap: Record<string, string> = {};
    
    const srcDirConfigs = this.getSrcDirConfigs();
    const testDirConfigs = this.getTestDirConfigs();
    
    // Filter source files for each directory
    let filteredSrcFiles: string[] = [];
    for (const dirPath of srcDirConfigs) {
      const basePath = this.getDirBase(dirPath, dirPath);
      const dirFiles = srcFiles.filter(f => f.startsWith(basePath));
      const filtered = this.filterFiles(dirFiles, basePath, this.config.exclude);
      filteredSrcFiles.push(...filtered);
    }
    
    // Filter test files for each directory
    let filteredTestFiles: string[] = [];
    for (const dirPath of testDirConfigs) {
      const basePath = this.getDirBase(dirPath, dirPath);
      const dirFiles = testFiles.filter(f => f.startsWith(basePath));
      const filtered = this.filterFiles(dirFiles, basePath, this.config.exclude);
      filteredTestFiles.push(...filtered);
    }
    
    // Remove duplicates
    filteredSrcFiles = [...new Set(filteredSrcFiles)];
    filteredTestFiles = [...new Set(filteredTestFiles)];
    
    // Only include existing files in input map
    const existingSrcFiles = filteredSrcFiles.filter(fs.existsSync);
    const existingTestFiles = filteredTestFiles.filter(fs.existsSync);
    
    // Add source files
    existingSrcFiles.forEach(file => {
      const relPath = path
        .relative(this.getPreserveModulesRoot(), file)
        .replace(/\.(ts|js|mjs)$/, '');
      const key = relPath.replace(/[\/\\]/g, '_');
      inputMap[key] = norm(file);
    });

    // Add test files
    const primaryTestDirConfig = testDirConfigs.length > 0 ? testDirConfigs[0] : null;
    const primaryTestDir = primaryTestDirConfig ? 
      this.getDirBase(primaryTestDirConfig, './tests') : 
      './tests';
    existingTestFiles.forEach(file => {
      const relPath = path.relative(primaryTestDir, file).replace(/\.spec\.(ts|js|mjs)$/, '');
      const key = `${relPath.replace(/[\/\\]/g, '_')}.spec`;
      inputMap[key] = norm(file);
    });

    // Add import files to input map
    const importEntries = this.getImportEntries();
    if (importEntries.length > 0) {
      importEntries.forEach((entry, index) => {
        if (fs.existsSync(entry.path)) {
          const safeName = entry.name.replace(/[\\/\s]/g, '_');
          const key = `__import_${index}_${safeName}`;
          inputMap[key] = norm(entry.path);
        } else {
          logger.println(`⚠️  Import file not found: ${entry.path}`);
        }
      });
    }

    logger.println(`🎯 Built input map: ${Object.keys(inputMap).length} entries (${existingSrcFiles.length} source(s), ${existingTestFiles.length} test(s), ${importEntries.length} import(s))`);
    
    if (filteredSrcFiles.length < srcFiles.length || filteredTestFiles.length < testFiles.length) {
      logger.println(`📋 Filtered: ${srcFiles.length - filteredSrcFiles.length} source(s), ${testFiles.length - filteredTestFiles.length} test(s)`);
    }
    
    return inputMap;
  }

  /** Full library build, preserves modules for proper relative imports */
  createViteConfig(srcFiles?: string[], testFiles?: string[]): InlineConfig {
    // If file lists provided, use legacy method
    if (srcFiles && testFiles) {
      this.inputMap = this.buildInputMap(srcFiles, testFiles);
    }

    return {
      ...this.config.viteConfig,
      root: process.cwd(),
      build: {
        outDir: this.config.outDir,
        lib: false,
        rollupOptions: {
          input: this.inputMap,
          output: {
            format: 'es',
            entryFileNames: '[name].js',
            chunkFileNames: '[name]-[hash].js',
            preserveModules: true,
            // Only bundle node_modules into vendor chunk
            manualChunks: (id: string) => {
              // Only create vendor chunk for node_modules, not for imports
              if (id.includes('node_modules')) {
                return 'vendor';
              }
              // Don't create separate chunks for import files
              return undefined;
            }
          },
          preserveEntrySignatures: 'strict',
        },
        sourcemap: this.config.viteBuildOptions?.sourcemap ?? true,
        target: this.config.viteBuildOptions?.target ?? 'es2022',
        minify: this.config.viteBuildOptions?.minify ?? false,
        emptyOutDir: true
      },
      resolve: { alias: this.createPathAliases() },
      esbuild: { target: 'es2022', keepNames: false },
      define: { 'process.env.NODE_ENV': '"test"' },
      logLevel: 'warn',
    };
  }

  /** Incremental or partial rebuild, flattens output file names */
  createViteConfigForFiles(srcFiles?: string[], testFiles?: string[], viteCache?: any): InlineConfig {
    // Initialize newInput as empty object
    let newInput: Record<string, string> = {};
    
    // If file lists provided, use legacy method
    if (srcFiles && testFiles) {
      newInput = this.buildInputMap(srcFiles, testFiles);
    }
    
    // Update inputMap by removing deleted files and adding new ones
    logger.println(`🗑️  Removing deleted files from input map`);
    Object.keys(this.inputMap).forEach(key => {
      if (!fs.existsSync(this.inputMap[key])) {
        delete this.inputMap[key];
      }
    });
    
    // Add/update with new input
    this.inputMap = { ...this.inputMap, ...newInput };
    
    logger.println(`📦 Final input map for Vite: ${Object.keys(this.inputMap).length} files`);

    // Double-check that no deleted files are in the final input
    const finalInputMap: Record<string, string> = {};
    Object.entries(this.inputMap).forEach(([key, filePath]) => {
      if (fs.existsSync(filePath)) {
        finalInputMap[key] = filePath;
      } 
    });

    if (Object.keys(finalInputMap).length === 0) {
      logger.println('⚠️  No valid files to build after filtering deleted files');
      return {
        root: process.cwd(),
        configFile: false,
        build: {
          outDir: this.config.outDir,
          rollupOptions: { input: {} },
          emptyOutDir: false
        },
        logLevel: 'warn'
      };
    }

    return {
      ...this.config.viteConfig,
      root: process.cwd(),
      configFile: false,
      build: {
        outDir: this.config.outDir,
        lib: false,
        rollupOptions: {
          input: finalInputMap,
          preserveEntrySignatures: 'allow-extension',
          output: {
            format: 'es',
            entryFileNames: ({ name }) => `${name.replace(/[\/\\]/g, '_')}.js`,
            chunkFileNames: '[name].js',
            preserveModules: true,
            preserveModulesRoot: ".",
            // Only bundle node_modules into vendor chunk for incremental builds
            manualChunks: (id: string) => {
              // Only create vendor chunk for node_modules, not for imports
              if (id.includes('node_modules')) {
                return 'vendor';
              }
              // Don't create separate chunks for import files
              return undefined;
            }
          },
          cache: viteCache,
        },
        sourcemap: true,
        target: 'es2022',
        minify: false,
        emptyOutDir: false,
      },
      resolve: { alias: this.createPathAliases() },
      esbuild: { target: 'es2022', keepNames: false, treeShaking: false },
      define: { 'process.env.NODE_ENV': '"test"' },
      logLevel: 'warn',
    };
  }

  /** 
   * Remove a file from the input map (called by HmrManager when file is deleted)
   */
  removeFromInputMap(filePath: string): void {
    const normalizedPath = norm(filePath);
    
    // Find and remove the entry
    const entries = Object.entries(this.inputMap);
    let removed = false;
    
    for (const [key, path] of entries) {
      if (norm(path) === normalizedPath) {
        delete this.inputMap[key];
        removed = true;
        break;
      }
    }
  }

  /** 
   * Remove multiple files from the input map (for directory removal)
   */
  removeMultipleFromInputMap(filePaths: string[]): void {
    filePaths.forEach(filePath => this.removeFromInputMap(filePath));
  }

  createPathAliases(): Record<string, string> {
    const aliases: Record<string, string> = {};
    const cleaner = new JSONCleaner();
    try {
      const tsconfigPath = this.config.tsconfig || 'tsconfig.json';
      if (fs.existsSync(tsconfigPath)) {
        const tsconfig = cleaner.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        const baseUrl = tsconfig.compilerOptions?.baseUrl || '.';
        const paths = tsconfig.compilerOptions?.paths || {};
        for (const [alias, pathArray] of Object.entries(paths)) {
          if (Array.isArray(pathArray) && pathArray.length > 0) {
            const cleanAlias = alias.replace(/\/\*$/, '');
            const cleanPath = (pathArray[0] as string).replace(/\/\*$/, '');
            aliases[cleanAlias] = norm(path.resolve(baseUrl, cleanPath));
          }
        }
      }
    } catch (err) {
      logger.error(`⚠️  tsconfig parsing failed: ${err}`);
    }
    return aliases;
  }

  /**
   * Get the list of import files that should be loaded
   */
  getImportFiles(): string[] {
    const entries = this.getImportEntries();
    if (entries.length === 0) {
      return [];
    }
    
    return entries.filter(e => fs.existsSync(e.path)).map(e => e.path);
  }
}