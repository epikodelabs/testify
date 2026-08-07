import * as fs from 'fs';
import * as path from 'path';
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { norm } from './utils';
import { fileURLToPath } from 'url';
import { FileDiscoveryService } from './file-discovery-service';
import { getBrowserRuntimeScript } from './browser-runtime';
import { getBrowserJasmineRegistrationPatchScript } from './browser-jasmine-runtime';
import { getBrowserWebSocketReporterScript } from './browser-websocket-runtime';
import { getBrowserHmrClientScript } from './browser-hmr-client';
import { getBrowserBootstrapScript } from './browser-bootstrap-runtime';
import { createBrowserPage } from './browser-page';
import { logger } from './logger';
import { HtmlMessages } from './log-messages';
import { resolveBrowserPreludeModules } from './prelude-modules';

export class HtmlGenerator {
  constructor(private fileDiscovery: FileDiscoveryService, private config: ViteJasmineConfig) { }

  async generateHtmlFile() {
    const htmlDir = this.config.outDir;
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true });
    }

    const builtFiles = fs.readdirSync(htmlDir)
      .filter(f => /\.(?:js|mjs)$/i.test(f))
      .sort();

    if (builtFiles.length === 0) {
      logger.println(HtmlMessages.noJsFilesForHtml());
      return;
    }

    const specFiles = builtFiles.filter(f => /\.spec\.(?:js|mjs)$/i.test(f));
    const imports = this.getStaticModuleImports(specFiles);

    const faviconTag = this.getFaviconTag();
    const htmlContent = this.generateHtmlTemplate(imports, faviconTag);
    const htmlPath = norm(path.join(htmlDir, 'index.html'));
    fs.writeFileSync(htmlPath, htmlContent);
    logger.println(HtmlMessages.generatedTestPage(norm(path.relative(this.config.outDir, htmlPath))));
  }

  async generateHtmlFileWithHmr() {
    const htmlDir = this.config.outDir;
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true });
    }

    const faviconTag = this.getFaviconTag();
    const htmlContent = this.generateHtmlTemplateWithHmr(faviconTag);
    const htmlPath = norm(path.join(htmlDir, 'index.html'));
    fs.writeFileSync(htmlPath, htmlContent);
    logger.println(HtmlMessages.generatedHmrTestPage(norm(path.relative(this.config.outDir, htmlPath))));
  }

  private getFaviconTag(): string {
    const __filename = norm(fileURLToPath(import.meta.url));
    const __dirname = norm(path.dirname(__filename));
    const faviconPath = path.resolve(__dirname, '../assets/favicon.ico');
    
    if (fs.existsSync(faviconPath)) {
      const faviconData = fs.readFileSync(faviconPath);
      const faviconBase64 = faviconData.toString('base64');
      return `<link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,${faviconBase64}">`;
    } else {
      logger.println(HtmlMessages.faviconNotFound(faviconPath));
      return `<link rel="icon" href="favicon.ico" type="image/x-icon" />`;
    }
  }

  private generateHtmlTemplate(imports: string, faviconTag: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${faviconTag}
  <title>${this.config.htmlOptions?.title || 'Jasmine Test Runner'}</title>
  <link rel="stylesheet" href="/node_modules/jasmine-core/lib/jasmine-core/jasmine.css">
  <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine.js"></script>
  <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js"></script>
  <script src="/node_modules/jasmine-core/lib/jasmine-core/boot0.js"></script>
  <script src="/node_modules/jasmine-core/lib/jasmine-core/boot1.js"></script>
  <script type="module">
    ${this.getWebSocketEventForwarderScript()}
    
    const forwarder = new WebSocketEventForwarder();
    forwarder.connect();
    jasmine.getEnv().addReporter(forwarder);
    
    ${imports}
  </script>
</head>
<body>
  <div class="jasmine_html-reporter"></div>
</body>
</html>`;
  }

  private getPreludeModules(): string[] {
    return resolveBrowserPreludeModules(this.config);
  }

  private getStaticModuleImports(specFiles: string[]): string {
    const imports = [
      ...this.getPreludeModules().map(specifier => `import ${JSON.stringify(specifier)};`),
      ...specFiles.map(file => `import ${JSON.stringify(`./${file}`)};`)
    ];

    return imports.join('\n    ');
  }

  private generateHtmlTemplateWithHmr(
    faviconTag: string,
  ): string {
    return createBrowserPage({
      title:
        this.config.htmlOptions?.title ||
        'Jasmine Test Runner (HMR)',
      faviconTag,
      scripts: {
        jasminePatch:
          this.getJasminePatchScript(),
        websocketReporter:
          this.getWebSocketEventForwarderScript(),
        hmrClient:
          this.getHmrClientScript(),
        bootstrap:
          getBrowserBootstrapScript({
            preludeModules:
              this.getPreludeModules(),
          }),
        runtime:
          this.getRuntimeHelpersScript(),
      },
    });
  }

  private getJasminePatchScript(): string {
    return getBrowserJasmineRegistrationPatchScript();
  }

  private getWebSocketEventForwarderScript(): string {
    return getBrowserWebSocketReporterScript();
  }

  private getHmrClientScript(): string {
    return getBrowserHmrClientScript();
  }

  private getRuntimeHelpersScript(): string {
    return getBrowserRuntimeScript({
      stopOnSpecFailure:
        this.config.jasmineConfig?.env?.stopSpecOnExpectationFailure ?? false,
      initialSeed:
        (this.config.jasmineConfig?.env as any)?.seed ?? 0,
      initialRandom:
        this.config.jasmineConfig?.env?.random ?? false,
    });
  }

}
