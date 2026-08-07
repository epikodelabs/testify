import * as fs from 'fs';
import * as path from 'path';
import {
  createRequire,
} from 'module';
import {
  pathToFileURL,
} from 'url';
import type {
  ViteJasmineConfig,
} from './vite-jasmine-config';
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
import {
  NodeRunnerMessages,
} from './log-messages';
import { logger } from './logger';
import { norm } from './utils';

export class NodeArtifactHost {
  private runnerHost:
    NodeRunnerHost | null = null;

  constructor(
    private readonly config:
      ViteJasmineConfig,
  ) {}

  generate(): NodeRunnerHost | null {
    const outDir =
      this.config.outDir;

    fs.mkdirSync(
      outDir,
      { recursive: true },
    );

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

      return null;
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

    const host =
      new NodeRunnerHost(
        artifacts.runnerFile,
      );

    host.write(source);

    this.runnerHost = host;

    logger.println(
      NodeRunnerMessages
        .generatedInProcessRunner(
          norm(
            path.relative(
              outDir,
              host.file,
            ),
          ),
        ),
    );

    return host;
  }

  resolveRunner(
    cwd?: string,
    file?: string,
  ): NodeRunnerHost {
    const runnerFile =
      path.resolve(
        cwd ?? process.cwd(),
        file ??
          discoverNodeBuildArtifacts(
            this.config.outDir,
          ).runnerFile,
      );

    if (
      this.runnerHost?.file ===
      norm(runnerFile)
    ) {
      return this.runnerHost;
    }

    this.runnerHost =
      new NodeRunnerHost(
        runnerFile,
      );

    return this.runnerHost;
  }

  clear(): void {
    this.runnerHost?.clear();
  }

  private resolveJasmineCoreUrl():
    string {
    const require =
      createRequire(
        import.meta.url,
      );

    return pathToFileURL(
      require.resolve(
        'jasmine-core/lib/jasmine-core/jasmine.js',
      ),
    ).href;
  }
}
