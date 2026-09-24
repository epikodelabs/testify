import fs from 'fs';

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
  if (!packageFile) return 'unknown';

  try {
    const manifest = JSON.parse(fs.readFileSync(packageFile, 'utf8')) as { version?: string };
    return manifest.version ? `v${manifest.version}` : 'unknown';
  } catch (_error) {
    return 'unknown';
  }
}
