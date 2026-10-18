import fs from 'fs';
import { logger } from './logger';

let warned = false;

/**
 * Returns the installed Testify package version.
 *
 * The compiled CLI lives below the package root, while source/test execution
 * can add one more directory level. Keep the lookup aligned with the banner
 * and CLI version lookup so ENVIRONMENT reports the package actually running.
 */
export function getTestifyVersion(): string {
  const packageFiles = [
    new URL('../package.json', import.meta.url),
    new URL('../../package.json', import.meta.url),
  ];
  const packageFile = packageFiles.find((candidate) => fs.existsSync(candidate));
  try {
    if (!packageFile) throw new Error('Testify package.json was not found');
    const manifest = JSON.parse(fs.readFileSync(packageFile, 'utf8')) as { version?: string };
    if (!manifest.version) throw new Error('Testify package.json has no version');
    return `v${manifest.version}`;
  } catch (error) {
    if (!warned) {
      warned = true;
      logger.warn(`Unable to determine Testify version: ${error instanceof Error ? error.message : String(error)}`);
    }
    return 'unknown';
  }
}
