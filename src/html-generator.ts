import * as fs from 'fs';
import * as path from 'path';
import type { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import type { FileDiscoveryService } from './file-discovery-service';
import { logger } from './logger';
import { HtmlMessages } from './log-messages';
import { BrowserPageBuilder } from './browser-page-builder';

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

    const builtFiles =
      fs.readdirSync(htmlDir)
        .filter(
          (file) =>
            /\.(?:js|mjs)$/i.test(file),
        )
        .sort();

    if (builtFiles.length === 0) {
      logger.println(
        HtmlMessages.noJsFilesForHtml(),
      );
      return;
    }

    const specFiles =
      builtFiles.filter(
        (file) =>
          /\.spec\.(?:js|mjs)$/i.test(file),
      );

    const htmlContent =
      this.pageBuilder.buildStatic(
        specFiles,
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
