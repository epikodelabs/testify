import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { ViteJasmineConfig } from './vite-jasmine-config';
import { resolveBrowserPreludeModules } from './prelude-modules';
import { createBrowserPage } from './browser-page';
import { getBrowserRuntimeScript } from './browser-runtime';
import { getBrowserJasmineRegistrationPatchScript } from './browser-jasmine-runtime';
import { getBrowserWebSocketReporterScript } from './browser-websocket-runtime';
import { getBrowserHmrClientScript } from './browser-hmr-client';
import { getBrowserBootstrapScript } from './browser-bootstrap-runtime';
import { getJasmineBrowserAssets } from './jasmine-browser-assets';

function resolveEmbeddedFaviconHref():
  string | null {
  const __filename =
    fileURLToPath(import.meta.url);
  const __dirname =
    path.dirname(__filename);
  const candidatePaths = [
    path.resolve(
      process.cwd(),
      'assets/favicon.ico',
    ),
    path.resolve(
      __dirname,
      '../assets/favicon.ico',
    ),
  ];

  for (const candidatePath of candidatePaths) {
    if (!fs.existsSync(candidatePath)) {
      continue;
    }

    const base64 =
      fs.readFileSync(
        candidatePath,
      ).toString('base64');

    return (
      'data:image/x-icon;base64,' +
      base64
    );
  }

  return null;
}

export class BrowserPageBuilder {
  private readonly faviconHref =
    resolveEmbeddedFaviconHref();
  private readonly jasmineAssets =
    getJasmineBrowserAssets();

  constructor(
    private readonly config: ViteJasmineConfig,
  ) {}

  buildStatic(specFiles: string[]): string {
    const moduleImports = [
      ...this.getPreludeModules(),
      ...specFiles.map(
        (file) => './' + file,
      ),
    ]
      .map(
        (modulePath) =>
          `import ${JSON.stringify(modulePath)};`,
      )
      .join('\n');

    const websocketReporter =
      getBrowserWebSocketReporterScript({
        initialSeed:
          (this.config.jasmineConfig?.env as any)
            ?.seed ?? 0,
        initialRandom:
          this.config.jasmineConfig?.env
            ?.random ?? false,
      });

    return createBrowserPage({
      title:
        this.config.htmlOptions?.title ||
        'Jasmine Test Runner',
      faviconTag:
        this.getFaviconTag(),
      headStyles: [
        `<link rel="stylesheet" href="${this.jasmineAssets.cssUrl}">`,
      ],
      headScripts: [
        `<script src="${this.jasmineAssets.jasmineScriptUrl}"></script>`,
        `<script src="${this.jasmineAssets.jasmineHtmlScriptUrl}"></script>`,
        ...this.jasmineAssets.bootScriptUrls.map(
          (url) =>
            `<script src="${url}"></script>`,
        ),
        `<script type="module">
${websocketReporter}

const forwarder =
  new WebSocketEventForwarder();

forwarder.connect();

jasmine
  .getEnv()
  .addReporter(
    forwarder,
  );

${moduleImports}

${this.getStaticSuiteFilterScript()}
</script>`,
      ],
    });
  }

  buildHmr(): string {
    return createBrowserPage({
      title:
        this.config.htmlOptions?.title ||
        'Jasmine Test Runner (HMR)',
      faviconTag: this.getFaviconTag(),
      headStyles: [
        `<link rel="stylesheet" href="${this.jasmineAssets.cssUrl}">`,
      ],
      headScripts: [
        `<script src="${this.jasmineAssets.jasmineScriptUrl}"></script>`,
        `<script src="${this.jasmineAssets.jasmineHtmlScriptUrl}"></script>`,
      ],
      inlineScripts: [
        getBrowserJasmineRegistrationPatchScript(),
        getBrowserWebSocketReporterScript({
          initialSeed:
            (this.config.jasmineConfig?.env as any)
              ?.seed ?? 0,
          initialRandom:
            this.config.jasmineConfig?.env
              ?.random ?? false,
        }),
        getBrowserHmrClientScript(),
        getBrowserBootstrapScript({
          preludeModules:
            this.getPreludeModules(),
          jasmineBootScriptUrl:
            this.jasmineAssets
              .primaryBootScriptUrl,
        }),
        this.getRuntimeScript(),
      ],
    });
  }


  private getStaticSuiteFilterScript(): string {
    const selector =
      typeof this.config.selector === 'object' &&
      !(this.config.selector instanceof RegExp)
        ? this.config.selector.suite
        : undefined;

    if (!selector) return '';

    const matcher =
      selector instanceof RegExp
        ? `const suiteMatcher = new RegExp(${JSON.stringify(selector.source)}, ${JSON.stringify(selector.flags)});
const matchesSuite = (...values) => values.some((value) => {
  if (!value) return false;
  suiteMatcher.lastIndex = 0;
  return suiteMatcher.test(value);
});`
        : `const suiteSelector = ${JSON.stringify(selector)};
const matchesSuite = (...values) => values.some((value) =>
  value === suiteSelector || value?.includes(suiteSelector)
);`;

    return `${matcher}
const selectedSpecIds = new Set();
const collectSpecs = (suite) => {
  for (const child of suite?.children ?? []) {
    if (Array.isArray(child?.children)) {
      collectSpecs(child);
    } else if (typeof child?.id === 'string') {
      selectedSpecIds.add(child.id);
    }
  }
};
const visitSuites = (suite, isRoot = false) => {
  if (!isRoot && matchesSuite(
    suite?.description,
    typeof suite?.getFullName === 'function' ? suite.getFullName() : undefined,
  )) {
    collectSpecs(suite);
    return;
  }

  for (const child of suite?.children ?? []) {
    if (Array.isArray(child?.children)) {
      visitSuites(child, false);
    }
  }
};
visitSuites(jasmine.getEnv().topSuite(), true);
jasmine.getEnv().configure({
  specFilter: (spec) => selectedSpecIds.has(spec.id),
});`;
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
    if (!this.faviconHref) {
      return '';
    }

    return (
      '<link rel="icon" href="' +
      this.faviconHref +
      '" ' +
      'type="image/x-icon" />'
    );
  }
}
