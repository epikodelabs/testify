import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import JSONCleaner from './json-cleaner';
import { logger } from './logger';
import { norm } from './utils';

const JASMINE_TYPE_NAME = 'jasmine';
const TSCONFIG_CANDIDATES = [
  'tsconfig.spec.json',
  'tsconfig.test.json',
  'tsconfig.jasmine.json',
  'tsconfig.json',
] as const;

export interface ProjectSetupResult {
  tsconfigPath?: string;
  jasmineTypesAvailable: boolean;
  jasmineTypesRegistered: boolean;
  changed: boolean;
}

export class ProjectSetup {
  static configure(projectRoot = process.cwd()): ProjectSetupResult {
    const root = norm(path.resolve(projectRoot));
    const jasmineTypesAvailable = this.hasJasmineTypes(root);
    const tsconfigPath = this.findTsconfig(root);

    if (!jasmineTypesAvailable) {
      logger.println(
        'Jasmine type declarations were not found. Install them with: npm install -D @types/jasmine',
      );
    }

    if (!tsconfigPath) {
      logger.println('No tsconfig file found; skipped Jasmine type registration.');
      return {
        jasmineTypesAvailable,
        jasmineTypesRegistered: false,
        changed: false,
      };
    }

    const raw = fs.readFileSync(tsconfigPath, 'utf8');
    const cleaner = new JSONCleaner();
    const config = cleaner.parse<Record<string, any>>(raw);
    const compilerOptions = config.compilerOptions ?? {};
    const types = compilerOptions.types;

    if (types === undefined) {
      config.compilerOptions = {
        ...compilerOptions,
        types: [JASMINE_TYPE_NAME],
      };

      const eol = raw.includes('\r\n') ? '\r\n' : '\n';
      const serialized = `${JSON.stringify(config, null, 2).replace(/\n/g, eol)}${eol}`;
      fs.writeFileSync(tsconfigPath, serialized, 'utf8');

      logger.println(
        `Added compilerOptions.types with "${JASMINE_TYPE_NAME}" to ${path.basename(tsconfigPath)}.`,
      );

      return {
        tsconfigPath,
        jasmineTypesAvailable,
        jasmineTypesRegistered: true,
        changed: true,
      };
    }

    if (!Array.isArray(types)) {
      logger.println(
        `${path.basename(tsconfigPath)} has a non-array compilerOptions.types; skipped automatic modification.`,
      );
      return {
        tsconfigPath,
        jasmineTypesAvailable,
        jasmineTypesRegistered: false,
        changed: false,
      };
    }

    if (types.includes(JASMINE_TYPE_NAME)) {
      logger.println(
        `${path.basename(tsconfigPath)} already includes "${JASMINE_TYPE_NAME}" in compilerOptions.types.`,
      );
      return {
        tsconfigPath,
        jasmineTypesAvailable,
        jasmineTypesRegistered: true,
        changed: false,
      };
    }

    config.compilerOptions = {
      ...compilerOptions,
      types: [...types, JASMINE_TYPE_NAME],
    };

    const eol = raw.includes('\r\n') ? '\r\n' : '\n';
    const serialized = `${JSON.stringify(config, null, 2).replace(/\n/g, eol)}${eol}`;
    fs.writeFileSync(tsconfigPath, serialized, 'utf8');

    logger.println(
      `Updated ${path.basename(tsconfigPath)} compilerOptions.types with "${JASMINE_TYPE_NAME}".`,
    );

    return {
      tsconfigPath,
      jasmineTypesAvailable,
      jasmineTypesRegistered: true,
      changed: true,
    };
  }

  static inspect(projectRoot = process.cwd()): ProjectSetupResult {
    const root = norm(path.resolve(projectRoot));
    const jasmineTypesAvailable = this.hasJasmineTypes(root);
    const tsconfigPath = this.findTsconfig(root);

    if (!tsconfigPath) {
      return {
        jasmineTypesAvailable,
        jasmineTypesRegistered: false,
        changed: false,
      };
    }

    try {
      const cleaner = new JSONCleaner();
      const config = cleaner.parse<Record<string, any>>(
        fs.readFileSync(tsconfigPath, 'utf8'),
      );
      const types = config.compilerOptions?.types;

      return {
        tsconfigPath,
        jasmineTypesAvailable,
        jasmineTypesRegistered:
          Array.isArray(types) && types.includes(JASMINE_TYPE_NAME),
        changed: false,
      };
    } catch {
      return {
        tsconfigPath,
        jasmineTypesAvailable,
        jasmineTypesRegistered: false,
        changed: false,
      };
    }
  }

  static findTsconfig(projectRoot = process.cwd()): string | undefined {
    const root = norm(path.resolve(projectRoot));

    for (const candidate of TSCONFIG_CANDIDATES) {
      const candidatePath = norm(path.join(root, candidate));
      if (fs.existsSync(candidatePath)) {
        return candidatePath;
      }
    }

    return undefined;
  }

  private static hasJasmineTypes(projectRoot: string): boolean {
    try {
      const projectRequire = createRequire(
        path.join(projectRoot, '__testify_setup__.cjs'),
      );
      projectRequire.resolve('@types/jasmine/package.json');
      return true;
    } catch {
      return false;
    }
  }
}
