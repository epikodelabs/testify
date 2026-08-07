import fs from 'fs';
import path from 'path';
import { createRequire, registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'url';

const RELATIVE_SPECIFIER_RE = /^\.{1,2}(?:[\\/]|$)/;
const runtimeRequire = createRequire(import.meta.url);
const nodeModule = runtimeRequire('node:module') as any;
const ModuleCtor = nodeModule.Module ?? nodeModule;

export const RELATIVE_IMPORT_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
] as const;

function isFile(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function isDirectory(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function hasUrlSuffix(specifier: string): boolean {
  return specifier.includes('?') || specifier.includes('#');
}

/**
 * Resolve a local relative specifier using the same conveniences developers
 * typically get from TypeScript/Vite-style bundler resolution.
 *
 * Examples:
 *   ../lib           -> ../lib/index.ts
 *   ../lib/bind-form -> ../lib/bind-form.ts
 *   ./helper         -> ./helper.ts
 *
 * Returns an absolute filesystem path or null.
 */
export function resolveRelativePath(
  specifier: string,
  parentFile: string | undefined,
): string | null {
  if (!RELATIVE_SPECIFIER_RE.test(specifier)) return null;
  if (!parentFile) return null;
  if (hasUrlSuffix(specifier)) return null;

  const candidate = path.resolve(path.dirname(parentFile), specifier);

  if (isFile(candidate)) {
    return candidate;
  }

  if (path.extname(candidate) === '') {
    for (const extension of RELATIVE_IMPORT_EXTENSIONS) {
      const filePath = `${candidate}${extension}`;
      if (isFile(filePath)) {
        return filePath;
      }
    }
  }

  if (isDirectory(candidate)) {
    for (const extension of RELATIVE_IMPORT_EXTENSIONS) {
      const indexPath = path.join(candidate, `index${extension}`);
      if (isFile(indexPath)) {
        return indexPath;
      }
    }
  }

  return null;
}

/**
 * ESM-facing helper retained as a public/testing seam.
 */
export function resolveRelativeImport(
  specifier: string,
  parentURL?: string,
): string | null {
  if (!parentURL?.startsWith('file:')) return null;

  const resolved = resolveRelativePath(
    specifier,
    fileURLToPath(parentURL),
  );

  return resolved ? pathToFileURL(resolved).href : null;
}

/**
 * Install Testify's compatibility resolution in front of both Node module
 * systems used by tsx:
 *
 *  - ESM: node:module registerHooks()
 *  - CJS: Module._resolveFilename()
 *
 * IMPORTANT: register this AFTER tsx. tsx installs its own CJS resolver shim;
 * Testify must wrap that resolver rather than be overwritten by it.
 */
export function registerTestifyRelativeResolver(): () => void {
  const esmRegistration = registerHooks({
    resolve(specifier, context, nextResolve) {
      const resolved = resolveRelativeImport(specifier, context.parentURL);

      if (resolved) {
        // Feed a concrete URL back through the remaining chain so tsx can still
        // transpile TypeScript and apply any other loader behavior it owns.
        return nextResolve(resolved, context);
      }

      return nextResolve(specifier, context);
    },
  }) as { deregister?: () => void } | undefined;

  const previousResolveFilename = ModuleCtor._resolveFilename;

  const testifyResolveFilename = function (
    this: unknown,
    request: string,
    parent: { filename?: string } | undefined,
    isMain: boolean,
    options: unknown,
  ) {
    if (typeof request === 'string' && RELATIVE_SPECIFIER_RE.test(request)) {
      const resolved = resolveRelativePath(request, parent?.filename);

      if (resolved) {
        // Returning the concrete absolute path lets the tsx CJS extension hooks
        // load/transpile .ts/.tsx while avoiding Node's extensionless lookup.
        return resolved;
      }
    }

    return previousResolveFilename.call(
      this,
      request,
      parent,
      isMain,
      options,
    );
  };

  ModuleCtor._resolveFilename = testifyResolveFilename;

  return () => {
    if (ModuleCtor._resolveFilename === testifyResolveFilename) {
      ModuleCtor._resolveFilename = previousResolveFilename;
    }

    esmRegistration?.deregister?.();
  };
}
