import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainPackage = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
);

const distRoot = path.join(__dirname, 'dist/testify');

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
  bin: {
    "jasmine": "bin/jasmine",
    "testify": "bin/testify"
  },
  files: [
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    'esm-loader.mjs',
    'package.json',
    'postinstall.mjs',
    'assets/',
    'bin/',
    'lib/',
    'node_modules/'
  ],
  scripts: {
    "postinstall": "node postinstall.mjs"
  },
  keywords: mainPackage.keywords || [],
  author: mainPackage.author,
  license: mainPackage.license,
  dependencies: mainPackage.dependencies || {},
  bundleDependencies: Object.keys(mainPackage.dependencies || {}),
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
  path.join(__dirname, 'postinstall.script'),
  path.join(distRoot, 'postinstall.mjs')
);

copyFile(
  path.join(__dirname, 'assets/favicon.ico'),
  path.join(distRoot, 'assets/favicon.ico')
);
