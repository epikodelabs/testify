import * as path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';

const packageRequire = createRequire(import.meta.url);

function isUrlSpecifier(specifier: string): boolean {
  return /^(?:[a-z]+:)?\/\//i.test(specifier);
}

export function getConfiguredPreludeModules(config: ViteJasmineConfig): string[] {
  const preludeModules = [...(config.htmlOptions?.preludeModules ?? [])];

  if (config.angularOptions?.enableJitCompiler) {
    preludeModules.unshift('@angular/compiler');
  }

  return preludeModules.filter(Boolean);
}

export function resolveBrowserPreludeModules(config: ViteJasmineConfig): string[] {
  return getConfiguredPreludeModules(config).map((specifier) =>
    resolveBrowserPreludeModuleSpecifier(specifier)
  );
}

function resolveBrowserPreludeModuleSpecifier(specifier: string): string {
  if (isUrlSpecifier(specifier)) {
    return specifier;
  }

  if (specifier.startsWith('/') || specifier.startsWith('./') || specifier.startsWith('../')) {
    return specifier;
  }

  let resolvedPath: string;
  try {
    resolvedPath = norm(packageRequire.resolve(specifier, { paths: [process.cwd()] }));
  } catch (error) {
    throw new Error(`Failed to resolve prelude module "${specifier}": ${(error as Error).message}`);
  }

  const nodeModulesMarker = '/node_modules/';
  const nodeModulesIndex = resolvedPath.lastIndexOf(nodeModulesMarker);
  if (nodeModulesIndex === -1) {
    throw new Error(
      `Prelude module "${specifier}" resolved outside node_modules and cannot be served to the browser: ${resolvedPath}`
    );
  }

  return resolvedPath.slice(nodeModulesIndex);
}

export function resolveNodePreludeModules(config: ViteJasmineConfig, outDir: string): string[] {
  return getConfiguredPreludeModules(config).map((specifier) =>
    resolveNodePreludeModuleSpecifier(specifier, outDir)
  );
}

function resolveNodePreludeModuleSpecifier(specifier: string, outDir: string): string {
  if (isUrlSpecifier(specifier)) {
    return specifier;
  }

  if (specifier.startsWith('/')) {
    return pathToFileURL(path.resolve(outDir, specifier.slice(1))).href;
  }

  if (path.isAbsolute(specifier)) {
    return pathToFileURL(specifier).href;
  }

  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    return pathToFileURL(path.resolve(outDir, specifier)).href;
  }

  let resolvedPath: string;
  try {
    resolvedPath = norm(packageRequire.resolve(specifier, { paths: [process.cwd()] }));
  } catch (error) {
    throw new Error(`Failed to resolve prelude module "${specifier}": ${(error as Error).message}`);
  }

  return pathToFileURL(resolvedPath).href;
}
