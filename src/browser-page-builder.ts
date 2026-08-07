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

export class BrowserPageBuilder {
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
      headScripts: [
        '<script src="/node_modules/jasmine-core/lib/jasmine-core/boot0.js"></script>',
        '<script src="/node_modules/jasmine-core/lib/jasmine-core/boot1.js"></script>',
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
