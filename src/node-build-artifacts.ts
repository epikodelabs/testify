import * as fs from 'fs';
import * as path from 'path';
import { norm } from './utils';

export interface NodeBuildArtifacts {
  outDir: string;
  files: string[];
  specFiles: string[];
  runnerFile: string;
}

export function discoverNodeBuildArtifacts(
  outDir: string,
  runnerFileName = 'test-runner.mjs',
): NodeBuildArtifacts {
  const normalizedOutDir = norm(outDir);

  if (!fs.existsSync(normalizedOutDir)) {
    return {
      outDir: normalizedOutDir,
      files: [],
      specFiles: [],
      runnerFile: norm(
        path.join(
          normalizedOutDir,
          runnerFileName,
        ),
      ),
    };
  }

  const files = fs
    .readdirSync(normalizedOutDir)
    .filter(
      (file) =>
        /\.mjs$/i.test(file),
    )
    .sort();

  return {
    outDir: normalizedOutDir,
    files,
    specFiles: files.filter(
      (file) =>
        /\.spec\.mjs$/i.test(file),
    ),
    runnerFile: norm(
      path.join(
        normalizedOutDir,
        runnerFileName,
      ),
    ),
  };
}
