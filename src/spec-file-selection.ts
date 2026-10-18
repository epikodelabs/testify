import path from 'node:path';
import { EXIT_CODES, ExitCodeError } from './exit-codes';
import { norm } from './utils';

export function findSpecFileMatches(files: string[], selector: string, cwd = process.cwd()): string[] {
  const value = norm(selector.trim());
  const hasPath = value.includes('/') || path.isAbsolute(value);
  const requested = hasPath ? norm(path.resolve(cwd, value)) : value;
  const candidate = (file: string) => hasPath ? norm(path.resolve(cwd, file)) : path.posix.basename(norm(file));
  const unique = [...new Set(files)].sort();
  const exact = unique.filter(file => candidate(file) === requested);
  if (exact.length) return exact;
  const stem = (file: string) => file.replace(/\.(?:[cm]?[jt]sx?)$/i, '');
  return unique.filter(file => stem(candidate(file)) === stem(requested));
}

export function resolveSpecFiles(files: string[], selector: string): string[] {
  const matches = findSpecFileMatches(files, selector);
  if (matches.length === 0) {
    throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, `No spec file matches ${JSON.stringify(selector)}. Check the path relative to ${process.cwd()}.`);
  }
  return matches;
}
