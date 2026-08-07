// test-runner.ts
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { ViteJasmineConfig } from './vite-jasmine-config';
import { norm } from './utils';
import { ConsoleReporter } from './console-reporter';
import { CoverageReportGenerator } from './coverage-report-generator';
import { logger } from './logger';
import { resolveNodePreludeModules } from './prelude-modules';
import {
  createNodeRunnerModuleSource,
} from './node-runner-module-source';
import {
  discoverNodeBuildArtifacts,
} from './node-build-artifacts';

export interface TestRunnerOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  reporter?: jasmine.CustomReporter;
  file?: string; // test runner entry file (generated)
  coverage?: boolean;
  suppressConsoleLogs?: boolean;
  selector?: import('./test-selection').TestSelector;
}

export class NodeTestRunner {
  private reporter: jasmine.CustomReporter;
  private options: TestRunnerOptions;
  private isRunning = false;
  private runnerModule: any = null;
  private config: ViteJasmineConfig;

  constructor(config: ViteJasmineConfig, options: TestRunnerOptions = {}) {
    this.config = config;
    this.options = options;
    this.reporter = options.reporter ?? new ConsoleReporter();
  }

  private resolveJasmineCoreUrl(): string {
    const require = createRequire(import.meta.url);
    const jasmineCorePath = require.resolve('jasmine-core/lib/jasmine-core/jasmine.js');
    return pathToFileURL(jasmineCorePath).href;
  }

  /**
   * Generate in-process test runner entry file that:
   * - Bootstraps Jasmine
   * - Imports compiled spec bundles
   * - Exposes a stable API: runTests, getOrderedSpecs/Suites, getTestCounts
   */
  generateTestRunner(): void {
    const outDir = this.config.outDir;
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const artifacts =
      discoverNodeBuildArtifacts(
        outDir,
      );

    if (artifacts.specFiles.length === 0) {
      logger.println(
        NodeRunnerMessages.noJsFilesForRunner(),
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

    const runnerContent =
      this.generateRunnerTemplate(
        imports,
      );

    fs.writeFileSync(
      artifacts.runnerFile,
      runnerContent,
    );

    logger.println(
      NodeRunnerMessages.generatedInProcessRunner(
        norm(
          path.relative(
            outDir,
            artifacts.runnerFile,
          ),
        ),
      ),
    );
  }

  /**
   * Template for the generated ESM runner file.
   * NOTE: This is emitted as JS, so keep syntax JS-friendly.
   */
  private generateRunnerTemplate(imports: string): string {
    const jasmineCoreUrl = this.resolveJasmineCoreUrl();
    const jasmineRuntimeSource = getEmbeddedNodeJasmineRuntimeSource();
    const executionPlanSource = getEmbeddedExecutionPlanSo  private generateRunnerTemplate(
    imports: string,
  ): string {
    return createNodeRunnerModuleSource({
      jasmineCoreUrl:
        this.resolveJasmineCoreUrl(),
      imports,
      config: this.config,
    });
  }
