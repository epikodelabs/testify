import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { norm } from './utils';

const packageRequire =
  createRequire(import.meta.url);

const JASMINE_ASSET_ROUTE_PREFIX =
  '/__testify/jasmine';

export interface JasmineBrowserAssets {
  assetDir: string | null;
  cssUrl: string;
  jasmineScriptUrl: string;
  jasmineHtmlScriptUrl: string;
  bootScriptUrls: string[];
  primaryBootScriptUrl: string;
}

export function resolveJasmineBrowserAssetDir():
  string | null {
  const lookupPaths =
    packageRequire.resolve.paths('jasmine-core') ?? [];

  for (const lookupPath of lookupPaths) {
    const assetDir = path.join(
      lookupPath,
      'jasmine-core',
      'lib',
      'jasmine-core',
    );
    const stats = fs.statSync(
      assetDir,
      { throwIfNoEntry: false },
    );

    if (stats?.isDirectory()) {
      return norm(assetDir);
    }
  }

  return null;
}

function routeForAsset(
  fileName: string,
): string {
  return `${JASMINE_ASSET_ROUTE_PREFIX}/${fileName}`;
}

function detectBootScriptNames(
  assetDir: string | null,
): string[] {
  if (!assetDir) {
    return ['boot.js'];
  }

  const boot0Path =
    path.join(
      assetDir,
      'boot0.js',
    );
  const boot1Path =
    path.join(
      assetDir,
      'boot1.js',
    );

  if (
    fs.existsSync(boot0Path) &&
    fs.existsSync(boot1Path)
  ) {
    return [
      'boot0.js',
      'boot1.js',
    ];
  }

  if (
    fs.existsSync(
      path.join(assetDir, 'boot.js'),
    )
  ) {
    return ['boot.js'];
  }

  return ['boot.js'];
}

export function getJasmineBrowserAssets():
  JasmineBrowserAssets {
  const assetDir =
    resolveJasmineBrowserAssetDir();
  const bootScriptNames =
    detectBootScriptNames(assetDir);

  return {
    assetDir,
    cssUrl: routeForAsset('jasmine.css'),
    jasmineScriptUrl:
      routeForAsset('jasmine.js'),
    jasmineHtmlScriptUrl:
      routeForAsset(
        'jasmine-html.js',
      ),
    bootScriptUrls:
      bootScriptNames.map(
        routeForAsset,
      ),
    primaryBootScriptUrl:
      routeForAsset(
        bootScriptNames[0] ??
          'boot.js',
      ),
  };
}