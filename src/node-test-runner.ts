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
