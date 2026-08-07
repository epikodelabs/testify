This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
.github/
  workflows/
    build.yml
  CONTRIBUTING.md
  FUNDING.yml
assets/
  favicon.ico
src/
  ansi-constants.ts
  browser-bootstrap-runtime.ts
  browser-build-artifacts.spec.ts
  browser-build-artifacts.ts
  browser-hmr-client.ts
  browser-jasmine-runtime.ts
  browser-manager.ts
  browser-page-builder.spec.ts
  browser-page-builder.ts
  browser-page.ts
  browser-runtime.ts
  browser-static-bootstrap.ts
  browser-test-catalog.ts
  browser-websocket-runtime.ts
  catalog-query.spec.ts
  catalog-query.ts
  cli-handler.ts
  cli-result-adapter.spec.ts
  cli-result-adapter.ts
  compound-reporter.ts
  config-manager.ts
  console-reporter.ts
  coverage-report-generator.ts
  execution-plan.spec.ts
  execution-plan.ts
  execution-result.spec.ts
  execution-result.ts
  exit-codes.ts
  file-discovery-service.ts
  hmr-manager.ts
  host-adapter.ts
  html-generator.ts
  http-server-manager.ts
  index.ts
  istanbul-instrumenter.ts
  jasmine-console-reporter.ts
  jasmine-node-runtime.ts
  json-cleaner.ts
  legacy-api.ts
  lib.ts
  log-messages.ts
  logger.ts
  messages.ts
  node-build-artifacts.spec.ts
  node-build-artifacts.ts
  node-cli-runner.spec.ts
  node-cli-runner.ts
  node-execution-adapter.spec.ts
  node-execution-adapter.ts
  node-execution-result.spec.ts
  node-relative-resolver.spec.ts
  node-relative-resolver.ts
  node-runner-host-types.spec.ts
  node-runner-host.spec.ts
  node-runner-host.ts
  node-runner-module-source.spec.ts
  node-runner-module-source.ts
  node-test-runner-plan.spec.ts
  node-test-runner.ts
  package-resolver.ts
  package-v2-surface.spec.ts
  prelude-modules.ts
  process-lock.ts
  project-setup.spec.ts
  project-setup.ts
  public-api.ts
  runner-session.spec.ts
  runner-session.ts
  symbols.ts
  test-catalog-index.spec.ts
  test-catalog-index.ts
  test-catalog.spec.ts
  test-catalog.ts
  test-metadata-runtime.ts
  test-metadata.spec.ts
  test-metadata.ts
  test-search-index.spec.ts
  test-selection.spec.ts
  test-selection.ts
  ts-jasmine-cli.ts
  utils.ts
  v2-public.ts
  v2-surface.spec.ts
  v2.spec.ts
  v2.ts
  vite-config-builder.ts
  vite-jasmine-config.ts
  vite-jasmine-runner.ts
  websocket-manager.ts
types/
  istanbul-api.d.ts
.gitignore
build-package.js
CHANGELOG.md
LICENSE
package.json
README.md
tsconfig.json
vite.cli.config.ts
vite.lib.config.ts
vite.runner.config.ts
````

# Files

## File: .github/FUNDING.yml
````yaml
# These are supported funding model platforms
open_collective: epikodelabs
````

## File: src/compound-reporter.ts
````typescript
export interface Reporter {
  jasmineStarted(suiteInfo: any): void;
  suiteStarted(result: any): void;
  specStarted(result: any): void;
  specDone(result: any): void;
  suiteDone(result: any): void;
  jasmineDone(result: any): void;
}

export class CompoundReporter {
  private reporters: Reporter[];

  constructor(reporters: Reporter[] = []) {
    this.reporters = reporters;
  }

  addReporter(reporter: Reporter) {
    this.reporters.push(reporter);
  }

  userAgent(agentInfo: any, suites: any, specs: any) {
    this.reporters.forEach(r => (r as any)?.userAgent?.(agentInfo, suites, specs));  
  }

  jasmineStarted(suiteInfo: any) {
    this.reporters.forEach(r => r.jasmineStarted?.(suiteInfo));
  }

  suiteStarted(result: any) {
    this.reporters.forEach(r => r.suiteStarted?.(result));
  }

  specStarted(result: any) {
    this.reporters.forEach(r => r.specStarted?.(result));
  }

  specDone(result: any) {
    this.reporters.forEach(r => r.specDone?.(result));
  }

  suiteDone(result: any) {
    this.reporters.forEach(r => r.suiteDone?.(result));
  }

  jasmineDone(result: any) {
    this.reporters.forEach(r => r.jasmineDone?.(result));
  }

  testsAborted(message?: string) {
    this.reporters.forEach(r => (r as any)?.testsAborted?.(message));
  }
}
````

## File: types/istanbul-api.d.ts
````typescript
// types/istanbul-api.d.ts
declare module 'istanbul-api' {
  import { CoverageMap } from 'istanbul-lib-coverage';

  export interface Reporter {
    dir: string;
    addAll(reports: string[]): void;
    write(coverageMap: CoverageMap, includeAllSources?: boolean): void;
  }

  export function createReporter(): Reporter;
}
````

## File: .gitignore
````
dist
.idea/
.DS_Store
node_modules/
tags
sauce_connect.log
yarn.lock
.envrc
````

## File: LICENSE
````
MIT License

Copyright (c) 2026 Oleksii Shepel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "declaration": false,
    "outDir": "./dist/out-tsc",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "sourceMap": false,
    "types": ["node", "jasmine"],
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true
  },
  "include": ["**/*.ts"],
  "exclude": ["lib", "node_modules", "dist"]
}
````

## File: .github/workflows/build.yml
````yaml
name: build

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [22.x]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Clean node_modules and dist
        run: |
          rm -rf node_modules dist

      - name: Install dependencies
        run: npm i

      - name: Build testify
        run: npm run build
````

## File: src/browser-bootstrap-runtime.ts
````typescript
export interface BrowserBootstrapScriptOptions {
  preludeModules: string[];
}

export function getBrowserBootstrapScript(
  options: BrowserBootstrapScriptOptions,
): string {
  const { preludeModules } = options;

  return `
// Initialize everything after Jasmine is loaded
(function initAfterJasmine() {
  if (!window.jasmineRequire) {
    return setTimeout(initAfterJasmine, 10);
  }

  const script = document.createElement('script');
  script.src = '/node_modules/jasmine-core/lib/jasmine-core/boot0.js';

  script.onload = () => {
    const forwarder = new WebSocketEventForwarder();
    forwarder.connect();
    jasmine.getEnv().addReporter(forwarder);

    window.loadSpecs = async function(specFiles) {
      let attempts = 0;

      while (!window.HMRClient && attempts < 100) {
        await new Promise(
          (resolve) => setTimeout(resolve, 50),
        );
        attempts++;
      }

      if (!window.HMRClient) {
        console.error(
          '❌ HMRClient not available after waiting',
        );
        return;
      }

      console.log(
        'Loading prelude modules and spec files dynamically...',
      );

      try {
        for (const modulePath of ${JSON.stringify(preludeModules)}) {
          await import(modulePath);
        }

        for (const file of specFiles) {
          await withTestifyRegistrationScope(
            file,
            () => import('/' + file),
          );
        }

        console.log(
          'All prelude modules and specs loaded',
        );
      } catch (err) {
        console.error(
          'Failed to load specs:',
          err,
        );
      }
    };
  };

  script.onerror = (err) => {
    console.error(
      'Failed to load boot0.js:',
      err,
    );
  };

  document.head.appendChild(script);
})();
`;
}
````

## File: src/browser-build-artifacts.spec.ts
````typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  discoverBrowserBuildArtifacts,
} from './browser-build-artifacts';

describe('BrowserBuildArtifacts', () => {
  it('discovers JS output and spec artifacts', () => {
    const dir =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-artifacts-',
        ),
      );

    try {
      fs.writeFileSync(
        path.join(
          dir,
          'app.js',
        ),
        '',
      );

      fs.writeFileSync(
        path.join(
          dir,
          'forms.spec.js',
        ),
        '',
      );

      fs.writeFileSync(
        path.join(
          dir,
          'notes.txt',
        ),
        '',
      );

      const artifacts =
        discoverBrowserBuildArtifacts(
          dir,
        );

      expect(
        artifacts.files,
      ).toEqual([
        'app.js',
        'forms.spec.js',
      ]);

      expect(
        artifacts.specFiles,
      ).toEqual([
        'forms.spec.js',
      ]);
    } finally {
      fs.rmSync(
        dir,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });
});
````

## File: src/browser-build-artifacts.ts
````typescript
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
````

## File: src/browser-page-builder.spec.ts
````typescript
import { BrowserPageBuilder } from './browser-page-builder';
import type { ViteJasmineConfig } from './vite-jasmine-config';

describe('BrowserPageBuilder', () => {
  const config = {
    outDir: 'dist/.vite-jasmine-build',
    htmlOptions: {
      title: 'Testify',
      preludeModules: [],
    },
    jasmineConfig: {
      env: {
        random: false,
        seed: 0,
        stopSpecOnExpectationFailure: false,
      },
    },
  } as unknown as ViteJasmineConfig;

  it('passes static spec files into the static bootstrap', () => {
    const builder =
      new BrowserPageBuilder(config);

    const html = builder.buildStatic([
      'forms.spec.js',
      'binding.spec.mjs',
    ]);

    expect(html).toContain(
      'forms.spec.js',
    );
    expect(html).toContain(
      'binding.spec.mjs',
    );
  });

  it('uses the shared BrowserPage renderer for HMR mode', () => {
    const builder =
      new BrowserPageBuilder(config);

    const html = builder.buildHmr();

    expect(html).toContain(
      '<!DOCTYPE html>',
    );
    expect(html).toContain(
      'Jasmine Test Runner',
    );
  });
});
````

## File: src/browser-page-builder.ts
````typescript
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import { logger } from './logger';
import { HtmlMessages } from './log-messages';
import { resolveBrowserPreludeModules } from './prelude-modules';
import { createBrowserPage } from './browser-page';
import { getBrowserRuntimeScript } from './browser-runtime';
import { getBrowserJasmineRegistrationPatchScript } from './browser-jasmine-runtime';
import { getBrowserWebSocketReporterScript } from './browser-websocket-runtime';
import { getBrowserHmrClientScript } from './browser-hmr-client';
import { getBrowserBootstrapScript } from './browser-bootstrap-runtime';
import { getStaticBrowserBootstrapScript } from './browser-static-bootstrap';

export class BrowserPageBuilder {
  constructor(
    private readonly config: ViteJasmineConfig,
  ) {}

  buildStatic(specFiles: string[]): string {
    return createBrowserPage({
      title:
        this.config.htmlOptions?.title ||
        'Jasmine Test Runner',
      faviconTag: this.getFaviconTag(),
      inlineScripts: [
        getStaticBrowserBootstrapScript({
          preludeModules:
            this.getPreludeModules(),
          specFiles,
          runtimeScript:
            this.getRuntimeScript(),
        }),
      ],
    });
  }

  buildHmr(): string {
    return createBrowserPage({
      title:
        this.config.htmlOptions?.title ||
        'Jasmine Test Runner (HMR)',
      faviconTag: this.getFaviconTag(),
      inlineScripts: [
        getBrowserJasmineRegistrationPatchScript(),
        getBrowserWebSocketReporterScript(),
        getBrowserHmrClientScript(),
        getBrowserBootstrapScript({
          preludeModules:
            this.getPreludeModules(),
        }),
        this.getRuntimeScript(),
      ],
    });
  }

  private getPreludeModules(): string[] {
    return resolveBrowserPreludeModules(
      this.config,
    );
  }

  private getRuntimeScript(): string {
    return getBrowserRuntimeScript({
      stopOnSpecFailure:
        this.config.jasmineConfig?.env
          ?.stopSpecOnExpectationFailure ??
        false,
      initialSeed:
        (this.config.jasmineConfig?.env as any)
          ?.seed ?? 0,
      initialRandom:
        this.config.jasmineConfig?.env
          ?.random ?? false,
    });
  }

  private getFaviconTag(): string {
    const moduleFilePath = norm(
      fileURLToPath(import.meta.url),
    );
    const moduleDirectory = norm(
      path.dirname(moduleFilePath),
    );
    const faviconPath = path.resolve(
      moduleDirectory,
      '../assets/favicon.ico',
    );

    if (fs.existsSync(faviconPath)) {
      const faviconData =
        fs.readFileSync(faviconPath);
      const faviconBase64 =
        faviconData.toString('base64');

      return (
        '<link rel="icon" type="image/x-icon" ' +
        `href="data:image/x-icon;base64,${faviconBase64}">`
      );
    }

    logger.println(
      HtmlMessages.faviconNotFound(
        faviconPath,
      ),
    );

    return (
      '<link rel="icon" href="favicon.ico" ' +
      'type="image/x-icon" />'
    );
  }
}
````

## File: src/browser-static-bootstrap.ts
````typescript
export interface StaticBrowserBootstrapOptions {
  preludeModules: string[];
  specFiles: string[];
  runtimeScript?: string;
}

export function getStaticBrowserBootstrapScript(
  options: StaticBrowserBootstrapOptions,
): string {
  const {
    preludeModules,
    specFiles,
    runtimeScript = '',
  } = options;

  return `
(function bootstrapStaticTestify() {
  if (!window.jasmineRequire) {
    return setTimeout(
      bootstrapStaticTestify,
      10,
    );
  }

  const boot0 = document.createElement('script');
  boot0.src =
    '/node_modules/jasmine-core/lib/jasmine-core/boot0.js';

  boot0.onload = async () => {
    try {
      for (const modulePath of ${JSON.stringify([...preludeModules, ...specFiles.map(file => './' + file)])}) {
        await import(modulePath);
      }
    } catch (error) {
      console.error(
        'Failed to load static Testify modules:',
        error,
      );
    }
  };

  document.head.appendChild(boot0);
})();

${runtimeScript}
`;
}
````

## File: src/browser-websocket-runtime.ts
````typescript
export function getBrowserWebSocketReporterScript(): string {
    const seed = (this.config.jasmineConfig?.env as any)?.seed ?? 0;
    const random = (this.config.jasmineConfig?.env as any)?.random ?? false;
    
    return `
function WebSocketEventForwarder() {
  this.ws = null;
  this.connected = false;
  this.messageQueue = [];

  const self = this;

  this.connect = function () {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = protocol + '//' + window.location.host;

    self.ws = new WebSocket(wsUrl);

    self.ws.onopen = () => {
      self.connected = true;
      console.log('WebSocket connected to', wsUrl);

      self.send({
        type: 'userAgent',
        data: {
          userAgent: navigator.userAgent,
          appName: navigator.appName,
          appVersion: navigator.appVersion,
          platform: navigator.platform,
          vendor: navigator.vendor,
          language: navigator.language,
          languages: navigator.languages,
          orderedSuites: self.getOrderedSuites(${seed}, ${random}).map(suite => ({
            id: suite.id,
            description: suite.description,
            fullName: suite.getFullName ? suite.getFullName() : suite.description
          })),
          orderedSpecs: self.getOrderedSpecs(${seed}, ${random}).map(spec => ({
            id: spec.id,
            description: spec.description,
            fullName: spec.getFullName ? spec.getFullName() : spec.description
          }))
        },
        timestamp: Date.now()
      });

      while (self.messageQueue.length > 0) {
        const msg = self.messageQueue.shift();
        self.send(msg);
      }
    };

    self.ws.onclose = () => {
      self.connected = false;
      console.log('WebSocket disconnected');
      setTimeout(() => self.connect(), 1000);
    };

    self.ws.onerror = (err) => {
      self.connected = false;
      console.error('WebSocket error:', err);
    };

    self.ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        if (window.HMRClient && (message.type === 'hmr:connected' || message.type === 'hmr:update')) {
          await window.HMRClient.handleMessage(message);
        }
      } catch (err) {
        console.error('Failed to handle WebSocket message:', err);
      }
    };
  };

  this.send = function (msg) {
    if (self.connected && self.ws && self.ws.readyState === WebSocket.OPEN) {
      try {
        self.ws.send(JSON.stringify(msg));
      } catch (err) {
        console.error('Failed to send WebSocket message:', err);
      }
    } else {
      self.messageQueue.push(msg);
    }
  };

  this.getAllSpecs = function () {
    const allSpecs = [];
    function collect(suite) {
      suite.children.forEach((child) => {
        if (child.children && child.children.length > 0) {
          collect(child);
        } else {
          allSpecs.push(child);
        }
      });
    }
    
    const env = jasmine?.getEnv?.();
    if (env) collect(env.topSuite());
    return allSpecs;
  };

  this.getAllSuites = function () {
    const allSuites = [];
    function collect(suite) {
      allSuites.push(suite);
      suite.children.forEach((child) => {
        if (child.children && child.children.length > 0) {
          collect(child);
        }
      });
    }
    
    const env = jasmine?.getEnv?.();
    if (env) collect(env.topSuite());
    return allSuites;
  };

  this.getOrderedSpecs = function (seed, random) {
    const allSpecs = self.getAllSpecs();
    if (!random) return allSpecs;

    const OrderCtor = jasmine.Order;
    if (typeof OrderCtor === 'function') {
      try {
        const order = new OrderCtor({ random, seed });
        if (typeof order.sort === 'function') {
          return order.sort(allSpecs);
        }
      } catch (err) {
        console.error('Failed to create jasmine.Order:', err);
      }
    }
    return allSpecs;
  };

  this.getOrderedSuites = function (seed, random) {
    const allSuites = self.getAllSuites();
    if (!random) return allSuites;

    const OrderCtor = jasmine.Order;
    if (typeof OrderCtor === 'function') {
      try {
        const order = new OrderCtor({ random, seed });
        if (typeof order.sort === 'function') {
          return order.sort(allSuites);
        }
      } catch (err) {
        console.error('Failed to create jasmine.Order for suites:', err);
      }
    }
    return allSuites;
  };

  // Jasmine reporter hooks
  this.jasmineStarted = function (config) {
    let orderedSpecs = [];
    let orderedSuites = [];

    if (config.order) {
      const random = !!config.order.random;
      const seed = config.order.seed;
      orderedSpecs = self.getOrderedSpecs(seed, random);
      orderedSuites = self.getOrderedSuites(seed, random);
    }

    self.send({
      type: 'jasmineStarted',
      data: config,
      timestamp: Date.now()
    });
  };

  this.suiteStarted = function (suite) {
    self.send({
      type: 'suiteStarted',
      id: suite.id,
      description: suite.description,
      fullName: suite.fullName,
      timestamp: Date.now()
    });
  };

  this.specStarted = function (spec) {
    self.send({
      type: 'specStarted',
      id: spec.id,
      description: spec.description,
      fullName: spec.fullName,
      timestamp: Date.now()
    });
  };

  this.specDone = function (result) {
    self.send({
      type: 'specDone',
      ...result,
      timestamp: Date.now()
    });
  };

  this.suiteDone = function (suite) {
    self.send({
      type: 'suiteDone',
      id: suite.id,
      description: suite.description,
      fullName: suite.fullName,
      timestamp: Date.now()
    });
  };

  this.jasmineDone = function (result) {
    const coverage = globalThis.__coverage__;
    self.send({
      type: 'jasmineDone',
      ...result,
      coverage: coverage ? JSON.stringify(coverage) : null,
      timestamp: Date.now()
    });

    window.jasmineFinished = true;

    if (!window.HMRClient) {
      setTimeout(() => {
        if (self.ws) self.ws.close();
      }, 1000);
    }
  };
}
`;
  }
````

## File: src/catalog-query.spec.ts
````typescript
import {
  listCatalogFiles,
  listCatalogSuites,
  listCatalogTests,
} from './catalog-query';
import type {
  TestCatalog,
} from './test-catalog';

describe('Catalog query helpers', () => {
  const catalog: TestCatalog = {
    suites: [
      {
        id: 'suite1',
        description: 'Forms',
        fullName: 'Forms',
        file: 'forms.spec.js',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'one',
        fullName: 'Forms one',
        suiteId: 'suite1',
        file: 'forms.spec.js',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Forms two',
        suiteId: 'suite1',
        file: 'forms.spec.js',
      },
    ],
  };

  it('lists tests', () => {
    expect(
      listCatalogTests(catalog),
    ).toEqual([
      {
        suiteId: 'suite1',
        id: 'spec1',
        name: 'one',
        fullName: 'Forms one',
        file: 'forms.spec.js',
      },
      {
        suiteId: 'suite1',
        id: 'spec2',
        name: 'two',
        fullName: 'Forms two',
        file: 'forms.spec.js',
      },
    ]);
  });

  it('lists suites', () => {
    expect(
      listCatalogSuites(catalog),
    )[0].toEqual({
      parentSuiteId: '',
      id: 'suite1',
      name: 'Forms',
      fullName: 'Forms',
      file: 'forms.spec.js',
    });
  });

  it('groups files with spec counts', () => {
    expect(
      listCatalogFiles(catalog),
    ).toEqual([
      {
        file: 'forms.spec.js',
        specs: 2,
      },
    ]);
  });
});
````

## File: src/catalog-query.ts
````typescript
import type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';

export interface TestListRow {
  suiteId: string;
  id: string;
  name: string;
  fullName: string;
  file: string;
}

export interface SuiteListRow {
  parentSuiteId: string;
  id: string;
  name: string;
  fullName: string;
  file: string;
}

export interface FileListRow {
  file: string;
  specs: number;
}

export function listCatalogTests(
  catalog: TestCatalog,
): TestListRow[] {
  return catalog.specs.map(
    (spec) => ({
      suiteId: spec.suiteId ?? '',
      id: spec.id,
      name: spec.description,
      fullName: spec.fullName,
      file: spec.file ?? '',
    }),
  );
}

export function listCatalogSuites(
  catalog: TestCatalog,
): SuiteListRow[] {
  return catalog.suites.map(
    (suite) => ({
      parentSuiteId:
        suite.parentSuiteId ?? '',
      id: suite.id,
      name: suite.description,
      fullName: suite.fullName,
      file: suite.file ?? '',
    }),
  );
}

export function listCatalogFiles(
  catalog: TestCatalog,
): FileListRow[] {
  const counts =
    new Map<string, number>();

  for (const spec of catalog.specs) {
    if (!spec.file) continue;

    counts.set(
      spec.file,
      (counts.get(spec.file) ?? 0) + 1,
    );
  }

  return [...counts.entries()]
    .sort(([a], [b]) =>
      a.localeCompare(b),
    )
    .map(
      ([file, specs]) => ({
        file,
        specs,
      }),
    );
}

export function orderCatalogRows<T extends {
  id?: string;
}>(
  rows: T[],
  orderIds: string[],
): T[] {
  const order =
    new Map(
      orderIds.map(
        (id, index) =>
          [id, index],
      ),
    );

  return [...rows].sort(
    (a, b) =>
      (order.get(a.id ?? '') ??
        Number.MAX_SAFE_INTEGER) -
      (order.get(b.id ?? '') ??
        Number.MAX_SAFE_INTEGER),
  );
}

export function getEmbeddedCatalogQuerySource():
  string {
  return [
    listCatalogTests,
    listCatalogSuites,
    listCatalogFiles,
    orderCatalogRows,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
````

## File: src/cli-result-adapter.spec.ts
````typescript
import {
  EXIT_CODES,
} from './exit-codes';
import {
  getExecutionExitCode,
} from './cli-result-adapter';

describe('CLI result adapter', () => {
  it('uses explicit exitCode when present', () => {
    expect(
      getExecutionExitCode({
        specResults: [],
        total: 0,
        passed: 0,
        failed: 0,
        pending: 0,
        exitCode: 9,
      }),
    ).toBe(9);
  });

  it('maps failures to test failure exit code', () => {
    expect(
      getExecutionExitCode({
        specResults: [],
        total: 1,
        passed: 0,
        failed: 1,
        pending: 0,
      }),
    ).toBe(
      EXIT_CODES.TEST_FAILURES,
    );
  });

  it('maps pending-only runs to pending exit code', () => {
    expect(
      getExecutionExitCode({
        specResults: [],
        total: 1,
        passed: 0,
        failed: 0,
        pending: 1,
      }),
    ).toBe(
      EXIT_CODES.SUCCESS_WITH_PENDING,
    );
  });

  it('maps clean runs to success', () => {
    expect(
      getExecutionExitCode({
        specResults: [],
        total: 1,
        passed: 1,
        failed: 0,
        pending: 0,
      }),
    ).toBe(
      EXIT_CODES.SUCCESS,
    );
  });
});
````

## File: src/cli-result-adapter.ts
````typescript
import { EXIT_CODES } from './exit-codes';
import type {
  ExecutionResult,
} from './execution-result';

export function getExecutionExitCode(
  result: ExecutionResult,
): number {
  if (
    typeof result.exitCode === 'number'
  ) {
    return result.exitCode;
  }

  if (result.failed > 0) {
    return EXIT_CODES.TEST_FAILURES;
  }

  if (result.pending > 0) {
    return EXIT_CODES.SUCCESS_WITH_PENDING;
  }

  return EXIT_CODES.SUCCESS;
}

export function applyExecutionExitCode(
  result: ExecutionResult,
): number {
  const exitCode =
    getExecutionExitCode(
      result,
    );

  process.exitCode =
    exitCode;

  return exitCode;
}
````

## File: src/execution-plan.spec.ts
````typescript
import {
  createExecutionPlan,
  createFileExecutionPlan,
  createSuiteExecutionPlan,
} from './execution-plan';
import type {
  TestCatalog,
} from './test-catalog';

describe('ExecutionPlan', () => {
  const catalog: TestCatalog = {
    suites: [
      {
        id: 'suite1',
        description: 'Forms',
        fullName: 'Forms',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'one',
        fullName: 'Forms one',
        suiteId: 'suite1',
        file: 'forms.spec.js',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Forms two',
        suiteId: 'suite1',
        file: 'forms.spec.js',
      },
    ],
  };

  it('creates an all-tests plan', () => {
    const plan =
      createExecutionPlan(catalog);

    expect(plan.specIds).toEqual([
      'spec1',
      'spec2',
    ]);
    expect(plan.source.kind).toBe(
      'all',
    );
  });

  it('creates a suite plan', () => {
    expect(
      createSuiteExecutionPlan(
        catalog,
        'suite1',
      ).specIds,
    ).toEqual([
      'spec1',
      'spec2',
    ]);
  });

  it('creates a file plan', () => {
    expect(
      createFileExecutionPlan(
        catalog,
        'forms.spec.js',
      ).specIds,
    ).toEqual([
      'spec1',
      'spec2',
    ]);
  });
});
````

## File: src/execution-plan.ts
````typescript
import type { TestCatalog } from './test-catalog';
import {
  resolveTestSelector,
  type TestSelector,
} from './test-selection';

export interface ExecutionPlan {
  specIds: string[];
  random: boolean;
  seed?: number;
  stopOnFailure?: boolean;
  source: {
    kind:
      | 'all'
      | 'spec'
      | 'suite'
      | 'file'
      | 'selector';
    selector?: TestSelector;
  };
}

export interface ExecutionPlanOptions {
  random?: boolean;
  seed?: number;
  stopOnFailure?: boolean;
}

export function createExecutionPlan(
  catalog: TestCatalog,
  selector?: TestSelector,
  options: ExecutionPlanOptions = {},
): ExecutionPlan {
  const specIds =
    selector === undefined
      ? catalog.specs.map(
          (spec) => spec.id,
        )
      : resolveTestSelector(
          catalog,
          selector,
        );

  return {
    specIds: [...new Set(specIds)],
    random: options.random ?? false,
    seed: options.seed,
    stopOnFailure:
      options.stopOnFailure,
    source: {
      kind:
        selector === undefined
          ? 'all'
          : inferSelectorKind(
              selector,
            ),
      selector,
    },
  };
}

export function createSpecExecutionPlan(
  catalog: TestCatalog,
  selector: string | RegExp,
  options: ExecutionPlanOptions = {},
): ExecutionPlan {
  return createExecutionPlan(
    catalog,
    { spec: selector },
    options,
  );
}

export function createSuiteExecutionPlan(
  catalog: TestCatalog,
  selector: string | RegExp,
  options: ExecutionPlanOptions = {},
): ExecutionPlan {
  return createExecutionPlan(
    catalog,
    { suite: selector },
    options,
  );
}

export function createFileExecutionPlan(
  catalog: TestCatalog,
  selector: string | RegExp,
  options: ExecutionPlanOptions = {},
): ExecutionPlan {
  return createExecutionPlan(
    catalog,
    { file: selector },
    options,
  );
}

function inferSelectorKind(
  selector: TestSelector,
):
  | 'spec'
  | 'suite'
  | 'file'
  | 'selector' {
  if (
    typeof selector === 'string' ||
    selector instanceof RegExp
  ) {
    return 'selector';
  }

  if (selector.spec) return 'spec';
  if (selector.suite) return 'suite';
  if (selector.file) return 'file';

  return 'selector';
}

export function getEmbeddedExecutionPlanSource():
  string {
  return [
    inferSelectorKind,
    createExecutionPlan,
    createSpecExecutionPlan,
    createSuiteExecutionPlan,
    createFileExecutionPlan,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
````

## File: src/execution-result.spec.ts
````typescript
import {
  summarizeExecutionResults,
} from './execution-result';

describe('ExecutionResult', () => {
  it('summarizes spec results', () => {
    const result =
      summarizeExecutionResults([
        {
          id: 'spec1',
          description: 'one',
          status: 'passed',
        },
        {
          id: 'spec2',
          description: 'two',
          status: 'failed',
        },
        {
          id: 'spec3',
          description: 'three',
          status: 'pending',
        },
      ]);

    expect(result.total).toBe(3);
    expect(result.passed).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.pending).toBe(1);
  });
});
````

## File: src/execution-result.ts
````typescript
export interface ExecutionSpecResult {
  id: string;
  description: string;
  fullName?: string;
  status:
    | 'passed'
    | 'failed'
    | 'pending'
    | 'excluded'
    | 'disabled'
    | 'incomplete'
    | string;
  duration?: number;
  failedExpectations?: unknown[];
  pendingReason?: string;
}

export interface ExecutionResult {
  specResults: ExecutionSpecResult[];
  total: number;
  passed: number;
  failed: number;
  pending: number;
  duration?: number;
  exitCode?: number;
}

export function summarizeExecutionResults(
  specResults: ExecutionSpecResult[],
  options: {
    duration?: number;
    exitCode?: number;
  } = {},
): ExecutionResult {
  let passed = 0;
  let failed = 0;
  let pending = 0;

  for (const result of specResults) {
    if (result.status === 'passed') {
      passed++;
    } else if (result.status === 'failed') {
      failed++;
    } else if (
      result.status === 'pending' ||
      result.status === 'excluded' ||
      result.status === 'disabled'
    ) {
      pending++;
    }
  }

  return {
    specResults,
    total: specResults.length,
    passed,
    failed,
    pending,
    duration: options.duration,
    exitCode: options.exitCode,
  };
}
````

## File: src/exit-codes.ts
````typescript
export const EXIT_CODES = {
  SUCCESS: 0,
  TEST_FAILURES: 1,
  INVALID_USAGE: 2,
  CONFIG_ERROR: 3,
  INTERNAL_ERROR: 4,
  SUCCESS_WITH_PENDING: 5,
  SIGINT: 130,
  SIGTERM: 143,
} as const;

export class ExitCodeError extends Error {
  constructor(
    public readonly exitCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ExitCodeError';
  }
}

export function getExitCode(error: unknown, fallback = EXIT_CODES.INTERNAL_ERROR): number {
  if (error instanceof ExitCodeError) {
    return error.exitCode;
  }
  return fallback;
}

export function getSignalExitCode(signal?: NodeJS.Signals | null): number {
  switch (signal) {
    case 'SIGINT':
      return EXIT_CODES.SIGINT;
    case 'SIGTERM':
      return EXIT_CODES.SIGTERM;
    default:
      return EXIT_CODES.INTERNAL_ERROR;
  }
}
````

## File: src/istanbul-instrumenter.ts
````typescript
import { ViteJasmineConfig } from "./vite-jasmine-config";
import * as fs from "fs";
import path from "path";
import { createInstrumenter } from "istanbul-lib-instrument";

export interface InstrumenterOptions {
  filename: string;
  source: string;
  sourceMap: any;
}

export interface InstrumentationResult {
  code: string;
  sourceMap?: any;
}

export class IstanbulInstrumenter {
  private config: ViteJasmineConfig;

  constructor(config: ViteJasmineConfig) {
    this.config = config;
  }

  async instrument({ filename, source, sourceMap }: InstrumenterOptions): Promise<InstrumentationResult> {
    // Only instrument if coverage is enabled
    if (!this.config.coverage) return { code: source };

    // Skip test files (*.spec.js or *.spec.map.js)
    if (/\.spec(\.map)?\.js$/i.test(filename)) return { code: source };

    // Ensure only JS files are instrumented
    if (!filename.endsWith(".js")) return { code: source };

    // Create a fresh instrumenter for each file to avoid internal state mutation
    // (coverage variable counters accumulating across files/spec files)
    const instrumenter = createInstrumenter({
      coverageVariable: "__coverage__",
      produceSourceMap: true,
    });

    // Instrument with Istanbul, preserving original source map if provided
    const instrumentedCode = instrumenter.instrumentSync(source, filename, sourceMap);

    return { code: instrumentedCode };
  }

  /**
   * Convenience method: read file and instrument it, automatically using existing source map if available
   */
  async instrumentFile(filePath: string): Promise<InstrumentationResult> {
    const source = fs.readFileSync(filePath, "utf-8");

    // Check for existing source map
    const mapFile = filePath + ".map";
    let sourceMap;
    if (fs.existsSync(mapFile)) {
      sourceMap = JSON.parse(fs.readFileSync(mapFile, "utf-8"));
    }

    return this.instrument({ filename: filePath, source, sourceMap });
  }
}
````

## File: src/jasmine-console-reporter.ts
````typescript
export interface ConsoleReporterOptions {
  print?: (message: string) => void;
  showColors?: boolean;
  stackFilter?: (stack: string) => string;
  randomSeedReproductionCmd?: (seed: number | string) => string;
  alwaysListPendingSpecs?: boolean;
}

type FailureResult = {
  failedExpectations: Array<{ message: string; stack: string }>;
  passedExpectations?: Array<unknown>;
};

/**
 * A reporter that prints spec and suite results to the console.
 * A ConsoleReporter is installed by default.
 */
/**
 * A reporter that prints spec and suite results to the console.
 * A ConsoleReporter is installed by default.
 */
export class JasmineConsoleReporter implements jasmine.CustomReporter {
  private print: (message: string) => void = (message) => process.stdout.write(message);
  private showColors = true;
  private specCount = 0;
  private executableSpecCount = 0;
  private failureCount = 0;
  private failedSpecs: jasmine.SpecResult[] = [];
  private pendingSpecs: jasmine.SpecResult[] = [];
  private alwaysListPendingSpecs = true;
  private readonly ansi = {
    green: '\x1B[32m',
    red: '\x1B[31m',
    yellow: '\x1B[33m',
    none: '\x1B[0m',
  };
  private failedSuites: jasmine.SuiteResult[] = [];
  private stackFilter: (stack: string) => string = (stack) => stack;

  randomSeedReproductionCmd(seed: number | string) {
    return 'jasmine --random=true --seed=' + seed;
  }

  /**
   * Configures the reporter.
   */
  setOptions(options: ConsoleReporterOptions) {
    if (options.print) {
      this.print = options.print;
    }

    this.showColors = options.showColors ?? this.showColors;
    if (options.stackFilter) {
      this.stackFilter = options.stackFilter;
    }
    if (options.randomSeedReproductionCmd) {
      this.randomSeedReproductionCmd = options.randomSeedReproductionCmd;
    }

    if (options.alwaysListPendingSpecs !== undefined) {
      this.alwaysListPendingSpecs = options.alwaysListPendingSpecs;
    }
  }

  jasmineStarted(options: jasmine.JasmineStartedInfo) {
    this.specCount = 0;
    this.executableSpecCount = 0;
    this.failureCount = 0;
    this.failedSpecs = [];
    this.pendingSpecs = [];
    this.failedSuites = [];
    if (options?.order?.random) {
      this.print('Randomized with seed ' + options.order.seed);
      this.printNewline();
    }
    this.print('Started');
    this.printNewline();
  }

  jasmineDone(result: jasmine.JasmineDoneInfo) {
    if (result.failedExpectations) {
      this.failureCount += result.failedExpectations.length;
    }

    this.printNewline();
    this.printNewline();
    if (this.failedSpecs.length > 0) {
      this.print('Failures:');
    }
    for (let i = 0; i < this.failedSpecs.length; i++) {
      this.specFailureDetails(this.failedSpecs[i], i + 1);
    }

    for (let i = 0; i < this.failedSuites.length; i++) {
      this.suiteFailureDetails(this.failedSuites[i]);
    }

    if (result.failedExpectations?.length > 0) {
      this.suiteFailureDetails({
        fullName: 'top suite',
        failedExpectations: result.failedExpectations,
      });
    }

    if (this.alwaysListPendingSpecs || result.overallStatus === 'passed') {
      if (this.pendingSpecs.length > 0) {
        this.print('Pending:');
      }
      for (let i = 0; i < this.pendingSpecs.length; i++) {
        this.pendingSpecDetails(this.pendingSpecs[i], i + 1);
      }
    }

    if (this.specCount > 0) {
      this.printNewline();

      if (this.executableSpecCount !== this.specCount) {
        this.print(
          'Ran ' +
            this.executableSpecCount +
            ' of ' +
            this.specCount +
            this.plural(' spec', this.specCount),
        );
        this.printNewline();
      }
      let specCounts =
        this.executableSpecCount +
        ' ' +
        this.plural('spec', this.executableSpecCount) +
        ', ' +
        this.failureCount +
        ' ' +
        this.plural('failure', this.failureCount);

      if (this.pendingSpecs.length) {
        specCounts +=
          ', ' +
          this.pendingSpecs.length +
          ' pending ' +
          this.plural('spec', this.pendingSpecs.length);
      }

      this.print(specCounts);
    } else {
      this.print('No specs found');
    }

    this.printNewline();

    const seconds = result ? result.totalTime / 1000 : 0;
    this.print('Finished in ' + seconds + ' ' + this.plural('second', seconds));
    this.printNewline();

    if (result && result.overallStatus === 'incomplete') {
      this.print('Incomplete: ' + result.incompleteReason);
      this.printNewline();
    }

    if (result.order?.random) {
      this.print('Randomized with seed ' + result.order.seed);
      this.print(' (' + this.randomSeedReproductionCmd(result.order.seed) + ')');
      this.printNewline();
    }
  }

  specDone(result: jasmine.SpecResult) {
    this.specCount++;

    if (result.status == 'pending') {
      this.pendingSpecs.push(result);
      this.executableSpecCount++;
      this.print(this.colored('yellow', '*'));
      return;
    }

    if (result.status == 'passed') {
      this.executableSpecCount++;
      this.print(this.colored('green', '.'));
      return;
    }

    if (result.status == 'failed') {
      this.failureCount++;
      this.failedSpecs.push(result);
      this.executableSpecCount++;
      this.print(this.colored('red', 'F'));
    }
  }

  suiteDone(result: jasmine.SuiteResult) {
    if (result.failedExpectations && result.failedExpectations.length > 0) {
      this.failureCount++;
      this.failedSuites.push(result);
    }
  }

  reporterCapabilities = { parallel: true };

  private printNewline() {
    this.print('\n');
  }

  private colored(color: keyof JasmineConsoleReporter['ansi'], str: string) {
    return this.showColors ? this.ansi[color] + str + this.ansi.none : str;
  }

  private plural(str: string, count: number) {
    return count == 1 ? str : str + 's';
  }

  private repeat(thing: string, times: number) {
    return Array.from({ length: times }, () => thing);
  }

  private indent(str: string, spaces: number) {
    const lines = (str || '').split('\n');
    return lines.map((line) => this.repeat(' ', spaces).join('') + line).join('\n');
  }

  private specFailureDetails(result: jasmine.SpecResult, failedSpecNumber: number) {
    this.printNewline();
    this.print(failedSpecNumber + ') ');
    this.print(result.fullName);
    this.printFailedExpectations(result);

    if (result.debugLogs?.length) {
      this.printNewline();
      this.print(this.indent('Debug logs:', 2));
      this.printNewline();

      for (const entry of result.debugLogs) {
        this.print(this.indent(`${entry.timestamp}ms: ${entry.message}`, 4));
        this.printNewline();
      }
    }
  }

  private suiteFailureDetails(result: jasmine.SuiteResult | (FailureResult & { fullName: string })) {
    this.printNewline();
    this.print('Suite error: ' + result.fullName);
    this.printFailedExpectations(result);
  }

  private printFailedExpectations(result: FailureResult) {
    for (let i = 0; i < result.failedExpectations.length; i++) {
      const failedExpectation = result.failedExpectations[i];
      this.printNewline();
      this.print(this.indent('Message:', 2));
      this.printNewline();
      this.print(this.colored('red', this.indent(failedExpectation.message, 4)));
      this.printNewline();
      this.print(this.indent('Stack:', 2));
      this.printNewline();
      this.print(this.indent(this.stackFilter(failedExpectation.stack), 4));
    }

    // When failSpecWithNoExpectations = true and a spec fails because of no expectations found,
    // jasmine-core reports it as a failure with no message.
    //
    // Therefore we assume that when there are no failed or passed expectations,
    // the failure was because of our failSpecWithNoExpectations setting.
    //
    // Same logic is used by jasmine.HtmlReporter, see https://github.com/jasmine/jasmine/blob/main/src/html/HtmlReporter.js
    if (
      result.failedExpectations.length === 0 &&
      Array.isArray(result.passedExpectations) &&
      result.passedExpectations.length === 0
    ) {
      this.printNewline();
      this.print(this.indent('Message:', 2));
      this.printNewline();
      this.print(this.colored('red', this.indent('Spec has no expectations', 4)));
    }

    this.printNewline();
  }

  private pendingSpecDetails(result: jasmine.SpecResult, pendingSpecNumber: number) {
    this.printNewline();
    this.printNewline();
    this.print(pendingSpecNumber + ') ');
    this.print(result.fullName);
    this.printNewline();
    let pendingReason = 'No reason given';
    if (result.pendingReason && result.pendingReason !== '') {
      pendingReason = result.pendingReason;
    }
    this.print(this.indent(this.colored('yellow', pendingReason), 2));
    this.printNewline();
  }
}

export class AwaitableJasmineConsoleReporter extends JasmineConsoleReporter {
  private resolveComplete?: (result: jasmine.JasmineDoneInfo) => void;
  readonly complete: Promise<jasmine.JasmineDoneInfo>;

  constructor() {
    super();
    this.complete = new Promise<jasmine.JasmineDoneInfo>((resolve) => {
      this.resolveComplete = resolve;
    });
  }

  jasmineDone(result: jasmine.JasmineDoneInfo) {
    super.jasmineDone(result);
    this.resolveComplete?.(result);
  }
}
````

## File: src/json-cleaner.ts
````typescript
#!/usr/bin/env node
/**
 * Robust JSON Cleaner
 * Strips comments, trailing commas, and fixes common JSON issues
 * TypeScript implementation
 */

import * as fs from 'fs';
import * as path from 'path';

export interface JSONCleanerOptions {
  removeComments?: boolean;
  removeTrailingCommas?: boolean;
  normalizeWhitespace?: boolean;
  allowSingleQuotes?: boolean;
  preserveNewlines?: boolean;
  strict?: boolean;
}

interface ParseState {
  inString: boolean;
  stringChar: string | null;
}

export class JSONCleaner {
  private options: Required<JSONCleanerOptions>;

  constructor(options: JSONCleanerOptions = {}) {
    this.options = {
      removeComments: options.removeComments !== false,
      removeTrailingCommas: options.removeTrailingCommas !== false,
      normalizeWhitespace: options.normalizeWhitespace === true,
      allowSingleQuotes: options.allowSingleQuotes === true,
      preserveNewlines: options.preserveNewlines !== false,
      strict: options.strict === true
    };
  }

  /**
   * Clean JSON string by removing comments and fixing common issues
   */
  public clean(jsonString: string): string {
    if (typeof jsonString !== 'string') {
      throw new Error('Input must be a string');
    }

    let result = jsonString;

    // Step 1: Remove comments
    if (this.options.removeComments) {
      result = this.stripComments(result);
    }

    // Step 2: Remove trailing commas
    if (this.options.removeTrailingCommas) {
      result = this.removeTrailingCommas(result);
    }

    // Step 3: Convert single quotes to double quotes
    if (this.options.allowSingleQuotes) {
      result = this.normalizeSingleQuotes(result);
    }

    // Step 4: Normalize whitespace
    if (this.options.normalizeWhitespace) {
      result = this.normalizeWhitespace(result);
    }

    // Step 5: Validate if strict mode
    if (this.options.strict) {
      try {
        JSON.parse(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid JSON after cleaning: ${message}`);
      }
    }

    return result;
  }

  /**
   * Strip single-line and multi-line comments
   * More robust than simple regex - handles edge cases
   */
  private stripComments(str: string): string {
    let result = '';
    let i = 0;
    const state: ParseState = {
      inString: false,
      stringChar: null
    };

    while (i < str.length) {
      const char = str[i];
      const nextChar = str[i + 1];

      // Handle escape sequences atomically inside strings
      if (char === '\\' && state.inString) {
        const next = str[i + 1];
        if (next !== undefined) {
          result += char + next;
          i += 2;
        } else {
          result += char;
          i++;
        }
        continue;
      }

      // Track string boundaries
      if (char === '"' || char === "'") {
        if (!state.inString) {
          state.inString = true;
          state.stringChar = char;
          result += char;
        } else if (char === state.stringChar) {
          state.inString = false;
          state.stringChar = null;
          result += char;
        } else {
          result += char;
        }
        i++;
        continue;
      }

      // Skip comments only if not in string
      if (!state.inString) {
        // Single-line comment
        if (char === '/' && nextChar === '/') {
          i += 2;
          // Skip until end of line
          while (i < str.length && str[i] !== '\n' && str[i] !== '\r') {
            i++;
          }
          // Preserve the newline
          if (i < str.length && this.options.preserveNewlines) {
            result += str[i];
          }
          i++;
          continue;
        }

        // Multi-line comment
        if (char === '/' && nextChar === '*') {
          i += 2;
          let foundEnd = false;
          let newlineCount = 0;

          // Skip until end of comment
          while (i < str.length - 1) {
            if (str[i] === '\n') newlineCount++;

            if (str[i] === '*' && str[i + 1] === '/') {
              i += 2;
              foundEnd = true;
              break;
            }
            i++;
          }

          if (!foundEnd) {
            throw new Error('Unclosed multi-line comment');
          }

          // Preserve newlines within the comment area
          if (this.options.preserveNewlines && newlineCount > 0) {
            result += '\n'.repeat(Math.min(newlineCount, 2));
          }
          continue;
        }
      }

      // Regular character
      result += char;
      i++;
    }

    // Check for unclosed strings
    if (state.inString) {
      throw new Error('Unclosed string in JSON');
    }

    return result;
  }

  /**
   * Remove trailing commas before closing brackets/braces
   */
  private removeTrailingCommas(str: string): string {
    let result = '';
    let i = 0;
    const state: ParseState = {
      inString: false,
      stringChar: null
    };

    while (i < str.length) {
      const char = str[i];

      // Handle escape sequences atomically inside strings
      if (char === '\\' && state.inString) {
        const next = str[i + 1];
        if (next !== undefined) {
          result += char + next;
          i += 2;
        } else {
          result += char;
          i++;
        }
        continue;
      }

      // Track string boundaries
      if (char === '"' || char === "'") {
        if (!state.inString) {
          state.inString = true;
          state.stringChar = char;
        } else if (char === state.stringChar) {
          state.inString = false;
          state.stringChar = null;
        }
        result += char;
        i++;
        continue;
      }

      // Remove trailing commas only outside strings
      if (!state.inString && char === ',') {
        // Look ahead to find the next non-whitespace character
        let j = i + 1;
        while (j < str.length && /\s/.test(str[j])) {
          j++;
        }

        // If next non-whitespace is ] or }, skip the comma
        if (j < str.length && (str[j] === ']' || str[j] === '}')) {
          // Skip the comma but preserve whitespace
          i++;
          continue;
        }
      }

      result += char;
      i++;
    }

    return result;
  }

  /**
   * Convert single quotes to double quotes (outside of strings)
   */
  private normalizeSingleQuotes(str: string): string {
    let result = '';
    let i = 0;
    const state: ParseState = {
      inString: false,
      stringChar: null
    };

    while (i < str.length) {
      const char = str[i];

      // Handle escape sequences atomically inside strings
      if (char === '\\' && state.inString) {
        const next = str[i + 1];
        if (next !== undefined) {
          result += char + next;
          i += 2;
        } else {
          result += char;
          i++;
        }
        continue;
      }

      if (char === '"' || char === "'") {
        if (!state.inString) {
          state.inString = true;
          state.stringChar = char;
          result += '"'; // Always use double quotes
        } else if (char === state.stringChar) {
          state.inString = false;
          state.stringChar = null;
          result += '"'; // Always use double quotes
        } else {
          // Quote of different type inside string
          if (char === '"') {
            result += '\\"'; // Escape double quotes inside single-quoted string
          } else {
            result += char;
          }
        }
        i++;
        continue;
      }

      result += char;
      i++;
    }

    return result;
  }

  /**
   * Normalize whitespace
   */
  private normalizeWhitespace(str: string): string {
    // Remove leading/trailing whitespace from each line
    return str.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }

  /**
   * Parse JSON string with automatic cleaning
   */
  public parse<T = any>(jsonString: string): T {
    const cleaned = this.clean(jsonString);
    return JSON.parse(cleaned) as T;
  }

  /**
   * Read and clean JSON file
   */
  public readFile(filePath: string, encoding: BufferEncoding = 'utf8'): string {
    const content = fs.readFileSync(filePath, encoding);
    return this.clean(content);
  }

  /**
   * Read, clean, and parse JSON file
   */
  public parseFile<T = any>(filePath: string, encoding: BufferEncoding = 'utf8'): T {
    const cleaned = this.readFile(filePath, encoding);
    return JSON.parse(cleaned) as T;
  }

  /**
   * Clean and write JSON file
   */
  public writeFile(filePath: string, jsonString: string, encoding: BufferEncoding = 'utf8'): void {
    const cleaned = this.clean(jsonString);
    fs.writeFileSync(filePath, cleaned, encoding);
  }

  /**
   * Clean and prettify JSON file
   */
  public prettifyFile(inputPath: string, outputPath: string | null = null, indent: number = 2): void {
    const parsed = this.parseFile(inputPath);
    const prettified = JSON.stringify(parsed, null, indent);
    const targetPath = outputPath || inputPath;
    fs.writeFileSync(targetPath, prettified, 'utf8');
  }
}

// CLI Interface
interface CLIOptions extends JSONCleanerOptions {
  prettify?: boolean;
  indent?: number;
}

function parseArgs(args: string[]): { files: string[]; options: CLIOptions } {
  const options: CLIOptions = {
    removeComments: !args.includes('--no-comments'),
    removeTrailingCommas: !args.includes('--no-trailing-commas'),
    normalizeWhitespace: args.includes('--normalize-ws'),
    allowSingleQuotes: args.includes('--single-quotes'),
    strict: args.includes('--strict'),
    prettify: args.includes('--prettify'),
    indent: 2
  };

  // Parse indent value
  const indentArg = args.find(arg => arg.startsWith('--indent'));
  if (indentArg) {
    const match = indentArg.match(/--indent[=:]?(\d+)/);
    if (match && match[1]) {
      options.indent = parseInt(match[1], 10);
    }
  }

  const files = args.filter(arg => !arg.startsWith('--'));

  return { files, options };
}

// Export for use as module
export default JSONCleaner;
````

## File: src/legacy-api.ts
````typescript
/**
 * Compatibility-only APIs retained for migration from Testify 1.x.
 *
 * New code should prefer RunnerSession.
 */

/**
 * @deprecated Use RunnerSession.run(), runSpec(), runSuite(), or runFile().
 */
export type LegacyRunTests = (
  ...args: unknown[]
) => Promise<unknown>;

/**
 * @deprecated Use RunnerSession.listTests().
 */
export type LegacyGetAllSpecs = () => unknown[];

/**
 * @deprecated Use RunnerSession.listSuites().
 */
export type LegacyGetAllSuites = () => unknown[];
````

## File: src/messages.ts
````typescript
export interface LogMessageTemplate {
    type: 'error' | 'warning' | 'info' | 'debug'; // New property to semantically categorize messages
    icon?: string;
    text: (...args: any[]) => string;
}

export const LOG_MESSAGES = {
    // =================================================================
    // General / CLI
    // =================================================================
    
    startingExclusive: {
        type: 'info',
        icon: '⚡',
        text: () => '[⚡] Exclusive mode: Terminating existing instances...',
    },
    runningInProjectScope: {
        type: 'info',
        icon: '📁',
        text: (projectName: string, path: string) => `[📁] Running tests for project "${projectName}" in: ${path}`,
    },
    projectNotFound: {
        type: 'error',
        icon: '❌',
        text: (projectName: string) => `[error] Project "${projectName}" not found in tsconfig.json or workspace definitions.`,
    },
    invalidExitCode: {
        type: 'warning',
        icon: '⚠️',
        text: (code: number) => `[warning] Exiting with an unusual code: ${code}.`,
    },
    
    // =================================================================
    // Browser Lifecycle (BrowserManager)
    // =================================================================
    
    browserManagerCleanup: {
        type: 'debug',
        icon: '🧹',
        text: () => '[debug] BrowserManager: Cleaning up browser processes.',
    },
    browserProcessTerminated: {
        type: 'debug',
        icon: '✔️',
        text: (pid: number) => `[debug] BrowserManager: Terminated process with PID: ${pid}.`,
    },
    browserCleanupFailed: {
        type: 'warning',
        icon: '⚠️',
        text: (pid: number, error: string) => `[warning] BrowserManager: Failed to terminate process ${pid}. Reason: ${error}`,
    },
    headlessModeImplied: {
        type: 'info',
        icon: 'ℹ️',
        text: () => '[ℹ️] Using --browser node implies --headless. Running in headless mode.',
    },

    // =================================================================
    // Test Runner (NodeTestRunner)
    // =================================================================
    
    noJsFilesForRunner: {
        type: 'warning',
        icon: '⚠️',
        text: () => '[warning] No JS files found for test runner generation.',
    },
    generatedInProcessRunner: {
        type: 'info',
        icon: '🤖',
        text: (runnerPath: string) => `[robot] Generated in-process test runner: ${runnerPath}`,
    },
    startingTestRunner: {
        type: 'info',
        icon: '🚀',
        text: () => '[rocket] Starting test runner in current process...',
    },
    runnerDoesNotExportRunTests: {
        type: 'warning',
        icon: '⚠️',
        text: () => '[warning] Test runner does not export a "runTests" function.',
    },
    testProcessAlreadyRunning: {
        type: 'warning',
        icon: '⚠️',
        text: () => '[warning] Test process already running.',
    },
    testExecutionError: {
        type: 'error',
        icon: '❌',
        text: (message: string) => `[error] Test execution error: ${message}`,
    },
    failedToRunTests: {
        type: 'error',
        icon: '❌',
        text: (error: string) => `[error] Failed to run tests: ${error}`,
    },
    errorDuringExecution: {
        type: 'error',
        icon: '❌',
        text: (error: string) => `[error] Error during test execution: ${error}`,
    },

    // =================================================================
    // Signal Handling & Interruptions
    // =================================================================
    
    caughtSignal: {
        type: 'info',
        icon: '⚙️',
        text: (signal: string) => `[gear] Caught ${signal}. Cleaning up...`,
    },
    abortingRun: {
        type: 'warning',
        icon: '🛑',
        text: () => '[warning] Test run aborted. Generating partial report...',
    },
    forceExiting: {
        type: 'warning',
        icon: '💥',
        text: () => '[warning] Double Ctrl+C detected. Forcing exit.',
    },
    unhandledRejection: {
        type: 'error',
        icon: '❌',
        text: (error: string) => `[error] Unhandled Rejection: ${error}`,
    },
    uncaughtException: {
        type: 'error',
        icon: '❌',
        text: (error: string) => `[error] Uncaught Exception: ${error}`,
    },
    
    // =================================================================
    // Watch Mode & HMR
    // =================================================================
    
    watchingFiles: {
        type: 'info',
        icon: '👀',
        text: () => '[👀] Watch mode enabled. Waiting for file changes...',
    },
    rebuildingDueToChange: {
        type: 'info',
        icon: '🔄',
        text: (filePath: string) => `[🔄] File change detected, rebuilding: ${filePath}`,
    },
    
    // =================================================================
    // Coverage
    // =================================================================
    
    remappingCoverage: {
        type: 'debug',
        icon: '🗺️',
        text: () => '[🗺️] Remapping coverage paths using source maps.',
    },
} as const;
````

## File: src/node-build-artifacts.spec.ts
````typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  discoverNodeBuildArtifacts,
} from './node-build-artifacts';

describe('NodeBuildArtifacts', () => {
  it('discovers node build files and specs', () => {
    const dir =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-node-artifacts-',
        ),
      );

    try {
      fs.writeFileSync(
        path.join(
          dir,
          'shared.js',
        ),
        '',
      );

      fs.writeFileSync(
        path.join(
          dir,
          'forms.spec.js',
        ),
        '',
      );

      fs.writeFileSync(
        path.join(
          dir,
          'notes.txt',
        ),
        '',
      );

      const artifacts =
        discoverNodeBuildArtifacts(
          dir,
        );

      expect(
        artifacts.files,
      ).toEqual([
        'forms.spec.js',
        'shared.js',
      ]);

      expect(
        artifacts.specFiles,
      ).toEqual([
        'forms.spec.js',
      ]);

      expect(
        artifacts.runnerFile,
      ).toContain(
        'test-runner.js',
      );
    } finally {
      fs.rmSync(
        dir,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });
});
````

## File: src/node-build-artifacts.ts
````typescript
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
  runnerFileName = 'test-runner.js',
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
    runnerFile: norm(
      path.join(
        normalizedOutDir,
        runnerFileName,
      ),
    ),
  };
}
````

## File: src/node-cli-runner.spec.ts
````typescript
import {
  getExecutionExitCode,
} from './cli-result-adapter';

describe('Node CLI result boundary', () => {
  it('keeps exit mapping outside runtime result creation', () => {
    const result = {
      specResults: [],
      total: 2,
      passed: 1,
      failed: 1,
      pending: 0,
    };

    expect(
      getExecutionExitCode(
        result,
      ),
    ).toBeGreaterThan(0);
  });
});
````

## File: src/node-cli-runner.ts
````typescript
import type {
  ExecutionResult,
} from './execution-result';
import {
  applyExecutionExitCode,
} from './cli-result-adapter';
import {
  NodeTestRunner,
} from './node-test-runner';

export async function runNodeCli(
  runner: NodeTestRunner,
): Promise<ExecutionResult> {
  const result =
    await runner.start();

  applyExecutionExitCode(
    result,
  );

  return result;
}
````

## File: src/node-execution-adapter.spec.ts
````typescript
import {
  executeNodePlan,
} from './node-execution-adapter';
import type {
  ExecutionPlan,
} from './execution-plan';

describe('NodeExecutionAdapter', () => {
  it('configures Jasmine from an execution plan', async () => {
    let configured:
      Record<string, unknown> | undefined;

    let executed = false;

    const env = {
      configure(
        options: Record<string, unknown>,
      ) {
        configured = options;
      },

      async execute() {
        executed = true;
      },
    };

    const plan: ExecutionPlan = {
      specIds: ['spec2'],
      random: true,
      seed: 123,
      stopOnFailure: true,
      source: {
        kind: 'spec',
      },
    };

    await executeNodePlan(
      env,
      plan,
    );

    expect(executed).toBeTrue();
    expect(configured?.random).toBeTrue();
    expect(configured?.seed).toBe(123);
    expect(
      configured?.stopOnSpecFailure,
    ).toBeTrue();

    const specFilter =
      configured?.specFilter as
        | ((spec: { id: string }) => boolean)
        | undefined;

    expect(
      specFilter?.({ id: 'spec2' }),
    ).toBeTrue();

    expect(
      specFilter?.({ id: 'spec1' }),
    ).toBeFalse();
  });
});
````

## File: src/node-execution-result.spec.ts
````typescript
import {
  executeNodePlan,
} from './node-execution-adapter';
import type {
  ExecutionPlan,
} from './execution-plan';

describe('Node execution results', () => {
  it('returns the same ExecutionResult shape as browser execution', async () => {
    let reporter:
      | {
          specDone?(
            result: any,
          ): void;
        }
      | undefined;

    const env = {
      configure() {},

      addReporter(value: any) {
        reporter = value;
      },

      async execute() {
        reporter?.specDone?.({
          id: 'spec1',
          description: 'one',
          status: 'passed',
        });

        reporter?.specDone?.({
          id: 'spec2',
          description: 'two',
          status: 'failed',
        });
      },
    };

    const plan: ExecutionPlan = {
      specIds: [
        'spec1',
        'spec2',
      ],
      random: false,
      source: {
        kind: 'all',
      },
    };

    const result =
      await executeNodePlan(
        env,
        plan,
      );

    expect(result.total).toBe(2);
    expect(result.passed).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.specResults)
      .toHaveSize(2);
  });
});
````

## File: src/node-relative-resolver.spec.ts
````typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import { resolveRelativePath } from './node-relative-resolver';

describe('node relative resolver', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-resolver-'));
    fs.mkdirSync(path.join(root, 'tests'), { recursive: true });
    fs.mkdirSync(path.join(root, 'lib'), { recursive: true });

    fs.writeFileSync(path.join(root, 'tests', 'example.spec.ts'), '');
    fs.writeFileSync(path.join(root, 'tests', 'helper.ts'), '');
    fs.writeFileSync(path.join(root, 'lib', 'bind-form.ts'), '');
    fs.writeFileSync(path.join(root, 'lib', 'index.ts'), '');
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('resolves extensionless relative TypeScript files', () => {
    const parent = path.join(root, 'tests', 'example.spec.ts');

    expect(resolveRelativePath('../lib/bind-form', parent)).toBe(
      path.join(root, 'lib', 'bind-form.ts'),
    );

    expect(resolveRelativePath('./helper', parent)).toBe(
      path.join(root, 'tests', 'helper.ts'),
    );
  });

  it('resolves directory imports to TypeScript index files', () => {
    const parent = path.join(root, 'tests', 'example.spec.ts');

    expect(resolveRelativePath('../lib', parent)).toBe(
      path.join(root, 'lib', 'index.ts'),
    );
  });

  it('does not take ownership of package imports', () => {
    const parent = path.join(root, 'tests', 'example.spec.ts');

    expect(resolveRelativePath('some-package', parent)).toBeNull();
  });
});
````

## File: src/node-runner-module-source.spec.ts
````typescript
import {
  createNodeRunnerModuleSource,
} from './node-runner-module-source';
import type {
  ViteJasmineConfig,
} from './vite-jasmine-config';

describe('Node runner module source', () => {
  it('generates a planned Node runner', () => {
    const source =
      createNodeRunnerModuleSource({
        jasmineCoreUrl:
          'file:///jasmine.js',
        imports:
          "        await import('./forms.spec.js');",
        config: {
          jasmineConfig: {
            env: {
              random: false,
              seed: 0,
              stopSpecOnExpectationFailure:
                false,
            },
          },
        } as unknown as ViteJasmineConfig,
      });

    expect(source).toContain(
      'createExecutionPlan(',
    );

    expect(source).toContain(
      'executeNodePlan(',
    );

    expect(source).toContain(
      "./forms.spec.js",
    );
  });
});
````

## File: src/node-test-runner-plan.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('NodeTestRunner execution-plan integration', () => {
  it('routes generated execution through ExecutionPlan', () => {
    const source = fs.readFileSync(
      path.resolve(
        process.cwd(),
        'src/node-test-runner.ts',
      ),
      'utf8',
    );

    expect(source).toContain(
      'createExecutionPlan(',
    );

    expect(source).toContain(
      'executeNodePlan(',
    );

    expect(source).not.toContain(
      'await jasmineEnv.execute();',
    );
  });
});
````

## File: src/package-resolver.ts
````typescript
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
````

## File: src/package-v2-surface.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('Testify v2 package surface', () => {
  it('publishes the temporary /v2 subpath', () => {
    const pkg = JSON.parse(
      fs.readFileSync(
        path.resolve(process.cwd(), 'package.json'),
        'utf8',
      ),
    );

    expect(pkg.exports['./v2']).toBe(
      './lib/v2.js',
    );
  });
});
````

## File: src/prelude-modules.ts
````typescript
import * as path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';

const packageRequire = createRequire(import.meta.url);

function isUrlSpecifier(specifier: string): boolean {
  return /^(?:[a-z]+:)?\/\//i.test(specifier);
}

export function getConfiguredPreludeModules(config: ViteJasmineConfig): string[] {
  const preludeModules = [...(config.htmlOptions?.preludeModules ?? [])];

  if (config.angularOptions?.enableJitCompiler) {
    preludeModules.unshift('@angular/compiler');
  }

  return preludeModules.filter(Boolean);
}

export function resolveBrowserPreludeModules(config: ViteJasmineConfig): string[] {
  return getConfiguredPreludeModules(config).map((specifier) =>
    resolveBrowserPreludeModuleSpecifier(specifier)
  );
}

function resolveBrowserPreludeModuleSpecifier(specifier: string): string {
  if (isUrlSpecifier(specifier)) {
    return specifier;
  }

  if (specifier.startsWith('/') || specifier.startsWith('./') || specifier.startsWith('../')) {
    return specifier;
  }

  let resolvedPath: string;
  try {
    resolvedPath = norm(packageRequire.resolve(specifier, { paths: [process.cwd()] }));
  } catch (error) {
    throw new Error(`Failed to resolve prelude module "${specifier}": ${(error as Error).message}`);
  }

  const nodeModulesMarker = '/node_modules/';
  const nodeModulesIndex = resolvedPath.lastIndexOf(nodeModulesMarker);
  if (nodeModulesIndex === -1) {
    throw new Error(
      `Prelude module "${specifier}" resolved outside node_modules and cannot be served to the browser: ${resolvedPath}`
    );
  }

  return resolvedPath.slice(nodeModulesIndex);
}

export function resolveNodePreludeModules(config: ViteJasmineConfig, outDir: string): string[] {
  return getConfiguredPreludeModules(config).map((specifier) =>
    resolveNodePreludeModuleSpecifier(specifier, outDir)
  );
}

function resolveNodePreludeModuleSpecifier(specifier: string, outDir: string): string {
  if (isUrlSpecifier(specifier)) {
    return specifier;
  }

  if (specifier.startsWith('/')) {
    return pathToFileURL(path.resolve(outDir, specifier.slice(1))).href;
  }

  if (path.isAbsolute(specifier)) {
    return pathToFileURL(specifier).href;
  }

  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    return pathToFileURL(path.resolve(outDir, specifier)).href;
  }

  let resolvedPath: string;
  try {
    resolvedPath = norm(packageRequire.resolve(specifier, { paths: [process.cwd()] }));
  } catch (error) {
    throw new Error(`Failed to resolve prelude module "${specifier}": ${(error as Error).message}`);
  }

  return pathToFileURL(resolvedPath).href;
}
````

## File: src/project-setup.spec.ts
````typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ProjectSetup } from './project-setup';

describe('ProjectSetup', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-setup-'));
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('adds jasmine when compilerOptions.types is explicitly constrained', () => {
    const tsconfigPath = path.join(root, 'tsconfig.json');
    fs.writeFileSync(
      tsconfigPath,
      JSON.stringify({ compilerOptions: { types: ['node'] } }, null, 2),
    );

    const result = ProjectSetup.configure(root);
    const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    expect(result.changed).toBeTrue();
    expect(config.compilerOptions.types).toEqual(['node', 'jasmine']);
  });

  it('creates compilerOptions.types with jasmine when the project has no explicit list', () => {
    const tsconfigPath = path.join(root, 'tsconfig.json');
    const initial = JSON.stringify({ compilerOptions: { strict: true } }, null, 2);
    fs.writeFileSync(tsconfigPath, initial);

    const result = ProjectSetup.configure(root);
    const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    expect(result.changed).toBeTrue();
    expect(config.compilerOptions.types).toEqual(['jasmine']);
  });

  it('creates compilerOptions and types when compilerOptions is missing entirely', () => {
    const tsconfigPath = path.join(root, 'tsconfig.json');
    fs.writeFileSync(tsconfigPath, JSON.stringify({ extends: './tsconfig.base.json' }, null, 2));

    const result = ProjectSetup.configure(root);
    const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    expect(result.changed).toBeTrue();
    expect(config.compilerOptions.types).toEqual(['jasmine']);
  });

  it('is idempotent when jasmine is already registered', () => {
    const tsconfigPath = path.join(root, 'tsconfig.json');
    fs.writeFileSync(
      tsconfigPath,
      JSON.stringify({ compilerOptions: { types: ['node', 'jasmine'] } }, null, 2),
    );

    const first = ProjectSetup.configure(root);
    const second = ProjectSetup.configure(root);
    const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    expect(first.changed).toBeFalse();
    expect(second.changed).toBeFalse();
    expect(config.compilerOptions.types).toEqual(['node', 'jasmine']);
  });
});
````

## File: src/project-setup.ts
````typescript
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
````

## File: src/public-api.ts
````typescript
export * from './lib';
````

## File: src/symbols.ts
````typescript
import { supportsEmoji, setAnsiMode as setAnsiModeConstant, isAnsiMode } from './ansi-constants';

// ─── TTY symbols (emojis & fancy unicode) ──────────────────
export const TTY_SYMBOLS: Record<string, string> = {
  check: '✅',
  cross: '❌',
  warn: '⚠️',
  info: 'ℹ️',
  globe: '🌐',
  doc: '📄',
  puzzle: '🧩',
  stop: '🛑',
  bulb: '💡',
  rocket: '🚀',
  hourglass: '⏳',
  circle_green: '🟢',
  plus: '➕',
  minus: '➖',
  folder: '📁',
  box: '📦',
  refresh: '🔄',
  broom: '🧹',
  lock: '🔒',
  fire: '🔥',
  satellite: '📡',
  ok: '👌',
  eyes: '👀',
  plug: '🔌',
  // Console reporter specific
  passed: '●',
  failed: '⨯',
  pending: '○',
  check_mark: '✓',
  cross_mark: '✕',
  arrow: '→',
  box_h: '─',
  box_double_h: '═',
  box_tl: '╔',
  box_tr: '╗',
  box_bl: '╚',
  box_br: '╝',
  box_v: '║',
  arrow_down_right: '↳',
  skip: '⤼',
  incomplete: '◷',
  not_run: '⊘',
};

// ─── ANSI symbols (plain ASCII text) ───────────────────────
export const ANSI_SYMBOLS: Record<string, string> = {
  check: '[OK]',
  cross: '[ERROR]',
  warn: '[WARN]',
  info: '[INFO]',
  globe: '[BROWSER]',
  doc: '[FILE]',
  puzzle: '[TREE]',
  stop: '[STOP]',
  bulb: '[TIP]',
  rocket: '[START]',
  hourglass: '[WAIT]',
  circle_green: '[READY]',
  plus: '[ADD]',
  minus: '[REM]',
  folder: '[DIR]',
  box: '[BUILD]',
  refresh: '[RETRY]',
  broom: '[CLEAN]',
  lock: '[LOCK]',
  fire: '[HMR]',
  satellite: '[WS]',
  ok: '[OK]',
  eyes: '[WATCH]',
  plug: '[CONN]',
  // Console reporter specific
  passed: '+',
  failed: 'x',
  pending: '*',
  check_mark: '[OK]',
  cross_mark: 'x',
  arrow: '->',
  box_h: '-',
  box_double_h: '=',
  box_tl: '+',
  box_tr: '+',
  box_bl: '+',
  box_br: '+',
  box_v: '|',
  arrow_down_right: '->',
  skip: '~',
  incomplete: 'o',
  not_run: '-',
};

export let SYMBOLS = supportsEmoji() ? TTY_SYMBOLS : ANSI_SYMBOLS;

export function setAnsiMode(): void {
  setAnsiModeConstant(true);
  SYMBOLS = ANSI_SYMBOLS;
}

const PLACEHOLDER_RE = /%([a-z_][a-z0-9_]*)%/g;

export function replacePlaceholders(message: string): string {
  return message.replace(PLACEHOLDER_RE, (match, key) => SYMBOLS[key] ?? match);
}
````

## File: src/test-catalog-index.spec.ts
````typescript
import {
  createTestCatalogIndex,
  getDescendantSuiteIdsFromIndex,
  getSpecIdsForSuitesFromIndex,
} from './test-catalog-index';
import type {
  TestCatalog,
} from './test-catalog';

describe('TestCatalogIndex', () => {
  const catalog: TestCatalog = {
    suites: [
      {
        id: 'suite1',
        description: 'Root',
        fullName: 'Root',
      },
      {
        id: 'suite2',
        description: 'Child',
        fullName: 'Root Child',
        parentSuiteId: 'suite1',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'one',
        fullName: 'Root one',
        suiteId: 'suite1',
        file: 'root.spec.js',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Root Child two',
        suiteId: 'suite2',
        file: 'child.spec.js',
      },
    ],
  };

  it('indexes specs, suites and files', () => {
    const index =
      createTestCatalogIndex(
        catalog,
      );

    expect(
      index.specById.get(
        'spec2',
      )?.description,
    ).toBe('two');

    expect(
      index.suiteById.get(
        'suite1',
      )?.description,
    ).toBe('Root');

    expect(
      index.specIdsByFile.get(
        'child.spec.js',
      ),
    ).toEqual([
      'spec2',
    ]);
  });

  it('finds descendant suites without scanning the full catalog repeatedly', () => {
    const index =
      createTestCatalogIndex(
        catalog,
      );

    expect(
      [
        ...getDescendantSuiteIdsFromIndex(
          index,
          ['suite1'],
        ),
      ],
    ).toEqual([
      'suite1',
      'suite2',
    ]);

    expect(
      getSpecIdsForSuitesFromIndex(
        index,
        ['suite1'],
      ),
    ).toEqual([
      'spec1',
      'spec2',
    ]);
  });
});
````

## File: src/test-search-index.spec.ts
````typescript
import {
  createTestCatalogIndex,
  searchIndexEntries,
} from './test-catalog-index';
import {
  findCatalogSpecs,
  findCatalogSuites,
  getSpecIdsForFiles,
} from './test-selection';
import type {
  TestCatalog,
} from './test-catalog';

describe('TestCatalog search index', () => {
  const catalog: TestCatalog = {
    suites: [
      {
        id: 'suite1',
        description: 'Membrane Forms',
        fullName: 'Membrane Forms',
        file: 'forms.spec.js',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'binds controls',
        fullName:
          'Membrane Forms binds controls',
        suiteId: 'suite1',
        file: 'forms.spec.js',
      },
      {
        id: 'spec2',
        description: 'measures snapshots',
        fullName:
          'Performance measures snapshots',
        file:
          'performance.spec.js',
      },
    ],
  };

  it('builds normalized search entries', () => {
    const index =
      createTestCatalogIndex(
        catalog,
      );

    expect(
      searchIndexEntries(
        index.specSearch,
        'BIND',
      ),
    ).toEqual([
      'spec1',
    ]);
  });

  it('searches specs without direct catalog filtering', () => {
    expect(
      findCatalogSpecs(
        catalog,
        'snapshots',
      ).map(
        (spec) => spec.id,
      ),
    ).toEqual([
      'spec2',
    ]);
  });

  it('searches suites case-insensitively', () => {
    expect(
      findCatalogSuites(
        catalog,
        'membrane',
      ).map(
        (suite) => suite.id,
      ),
    ).toEqual([
      'suite1',
    ]);
  });

  it('searches files through file index', () => {
    expect(
      getSpecIdsForFiles(
        catalog,
        /performance/i,
      ),
    ).toEqual([
      'spec2',
    ]);
  });
});
````

## File: src/utils.ts
````typescript
export const norm = (p: string) => p.replace(/\\/g, '/');
export const capitalize = (p?: string | null): string => {
  if (!p) return '';
  return p.charAt(0).toUpperCase() + p.slice(1);
};

export const ANSI_FULL_REGEX =
  /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;

export function visibleWidth(text: string): number {
  return [...text.replace(ANSI_FULL_REGEX, '')].length;
}

export type WrapMode = 'word' | 'char';

export function normalize(text: string): string {
  return text
    .replace(/\s*\r?\n\s*/g, '') // strip newlines and surrounding whitespace
    .replace(/[\uFEFF\xA0\t]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

interface DisplayUnit {
  value: string;
  visible: number;
  whitespace: boolean;
}

function splitAnsiTokens(text: string): string[] {
  const tokens: string[] = [];
  let lastIndex = 0;
  ANSI_FULL_REGEX.lastIndex = 0;

  for (let match = ANSI_FULL_REGEX.exec(text); match !== null; match = ANSI_FULL_REGEX.exec(text)) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    tokens.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens;
}

function isAnsiToken(token: string): boolean {
  return token.startsWith('\x1b');
}

export function wrapLine(
  text: string,
  width: number,
  indentation = 0,
  mode: WrapMode = 'char'
): string[] {
  const indent = ' '.repeat(indentation);
  // Simplified implementation for demonstration.
  // A more robust implementation would handle word wrapping with ANSI codes.
  return text.split('\n').map(line => indent + line);
}
````

## File: src/v2-public.ts
````typescript
export * from './v2';
````

## File: src/v2-surface.spec.ts
````typescript
import * as v2 from './v2';

describe('Testify v2 surface', () => {
  it('keeps generated runtime internals out of the public v2 namespace', () => {
    expect(
      (v2 as any)
        .getEmbeddedRunnerSessionSource,
    ).toBeUndefined();

    expect(
      (v2 as any)
        .getEmbeddedExecutionPlanSource,
    ).toBeUndefined();
  });

  it('exposes the intended runtime/query primitives', () => {
    expect(v2.RunnerSession)
      .toBeDefined();

    expect(v2.resolveTestSelector)
      .toBeDefined();

    expect(v2.createTestCatalogIndex)
      .toBeDefined();
  });
});
````

## File: src/v2.spec.ts
````typescript
import * as v2 from './v2';

describe('Testify v2 public surface', () => {
  it('exposes the core v2 primitives', () => {
    expect(v2.RunnerSession).toBeDefined();
    expect(v2.createExecutionPlan).toBeDefined();
    expect(v2.createTestCatalogIndex).toBeDefined();
    expect(v2.listCatalogTests).toBeDefined();
  });
});
````

## File: .github/CONTRIBUTING.md
````markdown
# Contributing to testify

## Bug reports

Bug reports are welcome, but please help us help you by:

* Searching for existing issues (including closed issues) that are similar to
  yours
* Reading the project documentation (if available)
* Providing enough information for someone else to to understand and reproduce
  the problem. In most cases that includes a clear description of what you're trying to do, the version of `testify` that you're using, the Node.js version, and a minimal but complete code sample that demonstrates the problem.

## Contributing documentation

We welcome efforts to improve testify's documentation. If the documentation is in a separate repository, please link it here.

## Contributing code

Contributions are welcome, but we don't say yes to every idea. We recommend
opening an issue to propose your idea before starting work, to reduce the risk
of getting a "no" at the pull request stage.

Don't have an idea of your own but want to help solve problems for other
people? That's great! Have a look at the list of
[issues tagged "help needed"](https://github.com/issues?q=is%3Aopen+is%3Aissue+org%3Aepikodelabs+repo%3Atestify+label%3A%22help+wanted%22).

### The nuts and bolts of preparing a pull request

`testify` is mature software that's downloaded millions of times a week and
supported by a tiny group of people in their free time. Anything that breaks
things for existing users or makes `testify` harder to maintain is a tough sell.

Before submitting a PR, please check that:

* You aren't introducing any breaking changes
* `npm test` succeeds: tests pass, there are no eslint or prettier errors,
   and the exit status is 0
* Your change is well tested: you're reasonably confident that the tests will
  fail if somebody breaks your new functionality in the future
* Your code matches the style of the surrounding code


We use CI to test pull requests against a variety of operating systems
and Node.js versions. Please check back after submitting your PR and make sure
that the build succeeded.
````

## File: src/browser-hmr-client.ts
````typescript
export function getBrowserHmrClientScript(): string {
    return `
// HMR Client Runtime
window.HMRClient = (function() {
  const moduleRegistry = new Map();
  
  function getEnv() {
    return window.jasmine?.getEnv?.();
  }

  function detachFilePathSuites(filePath) {
    const env = getEnv();
    if (!env) return;

    const topSuite = env.topSuite();
    if (!topSuite) return;

    const catalog =
      window.jasmine?.getCatalog?.() ??
      createTestCatalogFromJasmineEnv(env);

    const specIds = new Set(
      catalog.specs
        .filter(spec => spec.file === filePath)
        .map(spec => spec.id)
    );

    const suiteIds = new Set(
      catalog.suites
        .filter(suite => suite.file === filePath)
        .map(suite => suite.id)
    );

    function cleanSuite(suite) {
      if (!suite || !Array.isArray(suite.children)) return;

      const keep = [];

      for (const child of suite.children) {
        if (!child) continue;

        if (suiteIds.has(child.id) || specIds.has(child.id)) {
          continue;
        }

        if (Array.isArray(child.children)) {
          cleanSuite(child);
        }

        keep.push(child);
      }

      if (suite.removeChildren && suite.addChild) {
        suite.removeChildren();
        keep.forEach(item => suite.addChild(item));
      } else {
        suite.children = keep;
      }

      if (Array.isArray(suite.specs)) {
        suite.specs = suite.specs.filter(
          spec => !specIds.has(spec.id)
        );
      }
    }

    cleanSuite(topSuite);
    console.log(\`🧹 Detached catalog entries for file: \${filePath}\`);
  }

  async function hotUpdateSpec(filePath) {
    detachFilePathSuites(filePath);

    await withTestifyRegistrationScope(
      filePath,
      () => import('/' + filePath + \`?t=\${Date.now()}\`),
    );

    console.log('✅ Hot updated Jasmine registrations from:', filePath);
  }

  async function handleMessage(message) {
    if (message.type === 'hmr:connected') {
      console.log('🔥 HMR enabled on server');
      if (window.loadSpecs) {
        await window.loadSpecs(message.specFiles);
      }
      return;
    }

    if (message.type === 'hmr:update') {
      const update = message.data;
      if (!update) return;

      if (update.type === 'full-reload') {
        console.log('🔄 Full reload required');
        location.reload();
        return;
      }

      console.log('🔥 Hot updating:', update.path);

      try {
        let newModule = null;
        if (update.content) {
          newModule = await import('/' + update.path + \`?t=\${Date.now()}\`);
          moduleRegistry.set(update.path, newModule);
        }

        await hotUpdateSpec(update.path, newModule);
        console.log('✅ HMR update applied:', update.path);
      } catch (err) {
        console.error('❌ HMR update failed:', err);
        location.reload();
      }
    }
  }

  return {
    handleMessage,
    detachFilePathSuites,
    clearCache: (filePath) => {
      if (filePath) moduleRegistry.delete(filePath);
      else moduleRegistry.clear();
    }
  };
})();
`;
  }
````

## File: src/browser-jasmine-runtime.ts
````typescript
import { getEmbeddedTestMetadataSource } from './test-metadata-runtime';

export function getBrowserJasmineRegistrationPatchScript(): string {
  const metadataSource =
    getEmbeddedTestMetadataSource();

  return `
${metadataSource}

(function patchJasmineRegistrationCapture() {
  if (!window.jasmineRequire) {
    return setTimeout(patchJasmineRegistrationCapture, 10);
  }

  const root = window.jasmineRequire || jasmineRequire;
  const j$ = jasmineRequire.core(jasmineRequire);
  const OriginalSuiteFactory = jasmineRequire.Suite || j$.Suite || null;
  const OriginalSpecFactory = jasmineRequire.Spec || j$.Spec || null;

  if (OriginalSuiteFactory) {
    root.Suite = function(j$local) {
      const OriginalSuite = OriginalSuiteFactory(j$local);

      return class TestifySuite extends OriginalSuite {
        constructor(attrs) {
          super(attrs);
          captureTestifyRegistration(this);
        }
      };
    };
  }

  if (OriginalSpecFactory) {
    root.Spec = function(j$local) {
      const OriginalSpec = OriginalSpecFactory(j$local);

      return class TestifySpec extends OriginalSpec {
        constructor(attrs) {
          super(attrs);
          captureTestifyRegistration(this);
        }
      };
    };
  }
})();
`;
  }
````

## File: src/browser-page.ts
````typescript
export interface BrowserPage {
  title: string;
  faviconTag: string;
  headScripts?: string[];
  bodyHtml?: string;
  inlineScripts?: string[];
}

export function createBrowserPage(
  page: BrowserPage,
): string {
  const headScripts = (page.headScripts ?? [])
    .filter(Boolean)
    .join('\n');

  const inlineScripts = (page.inlineScripts ?? [])
    .filter(Boolean)
    .map((script) => `<script>\n${script}\n</script>`)
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${page.faviconTag}
  <title>${page.title}</title>
  <link rel="stylesheet" href="/node_modules/jasmine-core/lib/jasmine-core/jasmine.css">
  <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine.js"></script>
  <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js"></script>
  ${headScripts}
</head>
<body>
  ${page.bodyHtml ?? '<div class="jasmine_html-reporter"></div>'}
  ${inlineScripts}
</body>
</html>`;
}
````

## File: src/host-adapter.ts
````typescript
// host-adapter.ts
import { ChildProcess } from 'node:child_process';
import { logger } from './logger';
import { HostAdapterMessages } from './log-messages';

export class HostAdapter {
  private queue: Array<() => Promise<void>> = [];
  private isProcessing = false;

  constructor(private child: ChildProcess, private reporter: jasmine.CustomReporter) {
    this.bindListeners();
  }

  private bindListeners() {
    this.child.on('message', (msg: any) => {
      if (!msg || typeof msg !== 'object') return;

      const { type, data } = msg;

      // Push all work into queue
      this.queue.push(() => this.handleMessage(type, data));

      // Start queue processor if idle
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) continue;

      try {
        await task();
      } catch (err) {
        logger.error(HostAdapterMessages.ipcEventError((err as Error).message));
      }
    }

    this.isProcessing = false;
  }

  private async handleMessage(type: string, data: any) {
    switch (type) {
      case 'userAgent':
        await this.callReporter('userAgent', data);
        break;

      case 'ready':
        logger.println(HostAdapterMessages.childProcessReady());
        this.child.send({ type: 'hostReady', timestamp: Date.now() });
        break;

      case 'jasmineStarted':
        await this.callReporter('jasmineStarted', data);
        break;

      case 'suiteStarted':
        await this.callReporter('suiteStarted', data);
        break;

      case 'specStarted':
        await this.callReporter('specStarted', data);
        break;

      case 'specDone':
        await this.callReporter('specDone', data);
        break;

      case 'suiteDone':
        await this.callReporter('suiteDone', data);
        break;

      case 'jasmineDone':
        // merge coverage
        (globalThis as any).__coverage__ = data.coverage;
        await this.callReporter('jasmineDone', data.result);
        break;

      case 'testsAborted':
        await this.callReporter('testsAborted', data?.message);
        break;

      default:
        logger.println(HostAdapterMessages.unknownMessageType(type));
    }
  }

  private async callReporter(method: any, ...args: any) {
    const fn = (this.reporter as any)[method];
    if (!fn) return;

    // jasmine callbacks can be sync or async → normalize to Promise
    return Promise.resolve(fn.call(this.reporter, ...args));
  }
}
````

## File: src/index.ts
````typescript
import { fileURLToPath } from 'url';
import { CLIHandler } from './cli-handler';

export { BrowserManager } from './browser-manager';
export { CLIHandler } from './cli-handler';
export { Logger } from './logger';
export { ConfigManager } from './config-manager';
export { ConsoleReporter } from './console-reporter';
export { CompoundReporter } from './compound-reporter';
export { FileDiscoveryService } from './file-discovery-service';
export { HtmlGenerator } from './html-generator';
export { HttpServerManager } from './http-server-manager';
export { NodeTestRunner } from './node-test-runner';
export { WebSocketManager } from './websocket-manager';
export { IstanbulInstrumenter } from './istanbul-instrumenter'
export { HmrManager } from './hmr-manager';
export { EXIT_CODES, ExitCodeError, getExitCode, getSignalExitCode } from './exit-codes';
export { norm } from './utils';
export { ViteConfigBuilder } from './vite-config-builder';
export type { ViteJasmineConfig } from './vite-jasmine-config';
export { ViteJasmineRunner } from './vite-jasmine-runner';

// === CLI Entry Point ===
// @vite-ignore
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  CLIHandler.run().then((code) => process.exit(code)).catch(() => process.exit(1));
}
````

## File: src/node-relative-resolver.ts
````typescript
import fs from 'fs';
import path from 'path';
import { createRequire, registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'url';

const RELATIVE_SPECIFIER_RE = /^\.{1,2}(?:[\\/]|$)/;
const runtimeRequire = createRequire(import.meta.url);
const nodeModule = runtimeRequire('node:module') as any;
const ModuleCtor = nodeModule.Module ?? nodeModule;

export const RELATIVE_IMPORT_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
] as const;

function isFile(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function isDirectory(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function hasUrlSuffix(specifier: string): boolean {
  return specifier.includes('?') || specifier.includes('#');
}

/**
 * Resolve a local relative specifier using the same conveniences developers
 * typically get from TypeScript/Vite-style bundler resolution.
 *
 * Examples:
 *   ../lib           -> ../lib/index.ts
 *   ../lib/bind-form -> ../lib/bind-form.ts
 *   ./helper         -> ./helper.ts
 *
 * Returns an absolute filesystem path or null.
 */
export function resolveRelativePath(
  specifier: string,
  parentFile: string | undefined,
): string | null {
  if (!RELATIVE_SPECIFIER_RE.test(specifier)) return null;
  if (!parentFile) return null;
  if (hasUrlSuffix(specifier)) return null;

  const candidate = path.resolve(path.dirname(parentFile), specifier);

  if (isFile(candidate)) {
    return candidate;
  }

  if (path.extname(candidate) === '') {
    for (const extension of RELATIVE_IMPORT_EXTENSIONS) {
      const filePath = `${candidate}${extension}`;
      if (isFile(filePath)) {
        return filePath;
      }
    }
  }

  if (isDirectory(candidate)) {
    for (const extension of RELATIVE_IMPORT_EXTENSIONS) {
      const indexPath = path.join(candidate, `index${extension}`);
      if (isFile(indexPath)) {
        return indexPath;
      }
    }
  }

  return null;
}

/**
 * ESM-facing helper retained as a public/testing seam.
 */
export function resolveRelativeImport(
  specifier: string,
  parentURL?: string,
): string | null {
  if (!parentURL?.startsWith('file:')) return null;

  const resolved = resolveRelativePath(
    specifier,
    fileURLToPath(parentURL),
  );

  return resolved ? pathToFileURL(resolved).href : null;
}

/**
 * Install Testify's compatibility resolution in front of both Node module
 * systems used by tsx:
 *
 *  - ESM: node:module registerHooks()
 *  - CJS: Module._resolveFilename()
 *
 * IMPORTANT: register this AFTER tsx. tsx installs its own CJS resolver shim;
 * Testify must wrap that resolver rather than be overwritten by it.
 */
export function registerTestifyRelativeResolver(): () => void {
  const esmRegistration = registerHooks({
    resolve(specifier, context, nextResolve) {
      const resolved = resolveRelativeImport(specifier, context.parentURL);

      if (resolved) {
        // Feed a concrete URL back through the remaining chain so tsx can still
        // transpile TypeScript and apply any other loader behavior it owns.
        return nextResolve(resolved, context);
      }

      return nextResolve(specifier, context);
    },
  }) as { deregister?: () => void } | undefined;

  const previousResolveFilename = ModuleCtor._resolveFilename;

  const testifyResolveFilename = function (
    this: unknown,
    request: string,
    parent: { filename?: string } | undefined,
    isMain: boolean,
    options: unknown,
  ) {
    if (typeof request === 'string' && RELATIVE_SPECIFIER_RE.test(request)) {
      const resolved = resolveRelativePath(request, parent?.filename);

      if (resolved) {
        // Returning the concrete absolute path lets the tsx CJS extension hooks
        // load/transpile .ts/.tsx while avoiding Node's extensionless lookup.
        return resolved;
      }
    }

    return previousResolveFilename.call(
      this,
      request,
      parent,
      isMain,
      options,
    );
  };

  ModuleCtor._resolveFilename = testifyResolveFilename;

  return () => {
    if (ModuleCtor._resolveFilename === testifyResolveFilename) {
      ModuleCtor._resolveFilename = previousResolveFilename;
    }

    esmRegistration?.deregister?.();
  };
}
````

## File: src/node-runner-host-types.spec.ts
````typescript
import type {
  FileListRow,
  SuiteListRow,
  TestListRow,
} from './catalog-query';
import type {
  ExecutionResult,
} from './execution-result';
import {
  NodeRunnerHost,
} from './node-runner-host';

describe('NodeRunnerHost typed surfaces', () => {
  it('exposes typed query/result methods', () => {
    const host =
      new NodeRunnerHost(
        'test-runner.mjs',
      );

    const tests: TestListRow[] =
      host.listTests();

    const suites: SuiteListRow[] =
      host.listSuites();

    const files: FileListRow[] =
      host.listFiles();

    void tests;
    void suites;
    void files;
  });
});
````

## File: src/node-runner-host.spec.ts
````typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  NodeRunnerHost,
} from './node-runner-host';

describe('NodeRunnerHost', () => {
  it('writes, loads, and executes a generated runner module', async () => {
    const dir =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-node-host-',
        ),
      );

    try {
      const runnerFile =
        path.join(
          dir,
          'test-runner.mjs',
        );

      const host =
        new NodeRunnerHost(
          runnerFile,
        );

      host.write(`
        export async function runTests(
          reporter,
          selector
        ) {
          reporter.received = selector;
          return {
            specResults: [],
            total: 0,
            passed: 0,
            failed: 0,
            pending: 0,
            exitCode: 7,
          };
        }
      `);

      const reporter: any = {};

      const exitCode =
        await host.execute(
          reporter,
          {
            suite: 'suite1',
          },
        );

      expect(exitCode.exitCode).toBe(7);

      expect(
        reporter.received,
      ).toEqual({
        suite: 'suite1',
      });

      expect(
        host.loadedModule,
      ).not.toBeNull();

      host.clear();

      expect(
        host.loadedModule,
      ).toBeNull();
    } finally {
      fs.rmSync(
        dir,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });
});
````

## File: src/test-catalog-index.ts
````typescript
import type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';

export interface SearchIndexEntry {
  id: string;
  text: string;
}

export interface TestCatalogIndex {
  specById: Map<string, TestCatalogSpec>;
  suiteById: Map<string, TestCatalogSuite>;
  childSuiteIdsByParentId: Map<string, string[]>;
  specIdsBySuiteId: Map<string, string[]>;
  specIdsByFile: Map<string, string[]>;
  specSearch: SearchIndexEntry[];
  suiteSearch: SearchIndexEntry[];
  fileSearch: SearchIndexEntry[];
}

export function normalizeSearchText(
  ...values: Array<string | undefined>
): string {
  return values
    .filter(
      (value): value is string =>
        !!value,
    )
    .join('\n')
    .toLocaleLowerCase();
}

export function searchIndexEntries(
  entries: SearchIndexEntry[],
  selector: string | RegExp,
): string[] {
  if (typeof selector === 'string') {
    const needle =
      selector.toLocaleLowerCase();

    return entries
      .filter(
        (entry) =>
          entry.text.includes(
            needle,
          ),
      )
      .map(
        (entry) => entry.id,
      );
  }

  return entries
    .filter((entry) => {
      selector.lastIndex = 0;
      return selector.test(
        entry.text,
      );
    })
    .map(
      (entry) => entry.id,
    );
}

export function createTestCatalogIndex(
  catalog: TestCatalog,
): TestCatalogIndex {
  const specById =
    new Map<string, TestCatalogSpec>();

  const suiteById =
    new Map<string, TestCatalogSuite>();

  const childSuiteIdsByParentId =
    new Map<string, string[]>();

  const specIdsBySuiteId =
    new Map<string, string[]>();

  const specIdsByFile =
    new Map<string, string[]>();

  const specSearch: SearchIndexEntry[] = [];
  const suiteSearch: SearchIndexEntry[] = [];
  const fileSearchMap =
    new Map<string, SearchIndexEntry>();

  for (const suite of catalog.suites) {
    suiteById.set(
      suite.id,
      suite,
    );

    suiteSearch.push({
      id: suite.id,
      text: normalizeSearchText(
        suite.id,
        suite.description,
        suite.fullName,
        suite.file,
      ),
    });

    if (suite.parentSuiteId) {
      const childIds =
        childSuiteIdsByParentId.get(
          suite.parentSuiteId,
        ) ?? [];

      childIds.push(
        suite.id,
      );

      childSuiteIdsByParentId.set(
        suite.parentSuiteId,
        childIds,
      );
    }
  }

  for (const spec of catalog.specs) {
    specById.set(
      spec.id,
      spec,
    );

    specSearch.push({
      id: spec.id,
      text: normalizeSearchText(
        spec.id,
        spec.description,
        spec.fullName,
        spec.file,
      ),
    });

    if (spec.suiteId) {
      const specIds =
        specIdsBySuiteId.get(
          spec.suiteId,
        ) ?? [];

      specIds.push(
        spec.id,
      );

      specIdsBySuiteId.set(
        spec.suiteId,
        specIds,
      );
    }

    if (spec.file) {
      const specIds =
        specIdsByFile.get(
          spec.file,
        ) ?? [];

      specIds.push(
        spec.id,
      );

      specIdsByFile.set(
        spec.file,
        specIds,
      );

      if (!fileSearchMap.has(spec.file)) {
        fileSearchMap.set(
          spec.file,
          {
            id: spec.file,
            text: normalizeSearchText(
              spec.file,
            ),
          },
        );
      }
    }
  }

  return {
    specById,
    suiteById,
    childSuiteIdsByParentId,
    specIdsBySuiteId,
    specIdsByFile,
    specSearch,
    suiteSearch,
    fileSearch: [
      ...fileSearchMap.values(),
    ],
  };
}

export function getDescendantSuiteIdsFromIndex(
  index: TestCatalogIndex,
  suiteIds: Iterable<string>,
): Set<string> {
  const selected =
    new Set(suiteIds);

  const queue =
    [...selected];

  while (queue.length > 0) {
    const suiteId =
      queue.shift()!;

    const childIds =
      index.childSuiteIdsByParentId.get(
        suiteId,
      ) ?? [];

    for (const childId of childIds) {
      if (selected.has(childId)) {
        continue;
      }

      selected.add(childId);
      queue.push(childId);
    }
  }

  return selected;
}

export function getSpecIdsForSuitesFromIndex(
  index: TestCatalogIndex,
  suiteIds: Iterable<string>,
): string[] {
  const selectedSuites =
    getDescendantSuiteIdsFromIndex(
      index,
      suiteIds,
    );

  const specIds: string[] = [];

  for (const suiteId of selectedSuites) {
    specIds.push(
      ...(
        index.specIdsBySuiteId.get(
          suiteId,
        ) ?? []
      ),
    );
  }

  return specIds;
}

export function getEmbeddedTestCatalogIndexSource():
  string {
  return [
    normalizeSearchText,
    searchIndexEntries,
    createTestCatalogIndex,
    getDescendantSuiteIdsFromIndex,
    getSpecIdsForSuitesFromIndex,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
````

## File: src/test-metadata-runtime.ts
````typescript
export function getEmbeddedTestMetadataSource(): string {
  return `
const __testifyMetadataByItem = new WeakMap();
const __testifyRegistrationScopes = [];

function setTestifyMetadata(item, metadata) {
  if (!item || (typeof item !== 'object' && typeof item !== 'function')) {
    return;
  }

  const current =
    __testifyMetadataByItem.get(item) ?? {};

  __testifyMetadataByItem.set(item, {
    ...current,
    ...metadata,
  });
}

function getTestifyMetadata(item) {
  if (!item || (typeof item !== 'object' && typeof item !== 'function')) {
    return undefined;
  }

  return __testifyMetadataByItem.get(item);
}

function setTestifyFile(item, file) {
  setTestifyMetadata(item, { file });
}

function getTestifyFile(item) {
  return getTestifyMetadata(item)?.file;
}

function beginTestifyRegistrationScope(file) {
  __testifyRegistrationScopes.push(file);
}

function endTestifyRegistrationScope() {
  __testifyRegistrationScopes.pop();
}

function getCurrentTestifyRegistrationFile() {
  return __testifyRegistrationScopes[
    __testifyRegistrationScopes.length - 1
  ];
}

async function withTestifyRegistrationScope(file, work) {
  beginTestifyRegistrationScope(file);

  try {
    return await work();
  } finally {
    endTestifyRegistrationScope();
  }
}

function captureTestifyRegistration(item) {
  const file = getCurrentTestifyRegistrationFile();

  if (file) {
    setTestifyFile(item, file);
  }
}
`;
}
````

## File: src/test-metadata.spec.ts
````typescript
import {
  beginTestifyRegistrationScope,
  captureTestifyRegistration,
  endTestifyRegistrationScope,
  getCurrentTestifyRegistrationFile,
  getTestifyFile,
  getTestifyMetadata,
  setTestifyFile,
  setTestifyMetadata,
  withTestifyRegistrationScope,
} from './test-metadata';

describe('Testify metadata registry', () => {
  it('stores metadata without mutating the target object', () => {
    const target: Record<string, unknown> = {};

    setTestifyFile(target, 'forms.spec.ts');

    expect(getTestifyFile(target)).toBe(
      'forms.spec.ts',
    );
    expect(
      Object.prototype.hasOwnProperty.call(
        target,
        '_filePath',
      ),
    ).toBeFalse();
  });

  it('merges metadata updates', () => {
    const target = {};

    setTestifyMetadata(target, {
      file: 'first.spec.ts',
    });
    setTestifyMetadata(target, {
      file: 'second.spec.ts',
    });

    expect(getTestifyMetadata(target)).toEqual({
      file: 'second.spec.ts',
    });
  });

  it('captures registrations within a file scope', () => {
    const suite = {};
    const test = {};

    beginTestifyRegistrationScope('forms.spec.ts');

    try {
      captureTestifyRegistration(suite);
      captureTestifyRegistration(test);
    } finally {
      endTestifyRegistrationScope();
    }

    expect(getTestifyFile(suite)).toBe('forms.spec.ts');
    expect(getTestifyFile(test)).toBe('forms.spec.ts');
    expect(getCurrentTestifyRegistrationFile()).toBeUndefined();
  });

  it('restores nested registration scopes', async () => {
    const outer = {};
    const inner = {};
    const after = {};

    await withTestifyRegistrationScope(
      'outer.spec.ts',
      async () => {
        captureTestifyRegistration(outer);

        await withTestifyRegistrationScope(
          'inner.spec.ts',
          async () => {
            captureTestifyRegistration(inner);
          },
        );

        captureTestifyRegistration(after);
      },
    );

    expect(getTestifyFile(outer)).toBe('outer.spec.ts');
    expect(getTestifyFile(inner)).toBe('inner.spec.ts');
    expect(getTestifyFile(after)).toBe('outer.spec.ts');
  });
});
````

## File: src/test-metadata.ts
````typescript
export interface TestifyItemMetadata {
  file?: string;
}

const metadataByItem =
  new WeakMap<object, TestifyItemMetadata>();

export function setTestifyMetadata(
  item: object,
  metadata: TestifyItemMetadata,
): void {
  const current =
    metadataByItem.get(item) ?? {};

  metadataByItem.set(item, {
    ...current,
    ...metadata,
  });
}

export function getTestifyMetadata(
  item: unknown,
): TestifyItemMetadata | undefined {
  if (
    !item ||
    (typeof item !== 'object' &&
      typeof item !== 'function')
  ) {
    return undefined;
  }

  return metadataByItem.get(
    item as object,
  );
}

export function setTestifyFile(
  item: unknown,
  file: string,
): void {
  if (
    !item ||
    (typeof item !== 'object' &&
      typeof item !== 'function')
  ) {
    return;
  }

  setTestifyMetadata(
    item as object,
    { file },
  );
}

export function getTestifyFile(
  item: unknown,
): string | undefined {
  return getTestifyMetadata(item)?.file;
}


const registrationScopes: string[] = [];

export function beginTestifyRegistrationScope(
  file: string,
): void {
  registrationScopes.push(file);
}

export function endTestifyRegistrationScope(): void {
  registrationScopes.pop();
}

export function getCurrentTestifyRegistrationFile():
  | string
  | undefined {
  return registrationScopes[
    registrationScopes.length - 1
  ];
}

export async function withTestifyRegistrationScope<T>(
  file: string,
  work: () => Promise<T>,
): Promise<T> {
  beginTestifyRegistrationScope(file);

  try {
    return await work();
  } finally {
    endTestifyRegistrationScope();
  }
}

export function captureTestifyRegistration(
  item: unknown,
): void {
  const file =
    getCurrentTestifyRegistrationFile();

  if (file) {
    setTestifyFile(item, file);
  }
}
````

## File: src/test-selection.spec.ts
````typescript
import {
  resolveTestSelector,
  getSpecIdsForSuites,
} from './test-selection';
import type { TestCatalog } from './test-catalog';

describe('TestSelector', () => {
  const catalog: TestCatalog = {
    rootSuiteId: 'suite0',
    suites: [
      {
        id: 'suite1',
        description: 'Forms',
        fullName: 'Forms',
      },
      {
        id: 'suite2',
        description: 'Bindings',
        fullName: 'Forms Bindings',
        parentSuiteId: 'suite1',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'creates fields',
        fullName: 'Forms creates fields',
        suiteId: 'suite1',
        file: 'forms.spec.js',
      },
      {
        id: 'spec2',
        description: 'binds controls',
        fullName: 'Forms Bindings binds controls',
        suiteId: 'suite2',
        file: 'bindings.spec.js',
      },
    ],
  };

  it('resolves an exact spec id', () => {
    expect(resolveTestSelector(catalog, 'spec2')).toEqual(['spec2']);
  });

  it('resolves an exact suite id including descendant suites', () => {
    expect(resolveTestSelector(catalog, 'suite1')).toEqual(['spec1', 'spec2']);
  });

  it('resolves suite regular expressions', () => {
    expect(
      resolveTestSelector(catalog, { suite: /Bindings/ }),
    ).toEqual(['spec2']);
  });

  it('resolves spec regular expressions without selecting suites', () => {
    expect(
      resolveTestSelector(catalog, { spec: /binds/ }),
    ).toEqual(['spec2']);
  });

  it('resolves file selectors', () => {
    expect(
      resolveTestSelector(
        catalog,
        { file: 'bindings.spec.js' },
      ),
    ).toEqual(['spec2']);
  });

  it('resolves file regular expressions', () => {
    expect(
      resolveTestSelector(
        catalog,
        { file: /forms\.spec/ },
      ),
    ).toEqual(['spec1']);
  });
});
````

## File: vite.runner.config.ts
````typescript
import fs from 'fs';
import path from 'path';
import { builtinModules } from 'module';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const configFilePath = fileURLToPath(import.meta.url);
const configDirectory = path.dirname(configFilePath);

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

const dependencyExternals = new Set([
  ...(pkg.bundleDependencies || []),
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'playwright-core',
  'fsevents'
]);

const builtinExternals = new Set(builtinModules);

const isExternal = (id: string) => {
  if (id.startsWith('node:')) return true;
  if (builtinExternals.has(id)) return true;

  return Array.from(dependencyExternals).some(
    (dep) => id === dep || id.startsWith(`${dep}/`)
  );
};

export default defineConfig({
  build: {
    target: 'node22',
    ssr: true,
    outDir: 'dist/testify/',
    emptyOutDir: false,
    minify: false,
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: path.resolve(configDirectory, './src/ts-jasmine-cli.ts'),
      output: {
        entryFileNames: 'bin/jasmine',
        format: 'es',
        inlineDynamicImports: true,
        banner: `#!/usr/bin/env node
import { createRequire as ___createRequire } from 'module';
const require = ___createRequire(import.meta.url);
`,
        manualChunks: undefined
      },
      external: (id) => {
        if (id.includes('node_modules')) return true;
        return isExternal(id);
      }
    }
  }
});
````

## File: src/browser-test-catalog.ts
````typescript
import { createTestCatalogFromJasmineEnv } from './test-catalog';
import type { TestCatalog } from './test-catalog';

export function createBrowserTestCatalog(
  env: jasmine.Env,
): TestCatalog {
  return createTestCatalogFromJasmineEnv(env);
}
````

## File: src/hmr-manager.ts
````typescript
import * as fs from 'fs';
import * as path from 'path';
import { FSWatcher, watch } from 'chokidar';
import { EventEmitter } from 'events';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { capitalize, norm } from './utils';
import { ViteConfigBuilder } from './vite-config-builder';
import { glob } from 'glob';
import picomatch from 'picomatch';
import { FileDiscoveryService } from './file-discovery-service';
import { logger } from './logger';
import { HmrMessages } from './log-messages';

// Dynamic import to avoid top-level await issues
let viteBuild: any = null;
async function getViteBuild() {
  if (!viteBuild) {
    const vite = await import('vite');
    viteBuild = vite.build;
  }
  return viteBuild;
}

export interface HmrUpdate {
  type: 'update' | 'full-reload' | 'test-update';
  path: string;
  timestamp: number;
  content?: string;
  affectedTests?: string[];
  reason?: string;
}

export interface FileFilter {
  include?: string[];
  exclude?: string[];
  extensions?: string[];
}

export interface RebuildStats {
  changedFiles: string[];
  rebuiltFiles: string[];
  duration: number;
  timestamp: number;
  updateType: 'test-only' | 'source-change' | 'full';
}

export type SourceChangeStrategy = 'smart' | 'always-reload' | 'never-reload';

export interface HmrManagerOptions {
  fileFilter?: Partial<FileFilter>;
  rebuildMode?: 'all' | 'selective';
  sourceChangeStrategy?: SourceChangeStrategy;
  criticalSourcePatterns?: string[]; // patterns that always trigger full reload
}

export class HmrManager extends EventEmitter {
  private watcher: FSWatcher | null = null;
  private rebuildQueue: Set<string> = new Set();
  private directChanges: Set<string> = new Set();
  private allFiles: string[] = [];

  // ✅ FIX: Add atomic operation queue
  private operationQueue: Promise<void> = Promise.resolve();
  private rebuildPromise: Promise<void> | null = null;

  private fileFilter: FileFilter = {
    include: [],
    exclude: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/coverage/**'],
    extensions: ['.ts', '.js', '.mjs']
  };

  private dependencyGraph: Map<string, Set<string>> = new Map();
  private reverseDependencyGraph: Map<string, Set<string>> = new Map();
  private pathAliases: Record<string, string> = {};
  private rebuildMode: 'all' | 'selective' = 'selective';
  private sourceChangeStrategy: SourceChangeStrategy = 'smart';
  private criticalSourcePatterns: string[] = [
    '**/config/**',
    '**/setup/**',
    '**/*.config.*',
    '**/bootstrap.*',
    '**/main.*',
    '**/index.*' // root-level index files
  ];

  private primarySrcDir: string;
  private primaryTestDir: string;

  constructor(
    private fileDiscovery: FileDiscoveryService,
    private config: ViteJasmineConfig,
    private viteConfigBuilder: ViteConfigBuilder,
    private viteCache: any = null,
    options?: HmrManagerOptions
  ) {
    super();
    const srcDir = Array.isArray(config.srcDirs) && config.srcDirs.length > 0 ? config.srcDirs[0] : './src';
    const testDir = Array.isArray(config.testDirs) && config.testDirs.length > 0 ? config.testDirs[0] : './tests';
    this.primarySrcDir = norm(srcDir);
    this.primaryTestDir = norm(testDir);
    this.pathAliases = (this.viteConfigBuilder as any).createPathAliases();
    if (options?.fileFilter) this.fileFilter = { ...this.fileFilter, ...options.fileFilter };
    if (options?.rebuildMode) this.rebuildMode = options.rebuildMode;
    if (options?.sourceChangeStrategy) this.sourceChangeStrategy = options.sourceChangeStrategy;
    if (options?.criticalSourcePatterns) {
      this.criticalSourcePatterns = [...this.criticalSourcePatterns, ...options.criticalSourcePatterns];
    }
  }

  setFileFilter(filter: Partial<FileFilter>): void {
    this.fileFilter = { ...this.fileFilter, ...filter };
    logger.println(HmrMessages.fileFilterUpdated(this.fileFilter));
  }

  setRebuildMode(mode: 'all' | 'selective'): void {
    this.rebuildMode = mode;
    logger.println(HmrMessages.rebuildModeSet(mode));
  }

  setSourceChangeStrategy(strategy: SourceChangeStrategy): void {
    this.sourceChangeStrategy = strategy;
    logger.println(HmrMessages.sourceChangeStrategySet(strategy));
  }

  private matchesFilter(filePath: string): boolean {
    const normalizedPath = filePath;

    if (this.fileFilter.extensions?.length) {
      const ext = path.extname(normalizedPath);
      if (!this.fileFilter.extensions.includes(ext)) return false;
    }

    if (this.fileFilter.exclude?.length) {
      if (picomatch.isMatch(normalizedPath, this.fileFilter.exclude)) return false;
    }

    if (this.fileFilter.include?.length) {
      if (!picomatch.isMatch(normalizedPath, this.fileFilter.include)) return false;
    }

    return true;
  }

  /**
   * Determines if a file is a test file
   */
  private isTestFile(filePath: string): boolean {
    const normalized = norm(filePath);
    return normalized.startsWith(this.primaryTestDir);
  }

  /**
   * Determines if a file is a source file
   */
  private isSourceFile(filePath: string): boolean {
    const normalized = norm(filePath);
    return normalized.startsWith(this.primarySrcDir);
  }

  /**
   * Checks if a source file is critical and requires full reload
   */
  private isCriticalSourceFile(filePath: string): boolean {
    if (!this.isSourceFile(filePath)) return false;
    
    const normalized = norm(filePath);
    return this.criticalSourcePatterns.some(pattern => 
      picomatch.isMatch(normalized, pattern)
    );
  }

  /**
   * Determines the appropriate update strategy based on what changed
   */
  private determineUpdateStrategy(
    changedFiles: string[],
    changeType: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir'
  ): { type: HmrUpdate['type']; reason: string } {
    const hasSourceChanges = changedFiles.some(f => this.isSourceFile(f));
    const hasTestChanges = changedFiles.some(f => this.isTestFile(f));
    const hasCriticalChanges = changedFiles.some(f => this.isCriticalSourceFile(f));

    // Test-only changes never require full reload
    if (!hasSourceChanges && hasTestChanges) {
      return {
        type: 'test-update',
        reason: 'Test files changed - incremental update'
      };
    }

    // Source file/directory removal - check if critical
    if (changeType === 'unlink' || changeType === 'unlinkDir') {
      if (hasCriticalChanges) {
        return {
          type: 'full-reload',
          reason: 'Critical source file/directory removed'
        };
      }
      // Non-critical source removal can be handled with update
      return {
        type: 'update',
        reason: 'Source file/directory removed - updating dependents'
      };
    }

    // Source file/directory addition
    if (changeType === 'add' || changeType === 'addDir') {
      // New sources don't require full reload, just build them
      return {
        type: 'update',
        reason: 'Source file/directory added - building new modules'
      };
    }

    // Source file modification - apply strategy
    if (hasSourceChanges) {
      if (this.sourceChangeStrategy === 'always-reload') {
        return {
          type: 'full-reload',
          reason: 'Source changed - always-reload strategy'
        };
      }

      if (this.sourceChangeStrategy === 'never-reload') {
        return {
          type: 'update',
          reason: 'Source changed - never-reload strategy'
        };
      }

      // Smart strategy
      if (hasCriticalChanges) {
        return {
          type: 'full-reload',
          reason: 'Critical source file changed'
        };
      }

      return {
        type: 'update',
        reason: 'Source changed - incremental update'
      };
    }

    // Default to update
    return {
      type: 'update',
      reason: 'General update'
    };
  }

  /**
   * Rebuilds the dependency graph entry for the given files
   */
  private async buildDependencyGraph(files: string[]): Promise<void> {
    // ✅ FIX: Filter out non-existent files before processing
    const existingFiles = files.filter(fs.existsSync);
    
    for (const file of existingFiles) {
      const normalizedFile = norm(file);
      
      const oldDeps = this.dependencyGraph.get(normalizedFile);

      if (oldDeps) {
        for (const oldDep of oldDeps) {
          this.reverseDependencyGraph.get(oldDep)?.delete(normalizedFile);
        }
      }

      const newDeps = await this.extractDependencies(file);
      if (newDeps.size === 0 && !fs.existsSync(normalizedFile)) {
        // File no longer exists: purge orphaned graph entries
        this.dependencyGraph.delete(normalizedFile);
      } else {
        this.dependencyGraph.set(normalizedFile, newDeps);
      }

      for (const newDep of newDeps) {
        if (!this.reverseDependencyGraph.has(newDep)) {
          this.reverseDependencyGraph.set(newDep, new Set());
        }
        this.reverseDependencyGraph.get(newDep)!.add(normalizedFile);
      }
    }

    // Prune empty entries from reverse dependency graph to prevent memory leaks
    for (const [key, set] of this.reverseDependencyGraph) {
      if (set.size === 0) {
        this.reverseDependencyGraph.delete(key);
      }
    }
  }

  private async extractDependencies(filePath: string): Promise<Set<string>> {
    // ✅ FIX: Skip if file doesn't exist
    if (!fs.existsSync(filePath)) {
      return new Set();
    }
    
    const deps = new Set<string>();
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const importRegex = /(?:import|export).*?from\s+['"]([^'"]+)['"]/g;
      const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const resolved = this.resolveImport(filePath, match[1]);
        if (resolved) deps.add(norm(resolved));
      }
      while ((match = requireRegex.exec(content)) !== null) {
        const resolved = this.resolveImport(filePath, match[1]);
        if (resolved) deps.add(norm(resolved));
      }
    } catch (error) {
      logger.println(HmrMessages.cannotExtractDependencies(filePath, (error as Error).message));
    }
    return deps;
  }

  private resolveImport(fromFile: string, importPath: string): string | null {
    if (!fs.existsSync(fromFile)) {
      return null;
    }
    
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      const aliasResolved = this.resolvePathAlias(importPath);
      return aliasResolved || null;
    }

    const dir = path.dirname(fromFile);
    let resolved = path.resolve(dir, importPath);
    const extensions = [...this.fileFilter.extensions!, ''];

    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return resolved;

    for (const ext of extensions) {
      const withExt = resolved + ext;
      if (fs.existsSync(withExt) && fs.statSync(withExt).isFile()) return withExt;

      const indexFile = path.join(resolved, `index${ext}`);
      if (fs.existsSync(indexFile) && fs.statSync(indexFile).isFile()) return indexFile;
    }

    return null;
  }

  private resolvePathAlias(importPath: string): string | null {
    const extensions = [...this.fileFilter.extensions!, ''];
    for (const [alias, aliasPath] of Object.entries(this.pathAliases)) {
      if (importPath === alias || importPath.startsWith(alias.replace(/\/\*$/, '') + '/')) {
        const relativePart = importPath.slice(alias.replace(/\/\*$/, '').length);
        const resolvedBase = norm(path.join(aliasPath.replace(/\/\*$/, ''), relativePart));
        for (const ext of extensions) {
          const withExt = resolvedBase + ext;
          if (fs.existsSync(withExt) && fs.statSync(withExt).isFile()) return withExt;

          const indexFile = path.join(resolvedBase, `index${ext}`);
          if (fs.existsSync(indexFile) && fs.statSync(indexFile).isFile()) return indexFile;
        }
      }
    }
    return null;
  }

  private getFilesToRebuild(changedFile: string): Set<string> {
    const filesToRebuild = new Set<string>();

    if (this.rebuildMode === 'all') {
      // ✅ FIX: Only include existing files in "all" mode
      this.allFiles.filter(fs.existsSync).forEach(f => filesToRebuild.add(f));
      return filesToRebuild;
    }

    const queue = [norm(changedFile)];
    const visited = new Set<string>();

    while (queue.length) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;

      visited.add(current);
      
      // ✅ FIX: Only add to rebuild set if file exists
      if (fs.existsSync(current)) {
        filesToRebuild.add(current);
      }

      const dependents = this.reverseDependencyGraph.get(current);
      if (dependents) {
        dependents.forEach(d => {
          // ✅ FIX: Only queue dependents that exist
          if (fs.existsSync(d)) {
            queue.push(d);
          }
        });
      }
    }

    return filesToRebuild;
  }

  /**
   * Gets all test files affected by a source change
   */
  private getAffectedTests(sourceFile: string): string[] {
    const allDependents = this.getFilesToRebuild(sourceFile);
    return Array.from(allDependents).filter(f => this.isTestFile(f) && fs.existsSync(f));
  }

  async start(): Promise<void> {
    const watchDirs = [...(this.config.srcDirs || []), ...(this.config.testDirs || [])].filter(Boolean);
    const watchTargets = watchDirs.length > 0 ? watchDirs : [this.primarySrcDir, this.primaryTestDir];
    await this.initializeTrackedFiles(watchTargets);
    this.watcher = watch(watchTargets, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      ignoreInitial: true
    });

    this.watcher.on('change', filePath => {
      filePath = norm(filePath);
      if (this.matchesFilter(filePath)) this.queueRebuild(filePath, 'change');
    });

    this.watcher.on('add', filePath => {
      filePath = norm(filePath);
      if (this.matchesFilter(filePath)) this.handleFileAdd(filePath);
    });

    this.watcher.on('unlink', filePath => {
      filePath = norm(filePath);
      if (this.matchesFilter(filePath)) this.handleFileRemove(filePath);
    });

    this.watcher.on('addDir', dirPath => this.handleDirectoryAdd(norm(dirPath)));
    this.watcher.on('unlinkDir', dirPath => this.handleDirectoryRemove(norm(dirPath)));

    this.watcher.on('ready', async () => {
      logger.println(HmrMessages.watchingFiles(this.allFiles.length, this.rebuildMode, this.sourceChangeStrategy));
      this.emit('hmr:ready');
    });
  }

  private async initializeTrackedFiles(watchTargets: string[]): Promise<void> {
    const defaultExtensions = this.fileFilter.extensions!.join(',');
    const seen = new Set(this.allFiles);
    for (const target of watchTargets) {
      const normalizedTarget = norm(target);
      if (!fs.existsSync(normalizedTarget)) continue;

      const pattern = norm(path.join(normalizedTarget, `**/*{${defaultExtensions}}`));
      const files = (await glob(pattern, { absolute: true, ignore: ['**/node_modules/**'] }))
        .filter(f => this.matchesFilter(norm(f)));

      for (const file of files) {
        const normalized = norm(file);
        if (!seen.has(normalized)) {
          seen.add(normalized);
          this.allFiles.push(normalized);
        }
      }
    }
  }

  private async handleFileAdd(filePath: string): Promise<void> {
    // ✅ FIX: Use operation queue to prevent race conditions
    this.operationQueue = this.operationQueue.then(async () => {
      filePath = norm(filePath);
      if (!this.allFiles.includes(filePath)) {
        this.allFiles.push(filePath);
        
        const fileType = this.isTestFile(filePath) ? 'test' : 
                        this.isSourceFile(filePath) ? 'source' : 'unknown';
        const output = norm(this.isTestFile(filePath) ? path.relative(this.primaryTestDir, filePath) : path.relative(this.primarySrcDir, filePath)); 
        logger.println(HmrMessages.fileAdded(capitalize(fileType), output));
        
        this.queueRebuild(filePath, 'add');
      }
    }).catch(error => {
      logger.error(HmrMessages.errorInHandleFileAdd(error));
    });
    
    await this.operationQueue;
  }

  private async handleFileRemove(filePath: string): Promise<void> {
    // ✅ FIX: Use operation queue for atomic file removal
    this.operationQueue = this.operationQueue.then(async () => {
      filePath = norm(filePath);
      
      this.viteConfigBuilder.removeFromInputMap(filePath);

      // ✅ CRITICAL: Remove from rebuild queue immediately to prevent build errors
      this.rebuildQueue.delete(filePath);
      this.directChanges.delete(filePath);
      
      const affectedFiles = new Set<string>();
      const dependents = this.reverseDependencyGraph.get(filePath);
      dependents?.forEach(d => {
        if (fs.existsSync(d)) {
          affectedFiles.add(d);
        }
      });

      this.allFiles = this.allFiles.filter(f => f !== filePath);
      this.dependencyGraph.delete(filePath);
      this.reverseDependencyGraph.delete(filePath);

      for (const deps of this.dependencyGraph.values()) deps.delete(filePath);
      for (const dep of this.reverseDependencyGraph.values()) dep.delete(filePath);

      const fileType = this.isTestFile(filePath) ? 'test' : 
                      this.isSourceFile(filePath) ? 'source' : 'unknown';
      let output = norm(this.isTestFile(filePath) ? path.relative(this.primaryTestDir, filePath) : path.relative(this.primarySrcDir, filePath)); 
      logger.println(HmrMessages.fileRemoved(capitalize(fileType), output));

      // Determine update strategy
      const strategy = this.determineUpdateStrategy([filePath], 'unlink');

      output = norm(path.join(this.config.outDir, this.fileDiscovery.getOutputName(filePath)));

      if (fs.existsSync(output)) fs.rmSync(output);
      const map = output.replace(/\.js$/, '.js.map');
      if (fs.existsSync(map)) fs.rmSync(map);
    
      this.emit('hmr:update', {
        type: strategy.type,
        path: this.fileDiscovery.getOutputName(filePath),
        timestamp: Date.now(),
        affectedTests: this.isSourceFile(filePath) ? Array.from(affectedFiles).filter(f => this.isTestFile(f)) : undefined,
        reason: strategy.reason
      });

      if (this.rebuildMode === 'selective' && affectedFiles.size > 0) {
        affectedFiles.forEach(f => this.queueRebuild(f, 'change'));
      }
    }).catch(error => {
      logger.error(HmrMessages.errorInHandleFileRemove(error));
    });
    
    await this.operationQueue;
  }

  private async handleDirectoryAdd(dirPath: string): Promise<void> {
    // ✅ FIX: Use operation queue
    this.operationQueue = this.operationQueue.then(async () => {
      dirPath = norm(dirPath);
      const dirType = dirPath.startsWith(this.primaryTestDir) ? 'test': 'source';
      const output = norm(dirPath.startsWith(this.primaryTestDir) ? path.relative(this.primaryTestDir, dirPath) : path.relative(this.primarySrcDir, dirPath));
      logger.println(HmrMessages.directoryAdded(capitalize(dirType), output));
      
      const defaultExtensions = this.fileFilter.extensions!.join(',');
      const pattern = norm(path.join(dirPath, `**/*{${defaultExtensions}}`));
      const newFiles = (await glob(pattern, { absolute: true, ignore: ['**/node_modules/**'] }))
        .filter(f => this.matchesFilter(norm(f)));

      const filesToProcess: string[] = [];
      for (const file of newFiles) {
        const normalized = norm(file);
        if (!this.allFiles.includes(normalized)) {
          this.allFiles.push(normalized);
          filesToProcess.push(normalized);
        }
      }

      if (filesToProcess.length) {
        logger.println(HmrMessages.foundFilesInDirectory(filesToProcess.length, dirType));
        
        // Directory additions don't require full reload
        const strategy = this.determineUpdateStrategy(filesToProcess, 'addDir');
        
        this.emit('hmr:update', {
          type: strategy.type,
          path: output,
          timestamp: Date.now(),
          reason: strategy.reason
        });
        
        filesToProcess.forEach(f => this.queueRebuild(f, 'add'));
      }
    }).catch(error => {
      logger.error(HmrMessages.errorInHandleDirectoryAdd(error));
    });
    
    await this.operationQueue;
  }

  private async handleDirectoryRemove(dirPath: string): Promise<void> {
    // ✅ FIX: Use operation queue for atomic directory removal
    this.operationQueue = this.operationQueue.then(async () => {
      dirPath = norm(dirPath);

      const dirType = dirPath.startsWith(this.primaryTestDir) ? 'test': 'source';
      const output = norm(dirPath.startsWith(this.primaryTestDir) ? path.relative(this.primaryTestDir, dirPath) : path.relative(this.primarySrcDir, dirPath));
      logger.println(HmrMessages.directoryRemoved(capitalize(dirType), output));
      
      const removedFiles = this.allFiles.filter(f => f.startsWith(dirPath + path.sep) || f === dirPath);
      const affectedFiles = new Set<string>();

      // ✅ Remove all files in directory from rebuild queues to prevent build errors
      for (const file of removedFiles) {
        this.rebuildQueue.delete(file);
        this.directChanges.delete(file);
        
        const dependents = this.reverseDependencyGraph.get(file);
        dependents?.forEach(d => {
          if (fs.existsSync(d)) {
            affectedFiles.add(d);
          }
        });

        this.dependencyGraph.delete(file);
        this.reverseDependencyGraph.delete(file);

        for (const deps of this.dependencyGraph.values()) deps.delete(file);
        for (const dep of this.reverseDependencyGraph.values()) dep.delete(file);
      }
      
      // Remove all files at once (more efficient)
      this.allFiles = this.allFiles.filter(f => !removedFiles.includes(f));

      // Determine strategy based on what was removed
      const strategy = this.determineUpdateStrategy(removedFiles, 'unlinkDir');
      this.viteConfigBuilder.removeMultipleFromInputMap(removedFiles);
    
      this.emit('hmr:update', {
        type: strategy.type,
        path: output,
        timestamp: Date.now(),
        affectedTests: Array.from(affectedFiles).filter(f => this.isTestFile(f)),
        reason: strategy.reason
      });

      if (this.rebuildMode === 'selective' && affectedFiles.size > 0) {
        affectedFiles.forEach(f => this.queueRebuild(f, 'change'));
      }
    }).catch(error => {
      logger.error(HmrMessages.errorInHandleDirectoryRemove(error));
    });
    
    await this.operationQueue;
  }

  private async queueRebuild(filePath: string, changeType: 'add' | 'change' | 'unlink' = 'change') {
    const normalized = norm(filePath);
    
    // ✅ FIX: Skip if file doesn't exist (for unlink cases)
    if (changeType !== 'unlink' && !fs.existsSync(normalized)) {
      logger.println(HmrMessages.skippingRebuildNonExistent(normalized));
      return;
    }
    
    this.directChanges.add(normalized);
    this.rebuildQueue.add(normalized);

    // If a rebuild is already in progress, return the same promise.
    // Multiple queued changes will be processed in the same rebuild loop.
    if (this.rebuildPromise) {
      return this.rebuildPromise;
    }

    this.rebuildPromise = this.rebuildAll().catch(error => {
      logger.error(HmrMessages.rebuildFailed(error));
      this.emit('hmr:error', error);
    }).finally(() => {
      this.rebuildPromise = null;
    });
    
    return this.rebuildPromise;
  }

  private async rebuildAll() {
    try {
      while (this.rebuildQueue.size > 0) {
        const startTime = Date.now();

        // ✅ FIX: Filter out deleted files from ALL queues before processing
        const changedFiles = Array.from(this.rebuildQueue).filter(file => {
          if (!fs.existsSync(file)) {
            logger.println(HmrMessages.skippingDeletedFileFromQueue(file));
            return false;
          }
          return true;
        });

        this.rebuildQueue.clear();

        const directChangedFiles = Array.from(this.directChanges).filter(file => {
          if (!fs.existsSync(file)) {
            logger.println(HmrMessages.skippingDeletedFileFromDirectChanges(file));
            return false;
          }
          return true;
        });
        this.directChanges.clear();

        if (changedFiles.length === 0) {
          logger.println(HmrMessages.allQueuedFilesDeleted());
          continue;
        }

        const filesToRebuild = new Set<string>();

        for (const file of changedFiles) {
          const deps = this.getFilesToRebuild(file);
          deps.forEach(f => {
            // ✅ FIX: Double verify files to rebuild still exist
            if (fs.existsSync(f)) {
              filesToRebuild.add(f);
            }
          });
        }

        const rebuiltFiles = Array.from(filesToRebuild);

        if (rebuiltFiles.length === 0) {
          logger.println(HmrMessages.noValidFilesToRebuild());
          continue;
        }

        // ✅ CRITICAL FIX: Filter source and test files to ONLY include existing files
        const validSourceFiles = rebuiltFiles.filter(f => this.isSourceFile(f) && fs.existsSync(f));
        const validTestFiles = rebuiltFiles.filter(f => this.isTestFile(f) && fs.existsSync(f));

        logger.println(HmrMessages.rebuildSummary(directChangedFiles.length, rebuiltFiles.length, validSourceFiles.length, validTestFiles.length));

        // Only proceed if we have valid files to build
        if (validSourceFiles.length === 0 && validTestFiles.length === 0) {
          logger.println(HmrMessages.noValidSourceOrTestFiles());
          continue;
        }

        await this.buildDependencyGraph(rebuiltFiles);

        // ✅ FIX: Pass ONLY valid existing files to Vite config builder
        const viteConfig = this.viteConfigBuilder.createViteConfigForFiles(
          [...validSourceFiles, ...validTestFiles],
          this.viteCache
        );

        const build = await getViteBuild();
        const startBuildTime = Date.now();

        try {
          const result = await build(viteConfig);
          this.viteCache = result;
        } catch (buildError: any) {
          logger.error(HmrMessages.viteBuildFailed(buildError));
          // Check if it's due to missing entry files
          if (buildError.code === 'UNRESOLVED_ENTRY') {
            logger.println(HmrMessages.retryingWithFilteredEntries());
            // Retry with additional filtering
            const finalSourceFiles = validSourceFiles.filter(fs.existsSync);
            const finalTestFiles = validTestFiles.filter(fs.existsSync);

            if (finalSourceFiles.length === 0 && finalTestFiles.length === 0) {
              logger.println(HmrMessages.allEntryPointsDeleted());
              continue;
            }

            const retryConfig = this.viteConfigBuilder.createViteConfigForFiles(
              [...finalSourceFiles, ...finalTestFiles],
              this.viteCache
            );
            const result = await build(retryConfig);
            this.viteCache = result;
          } else {
            throw buildError;
          }
        }

        // Emit updates for successfully built files
        for (const file of rebuiltFiles) {
          const relative = this.fileDiscovery.getOutputName(file);
          const outputPath = path.join(this.config.outDir, relative);

          if (fs.existsSync(outputPath)) {
            const content = fs.readFileSync(outputPath, 'utf-8');

            const strategy = this.determineUpdateStrategy(directChangedFiles, 'change');
            const affectedTests = directChangedFiles
              .filter(f => this.isSourceFile(f))
              .flatMap(f => this.getAffectedTests(f));

            this.emit('hmr:update', {
              type: strategy.type,
              path: relative,
              timestamp: Date.now(),
              content,
              affectedTests: affectedTests.length > 0 ? affectedTests : undefined,
              reason: strategy.reason
            });
          }
        }

        logger.println(HmrMessages.viteBuildCompleted(Date.now() - startBuildTime));

        const duration = Date.now() - startTime;
        const sourceChanges = directChangedFiles.filter(f => this.isSourceFile(f));
        const testChanges = directChangedFiles.filter(f => this.isTestFile(f));
        const updateType = sourceChanges.length > 0 ? 'source-change' :
          testChanges.length > 0 ? 'test-only' : 'full';

        this.emit('hmr:rebuild', {
          changedFiles: directChangedFiles,
          rebuiltFiles,
          duration,
          timestamp: Date.now(),
          updateType
        } as RebuildStats);

        logger.println(HmrMessages.rebuildComplete(updateType, rebuiltFiles.length, duration));
      }
    } catch (error) {
      logger.error(HmrMessages.rebuildFailed(error));
      this.emit('hmr:error', error);
      throw error;
    }
  }

  getDependencyInfo(filePath: string) {
    const normalized = norm(filePath);
    return {
      dependencies: Array.from(this.dependencyGraph.get(normalized) || []),
      dependents: Array.from(this.reverseDependencyGraph.get(normalized) || []),
      isTest: this.isTestFile(normalized),
      isSource: this.isSourceFile(normalized),
      isCritical: this.isCriticalSourceFile(normalized),
      affectedTests: this.isSourceFile(normalized) ? this.getAffectedTests(normalized) : []
    };
  }

  getStats() {
    const sourceFiles = this.allFiles.filter(f => this.isSourceFile(f));
    const testFiles = this.allFiles.filter(f => this.isTestFile(f));
    const criticalFiles = sourceFiles.filter(f => this.isCriticalSourceFile(f));

    return {
      totalFiles: this.allFiles.length,
      sourceFiles: sourceFiles.length,
      testFiles: testFiles.length,
      criticalSourceFiles: criticalFiles.length,
      trackedDependencies: this.dependencyGraph.size,
      rebuildMode: this.rebuildMode,
      sourceChangeStrategy: this.sourceChangeStrategy,
      fileFilter: this.fileFilter,
      pathAliases: this.pathAliases,
      criticalPatterns: this.criticalSourcePatterns
    };
  }

  async stop(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
      this.dependencyGraph.clear();
      this.reverseDependencyGraph.clear();
      logger.println(HmrMessages.watcherStopped());
    }
  }
}
````

## File: src/jasmine-node-runtime.ts
````typescript
import {
  createTestCatalogFromJasmineEnv,
  getEmbeddedTestCatalogSource,
  type TestCatalog,
} from './test-catalog';

export interface NodeJasmineRuntimeOptions {
  reporter?: jasmine.CustomReporter;
  resetReporters?: boolean;
}

export interface NodeJasmineRuntime {
  jasmineEnv: jasmine.Env;
  jasmineInstance: any;
  catalog: TestCatalog;
  utils: {
    getCatalog: () => TestCatalog;
    getAllSpecs: () => any[];
    getAllSuites: () => any[];
    getOrderedSpecs: (seed: unknown, random: boolean) => any[];
    getOrderedSuites: (seed: unknown, random: boolean) => any[];
  };
}

export function getAllSpecsFromEnv(jasmineEnv: jasmine.Env): any[] {
  const specs: any[] = [];
  const topSuite = jasmineEnv?.topSuite?.();
  if (!topSuite) return specs;

  const traverse = (suite: any) => {
    suite.children?.forEach((child: any) => {
      if (child && typeof child.id === 'string' && !child.children) {
        specs.push(child);
      }
      if (child?.children) {
        traverse(child);
      }
    });
  };

  traverse(topSuite);
  return specs;
}

export function getAllSuitesFromEnv(jasmineEnv: jasmine.Env): any[] {
  const suites: any[] = [];
  const topSuite = jasmineEnv?.topSuite?.();
  if (!topSuite) return suites;

  const traverse = (suite: any) => {
    suites.push(suite);
    suite.children?.forEach((child: any) => {
      if (child?.children) {
        traverse(child);
      }
    });
  };

  traverse(topSuite);
  return suites;
}

export function orderJasmineItems(
  jasmineInstance: any,
  items: any[],
  seed: unknown,
  random: boolean
): any[] {
  if (!random) return items;

  const OrderCtor = jasmineInstance?.Order;
  try {
    const order = new OrderCtor({ random, seed });
    return typeof order.sort === 'function' ? order.sort(items) : items;
  } catch {
    return items;
  }
}

export function createJasmineRuntimeUtils(
  jasmineEnv: jasmine.Env,
  jasmineInstance: any,
) {
  return {
    getCatalog: () =>
      createTestCatalogFromJasmineEnv(jasmineEnv),
    getAllSpecs: () =>
      getAllSpecsFromEnv(jasmineEnv),
    getAllSuites: () =>
      getAllSuitesFromEnv(jasmineEnv),
    getOrderedSpecs: (
      seed: unknown,
      random: boolean,
    ) =>
      orderJasmineItems(
        jasmineInstance,
        getAllSpecsFromEnv(jasmineEnv),
        seed,
        random,
      ),
    getOrderedSuites: (
      seed: unknown,
      random: boolean,
    ) =>
      orderJasmineItems(
        jasmineInstance,
        getAllSuitesFromEnv(jasmineEnv),
        seed,
        random,
      ),
  };
}

export function exposeNodeJasmineGlobals(
  jasmineRequire: any,
  jasmineInstance: any,
  jasmineEnv: jasmine.Env,
  utils: NodeJasmineRuntime['utils']
): void {
  Object.assign(
    globalThis,
    jasmineRequire.interface(
      jasmineInstance,
      jasmineEnv,
    ),
  );

  globalThis.jasmine = {
    ...(globalThis.jasmine ?? {}),
    ...jasmineInstance,
    ...utils,
  };
}

export function initializeNodeJasmineEnvironment(
  jasmineRequire: any,
  options: NodeJasmineRuntimeOptions = {}
): NodeJasmineRuntime {
  const jasmineInstance =
    jasmineRequire.core(jasmineRequire);
  const jasmineEnv =
    jasmineInstance.getEnv();
  const utils =
    createJasmineRuntimeUtils(
      jasmineEnv,
      jasmineInstance,
    );

  exposeNodeJasmineGlobals(
    jasmineRequire,
    jasmineInstance,
    jasmineEnv,
    utils,
  );

  if (
    options.resetReporters !== false &&
    typeof jasmineEnv.clearReporters === 'function'
  ) {
    jasmineEnv.clearReporters();
  }

  if (
    options.reporter &&
    typeof jasmineEnv.addReporter === 'function'
  ) {
    jasmineEnv.addReporter(options.reporter);
  }

  return {
    jasmineEnv,
    jasmineInstance,
    get catalog() {
      return utils.getCatalog();
    },
    utils,
  };
}

export function getEmbeddedNodeJasmineRuntimeSource(): string {
  return [
    getEmbeddedTestCatalogSource(),
    [
      getAllSpecsFromEnv,
      getAllSuitesFromEnv,
      orderJasmineItems,
      createJasmineRuntimeUtils,
      exposeNodeJasmineGlobals,
      initializeNodeJasmineEnvironment,
    ]
      .map((fn) => fn.toString())
      .join('\n\n'),
  ].join('\n\n');
}
````

## File: src/node-execution-adapter.ts
````typescript
import type { ExecutionPlan } from './execution-plan';
import {
  summarizeExecutionResults,
  type ExecutionResult,
  type ExecutionSpecResult,
} from './execution-result';

export interface NodeExecutionEnvironment {
  configure(
    options: Record<string, unknown>,
  ): void;

  addReporter?(
    reporter: {
      jasmineStarted?(): void;
      specDone?(
        result: ExecutionSpecResult,
      ): void;
      jasmineDone?(): void;
    },
  ): void;

  execute(): void | Promise<void>;
}

export async function executeNodePlan(
  env: NodeExecutionEnvironment,
  plan: ExecutionPlan,
): Promise<ExecutionResult> {
  const specIdSet =
    new Set(plan.specIds);

  const specResults:
    ExecutionSpecResult[] = [];

  env.addReporter?.({
    jasmineStarted() {
      specResults.length = 0;
    },

    specDone(result) {
      if (specIdSet.has(result.id)) {
        specResults.push(result);
      }
    },
  });

  env.configure({
    random: plan.random,
    seed: plan.seed,
    stopOnSpecFailure:
      plan.stopOnFailure ?? false,
    specFilter: (
      spec: { id: string },
    ) => specIdSet.has(spec.id),
  });

  const startedAt =
    Date.now();

  await env.execute();

  return summarizeExecutionResults(
    specResults,
    {
      duration:
        Date.now() - startedAt,
    },
  );
}

export function getEmbeddedNodeExecutionAdapterSource():
  string {
  return [
    summarizeExecutionResults,
    executeNodePlan,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
````

## File: src/test-catalog.spec.ts
````typescript
import { setTestifyFile } from './test-metadata';
import {
  createTestCatalogFromJasmineEnv,
} from './test-catalog';
import {
  getSpecIdsForSuites,
  resolveTestSelector,
} from './test-selection';

describe('TestCatalog', () => {
  const makeSpec = (
    id: string,
    description: string,
    fullName: string,
  ) => ({
    id,
    description,
    getFullName: () => fullName,
  });

  const makeSuite = (
    id: string,
    description: string,
    fullName: string,
    children: any[] = [],
  ) => ({
    id,
    description,
    children,
    getFullName: () => fullName,
  });

  it('captures suite parent ids and spec suite ids from the Jasmine tree', () => {
    const leaf = makeSpec(
      'spec1',
      'works',
      'Parent Child works',
    );

    const child = makeSuite(
      'suite2',
      'Child',
      'Parent Child',
      [leaf],
    );

    const parent = makeSuite(
      'suite1',
      'Parent',
      'Parent',
      [child],
    );

    const top = makeSuite(
      'suite0',
      'Jasmine__TopLevel__Suite',
      '',
      [parent],
    );

    const env = {
      topSuite: () => top,
    } as unknown as jasmine.Env;

    const catalog =
      createTestCatalogFromJasmineEnv(env);

    expect(catalog.rootSuiteId).toBe('suite0');
    expect(catalog.suites).toEqual([
      {
        id: 'suite1',
        description: 'Parent',
        fullName: 'Parent',
        parentSuiteId: undefined,
      },
      {
        id: 'suite2',
        description: 'Child',
        fullName: 'Parent Child',
        parentSuiteId: 'suite1',
      },
    ]);

    expect(catalog.specs).toEqual([
      {
        id: 'spec1',
        description: 'works',
        fullName: 'Parent Child works',
        suiteId: 'suite2',
      },
    ]);
  });

  it('resolves suite ids to every descendant spec', () => {
    const catalog = {
      suites: [
        {
          id: 'suite1',
          description: 'Parent',
          fullName: 'Parent',
        },
        {
          id: 'suite2',
          description: 'Child',
          fullName: 'Parent Child',
          parentSuiteId: 'suite1',
        },
      ],
      specs: [
        {
          id: 'spec1',
          description: 'one',
          fullName: 'Parent one',
          suiteId: 'suite1',
        },
        {
          id: 'spec2',
          description: 'two',
          fullName: 'Parent Child two',
          suiteId: 'suite2',
        },
      ],
    };

    expect(
      getSpecIdsForSuites(
        catalog,
        ['suite1'],
      ),
    ).toEqual(['spec1', 'spec2']);

    expect(
      resolveTestSelector(
        catalog,
        'suite1',
      ),
    ).toEqual(['spec1', 'spec2']);
  });
});


describe('TestCatalog file ownership', () => {
  it('captures file ownership from Jasmine metadata', () => {
    const spec = {
      id: 'spec1',
      description: 'works',
      getFullName: () => 'Forms works',
    };

    const suite = {
      id: 'suite1',
      description: 'Forms',
      _filePath: 'forms.spec.js',
      children: [spec],
      getFullName: () => 'Forms',
    };

    setTestifyFile(spec, 'forms.spec.js');
    setTestifyFile(suite, 'forms.spec.js');

    const top = {
      id: 'suite0',
      description: 'Jasmine__TopLevel__Suite',
      children: [suite],
      getFullName: () => '',
    };

    const env = {
      topSuite: () => top,
    } as unknown as jasmine.Env;

    const catalog =
      createTestCatalogFromJasmineEnv(env);

    expect(catalog.suites[0]!.file).toBe(
      'forms.spec.js',
    );
    expect(catalog.specs[0]!.file).toBe(
      'forms.spec.js',
    );
  });
});
````

## File: src/test-catalog.ts
````typescript
import { getTestifyFile } from './test-metadata';

export interface TestCatalogSuite {
  id: string;
  description: string;
  fullName: string;
  parentSuiteId?: string;
  file?: string;
}

export interface TestCatalogSpec {
  id: string;
  description: string;
  fullName: string;
  suiteId?: string;
  file?: string;
}

export interface TestCatalog {
  rootSuiteId?: string;
  suites: TestCatalogSuite[];
  specs: TestCatalogSpec[];
}

function getItemDescription(item: any): string {
  if (typeof item?.description === 'string') {
    return item.description;
  }

  return item?.id ?? '';
}

function getItemFullName(item: any): string {
  if (typeof item?.getFullName === 'function') {
    return item.getFullName();
  }

  return getItemDescription(item);
}

function getItemFile(item: any): string | undefined {
  return getTestifyFile(item);
}

function isSuite(item: any): boolean {
  return !!item && Array.isArray(item.children);
}

function isSpec(item: any): boolean {
  return (
    !!item &&
    typeof item.id === 'string' &&
    !Array.isArray(item.children)
  );
}

export function createTestCatalogFromJasmineEnv(
  jasmineEnv: jasmine.Env,
): TestCatalog {
  const topSuite = jasmineEnv?.topSuite?.();

  if (!topSuite) {
    return {
      suites: [],
      specs: [],
    };
  }

  const suites: TestCatalogSuite[] = [];
  const specs: TestCatalogSpec[] = [];

  const traverseSuite = (
    suite: any,
    parentSuiteId?: string,
    includeInCatalog = true,
  ): void => {
    if (includeInCatalog) {
      suites.push({
        id: suite.id,
        description: getItemDescription(suite),
        fullName: getItemFullName(suite),
        parentSuiteId,
        file: getItemFile(suite),
      });
    }

    const owningSuiteId = includeInCatalog
      ? suite.id
      : undefined;

    for (const child of suite.children ?? []) {
      if (isSuite(child)) {
        traverseSuite(
          child,
          owningSuiteId,
          true,
        );
        continue;
      }

      if (isSpec(child)) {
        specs.push({
          id: child.id,
          description: getItemDescription(child),
          fullName: getItemFullName(child),
          suiteId: owningSuiteId,
          file: getItemFile(child) ?? getItemFile(suite),
        });
      }
    }
  };

  // Jasmine's top suite is an implementation root rather than an authored
  // suite. Keep its id as metadata but expose only authored suites.
  traverseSuite(topSuite, undefined, false);

  return {
    rootSuiteId:
      typeof topSuite.id === 'string'
        ? topSuite.id
        : undefined,
    suites,
    specs,
  };
}

export function getCatalogSpecIds(
  catalog: TestCatalog,
): string[] {
  return catalog.specs.map((spec) => spec.id);
}

export function getCatalogSuiteIds(
  catalog: TestCatalog,
): string[] {
  return catalog.suites.map((suite) => suite.id);
}

export function getEmbeddedTestCatalogSource(): string {
  return [
    getItemDescription,
    getItemFullName,
    getItemFile,
    isSuite,
    isSpec,
    createTestCatalogFromJasmineEnv,
    getCatalogSpecIds,
    getCatalogSuiteIds,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}


export function getCatalogFiles(
  catalog: TestCatalog,
): string[] {
  return [
    ...new Set(
      [
        ...catalog.suites.map((suite) => suite.file),
        ...catalog.specs.map((spec) => spec.file),
      ].filter(
        (file): file is string => !!file,
      ),
    ),
  ].sort();
}

export function getSpecIdsForFile(
  catalog: TestCatalog,
  file: string,
): string[] {
  return catalog.specs
    .filter((spec) => spec.file === file)
    .map((spec) => spec.id);
}
````

## File: vite.cli.config.ts
````typescript
import fs from 'fs';
import path from 'path';
import { builtinModules } from 'module';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const configFilePath = fileURLToPath(import.meta.url);
const configDirectory = path.dirname(configFilePath);

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

const dependencyExternals = new Set([
  ...(pkg.bundleDependencies || []),
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'playwright-core',
  'fsevents'
]);

const builtinExternals = new Set(builtinModules);

const isExternal = (id: string) => {
  if (id.startsWith('node:')) return true;
  if (builtinExternals.has(id)) return true;

  return Array.from(dependencyExternals).some(
    (dep) => id === dep || id.startsWith(`${dep}/`)
  );
};

export default defineConfig({
  build: {
    target: 'node22',
    ssr: true,
    modulePreload: false,
    outDir: 'dist/testify/',
    emptyOutDir: false,
    minify: false,
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: path.resolve(configDirectory, './src/index.ts'),
      output: {
        entryFileNames: 'bin/testify',
        format: 'es',
        inlineDynamicImports: true,
        banner: `#!/usr/bin/env node
import { createRequire as ___createRequire } from 'module';
const require = ___createRequire(import.meta.url);
`,
        manualChunks: undefined,
        paths: (id) => {
          const match = id.match(/node_modules[\\/](.+?)([\\/]|$)/);
          return match ? match[1] : id;
        }
      },
      external: (id) => {
        if (id.includes('node_modules')) return true;
        return isExternal(id);
      }
    }
  }
});
````

## File: vite.lib.config.ts
````typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/testify/lib',
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/lib.ts'),
        v2: resolve(__dirname, 'src/v2.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        'fs',
        'path',
        'url',
        'module',
        'util',
        'os',
        'child_process',
      ],
    },
  },
});
````

## File: src/file-discovery-service.ts
````typescript
import { glob } from "glob";
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { norm } from "./utils";
import * as fs from "fs/promises";
import * as path from "path";
import { createHash } from 'crypto';
import { logger } from './logger';
import { FileDiscoveryMessages } from './log-messages';

export class FileDiscoveryService {
  constructor(private config: ViteJasmineConfig) {}

  private getSrcDirConfigs(): string[] {
    const srcDirs = Array.isArray(this.config.srcDirs) ? this.config.srcDirs : [this.config.srcDirs];
    if (srcDirs.filter(Boolean).length === 0) return ['./src'];
    return srcDirs.filter(Boolean) as string[];
  }

  private getTestDirConfigs(): string[] {
    const testDirs = Array.isArray(this.config.testDirs) ? this.config.testDirs : [this.config.testDirs];
    if (testDirs.filter(Boolean).length === 0) return ['./tests'];
    return testDirs.filter(Boolean) as string[];
  }

  async scanDir(dir: string, pattern: string, exclude: string[] = []): Promise<string[]> {
    const cleanPattern = pattern.startsWith('/') || pattern.startsWith('**') 
      ? pattern 
      : `/${pattern}`;
    const basePath = norm(path.join(dir, cleanPattern)).replace(/^\//, '');
    
    try {
      let files = await glob(basePath, { absolute: true, ignore: exclude });
      return files.map((s) => norm(s));
    } catch (error) {
      logger.error(FileDiscoveryMessages.errorDiscoveringFiles(error));
      throw new Error("Failed to discover source and test files");
    }
  }

  async filterExistingFiles(paths: string[]): Promise<string[]> {
    const results = await Promise.all(
      paths.map(async (filePath) => {
        const normalizedPath = norm(filePath);
        try {
          await fs.access(normalizedPath);
          return normalizedPath;
        } catch {
          return null;
        }
      })
    );
    return results.filter((p): p is string => p !== null);
  }

  async discoverSources(): Promise<{ srcFiles: string[]; specFiles: string[] }> {
    try {
      const defaultSrcExclude = ["**/node_modules/**", "**/*.spec.*"];
      const defaultTestExclude = ["**/node_modules/**"];
      const sharedExclude = this.config.exclude ?? [];

      const srcDirs = this.getSrcDirConfigs();
      const testDirs = this.getTestDirConfigs();

      const srcFiles: string[] = [];
      for (const inc of srcDirs) {
        const exclude = [...defaultSrcExclude, ...sharedExclude];
        const files = await this.scanDir(norm(inc), '/**/*.{ts,js,mjs}', exclude);
        srcFiles.push(...files);
      }

      const specFiles: string[] = [];
      for (const inc of testDirs) {
        const exclude = [...defaultTestExclude, ...sharedExclude];
        const files = await this.scanDir(norm(inc), '/**/*.spec.{ts,js,mjs}', exclude);
        specFiles.push(...files);
      }

      return { srcFiles: [...new Set(srcFiles)], specFiles: [...new Set(specFiles)] };
    } catch (error) {
      logger.error(FileDiscoveryMessages.errorDiscoveringFiles(error));
      throw new Error("Failed to discover source and test files");
    }
  }

  getOutputName(filePath: string): string {
    const srcDirs = this.getSrcDirConfigs();
    const testDirs = this.getTestDirConfigs();
    const normalizedPath = norm(path.resolve(filePath));

    const resolveDirs = (dirs: string[]) =>
      dirs.map((dir) => norm(path.resolve(dir)));

    const normalizedSrcDirs = resolveDirs(srcDirs);
    const normalizedTestDirs = resolveDirs(testDirs);
    if (!normalizedSrcDirs.length) {
      normalizedSrcDirs.push(norm(path.resolve('./src')));
    }
    if (!normalizedTestDirs.length) {
      normalizedTestDirs.push(norm(path.resolve('./tests')));
    }

    const matchDir = (dirs: string[]): string | null => {
      for (const candidate of dirs) {
        if (
          normalizedPath === candidate ||
          normalizedPath.startsWith(`${candidate}/`)
        ) {
          return candidate;
        }
      }
      return null;
    };

    const baseTest = matchDir(normalizedTestDirs);
    const baseSrc = matchDir(normalizedSrcDirs) ?? normalizedSrcDirs[0];
    const base = baseTest ?? baseSrc;

    const relativePath = path.relative(base, normalizedPath);
    const relativeNormalized = norm(relativePath);
    const relativeWithoutExt = relativeNormalized.replace(/\.(ts|js|mjs)$/, '');
    const isSpecFile = relativeWithoutExt.endsWith('.spec');
    const stemPath = isSpecFile
      ? relativeWithoutExt.slice(0, -'.spec'.length)
      : relativeWithoutExt;

    const sanitizeSegment = (segment: string) => {
      if (segment === '..') return 'up';
      if (segment === '.') return 'dot';
      return segment;
    };

    const segments = stemPath.split('/').filter(Boolean).map(sanitizeSegment);
    const fileName = segments.pop() ?? sanitizeSegment(path.basename(stemPath) || 'index');

    const hash = createHash('sha1')
      .update(normalizedPath)
      .digest('hex')
      .slice(0, 8);

    if (isSpecFile) {
      const prefix = segments.join('_');
      const flattened = prefix ? `${prefix}__${fileName}` : fileName;
      return `${flattened}__${hash}.spec.js`;
    }

    const sanitized =
      segments.length > 0 ? `${segments.join('_')}__${fileName}` : fileName;
    
    return `${sanitized}__${hash}.js`;
  }
}
````

## File: src/logger.ts
````typescript
import { supportsColor } from './ansi-constants';
import { LOG_MESSAGES, LogMessageTemplate } from './messages';
import { replacePlaceholders } from './symbols';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  brightRed: '\x1b[91m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  brightGreen: '\x1b[92m',
  gray: '\x1b[90m',
};

type LogMessageKey = keyof typeof LOG_MESSAGES;

interface LoggedLine {
  text: string;
  isRaw?: boolean;
  hasPrompt?: boolean;
}

export class Logger {
  private previousLines: LoggedLine[] = [];
  private showPrompt = true;
  private prompt: string;
  private errorPrompt: string;
  private plainPrompt = '> ';
  private plainErrorPrompt = '> ';

  constructor() {
    this.prompt = `${colors.bold}${colors.brightGreen}> ${colors.reset}`;
    this.errorPrompt = `${colors.brightRed}> ${colors.reset}`;
  }

  // ─── New API: structured log messages ────────────────────

  public log<T extends LogMessageKey>(
    key: T,
    ...args: Parameters<(typeof LOG_MESSAGES)[T]['text']>
  ) {
    const template: LogMessageTemplate = LOG_MESSAGES[key];
    const rawMessage = template.text(...args);
    const { formattedMessage, stream } = this.formatStructured(rawMessage, template);
    stream.write(formattedMessage + '\n');
  }

  private formatStructured(
    rawMessage: string,
    template: LogMessageTemplate
  ): { formattedMessage: string; stream: NodeJS.WriteStream } {
    const { type, icon } = template;
    let color = colors.reset;
    let stream: NodeJS.WriteStream = process.stdout;
    let messageContent = rawMessage;

    switch (type) {
      case 'error':
        color = colors.red;
        stream = process.stderr;
        break;
      case 'warning':
        color = colors.yellow;
        break;
      case 'info':
        color = colors.cyan;
        break;
      case 'debug':
        color = colors.blue;
        break;
    }

    if (supportsColor()) {
      const iconStr = icon ? `${icon} ` : '';
      const prefixMatch = rawMessage.match(/^\[.*?\]\s*(.*)/);
      messageContent = prefixMatch && prefixMatch[1] ? prefixMatch[1] : rawMessage;
      return { formattedMessage: `${color}${iconStr}${messageContent}${colors.reset}`, stream };
    }

    const tag = `[${template.type.toUpperCase()}]`;
    const prefixMatch = rawMessage.match(/^\[.*?\]\s*(.*)/);
    messageContent = prefixMatch && prefixMatch[1] ? prefixMatch[1] : rawMessage;
    return { formattedMessage: `${tag} ${messageContent}`, stream };
  }

  // ─── Legacy API: direct printing ─────────────────────────

  print(msg: string) {
    msg = replacePlaceholders(msg);
    const prompt = supportsColor() ? this.prompt : this.plainPrompt;
    const fullMessage = this.showPrompt ? prompt + msg : msg;
    const lines = fullMessage.split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.writeLine(lines[i]);
      if (i < lines.length - 1) process.stdout.write('\n');
      this.addLine(lines[i]);
    }
    this.showPrompt = false;
    return true;
  }

  println(msg = '') {
    if (msg) this.print(msg);
    process.stdout.write('\n');
    this.addLine('');
    this.showPrompt = true;
    return true;
  }

  printRaw(line: string) {
    process.stdout.write(line);
    this.addLine(line, { isRaw: true });
    return true;
  }

  printlnRaw(line = '') {
    this.printRaw(line);
    process.stdout.write('\n');
    this.addLine('', { isRaw: true });
    return true;
  }

  error(msg: string) {
    msg = replacePlaceholders(msg);
    const prompt = supportsColor() ? this.errorPrompt : this.plainErrorPrompt;
    const fullMessage = this.showPrompt ? prompt + msg : msg;
    const lines = fullMessage.split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.writeLine(lines[i], colors.brightRed);
      if (i < lines.length - 1) process.stdout.write('\n');
      this.addLine(lines[i]);
    }
    process.stdout.write('\n');
    this.showPrompt = true;
    return true;
  }

  clearLine() {
    if (!supportsColor()) return;
    process.stdout.write('\r\x1b[K');
  }

  // ─── Utilities ───────────────────────────────────────────

  normalize(text: string): string {
    return text
      .replace(/\s*\r?\n\s*/g, '')
      .replace(/[\uFEFF\xA0\t]/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  visibleWidth(str: string): number {
    const ANSI_FULL_REGEX =
      /\x1B(?:[@-Z\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;
    return [...str.replace(ANSI_FULL_REGEX, '')].length;
  }

  // ─── Internal helpers ────────────────────────────────────

  private writeLine(line: string, color = '') {
    if (supportsColor()) {
      this.clearLine();
      process.stdout.write(color + line + colors.reset);
    } else {
      process.stdout.write(line);
    }
  }

  private addLine(text: string, opts: Partial<LoggedLine> = {}) {
    this.previousLines.push({
      text,
      isRaw: opts.isRaw,
      hasPrompt: opts.hasPrompt ?? this.showPrompt,
    });
    if (this.previousLines.length > 200) {
      this.previousLines.splice(0, 100);
    }
  }
}

// Export a singleton instance for project-wide use
export const logger = new Logger();
````

## File: src/vite-jasmine-config.ts
````typescript
import type { InlineConfig } from "vite";
import type { RollupOptions, WarningHandlerWithDefault } from "rollup";

export interface ImportEntry {
  name: string;
  path: string;
}

export interface ViteJasmineConfig {
  srcDirs: string[];
  testDirs: string[];
  exclude: string[];
  outDir: string;

  browser?: string;
  port?: number;
  coverage?: boolean;
  headless?: boolean;
  watch?: boolean;
  suppressConsoleLogs?: boolean;
  preserveOutputs: boolean;
  ansi?: boolean;
  
  tsconfig?: string;
  viteConfig?: InlineConfig;
  viteBuildOptions?: {
    target?: string;
    sourcemap?: boolean;
    minify?: boolean;
    preserveModules?: boolean;
    preserveModulesRoot?: string;
  };
  jasmineConfig?: {
    env?: { 
      stopSpecOnExpectationFailure?: boolean; 
      random?: boolean; 
      seed?: number;
      timeout?: number; 
    };
  };
  htmlOptions?: {
    title?: string;
    preludeModules?: string[];
  };
  angularOptions?: {
    enableJitCompiler?: boolean;
  };
  project?: string;
}

// Type-safe Rollup options with onwarn handler
export interface TypedRollupOptions extends Partial<RollupOptions> {
  onwarn?: WarningHandlerWithDefault;
}
````

## File: src/ansi-constants.ts
````typescript
// ─── Terminal width ─────────────────────────────────────────
export const getMaxWidth = (): number =>
  typeof process !== 'undefined' && process.stdout?.columns
    ? Math.max(40, process.stdout.columns)
    : 80;

/** @deprecated Use getMaxWidth() for accurate terminal width */
export const MAX_WIDTH = getMaxWidth();

// ─── ANSI regex ────────────────────────────────────────────
export const ANSI_FULL_REGEX =
  /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;

// ─── Emoji support ─────────────────────────────────────────
let ansiMode = false;

export function setAnsiMode(value = true): void {
  ansiMode = value;
  if (value) {
    process.env.NO_EMOJI = '1';
    process.env.NO_COLOR = '1';
  }
}

export function isAnsiMode(): boolean {
  return ansiMode;
}

export function supportsEmoji(): boolean {
  if (ansiMode) return false;
  if (process.env.NO_EMOJI) return false;
  if (process.env.FORCE_EMOJI) return true;
  return process.stdout.isTTY ?? false;
}

export function supportsColor(): boolean {
  if (ansiMode) return false;
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR === '1' || process.env.FORCE_COLOR === 'true' || process.env.FORCE_COLOR) return true;
  return process.stdout.isTTY ?? false;
}
````

## File: src/runner-session.spec.ts
````typescript
import {
  RunnerSession,
} from './runner-session';
import type {
  TestCatalog,
} from './test-catalog';

describe('RunnerSession', () => {
  const catalog: TestCatalog = {
    suites: [
      {
        id: 'suite1',
        description: 'Forms',
        fullName: 'Forms',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'works',
        fullName: 'Forms works',
        suiteId: 'suite1',
        file: 'forms.spec.js',
      },
    ],
  };

  it('plans and executes through one adapter', async () => {
    let executedIds:
      string[] = [];

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute(plan) {
            executedIds =
              plan.specIds;

            return plan.specIds.length;
          },
        },
      );

    const result =
      await session.runSuite(
        'suite1',
      );

    expect(result).toBe(1);
    expect(executedIds).toEqual([
      'spec1',
    ]);
  });

  it('exposes reusable plans', () => {
    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
        },
        () => ({
          random: true,
          seed: 42,
        }),
      );

    const plan =
      session.planFile(
        'forms.spec.js',
      );

    expect(plan.specIds).toEqual([
      'spec1',
    ]);
    expect(plan.random).toBeTrue();
    expect(plan.seed).toBe(42);
  });

  it('queries catalog through the shared session', () => {
    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    expect(
      session.listTests(),
    ).toHaveSize(1);

    expect(
      session.listSuites(),
    ).toHaveSize(1);

    expect(
      session.listFiles(),
    ).toEqual([
      {
        file: 'forms.spec.js',
        specs: 1,
      },
    ]);
  });

  it('memoizes an index for the current catalog instance', () => {
    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    const first =
      session.index();

    const second =
      session.index();

    expect(second).toBe(first);

    expect(
      first.specById.get(
        'spec1',
      )?.description,
    ).toBe('works');
  });

  it('queries indexed text through the session', () => {
    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    expect(
      session.findTests(
        'works',
      )[0]?.id,
    ).toBe('spec1');

    expect(
      session.findSuites(
        'Forms',
      )[0]?.id,
    ).toBe('suite1');

    expect(
      session.findFiles(
        /forms/,
      )[0]?.file,
    ).toBe('forms.spec.js');
  });

  it('reports session stats', () => {
    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    expect(
      session.stats(),
    ).toEqual({
      specs: 1,
      suites: 1,
      files: 1,
    });
  });
});
````

## File: src/test-selection.ts
````typescript
import {
  createTestCatalogIndex,
  getSpecIdsForSuitesFromIndex,
  searchIndexEntries,
} from './test-catalog-index';
import type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';

export type TestSelector =
  | string
  | RegExp
  | {
      spec?: string | RegExp;
      suite?: string | RegExp;
      file?: string | RegExp;
    };

function matchesText(
  selector: string | RegExp,
  ...values: Array<string | undefined>
): boolean {
  if (typeof selector === 'string') {
    return values.some(
      (value) =>
        value === selector ||
        value?.includes(selector),
    );
  }

  return values.some((value) => {
    if (!value) return false;
    selector.lastIndex = 0;
    return selector.test(value);
  });
}

export function findCatalogSpecs(
  catalog: TestCatalog,
  selector: string | RegExp,
): TestCatalogSpec[] {
  const index =
    createTestCatalogIndex(
      catalog,
    );

  return searchIndexEntries(
    index.specSearch,
    selector,
  )
    .map(
      (id) =>
        index.specById.get(id),
    )
    .filter(
      (
        spec,
      ): spec is TestCatalogSpec =>
        !!spec,
    );
}

export function findCatalogSuites(
  catalog: TestCatalog,
  selector: string | RegExp,
): TestCatalogSuite[] {
  const index =
    createTestCatalogIndex(
      catalog,
    );

  return searchIndexEntries(
    index.suiteSearch,
    selector,
  )
    .map(
      (id) =>
        index.suiteById.get(id),
    )
    .filter(
      (
        suite,
      ): suite is TestCatalogSuite =>
        !!suite,
    );
}

export function getDescendantSuiteIds(
  catalog: TestCatalog,
  suiteIds: Iterable<string>,
): Set<string> {
  const selected = new Set(suiteIds);
  let changed = true;

  while (changed) {
    changed = false;

    for (const suite of catalog.suites) {
      if (
        suite.parentSuiteId &&
        selected.has(suite.parentSuiteId) &&
        !selected.has(suite.id)
      ) {
        selected.add(suite.id);
        changed = true;
      }
    }
  }

  return selected;
}

export function getSpecIdsForSuites(
  catalog: TestCatalog,
  suiteIds: Iterable<string>,
): string[] {
  const selectedSuites =
    getDescendantSuiteIds(catalog, suiteIds);

  return catalog.specs
    .filter(
      (spec) =>
        !!spec.suiteId &&
        selectedSuites.has(spec.suiteId),
    )
    .map((spec) => spec.id);
}

export function getSpecIdsForFiles(
  catalog: TestCatalog,
  selector: string | RegExp,
): string[] {
  const index =
    createTestCatalogIndex(
      catalog,
    );

  if (typeof selector === 'string') {
    const exact =
      index.specIdsByFile.get(
        selector,
      );

    if (exact) {
      return [...exact];
    }
  }

  const matchingFiles =
    searchIndexEntries(
      index.fileSearch,
      selector,
    );

  return matchingFiles.flatMap(
    (file) =>
      index.specIdsByFile.get(
        file,
      ) ?? [],
  );
}

export function resolveTestSelector(
  catalog: TestCatalog,
  selector: TestSelector,
): string[] {
  if (typeof selector === 'string') {
    const index =
      createTestCatalogIndex(catalog);

    const exactSpec =
      index.specById.get(selector);

    if (exactSpec) {
      return [exactSpec.id];
    }

    const exactSuite =
      index.suiteById.get(selector);

    if (exactSuite) {
      return getSpecIdsForSuitesFromIndex(
        index,
        [exactSuite.id],
      );
    }

    return findCatalogSpecs(
      catalog,
      selector,
    ).map((spec) => spec.id);
  }

  if (selector instanceof RegExp) {
    return findCatalogSpecs(
      catalog,
      selector,
    ).map((spec) => spec.id);
  }

  if (selector.spec) {
    return findCatalogSpecs(
      catalog,
      selector.spec,
    ).map((spec) => spec.id);
  }

  if (selector.suite) {
    const suites = findCatalogSuites(
      catalog,
      selector.suite,
    );

    return getSpecIdsForSuitesFromIndex(
      createTestCatalogIndex(catalog),
      suites.map((suite) => suite.id),
    );
  }

  if (selector.file) {
    return getSpecIdsForFiles(
      catalog,
      selector.file,
    );
  }

  return [];
}


export function getEmbeddedTestSelectionSource(): string {
  return [
    createTestCatalogIndex,
    getSpecIdsForSuitesFromIndex,
    searchIndexEntries,
    matchesText,
    findCatalogSpecs,
    findCatalogSuites,
    getDescendantSuiteIds,
    getSpecIdsForSuites,
    getSpecIdsForFiles,
    resolveTestSelector,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
````

## File: src/v2.ts
````typescript
export {
  RunnerSession,
} from './runner-session';

export type {
  TestifyRunnerSession,
} from './runner-session';

export type {
  RunnerSessionAdapter,
  RunnerSessionOptions,
} from './runner-session';

export {
  createExecutionPlan,
  createFileExecutionPlan,
  createSpecExecutionPlan,
  createSuiteExecutionPlan,
} from './execution-plan';

export type {
  ExecutionPlan,
  ExecutionPlanOptions,
} from './execution-plan';

export {
  createTestCatalogIndex,
  normalizeSearchText,
  searchIndexEntries,
} from './test-catalog-index';

export type {
  SearchIndexEntry,
  TestCatalogIndex,
} from './test-catalog-index';

export {
  listCatalogFiles,
  listCatalogSuites,
  listCatalogTests,
} from './catalog-query';

export type {
  FileListRow,
  SuiteListRow,
  TestListRow,
} from './catalog-query';

export {
  findCatalogSpecs,
  findCatalogSuites,
  getSpecIdsForFiles,
  resolveTestSelector,
} from './test-selection';

export type {
  TestSelector,
} from './test-selection';

export type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';

export {
  summarizeExecutionResults,
} from './execution-result';

export type {
  ExecutionResult,
  ExecutionSpecResult,
} from './execution-result';

export {
  applyExecutionExitCode,
  getExecutionExitCode,
} from './cli-result-adapter';
````

## File: src/config-manager.ts
````typescript
import * as fs from 'fs';
import * as path from 'path';
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { norm } from './utils';
import JSONCleaner from './json-cleaner';
import { logger } from './logger';
import { ExitCodeError, EXIT_CODES } from './exit-codes';
import { ConfigMessages } from './log-messages';

export class ConfigManager {
  static ensureConfigExists(configPath?: string): ViteJasmineConfig {
    const jsonPath = norm(configPath || path.resolve(process.cwd(), 'testify.json'));
    const cleaner = new JSONCleaner();

    if (fs.existsSync(jsonPath)) {
      try {
        return cleaner.parse(fs.readFileSync(jsonPath, 'utf-8'));
      } catch (error) {
        throw new ExitCodeError(
          EXIT_CODES.CONFIG_ERROR,
          ConfigMessages.failedToParseConfig(error),
        );
      }
    }

    const defaultConfig = this.createDefaultConfig();

    try {
      fs.writeFileSync(jsonPath, JSON.stringify(defaultConfig, null, 2));
      logger.println(ConfigMessages.createdDefaultConfig(jsonPath));
    } catch (error) {
      throw new ExitCodeError(
        EXIT_CODES.CONFIG_ERROR,
        ConfigMessages.failedToCreateConfig(error),
      );
    }

    return defaultConfig;
  }

  static createDefaultConfig(): ViteJasmineConfig {
    const configDir = norm(process.cwd()); // folder where testify.json will be located

    const rel = (p: string) => {
      const r = path.relative(configDir, p);
      return r === "" ? "." : norm(r);
    };

    const srcAbsolute = path.join(configDir, 'src');
    const testAbsolute = path.join(configDir, 'tests');
    const outAbsolute = path.join(configDir, "dist/.vite-jasmine-build/");

    return {
      srcDirs: [rel(srcAbsolute)],              // ["./src"]
      testDirs: [rel(testAbsolute)],            // ["./tests"]
      exclude: ["**/node_modules/**"],
      preserveOutputs: false,
      outDir: rel(outAbsolute),                 // "./dist/.vite-jasmine-build"
      browser: 'chrome',
      headless: false,
      coverage: false,
      port: 8888,

      viteBuildOptions: {
        target: 'es2022',
        sourcemap: true,
        minify: false,
        preserveModules: false,
        preserveModulesRoot: '.'
      },

      jasmineConfig: {
        env: { stopSpecOnExpectationFailure: false, random: true, seed: 0, timeout: 120000 }
      },

      htmlOptions: {
        title: 'Jasmine Test Runner',
        preludeModules: []
      },
      suppressConsoleLogs: false
    };
  }

  static initViteJasmineConfig(configPath?: string): void {
    const jsonPath = norm(configPath || path.resolve(process.cwd(), 'testify.json'));

    if (fs.existsSync(jsonPath)) {
      logger.println(ConfigMessages.configAlreadyExists(jsonPath));
      return;
    }

    const defaultConfig = this.createDefaultConfig();
    try {
      fs.writeFileSync(jsonPath, JSON.stringify(defaultConfig, null, 2));
    } catch (error) {
      throw new ExitCodeError(
        EXIT_CODES.CONFIG_ERROR,
        ConfigMessages.failedToWriteConfig(error),
      );
    }
    logger.println(ConfigMessages.generatedDefaultConfig(jsonPath));
  }

  static loadViteJasmineBrowserConfig(configPath?: string): ViteJasmineConfig {
    return this.ensureConfigExists(configPath);
  }
}
````

## File: src/runner-session.ts
````typescript
import type {
  TestCatalog,
} from './test-catalog';
import {
  findCatalogSpecs,
  findCatalogSuites,
  type TestSelector,
} from './test-selection';
import {
  createExecutionPlan,
  createFileExecutionPlan,
  createSpecExecutionPlan,
  createSuiteExecutionPlan,
  type ExecutionPlan,
  type ExecutionPlanOptions,
} from './execution-plan';
import {
  listCatalogFiles,
  listCatalogSuites,
  listCatalogTests,
  type FileListRow,
  type SuiteListRow,
  type TestListRow,
} from './catalog-query';
import {
  createTestCatalogIndex,
  searchIndexEntries,
  type TestCatalogIndex,
} from './test-catalog-index';

export interface RunnerSessionAdapter<TResult> {
  execute(
    plan: ExecutionPlan,
  ): Promise<TResult>;
}

export interface RunnerSessionOptions
  extends ExecutionPlanOptions {}

export class RunnerSession<TResult> {
  private indexedCatalog:
    TestCatalog | null = null;

  private catalogIndexValue:
    TestCatalogIndex | null = null;

  constructor(
    private readonly getCatalogValue:
      () => TestCatalog,
    private readonly adapter:
      RunnerSessionAdapter<TResult>,
    private readonly getOptions:
      () => RunnerSessionOptions =
        () => ({}),
  ) {}

  catalog(): TestCatalog {
    return this.getCatalogValue();
  }

  index(): TestCatalogIndex {
    const catalog =
      this.catalog();

    if (
      catalog !== this.indexedCatalog ||
      !this.catalogIndexValue
    ) {
      this.indexedCatalog =
        catalog;

      this.catalogIndexValue =
        createTestCatalogIndex(
          catalog,
        );
    }

    return this.catalogIndexValue;
  }

  listTests(): TestListRow[] {
    return listCatalogTests(
      this.catalog(),
    );
  }

  listSuites(): SuiteListRow[] {
    return listCatalogSuites(
      this.catalog(),
    );
  }

  listFiles(): FileListRow[] {
    return listCatalogFiles(
      this.catalog(),
    );
  }

  findTests(
    selector: string | RegExp,
  ): TestListRow[] {
    const catalog =
      this.catalog();

    const selectedIds =
      new Set(
        findCatalogSpecs(
          catalog,
          selector,
        ).map(
          (spec) => spec.id,
        ),
      );

    return listCatalogTests(
      catalog,
    ).filter(
      (row) =>
        selectedIds.has(
          row.id,
        ),
    );
  }

  findSuites(
    selector: string | RegExp,
  ): SuiteListRow[] {
    const catalog =
      this.catalog();

    const selectedIds =
      new Set(
        findCatalogSuites(
          catalog,
          selector,
        ).map(
          (suite) => suite.id,
        ),
      );

    return listCatalogSuites(
      catalog,
    ).filter(
      (row) =>
        selectedIds.has(
          row.id,
        ),
    );
  }

  stats(): {
    specs: number;
    suites: number;
    files: number;
  } {
    const catalog = this.catalog();

    return {
      specs: catalog.specs.length,
      suites: catalog.suites.length,
      files: this.listFiles().length,
    };
  }

  findFiles(
    selector: string | RegExp,
  ): FileListRow[] {
    const index =
      this.index();

    const fileIds =
      new Set(
        searchIndexEntries(
          index.fileSearch,
          selector,
        ),
      );

    return listCatalogFiles(
      this.catalog(),
    ).filter(
      (row) =>
        fileIds.has(
          row.file,
        ),
    );
  }

  plan(
    selector?: TestSelector,
  ): ExecutionPlan {
    return createExecutionPlan(
      this.catalog(),
      selector,
      this.getOptions(),
    );
  }

  planSpec(
    selector: string | RegExp,
  ): ExecutionPlan {
    return createSpecExecutionPlan(
      this.catalog(),
      selector,
      this.getOptions(),
    );
  }

  planSuite(
    selector: string | RegExp,
  ): ExecutionPlan {
    return createSuiteExecutionPlan(
      this.catalog(),
      selector,
      this.getOptions(),
    );
  }

  planFile(
    selector: string | RegExp,
  ): ExecutionPlan {
    return createFileExecutionPlan(
      this.catalog(),
      selector,
      this.getOptions(),
    );
  }

  execute(
    plan: ExecutionPlan,
  ): Promise<TResult> {
    return this.adapter.execute(plan);
  }

  run(
    selector?: TestSelector,
  ): Promise<TResult> {
    return this.execute(
      this.plan(selector),
    );
  }

  runSpec(
    selector: string | RegExp,
  ): Promise<TResult> {
    return this.execute(
      this.planSpec(selector),
    );
  }

  runSuite(
    selector: string | RegExp,
  ): Promise<TResult> {
    return this.execute(
      this.planSuite(selector),
    );
  }

  runFile(
    selector: string | RegExp,
  ): Promise<TResult> {
    return this.execute(
      this.planFile(selector),
    );
  }
}

export function getEmbeddedRunnerSessionSource():
  string {
  return [
    RunnerSession,
  ]
    .map((value) => value.toString())
    .join('\n\n');
}


export type TestifyRunnerSession =
  RunnerSession<
    import('./execution-result')
      .ExecutionResult
  >;
````

## File: src/websocket-manager.ts
````typescript
import { EventEmitter } from 'events';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import JSONCleaner from './json-cleaner';
import { Reporter } from './compound-reporter';
import { HmrManager, HmrUpdate } from './hmr-manager';
import { FileDiscoveryService } from './file-discovery-service';
import { ViteJasmineConfig } from './vite-jasmine-config';
import path from 'path';
import { logger } from './logger';
import { WebSocketMessages } from './log-messages';

export class WebSocketManager extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private wsClients: WebSocket[] = [];
  private hmrManager: HmrManager | null = null;
  private hmrEnabled: boolean = false;
  private jsonCleaner = new JSONCleaner();
  private failedSpecsCount: number = 0;
  private pendingSpecsCount: number = 0;

  constructor(private fileDiscovery: FileDiscoveryService, private config: ViteJasmineConfig, private server: http.Server, private reporter: Reporter) {
    super();
    this.createWebSocketServer();
  }

  private createWebSocketServer(): void {
    this.wss = new WebSocketServer({ server: this.server });
    
    this.wss.on('connection', async (ws: WebSocket) => {
      logger.println(WebSocketMessages.clientConnected());
      this.wsClients.push(ws);
      // Send HMR status on connection
      if (this.hmrEnabled) {
        const files = await this.fileDiscovery.scanDir(this.config.outDir, '/**/*.{js,mjs}');
        this.sendToClient(ws, { 
          type: 'hmr:connected',
          specFiles: files
            .filter(file => /\.spec\.(?:js|mjs)$/i.test(file))
            .map(file => path.basename(file))
            .sort(),
          enabled: true 
        });
      }
      
      
      ws.on('message', (data: Buffer) => {
        try {
          const message = this.jsonCleaner.parse(data.toString());
          this.handleWebSocketMessage(message);
        } catch (error) {
          logger.error(WebSocketMessages.failedToParseMessage(error));
        }
      });
      
      ws.on('close', () => {
        this.wsClients = this.wsClients.filter(client => client !== ws);
      });
      
      ws.on('error', (error) => {
        logger.error(WebSocketMessages.websocketError(error));
        this.wsClients = this.wsClients.filter(client => client !== ws);
      });
    });
  }

  private handleWebSocketMessage(message: any): void {
    try {
      switch (message.type) {
        case 'userAgent':
          (this.reporter as any)?.userAgent?.(message.data, message.data.orderedSuites, message.data.orderedSpecs);
          break;

        case 'jasmineStarted':
          this.failedSpecsCount = 0;
          this.pendingSpecsCount = 0;
          this.reporter?.jasmineStarted(message);
          break;
        
        case 'suiteStarted':
          this.reporter?.suiteStarted(message);
          break;
        
        case 'specStarted':
          this.reporter?.specStarted(message);
          break;
        
        case 'specDone':
          const specStatus = message.status ?? message.overallStatus;
          if (specStatus === 'failed') this.failedSpecsCount++;
          if (specStatus === 'pending') this.pendingSpecsCount++;
          this.reporter?.specDone(message);
          break;
        
        case 'suiteDone':
          this.reporter?.suiteDone(message);
          break;

        case 'jasmineDone':
          this.reporter?.jasmineDone(message);
          
          const coverage = message.coverage ? this.jsonCleaner.parse(message.coverage) : null;
          const success = message.overallStatus === 'passed' && this.failedSpecsCount === 0;
          const hasPending = message.overallStatus === 'incomplete' || this.pendingSpecsCount > 0;
          this.emit('testsCompleted', { success, hasPending, coverage });
          break;

        case 'hmr:ready':
          logger.println(WebSocketMessages.hmrClientReady());
          break;

        case 'hmr:error':
          logger.error(WebSocketMessages.hmrClientError(message.error));
          break;
          
        default:
          logger.println(WebSocketMessages.unknownMessageType(message.type));
      }
    } catch (error) {
      logger.error(WebSocketMessages.errorHandlingMessage(error));
    }
  }

  // New method to enable HMR
  enableHmr(hmrManager: HmrManager): void {
    this.hmrManager = hmrManager;
    this.hmrEnabled = true;

    // Listen for HMR updates from the file watcher
    this.hmrManager.on('hmr:update', (update: HmrUpdate) => {
      this.broadcast({
        type: 'hmr:update',
        data: update,
      });
    });

    logger.println(WebSocketMessages.hmrEnabled());
  }

  private broadcast(message: any): void {
    const data = JSON.stringify(message);
    this.wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  private sendToClient(client: WebSocket, message: any): void {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  async cleanup(): Promise<void> {
    if (this.hmrManager) {
      await this.hmrManager.stop();
      this.hmrManager = null;
    }

    if (this.wsClients.length > 0) {
      for (const client of this.wsClients) {
        try {
          if (client.readyState === WebSocket.OPEN) client.close();
        } catch (err) {
          logger.error(WebSocketMessages.errorClosingClient(err));
        }
      }
      this.wsClients = [];
    }

    if (this.wss) {
      await new Promise<void>(resolve => this.wss!.close(() => resolve()));
      this.wss = null;
    }
  }
}
````

## File: src/coverage-report-generator.ts
````typescript
import fs from 'fs';
import path from 'path';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import libSourceMaps from 'istanbul-lib-source-maps';
import reports from 'istanbul-reports';
import { getMaxWidth } from './ansi-constants';
import { logger } from './logger';
import { norm } from './utils';
import { CoverageMessages } from './log-messages';

export class CoverageReportGenerator {
  private reportDir: string;

  constructor(reportDir: string = norm(path.join(process.cwd(), 'coverage'))) {
    this.reportDir = reportDir;
  }

  saveCoverageToFile(coverage: any): void {
    try {
      const outDir = path.resolve(process.cwd(), ".nyc_output");
      const outFile = path.join(outDir, "out.json");

      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

      fs.writeFileSync(outFile, JSON.stringify(coverage, null, 2), "utf8");

      logger.println(CoverageMessages.rawCoverageSaved(outFile));
    } catch (err) {
      logger.error(CoverageMessages.failedToWriteCoverage(err));
    }
  }

  async generate(coverage: Record<string, any>): Promise<void> {
    // 1️⃣ Coverage map from raw data
    const coverageMap = libCoverage.createCoverageMap(coverage);

    // 2️⃣ Remap coverage using source maps (assumes map files are alongside JS files)
    const remapper = libSourceMaps.createSourceMapStore();
    for (const filePath of coverageMap.files()) {
      const mapPath = filePath + '.map';
      if (fs.existsSync(mapPath)) {
        try {
          const sourceMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
          remapper.registerMap(filePath, sourceMap);
        } catch {
          // Skip unreadable or malformed source maps
        }
      }
    }
    const remappedCoverage = await remapper.transformCoverage(coverageMap);

    // 3️⃣ Filter out test/spec files from coverage (e.g., env.spec.ts, test helpers)
    const filteredCoverage = libCoverage.createCoverageMap();
    const filePaths = remappedCoverage.files();
    for (const filePath of filePaths) {
      // Skip files matching spec patterns (*.spec.ts, *.spec.js, etc.)
      if (!/\.spec\.(ts|tsx|js|jsx|mts|cts|mjs)$/i.test(filePath)) {
        try {
          const fileCoverage = remappedCoverage.fileCoverageFor(filePath);
          filteredCoverage.addFileCoverage(fileCoverage);
        } catch {
          // Skip files that don't have coverage data after remapping
        }
      }
    }

    // 4️⃣ Create report context
    const context = libReport.createContext({
      dir: this.reportDir,
      coverageMap: filteredCoverage
    });

    // 5️⃣ Generate reports using modern istanbul-reports API
    reports.create('html').execute(context);
    reports.create('lcov').execute(context);

    // Text report: write to file fitted to terminal width, then print through logger
    reports.create('text', { file: 'coverage.txt', maxCols: getMaxWidth() }).execute(context);
    const textPath = path.join(this.reportDir, 'coverage.txt');
    if (fs.existsSync(textPath)) {
      const text = fs.readFileSync(textPath, 'utf-8');
      for (const line of text.split('\n')) {
        if (line.trim().length > 0) {
          logger.printlnRaw(line);
        }
      }
    }

    logger.println(CoverageMessages.coverageReportsGenerated());
  }
}
````

## File: src/process-lock.ts
````typescript
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { logger } from './logger';
import { ProcessLockMessages } from './log-messages';
import { norm } from './utils';

export class ProcessLock {
  private pidFile: string;

  constructor(projectPath?: string, port?: number) {
    const cwd = norm(process.cwd());
    const parts: string[] = ['testify'];
    if (projectPath) {
      const sanitized = norm(path.resolve(projectPath))
        .replace(/^\//, '')
        .replace(/\//g, '_');
      parts.push(sanitized);
    }
    if (port !== undefined) {
      parts.push(String(port));
    }
    this.pidFile = path.join(cwd, `.${parts.join('-')}.pid`);
  }

  async acquire(killPrevious: boolean = true): Promise<void> {
    if (killPrevious) {
      await this.releasePrevious();
    }
    fs.writeFileSync(this.pidFile, String(process.pid), 'utf-8');
  }

  releaseSync(): void {
    try {
      fs.unlinkSync(this.pidFile);
    } catch {
      // ignore
    }
  }

  private async releasePrevious(): Promise<void> {
    try {
      if (!fs.existsSync(this.pidFile)) return;

      const raw = fs.readFileSync(this.pidFile, 'utf-8').trim();
      const pid = parseInt(raw, 10);
      if (!Number.isFinite(pid)) {
        fs.unlinkSync(this.pidFile);
        return;
      }

      // Check if process is still alive
      try {
        process.kill(pid, 0);
      } catch (err: any) {
        if (err.code === 'EPERM') {
          // Process exists but we lack permission to query it (e.g. debugger attached).
          // Assume it's alive and proceed with the kill attempt.
        } else {
          // Stale PID file
          logger.println(ProcessLockMessages.staleLockFile(pid));
          fs.unlinkSync(this.pidFile);
          return;
        }
      }

      // Verify the process is actually a Node process before killing it
      const processName = await this.getProcessName(pid);
      if (!processName || !/node/i.test(processName)) {
        logger.println(ProcessLockMessages.nonNodeProcess(pid, processName || 'unknown'));
        fs.unlinkSync(this.pidFile);
        return;
      }

      // Try graceful tree termination
      await this.killProcessTree(pid, false);
      await this.waitForExit(pid, 2000);

      // Force-kill the entire tree if still alive
      const stillAlive = await this.isAlive(pid);
      if (stillAlive) {
        await this.killProcessTree(pid, true);
        await this.waitForExit(pid, 2000);
      }

      // Verify final state and log
      const finalAlive = await this.isAlive(pid);
      if (finalAlive) {
        logger.println(ProcessLockMessages.couldNotTerminate(pid));
      } else {
        logger.println(ProcessLockMessages.terminatedPrevious(pid));
      }
      fs.unlinkSync(this.pidFile);
    } catch {
      // Ignore any errors during cleanup
    }
  }

  private static readonly BROWSER_NAMES = /chrome|chromium|firefox|webkit|safari|edge/i;

  /**
   * Kill the target process and any browser children it may have spawned.
   * On Windows we enumerate children by ParentPID and only kill browsers.
   * On Unix we recursively find descendants and only kill browsers.
   */
  private async killProcessTree(pid: number, force: boolean): Promise<void> {
    // 1. Kill the main testify process (proven method on both platforms)
    try {
      if (process.platform === 'win32') {
        process.kill(pid);
      } else {
        process.kill(pid, force ? 'SIGKILL' : 'SIGTERM');
      }
    } catch {
      // ignore — may already be gone
    }

    // 2. Find and kill only browser children — never touch unrelated descendants
    if (process.platform === 'win32') {
      const children = await this.getWindowsChildren(pid);
      for (const child of children) {
        if (ProcessLock.BROWSER_NAMES.test(child.name)) {
          try {
            process.kill(child.pid);
          } catch {
            // ignore
          }
        }
      }
    } else {
      const descendants = await this.getDescendantPids(pid);
      for (const childPid of descendants) {
        const name = await this.getProcessName(childPid);
        if (name && ProcessLock.BROWSER_NAMES.test(name)) {
          try {
            process.kill(childPid, force ? 'SIGKILL' : 'SIGTERM');
          } catch {
            // ignore
          }
        }
      }
    }
  }

  /**
   * Enumerate direct children of a PID on Windows.
   * Returns [{ pid, name }] for each child process.
   */
  private async getWindowsChildren(pid: number): Promise<Array<{ pid: number; name: string }>> {
    return new Promise((resolve) => {
      exec(`tasklist /FI "ParentPID eq ${pid}" /FO CSV /NH`, { encoding: 'utf-8' }, (error, stdout) => {
        if (error) {
          resolve([]);
          return;
        }
        const lines = stdout.trim().split(/\r?\n/).filter((l) => l.trim());
        const children: Array<{ pid: number; name: string }> = [];
        for (const line of lines) {
          // CSV format: "Image Name","PID","Session Name","Session#","Mem Usage"
          const match = line.match(/^"([^"]+)","(\d+)"/);
          if (match) {
            children.push({ name: match[1], pid: parseInt(match[2], 10) });
          }
        }
        resolve(children);
      });
    });
  }

  /**
   * Recursively collect all descendant PIDs of the given PID on Unix.
   * Returns an empty array on Windows.
   */
  private async getDescendantPids(pid: number): Promise<number[]> {
    if (process.platform === 'win32') {
      return [];
    }

    const directChildren = await new Promise<number[]>((resolve) => {
      exec(`ps -o pid= --ppid ${pid}`, { encoding: 'utf-8' }, (error, stdout) => {
        if (error) {
          resolve([]);
          return;
        }
        const pids = stdout
          .trim()
          .split(/\s+/)
          .map((p) => parseInt(p.trim(), 10))
          .filter(Number.isFinite);
        resolve(pids);
      });
    });

    const allDescendants: number[] = [...directChildren];
    for (const childPid of directChildren) {
      const grandchildren = await this.getDescendantPids(childPid);
      allDescendants.push(...grandchildren);
    }

    return [...new Set(allDescendants)];
  }

  private async isAlive(pid: number): Promise<boolean> {
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  }

  private async waitForExit(pid: number, timeoutMs: number): Promise<void> {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const mainAlive = await this.isAlive(pid);

      if (!mainAlive) {
        if (process.platform === 'win32') {
          // On Windows the main process is the only thing holding the port;
          // browser children don't keep sockets open.
          return;
        }
        // On Unix make sure no descendants are still running
        const descendants = await this.getDescendantPids(pid);
        const anyAlive = descendants.length > 0;
        if (!anyAlive) {
          return;
        }
      }

      await new Promise((r) => setTimeout(r, 100));
    }
  }

  private async getProcessName(pid: number): Promise<string | null> {
    return new Promise((resolve) => {
      const cmd = process.platform === 'win32'
        ? `tasklist /FI "PID eq ${pid}" /FO CSV /NH`
        : `ps -p ${pid} -o comm=`;

      exec(cmd, { encoding: 'utf-8' }, (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }
        const output = stdout.trim();
        if (process.platform === 'win32') {
          const match = output.match(/^"([^"]+)"/);
          resolve(match ? match[1] : null);
        } else {
          resolve(output || null);
        }
      });
    });
  }
}
````

## File: README.md
````markdown
# testify

A test runner for Jasmine that runs tests in **real browsers** (Chrome, Firefox, Safari) or **Node.js**, with TypeScript, HMR, and code coverage out of the box.

<p align="center">
  <a href="https://github.com/epikodelabs/testify/actions/workflows/build.yml"><img src="https://github.com/epikodelabs/testify/actions/workflows/build.yml/badge.svg?branch=main" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/@epikodelabs/testify"><img src="https://img.shields.io/npm/v/@epikodelabs/testify.svg?style=flat-square" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/@epikodelabs/testify"><img src="https://img.shields.io/npm/dt/@epikodelabs/testify.svg?style=flat-square" alt="NPM Downloads"></a>
</p>

---

## Highlights

- 🌐 Real browser testing (Chrome, Firefox, Safari) — not JSDOM
- ⚡ Node.js mode for fast unit tests
- 🔥 Hot Module Reload in headed browser mode
- 📦 TypeScript + source maps, zero config
- 📊 Istanbul coverage (HTML, LCOV, text)
- 🎯 VS Code debug support for single specs

---

## Installation

```bash
npm install --save-dev @epikodelabs/testify
npx playwright install        # required for browser testing
```

`npm install` does not run a Testify postinstall script or modify your project. Browser binaries are installed separately and only when you run `npx playwright install`.

---

## Quick Start

```bash
npx testify init              # creates testify.json and configures Jasmine types when needed
```

Write tests as normal `.spec.ts` Jasmine specs:

```typescript
// tests/calculator.spec.ts
import { Calculator } from '../src/calculator';

describe('Calculator', () => {
  it('should add', () => {
    expect(new Calculator().add(2, 3)).toBe(5);
  });
});
```

Run:

```bash
npx testify                   # interactive browser mode
npx testify --headless        # headless Chrome (CI)
npx testify --browser node            # fastest, Node.js only
npx testify --coverage        # with code coverage
npx testify --watch           # HMR watch mode (headed only)
```

---

## Execution Modes

| Mode | Command | Best For |
|------|---------|----------|
| Browser (headed) | `npx testify` | Development, debugging |
| Headless browser | `npx testify --headless [--browser firefox\|webkit]` | CI/CD |
| Node.js | `npx testify --browser node` | Fast unit tests |
| Watch | `npx testify --watch` | Rapid iteration |

**Notes:**
- `--watch` requires headed browser mode; incompatible with `--headless`, `--coverage`, and `--browser node`.
- `--coverage` is incompatible with `--watch`.
- Suppress logs in Node mode: `--silent`, `--quiet`, or `"suppressConsoleLogs": true` in config.

---

## Code Coverage

```bash
npx testify --coverage
```

Generates `coverage/index.html`, `coverage/lcov.info`, and a console text summary.

---

## Single Spec Debugging

Run `npx jasmine init` to configure Jasmine typings (when an explicit `compilerOptions.types` list is present) and create/update the VS Code single-spec launch configuration. The command is idempotent.

The Jasmine CLI uses `tsx` with the nearest `tsconfig.json`. Testify also resolves extensionless relative files and directory indexes, so imports such as `../lib`, `../lib/forms`, and `./helper` work like they do in the browser/Vite runner.

Run one spec with the bundled Jasmine CLI:

```bash
node --enable-source-maps \
  ./node_modules/@epikodelabs/testify/bin/jasmine \
  --spec ./tests/example.spec.ts
```

**VS Code `launch.json`:**

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug current spec",
  "runtimeExecutable": "node",
  "runtimeArgs": ["--enable-source-maps"],
  "program": "${workspaceFolder}/node_modules/@epikodelabs/testify/bin/jasmine",
  "args": ["--spec", "${file}"],
  "cwd": "${workspaceFolder}",
  "console": "integratedTerminal",
  "skipFiles": ["<node_internals>/**"]
}
```

---

## Configuration (`testify.json`)

```json
{
  "srcDirs": ["./src"],
  "testDirs": ["./tests"],
  "outDir": "./dist/.vite-jasmine-build",
  "browser": "chrome",
  "headless": false,
  "port": 8888,
  "coverage": false,
  "watch": false,
  "suppressConsoleLogs": false,
  "tsconfig": "tsconfig.json",
  "jasmineConfig": {
    "env": { "random": true, "timeout": 120000 }
  },
  "htmlOptions": {
    "title": "Jasmine Test Runner",
    "preludeModules": []
  },
  "viteConfig": {
    "resolve": { "alias": { "@": "/src" } }
  }
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `srcDirs` | `string[]` | `["./src"]` | Source directories |
| `testDirs` | `string[]` | `["./tests"]` | Test directories |
| `exclude` | `string[]` | `["**/node_modules/**"]` | Exclude patterns |
| `outDir` | `string` | `"./dist/.vite-jasmine-build"` | Build output |
| `browser` | `string` | `"chrome"` | `chrome`, `firefox`, `webkit`, `node` |
| `headless` | `boolean` | `false` | Headless mode |
| `port` | `number` | `8888` | Dev server port |
| `coverage` | `boolean` | `false` | Enable coverage |
| `watch` | `boolean` | `false` | Watch mode with HMR |
| `suppressConsoleLogs` | `boolean` | `false` | Hide spec console output (Node) |
| `preserveOutputs` | `boolean` | `false` | Skip regenerating existing outputs |
| `tsconfig` | `string` | `"tsconfig.json"` | TypeScript config path |
| `jasmineConfig` | `object` | — | Jasmine env options |
| `viteConfig` | `object` | — | Custom Vite config |

| `htmlOptions` | `object` | — | Browser runner HTML options like `title` and `preludeModules` |

Path aliases from `tsconfig.json` are resolved automatically.

`htmlOptions.preludeModules` imports setup modules before specs run in both browser and Node runners without preloading every source entry at startup.

---

## CLI Reference

| Flag | Description |
|------|-------------|
| `--headless` | Run headless |
| `--browser <name>` | `chrome`, `firefox`, `webkit`, `node` |
| `--watch` | Watch mode |
| `--coverage` | Generate coverage reports |
| `--seed <n>` | Randomization seed |
| `--silent` / `--quiet` | Suppress console logs (Node) |
| `--preserve` | Skip regenerating outputs |
| `--config <path>` | Custom config file |
| `--help` | Show help |

**Exit codes:** `0` success, `1` failures, `2` invalid usage, `3` config error, `4` internal error, `130` SIGINT, `143` SIGTERM.

---

## CI/CD Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx testify --browser node
      - run: npx testify --headless --browser chrome --coverage
```

---

## Comparison

| Feature | testify | Jest | Vitest | Karma |
|---------|---------|------|--------|-------|
| Real browser testing | ✅ | ❌ | ❌ | ✅ |
| Node.js execution | ✅ | ✅ | ✅ | ❌ |
| HMR | ✅ | ✅ | ✅ | ❌ |
| TypeScript (zero config) | ✅ | ✅ | ✅ | ⚠️ Plugin |
| Code coverage | ✅ | ✅ | ✅ | ✅ |
| Jasmine framework | ✅ | ❌ | ❌ | ✅ |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Browser not found | `npx playwright install` |
| Port in use | Change `"port"` in `testify.json` |
| No tests found | Check `testDirs`, `.spec.ts` extension, and `exclude` patterns |
| TS errors | Verify `tsconfig.json` and `tsconfig` path in `testify.json` |
| Watch not working | Requires headed mode; incompatible with `--headless`, `--coverage`, `node` |
| Coverage missing | Use `--coverage`; incompatible with `--watch` |

---

## License

MIT © 2026

<p align="center">
  <a href="https://www.npmjs.com/package/@epikodelabs/testify">Install from NPM</a> •
  <a href="https://github.com/epikodelabs/testify">View on GitHub</a>
</p>
````

## File: src/node-runner-host.ts
````typescript
import * as fs from 'fs';
import { pathToFileURL } from 'url';
import { norm } from './utils';
import type { TestSelector } from './test-selection';
import type {
  FileListRow,
  SuiteListRow,
  TestListRow,
} from './catalog-query';
import type {
  ExecutionResult,
} from './execution-result';

export interface NodeRunnerModule {
  runTests(
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<ExecutionResult>;

  runTest?(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<ExecutionResult>;

  runSuite?(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<ExecutionResult>;

  runFile?(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<ExecutionResult>;

  getCatalog?(): unknown;
  getSession?(): unknown;
  getStats?(): {
    specs: number;
    suites: number;
    files: number;
  };
  getIndex?(): unknown;
  listTests?(): TestListRow[];
  listSuites?(): SuiteListRow[];
  listFiles?(): FileListRow[];
  findTests?(selector: string | RegExp): TestListRow[];
  findSuites?(selector: string | RegExp): SuiteListRow[];
  findFiles?(selector: string | RegExp): FileListRow[];
}

export class NodeRunnerHost {
  private runnerModule:
    NodeRunnerModule | null = null;

  constructor(
    private readonly runnerFile: string,
  ) {}

  write(source: string): void {
    fs.writeFileSync(
      this.runnerFile,
      source,
    );
  }

  async load(
    cacheBust = true,
  ): Promise<NodeRunnerModule> {
    const fileUrl =
      pathToFileURL(
        this.runnerFile,
      ).href;

    const moduleUrl =
      cacheBust
        ? `${fileUrl}?t=${Date.now()}`
        : fileUrl;

    this.runnerModule =
      await import(moduleUrl);

    return this.runnerModule;
  }

  async execute(
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<ExecutionResult> {
    const runner =
      this.runnerModule ??
      await this.load();

    return runner.runTests(
      reporter,
      selector,
    );
  }

  async run(
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<ExecutionResult> {
    return this.execute(
      reporter,
      selector,
    );
  }

  async runSpec(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<ExecutionResult> {
    const runner =
      this.runnerModule ??
      await this.load();

    if (runner.runTest) {
      return runner.runTest(
        reporter,
        selector,
      );
    }

    return runner.runTests(
      reporter,
      { spec: selector },
    );
  }

  async runSuite(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<ExecutionResult> {
    const runner =
      this.runnerModule ??
      await this.load();

    if (runner.runSuite) {
      return runner.runSuite(
        reporter,
        selector,
      );
    }

    return runner.runTests(
      reporter,
      { suite: selector },
    );
  }

  async runFile(
    reporter: jasmine.CustomReporter,
    selector: string | RegExp,
  ): Promise<ExecutionResult> {
    const runner =
      this.runnerModule ??
      await this.load();

    if (runner.runFile) {
      return runner.runFile(
        reporter,
        selector,
      );
    }

    return runner.runTests(
      reporter,
      { file: selector },
    );
  }

  getSession(): unknown {
    return this.runnerModule
      ?.getSession?.();
  }

  getStats(): {
    specs: number;
    suites: number;
    files: number;
  } {
    return this.runnerModule
      ?.getStats?.() ?? {
        specs: 0,
        suites: 0,
        files: 0,
      };
  }

  getIndex(): unknown {
    return this.runnerModule
      ?.getIndex?.();
  }

  listTests(): TestListRow[] {
    return this.runnerModule
      ?.listTests?.() ??
      [];
  }

  listSuites(): SuiteListRow[] {
    return this.runnerModule
      ?.listSuites?.() ??
      [];
  }

  listFiles(): FileListRow[] {
    return this.runnerModule
      ?.listFiles?.() ??
      [];
  }

  findTests(
    selector: string | RegExp,
  ): TestListRow[] {
    return this.runnerModule
      ?.findTests?.(selector) ??
      [];
  }

  findSuites(
    selector: string | RegExp,
  ): SuiteListRow[] {
    return this.runnerModule
      ?.findSuites?.(selector) ??
      [];
  }

  findFiles(
    selector: string | RegExp,
  ): FileListRow[] {
    return this.runnerModule
      ?.findFiles?.(selector) ??
      [];
  }

  clear(): void {
    this.runnerModule = null;
  }

  get loadedModule():
    | NodeRunnerModule
    | null {
    return this.runnerModule;
  }

  get file(): string {
    return norm(
      this.runnerFile,
    );
  }
}
````

## File: src/vite-config-builder.ts
````typescript
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { createRequire } from 'module';
import { globSync } from 'glob';
import picomatch from 'picomatch';
import { InlineConfig } from 'vite';
import type { WarningHandlerWithDefault } from 'rollup';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import JSONCleaner from './json-cleaner';
import { logger } from './logger';
import { ViteConfigMessages } from './log-messages';

const nodeRequire = createRequire(import.meta.url);

interface ResolvedTsconfigAliases {
  aliases: Record<string, string>;
  baseUrl: string;
}

interface ResolvedTsconfigData extends ResolvedTsconfigAliases {
  compilerOptions: Record<string, any>;
}

interface PackageManifest {
  name?: string;
  main?: string;
  module?: string;
  browser?: string;
  exports?: unknown;
}

export class ViteConfigBuilder {
  private inputMap: Record<string, string> = {};

  private static readonly DEFAULT_EXCLUDED_DIRS = new Set([
    'node_modules',
    'dist',
    'build',
    '.git',
    '.vite',
    '.cache',
    '.turbo'
  ]);

  constructor(private readonly config: ViteJasmineConfig) {}

  /* -------------------------------------------------- */
  /* Helpers                                            */
  /* -------------------------------------------------- */

  private preserveRoot(): string {
    return this.config.viteBuildOptions?.preserveModulesRoot ?? '.';
  }

  private normalizeDirs(
    value: string | string[] | undefined,
    fallback: string
  ): string[] {
    if (!value) return [fallback];
    return Array.isArray(value) ? value : [value];
  }

  private srcDirs(): string[] {
    return this.normalizeDirs(this.config.srcDirs, './src');
  }

  private testDirs(): string[] {
    return this.normalizeDirs(this.config.testDirs, './tests');
  }

  private shouldSkipDirectory(dirPath: string): boolean {
    const name = path.basename(dirPath);

    if (ViteConfigBuilder.DEFAULT_EXCLUDED_DIRS.has(name)) {
      return true;
    }

    if (this.config.exclude?.some(p => picomatch.isMatch(dirPath, p, { dot: true }))) {
      return true;
    }

    return false;
  }

  private isValidSourceFile(file: string, isTest: boolean): boolean {
    const ext = path.extname(file).toLowerCase();
    if (!['.ts', '.js', '.mjs'].includes(ext)) return false;
    if (file.endsWith('.d.ts')) return false;

    const isTestFile = /\.spec\.|\.test\./.test(file);
    return isTest ? isTestFile : !isTestFile;
  }

  /* -------------------------------------------------- */
  /* Synchronous discovery                              */
  /* -------------------------------------------------- */

  private discoverFilesSync(): string[] {
    const all: string[] = [];

    for (const dir of this.srcDirs()) {
      if (fs.existsSync(dir)) all.push(...this.walk(dir, false));
    }

    for (const dir of this.testDirs()) {
      if (fs.existsSync(dir)) all.push(...this.walk(dir, true));
    }

    return [...new Set(all)];
  }

  private walk(dir: string, isTest: boolean): string[] {
    const out: string[] = [];

    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);

      if (e.isDirectory()) {
        if (this.shouldSkipDirectory(full)) continue;
        out.push(...this.walk(full, isTest));
        continue;
      }

      if (e.isFile() && this.isValidSourceFile(full, isTest)) {
        out.push(full);
      }
    }

    return out;
  }

  /* -------------------------------------------------- */
  /* Input map (flattened, deterministic)               */
  /* -------------------------------------------------- */

  private buildInputMap(files: string[]): Record<string, string> {
    const map: Record<string, string> = {};

    for (const file of files) {
      if (this.isTypeOnlyModule(file)) {
        continue;
      }
      const outputName = this.buildOutputName(file).replace(/\.js$/, '');
      map[outputName] = norm(file);
    }

    return map;
  }

  private buildOutputName(filePath: string): string {
    const srcDirs = this.srcDirs().map((dir) => norm(path.resolve(dir)));
    const testDirs = this.testDirs().map((dir) => norm(path.resolve(dir)));
    const normalizedPath = norm(path.resolve(filePath));

    const matchDir = (dirs: string[]): string | null => {
      for (const candidate of dirs) {
        if (normalizedPath === candidate || normalizedPath.startsWith(`${candidate}/`)) {
          return candidate;
        }
      }
      return null;
    };

    const baseSrc = matchDir(srcDirs) ?? srcDirs[0] ?? norm(path.resolve('./src'));
    const baseTest = matchDir(testDirs) ?? testDirs[0] ?? baseSrc;
    const base = baseTest ?? baseSrc;

    const relativePath = path.relative(base, normalizedPath);
    const relativeNormalized = norm(relativePath);
    const relativeWithoutExt = relativeNormalized.replace(/\.(ts|js|mjs)$/, '');
    const isSpecFile = relativeWithoutExt.endsWith('.spec');
    const stemPath = isSpecFile
      ? relativeWithoutExt.slice(0, -'.spec'.length)
      : relativeWithoutExt;

    const sanitizeSegment = (segment: string) => {
      if (segment === '..') return 'up';
      if (segment === '.') return 'dot';
      return segment;
    };

    const segments = stemPath.split('/').filter(Boolean).map(sanitizeSegment);
    const fileName = segments.pop() ?? sanitizeSegment(path.basename(stemPath) || 'index');

    const sanitizedBaseName =
      segments.length > 0 ? `${segments.join('_')}__${fileName}` : fileName;
    const hash = createHash('sha1').update(normalizedPath).digest('hex').slice(0, 8);

    if (isSpecFile) {
      return `${sanitizedBaseName}__${hash}.spec.js`;
    }

    return `${sanitizedBaseName}__${hash}.js`;
  }

  private isTypeOnlyModule(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.ts', '.mts', '.cts'].includes(ext)) return false;
    if (filePath.endsWith('.d.ts')) return true;

    let content = '';
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      return false;
    }

    const stripCommentsAndStrings = (input: string): string => {
      let out = input.replace(/\/\*[\s\S]*?\*\//g, '');
      out = out.replace(/\/\/.*$/gm, '');
      out = out.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, '');
      return out;
    };

    const code = stripCommentsAndStrings(content);

    if (/\bexport\s+\*\s+from\b/.test(code)) return false;
    if (/\bexport\s+default\b/.test(code)) return false;
    if (/\bexport\s+(const|let|var|function|class|enum)\b/.test(code)) return false;
    if (/\bimport\s+(?!type\b)/.test(code)) return false;
    if (/\b(const|let|var|function|class|enum)\b/.test(code)) return false;

    for (const match of code.matchAll(/export\s*(?:type\s*)?\{([^}]*)\}/g)) {
      const specList = match[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const spec of specList) {
        const cleaned = spec.replace(/^type\s+/, '').trim();
        if (cleaned.length > 0 && !spec.startsWith('type ')) {
          return false;
        }
      }
    }

    return true;
  }

  /* -------------------------------------------------- */
  /* Vendor chunk logic                                 */
  /* -------------------------------------------------- */

  private vendorChunk(id: string): string | undefined {
    if (id.includes('node_modules')) return 'vendor';
    return;
  }

  /* -------------------------------------------------- */
  /* Base config factory                                */
  /* -------------------------------------------------- */

    private baseConfig(
      input: Record<string, string>,
      incremental: boolean,
      viteCache?: any
    ): InlineConfig {
      const onwarn: WarningHandlerWithDefault = (warning, warn) => {
        if (warning.code === 'EMPTY_BUNDLE') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      };

      const tsconfigData = this.loadResolvedTsconfigData();
      const isNodeTarget = this.config.browser === 'node';

      return {
        root: process.cwd(),
        configFile: incremental ? false : undefined,

        build: {
          outDir: this.config.outDir,
          emptyOutDir: !incremental,
          sourcemap: true,
          target: 'es2022',
          minify: false,
          // Enable SSR build for Node.js target to bypass browser dynamic import wrappers
          ssr: isNodeTarget ? true : undefined,
          modulePreload: isNodeTarget ? false : true,

          rollupOptions: {
            input,
            preserveEntrySignatures: incremental
              ? 'allow-extension'
              : 'strict',

            onwarn,

            output: {
              format: 'es',
              entryFileNames: '[name].js',
              chunkFileNames: 'vendor.js',
              manualChunks: id => this.vendorChunk(id)
            }
          }
        },

        resolve: { alias: this.createPathAliases() },
        esbuild: {
          target: 'es2022',
          keepNames: false,
          tsconfigRaw: tsconfigData ? { compilerOptions: tsconfigData.compilerOptions } : undefined,
        },
        define: { 'process.env.NODE_ENV': '"test"' },
        logLevel: 'warn'
      };
    }

  /* -------------------------------------------------- */
  /* FULL BUILD                                         */
  /* -------------------------------------------------- */

  createViteConfig(entryFiles?: string[]): InlineConfig {
    const files = entryFiles && entryFiles.length > 0 ? entryFiles : this.discoverFilesSync();
    this.inputMap = this.buildInputMap(files);

    if (!Object.keys(this.inputMap).length) {
      logger.error(ViteConfigMessages.noFilesToBuild());
    }

    return this.normalizeAliasConfig(
      this.mergeUserConfig(this.baseConfig(this.inputMap, false))
    );
  }

  /* -------------------------------------------------- */
  /* INCREMENTAL BUILD                                  */
  /* -------------------------------------------------- */

  createViteConfigForFiles(
    sourceFiles: string[],
    testFilesOrCache?: string[] | any,
    viteCache?: any
  ): InlineConfig {
    const testFiles = Array.isArray(testFilesOrCache) ? testFilesOrCache : [];
    const cache = Array.isArray(testFilesOrCache) ? viteCache : testFilesOrCache;
    const changedFiles = [...sourceFiles, ...testFiles];
    const updates = this.buildInputMap(changedFiles);
    this.inputMap = { ...this.inputMap, ...updates };

    for (const [k, v] of Object.entries(this.inputMap)) {
      if (!fs.existsSync(v)) delete this.inputMap[k];
    }

    logger.println(ViteConfigMessages.incrementalBuild(Object.keys(this.inputMap).length));

    return this.normalizeAliasConfig(
      this.mergeUserConfig(
        this.baseConfig(this.inputMap, true, cache)
      )
    );
  }

  removeFromInputMap(filePath: string): void {
    const normalized = norm(filePath);
    for (const [key, value] of Object.entries(this.inputMap)) {
      if (value === normalized || !fs.existsSync(value)) {
        delete this.inputMap[key];
      }
    }
  }

  removeMultipleFromInputMap(filePaths: string[]): void {
    const normalizedSet = new Set(filePaths.map(norm));
    for (const [key, value] of Object.entries(this.inputMap)) {
      if (normalizedSet.has(value) || !fs.existsSync(value)) {
        delete this.inputMap[key];
      }
    }
  }

  /* -------------------------------------------------- */
  /* Safe user config merge                             */
  /* -------------------------------------------------- */

  private mergeUserConfig(base: InlineConfig): InlineConfig {
    const user = this.config.viteConfig;
    if (!user) return base;

    // Deep-merge nested objects so user settings augment rather than replace defaults
    const merge = (a: any, b: any): any => {
      if (!b) return a;
      if (typeof b !== 'object' || Array.isArray(b)) return b;
      const result = { ...a };
      for (const key of Object.keys(b)) {
        result[key] = merge(a?.[key], b[key]);
      }
      return result;
    };

    return merge(base, user);
  }

  private normalizeAliasConfig(config: InlineConfig): InlineConfig {
    if (!config.resolve?.alias) {
      return config;
    }

    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: this.normalizeAliasEntries(config.resolve.alias),
      },
    };
  }

  private normalizeAliasEntries(alias: NonNullable<InlineConfig['resolve']>['alias']) {
    if (Array.isArray(alias)) {
      return alias.map((entry) => ({
        ...entry,
        replacement: this.normalizeAliasReplacement(entry.replacement),
      }));
    }

    const normalized: Record<string, string> = {};
    for (const [find, replacement] of Object.entries(alias!)) {
      normalized[find] = this.normalizeAliasReplacement(replacement);
    }

    return normalized;
  }

  private normalizeAliasReplacement(replacement: string): string {
    if (!replacement) {
      return replacement;
    }

    if (path.isAbsolute(replacement)) {
      return norm(replacement);
    }

    if (replacement.startsWith('./') || replacement.startsWith('../')) {
      return norm(path.resolve(process.cwd(), replacement));
    }

    return replacement;
  }

  /* -------------------------------------------------- */
  /* tsconfig aliases                                   */
  /* -------------------------------------------------- */

  private loadResolvedTsconfigData(): ResolvedTsconfigData | null {
    try {
      const tsconfigPath = path.resolve(this.config.tsconfig ?? 'tsconfig.json');
      if (!fs.existsSync(tsconfigPath)) return null;

      return this.resolveTsconfigData(tsconfigPath);
    } catch (err) {
      logger.error(ViteConfigMessages.tsconfigParseFailed(err));
      return null;
    }
  }

  private createPathAliases(): Record<string, string> {
    return {
      ...(this.loadResolvedTsconfigData()?.aliases ?? {}),
      ...this.createProjectBuildAliases(),
    };
  }

  private createProjectBuildAliases(): Record<string, string> {
    if (!this.config.project) {
      return {};
    }

    const projectPackageJsonPath = path.join(
      path.resolve(this.config.project),
      'package.json'
    );

    if (!fs.existsSync(projectPackageJsonPath)) {
      return {};
    }

    const cleaner = new JSONCleaner();
    let projectPackage: PackageManifest;

    try {
      projectPackage = cleaner.parse<PackageManifest>(
        fs.readFileSync(projectPackageJsonPath, 'utf8')
      );
    } catch {
      return {};
    }

    if (!projectPackage.name) {
      return {};
    }

    const builtPackageRoot = this.findBuiltPackageRoot(projectPackage.name);
    if (!builtPackageRoot) {
      return {};
    }

    try {
      const builtPackageJsonPath = path.join(builtPackageRoot, 'package.json');
      const builtPackage = cleaner.parse<PackageManifest>(
        fs.readFileSync(builtPackageJsonPath, 'utf8')
      );

      return this.resolveBuiltPackageAliases(
        projectPackage.name,
        builtPackageRoot,
        builtPackage
      );
    } catch {
      return {};
    }
  }

  private findBuiltPackageRoot(packageName: string): string | null {
    const candidates = globSync('dist/**/package.json', {
      absolute: true,
      nodir: true,
      ignore: ['**/node_modules/**'],
    }).sort((a, b) => a.length - b.length || a.localeCompare(b));

    const cleaner = new JSONCleaner();

    for (const candidate of candidates) {
      try {
        const manifest = cleaner.parse<PackageManifest>(
          fs.readFileSync(candidate, 'utf8')
        );
        if (manifest.name === packageName) {
          return norm(path.dirname(candidate));
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  private resolveBuiltPackageAliases(
    packageName: string,
    builtPackageRoot: string,
    manifest: PackageManifest
  ): Record<string, string> {
    const aliases: Record<string, string> = {};
    const exportsField = manifest.exports;

    if (exportsField && typeof exportsField === 'object' && !Array.isArray(exportsField)) {
      const exportMap = exportsField as Record<string, unknown>;

      const rootEntry = this.resolvePackageExportTarget(
        exportMap['.'] ?? exportMap,
        builtPackageRoot
      );
      if (rootEntry) {
        aliases[packageName] = rootEntry;
      }

      for (const [key, value] of Object.entries(exportMap)) {
        if (key === '.' || !key.startsWith('./')) {
          continue;
        }

        const resolvedTarget = this.resolvePackageExportTarget(
          value,
          builtPackageRoot
        );
        if (!resolvedTarget) {
          continue;
        }

        aliases[`${packageName}/${key.slice(2)}`] = resolvedTarget;
      }
    } else {
      const rootEntry = this.resolvePackageExportTarget(exportsField, builtPackageRoot);
      if (rootEntry) {
        aliases[packageName] = rootEntry;
      }
    }

    if (!aliases[packageName]) {
      const fallbackEntry = this.resolvePackageMainEntry(
        packageName,
        builtPackageRoot,
        manifest
      );
      if (fallbackEntry) {
        aliases[packageName] = fallbackEntry;
      }
    }

    return aliases;
  }

  private resolvePackageExportTarget(
    target: unknown,
    builtPackageRoot: string
  ): string | null {
    if (!target) {
      return null;
    }

    if (typeof target === 'string') {
      return this.resolveBuiltFileTarget(target, builtPackageRoot);
    }

    if (Array.isArray(target)) {
      for (const candidate of target) {
        const resolved = this.resolvePackageExportTarget(candidate, builtPackageRoot);
        if (resolved) {
          return resolved;
        }
      }
      return null;
    }

    if (typeof target !== 'object') {
      return null;
    }

    const record = target as Record<string, unknown>;
    const preferredKeys = [
      'browser',
      'import',
      'module',
      'default',
      'development',
      'production',
      'node',
      'require',
    ];

    for (const key of preferredKeys) {
      if (!(key in record)) {
        continue;
      }

      const resolved = this.resolvePackageExportTarget(record[key], builtPackageRoot);
      if (resolved) {
        return resolved;
      }
    }

    for (const value of Object.values(record)) {
      const resolved = this.resolvePackageExportTarget(value, builtPackageRoot);
      if (resolved) {
        return resolved;
      }
    }

    return null;
  }

  private resolveBuiltFileTarget(
    relativeTarget: string,
    builtPackageRoot: string
  ): string | null {
    if (!relativeTarget.startsWith('.')) {
      return null;
    }

    const resolvedPath = path.resolve(builtPackageRoot, relativeTarget);
    if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
      return null;
    }

    return norm(resolvedPath);
  }

  private resolvePackageMainEntry(
    packageName: string,
    builtPackageRoot: string,
    manifest: PackageManifest
  ): string | null {
    for (const field of [manifest.module, manifest.main, manifest.browser]) {
      const resolved = this.resolvePackageExportTarget(field, builtPackageRoot);
      if (resolved) {
        return resolved;
      }
    }

    const packageBaseName = packageName.split('/').pop() ?? packageName;
    const fallbacks = [
      `./fesm2022/${packageBaseName}.mjs`,
      `./esm2022/${packageBaseName}.mjs`,
      './index.mjs',
      './index.js',
    ];

    for (const candidate of fallbacks) {
      const resolved = this.resolveBuiltFileTarget(candidate, builtPackageRoot);
      if (resolved) {
        return resolved;
      }
    }

    return null;
  }

  private resolveTsconfigData(
    tsconfigPath: string,
    seen = new Set<string>()
  ): ResolvedTsconfigData {
    const normalizedTsconfigPath = norm(path.resolve(tsconfigPath));
    if (seen.has(normalizedTsconfigPath)) {
      return {
        aliases: {},
        baseUrl: path.dirname(normalizedTsconfigPath),
        compilerOptions: {},
      };
    }

    seen.add(normalizedTsconfigPath);

    const cleaner = new JSONCleaner();
    const configDir = path.dirname(normalizedTsconfigPath);
    const tsconfig = cleaner.parse<any>(fs.readFileSync(normalizedTsconfigPath, 'utf8'));
    const compilerOptions = tsconfig.compilerOptions ?? {};

    let inherited: ResolvedTsconfigData = {
      aliases: {},
      baseUrl: configDir,
      compilerOptions: {},
    };

    if (typeof tsconfig.extends === 'string' && tsconfig.extends.trim().length > 0) {
      const extendsPath = this.resolveExtendedTsconfigPath(tsconfig.extends, configDir);
      if (extendsPath && fs.existsSync(extendsPath)) {
        inherited = this.resolveTsconfigData(extendsPath, seen);
      }
    }

    const baseUrl = compilerOptions.baseUrl
      ? path.resolve(configDir, compilerOptions.baseUrl)
      : inherited.baseUrl;

    const aliases = { ...inherited.aliases };
    const paths = compilerOptions.paths ?? {};

    for (const [alias, values] of Object.entries(paths)) {
      if (!Array.isArray(values) || !values.length) continue;

      aliases[alias.replace(/\/\*$/, '')] = norm(
        path.resolve(baseUrl, String(values[0]).replace(/\/\*$/, ''))
      );
    }

    const mergedCompilerOptions = {
      ...inherited.compilerOptions,
      ...compilerOptions,
    };

    delete mergedCompilerOptions.paths;
    delete mergedCompilerOptions.baseUrl;

    return {
      aliases,
      baseUrl,
      compilerOptions: mergedCompilerOptions,
    };
  }

  private resolveExtendedTsconfigPath(extendsRef: string, configDir: string): string | null {
    const localCandidates = this.candidateTsconfigPaths(path.resolve(configDir, extendsRef));
    for (const candidate of localCandidates) {
      if (fs.existsSync(candidate)) return candidate;
    }

    try {
      return nodeRequire.resolve(extendsRef);
    } catch {}

    for (const candidate of this.candidateTsconfigPaths(extendsRef)) {
      try {
        return nodeRequire.resolve(candidate);
      } catch {}
    }

    return null;
  }

  private candidateTsconfigPaths(basePath: string): string[] {
    const candidates = [basePath];

    if (!basePath.endsWith('.json')) {
      candidates.push(`${basePath}.json`);
    }

    candidates.push(path.join(basePath, 'tsconfig.json'));

    return [...new Set(candidates.map((candidate) => path.resolve(candidate)))];
  }
}
````

## File: build-package.js
````javascript
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
````

## File: src/log-messages.ts
````typescript
// ─── Emoji/symbol placeholders ────────────────────────────────────────────────
// Replace these with actual emoji or terminal symbols at render time if desired.
// They are intentionally kept as plain ASCII placeholders so the strings remain
// portable and easy to localise / override.

// %check%         → ✅  (success / done)
// %cross%         → ❌  (error / failure)
// %warn%          → ⚠️   (warning)
// %info%          → ℹ️   (informational)
// %globe%         → 🌐  (browser / network)
// %doc%           → 📄  (file / document)
// %puzzle%        → 🧩  (suite tree)
// %stop%          → 🛑  (abort / halt)
// %bulb%          → 💡  (tip / hint)
// %rocket%        → 🚀  (launch / start)
// %hourglass%     → ⏳  (waiting / retry)
// %circle_green%  → 🟢  (process ready)
// %plus%          → ➕  (added)
// %minus%         → ➖  (removed)
// %folder%        → 📁  (directory)
// %box%           → 📦  (build / package)
// %refresh%       → 🔄  (reload / restart)
// %broom%         → 🧹  (cleanup / stale)
// %lock%          → 🔒  (lock / terminate)
// %fire%          → 🔥  (HMR)
// %satellite%     → 📡  (server ready)
// %ok%            → 👌  (ready / hint)
// %eyes%          → 👀  (watch mode)
// %plug%          → 🔌  (connected)

// ─── browser-manager.ts ───────────────────────────────────────────────────────

export const BrowserMessages = {
  unknownBrowserFallback: (name: string) =>
    `%warn%  Unknown browser "${name}", falling back to Node.js mode`,

  playwrightNotInstalled: (name: string) =>
    `%info%  Playwright runtime not available. Browser "${name}" not available.`,

  playwrightInstallTip: () =>
    `%bulb% Tip: Reinstall dependencies, then install browsers explicitly:\n   npx playwright install`,

  browserExecutionFailed: (name: string, message: string) =>
    `%cross% Browser execution failed for "${name}": ${message}`,

  navigatingToTestPage: () =>
    `%globe% Navigating to test page...`,

  testsAbortedByUser: () =>
    `%stop% Tests aborted by user (Ctrl+C)`,

  testExecutionFailed: (error: unknown) =>
    `%cross% Test execution failed: ${error}`,

  browserConsoleError: (text: string) =>
    `%cross% ${text}`,

  browserConsoleWarn: (text: string) =>
    `%warn% ${text}`,

  pageError: (message: string) =>
    `%cross% Page error: ${message}`,

  requestFailed: (url: string, errorText: string | undefined) =>
    `%cross% ${url}, ${errorText}`,

  unknownBrowserFallbackToChrome: (name: string) =>
    `%warn%  Unknown browser "${name}", using Chrome instead`,

  browserNotInstalled: (name: string) =>
    `%cross% Browser "${name}" is not installed.`,

  browserInstallTip: (name: string) =>
    `%bulb% Tip: Install it by running: npx playwright install ${name.toLowerCase()}`,

  openingBrowser: (name: string) =>
    `%globe% Opening ${name} browser...`,

  playwrightNotInstalledManual: (url: string) =>
    `%info%  Playwright runtime not available. Please open browser manually: ${url}`,

  playwrightAutoOpenTip: () =>
    `%bulb% Tip: Install browsers explicitly to enable automatic browser opening:\n   npx playwright install`,

  failedToOpenBrowser: (message: string) =>
    `%cross% Failed to open browser: ${message}`,

  openBrowserManually: (url: string) =>
    `%bulb% Please open browser manually: ${url}`,

  failedToCloseBrowser: (error: unknown) =>
    `%cross% Failed to close browser: ${error}`,
};

// ─── cli-handler.ts ───────────────────────────────────────────────────────────

export const CLIMessages = {
  invalidSeed: () =>
    `%cross% Invalid --seed value (expected a number).`,

  failedToInitializeProject: (error: unknown) =>
    `%cross% Failed to initialize testify config: ${error}`,

  browserArgMissing: () =>
    `%cross% --browser requires a browser name (chrome|chromium|firefox|webkit|node).`,

  projectArgMissing: () =>
    `%cross% --project requires a package name or path.`,

  portArgMissing: () =>
    `%cross% --port requires a number between 1 and 65535.`,

  invalidPort: () =>
    `%cross% Invalid --port value (expected an integer between 1 and 65535).`,

  watchIncompatibleFlags: (flags: string[]) =>
    `%cross% The --watch flag cannot be used with: ${flags.join(', ')}`,

  couldNotResolveProject: (name: string) =>
    `%cross% Could not resolve project "${name}". It is not a directory and not a known package name.`,

  preserveOutputsEnabled: () =>
    `%info%  Preserve outputs enabled (skip regenerating index.html and test-runner.js when present).`,

  failedToStartTestRunner: (error: unknown) =>
    `%cross% Failed to start test runner: ${error}`,

  // Help text — kept as a single block so the caller can println() each line
  helpLines: (): string[] => [
    'testify - run your Jasmine tests across browsers, headless, or Node.js.',
    '',
    'Usage:',
    '  npx testify [options]',
    '  npx testify init               # scaffold testify.json',
    '',
    'Options:',
    '  --headless           Run tests in the default Playwright browser without UI',
    '  --browser <name>     Target browser (chrome|chromium|firefox|webkit|node)',
    '  --watch              Launch browser mode + HMR for rapid feedback (cannot be headless)',
    '  --coverage           Generate Istanbul coverage reports after the run',
    '  --seed <number>      Seed used for randomization order',
    '  --port <number>      Override the port from testify.json',
    '  --silent / --quiet    Suppress console logs when running in Node.js mode',
    '  --preserve           Skip regenerating index.html and test-runner.js when outputs exist',
    '  --ansi               Use plain ASCII output (no colors, emoji, or cursor control)',
    '  --project <name>     Run tests only for the specified package or directory',
    '  --exclusive          Close any previously running testify instance before starting',
    '  --help, -h           Show this help message',
    '',
    'Configuration:',
    '  testify.json keeps your src/test dirs, browser, port, coverage, and HTML options.',
    '  Use --preserve after the first run if you need to debug manually generated assets.',
    '',
    'Tip:',
    '  npx testify --browser node              # fastest Node.js test execution',
    '  npx testify --headless                  # run headless Chrome for browser APIs',
    '',
    'Playwright Browsers:',
    '  npx playwright install                         # install all supported browsers',
    '  npx playwright install chromium                # install only Chromium',
  ],
};

// ─── config-manager.ts ────────────────────────────────────────────────────────

export const ConfigMessages = {
  failedToParseConfig: (error: unknown) =>
    `%cross% Failed to parse existing testify.json: ${error}`,

  failedToCreateConfig: (error: unknown) =>
    `%cross% Failed to create default testify.json: ${error}`,

  createdDefaultConfig: (path: string) =>
    `%info%  Created default test runner config at ${path}`,

  configAlreadyExists: (path: string) =>
    `%info%  Config already exists at ${path}`,

  failedToWriteConfig: (error: unknown) =>
    `%cross% Failed to write testify.json: ${error}`,

  generatedDefaultConfig: (path: string) =>
    `%info%  Generated default Vite Jasmine config at ${path}`,
};

// ─── console-reporter.ts ─────────────────────────────────────────────────────

export const ReporterMessages = {
  suiteTreeBuilt: (suites: number | undefined, specs: number | undefined) =>
    `%puzzle% Suite tree built (${suites} suites, ${specs} specs).`,

  testsInterrupted: () =>
    `[STOP] TESTS INTERRUPTED`,

  allTestsPassed: () =>
    `[OK] ALL TESTS PASSED`,

  allTestsPassedWithPending: (pendingCount: number) =>
    `[OK] ALL TESTS PASSED (${pendingCount} pending)`,

  testsFailed: (count: number) =>
    `[ERROR] ${count} TEST${count === 1 ? '' : 'S'} FAILED`,

  testsIncomplete: () =>
    `[WARN] TESTS INCOMPLETE`,

  unknownStatus: (status: string) =>
    `[WARN] UNKNOWN STATUS: ${status}`,
};

// ─── coverage-report-generator.ts ────────────────────────────────────────────

export const CoverageMessages = {
  rawCoverageSaved: (path: string) =>
    `%doc% Raw coverage saved to ${path}`,

  failedToWriteCoverage: (error: unknown) =>
    `%cross% Failed to write coverage file: ${error}`,

  coverageReportsGenerated: () =>
    `%check% Coverage reports generated successfully`,
};

// ─── file-discovery-service.ts ───────────────────────────────────────────────

export const FileDiscoveryMessages = {
  errorDiscoveringFiles: (error: unknown) =>
    `%cross% Error discovering files: ${error}`,
};

// ─── host-adapter.ts ─────────────────────────────────────────────────────────

export const HostAdapterMessages = {
  ipcEventError: (message: string) =>
    `%cross% Error processing IPC event: ${message}`,

  childProcessReady: () =>
    `%circle_green% Child test process ready`,

  unknownMessageType: (type: string) =>
    `%warn% Unknown message type: ${type}`,
};

// ─── http-server-manager.ts ──────────────────────────────────────────────────

export const HttpServerMessages = {
  serverRunning: (port: number) =>
    `%rocket% Test server running at http://localhost:${port}`,

  portBusyRetrying: (port: number) =>
    `%hourglass% Port ${port} is busy. Waiting 3s before reclaiming it...`,

  failedToKillProcess: (port: number, message: string, stderr: string) =>
    `%cross% Failed to kill process on port ${port}: ${message}\n${stderr}`,

  portReclaimed: (port: number) =>
    `%check% Port ${port} reclaimed.`,

  portStillBusy: (port: number) =>
    `%cross% Port ${port} is still busy after reclaim attempt.`,

  serverError: (error: unknown) =>
    `%cross% ${error}`,
};

// ─── hmr-manager.ts ──────────────────────────────────────────────────────────

export const HmrMessages = {
  fileFilterUpdated: (filter: unknown) =>
    `%check% File filter updated: ${filter}`,

  rebuildModeSet: (mode: string) =>
    `%check% Rebuild mode set to: ${mode}`,

  sourceChangeStrategySet: (strategy: string) =>
    `%check% Source change strategy set to: ${strategy}`,

  cannotExtractDependencies: (filePath: string, message: string) =>
    `%warn%  Could not extract dependencies from ${filePath}: ${message}`,

  watchingFiles: (count: number, mode: string, strategy: string) =>
    `%check% HMR watching ${count} files (mode: ${mode}, strategy: ${strategy})`,

  fileAdded: (type: string, output: string) =>
    `%plus% ${type} file added: ${output}`,

  fileRemoved: (type: string, output: string) =>
    `%minus% ${type} file removed: ${output}`,

  directoryAdded: (type: string, output: string) =>
    `%folder% ${type} directory added: ${output}`,

  directoryRemoved: (type: string, output: string) =>
    `%folder% ${type} directory removed: ${output}`,

  foundFilesInDirectory: (count: number, type: string) =>
    `%box% Found ${count} ${type} files in new directory`,

  errorInHandleFileAdd: (error: unknown) =>
    `%cross% Error in handleFileAdd: ${error}`,

  errorInHandleFileRemove: (error: unknown) =>
    `%cross% Error in handleFileRemove: ${error}`,

  errorInHandleDirectoryAdd: (error: unknown) =>
    `%cross% Error in handleDirectoryAdd: ${error}`,

  errorInHandleDirectoryRemove: (error: unknown) =>
    `%cross% Error in handleDirectoryRemove: ${error}`,

  skippingRebuildNonExistent: (filePath: string) =>
    `%warn%  Skipping rebuild for non-existent file: ${filePath}`,

  rebuildFailed: (error: unknown) =>
    `%cross% Rebuild failed: ${error}`,

  skippingDeletedFileFromQueue: (file: string) =>
    `%warn%  Skipping deleted file from rebuild queue: ${file}`,

  skippingDeletedFileFromDirectChanges: (file: string) =>
    `%warn%  Skipping deleted file from direct changes: ${file}`,

  allQueuedFilesDeleted: () =>
    `%warn%  All queued files were deleted, skipping rebuild`,

  noValidFilesToRebuild: () =>
    `%warn%  No valid files to rebuild after filtering`,

  noValidSourceOrTestFiles: () =>
    `%warn%  No valid source or test files to build after filtering`,

  rebuildSummary: (changed: number, total: number, source: number, test: number) =>
    `%box% Changed: ${changed} files → Rebuilding: ${total} files (${source} source, ${test} test)`,

  viteBuildFailed: (error: unknown) =>
    `%cross% Vite build failed: ${error}`,

  retryingWithFilteredEntries: () =>
    `%refresh% Retrying build with filtered entry points...`,

  allEntryPointsDeleted: () =>
    `%warn%  All entry points were deleted, skipping build`,

  viteBuildCompleted: (ms: number) =>
    `%box% Vite rebuild completed in ${ms}ms`,

  rebuildComplete: (type: string, count: number, ms: number) =>
    `%check% Rebuild complete (${type}): ${count} files in ${ms}ms`,

  watcherStopped: () =>
    `%check% HMR watcher stopped`,
};

// ─── html-generator.ts ───────────────────────────────────────────────────────

export const HtmlMessages = {
  noJsFilesForHtml: () =>
    `%warn%  No JS files found for HTML generation.`,

  generatedTestPage: (relativePath: string) =>
    `%doc% Generated test page: ${relativePath}`,

  generatedHmrTestPage: (relativePath: string) =>
    `%doc% Generated HMR-enabled test page: ${relativePath}`,

  faviconNotFound: (faviconPath: string) =>
    `%warn%  Favicon not found at ${faviconPath}, using default <link>`,
};

// ─── node-test-runner.ts ─────────────────────────────────────────────────────
// Note: these keys are used inside the generated JS runner template via
// logger.log('key', ...args) calls embedded as string literals.

export const NodeRunnerMessages = {
  noJsFilesForRunner: () =>
    `%warn%  No JS files found to generate test runner.`,

  generatedInProcessRunner: (path: string) =>
    `%doc% Generated in-process test runner: ${path}`,

  startingTestRunner: () =>
    `%rocket% Starting in-process test runner...`,

  runnerDoesNotExportRunTests: () =>
    `%cross% Runner module does not export runTests()`,

  testExecutionError: (message: string) =>
    `%cross% Test execution error: ${message}`,

  testProcessAlreadyRunning: () =>
    `%warn%  Test process is already running`,

  unhandledRejection: (error: string) =>
    `%cross% ${error}`,

  uncaughtException: (error: string) =>
    `%cross% ${error}`,

  caughtSignal: (signal: string) =>
    `%stop% Caught signal: ${signal}`,

  errorDuringExecution: (message: string) =>
    `%cross% Error during test execution: ${message}`,

  failedToRunTests: (message: string) =>
    `%cross% Failed to run tests: ${message}`,
};

// ─── process-lock.ts ─────────────────────────────────────────────────────────

export const ProcessLockMessages = {
  staleLockFile: (pid: number) =>
    `%broom% Stale lock file found (PID ${pid} is gone). Removing.`,

  nonNodeProcess: (pid: number, name: string) =>
    `%warn%  PID ${pid} does not appear to be a Node process (${name}). Skipping kill.`,

  couldNotTerminate: (pid: number) =>
    `%warn%  Could not terminate previous testify instance (PID ${pid}).`,

  terminatedPrevious: (pid: number) =>
    `%lock% Terminated previous testify instance (PID ${pid}).`,
};

// ─── ts-jasmine-cli.ts ────────────────────────────────────────────────────────

export const JasmineCLIMessages = {
  unknownCommand: (command: string) =>
    `%cross% Unknown command: ${command}`,

  missingSpecArg: () =>
    `%cross% Missing required --spec <path>`,

  specFileNotFound: (spec: string) =>
    `%cross% Spec file not found: ${spec}`,

  invalidSeedValue: (value: string) =>
    `%cross% Invalid --seed value: ${value}`,

  notRunningInVsCode: () =>
    `%cross% \`npx jasmine init\` is only supported when run from VS Code.`,

  openVsCodeTerminalHint: () =>
    `%info%  Open VS Code, then run this from the integrated terminal (Terminal -> New Terminal).`,

  createdVsCodeLaunchConfig: (path: string) =>
    `%info%  Created VS Code launch config at ${path}`,

  addedVsCodeConfiguration: (name: string) =>
    `Added configuration: ${name}`,

  failedToParseVsCodeConfig: (path: string) =>
    `%cross% Failed to parse existing VS Code launch config: ${path}`,

  addConfigManually: () =>
    `%info%  Add this configuration manually:`,

  vsCodeConfigAlreadyContains: (name: string) =>
    `%info%  VS Code launch config already contains: ${name}`,

  updatedVsCodeLaunchConfig: (path: string) =>
    `%info%  Updated VS Code launch config at ${path}`,

  unhandledRejection: (message: string) =>
    `%cross% ${message}`,

  uncaughtException: (message: string) =>
    `%cross% ${message}`,

  failedToRunJasmine: (stack: string) =>
    `%cross% Failed to run jasmine: ${stack}`,
};

// ─── vite-config-builder.ts ──────────────────────────────────────────────────

export const ViteConfigMessages = {
  noFilesToBuild: () =>
    `%cross% No files found to build`,

  incrementalBuild: (count: number) =>
    `%box% Incremental build: ${count} files`,

  tsconfigParseFailed: (error: unknown) =>
    `%warn% tsconfig parse failed: ${error}`,
};

// ─── vite-jasmine-runner.ts ──────────────────────────────────────────────────

export const RunnerMessages = {
  startingHeadless: () =>
    `%rocket% Starting Jasmine Test Runner (Headless)...`,

  startingServer: () =>
    `%rocket% Starting Jasmine Test Server...`,

  buildFailed: (error: unknown) =>
    `%cross% Build failed: ${error}`,

  preprocessFailed: (error: unknown) =>
    `%cross% Preprocessing failed: ${error}`,

  invalidNodeHeadedMode: () =>
    `%cross% Invalid configuration: Node.js runner cannot run in headed mode.`,

  watchOnlyHeaded: () =>
    `%cross% --watch mode is only supported in headed browser environments.`,

  startingWatchMode: () =>
    `%eyes% Starting Jasmine Test Runner in Watch Mode...`,

  startingHmrWatcher: () =>
    `%fire% Starting HMR file watcher...`,

  webSocketReady: () =>
    `%satellite% WebSocket server ready`,

  pressCtrlCToStop: () =>
    `%ok% Press Ctrl+C to stop the server`,

  browserWindowClosed: () =>
    `%refresh% Browser window closed`,

  headlessBrowserUnavailable: () =>
    `%warn%  Headless browser not available. Falling back to Node.js runner.`,

  browserTestExecutionFailed: () =>
    `%cross% Browser test execution failed. Need to install browser binaries?`,

  nodeTestExecutionFailed: (message: string) =>
    `%cross% Node test execution failed: ${message}`,

  webSocketReadyWithReporting: () =>
    `%satellite% WebSocket server ready for real-time test reporting`,

  browserWindowClosedPrematurely: () =>
    `%refresh% Browser window closed prematurely`,

  finishHeadedRunFailed: (error: unknown) =>
    `%cross% Failed to finish headed browser run: ${error}`,

  preservingExistingHtml: () =>
    `%info%  Preserving existing index.html (no regeneration).`,

  preservingExistingRunner: () =>
    `%info%  Preserving existing test-runner.js (no regeneration).`,

  buildingFiles: (count: number) =>
    `%box% Building ${count} files...`,

  cleaningOutputDirectory: () =>
    `%broom% Cleaning output directory...`,

  testsCompletedTimeout: (message: string) =>
    `%warn% ${message}`,
};

// ─── websocket-manager.ts ────────────────────────────────────────────────────

export const WebSocketMessages = {
  clientConnected: () =>
    `%plug% WebSocket client connected`,

  failedToParseMessage: (error: unknown) =>
    `%cross% Failed to parse WebSocket message: ${error}`,

  websocketError: (error: unknown) =>
    `%cross% WebSocket error: ${error}`,

  hmrClientReady: () =>
    `%fire% Client HMR runtime ready`,

  hmrClientError: (message: string) =>
    `%cross% HMR error on client: ${message}`,

  unknownMessageType: (type: string) =>
    `%warn%  Unknown WebSocket message type: ${type}`,

  errorHandlingMessage: (error: unknown) =>
    `%cross% Error handling WebSocket message: ${error}`,

  hmrEnabled: () =>
    `%fire% HMR enabled on WebSocket server`,

  errorClosingClient: (error: unknown) =>
    `%cross% Error closing WebSocket client: ${error}`,
};
````

## File: src/browser-runtime.ts
````typescript
import {
  getEmbeddedTestCatalogSource,
} from './test-catalog';
import {
  getEmbeddedTestCatalogIndexSource,
} from './test-catalog-index';
import {
  getEmbeddedTestSelectionSource,
} from './test-selection';
import {
  getEmbeddedExecutionPlanSource,
} from './execution-plan';
import {
  getEmbeddedRunnerSessionSource,
} from './runner-session';
import {
  getEmbeddedCatalogQuerySource,
} from './catalog-query';
import {
  summarizeExecutionResults,
} from './execution-result';

export interface BrowserRuntimeScriptOptions {
  stopOnSpecFailure: boolean;
  initialSeed: number;
  initialRandom: boolean;
}

export function getBrowserRuntimeScript(
  options: BrowserRuntimeScriptOptions,
): string {
  const {
    stopOnSpecFailure,
    initialSeed,
    initialRandom,
  } = options;

  const catalogSource =
    getEmbeddedTestCatalogSource();

  const catalogIndexSource =
    getEmbeddedTestCatalogIndexSource();

  const selectionSource =
    getEmbeddedTestSelectionSource();

  const executionPlanSource =
    getEmbeddedExecutionPlanSource();

  const catalogQuerySource =
    getEmbeddedCatalogQuerySource();

  const executionResultSource = [
    summarizeExecutionResults,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');

  const runnerSessionSource =
    getEmbeddedRunnerSessionSource();

  return `
(function(globalThis) {
  ${catalogSource}

  ${catalogIndexSource}

  ${selectionSource}

  ${executionPlanSource}

  ${catalogQuerySource}

  ${executionResultSource}

  ${runnerSessionSource}

  async function waitForJasmine(
    maxAttempts = 50,
    interval = 100,
  ) {
    return new Promise(
      (resolve, reject) => {
        let attempts = 0;

        function check() {
          if (globalThis.jasmine?.getEnv) {
            resolve(
              globalThis.jasmine.getEnv(),
            );
            return;
          }

          if (attempts >= maxAttempts) {
            reject(
              new Error(
                'Jasmine environment not found after waiting',
              ),
            );
            return;
          }

          attempts++;
          setTimeout(
            check,
            interval,
          );
        }

        check();
      },
    );
  }

  async function init() {
    let env;

    try {
      env = await waitForJasmine();
      console.log(
        '✅ Jasmine environment found',
      );
    } catch (error) {
      console.error(
        '⚠️  Jasmine environment not found:',
        error.message,
      );
      return;
    }

    let random = ${initialRandom};
    let seed = ${initialSeed};
    const stopOnFailure =
      ${stopOnSpecFailure};

    env.configure({
      random,
      stopOnSpecFailure: stopOnFailure,
      seed,
      autoCleanClosures: false,
    });

    function getCatalog() {
      return createTestCatalogFromJasmineEnv(
        env,
      );
    }

    function getAllSpecs() {
      return getCatalog().specs;
    }

    function getAllSuites() {
      return getCatalog().suites;
    }

    function orderCatalogItems(
      items,
      currentSeed,
      currentRandom,
    ) {
      if (!currentRandom) return items;

      try {
        const order =
          new globalThis.jasmine.Order({
            random: currentRandom,
            seed: currentSeed,
          });

        return order.sort?.(items) ?? items;
      } catch {
        return items;
      }
    }

    function getOrderedSpecs(
      currentSeed,
      currentRandom,
    ) {
      return orderCatalogItems(
        getAllSpecs(),
        currentSeed,
        currentRandom,
      );
    }

    function getOrderedSuites(
      currentSeed,
      currentRandom,
    ) {
      return orderCatalogItems(
        getAllSuites(),
        currentSeed,
        currentRandom,
      );
    }

    globalThis.jasmine = {
      ...globalThis.jasmine,
      getCatalog,
      getAllSpecs,
      getAllSuites,
      getOrderedSpecs,
      getOrderedSuites,
    };

    let originalSpecFilter = null;
    let isExecuting = false;

    const inBrowserReporter = {
      results: [],
      currentSpecIdSet: null,

      jasmineStarted() {
        this.results = [];
      },

      specStarted(config) {
        if (
          this.currentSpecIdSet?.has(
            config.id,
          )
        ) {
          console.log(
            \`▶️ Running [\${config.id}]: \${config.description}\`,
          );
        }
      },

      specDone(result) {
        if (
          !this.currentSpecIdSet?.has(
            result.id,
          )
        ) {
          return;
        }

        this.results.push(result);

        console.log(
          \`[\${result.status.toUpperCase()}] \${result.description}\`,
        );

        result.failedExpectations?.forEach(
          (failure) =>
            console.error(
              '❌',
              failure.message,
              failure.stack
                ? '\\n' + failure.stack
                : '',
            ),
        );
      },

      jasmineDone() {
        if (originalSpecFilter !== null) {
          env.configure({
            specFilter:
              originalSpecFilter,
          });
        }

        isExecuting = false;
      },
    };

    env.addReporter(
      inBrowserReporter,
    );

    function resetEnvironment() {
      const resetNode = (node) => {
        if (node.result) {
          node.result = {
            status: 'pending',
            failedExpectations: [],
            passedExpectations: [],
          };
        }

        node.children?.forEach(
          resetNode,
        );
      };

      resetNode(
        env.topSuite(),
      );
    }

    async function executePlan(plan) {
      if (isExecuting) {
        console.warn(
          '⚠️  Execution already in progress. Please wait...',
        );
        return summarizeExecutionResults([]);
      }

      if (!plan.specIds.length) {
        return summarizeExecutionResults([]);
      }

      return new Promise((resolve) => {
        isExecuting = true;

        inBrowserReporter.results = [];

        const specIdSet =
          new Set(plan.specIds);

        inBrowserReporter.currentSpecIdSet =
          specIdSet;

        if (originalSpecFilter === null) {
          originalSpecFilter =
            env.specFilter;
        }

        resetEnvironment();

        env.configure({
          random: plan.random,
          seed: plan.seed,
          stopOnSpecFailure:
            plan.stopOnFailure ??
            false,
          specFilter: (spec) =>
            specIdSet.has(spec.id),
          autoCleanClosures: false,
        });

        const originalDone =
          inBrowserReporter.jasmineDone;

        inBrowserReporter.jasmineDone =
          () => {
            originalDone.call(
              inBrowserReporter,
            );

            resolve(
              summarizeExecutionResults(
                inBrowserReporter.results,
              ),
            );

            inBrowserReporter.jasmineDone =
              originalDone;
          };

        env.execute();
      });
    }

    function currentPlanOptions() {
      return {
        random,
        seed,
        stopOnFailure,
      };
    }

    async function runTests(filters) {
      const catalog = getCatalog();

      if (filters === undefined) {
        return executePlan(
          createExecutionPlan(
            catalog,
            undefined,
            currentPlanOptions(),
          ),
        );
      }

      const filterArr =
        Array.isArray(filters)
          ? filters
          : [filters];

      const specIds = [
        ...new Set(
          filterArr.flatMap(
            (filter) =>
              resolveTestSelector(
                catalog,
                { spec: filter },
              ),
          ),
        ),
      ];

      if (!specIds.length) {
        console.warn(
          'No matching specs found for:',
          filters,
        );
        return summarizeExecutionResults([]);
      }

      return executePlan({
        specIds,
        ...currentPlanOptions(),
        source: {
          kind: 'spec',
        },
      });
    }

    function setSeed(nextSeed) {
      const parsed =
        Number(nextSeed);

      if (!Number.isFinite(parsed)) {
        console.warn(
          'Invalid seed (expected a number).',
        );
        return seed;
      }

      random = true;
      seed = parsed;

      env.configure({
        random,
        seed,
      });

      return seed;
    }

    function resetSeed() {
      random = false;
      seed = ${initialSeed};

      env.configure({
        random,
        seed,
      });

      return seed;
    }

    const session =
      new RunnerSession(
        getCatalog,
        {
          execute: executePlan,
        },
        currentPlanOptions,
      );

    const warnDeprecated = (() => {
      const shown = new Set();

      return (name, replacement) => {
        if (shown.has(name)) return;
        shown.add(name);

        console.warn(
          \`[Testify v2] runner.\${name}() is deprecated. Use \${replacement}.\`,
        );
      };
    })();


    globalThis.runner = {
      session,

      catalog: () =>
        session.catalog(),

      index: () =>
        session.index(),

      stats: () =>
        session.stats(),

      listTests: () => {
        const rows =
          session.listTests();
        console.table(rows);
        return rows;
      },

      listSuites: () => {
        const rows =
          session.listSuites();
        console.table(rows);
        return rows;
      },

      listFiles: () => {
        const rows =
          session.listFiles();
        console.table(rows);
        return rows;
      },

      findTests: (selector) =>
        session.findTests(selector),

      findSuites: (selector) =>
        session.findSuites(selector),

      findFiles: (selector) =>
        session.findFiles(selector),

      plan: (selector) =>
        session.plan(selector),

      planSpec: (selector) =>
        session.planSpec(selector),

      planSuite: (selector) =>
        session.planSuite(selector),

      planFile: (selector) =>
        session.planFile(selector),

      execute: (plan) =>
        session.execute(plan),

      run: (selector) =>
        session.run(selector),

      runTest: (selector) =>
        session.runSpec(selector),

      runSuite: (selector) =>
        session.runSuite(selector),

      runFile: (selector) =>
        session.runFile(selector),

      // Compatibility helper retained for v1 callers.
      runTests: (...args) => {
        warnDeprecated(
          'runTests',
          'runner.run() or runner.session.run()',
        );

        return runTests(...args);
      },

      setSeed,
      resetSeed,

      reload: () =>
        location.reload(),
    };

    console.log(
      '%c✅ Testify runner ready!',
      'color: green; font-weight: bold;',
    );
  }

  init().catch((error) => {
    console.error(
      'Failed to initialize runner:',
      error,
    );
  });
})(window);
`;
}
````

## File: src/http-server-manager.ts
````typescript
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';
import { createServer } from 'http';
import { extname } from 'path';
import { exec } from 'child_process';   // ✅ new top‑level import
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import { logger } from './logger';
import { HttpServerMessages } from './log-messages';

export class HttpServerManager {
  private server: http.Server | null = null;

  constructor(private config: ViteJasmineConfig) {}

  private createHttpServer(): http.Server {
    const outDir = path.resolve(this.config.outDir);
    const __filename = norm(fileURLToPath(import.meta.url));
    const __dirname = norm(path.dirname(__filename));
    const vendorDir = path.resolve(path.join(__dirname, '../node_modules'));
    const workspaceNodeModulesDir = path.resolve(path.join(process.cwd(), 'node_modules'));

    return createServer((req, res) => {
      let { pathname } = parse(req.url === '/' ? '/index.html' : req.url!, true);
      const filePath = decodeURIComponent(pathname!);

      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
      }

      let resolvedPath: string;
      let rootDir: string;

      if (filePath.startsWith('/node_modules/')) {
        const relativePath = filePath.replace(/^\/node_modules\//, '');
        const candidateRoots = [workspaceNodeModulesDir, vendorDir];
        const resolvedCandidate = candidateRoots
          .map((candidateRoot) => ({
            rootDir: candidateRoot,
            resolvedPath: path.resolve(candidateRoot, relativePath)
          }))
          .find((candidate) =>
            this.isPathInside(candidate.rootDir, candidate.resolvedPath) &&
            fs.existsSync(candidate.resolvedPath)
          );

        rootDir = resolvedCandidate?.rootDir ?? workspaceNodeModulesDir;
        resolvedPath = resolvedCandidate?.resolvedPath ?? path.resolve(workspaceNodeModulesDir, relativePath);
      } else {
        rootDir = outDir;
        resolvedPath = path.resolve(outDir, `.${filePath}`);
      }

      resolvedPath = path.normalize(resolvedPath);

      if (!this.isPathInside(rootDir, resolvedPath)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      const stream = fs.createReadStream(resolvedPath);
      stream.on('error', () => {
        res.writeHead(404);
        res.end('Not found');
      });
      stream.on('open', () => {
        const ext = extname(resolvedPath);
        res.writeHead(200, {
          'Content-Type': this.getContentType(ext),
          'Access-Control-Allow-Origin': '*'
        });
        stream.pipe(res);
      });
    });
  }

  async startServer(): Promise<http.Server> {
    const port = this.config.port ?? 8888;
    this.server = this.createHttpServer();

    return new Promise((resolve, reject) => {
      const tryListen = (attempt = 1) => {
        this.server!.listen(port, () => {
          logger.println(HttpServerMessages.serverRunning(port));
          resolve(this.server!);
        });

        this.server!.on('error', (error: any) => {
          if (error.code === 'EADDRINUSE' && attempt < 3) {
            logger.println(HttpServerMessages.portBusyRetrying(port));

            this.server!.close(() => {
              setTimeout(() => {
                const isWindows = process.platform === 'win32';
                const killCommand = isWindows
                  ? `powershell -command "Get-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess | Stop-Process -Force"`
                  : `lsof -ti:${port} | xargs -r kill -9`;

                // ✅ Fixed: pass empty options object as second argument
                exec(killCommand, {}, (err, stdout, stderr) => {
                  if (err) {
                    logger.error(HttpServerMessages.failedToKillProcess(port, err.message, stderr));
                  } else {
                    logger.println(HttpServerMessages.portReclaimed(port));
                  }
                  this.server = this.createHttpServer();
                  tryListen(attempt + 1);
                });
              }, 3000);
            });
          } else if (error.code === 'EADDRINUSE') {
            logger.error(HttpServerMessages.portStillBusy(port));
            reject(error);
          } else {
            logger.error(HttpServerMessages.serverError(error));
            reject(error);
          }
        });
      };
      tryListen();
    });
  }

  private getContentType(ext: string): string {
    const types: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.mjs': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    return types[ext] || 'application/octet-stream';
  }

  private isPathInside(root: string, candidate: string): boolean {
    const relative = path.relative(path.resolve(root), path.resolve(candidate));
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
  }

  async waitForServerReady(url: string, timeout = 5000): Promise<void> {
    const start = Date.now();
    const { hostname, port } = new URL(url);

    while (Date.now() - start < timeout) {
      try {
        await new Promise<void>((resolve, reject) => {
          const req = http.request({
            hostname,
            port,
            path: '/',
            method: 'HEAD',
            timeout: 1000
          }, (res) => {
            res.resume();
            resolve();
          });

          req.on("error", reject);
          req.on("timeout", () => {
            req.destroy();
            reject(new Error('Timeout'));
          });

          req.end();
        });
        return;
      } catch {
        await new Promise(r => setTimeout(r, 100));
      }
    }
    throw new Error(`Server not ready at ${url} after ${timeout}ms`);
  }

  async cleanup(): Promise<void> {
    if (this.server) {
      await new Promise<void>((resolve, reject) => {
        this.server!.close(err => (err ? reject(err) : resolve()));
      });
      this.server = null;
    }
  }
}
````

## File: src/browser-manager.ts
````typescript
import { logger } from './logger';
import { ViteJasmineConfig } from "./vite-jasmine-config";
import type * as PlayWright from 'playwright';
import { EXIT_CODES, ExitCodeError } from './exit-codes';
import { BrowserMessages } from './log-messages';

export class BrowserManager {
  private playwright: typeof PlayWright | null = null;
  private currentBrowser: PlayWright.Browser | null = null;
  private currentPage: PlayWright.Page | null = null;
  private abortCallback: ((signal: NodeJS.Signals) => void) | null = null;

  constructor(private config: ViteJasmineConfig) {}

  private async getPlaywright(): Promise<typeof PlayWright> {
    if (!this.playwright) {
      this.playwright = await import('playwright');
    }
    return this.playwright!;
  }

  private resolveBrowserType(
    playwright: typeof PlayWright,
    name: string
  ): { type: PlayWright.BrowserType; normalized: string } | null {
    switch (name.toLowerCase()) {
      case 'chromium':
      case 'chrome':
        return { type: playwright.chromium, normalized: 'chrome' };
      case 'firefox':
        return { type: playwright.firefox, normalized: 'firefox' };
      case 'webkit':
      case 'safari':
        return { type: playwright.webkit, normalized: 'safari' };
      default:
        return null;
    }
  }

  async checkBrowser(browserName: string): Promise<PlayWright.BrowserType | null> {
    try {
      const playwright = await this.getPlaywright();
      const resolved = this.resolveBrowserType(playwright, browserName);
      if (!resolved) {
        logger.println(BrowserMessages.unknownBrowserFallback(browserName));
        return null;
      }
      return resolved.type;
    } catch (err: any) {
      if (err.code === 'MODULE_NOT_FOUND') {
        logger.println(BrowserMessages.playwrightNotInstalled(browserName));
        logger.println(BrowserMessages.playwrightInstallTip());
      } else {
        logger.error(BrowserMessages.browserExecutionFailed(browserName, err.message));
      }
      return null;
    }
  }

  async runHeadlessBrowserTests(browserType: PlayWright.BrowserType, port: number): Promise<boolean> {
    let browser: PlayWright.Browser | null = null;
    let interrupted = false;
    const interruptError = new Error('Interrupted');
    let interruptReject: ((error: Error) => void) | null = null;
    const interruptPromise = new Promise<never>((_, reject) => {
      interruptReject = reject;
    });

    const abortRun = (signal: NodeJS.Signals) => {
      if (interrupted) return;
      interrupted = true;
      if (interruptReject) {
        interruptReject(interruptError);
        interruptReject = null;
      }
    };
    this.abortCallback = abortRun;

    const sigintHandler = () => abortRun('SIGINT');
    const sigtermHandler = () => abortRun('SIGTERM');
    process.on('SIGINT', sigintHandler);
    process.on('SIGTERM', sigtermHandler);

    try {
      browser = await browserType.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.currentBrowser = browser;

      const page = await browser.newPage();
      page.setDefaultTimeout(0);

      // Unified console and error logging
      page.on('console', (msg: PlayWright.ConsoleMessage) => {
        const text = msg.text();
        const type = msg.type();
        if (text.match(/error|failed/i)) {
          if (type === 'error') logger.error(BrowserMessages.browserConsoleError(text));
          else if (type === 'warning') logger.println(BrowserMessages.browserConsoleWarn(text));
        }
      });

      page.on('pageerror', (error: Error) => logger.error(BrowserMessages.pageError(error.message)));
      page.on('requestfailed', (request: PlayWright.Request) => logger.error(BrowserMessages.requestFailed(request.url(), request.failure()?.errorText)));

      logger.println(BrowserMessages.navigatingToTestPage());
      await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle', timeout: 120000 });

      await Promise.race([
        page.waitForFunction(() => (window as any).jasmineFinished === true, {
          timeout: this.config.jasmineConfig?.env?.timeout ?? 120000
        }),
        interruptPromise
      ]);

      await new Promise(resolve => setTimeout(resolve, 500));

      return true; // Success determined by WebSocket messages
    } catch (error) {
      if (interrupted || error === interruptError) {
        logger.printRaw('\n\n');
        logger.println(BrowserMessages.testsAbortedByUser());
        throw new ExitCodeError(EXIT_CODES.SIGINT, 'Tests aborted by user');
      }
      logger.error(BrowserMessages.testExecutionFailed(error));
      throw error;
    } finally {
      this.abortCallback = null;
      process.removeListener('SIGINT', sigintHandler);
      process.removeListener('SIGTERM', sigtermHandler);
      if (browser) {
        await browser.close().catch(() => {});
      }
      this.currentBrowser = null;
    }
  }

  abort(signal: NodeJS.Signals): void {
    this.abortCallback?.(signal);
    // Also close any browser (headed, watch, or headless) immediately so the
    // process does not hang on long-running navigation/test execution.
    if (this.currentBrowser) {
      this.closeBrowser().catch(() => {});
    }
  }

  async openBrowser(
    port: number,
    onBrowserClose?: () => Promise<number | void>,
    options?: { exitOnClose?: boolean }
  ): Promise<void> {
    let browserName = this.config.browser || 'chrome';
    const url = `http://localhost:${port}/index.html`;

    let browser: PlayWright.Browser | null = null;
    try {
      const playwright = await this.getPlaywright();
      let resolved = this.resolveBrowserType(playwright, browserName);

      if (!resolved) {
        logger.println(BrowserMessages.unknownBrowserFallbackToChrome(browserName));
        resolved = { type: playwright.chromium, normalized: 'chrome' };
        browserName = 'chrome';
      }

      logger.println(BrowserMessages.openingBrowser(browserName));
      browser = await resolved.type.launch({
        headless: this.config.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      this.currentBrowser = browser;
      this.currentPage = page;
      await page.goto(url);

      // Handle browser close event (keep handler sync to avoid unhandled rejections)
      const exitOnClose = options?.exitOnClose !== false;
      page.on('close', () => {
        Promise.resolve(onBrowserClose?.()).then(() => {
          // The caller is responsible for process exit; do not kill the process here.
        }).catch(() => {}).finally(() => {
          this.clearBrowserState();
        });
      });

    } catch (error: any) {
      if (browser && browser.isConnected()) {
        await browser.close().catch(() => {});
      }
      if (error.code === 'MODULE_NOT_FOUND') {
        logger.println(BrowserMessages.playwrightNotInstalledManual(url));
        logger.println(BrowserMessages.playwrightAutoOpenTip());
      } else {
        logger.error(BrowserMessages.failedToOpenBrowser(error.message));
        logger.println(BrowserMessages.openBrowserManually(url));
      }
    }
  }

  private clearBrowserState(): void {
    this.currentPage = null;
    this.currentBrowser = null;
  }

  async closeBrowser(): Promise<void> {
    if (!this.currentBrowser) return;

    try {
      await this.currentBrowser.close();
    } catch (error: any) {
      logger.error(BrowserMessages.failedToCloseBrowser(error?.message ?? error));
    } finally {
      this.clearBrowserState();
    }
  }
}
````

## File: src/node-runner-module-source.ts
````typescript
import type { ViteJasmineConfig } from './vite-jasmine-config';
import { EXIT_CODES } from './exit-codes';
import { NodeRunnerMessages } from './log-messages';
import {
  getEmbeddedNodeJasmineRuntimeSource,
} from './jasmine-node-runtime';
import {
  getEmbeddedExecutionPlanSource,
} from './execution-plan';
import {
  getEmbeddedTestCatalogIndexSource,
} from './test-catalog-index';
import {
  getEmbeddedNodeExecutionAdapterSource,
} from './node-execution-adapter';
import {
  getEmbeddedRunnerSessionSource,
} from './runner-session';
import {
  getEmbeddedCatalogQuerySource,
} from './catalog-query';

export interface NodeRunnerModuleSourceOptions {
  jasmineCoreUrl: string;
  imports: string;
  config: ViteJasmineConfig;
}

export function createNodeRunnerModuleSource(
  options: NodeRunnerModuleSourceOptions,
): string {
  const {
    jasmineCoreUrl,
    imports,
    config,
  } = options;

  const jasmineRuntimeSource =
    getEmbeddedNodeJasmineRuntimeSource();

  const catalogIndexSource =
    getEmbeddedTestCatalogIndexSource();

  const executionPlanSource =
    getEmbeddedExecutionPlanSource();

  const nodeExecutionAdapterSource =
    getEmbeddedNodeExecutionAdapterSource();

  const catalogQuerySource =
    getEmbeddedCatalogQuerySource();

  const runnerSessionSource =
    getEmbeddedRunnerSessionSource();

  const messages = {
    unhandledRejection:
      NodeRunnerMessages.unhandledRejection(''),
    uncaughtException:
      NodeRunnerMessages.uncaughtException(''),
    caughtSignal:
      NodeRunnerMessages.caughtSignal(''),
    errorDuringExecution:
      NodeRunnerMessages.errorDuringExecution(''),
  };

  return `// Auto-generated in-process Jasmine test runner
import { pathToFileURL } from 'url';

function replacePlaceholders(text) {
  if (!text) return text;

  const useEmoji =
    process.stdout?.isTTY &&
    !process.env.NO_EMOJI;

  return text
    .replace(/%check%/g, useEmoji ? '✅' : '[OK]')
    .replace(/%cross%/g, useEmoji ? '❌' : '[ERROR]')
    .replace(/%warn%/g, useEmoji ? '⚠️' : '[WARN]')
    .replace(/%info%/g, useEmoji ? 'ℹ️' : '[INFO]');
}

${jasmineRuntimeSource}

${catalogIndexSource}

${executionPlanSource}

${nodeExecutionAdapterSource}

${catalogQuerySource}

${runnerSessionSource}

let jasmineRuntime = null;
let currentSession = null;

const warnedDeprecated =
  new Set();

function warnDeprecated(
  name,
  replacement,
) {
  if (warnedDeprecated.has(name)) {
    return;
  }

  warnedDeprecated.add(name);

  console.warn(
    \`[Testify v2] \${name}() is deprecated. Use \${replacement}.\`,
  );
}

export function getCatalog() {
  return jasmineRuntime?.utils.getCatalog() ?? {
    suites: [],
    specs: []
  };
}

export function getSession() {
  return currentSession;
}

export function getStats() {
  return currentSession?.stats?.() ?? {
    specs: 0,
    suites: 0,
    files: 0,
  };
}

export function getIndex() {
  return currentSession?.index?.() ?? null;
}

export function getAllSpecs() {
  warnDeprecated(
    'getAllSpecs',
    'getSession()?.listTests()',
  );
  return jasmineRuntime?.utils.getAllSpecs() ?? [];
}

export function getAllSuites() {
  warnDeprecated(
    'getAllSuites',
    'getSession()?.listSuites()',
  );
  return jasmineRuntime?.utils.getAllSuites() ?? [];
}

export function getOrderedSpecs(seed, random) {
  warnDeprecated(
    'getOrderedSpecs',
    'getSession()?.listTests()',
  );
  return jasmineRuntime?.utils.getOrderedSpecs(seed, random) ?? [];
}

export function getOrderedSuites(seed, random) {
  warnDeprecated(
    'getOrderedSuites',
    'getSession()?.listSuites()',
  );
  return jasmineRuntime?.utils.getOrderedSuites(seed, random) ?? [];
}

export function listTests() {
  return listCatalogTests(
    getCatalog(),
  );
}

export function listSuites() {
  return listCatalogSuites(
    getCatalog(),
  );
}

export function listFiles() {
  return listCatalogFiles(
    getCatalog(),
  );
}

export function findTests(selector) {
  return listCatalogTests(
    getCatalog(),
  ).filter(
    (row) =>
      findCatalogSpecs(
        getCatalog(),
        selector,
      ).some(
        (spec) => spec.id === row.id,
      ),
  );
}

export function findSuites(selector) {
  return listCatalogSuites(
    getCatalog(),
  ).filter(
    (row) =>
      findCatalogSuites(
        getCatalog(),
        selector,
      ).some(
        (suite) => suite.id === row.id,
      ),
  );
}

export function findFiles(selector) {
  const catalog = getCatalog();
  const index =
    createTestCatalogIndex(
      catalog,
    );

  const files =
    new Set(
      searchIndexEntries(
        index.fileSearch,
        selector,
      ),
    );

  return listCatalogFiles(
    catalog,
  ).filter(
    (row) =>
      files.has(row.file),
  );
}

export async function runTests(reporter, selector) {
  const envValue =
    process.env.TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS;

  const shouldSilenceConsole =
    envValue === '1' ||
    envValue?.toLowerCase() === 'true';

  const originalConsole = {};

  const restoreConsole = () => {
    for (
      const [method, value] of
      Object.entries(originalConsole)
    ) {
      console[method] = value;
    }
  };

  if (shouldSilenceConsole) {
    const silentMethods = [
      'log',
      'info',
      'debug',
      'trace',
      'warn',
      'table',
    ];

    for (const method of silentMethods) {
      if (
        typeof console[method] === 'function'
      ) {
        originalConsole[method] =
          console[method];

        console[method] = () => {};
      }
    }
  }

  return new Promise((resolve) => {
    const ownedHandlers = [];

    const onUnhandledRejection = (error) => {
      console.error(
        replacePlaceholders(
          ${JSON.stringify("UNHANDLED_REJECTION_PLACEHOLDER")}
        ) +
        (
          error instanceof Error
            ? error.message
            : String(error)
        )
      );

      process.exit(
        ${EXIT_CODES.INTERNAL_ERROR}
      );
    };

    const onUncaughtException = (error) => {
      console.error(
        replacePlaceholders(
          ${JSON.stringify("UNCAUGHT_EXCEPTION_PLACEHOLDER")}
        ) +
        (
          error instanceof Error
            ? error.message
            : String(error)
        )
      );

      process.exit(
        ${EXIT_CODES.INTERNAL_ERROR}
      );
    };

    process.on(
      'unhandledRejection',
      onUnhandledRejection,
    );

    process.on(
      'uncaughtException',
      onUncaughtException,
    );

    ownedHandlers.push(
      {
        event: 'unhandledRejection',
        handler: onUnhandledRejection,
      },
      {
        event: 'uncaughtException',
        handler: onUncaughtException,
      },
    );

    if (
      import.meta.url ===
      pathToFileURL(process.argv[1]).href
    ) {
      const onExit = (signal) => {
        console.log(
          replacePlaceholders(
            ${JSON.stringify("CAUGHT_SIGNAL_PLACEHOLDER")}
          ) + signal
        );

        process.exit(
          signal === 'SIGTERM'
            ? ${EXIT_CODES.SIGTERM}
            : ${EXIT_CODES.SIGINT}
        );
      };

      process.on('SIGINT', onExit);
      process.on('SIGTERM', onExit);

      ownedHandlers.push(
        {
          event: 'SIGINT',
          handler: onExit,
        },
        {
          event: 'SIGTERM',
          handler: onExit,
        },
      );
    }

    (async function () {
      try {
        const jasmineCore =
          await import(
            ${JSON.stringify("JASMINE_CORE_URL_PLACEHOLDER")}
          );

        const jasmineRequire =
          jasmineCore.default;

        jasmineRuntime =
          initializeNodeJasmineEnvironment(
            jasmineRequire,
            { reporter },
          );

        const {
          jasmineEnv,
          utils,
        } = jasmineRuntime;

${imports}

        const catalog =
          utils.getCatalog();

        if (
          typeof reporter?.setCatalog ===
          'function'
        ) {
          reporter.setCatalog(catalog);
        } else if (
          typeof reporter?.userAgent ===
          'function'
        ) {
          reporter.userAgent(
            undefined,
            catalog,
          );
        }

        currentSession =
          new RunnerSession(
            () => catalog,
            {
              execute: (plan) =>
                executeNodePlan(
                  jasmineEnv,
                  plan,
                ),
            },
            () => ({
              random:
                ${config.jasmineConfig?.env?.random ?? false},
              seed:
                ${(config.jasmineConfig?.env as any)?.seed ?? 0},
              stopOnFailure:
                ${config.jasmineConfig?.env?.stopSpecOnExpectationFailure ?? false}
            }),
          );

        const result =
          await currentSession.run(
            selector,
          );

        resolve(result);
      } catch (error) {
        console.error(
          replacePlaceholders(
            ${JSON.stringify("ERROR_DURING_EXECUTION_PLACEHOLDER")}
          ) +
          (
            error instanceof Error
              ? error.message
              : String(error)
          )
        );

        if (
          error instanceof Error &&
          error.stack
        ) {
          console.error(
            error.stack,
          );
        }

        resolve(
          ${EXIT_CODES.INTERNAL_ERROR}
        );
      } finally {
        currentSession = null;
        jasmineRuntime = null;
        restoreConsole();

        for (const h of ownedHandlers) {
          process.off(
            h.event,
            h.handler,
          );
        }
      }
    })();
  });
}

export async function runTest(
  reporter,
  selector
) {
  return runTests(
    reporter,
    { spec: selector }
  );
}

export async function runSuite(
  reporter,
  selector
) {
  return runTests(
    reporter,
    { suite: selector }
  );
}

export async function runFile(
  reporter,
  selector
) {
  return runTests(
    reporter,
    { file: selector }
  );
}
`
    .replace(
      'UNHANDLED_REJECTION_PLACEHOLDER',
      messages.unhandledRejection,
    )
    .replace(
      'UNCAUGHT_EXCEPTION_PLACEHOLDER',
      messages.uncaughtException,
    )
    .replace(
      'CAUGHT_SIGNAL_PLACEHOLDER',
      messages.caughtSignal,
    )
    .replace(
      'ERROR_DURING_EXECUTION_PLACEHOLDER',
      messages.errorDuringExecution,
    )
    .replace(
      'JASMINE_CORE_URL_PLACEHOLDER',
      jasmineCoreUrl,
    );
}
````

## File: src/ts-jasmine-cli.ts
````typescript
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import util from 'util';
import { register } from 'tsx/esm/api';
import { registerTestifyRelativeResolver } from './node-relative-resolver';
import { logger } from './logger';
import { JasmineCLIMessages } from './log-messages';
import { AwaitableJasmineConsoleReporter } from './jasmine-console-reporter';
import { initializeNodeJasmineEnvironment } from './jasmine-node-runtime';
import JSONCleaner from './json-cleaner';
import { norm } from './utils';
import { EXIT_CODES } from './exit-codes';
import { ProjectSetup } from './project-setup';

const packageRequire = createRequire(import.meta.url);

// Keep runtime imports opaque to Vite. These paths are selected at runtime and
// must be handled by Node/tsx rather than Vite's browser preload transform.
const nativeImport = new Function(
  'specifier',
  'return import(specifier);',
) as (specifier: string) => Promise<any>;

interface RunnerArgs {
  spec: string;
  random: boolean;
  stopOnFail: boolean;
  seed?: number;
  help: boolean;
  initLaunchConfig: boolean;
}

const vscodeLaunchConfigName = 'Debug current spec (jasmine)';

function getRuntimeEnv(): NodeJS.ProcessEnv {
  const runtimeProcess = (globalThis as any).process as NodeJS.Process | undefined;
  return runtimeProcess?.env ?? {};
}

function isRunningInVsCode(): boolean {
  const env = getRuntimeEnv();
  return (
    env.TERM_PROGRAM === 'vscode' ||
    typeof env.VSCODE_PID === 'string' ||
    typeof env.VSCODE_CWD === 'string' ||
    typeof env.VSCODE_INSPECTOR_OPTIONS === 'string'
  );
}

function printHelp(): void {
  logger.println('jasmine: run a single Jasmine spec in Node');
  logger.println('');
  logger.println('Usage:');
  logger.println('  npx jasmine --spec <path-to-spec>');
  logger.println('  npx jasmine init');
  logger.println('');
  logger.println('Commands:');
  logger.println('  init                Configure Jasmine types and create/update .vscode/launch.json');
  logger.println('');
  logger.println('Options:');
  logger.println('  --spec <path>        Path to a single spec file');
  logger.println('  --random             Randomize spec order');
  logger.println('  --seed <number>      Seed used for randomization');
  logger.println('  --stop-on-fail       Stop on first expectation failure');
  logger.println('  --help               Show this help');
  logger.println('');
  logger.println('TypeScript specs are loaded through tsx using the nearest tsconfig.json.');
  logger.println('');
  logger.println('VS Code debug config name:');
  logger.println(`  ${vscodeLaunchConfigName}`);
}

function parseArgs(argv: string[]): RunnerArgs {
  const args = argv.slice(2);
  const get = (flag: string) => {
    const index = args.indexOf(flag);
    if (index === -1) return undefined;
    return args[index + 1];
  };

  const help = args.includes('--help') || args.includes('-h');
  const command = args[0];
  const initLaunchConfig = args.includes('--init-launch-config') || command === 'init';
  const specRaw = get('--spec');

  if (help) {
    return {
      spec: specRaw ? norm(path.resolve(process.cwd(), specRaw)) : '',
      random: args.includes('--random'),
      stopOnFail: args.includes('--stop-on-fail'),
      seed: get('--seed') ? Number(get('--seed')) : undefined,
      help: true,
      initLaunchConfig,
    };
  }

  if (command && !command.startsWith('-') && command !== 'init') {
    logger.error(JasmineCLIMessages.unknownCommand(command));
    logger.println('');
    printHelp();
    process.exit(EXIT_CODES.INVALID_USAGE);
  }

  if (initLaunchConfig) {
    return {
      spec: specRaw ? norm(path.resolve(process.cwd(), specRaw)) : '',
      random: args.includes('--random'),
      stopOnFail: args.includes('--stop-on-fail'),
      seed: get('--seed') ? Number(get('--seed')) : undefined,
      help: false,
      initLaunchConfig: true,
    };
  }

  if (!specRaw) {
    logger.error(JasmineCLIMessages.missingSpecArg());
    logger.println('');
    printHelp();
    process.exit(EXIT_CODES.INVALID_USAGE);
  }

  const spec = norm(path.resolve(process.cwd(), specRaw));
  if (!fs.existsSync(spec)) {
    logger.error(JasmineCLIMessages.specFileNotFound(spec));
    process.exit(EXIT_CODES.CONFIG_ERROR);
  }

  const seedRaw = get('--seed');
  if (seedRaw !== undefined && !Number.isFinite(Number(seedRaw))) {
    logger.error(JasmineCLIMessages.invalidSeedValue(seedRaw!));
    process.exit(EXIT_CODES.INVALID_USAGE);
  }

  return {
    spec,
    random: args.includes('--random'),
    stopOnFail: args.includes('--stop-on-fail'),
    seed: seedRaw ? Number(seedRaw) : undefined,
    help: false,
    initLaunchConfig: false,
  };
}

function safeStringify(value: unknown): string {
  if (value instanceof Error) {
    return value.stack ?? safeStringify(value.message);
  }

  try {
    const str = String(value);
    if (str !== '[object Object]') {
      return str;
    }
  } catch {
    // fall through to inspect/JSON fallback
  }

  if (value && typeof value === 'object') {
    const constructor = (value as object).constructor?.name ?? 'Object';
    try {
      const inspected = util.inspect(value, { depth: 5, showHidden: true });
      return constructor === 'Object' ? inspected : `${constructor} ${inspected}`;
    } catch {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        // fall through
      }
    }
  }

  try {
    return JSON.stringify(value);
  } catch {
    return '[object Object]';
  }
}



function findNearestTsconfig(startDir: string): string | null {
  let current = norm(path.resolve(startDir));
  while (true) {
    const candidate = norm(path.join(current, 'tsconfig.json'));
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function getDefaultVsCodeLaunchConfiguration(): Record<string, unknown> {
  return {
    type: 'node',
    request: 'launch',
    name: vscodeLaunchConfigName,
    runtimeExecutable: 'node',
    runtimeArgs: ['--enable-source-maps'],
    program: '${workspaceFolder}/node_modules/@epikodelabs/testify/bin/jasmine',
    args: ['--spec', '${file}'],
    cwd: '${workspaceFolder}',
    console: 'integratedTerminal',
    skipFiles: ['<node_internals>/**'],
  };
}

function initVsCodeLaunchConfig(): void {
  const vscodeDir = norm(path.resolve(process.cwd(), '.vscode'));
  const launchJsonPath = norm(path.join(vscodeDir, 'launch.json'));
  const config = getDefaultVsCodeLaunchConfiguration();

  fs.mkdirSync(vscodeDir, { recursive: true });

  if (!fs.existsSync(launchJsonPath)) {
    const launchJson = { version: '0.2.0', configurations: [config] };
    fs.writeFileSync(launchJsonPath, `${JSON.stringify(launchJson, null, 2)}\n`);
    logger.println(JasmineCLIMessages.createdVsCodeLaunchConfig(launchJsonPath));
    logger.println(JasmineCLIMessages.addedVsCodeConfiguration(vscodeLaunchConfigName));
    return;
  }

  const raw = fs.readFileSync(launchJsonPath, 'utf-8');
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    try {
      parsed = new JSONCleaner().parse(raw);
    } catch (error) {
      logger.error(JasmineCLIMessages.failedToParseVsCodeConfig(launchJsonPath));
      logger.error(String(error));
      logger.println('');
      logger.println(JasmineCLIMessages.addConfigManually());
      logger.println(`${JSON.stringify(getDefaultVsCodeLaunchConfiguration(), null, 2)}`);
      process.exit(EXIT_CODES.CONFIG_ERROR);
    }
  }

  if (!parsed || typeof parsed !== 'object') parsed = {};
  if (!Array.isArray(parsed.configurations)) parsed.configurations = [];

  const programSuffix = '/bin/jasmine';
  const existingIndex = parsed.configurations.findIndex((c: any) => {
    if (!c || typeof c !== 'object') return false;
    if (c.name === vscodeLaunchConfigName) return true;

    const program = typeof c.program === 'string' ? c.program.replace(/\\/g, '/') : '';
    const args = Array.isArray(c.args) ? c.args : [];
    return program.endsWith(programSuffix) && args.includes('--spec');
  });

  parsed.version ??= '0.2.0';

  if (existingIndex !== -1) {
    parsed.configurations[existingIndex] = config;
    fs.writeFileSync(launchJsonPath, `${JSON.stringify(parsed, null, 2)}\n`);
    logger.println(JasmineCLIMessages.updatedVsCodeLaunchConfig(launchJsonPath));
    return;
  }

  parsed.configurations.unshift(config);
  fs.writeFileSync(launchJsonPath, `${JSON.stringify(parsed, null, 2)}\n`);
  logger.println(JasmineCLIMessages.updatedVsCodeLaunchConfig(launchJsonPath));
  logger.println(JasmineCLIMessages.addedVsCodeConfiguration(vscodeLaunchConfigName));
}

async function loadJasmine() {
  const jasmineCorePath = norm(packageRequire.resolve('jasmine-core/lib/jasmine-core/jasmine.js'));
  const jasmineCore = await nativeImport(pathToFileURL(jasmineCorePath).href);
  const jasmineRequire = jasmineCore.default;
  return initializeNodeJasmineEnvironment(jasmineRequire, { resetReporters: false });
}

function registerSpecRuntime(specPath: string): () => Promise<void> {
  const tsconfig = findNearestTsconfig(path.dirname(specPath));

  // Register tsx first. It installs its own CommonJS resolver; Testify then
  // wraps that resolver to add bundler-style relative path compatibility.
  const unregisterTsx = register({
    tsconfig: tsconfig ?? false,
  });
  const unregisterRelativeResolver = registerTestifyRelativeResolver();

  return async () => {
    try {
      unregisterRelativeResolver();
    } finally {
      await unregisterTsx();
    }
  };
}

async function loadSpec(specPath: string): Promise<void> {
  await nativeImport(pathToFileURL(specPath).href);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    process.exit(EXIT_CODES.SUCCESS);
  }

  if (args.initLaunchConfig) {
    ProjectSetup.configure(process.cwd());
    initVsCodeLaunchConfig();

    if (!isRunningInVsCode()) {
      logger.println('VS Code was not detected, but .vscode/launch.json was configured successfully.');
    }

    process.exit(EXIT_CODES.SUCCESS);
  }


  const { jasmineEnv } = await loadJasmine();

  process.on('unhandledRejection', (error) => {
    logger.error(JasmineCLIMessages.unhandledRejection(safeStringify(error)));
    process.exit(EXIT_CODES.INTERNAL_ERROR);
  });
  process.on('uncaughtException', (error) => {
    logger.error(JasmineCLIMessages.uncaughtException(safeStringify(error)));
    process.exit(EXIT_CODES.INTERNAL_ERROR);
  });

  jasmineEnv.configure({
    random: args.random,
    stopSpecOnExpectationFailure: args.stopOnFail,
    seed: args.seed,
  });

  const reporter = new AwaitableJasmineConsoleReporter();
  jasmineEnv.addReporter(reporter);

  const unregisterRuntime = registerSpecRuntime(args.spec);
  let result: Awaited<typeof reporter.complete> | undefined;

  try {
    await loadSpec(args.spec);
    await jasmineEnv.execute();
    result = await reporter.complete;
  } finally {
    await unregisterRuntime();
  }

  let exitCode: number;
  if (result?.overallStatus === 'failed') {
    exitCode = EXIT_CODES.TEST_FAILURES;
  } else if (result?.overallStatus === 'incomplete') {
    exitCode = EXIT_CODES.SUCCESS_WITH_PENDING;
  } else {
    exitCode = EXIT_CODES.SUCCESS;
  }
  process.exit(exitCode);
}

main().catch((error) => {
  if (error instanceof Error) {
    logger.error(JasmineCLIMessages.failedToRunJasmine(safeStringify(error)));
  } else {
    const stack = new Error().stack ?? '';
    const value = safeStringify(error);
    logger.error(
      JasmineCLIMessages.failedToRunJasmine(
        `thrown non-Error value: ${value}\n${stack}`,
      ),
    );
  }
  process.exit(EXIT_CODES.INTERNAL_ERROR);
});
````

## File: src/node-test-runner.ts
````typescript
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import type { TestSelector } from './test-selection';
import type {
  ExecutionResult,
} from './execution-result';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import { ConsoleReporter } from './console-reporter';
import { CoverageReportGenerator } from './coverage-report-generator';
import { logger } from './logger';
import { NodeRunnerMessages } from './log-messages';
import {
  resolveNodePreludeModules,
} from './prelude-modules';
import {
  createNodeRunnerModuleSource,
} from './node-runner-module-source';
import {
  discoverNodeBuildArtifacts,
} from './node-build-artifacts';
import {
  NodeRunnerHost,
} from './node-runner-host';

export interface TestRunnerOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  reporter?: jasmine.CustomReporter;
  file?: string;
  coverage?: boolean;
  suppressConsoleLogs?: boolean;
  selector?: TestSelector;
}

export class NodeTestRunner {
  private readonly reporter:
    jasmine.CustomReporter;

  private readonly options:
    TestRunnerOptions;

  private readonly config:
    ViteJasmineConfig;

  private isRunning = false;

  private runnerHost:
    NodeRunnerHost | null = null;

  constructor(
    config: ViteJasmineConfig,
    options: TestRunnerOptions = {},
  ) {
    this.config = config;
    this.options = options;
    this.reporter =
      options.reporter ??
      new ConsoleReporter();
  }

  private resolveJasmineCoreUrl():
    string {
    const require =
      createRequire(
        import.meta.url,
      );

    const jasmineCorePath =
      require.resolve(
        'jasmine-core/lib/jasmine-core/jasmine.js',
      );

    return pathToFileURL(
      jasmineCorePath,
    ).href;
  }

  generateTestRunner(): void {
    const outDir =
      this.config.outDir;

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(
        outDir,
        { recursive: true },
      );
    }

    const artifacts =
      discoverNodeBuildArtifacts(
        outDir,
      );

    if (
      artifacts.specFiles.length === 0
    ) {
      logger.println(
        NodeRunnerMessages
          .noJsFilesForRunner(),
      );

      return;
    }

    const imports = [
      ...resolveNodePreludeModules(
        this.config,
        outDir,
      ).map(
        (specifier) =>
          `    await import(${JSON.stringify(specifier)});`,
      ),

      ...artifacts.specFiles.map(
        (file) =>
          `    await import('./${file}');`,
      ),
    ].join('\n');

    const source =
      createNodeRunnerModuleSource({
        jasmineCoreUrl:
          this.resolveJasmineCoreUrl(),
        imports,
        config: this.config,
      });

    this.runnerHost =
      new NodeRunnerHost(
        artifacts.runnerFile,
      );

    this.runnerHost.write(
      source,
    );

    logger.println(
      NodeRunnerMessages
        .generatedInProcessRunner(
          norm(
            path.relative(
              outDir,
              this.runnerHost.file,
            ),
          ),
        ),
    );
  }

  async start(): Promise<ExecutionResult> {
    if (this.isRunning) {
      logger.println(
        NodeRunnerMessages
          .testProcessAlreadyRunning(),
      );

      return Promise.reject(
        new Error(
          'Test process already running',
        ),
      );
    }

    this.isRunning = true;

    if (this.options.env) {
      for (
        const [key, value] of
        Object.entries(
          this.options.env,
        )
      ) {
        if (value == null) {
          delete process.env[key];
        } else {
          process.env[key] =
            value;
        }
      }
    }

    process.env.NODE_ENV = 'test';

    const shouldSilenceConsole =
      !!this.options
        .suppressConsoleLogs;

    const previousSuppressConsole =
      process.env
        .TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS;

    if (shouldSilenceConsole) {
      process.env
        .TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS =
        '1';
    }

    try {
      const runnerFile =
        path.resolve(
          this.options.cwd ??
            process.cwd(),

          this.options.file ??
            discoverNodeBuildArtifacts(
              this.config.outDir,
            ).runnerFile,
        );

      logger.println(
        NodeRunnerMessages
          .startingTestRunner(),
      );

      const host =
        this.runnerHost?.file ===
          norm(runnerFile)
          ? this.runnerHost
          : new NodeRunnerHost(
              runnerFile,
            );

      this.runnerHost = host;

      await host.load();

      const result =
        await host.execute(
          this.reporter,
          this.options.selector,
        );

      const coverage =
        (globalThis as any)
          .__coverage__;

      if (coverage) {
        const generator =
          new CoverageReportGenerator();

        await generator.generate(
          coverage,
        );
      }

      return result;
    } catch (error: any) {
      logger.println(
        NodeRunnerMessages
          .testExecutionError(
            error.message,
          ),
      );

      throw error;
    } finally {
      if (shouldSilenceConsole) {
        if (
          previousSuppressConsole ===
          undefined
        ) {
          delete process.env
            .TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS;
        } else {
          process.env
            .TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS =
            previousSuppressConsole;
        }
      }

      this.isRunning = false;
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false;

    this.runnerHost?.clear();
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }
}
````

## File: src/cli-handler.ts
````typescript
import * as fs from "fs";
import * as path from "path";
import { ConfigManager } from "./config-manager";
import { logger } from './logger';
import { PackageResolver } from "./package-resolver";
import { ProcessLock } from "./process-lock";
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { ViteJasmineRunner } from "./vite-jasmine-runner";
import { EXIT_CODES, ExitCodeError, getExitCode } from "./exit-codes";
import { CLIMessages } from "./log-messages";
import { setAnsiMode } from "./symbols";
import { ProjectSetup } from "./project-setup";

export function createViteJasmineRunner(config: ViteJasmineConfig): ViteJasmineRunner {
  return new ViteJasmineRunner(config);
}

export class CLIHandler {
  private static runner: ViteJasmineRunner | null = null;

  static async cleanup(): Promise<void> {
    if (this.runner) {
      await this.runner.cleanup();
      this.runner = null;
    }
  }

  static async run(): Promise<number> {
    let shuttingDown = false;
    let sigintCount = 0;
    process.on('SIGINT', async () => {
      sigintCount += 1;
      if (sigintCount > 1) {
        // Second Ctrl+C: cleanup is hung or too slow, force exit now.
        process.exit(EXIT_CODES.SIGINT);
        return;
      }
      if (shuttingDown) return;
      shuttingDown = true;

      const exitCode = this.runner?.abort('SIGINT') ?? EXIT_CODES.SIGINT;
      try {
        await Promise.race([
          this.cleanup(),
          new Promise<void>((_, reject) => setTimeout(() => reject(new Error('cleanup timeout')), 5000))
        ]);
      } catch {
        // Cleanup timed out or failed; force exit anyway.
      }
      process.exit(exitCode);
    });

    const args = process.argv.slice(2);
    const helpRequested = args.includes('--help') || args.includes('-h');

    if (helpRequested) {
      this.printHelp();
      return EXIT_CODES.SUCCESS;
    }

    const initOnly = args.includes('init');
    const watch = args.includes('--watch');
    const headless = args.includes('--headless');
    const coverage = args.includes('--coverage');
    const exclusive = args.includes('--exclusive');
    const browserIndex = args.findIndex((a) => a === '--browser');
    const ansiFlag = args.includes('--ansi');
    const seedIndex = args.findIndex((a) => a === '--seed');
    const projectIndex = args.findIndex((a) => a === '--project');
    const portIndex = args.findIndex((a) => a === '--port');
    const silentLogs = args.includes('--silent') || args.includes('--quiet');
    const hasBrowserArg = browserIndex !== -1;
    const hasProjectArg = projectIndex !== -1;
    let browserName = 'chrome';
    let seedValue: number | undefined;
    let projectValue: string | undefined;
    let portValue: number | undefined;

    if (seedIndex !== -1) {
      const raw = args[seedIndex + 1];
      const parsed = raw !== undefined && raw !== '' ? Number(raw) : NaN;
      if (!Number.isFinite(parsed)) {
        logger.error(CLIMessages.invalidSeed());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid seed value');
      }
      seedValue = parsed;
    }

    if (hasBrowserArg) {
      if (browserIndex + 1 < args.length && !args[browserIndex + 1].startsWith('-')) {
        browserName = args[browserIndex + 1];
      } else {
        logger.error(CLIMessages.browserArgMissing());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Missing browser argument');
      }
    }

    if (hasProjectArg && projectIndex + 1 < args.length) {
      projectValue = args[projectIndex + 1];
    } else if (hasProjectArg) {
      logger.error(CLIMessages.projectArgMissing());
      throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Missing project argument');
    }

    const hasPortArg = portIndex !== -1;
    if (hasPortArg) {
      if (portIndex + 1 < args.length && !args[portIndex + 1].startsWith('-')) {
        const parsed = Number(args[portIndex + 1]);
        if (!Number.isFinite(parsed) || parsed < 1 || parsed > 65535 || !Number.isInteger(parsed)) {
          logger.error(CLIMessages.invalidPort());
          throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid port value');
        }
        portValue = parsed;
      } else {
        logger.error(CLIMessages.portArgMissing());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Missing port argument');
      }
    }

    const preserveOutputsFlag = args.includes('--preserve');
    const preserveOutputsArg = preserveOutputsFlag ? true : undefined;

    if (initOnly) {
      try {
        ConfigManager.initViteJasmineConfig();
        ProjectSetup.configure(process.cwd());
        return EXIT_CODES.SUCCESS;
      } catch (error) {
        logger.error(CLIMessages.failedToInitializeProject(error));
        return getExitCode(error);
      }
    }

    if (watch) {
      const invalidFlags: string[] = [];
      if (headless) invalidFlags.push('--headless');
      if (coverage) invalidFlags.push('--coverage');
      if (browserName === 'node') invalidFlags.push('--browser node');

      if (invalidFlags.length > 0) {
        logger.error(CLIMessages.watchIncompatibleFlags(invalidFlags));
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, `Incompatible watch flags: ${invalidFlags.join(', ')}`);
      }
    }

    try {
      const normalizeDirConfig = (
        dirConfig: string | string[] | undefined,
        fallback: string,
      ): string[] => {
        if (!dirConfig) return [fallback];
        if (Array.isArray(dirConfig)) {
          return dirConfig.length > 0 ? dirConfig : [fallback];
        }
        return [dirConfig];
      };

      let config = ConfigManager.loadViteJasmineBrowserConfig('testify.json');

      if (projectValue) {
        const resolver = new PackageResolver();
        const resolved = await resolver.resolve(projectValue, config.tsconfig);
        if (resolved) {
          projectValue = resolved;
          if (!config.tsconfig) {
            const projectTsconfig = this.findProjectTsconfig(projectValue);
            if (projectTsconfig) {
              config = {
                ...config,
                tsconfig: projectTsconfig,
              };
            }
          }
        } else {
          logger.error(CLIMessages.couldNotResolveProject(projectValue));
          throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, `Could not resolve project: ${projectValue}`);
        }
      }

      if (ansiFlag) {
        setAnsiMode();
      }

      config = {
        ...config,
        headless: headless || browserName === 'node' ? true : (config.headless || false),
        coverage: coverage ? true : (config.coverage || false),
        browser: hasBrowserArg ? browserName : (config.browser || 'chrome'),
        watch: watch ? true : (config.watch || false),
        suppressConsoleLogs: silentLogs ? true : config.suppressConsoleLogs,
        srcDirs: normalizeDirConfig(config.srcDirs, './src'),
        testDirs: normalizeDirConfig(config.testDirs, './tests'),
        preserveOutputs: preserveOutputsArg ?? !!config.preserveOutputs,
        project: projectValue ?? config.project,
        port: portValue ?? config.port,
        ansi: ansiFlag ? true : config.ansi,
      };

      if (config.ansi) {
        setAnsiMode();
      }

      if (seedValue !== undefined) {
        const env = config.jasmineConfig?.env ?? {};
        config.jasmineConfig = {
          ...config.jasmineConfig,
          env: {
            ...env,
            seed: seedValue,
          },
        };
      }

      if (config.preserveOutputs) {
        logger.println(CLIMessages.preserveOutputsEnabled());
      }

      const lock = new ProcessLock(config.project, config.port ?? 8888);
      await lock.acquire(exclusive);
      process.on('exit', () => lock.releaseSync());

      const runner = createViteJasmineRunner(config);
      this.runner = runner;

      const exitCode = watch ? await runner.watch() : await runner.start();

      lock.releaseSync();
      return exitCode;
    } catch (error) {
      logger.error(CLIMessages.failedToStartTestRunner(error));
      return getExitCode(error);
    }
  }

  private static printHelp(): void {
    for (const line of CLIMessages.helpLines()) {
      logger.println(line);
    }
  }

  private static findProjectTsconfig(projectDir: string): string | undefined {
    const candidates = [
      'tsconfig.spec.json',
      'tsconfig.test.json',
      'tsconfig.jasmine.json',
      'tsconfig.json',
      'tsconfig.lib.json',
      'tsconfig.app.json',
    ];

    for (const candidate of candidates) {
      const candidatePath = path.join(projectDir, candidate);
      if (fs.existsSync(candidatePath)) {
        return candidatePath;
      }
    }

    return undefined;
  }
}
````

## File: src/vite-jasmine-runner.ts
````typescript
import * as fs from 'fs';
import * as path from 'path';
import { norm } from './utils';
import { glob } from 'glob';
import { EventEmitter } from 'events';
import { BrowserManager } from './browser-manager';
import { FileDiscoveryService } from './file-discovery-service';
import { HtmlGenerator } from './html-generator';
import { HttpServerManager } from './http-server-manager';
import { NodeTestRunner } from './node-test-runner';
import { ViteConfigBuilder } from './vite-config-builder';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { ConsoleReporter } from './console-reporter';
import { IstanbulInstrumenter } from './istanbul-instrumenter';
import { WebSocketManager } from './websocket-manager';
import { CoverageReportGenerator } from './coverage-report-generator';
import { HmrManager } from './hmr-manager';
import { logger } from './logger';
import { setAnsiMode } from './symbols';
import { RunnerMessages } from './log-messages';
import { ExitCodeError, EXIT_CODES } from './exit-codes';

const { build: viteBuild } = await import('vite');

export class ViteJasmineRunner extends EventEmitter {
  private viteCache: any = null;
  private config: ViteJasmineConfig;
  private fileDiscovery: FileDiscoveryService;
  private viteConfigBuilder: ViteConfigBuilder;
  private htmlGenerator: HtmlGenerator;
  private browserManager: BrowserManager;
  private httpServerManager: HttpServerManager;
  private nodeTestRunner: NodeTestRunner;
  private webSocketManager: WebSocketManager | null = null;
  private consoleReporter: ConsoleReporter;
  private instrumenter: IstanbulInstrumenter;
  private hmrManager: HmrManager | null = null;
  private completePromiseResolve: (() => void) | null = null;
  private completePromise = new Promise<void>((resolve, reject) => { this.completePromiseResolve = resolve; });
  private primarySrcDir: string;
  private primaryTestDir: string;
  private shouldPreserve(): boolean {
    return !!this.config.preserveOutputs;
  }
  
  constructor(config: ViteJasmineConfig) {
    super();

    const cwd = norm(process.cwd());
    let normalizedSrcDirs = (Array.isArray(config.srcDirs) ? config.srcDirs : [config.srcDirs ?? './src'])
      .filter(Boolean)
      .map(norm);
    let normalizedTestDirs = (Array.isArray(config.testDirs) ? config.testDirs : [config.testDirs ?? './tests'])
      .filter(Boolean)
      .map(norm);

    if (config.project) {
      const projectPath = norm(path.resolve(config.project));
      const scopeToProject = (dirs: string[]): string[] => {
        return dirs.map((dir) => {
          const resolved = norm(path.resolve(dir));
          if (resolved.startsWith(projectPath + '/')) {
            return resolved;
          }
          return norm(path.join(projectPath, dir));
        });
      };
      normalizedSrcDirs = scopeToProject(normalizedSrcDirs);
      normalizedTestDirs = scopeToProject(normalizedTestDirs);
    }

    this.primarySrcDir = normalizedSrcDirs[0] ?? cwd;
    this.primaryTestDir = normalizedTestDirs[0] ?? cwd;
    
    this.config = {
      ...config,
      browser: config.browser ?? 'node',
      port: config.port ?? 8888,
      headless: config.headless ?? true,
      watch: config.watch ?? false,
      srcDirs: normalizedSrcDirs,
      testDirs: normalizedTestDirs,
      outDir: norm(config.outDir ?? path.join(cwd, 'dist/.vite-jasmine-build/')),
    };

    if (this.config.ansi) {
      setAnsiMode();
    }

    this.fileDiscovery = new FileDiscoveryService(this.config);
    this.viteConfigBuilder = new ViteConfigBuilder(this.config);
    this.htmlGenerator = new HtmlGenerator(this.fileDiscovery, this.config);
    this.browserManager = new BrowserManager(this.config);
    this.httpServerManager = new HttpServerManager(this.config);
    this.instrumenter = new IstanbulInstrumenter(this.config);
    this.consoleReporter = new ConsoleReporter();
    this.nodeTestRunner = new NodeTestRunner(this.config, {
      reporter: this.consoleReporter,
      cwd: this.config.outDir,
      file: 'test-runner.js',
      coverage: this.config.coverage,
      suppressConsoleLogs: this.config.suppressConsoleLogs
    });
  }



  async preprocess(): Promise<void> {
    try {
      const { srcFiles, specFiles } = await this.fileDiscovery.discoverSources();
      if (specFiles.length === 0) {
        throw new ExitCodeError(EXIT_CODES.CONFIG_ERROR, 'No test files found');
      }

      const entryFiles = [...srcFiles, ...specFiles];
      const viteConfig = this.viteConfigBuilder.createViteConfig(entryFiles);
      const input: Record<string, string> = {};
 
      const entryKeyFromOutput = (file: string) =>
        this.fileDiscovery.getOutputName(file).replace(/\.js$/, '');

      for (const file of entryFiles) {
        input[entryKeyFromOutput(file)] = file;
      }

      if (fs.existsSync(this.config.outDir) && !this.shouldPreserve()) {
        logger.println(RunnerMessages.cleaningOutputDirectory());
        fs.rmSync(this.config.outDir, { recursive: true, force: true });
      }

      if (!fs.existsSync(this.config.outDir)) {
        fs.mkdirSync(this.config.outDir, { recursive: true });
      }

      viteConfig.build!.rollupOptions!.input = input;

      logger.println(RunnerMessages.buildingFiles(Object.keys(input).length));
      this.viteCache = await viteBuild(viteConfig);

      const jsFiles = (await glob(path.join(this.config.outDir, '**/*.js').replace(/\\/g, '/')))
        .filter((f) => !/\.spec\.js$/i.test(f));

      for (const jsFile of jsFiles) {
        const result = await this.instrumenter.instrumentFile(jsFile);
        const outFile = path.join(this.config.outDir, path.relative(this.config.outDir, jsFile));
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, result.code, 'utf-8');
        
        // Update source map if it was modified during instrumentation
        if (result.sourceMap) {
          const mapFile = outFile + '.map';
          fs.writeFileSync(mapFile, JSON.stringify(result.sourceMap, null, 2), 'utf-8');
        }
      }

      const htmlPath = path.join(this.config.outDir, 'index.html');
      const preserveHtml = this.shouldPreserve() && fs.existsSync(htmlPath);
      if (!(this.config.headless && this.config.browser === 'node') && !preserveHtml) {
        if (this.config.watch) {
          await this.htmlGenerator.generateHtmlFileWithHmr();
        } else {
          await this.htmlGenerator.generateHtmlFile();
        }
      } else if (preserveHtml) {
        logger.println(RunnerMessages.preservingExistingHtml());
      }

      const runnerPath = path.join(this.config.outDir, 'test-runner.js');
      const preserveRunner = this.shouldPreserve() && fs.existsSync(runnerPath);
      if (this.config.headless && this.config.browser === 'node' && !preserveRunner) {
        this.nodeTestRunner.generateTestRunner();
      } else if (this.config.headless && this.config.browser === 'node' && preserveRunner) {
        logger.println(RunnerMessages.preservingExistingRunner());
      }
    } catch (error) {
      logger.error(RunnerMessages.preprocessFailed(error));
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    if (this.hmrManager) {
      await this.hmrManager.stop();
      this.hmrManager = null;
    }
    if (this.webSocketManager) {
      await this.webSocketManager.cleanup();
      this.webSocketManager = null;
    }
    await this.httpServerManager.cleanup();
  }

  abort(message?: string): number {
    // Signal the browser manager to stop any running browser immediately.
    // Node-runner mode has no cooperative cancel; it will exit via the
    // CLI's process.exit() after cleanup.
    this.browserManager.abort((message ?? 'SIGINT') as NodeJS.Signals);
    return this.consoleReporter.testsAborted(message);
  }

  async start(): Promise<number> {
    if (this.config.watch) {
      // if watch mode requested, redirect to dedicated watch() entry
      return this.watch();
    }

    logger.println(this.config.headless ? RunnerMessages.startingHeadless() : RunnerMessages.startingServer());

    try {
      await this.preprocess();
    } catch (error) {
      logger.error(RunnerMessages.buildFailed(error));
      throw error instanceof ExitCodeError ? error : new ExitCodeError(EXIT_CODES.INTERNAL_ERROR, String(error));
    }

    if (this.config.headless && this.config.browser !== 'node') {
      return await this.runHeadlessBrowserMode();
    } else if (this.config.headless && this.config.browser === 'node') {
      return await this.runHeadlessNodeMode();
    } else if (!this.config.headless && this.config.browser === 'node') {
      logger.error(RunnerMessages.invalidNodeHeadedMode());
      return EXIT_CODES.CONFIG_ERROR;
    } else {
      return await this.runHeadedBrowserMode();
    }
  }

  async watch(): Promise<number> {
    if (this.config.headless || this.config.browser === 'node') {
      logger.error(RunnerMessages.watchOnlyHeaded());
      return EXIT_CODES.CONFIG_ERROR;
    }

    this.config.watch = true;
    logger.println(RunnerMessages.startingWatchMode());
    await this.preprocess();
    return await this.runWatchMode();
  }

  private async runWatchMode(): Promise<number> {
    logger.println(RunnerMessages.startingHmrWatcher());

    const server = await this.httpServerManager.startServer();
    
    this.webSocketManager = new WebSocketManager(this.fileDiscovery, this.config, server, this.consoleReporter);
    this.hmrManager = new HmrManager(this.fileDiscovery, this.config, this.viteConfigBuilder, this.viteCache);

    this.webSocketManager.enableHmr(this.hmrManager);
    await this.hmrManager.start();

    logger.println(RunnerMessages.webSocketReady());
    logger.println(RunnerMessages.pressCtrlCToStop());

    let shuttingDown = false;
    let watchFinishedResolve: ((code: number) => void) | null = null;
    const watchFinishedPromise = new Promise<number>((resolve) => {
      watchFinishedResolve = resolve;
    });

    const onBrowserClose = async () => {
      if (shuttingDown) return;
      shuttingDown = true;
      logger.println(RunnerMessages.browserWindowClosed());
      await this.cleanup();
      watchFinishedResolve?.(EXIT_CODES.SUCCESS);
    };

    await this.browserManager.openBrowser(this.config.port!, onBrowserClose, { exitOnClose: false });

    // Keep the runner alive until an explicit shutdown signal or browser close.
    return watchFinishedPromise;
  }

  private async runHeadlessBrowserMode(): Promise<number> {
    const server = await this.httpServerManager.startServer();
    await this.httpServerManager.waitForServerReady(`http://localhost:${this.config.port}/index.html`, 10000);
    this.webSocketManager = new WebSocketManager(this.fileDiscovery, this.config, server, this.consoleReporter);

    let testSuccess = false;
    let testHasPending = false;
    let coveragePromise: Promise<void> | undefined;
    let testsCompletedResolve: (() => void) | null = null;
    const testsCompletedPromise = new Promise<void>((resolve) => {
      testsCompletedResolve = resolve;
    });
    this.webSocketManager.on('testsCompleted', ({ success, hasPending, coverage }) => {
      testSuccess = success;
      testHasPending = hasPending;
      if (this.config.coverage) {
        const cov = new CoverageReportGenerator();
        coveragePromise = cov.generate(coverage);
      }
      testsCompletedResolve?.();
    });

    const browserType = await this.browserManager.checkBrowser(this.config.browser!);

    if (!browserType) {
      logger.println(RunnerMessages.headlessBrowserUnavailable());
      this.nodeTestRunner.generateTestRunner();
      const exitCode = await this.nodeTestRunner.start();
      await this.cleanup();
      return exitCode;
    }

    try {
      await this.browserManager.runHeadlessBrowserTests(browserType, this.config.port!);
      // Wait for the jasmineDone WebSocket message to be processed so the final
      // summary is printed before we tear down the WebSocket server and exit.
      const testsCompletedTimeout = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('Timed out waiting for test completion message')), 5000);
      });
      await Promise.race([testsCompletedPromise, testsCompletedTimeout]).catch((error) => {
        logger.println(RunnerMessages.testsCompletedTimeout(error.message));
      });
      if (coveragePromise) await coveragePromise;
      await this.cleanup();
      if (!testSuccess) {
        return EXIT_CODES.TEST_FAILURES;
      }
      return testHasPending ? EXIT_CODES.SUCCESS_WITH_PENDING : EXIT_CODES.SUCCESS;
    } catch (error) {
      if (error instanceof ExitCodeError) {
        if (coveragePromise) await coveragePromise.catch(() => {});
        await this.cleanup();
        return error.exitCode;
      }
      logger.error(RunnerMessages.browserTestExecutionFailed());
      if (coveragePromise) await coveragePromise.catch(() => {});
      await this.cleanup();
      return EXIT_CODES.INTERNAL_ERROR;
    }
  }

  private async runHeadlessNodeMode(): Promise<number> {
    try {
      const exitCode = await this.nodeTestRunner.start();
      if (this.config.coverage) {
        const coverage = (globalThis as any).__coverage__;
        const cov = new CoverageReportGenerator();
        await cov.generate(coverage);
      }
      return exitCode;
    } catch (error: any) {
      logger.error(RunnerMessages.nodeTestExecutionFailed(error.message ?? String(error)));
      return EXIT_CODES.INTERNAL_ERROR;
    }
  }

  private async runHeadedBrowserMode(): Promise<number> {
    const server = await this.httpServerManager.startServer();
    let testsCompleted = false;
    let testSuccess = false;
    let testHasPending = false;
    let finishHeadedRunPromise: Promise<void> | undefined;
    this.webSocketManager = new WebSocketManager(this.fileDiscovery, this.config, server, this.consoleReporter);

    logger.println(RunnerMessages.webSocketReadyWithReporting());
    logger.println(RunnerMessages.pressCtrlCToStop());

    const finishHeadedRun = async (coverage: Record<string, any> | undefined): Promise<void> => {
      if (this.config.coverage) {
        const cov = new CoverageReportGenerator();
        await cov.generate(coverage!);
      }
      await this.browserManager.closeBrowser();
    };

    this.webSocketManager.on('testsCompleted', ({ success, hasPending, coverage }) => {
      if (testsCompleted) {
        return;
      }
      testsCompleted = true;
      testSuccess = success;
      testHasPending = hasPending;
      finishHeadedRunPromise = finishHeadedRun(coverage);
      finishHeadedRunPromise.catch((error) => {
        logger.error(RunnerMessages.finishHeadedRunFailed(error));
      });
    });

    let runFinishedResolve: ((code: number) => void) | null = null;
    const runFinishedPromise = new Promise<number>((resolve) => {
      runFinishedResolve = resolve;
    });

    const onBrowserClose = async () => {
      const promise = new Promise<void>((resolve) => {
        if (!testsCompleted) {
          setImmediate(() => {
            logger.clearLine();
            logger.printRaw('\n');
            logger.clearLine();
            this.consoleReporter.testsAborted();
            logger.clearLine();
            logger.printRaw('\n');
            logger.println(RunnerMessages.browserWindowClosedPrematurely());
            resolve();
          });
        } else {
          resolve();
        }
      });

      await promise;
      // Wait for finishHeadedRun to complete before cleanup and exit
      if (finishHeadedRunPromise) {
        await finishHeadedRunPromise.catch(() => {});
      }
      await this.cleanup();
      if (!testsCompleted) {
        runFinishedResolve?.(EXIT_CODES.SIGINT);
        return;
      }
      if (!testSuccess) {
        runFinishedResolve?.(EXIT_CODES.TEST_FAILURES);
        return;
      }
      runFinishedResolve?.(testHasPending ? EXIT_CODES.SUCCESS_WITH_PENDING : EXIT_CODES.SUCCESS);
    };

    await this.browserManager.openBrowser(this.config.port!, onBrowserClose);

    // Keep the runner alive until the browser closes or an explicit shutdown signal.
    return runFinishedPromise;
  }
}
````

## File: src/html-generator.ts
````typescript
import * as fs from 'fs';
import * as path from 'path';
import type { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import type { FileDiscoveryService } from './file-discovery-service';
import { logger } from './logger';
import { HtmlMessages } from './log-messages';
import { BrowserPageBuilder } from './browser-page-builder';
import {
  discoverBrowserBuildArtifacts,
} from './browser-build-artifacts';

export class HtmlGenerator {
  private readonly pageBuilder:
    BrowserPageBuilder;

  constructor(
    fileDiscovery: FileDiscoveryService,
    private readonly config: ViteJasmineConfig,
  ) {
    // Kept in the constructor for v1 API compatibility. Page composition no
    // longer depends on discovery; built output files are the source of truth.
    void fileDiscovery;

    this.pageBuilder =
      new BrowserPageBuilder(config);
  }

  async generateHtmlFile(): Promise<void> {
    const htmlDir =
      this.ensureOutputDirectory();

    const artifacts =
      discoverBrowserBuildArtifacts(
        htmlDir,
      );

    if (artifacts.files.length === 0) {
      logger.println(
        HtmlMessages.noJsFilesForHtml(),
      );
      return;
    }

    const htmlContent =
      this.pageBuilder.buildStatic(
        artifacts.specFiles,
      );

    this.writePage(
      htmlContent,
      HtmlMessages.generatedTestPage,
    );
  }

  async generateHtmlFileWithHmr():
    Promise<void> {
    this.ensureOutputDirectory();

    const htmlContent =
      this.pageBuilder.buildHmr();

    this.writePage(
      htmlContent,
      HtmlMessages.generatedHmrTestPage,
    );
  }

  private ensureOutputDirectory(): string {
    const htmlDir = this.config.outDir;

    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(
        htmlDir,
        { recursive: true },
      );
    }

    return htmlDir;
  }

  private writePage(
    htmlContent: string,
    messageFactory: (
      relativePath: string,
    ) => string,
  ): void {
    const htmlPath = norm(
      path.join(
        this.config.outDir,
        'index.html',
      ),
    );

    fs.writeFileSync(
      htmlPath,
      htmlContent,
    );

    logger.println(
      messageFactory(
        norm(
          path.relative(
            this.config.outDir,
            htmlPath,
          ),
        ),
      ),
    );
  }
}
````

## File: CHANGELOG.md
````markdown
# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# Changelog

## 1.0.37 - 2026-08-07

### Added

* Added suite IDs to runner.listTests() for easier execution with runner.runSuite().
* Added testify init and jasmine init commands for explicit project setup.

### Improved

* Improved standalone Jasmine CLI and VS Code debugging.
* Improved compatibility with Node.js 22 and TypeScript projects.
* Improved runtime module resolution for relative TypeScript imports.

### Changed

* Replaced the legacy ESM loader with a tsx-based runtime.
* Removed automatic project setup during package installation.
* Project configuration is now performed explicitly via testify init or jasmine init.

### Fixed

* Fixed multiple issues affecting standalone Jasmine execution and debugging.
* Fixed CLI bundling and Node runtime compatibility.

### Breaking Changes

* Removed the legacy `esm-loader.mjs` runtime.
* Removed automatic `postinstall` project configuration.
* Project initialization is now explicit and should be performed with:

```bash
npx testify init
```

or

```bash
npx jasmine init
```


## [1.0.36] - 2026-07-31

### Fixed
- **CLI startup on Node.js 22**: Replaced the `minimatch` import used during Vite config discovery with `picomatch`, so `npx testify` no longer fails at startup with `Named export 'minimatch' not found`.

## [1.0.35] - 2026-07-30

### Fixed
- **Peer dependency declaration**: `@types/jasmine` is now declared as a peer dependency so consumer projects get an explicit type requirement instead of relying on testify's internal dev dependency.
- **Install-time tsconfig registration**: The published package now updates the consumer project's `tsconfig.json` during `postinstall` to ensure `compilerOptions.types` includes `"jasmine"`.

### Changed
- **Simplified init command**: `testify init` now only scaffolds `testify.json`, while Jasmine type setup is handled during package installation.

## [1.0.34] - 2026-07-29

### Fixed
- **Published package assembly**: The packaged CLI now reliably includes `postinstall.mjs` and bundled assets such as `assets/favicon.ico`, so installs no longer fail because declared package files are missing from the published artifact.
- **`init` project setup**: `testify init` now installs `@types/jasmine` into the consumer project, updates the relevant tsconfig to include `"jasmine"` in `compilerOptions.types`, and creates an explicit `types` array when one was missing.
- **Windows init installs**: Project dependency installation during `testify init` now launches the package manager in a Windows-safe way, avoiding `spawnSync npm.cmd EINVAL` failures.
- **Path alias resolution**: Vite path aliases now resolve correctly when tsconfig settings are inherited through `extends`, with `baseUrl` and `paths` interpreted relative to the tsconfig file that defines them.
- **Rolldown compatibility**: The invalid incremental build cache option is no longer passed through to Rolldown, removing the `Invalid key: "cache"` warning during test preprocessing.
- **Vite build packaging**: CLI packaging no longer depends on the incompatible `rollup-plugin-copy` target shape, and the deprecated `inlineDynamicImports` usage has been replaced with current Vite/Rolldown-compatible output settings.

### Changed
- **Playwright runtime dependency**: Replaced `playwright-core` with `playwright` for browser automation, simplifying runtime dependency handling and aligning the package with Playwright's standard install surface.
- **Init config scaffold**: Newly generated `testify.json` files now write `viteBuildOptions.preserveModulesRoot` as `"."` instead of an absolute filesystem path.

## [1.0.33] - 2026-07-24

### Fixed
- **Browser bootstrap loading**: The generated browser runner page no longer eagerly imports every built source entry before specs start. It now imports spec entries only and relies on normal ESM dependency loading to pull source modules on demand.
- **HMR startup loading**: Watch-mode startup no longer preloads all built source modules when the browser connects. It now loads only spec entries during initial HMR bootstrap.
- **Node bootstrap loading**: The generated Node runner no longer eagerly imports every built source entry before Jasmine starts. It now imports configured preludes first and then loads only compiled spec entries.
- **`.mjs` module serving**: The built-in HTTP server now serves `.mjs` files with a JavaScript module MIME type.
- **Workspace package serving**: Browser requests for `/node_modules/...` now prefer the consumer workspace's `node_modules` directory, so application dependencies such as Angular packages resolve correctly instead of being limited to `testify`'s bundled dependencies.
- **Dependency installation scope**: Installing `testify` no longer downloads Playwright browser binaries as part of `npm install`. Browser installation is now an explicit separate step.

### Added
- **HTML prelude modules**: Added `htmlOptions.preludeModules` for explicitly loading browser-side setup modules before specs without relying on HTML injection workarounds.
- **Angular JIT support option**: Added `angularOptions.enableJitCompiler` to preload `@angular/compiler` for partially compiled Angular libraries without requiring manual HTML prelude configuration.

## [1.0.30] - 2026-07-09

### Fixed
- **Test filename generation**: Test filenames in the `dist` folder are now generated with a flattened path and a hash (e.g., `my__testfile__${hash}.spec.js`). This approach reduces the possibility of filename collisions in the output directory, ensuring unique and predictable names for test bundles.

## [1.0.29] - 2026-06-20

### Fixed
- **Jasmine CLI error reporting**: Errors and rejected values in the `jasmine` CLI are now safely stringified before logging, preventing crashes when handling non-Error objects or circular structures.
- **Abort signal handling**: A single `Ctrl+C` now more reliably aborts running tests. The CLI tracks repeated `SIGINT`s and force-exits on the second press, the runner propagates the abort signal to the browser manager, and spec result counting uses client-side status values to avoid misreporting failures or pending specs.
- **Headless browser interruption**: The headless browser is now tracked in `BrowserManager.currentBrowser` so `abort()` closes it immediately, stopping long-running navigation or test execution on the first `Ctrl+C`.

## [1.0.28] - 2026-06-11

### Fixed
- **Jasmine CLI runner**: The `jasmine` CLI no longer fails with a `TypeError` in Node.js ESM mode when resolving its own package dependencies.

## [1.0.27] - 2026-06-11

### Fixed
- **Restored Unicode box drawing in TTY mode**: The console reporter once again uses proper Unicode box-drawing borders (┌─┐│└─┘) when running in a TTY, while `--ansi` mode correctly keeps ASCII boxes.
- **Coverage report output**: Coverage text reports now bypass prompt detection by using raw output, preventing formatting artifacts in printed reports.

## [1.0.26] - 2026-06-11

### Changed
- **Real 8-bit mode**: By popular demand, the `--ansi` flag now truly commits to the bit. No more Unicode box-drawing borders, no more emoji checkmarks — just honest ASCII `+---+ | ... | +---+` boxes and plain `[OK] / [ERROR] / [WARN] / [STOP]` labels. All carriage-return trickery and live status lines have been removed; only final suite results are printed once per suite. Colors are also properly disabled when `--ansi` is active.

## [1.0.25] - 2026-06-10

### Added
- **Browser Lifecycle Management**: Improved browser process handling in `BrowserManager` to gracefully manage user interruptions (Ctrl+C) and prevent orphaned processes.
- **Test Interruption Handling**: The new reporter can now gracefully handle `SIGINT` and `SIGTERM` signals, aborting the test run and providing a summary of executed, failed, and incomplete tests.

## [1.0.24] - 2026-06-01

Fixed a broad set of runtime and reporting bugs: coverage now remaps through registered source maps so original source paths appear in reports, the Istanbul instrumenter is recreated per file to avoid counter mutation, HMR rebuild races and graph leaks are resolved, console output width calculations account for all gaps so lines no longer overflow, signal handling and browser lifecycle leaks are cleaned up, `--browser node` implies `--headless`, and `MAX_WIDTH` is now dynamic. Also removed unused dependencies and condensed the README.

## [1.0.23] - 2026-05-27

Added `--project <name>` to run tests scoped to a specific package (resolved via `tsconfig.json` references or workspace definitions) and `--exclusive` to terminate any previously running testify instance before starting a new one. `srcDirs` and `testDirs` are now automatically scoped under the resolved project directory when `--project` is provided.

## [1.0.22] - 2026-05-21

Resolved a broad set of runtime bugs, ESM compatibility issues, and internal regressions. Revised exit codes for clearer CLI failure interpretation and improved console wrapping so long output stays readable.

## [1.0.20] - 2026-02-14

Single `Ctrl+C` now aborts the current run and exits cleanly, double `Ctrl+C` handling during interrupted runs was fixed, and line merging in console output was corrected. Suite labels now always use exactly one space before dot fill and respect `MAX_WIDTH`.

## [1.0.11] - 2025-10-03

Initial public release of `testify` with browser-based Jasmine runner, CLI binaries with shebang support, watch mode with hot module reloading, WebSocket-based event forwarding, Istanbul coverage support, and VS Code debug integration.
````

## File: src/console-reporter.ts
````typescript
import util from 'util';
import { logger } from './logger';
import { wrapLine, visibleWidth, ANSI_FULL_REGEX, normalize } from './utils';
import { EXIT_CODES } from './exit-codes';
import { getMaxWidth, isAnsiMode } from './ansi-constants';
import { ReporterMessages } from './log-messages';
import { SYMBOLS, replacePlaceholders } from './symbols';
import type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';

export interface EnvironmentInfo {
  node: string;
  platform: string;
  arch: string;
  cwd: string;
  memory: string;
  pid: number;
  uptime: string;
  userAgent?: UserAgent;
}

export interface UserAgent {
  userAgent: string;
  appName: string;
  appVersion: string;
  platform: string;
  vendor: string;
  language: string;
  languages: string[];
}

export interface TestSpec {
  id: string;
  description: string;
  fullName: string;
  status: 'passed' | 'failed' | 'pending' | 'incomplete' | 'skipped' | 'running';
  duration?: number;
  failedExpectations?: any[];
  pendingReason?: string;
}

export interface TestSuite {
  id: string;
  description: string;
  fullName: string;
  specs: TestSpec[];
  children: TestSuite[];
  parent?: TestSuite;
  status?: TestStatus;
}

export type TestStatus = 'passed' | 'failed' | 'pending' | 'skipped' | 'running' | 'incomplete';

export interface ConsoleReporterOptions {
  showColors?: boolean;
}

export class ConsoleReporter {
  private print: (...args: any[]) => void;
  private showColors: boolean;
  private specCount: number;
  private executableSpecCount: number;
  private failureCount: number;
  private failedSpecs: any[];
  private pendingSpecs: any[];
  private ansi: Record<string, string>;
  private startTime: number;
  private config: any | null = null;
  private envInfo: EnvironmentInfo | null;
  private rootSuite: TestSuite;
  private currentSuite: TestSuite | null;
  private suiteStack: TestSuite[];
  private currentSpec: TestSpec | null;
  private suiteById: Map<string, TestSuite> = new Map();
  private specById: Map<string, TestSpec> = new Map();
  private get lineWidth(): number { return getMaxWidth(); }
  private interruptHandlersRegistered: boolean = false;
  private interrupted = false;
  private isTTY: boolean;
  private catalog: TestCatalog | null = null;

  constructor(options: ConsoleReporterOptions = {}) {
    this.print = (...args) => process.stdout.write(util.format(...args));
    this.showColors = options.showColors ?? this.detectColorSupport();
    this.isTTY = !isAnsiMode() && (process.stdout.isTTY ?? false);
    this.specCount = 0;
    this.executableSpecCount = 0;
    this.failureCount = 0;
    this.failedSpecs = [];
    this.pendingSpecs = [];
    this.startTime = 0;
    this.envInfo = null;
    this.rootSuite = this.createRootSuite();
    this.currentSuite = null;
    this.suiteStack = [this.rootSuite];
    this.currentSpec = null;
    this.ansi = {
      green: '\x1B[32m',
      brightGreen: '\x1B[92m',
      red: '\x1B[31m',
      brightRed: '\x1B[91m',
      yellow: '\x1B[33m',
      brightYellow: '\x1B[93m',
      blue: '\x1B[34m',
      brightBlue: '\x1B[94m',
      cyan: '\x1B[36m',
      brightCyan: '\x1B[96m',
      magenta: '\x1B[35m',
      gray: '\x1B[90m',
      white: '\x1B[97m',
      bold: '\x1B[1m',
      dim: '\x1B[2m',
      none: '\x1B[0m',
    };
  }

  setCatalog(catalog: TestCatalog): void {
    this.catalog = catalog;
    this.buildSuiteTreeFromCatalog(catalog);
  }

  getCatalog(): TestCatalog | null {
    return this.catalog;
  }

  getFailureCount(): number {
    return this.failureCount;
  }

  private detectColorSupport(): boolean {
    if (isAnsiMode()) return false;
    if (process.env.NO_COLOR) return false;
    if (process.env.FORCE_COLOR === '1' || process.env.FORCE_COLOR === 'true' || process.env.FORCE_COLOR) return true;
    return process.stdout.isTTY ?? false;
  }

  private createRootSuite(): TestSuite {
    return {
      id: this.catalog?.rootSuiteId ?? 'suite0',
      description: 'Jasmine__TopLevel__Suite',
      fullName: '',
      specs: [],
      children: [],
      status: 'skipped',
    };
  }

  private toReporterSuite(source: TestCatalogSuite): TestSuite {
    return {
      id: source.id,
      description: this.normalizeDescription(source.description ?? source.id),
      fullName: source.fullName ?? source.id,
      specs: [],
      children: [],
      status: 'skipped',
    };
  }

  private toReporterSpec(source: TestCatalogSpec): TestSpec {
    return {
      id: source.id,
      description: source.description ?? source.id,
      fullName: source.fullName ?? source.id,
      status: 'skipped',
    };
  }

  private buildSuiteTreeFromCatalog(catalog: TestCatalog): void {
    this.rootSuite = this.createRootSuite();
    this.suiteById.clear();
    this.specById.clear();
    this.suiteStack = [this.rootSuite];
    this.currentSuite = null;
    this.currentSpec = null;

    this.suiteById.set(this.rootSuite.id, this.rootSuite);

    for (const suiteConfig of catalog.suites) {
      const suite = this.toReporterSuite(suiteConfig);
      this.suiteById.set(suite.id, suite);
    }

    for (const suiteConfig of catalog.suites) {
      const suite = this.suiteById.get(suiteConfig.id);
      if (!suite) continue;

      const parent = suiteConfig.parentSuiteId
        ? this.suiteById.get(suiteConfig.parentSuiteId)
        : this.rootSuite;

      const parentSuite = parent ?? this.rootSuite;
      suite.parent = parentSuite;
      parentSuite.children.push(suite);
    }

    for (const specConfig of catalog.specs) {
      const spec = this.toReporterSpec(specConfig);
      this.specById.set(spec.id, spec);

      const parentSuite = specConfig.suiteId
        ? this.suiteById.get(specConfig.suiteId)
        : undefined;

      (parentSuite ?? this.rootSuite).specs.push(spec);
    }

    logger.println(
      ReporterMessages.suiteTreeBuilt(
        catalog.suites.length,
        catalog.specs.length,
      ),
    );
  }

  countSpecs(suite: TestSuite) {
    let total = suite.specs.length;
    for (const child of suite.children) {
      total += this.countSpecs(child);
    }
    return total;
  }

  private normalizeDescription(desc: any): string {
    if (typeof desc === 'string') return desc;
    if (desc?.en) return desc.en;
    return JSON.stringify(desc);
  }

  userAgent(agentInfo: any, suitesOrCatalog: any, specs?: any) {
    if (
      suitesOrCatalog &&
      Array.isArray(suitesOrCatalog.suites) &&
      Array.isArray(suitesOrCatalog.specs)
    ) {
      this.setCatalog(suitesOrCatalog as TestCatalog);
    } else if (!this.catalog && Array.isArray(suitesOrCatalog) && Array.isArray(specs)) {
      // Compatibility bridge for v1 callers. Convert legacy arrays once, without
      // guessing hierarchy here; callers should migrate to passing TestCatalog.
      this.setCatalog({
        suites: suitesOrCatalog.map((suite: any) => ({
          id: suite.id,
          description: suite.description ?? suite.id,
          fullName: suite.fullName ?? suite.id,
          parentSuiteId: suite.parentSuiteId,
          file: suite.file,
        })),
        specs: specs.map((spec: any) => ({
          id: spec.id,
          description: spec.description ?? spec.id,
          fullName: spec.fullName ?? spec.id,
          suiteId: spec.suiteId,
          file: spec.file,
        })),
      });
    }

    if (agentInfo) {
      this.envInfo = {
        ...this.gatherEnvironmentInfo(),
        userAgent: agentInfo,
      };
    }
  }

  jasmineStarted(suiteInfo: any) {
    this.startTime = Date.now();
    this.specCount = suiteInfo?.totalSpecsDefined ?? this.catalog?.specs.length ?? 0;
    this.executableSpecCount = suiteInfo?.totalTime ? this.specCount : this.specCount;
    this.failureCount = 0;
    this.failedSpecs = [];
    this.pendingSpecs = [];
  }

  suiteStarted(result: any) {
    const suite = this.suiteById.get(result.id);
    if (!suite) return;

    suite.status = 'running';
    this.currentSuite = suite;
    this.suiteStack.push(suite);
  }

  specStarted(result: any) {
    const spec = this.specById.get(result.id);
    if (!spec) return;

    spec.status = 'running';
    this.currentSpec = spec;
  }

  specDone(result: any) {
    const spec = this.specById.get(result.id);
    if (!spec) return;

    spec.status = result.status;
    spec.failedExpectations = result.failedExpectations;
    spec.pendingReason = result.pendingReason;

    if (result.status === 'failed') {
      this.failureCount += 1;
      this.failedSpecs.push(result);
    } else if (result.status === 'pending') {
      this.pendingSpecs.push(result);
    }

    this.currentSpec = null;
  }

  suiteDone(result: any) {
    const suite = this.suiteById.get(result.id);
    if (!suite) return;

    suite.status = result.status;
    if (this.suiteStack[this.suiteStack.length - 1]?.id === suite.id) {
      this.suiteStack.pop();
    }
    this.currentSuite = this.suiteStack[this.suiteStack.length - 1] ?? null;
  }

  jasmineDone(result: any) {
    const duration = Date.now() - this.startTime;
    const failed = this.failureCount;
    const pending = this.pendingSpecs.length;

    if (result?.overallStatus === 'failed' || failed > 0) {
      this.print(this.colored('brightRed', `\n  ${SYMBOLS.cross_mark} ${failed} failed\n`));
    } else if (pending > 0) {
      this.print(this.colored('brightYellow', `\n  ${SYMBOLS.pending} ${pending} pending\n`));
    } else {
      this.print(this.colored('brightGreen', `\n  ${SYMBOLS.check_mark} All specs passed\n`));
    }

    this.print(this.colored('gray', `  ${duration}ms\n`));
  }

  private colored(style: string | string[], text: string): string {
    if (!this.showColors) return text.replace(ANSI_FULL_REGEX, '');
    const styles = Array.isArray(style) ? style : [style];
    const seq = styles.map(s => this.ansi[s] ?? '').join('');
    return `${seq}${text}${this.ansi.none}`;
  }

  private gatherEnvironmentInfo(): EnvironmentInfo {
    const memUsage = process.memoryUsage();
    const memTotal = Math.round(memUsage.heapTotal / 1024 / 1024);
    const uptime = Math.round(process.uptime());

    return {
      node: process.version,
      platform: `${process.platform} ${process.arch}`,
      arch: process.arch,
      cwd: process.cwd(),
      memory: `${memTotal} MB`,
      pid: process.pid,
      uptime: `${uptime}s`,
    };
  }
}
````

## File: src/lib.ts
````typescript
export { JasmineConsoleReporter, AwaitableJasmineConsoleReporter } from './jasmine-console-reporter';
export {
  createTestCatalogFromJasmineEnv,
  getCatalogSpecIds,
  getCatalogSuiteIds,
  getCatalogFiles,
  getSpecIdsForFile,
} from './test-catalog';
export type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';
export {
  findCatalogSpecs,
  findCatalogSuites,
  getDescendantSuiteIds,
  getSpecIdsForSuites,
  getSpecIdsForFiles,
  resolveTestSelector,
} from './test-selection';
export type { TestSelector } from './test-selection';

export { createBrowserTestCatalog } from './browser-test-catalog';

export {
  beginTestifyRegistrationScope,
  captureTestifyRegistration,
  endTestifyRegistrationScope,
  getCurrentTestifyRegistrationFile,
  getTestifyFile,
  getTestifyMetadata,
  setTestifyFile,
  setTestifyMetadata,
  withTestifyRegistrationScope,
} from './test-metadata';
export type { TestifyItemMetadata } from './test-metadata';

export {
  getBrowserRuntimeScript,
} from './browser-runtime';
export type {
  BrowserRuntimeScriptOptions,
} from './browser-runtime';
export {
  getBrowserJasmineRegistrationPatchScript,
} from './browser-jasmine-runtime';

export {
  getBrowserWebSocketReporterScript,
} from './browser-websocket-runtime';
export {
  getBrowserHmrClientScript,
} from './browser-hmr-client';

export {
  getBrowserBootstrapScript,
} from './browser-bootstrap-runtime';
export type {
  BrowserBootstrapScriptOptions,
} from './browser-bootstrap-runtime';
export {
  createBrowserPage,
} from './browser-page';
export type {
  BrowserPage,
  BrowserPageScripts,
} from './browser-page';

export {
  getStaticBrowserBootstrapScript,
} from './browser-static-bootstrap';
export type {
  StaticBrowserBootstrapOptions,
} from './browser-static-bootstrap';

export {
  BrowserPageBuilder,
} from './browser-page-builder';

export {
  createExecutionPlan,
  createFileExecutionPlan,
  createSpecExecutionPlan,
  createSuiteExecutionPlan,
  getEmbeddedExecutionPlanSource,
} from './execution-plan';
export type {
  ExecutionPlan,
  ExecutionPlanOptions,
} from './execution-plan';

export {
  discoverBrowserBuildArtifacts,
  getBrowserArtifactPath,
} from './browser-build-artifacts';
export type {
  BrowserBuildArtifacts,
} from './browser-build-artifacts';

export {
  executeNodePlan,
  getEmbeddedNodeExecutionAdapterSource,
} from './node-execution-adapter';
export type {
  NodeExecutionEnvironment,
} from './node-execution-adapter';

export {
  createNodeRunnerModuleSource,
} from './node-runner-module-source';
export type {
  NodeRunnerModuleSourceOptions,
} from './node-runner-module-source';

export {
  discoverNodeBuildArtifacts,
} from './node-build-artifacts';
export type {
  NodeBuildArtifacts,
} from './node-build-artifacts';

export {
  NodeRunnerHost,
} from './node-runner-host';
export type {
  NodeRunnerModule,
} from './node-runner-host';

export {
  RunnerSession,
  getEmbeddedRunnerSessionSource,
} from './runner-session';
export type {
  RunnerSessionAdapter,
  RunnerSessionOptions,
} from './runner-session';

export {
  listCatalogFiles,
  listCatalogSuites,
  listCatalogTests,
  orderCatalogRows,
  getEmbeddedCatalogQuerySource,
} from './catalog-query';
export type {
  FileListRow,
  SuiteListRow,
  TestListRow,
} from './catalog-query';

export {
  createTestCatalogIndex,
  getDescendantSuiteIdsFromIndex,
  getSpecIdsForSuitesFromIndex,
  normalizeSearchText,
  searchIndexEntries,
  getEmbeddedTestCatalogIndexSource,
} from './test-catalog-index';
export type {
  SearchIndexEntry,
  TestCatalogIndex,
} from './test-catalog-index';

export * as v2 from './v2';

export type {
  LegacyGetAllSpecs,
  LegacyGetAllSuites,
  LegacyRunTests,
} from './legacy-api';

export {
  summarizeExecutionResults,
} from './execution-result';
export type {
  ExecutionResult,
  ExecutionSpecResult,
} from './execution-result';

export {
  applyExecutionExitCode,
  getExecutionExitCode,
} from './cli-result-adapter';

export {
  runNodeCli,
} from './node-cli-runner';
````

## File: package.json
````json
{
  "name": "@epikodelabs/testify",
  "version": "2.0.0",
  "description": "Serve and run your Jasmine specs in a browser",
  "bin": {
    "jasmine": "bin/jasmine",
    "testify": "bin/testify"
  },
  "type": "module",
  "files": [
    "LICENSE",
    "README.md",
    "CHANGELOG.md",
    "MIGRATION-V2.md",
    "package.json",
    "assets/",
    "bin/",
    "lib/"
  ],
  "scripts": {
    "clean": "rimraf dist",
    "build:cli": "vite build --config vite.cli.config.ts && node build-package.js && npm run copyfiles",
    "build:lib": "vite build --config vite.lib.config.ts",
    "build:runner": "vite build --config vite.runner.config.ts",
    "build": "npm run clean && npm run build:cli && npm run build:lib && npm run build:runner",
    "start": "node --import tsx ./src/index.ts",
    "copyfiles": "copyfiles README.md CHANGELOG.md MIGRATION-V2.md LICENSE ./dist/testify",
    "test:public-api": "tsc -p tsconfig.public-api.json"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/epikodelabs/testify.git"
  },
  "keywords": [
    "Jasmine",
    "Testing",
    "TDD",
    "Browser",
    "Node",
    "Coverage",
    "HMR"
  ],
  "author": "Oleksii Shepel",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/epikodelabs/testify/issues"
  },
  "homepage": "https://github.com/epikodelabs/testify#readme",
  "dependencies": {
    "chokidar": "^5.0.0",
    "esbuild": "^0.28.1",
    "glob": "^13.0.6",
    "istanbul-api": "^3.0.0",
    "istanbul-lib-coverage": "^3.2.2",
    "istanbul-lib-instrument": "^6.0.3",
    "istanbul-lib-report": "^3.0.1",
    "istanbul-lib-source-maps": "^5.0.6",
    "istanbul-reports": "^3.2.0",
    "jasmine-core": "^6.3.0",
    "picomatch": "^4.0.5",
    "playwright": "^1.62.0",
    "rollup": "^4.62.3",
    "vite": "^8.1.5",
    "ws": "^8.21.1",
    "tsx": "^4.20.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.6",
    "@eslint/js": "^10.0.1",
    "@types/express": "^5.0.6",
    "@types/glob": "^9.0.0",
    "@types/istanbul-lib-instrument": "^1.7.8",
    "@types/istanbul-lib-report": "^3.0.3",
    "@types/istanbul-lib-source-maps": "^4.0.4",
    "@types/istanbul-reports": "^3.0.4",
    "@types/jasmine": "^6.0.0",
    "@types/node": "^26.1.2",
    "@types/picomatch": "^4.0.3",
    "@types/ws": "^8.18.1",
    "copyfiles": "^2.4.1",
    "eslint": "^10.8.0",
    "eslint-plugin-jasmine": "^4.2.2",
    "globals": "^17.8.0",
    "prettier": "^3.9.6",
    "rimraf": "^6.1.3",
    "rollup-plugin-copy": "^3.5.0",
    "typescript": "^7.0.2"
  },
  "peerDependencies": {
    "@types/jasmine": "^6.0.0"
  },
  "prettier": {
    "singleQuote": true,
    "trailingComma": "es5"
  },
  "engines": {
    "node": ">=22.15.0"
  },
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "import": "./lib/index.js",
      "default": "./lib/index.js"
    },
    "./v2": {
      "types": "./lib/v2.d.ts",
      "import": "./lib/v2.js",
      "default": "./lib/v2.js"
    },
    "./package.json": "./package.json"
  },
  "types": "./lib/index.d.ts"
}
````
