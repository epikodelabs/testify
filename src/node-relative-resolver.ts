import fs from 'fs';
import path from 'path';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'url';

const RELATIVE_SPECIFIER_RE = /^\.{1,2}(?:[\\/]|$)/;

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

/**
 * Resolve the bundler-style relative imports commonly used by TypeScript projects:
 *
 *   ../lib           -> ../lib/index.ts
 *   ../lib/forms     -> ../lib/forms.ts
 *   ./helper         -> ./helper.ts
 *
 * Package imports, tsconfig aliases, URLs, and already-resolvable paths are left to
 * Node/tsx. Testify only fills the extensionless/directory gap between bundler
 * resolution and native Node ESM resolution.
 */
export function resolveRelativeImport(
  specifier: string,
  parentURL?: string,
): string | null {
  if (!RELATIVE_SPECIFIER_RE.test(specifier)) return null;
  if (!parentURL?.startsWith('file:')) return null;

  // Query/hash imports are valid URL semantics and should remain Node/loader-owned.
  // This resolver deals only with filesystem-style relative module specifiers.
  if (specifier.includes('?') || specifier.includes('#')) return null;

  const parentFile = fileURLToPath(parentURL);
  const candidate = path.resolve(path.dirname(parentFile), specifier);

  // Preserve explicit existing file imports exactly as authored.
  if (isFile(candidate)) {
    return pathToFileURL(candidate).href;
  }

  // Extensionless relative file import: ./foo -> ./foo.ts (etc.).
  if (path.extname(candidate) === '') {
    for (const extension of RELATIVE_IMPORT_EXTENSIONS) {
      const filePath = `${candidate}${extension}`;
      if (isFile(filePath)) {
        return pathToFileURL(filePath).href;
      }
    }
  }

  // Directory import: ../lib -> ../lib/index.ts (etc.).
  if (isDirectory(candidate)) {
    for (const extension of RELATIVE_IMPORT_EXTENSIONS) {
      const indexPath = path.join(candidate, `index${extension}`);
      if (isFile(indexPath)) {
        return pathToFileURL(indexPath).href;
      }
    }
  }

  return null;
}

/**
 * Install Testify's small compatibility resolver in front of the normal Node/tsx
 * resolver chain. The returned function removes the hook when supported.
 */
export function registerTestifyRelativeResolver(): () => void {
  const registration = registerHooks({
    resolve(specifier, context, nextResolve) {
      const resolved = resolveRelativeImport(specifier, context.parentURL);
      if (resolved) {
        // Continue the chain with a concrete file URL so tsx can still transpile
        // TypeScript and apply its normal loader behavior.
        return nextResolve(resolved, context);
      }

      return nextResolve(specifier, context);
    },
  }) as { deregister?: () => void } | undefined;

  return () => registration?.deregister?.();
}
