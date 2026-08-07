import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const buildFilePath = fileURLToPath(import.meta.url);
const buildDirectory = path.dirname(buildFilePath);

const mainPackage = JSON.parse(
  fs.readFileSync(path.join(buildDirectory, 'package.json'), 'utf8')
);

const distRoot = path.join(buildDirectory, 'dist/testify');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyFile(from, to) {
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
}

const distPackage = {
  name: mainPackage.name,
  version: mainPackage.version,
  description: mainPackage.description,
  type: "module",
  exports: mainPackage.exports || undefined,
  bin: {
    "jasmine": "bin/jasmine",
    "testify": "bin/testify"
  },
  files: [
    'README.md',
    'CHANGELOG.md',
    'MIGRATION-V2.md',
    'LICENSE',
    'package.json',
    'assets/',
    'bin/',
    'lib/',
  ],
  keywords: mainPackage.keywords || [],
  author: mainPackage.author,
  license: mainPackage.license,
  engines: mainPackage.engines || undefined,
  dependencies: mainPackage.dependencies || {},
  peerDependencies: mainPackage.peerDependencies || {},
  overrides: mainPackage.overrides || {},
  testifySetup: {
    jasmineTypesVersion: mainPackage.devDependencies?.['@types/jasmine']
  }
};

fs.writeFileSync(
  path.join(distRoot, 'package.json'),
  JSON.stringify(distPackage, null, 2)
);


copyFile(
  path.join(buildDirectory, 'assets/favicon.ico'),
  path.join(distRoot, 'assets/favicon.ico')
);