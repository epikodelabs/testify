import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { norm } from './utils';
import JSONCleaner from './json-cleaner';

export class PackageResolver {
  private cleaner = new JSONCleaner();

  async resolve(projectValue: string, tsconfigPath?: string): Promise<string | undefined> {
    // If it is a directory on disk, validate and use it directly
    try {
      const stat = await fs.promises.stat(projectValue);
      if (stat.isDirectory()) {
        return norm(path.resolve(projectValue));
      }
    } catch {
      // not a directory, continue to name resolution
    }

    // Try tsconfig references
    const fromTsconfig = await this.resolveFromTsconfig(projectValue, tsconfigPath);
    if (fromTsconfig) return fromTsconfig;

    // Try npm / pnpm workspaces
    const fromWorkspaces = await this.resolveFromWorkspaces(projectValue);
    if (fromWorkspaces) return fromWorkspaces;

    return undefined;
  }

  private async resolveFromTsconfig(projectValue: string, tsconfigPath?: string): Promise<string | undefined> {
    const configPath = norm(tsconfigPath ?? 'tsconfig.json');
    if (!fs.existsSync(configPath)) return undefined;

    let tsconfig: any;
    try {
      tsconfig = this.cleaner.parse(fs.readFileSync(configPath, 'utf8'));
    } catch {
      return undefined;
    }

    const references = tsconfig.references ?? [];
    const rootDir = path.dirname(path.resolve(configPath));

    for (const ref of references) {
      const refPath = typeof ref === 'string' ? ref : ref?.path;
      if (!refPath) continue;

      const packageDir = norm(path.resolve(rootDir, refPath));
      const pkgJsonPath = norm(path.join(packageDir, 'package.json'));

      if (!fs.existsSync(pkgJsonPath)) continue;

      try {
        const pkg = this.cleaner.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        if (pkg.name === projectValue) {
          return packageDir;
        }
      } catch {
        // skip unreadable package.json
      }
    }

    return undefined;
  }

  private async resolveFromWorkspaces(projectValue: string): Promise<string | undefined> {
    // npm workspaces
    const rootPkgPath = norm(path.resolve('package.json'));
    if (fs.existsSync(rootPkgPath)) {
      try {
        const rootPkg = this.cleaner.parse(fs.readFileSync(rootPkgPath, 'utf8'));
        const workspaces = rootPkg.workspaces;
        const patterns: string[] = Array.isArray(workspaces)
          ? workspaces
          : workspaces?.packages ?? [];

        for (const pattern of patterns) {
          const candidates = await glob(
            norm(pattern).replace(/\\/g, '/') + '/package.json',
            { absolute: true }
          );
          for (const pkgJsonPath of candidates) {
            try {
              const pkg = this.cleaner.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
              if (pkg.name === projectValue) {
                return norm(path.dirname(pkgJsonPath));
              }
            } catch {
              // skip
            }
          }
        }
      } catch {
        // skip unreadable root package.json
      }
    }

    // pnpm workspaces
    const pnpmWorkspacePath = norm(path.resolve('pnpm-workspace.yaml'));
    if (fs.existsSync(pnpmWorkspacePath)) {
      try {
        const content = fs.readFileSync(pnpmWorkspacePath, 'utf8');
        const patterns = this.parsePnpmWorkspaceYaml(content);

        for (const pattern of patterns) {
          const candidates = await glob(
            pattern.replace(/\\/g, '/') + '/package.json',
            { absolute: true }
          );
          for (const pkgJsonPath of candidates) {
            try {
              const pkg = this.cleaner.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
              if (pkg.name === projectValue) {
                return norm(path.dirname(pkgJsonPath));
              }
            } catch {
              // skip
            }
          }
        }
      } catch {
        // skip unreadable pnpm-workspace.yaml
      }
    }

    return undefined;
  }

  private parsePnpmWorkspaceYaml(content: string): string[] {
    const patterns: string[] = [];
    const lines = content.split(/\r?\n/);
    let inPackages = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === 'packages:') {
        inPackages = true;
        continue;
      }
      if (inPackages) {
        if (trimmed.startsWith('- ')) {
          const pattern = trimmed.slice(2).trim().replace(/['"]/g, '');
          if (pattern) patterns.push(pattern);
        } else if (trimmed.length > 0 && !trimmed.startsWith('#')) {
          // End of packages block
          inPackages = false;
        }
      }
    }

    return patterns;
  }
}
