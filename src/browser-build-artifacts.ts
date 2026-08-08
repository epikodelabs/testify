import * as fs from 'fs';
import * as path from 'path';
import { norm } from './utils';

export function isBuiltJavaScriptModule(
  filePath: string,
): boolean {
  return /\.mjs$/i.test(filePath);
}

export function isBuiltSpecModule(
  filePath: string,
): boolean {
  return /\.spec(?:[.-][^/]*)?\.mjs$/i.test(
    filePath,
  );
}

export function discoverBrowserBuildArtifacts(
  outDir: string,
): {
  files: string[];
  specFiles: string[];
} {
  const root = path.resolve(outDir);
  const files: string[] = [];

  if (!fs.existsSync(root)) {
    return {
      files,
      specFiles: [],
    };
  }

  const visit = (dirPath: string) => {
    for (const entry of fs.readdirSync(dirPath, {
      withFileTypes: true,
    })) {
      const fullPath = path.join(
        dirPath,
        entry.name,
      );

      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (!isBuiltJavaScriptModule(fullPath)) {
        continue;
      }

      files.push(
        norm(
          path.relative(root, fullPath),
        ),
      );
    }
  };

  visit(root);
  files.sort();

  return {
    files,
    specFiles: files.filter(
      isBuiltSpecModule,
    ),
  };
}
