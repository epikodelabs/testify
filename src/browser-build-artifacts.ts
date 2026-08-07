import * as fs from 'fs';
import * as path from 'path';
import { norm } from './utils';

export interface BrowserBuildArtifacts {
  outDir: string;
  files: string[];
  specFiles: string[];
}

export function discoverBrowserBuildArtifacts(
  outDir: string,
): BrowserBuildArtifacts {
  const normalizedOutDir = norm(outDir);

  if (!fs.existsSync(normalizedOutDir)) {
    return {
      outDir: normalizedOutDir,
      files: [],
      specFiles: [],
    };
  }

  const files = fs
    .readdirSync(normalizedOutDir)
    .filter(
      (file) =>
        /\.(?:js|mjs)$/i.test(file),
    )
    .sort();

  return {
    outDir: normalizedOutDir,
    files,
    specFiles: files.filter(
      (file) =>
        /\.spec\.(?:js|mjs)$/i.test(file),
    ),
  };
}

export function getBrowserArtifactPath(
  artifacts: BrowserBuildArtifacts,
  file: string,
): string {
  return norm(
    path.join(
      artifacts.outDir,
      file,
    ),
  );
}
