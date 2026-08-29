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
    release-verify.yml
  CONTRIBUTING.md
  FUNDING.yml
assets/
  favicon.ico
docs/
  architecture-vocabulary.md
  playground-api.md
  session-contract.md
  vocabulary-audit.md
scripts/
  verify-publish.mjs
src/
  ansi-constants.ts
  ascii-sanitizer.spec.ts
  ascii-sanitizer.ts
  browser-bootstrap-runtime.spec.ts
  browser-bootstrap-runtime.ts
  browser-build-artifacts.spec.ts
  browser-build-artifacts.ts
  browser-hmr-client.spec.ts
  browser-hmr-client.ts
  browser-hmr-path.spec.ts
  browser-hmr-test-add.spec.ts
  browser-hmr-test-remove.spec.ts
  browser-jasmine-runtime.ts
  browser-manager-startup.spec.ts
  browser-manager.ts
  browser-page-builder-static.spec.ts
  browser-page-builder.spec.ts
  browser-page-builder.ts
  browser-page.ts
  browser-playground-formatters.spec.ts
  browser-playground-formatters.ts
  browser-playground-runtime.spec.ts
  browser-playground-runtime.ts
  browser-runtime-console-ux.spec.ts
  browser-runtime.spec.ts
  browser-runtime.ts
  browser-static-bootstrap.spec.ts
  browser-static-bootstrap.ts
  browser-static-page.spec.ts
  browser-test-catalog.ts
  browser-websocket-runtime.spec.ts
  browser-websocket-runtime.ts
  catalog-query-builder.ts
  catalog-query.spec.ts
  catalog-query.ts
  catalog-state-change-retention.spec.ts
  catalog-state.spec.ts
  catalog-state.ts
  cli-default-run.spec.ts
  cli-entry.ts
  cli-flags.spec.ts
  cli-handler.ts
  cli-result-adapter.spec.ts
  cli-result-adapter.ts
  cli-watch-contract.spec.ts
  compound-reporter.ts
  config-manager.ts
  console-reporter-abort.spec.ts
  console-reporter-output.spec.ts
  console-reporter.ts
  coverage-host.spec.ts
  coverage-host.ts
  coverage-report-generator.ts
  embedded-source.spec.ts
  embedded-source.ts
  execution-plan-shard.spec.ts
  execution-plan.spec.ts
  execution-plan.ts
  execution-result.spec.ts
  execution-result.ts
  exit-codes.ts
  file-discovery-service.spec.ts
  file-discovery-service.ts
  generated-module-extension.spec.ts
  hmr-file-classification.spec.ts
  hmr-manager.ts
  hmr-test-add.spec.ts
  hmr-test-remove.spec.ts
  host-adapter.ts
  html-generator.ts
  http-server-manager.ts
  index.ts
  internals.ts
  istanbul-instrumenter.ts
  jasmine-console-reporter.ts
  jasmine-node-runtime.spec.ts
  jasmine-node-runtime.ts
  json-cleaner.ts
  lib.ts
  log-messages.cli-block.ts
  log-messages.ts
  logger-prompt.spec.ts
  logger.ts
  messages.ts
  node-artifact-host-mjs.spec.ts
  node-artifact-host.ts
  node-build-artifacts.spec.ts
  node-build-artifacts.ts
  node-cli-runner.spec.ts
  node-cli-runner.ts
  node-execution-adapter.spec.ts
  node-execution-adapter.ts
  node-execution-environment-host.spec.ts
  node-execution-environment-host.ts
  node-execution-host.ts
  node-execution-result.spec.ts
  node-generated-esm.spec.ts
  node-process-host.spec.ts
  node-process-host.ts
  node-relative-resolver.spec.ts
  node-relative-resolver.ts
  node-runner-host-types.spec.ts
  node-runner-host.spec.ts
  node-runner-host.ts
  node-runner-module-source.spec.ts
  node-runner-module-source.ts
  node-runtime-host.ts
  node-test-runner-environment.spec.ts
  node-test-runner-facade.spec.ts
  node-test-runner-plan.spec.ts
  node-test-runner.ts
  package-resolver.ts
  package-surface.spec.ts
  planning-engine.spec.ts
  planning-engine.ts
  prelude-modules.ts
  process-lock.spec.ts
  process-lock.ts
  project-setup.spec.ts
  project-setup.ts
  public-api.ts
  runner-session-hmr-lifecycle.spec.ts
  runner-session.spec.ts
  runner-session.ts
  symbols.ts
  test-catalog-index.spec.ts
  test-catalog-index.ts
  test-catalog.spec.ts
  test-catalog.ts
  test-metadata-path.spec.ts
  test-metadata-runtime-path.spec.ts
  test-metadata-runtime.ts
  test-metadata.spec.ts
  test-metadata.ts
  test-search-index.spec.ts
  test-selection.spec.ts
  test-selection.ts
  ts-jasmine-cli.ts
  utils.ts
  vite-config-builder-node-external.spec.ts
  vite-config-builder-node-mode.spec.ts
  vite-config-builder-node-resolution.spec.ts
  vite-config-builder-rolldown.spec.ts
  vite-config-builder.ts
  vite-jasmine-config.ts
  vite-jasmine-runner-browser-startup.spec.ts
  vite-jasmine-runner-coverage.spec.ts
  vite-jasmine-runner-mjs.spec.ts
  vite-jasmine-runner-no-tests.spec.ts
  vite-jasmine-runner-result.spec.ts
  vite-jasmine-runner.ts
  websocket-manager.spec.ts
  websocket-manager.ts
  websocket-session-exit.spec.ts
types/
  istanbul-api.d.ts
.gitignore
build-package.js
CHANGELOG.md
LICENSE
package.json
README.md
testify.json
tsconfig.json
vite.cli.config.ts
vite.lib.config.ts
vite.runner.config.ts
````

# Files

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

## File: .github/workflows/release-verify.yml
````yaml
name: Release verification

on:
  workflow_dispatch:
  pull_request:
    paths:
      - 'src/**'
      - 'scripts/verify-publish.mjs'
      - 'package.json'
      - 'build-package.js'
      - 'vite.*.config.ts'
      - 'tsconfig*.json'

jobs:
  verify:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: https://registry.npmjs.org

      - run: npm install

      - run: npm run verify:release
````

## File: src/ascii-sanitizer.spec.ts
````typescript
import { toAscii, toConsoleSafe } from './ascii-sanitizer';
import { supportsEmoji } from './ansi-constants';

describe('ascii-sanitizer', () => {
  describe('toAscii', () => {
    it('translates Rolldown/Oxc frame glyphs to plain ASCII', () => {
      const frame =
        '   ╭─[ path.ts:1:10 ]\n' +
        '   │\n' +
        ' 1 │ import { Component } from "@angular/core";\n' +
        '   │          ────┬────\n' +
        '   │              ╰────── `Component` has already been declared here\n' +
        '───╯\n';

      expect(toAscii(frame)).toBe(
        '   +-[ path.ts:1:10 ]\n' +
        '   |\n' +
        ' 1 | import { Component } from "@angular/core";\n' +
        '   |          ----+----\n' +
        '   |              +------ `Component` has already been declared here\n' +
        '---+\n'
      );
    });

    it('leaves existing ASCII text untouched', () => {
      const text =
        'Build failed with 2 errors: ' +
        '[PARSE_ERROR] Identifier `Component` has already been declared';

      expect(toAscii(text)).toBe(text);
    });

    it('translates esbuild-style note separators, arrows, and ellipsis', () => {
      expect(toAscii('· → …')).toBe('. -> ...');
    });
  });

  describe('toConsoleSafe', () => {
    it('matches the SYMBOLS mode: keeps Unicode on TTY, ASCII elsewhere', () => {
      const frame = '   ╭─[ path.ts:1:10 ]';
      const expected = supportsEmoji() ? frame : '   +-[ path.ts:1:10 ]';

      expect(toConsoleSafe(frame)).toBe(expected);
    });
  });
});
````

## File: src/ascii-sanitizer.ts
````typescript
// ─── ASCII fallback for embedded tool diagnostics ─────────────────────────
// Bundlers/parsers (Rolldown, Oxc, esbuild) render their error frames with
// Unicode box-drawing characters:
//
//   ╭─[ path.ts:1:10 ]
//   │          ────┬────
//   │              ╰────── Identifier `X` has already been declared
// ───╯
//
// On consoles whose output code page is a legacy single-byte encoding (e.g.
// the Cyrillic OEM code page CP866 found on Russian/Ukrainian Windows),
// those UTF-8 glyphs are decoded byte-by-byte and come out as mojibake
// (тФВ тХнтФА ...). To keep diagnostics readable everywhere, translate the
// frame glyphs to plain ASCII whenever testify is not rendering to a
// Unicode-capable TTY. This mirrors how `SYMBOLS` already falls back to
// `ANSI_SYMBOLS` in the same situations: piped (non-TTY) output, `--ansi`
// mode, or `NO_EMOJI`.
import { supportsEmoji } from './ansi-constants';

const ASCII_TRANSLATIONS: ReadonlyArray<readonly [RegExp, string]> = [
  // Vertical box-drawing → pipe
  [/[│┃║]/g, '|'],
  // Single horizontal box-drawing → dash
  [/[─┄┈]/g, '-'],
  // Double horizontal → equals
  [/═/g, '='],
  // Corners, junctions, and round caps → plus
  [/[┌┐└┘├┤┼┬┴╭╮╰╯╔╗╚╝╠╣╦╩╬╪]/g, '+'],
  // Arrows used by diagnostics/notes
  [/[→↳⇒↦]/g, '->'],
  // Note separator used by esbuild-style frames
  [/·/g, '.'],
  // Ellipsis
  [/…/g, '...'],
];

/**
 * Translates Unicode box-drawing glyphs (and a few other common fancy
 * characters) in a message to plain ASCII equivalents. Purely functional;
 * callers decide when it applies.
 */
export function toAscii(message: string): string {
  let result = message;
  for (const [pattern, replacement] of ASCII_TRANSLATIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Returns the message unchanged when the environment renders Unicode
 * (TTY in normal mode), otherwise falls back to the ASCII translation.
 */
export function toConsoleSafe(message: string): string {
  if (supportsEmoji()) return message;
  return toAscii(message);
}
````

## File: src/browser-bootstrap-runtime.spec.ts
````typescript
import {
  getBrowserBootstrapScript,
} from './browser-bootstrap-runtime';

describe('Browser bootstrap runtime', () => {
  it('exposes the host connection for the Playground session', () => {
    const source =
      getBrowserBootstrapScript({
        preludeModules: [],
      });

    expect(source).toContain(
      'window.__testifyHost = forwarder;',
    );
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

## File: src/browser-hmr-client.spec.ts
````typescript
import {
  getBrowserHmrClientScript,
} from './browser-hmr-client';

describe('browser HMR registration boundary', () => {
  const source =
    getBrowserHmrClientScript();

  it('imports an updated spec exactly once per HMR application path', () => {
    const importMatches =
      source.match(
        /import\s*\(/g,
      ) ?? [];

    expect(
      importMatches.length,
    ).toBe(1);
  });

  it('detaches old registrations before importing the replacement spec', () => {
    const detachIndex =
      source.indexOf(
        'detachFilePathSuites(filePath);',
      );

    const importIndex =
      source.indexOf(
        'import(',
      );

    expect(detachIndex)
      .toBeGreaterThan(-1);

    expect(importIndex)
      .toBeGreaterThan(detachIndex);
  });

  it('stores the single imported module in the HMR registry', () => {
    expect(source).toContain(
      'moduleRegistry.set(',
    );

    expect(source).not.toContain(
      'let newModule = null',
    );

    expect(source).not.toContain(
      'hotUpdateSpec(update.path, newModule)',
    );
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
````

## File: src/browser-hmr-path.spec.ts
````typescript
import {
  getBrowserHmrClientScript,
} from './browser-hmr-client';

describe('browser HMR path identity', () => {
  const source =
    getBrowserHmrClientScript();

  it('normalizes update and catalog file paths before comparing them', () => {
    expect(source).toContain(
      'normalizeHmrPath(filePath)',
    );

    expect(source).toContain(
      "spec.file ?? ''",
    );

    expect(source).toContain(
      "suite.file ?? ''",
    );

    expect(source).not.toContain(
      'spec.file === filePath',
    );

    expect(source).not.toContain(
      'suite.file === filePath',
    );
  });

  it('normalizes the module registry key and import path', () => {
    expect(source).toContain(
      'const normalizedFilePath =',
    );

    expect(source).toContain(
      'moduleRegistry.set(',
    );

    expect(source).toContain(
      "'/' +",
    );
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
````

## File: src/browser-hmr-test-add.spec.ts
````typescript
import {
  getBrowserHmrClientScript,
} from './browser-hmr-client';

describe('browser HMR new spec contract', () => {
  const source =
    getBrowserHmrClientScript();

  it('uses the normal hot-update transaction for a newly built spec', () => {
    expect(source).toContain(
      'await hotUpdateSpec(',
    );

    expect(source).toContain(
      'detachFilePathSuites(filePath);',
    );

    expect(source).toContain(
      'withTestifyRegistrationScope(',
    );
  });

  it('imports the new spec exactly once', () => {
    const importMatches =
      source.match(
        /import\s*\(/g,
      ) ?? [];

    expect(
      importMatches.length,
    ).toBe(1);
  });

  it('does not require a dedicated test-add browser branch', () => {
    expect(source).not.toContain(
      "update.type === 'test-add'",
    );
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
````

## File: src/browser-hmr-test-remove.spec.ts
````typescript
import {
  getBrowserHmrClientScript,
} from './browser-hmr-client';

describe('browser HMR removed spec contract', () => {
  const source =
    getBrowserHmrClientScript();

  it('detaches a removed spec without re-importing it', () => {
    expect(source).toContain(
      "update.type === 'test-remove'",
    );

    expect(source).toContain(
      'detachFilePathSuites(',
    );

    expect(source).toContain(
      'moduleRegistry.delete(',
    );
  });

  it('keeps one import path for normal hot updates', () => {
    const importMatches =
      source.match(
        /import\s*\(/g,
      ) ?? [];

    expect(
      importMatches.length,
    ).toBe(1);
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
````

## File: src/browser-manager-startup.spec.ts
````typescript
import {
  BrowserManager,
} from './browser-manager';
import type {
  ViteJasmineConfig,
} from './vite-jasmine-config';

describe('BrowserManager headed startup', () => {
  function createManager(): BrowserManager {
    return new BrowserManager({
      browser: 'chrome',
      headless: false,
    } as ViteJasmineConfig);
  }

  it('propagates browser launch failures', async () => {
    const manager = createManager();
    const failure = new Error(
      'browser launch failed',
    );

    (manager as any).getPlaywright =
      async () => ({
        chromium: {
          async launch() {
            throw failure;
          },
        },
      });

    await expectAsync(
      manager.openBrowser(8888),
    ).toBeRejectedWith(failure);

    expect(
      (manager as any).currentBrowser,
    ).toBeNull();
    expect(
      (manager as any).currentPage,
    ).toBeNull();
  });

  it('closes and clears a browser when navigation fails', async () => {
    const manager = createManager();
    const failure = new Error(
      'navigation failed',
    );
    let closes = 0;

    const browser = {
      isConnected: () => true,
      async close() {
        closes++;
      },
      async newPage() {
        return {
          async goto() {
            throw failure;
          },
          on() {},
        };
      },
    };

    (manager as any).getPlaywright =
      async () => ({
        chromium: {
          async launch() {
            return browser;
          },
        },
      });

    await expectAsync(
      manager.openBrowser(8888),
    ).toBeRejectedWith(failure);

    expect(closes).toBe(1);
    expect(
      (manager as any).currentBrowser,
    ).toBeNull();
    expect(
      (manager as any).currentPage,
    ).toBeNull();
  });
});
````

## File: src/browser-static-bootstrap.spec.ts
````typescript
import {
  getStaticBrowserBootstrapScript,
} from './browser-static-bootstrap';

describe('static browser bootstrap', () => {
  it('loads Jasmine boot1 before importing specs', () => {
    const source =
      getStaticBrowserBootstrapScript({
        preludeModules: [],
        specFiles: [
          'fixture.spec.js',
        ],
      });

    const boot0Index =
      source.indexOf(
        'boot0.js',
      );

    const boot1Index =
      source.indexOf(
        'boot1.js',
      );

    const specIndex =
      source.indexOf(
        'fixture.spec.js',
      );

    expect(boot0Index)
      .toBeGreaterThan(-1);

    expect(boot1Index)
      .toBeGreaterThan(
        boot0Index,
      );

    expect(specIndex)
      .toBeGreaterThan(
        boot1Index,
      );
  });

  it('keeps the Jasmine HTML reporter boot sequence', () => {
    const source =
      getStaticBrowserBootstrapScript({
        preludeModules: [],
        specFiles: [],
      });

    expect(source).toContain(
      '/jasmine-core/boot0.js',
    );

    expect(source).toContain(
      '/jasmine-core/boot1.js',
    );
  });
});
````

## File: src/browser-static-page.spec.ts
````typescript
import {
  BrowserPageBuilder,
} from './browser-page-builder';

describe('static browser page compatibility', () => {
  it('preserves the v1 parser-time boot sequence', () => {
    const builder =
      new BrowserPageBuilder({
        outDir: './dist',
        htmlOptions: {
          title: 'Jasmine Test Runner',
          preludeModules: [],
        },
        jasmineConfig: {
          env: {
            random: false,
            seed: 0,
            stopSpecOnExpectationFailure:
              false,
          },
        },
      } as any);

    const html =
      builder.buildStatic([
        'fixture.spec.mjs',
      ]);

    const boot0 =
      html.indexOf(
        'boot0.js',
      );

    const boot1 =
      html.indexOf(
        'boot1.js',
      );

    const moduleScript =
      html.indexOf(
        '<script type="module">',
      );

    const specImport =
      html.indexOf(
        'import "./fixture.spec.mjs";',
      );

    expect(boot0)
      .toBeGreaterThan(-1);

    expect(boot1)
      .toBeGreaterThan(
        boot0,
      );

    expect(moduleScript)
      .toBeGreaterThan(
        boot1,
      );

    expect(specImport)
      .toBeGreaterThan(
        moduleScript,
      );

    expect(html)
      .not.toContain(
        "document.createElement('script')",
      );
  });
});
````

## File: src/catalog-query-builder.ts
````typescript
import type {
  TestCatalog,
} from './test-catalog';
import {
  findCatalogSpecs,
  findCatalogSuites,
  getSpecIdsForFiles,
  type TestSelector,
} from './test-selection';
import {
  listCatalogFiles,
  listCatalogSuites,
  listCatalogTests,
  type FileListRow,
  type SuiteListRow,
  type TestListRow,
} from './catalog-query';

export class CatalogQuery {
  constructor(
    private readonly catalog:
      TestCatalog,
  ) {}

  tests(
    selector?: string | RegExp,
  ): TestListRow[] {
    if (!selector) {
      return listCatalogTests(
        this.catalog,
      );
    }

    const ids =
      new Set(
        findCatalogSpecs(
          this.catalog,
          selector,
        ).map(
          (spec) => spec.id,
        ),
      );

    return listCatalogTests(
      this.catalog,
    ).filter(
      (row) =>
        ids.has(row.id),
    );
  }

  suites(
    selector?: string | RegExp,
  ): SuiteListRow[] {
    if (!selector) {
      return listCatalogSuites(
        this.catalog,
      );
    }

    const ids =
      new Set(
        findCatalogSuites(
          this.catalog,
          selector,
        ).map(
          (suite) => suite.id,
        ),
      );

    return listCatalogSuites(
      this.catalog,
    ).filter(
      (row) =>
        ids.has(row.id),
    );
  }

  files(
    selector?: string | RegExp,
  ): FileListRow[] {
    const rows =
      listCatalogFiles(
        this.catalog,
      );

    if (!selector) {
      return rows;
    }

    const ids =
      new Set(
        getSpecIdsForFiles(
          this.catalog,
          selector,
        ),
      );

    return rows.filter(
      (row) =>
        this.catalog.specs.some(
          (spec) =>
            spec.file === row.file &&
            ids.has(spec.id),
        ),
    );
  }

  selector(
    selector: TestSelector,
  ): TestSelector {
    return selector;
  }
}
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

## File: src/catalog-state-change-retention.spec.ts
````typescript
import {
  CatalogState,
} from './catalog-state';
import type {
  TestCatalog,
} from './test-catalog';

describe('CatalogState change retention', () => {
  const initial: TestCatalog = {
    rootSuiteId: 'root',
    suites: [
      {
        id: 'suite1',
        description: 'Example',
        fullName: 'Example',
        file: 'example.spec.mjs',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'one',
        fullName: 'Example one',
        suiteId: 'suite1',
        file: 'example.spec.mjs',
      },
    ],
  };

  it('does not erase the last structural change on an equivalent sync', () => {
    const state =
      new CatalogState(
        initial,
      );

    const updated: TestCatalog = {
      ...initial,
      specs: [
        {
          ...initial.specs[0],
          id: 'spec9',
        },
      ],
    };

    const change =
      state.update(
        updated,
      );

    expect(change.changed)
      .toBeTrue();

    expect(change.removedSpecIds)
      .toEqual([
        'spec1',
      ]);

    expect(change.addedSpecIds)
      .toEqual([
        'spec9',
      ]);

    const noChange =
      state.update({
        ...updated,
        suites:
          updated.suites.map(
            (suite) => ({
              ...suite,
            }),
          ),
        specs:
          updated.specs.map(
            (spec) => ({
              ...spec,
            }),
          ),
      });

    expect(noChange.changed)
      .toBeFalse();

    expect(state.version)
      .toBe(2);

    expect(state.changes.removedSpecIds)
      .toEqual([
        'spec1',
      ]);

    expect(state.changes.addedSpecIds)
      .toEqual([
        'spec9',
      ]);
  });
});
````

## File: src/cli-default-run.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('testify CLI default behavior', () => {
  it('runs CLIHandler when bin/testify is invoked without a command', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/index.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'CLIHandler.run()',
    );

    expect(source).not.toContain(
      "args.length === 0",
    );
  });
});
````

## File: src/coverage-host.spec.ts
````typescript
import {
  CoverageHost,
} from './coverage-host';

describe('CoverageHost', () => {
  it('is a no-op when coverage is disabled', async () => {
    const host =
      new CoverageHost(false);

    await expectAsync(
      host.generate(undefined),
    ).toBeResolved();
  });
});
````

## File: src/coverage-host.ts
````typescript
import {
  CoverageReportGenerator,
} from './coverage-report-generator';

export class CoverageHost {
  constructor(
    private readonly enabled = false,
  ) {}

  async generate(
    coverage:
      | Record<string, unknown>
      | undefined,
  ): Promise<void> {
    if (
      !this.enabled ||
      !coverage
    ) {
      return;
    }

    const generator =
      new CoverageReportGenerator();

    await generator.generate(
      coverage,
    );
  }

  async generateGlobal():
    Promise<void> {
    await this.generate(
      (globalThis as any)
        .__coverage__,
    );
  }
}
````

## File: src/execution-plan-shard.spec.ts
````typescript
import {
  partitionExecutionPlan,
  shardExecutionPlan,
  type ExecutionPlan,
} from './execution-plan';

describe('ExecutionPlan sharding', () => {
  const plan: ExecutionPlan = {
    specIds: [
      'a',
      'b',
      'c',
      'd',
      'e',
    ],
    random: false,
    source: {
      kind: 'all',
    },
  };

  it('creates deterministic modulo shards', () => {
    expect(
      shardExecutionPlan(
        plan,
        0,
        2,
      ).specIds,
    ).toEqual([
      'a',
      'c',
      'e',
    ]);

    expect(
      shardExecutionPlan(
        plan,
        1,
        2,
      ).specIds,
    ).toEqual([
      'b',
      'd',
    ]);
  });

  it('partitions into the requested number of plans', () => {
    const partitions =
      partitionExecutionPlan(
        plan,
        3,
      );

    expect(partitions)
      .toHaveSize(3);

    expect(
      partitions.flatMap(
        (part) =>
          part.specIds,
      ).sort(),
    ).toEqual(
      [...plan.specIds].sort(),
    );
  });
});
````

## File: src/hmr-test-remove.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('HMR removed spec contract', () => {
  it('emits test-remove for a deleted spec instead of asking browser to import it', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/hmr-manager.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      "| 'test-remove'",
    );

    expect(source).toContain(
      "? 'test-remove'",
    );

    expect(source).toContain(
      "'Test file removed'",
    );
  });
});
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

    // Skip generated test modules and their maps.
    if (
      /\.spec(?:\.map)?\.(?:js|mjs)$/i.test(
        filename,
      )
    ) {
      return { code: source };
    }

    // Testify emits runtime modules as .mjs, while .js remains supported
    // for compatibility with explicitly supplied JavaScript sources.
    if (
      !/\.(?:js|mjs)$/i.test(
        filename,
      )
    ) {
      return { code: source };
    }

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

## File: src/jasmine-node-runtime.spec.ts
````typescript
import {
  getEmbeddedNodeJasmineRuntimeSource,
} from './jasmine-node-runtime';

describe('Node Jasmine runtime', () => {

  it('embeds Testify metadata before catalog helpers', () => {
    const source =
      getEmbeddedNodeJasmineRuntimeSource();

    const metadataIndex =
      source.indexOf(
        'function getTestifyFile(',
      );

    const catalogIndex =
      source.indexOf(
        'function createTestCatalogFromJasmineEnv(',
      );

    expect(metadataIndex)
      .toBeGreaterThan(-1);

    expect(catalogIndex)
      .toBeGreaterThan(
        metadataIndex,
      );

    expect(source).toContain(
      'function getTestifyMetadata(',
    );
  });
});
````

## File: src/node-artifact-host-mjs.spec.ts
````typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  discoverNodeBuildArtifacts,
} from './node-build-artifacts';

describe('Node mjs build artifacts', () => {
  it('discovers .spec.mjs and resolves test-runner.mjs', () => {
    const directory =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-mjs-',
        ),
      );

    try {
      fs.writeFileSync(
        path.join(
          directory,
          'fixture__12345678.spec.mjs',
        ),
        '',
      );

      fs.writeFileSync(
        path.join(
          directory,
          'source__12345678.mjs',
        ),
        '',
      );

      const artifacts =
        discoverNodeBuildArtifacts(
          directory,
        );

      expect(
        artifacts.specFiles,
      ).toEqual([
        'fixture__12345678.spec.mjs',
      ]);

      expect(
        artifacts.runnerFile,
      ).toMatch(
        /test-runner\.mjs$/,
      );
    } finally {
      fs.rmSync(
        directory,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });
});
````

## File: src/node-artifact-host.ts
````typescript
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

## File: src/node-generated-esm.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('Node generated ESM artifacts', () => {
  it('uses .mjs for the generated Testify runner', () => {
    const artifactsSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/node-build-artifacts.ts',
        ),
        'utf8',
      );

    expect(artifactsSource).toContain(
      'test-runner.mjs',
    );
  });
});
````

## File: src/node-process-host.ts
````typescript
export interface NodeProcessHostOptions {
  onUnhandledRejection?: (
    error: unknown,
  ) => void;

  onUncaughtException?: (
    error: Error,
  ) => void;

  onSignal?: (
    signal: NodeJS.Signals,
  ) => void;
}

export class NodeProcessHost {
  private attached = false;

  private readonly onUnhandledRejection =
    (error: unknown): void => {
      this.options
        .onUnhandledRejection?.(
          error,
        );
    };

  private readonly onUncaughtException =
    (error: Error): void => {
      this.options
        .onUncaughtException?.(
          error,
        );
    };

  private readonly onSigint =
    (): void => {
      this.options
        .onSignal?.(
          'SIGINT',
        );
    };

  private readonly onSigterm =
    (): void => {
      this.options
        .onSignal?.(
          'SIGTERM',
        );
    };

  constructor(
    private readonly options:
      NodeProcessHostOptions = {},
  ) {}

  attach(): void {
    if (this.attached) {
      return;
    }

    this.attached = true;

    process.on(
      'unhandledRejection',
      this.onUnhandledRejection,
    );

    process.on(
      'uncaughtException',
      this.onUncaughtException,
    );

    process.on(
      'SIGINT',
      this.onSigint,
    );

    process.on(
      'SIGTERM',
      this.onSigterm,
    );
  }

  detach(): void {
    if (!this.attached) {
      return;
    }

    this.attached = false;

    process.off(
      'unhandledRejection',
      this.onUnhandledRejection,
    );

    process.off(
      'uncaughtException',
      this.onUncaughtException,
    );

    process.off(
      'SIGINT',
      this.onSigint,
    );

    process.off(
      'SIGTERM',
      this.onSigterm,
    );
  }
}
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

## File: src/node-test-runner-facade.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('NodeTestRunner facade', () => {
  it('delegates artifacts and execution to hosts', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/node-test-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'new NodeArtifactHost(',
    );

    expect(source).toContain(
      'new NodeExecutionHost(',
    );

    expect(source).not.toContain(
      'createNodeRunnerModuleSource',
    );

    expect(source).not.toContain(
      'CoverageReportGenerator',
    );

    expect(source).not.toContain(
      'NodeExecutionEnvironmentHost',
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

## File: src/process-lock.spec.ts
````typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ProcessLock } from './process-lock';

describe('ProcessLock', () => {
  it('writes the PID lock file into the configured output directory', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-lock-'));
    const outDir = path.join(tempRoot, 'output');
    const lock = new ProcessLock(undefined, 4321, outDir);
    const expectedPath = path.join(outDir, '.testify-4321.pid');

    try {
      await lock.acquire(false);

      expect(fs.existsSync(expectedPath)).toBeTrue();
      expect(lock.getPidFilePath()).toBe(expectedPath);
      expect(fs.readFileSync(expectedPath, 'utf-8').trim()).toBe(String(process.pid));
    } finally {
      lock.releaseSync();
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
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

## File: src/test-metadata-path.spec.ts
````typescript
import {
  beginTestifyRegistrationScope,
  endTestifyRegistrationScope,
  getCurrentTestifyRegistrationFile,
  getTestifyFile,
  normalizeTestifyFilePath,
  setTestifyFile,
} from './test-metadata';

describe('Testify file identity normalization', () => {
  it('normalizes leading slashes and Windows separators', () => {
    expect(
      normalizeTestifyFilePath(
        '\\\\tests\\\\forms.spec.mjs',
      ),
    ).toBe(
      'tests/forms.spec.mjs',
    );

    expect(
      normalizeTestifyFilePath(
        '/tests/forms.spec.mjs',
      ),
    ).toBe(
      'tests/forms.spec.mjs',
    );
  });

  it('stores canonical file metadata', () => {
    const item = {};

    setTestifyFile(
      item,
      '\\\\forms__abc.spec.mjs',
    );

    expect(
      getTestifyFile(item),
    ).toBe(
      'forms__abc.spec.mjs',
    );
  });

  it('canonicalizes registration scopes', () => {
    beginTestifyRegistrationScope(
      '/nested\\\\forms.spec.mjs',
    );

    try {
      expect(
        getCurrentTestifyRegistrationFile(),
      ).toBe(
        'nested/forms.spec.mjs',
      );
    } finally {
      endTestifyRegistrationScope();
    }
  });
});
````

## File: src/test-metadata-runtime-path.spec.ts
````typescript
import {
  getEmbeddedTestMetadataSource,
} from './test-metadata-runtime';

describe('embedded Testify metadata path identity', () => {
  it('embeds the same canonical path normalization used by HMR', () => {
    const source =
      getEmbeddedTestMetadataSource();

    expect(source).toContain(
      'function normalizeTestifyFilePath(file)',
    );

    expect(source).toContain(
      'normalizeTestifyFilePath(file)',
    );

    expect(
      () => new Function(source),
    ).not.toThrow();
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

## File: src/vite-config-builder-node-external.spec.ts
````typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  ViteConfigBuilder,
} from './vite-config-builder';

describe('ViteConfigBuilder Node externals', () => {
  it('keeps package dependencies external in Node builds', () => {
    const directory =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-node-external-',
        ),
      );

    const previousCwd =
      process.cwd();

    try {
      fs.writeFileSync(
        path.join(
          directory,
          'package.json',
        ),
        JSON.stringify({
          dependencies: {
            playwright: '1.0.0',
          },
          devDependencies: {
            vite: '8.0.0',
          },
        }),
      );

      process.chdir(
        directory,
      );

      const builder =
        new ViteConfigBuilder({
          srcDirs: ['./src'],
          testDirs: ['./tests'],
          exclude: [],
          outDir: './dist',
          browser: 'node',
          preserveOutputs: false,
        } as any);

      const config =
        builder.createViteConfig([]);

      const external =
        config.build
          ?.rolldownOptions
          ?.external as
            ((id: string) => boolean);

      expect(
        external('playwright'),
      ).toBeTrue();

      expect(
        external(
          'playwright/lib/index',
        ),
      ).toBeTrue();

      expect(
        external('vite'),
      ).toBeTrue();

      expect(
        external('./local-module'),
      ).toBeFalse();
    } finally {
      process.chdir(
        previousCwd,
      );

      fs.rmSync(
        directory,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });

  it('does not externalize package dependencies for browser builds', () => {
    const builder =
      new ViteConfigBuilder({
        srcDirs: ['./src'],
        testDirs: ['./tests'],
        exclude: [],
        outDir: './dist',
        browser: 'chrome',
        preserveOutputs: false,
      } as any);

    const config =
      builder.createViteConfig([]);

    expect(
      config.build
        ?.rolldownOptions
        ?.external,
    ).toBeUndefined();
  });
});
````

## File: src/vite-config-builder-node-resolution.spec.ts
````typescript
import {
  ViteConfigBuilder,
} from './vite-config-builder';

describe('ViteConfigBuilder Node resolution', () => {
  it('uses Node resolution, external packages, and no vendor chunking', () => {
    const builder =
      new ViteConfigBuilder({
        srcDirs: ['./src'],
        testDirs: ['./src'],
        outDir:
          './dist/.vite-jasmine-build',
        browser: 'node',
        jasmineConfig: {
          env: {
            random: false,
            seed: 0,
            stopSpecOnExpectationFailure:
              false,
          },
        },
      } as any);

    const config =
      builder.createViteConfig([
        './src/example.ts',
      ]);

    const rolldown =
      config.build
        ?.rolldownOptions as any;

    expect(
      config.build?.ssr,
    ).toBeTrue();

    expect(
      rolldown.output
        .manualChunks,
    ).toBeUndefined();

    expect(
      rolldown.output
        .chunkFileNames,
    ).toBe(
      '[name].mjs',
    );

    expect(
      rolldown.external(
        'events',
      ),
    ).toBeTrue();

    expect(
      rolldown.external(
        'playwright',
      ),
    ).toBeTrue();

    expect(
      rolldown.external(
        './local-module',
      ),
    ).toBeFalse();
  });
});
````

## File: src/vite-jasmine-runner-browser-startup.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('ViteJasmineRunner headed browser startup', () => {
  const source = fs.readFileSync(
    path.resolve(
      process.cwd(),
      'src/vite-jasmine-runner.ts',
    ),
    'utf8',
  );

  it('cleans up and returns an internal error when browser startup rejects', () => {
    const startupFailureBranches =
      source.match(
        /catch \{\s*await this\.cleanup\(\);\s*return EXIT_CODES\.INTERNAL_ERROR;\s*\}/g,
      ) ?? [];

    expect(
      startupFailureBranches.length,
    ).toBeGreaterThanOrEqual(2);
  });

  it('does not wait on headed completion promises before startup succeeds', () => {
    const watchOpen = source.indexOf(
      'await this.browserManager.openBrowser(',
      source.indexOf(
        'private async runWatchMode',
      ),
    );
    const watchWait = source.indexOf(
      'return watchFinishedPromise;',
      watchOpen,
    );

    const headedOpen = source.indexOf(
      'await this.browserManager.openBrowser(',
      source.indexOf(
        'private async runHeadedBrowserMode',
      ),
    );
    const headedWait = source.indexOf(
      'return runFinishedPromise;',
      headedOpen,
    );

    expect(watchOpen).toBeGreaterThan(-1);
    expect(watchWait).toBeGreaterThan(
      watchOpen,
    );
    expect(headedOpen).toBeGreaterThan(-1);
    expect(headedWait).toBeGreaterThan(
      headedOpen,
    );
  });
});
````

## File: src/vite-jasmine-runner-coverage.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('ViteJasmineRunner coverage boundary', () => {
  it('uses CoverageHost instead of constructing coverage generators inline', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'CoverageHost',
    );

    expect(source).not.toContain(
      'new CoverageReportGenerator',
    );
  });
});
````

## File: src/vite-jasmine-runner-no-tests.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('ViteJasmineRunner empty test discovery UX', () => {
  const source = fs.readFileSync(
    path.resolve(
      process.cwd(),
      'src/vite-jasmine-runner.ts',
    ),
    'utf8',
  );

  it('treats missing spec files as a clean no-op instead of a config error', () => {
    expect(source).toContain(
      "return 'no-specs';",
    );

    expect(source).not.toContain(
      "throw new ExitCodeError(EXIT_CODES.CONFIG_ERROR, 'No test files found');",
    );
  });

  it('maps the no-specs preprocess result to a success exit code', () => {
    const successBranches =
      source.match(
        /if \(preprocessResult === 'no-specs'\) \{\s*return EXIT_CODES\.SUCCESS;\s*\}/g,
      ) ?? [];

    expect(
      successBranches.length,
    ).toBeGreaterThanOrEqual(2);
  });
});
````

## File: src/vite-jasmine-runner-result.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('ViteJasmineRunner Node result boundary', () => {
  it('maps Node ExecutionResult to an exit code at the runner boundary', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'getExecutionExitCode',
    );

    expect(source).not.toContain(
      'return exitCode;',
    );
  });
});
````

## File: src/websocket-manager.spec.ts
````typescript
import http from 'http';
import { WebSocketManager } from './websocket-manager';

describe('WebSocketManager', () => {
  it('treats jasmineDone global failures as an unsuccessful run', async () => {
    const manager =
      new WebSocketManager(
        {
          scanDir: async () => [],
        } as any,
        {
          outDir: 'dist',
        } as any,
        http.createServer(),
        {
          jasmineStarted() {},
          suiteStarted() {},
          specStarted() {},
          specDone() {},
          suiteDone() {},
          jasmineDone() {},
        },
      );

    const completion =
      new Promise<any>((resolve) => {
        manager.once(
          'testsCompleted',
          resolve,
        );
      });

    (manager as any).handleWebSocketMessage({
      type: 'jasmineStarted',
    });

    (manager as any).handleWebSocketMessage({
      type: 'jasmineDone',
      overallStatus: 'passed',
      failedExpectations: [{
        message:
          'Unhandled promise rejection: Error: authorization service unavailable',
      }],
    });

    await expectAsync(completion)
      .toBeResolvedTo(
        jasmine.objectContaining({
          success: false,
          hasPending: false,
        }),
      );

    await manager.cleanup();
  });
});
````

## File: src/websocket-session-exit.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('Playground session exit host command', () => {
  it('routes session:exit through the WebSocket host', () => {
    const source = fs.readFileSync(
      path.resolve(
        process.cwd(),
        'src/websocket-manager.ts',
      ),
      'utf8',
    );

    expect(source).toContain(
      "case 'session:exit':",
    );
    expect(source).toContain(
      "this.emit('sessionExitRequested')",
    );
  });

  it('closes the browser and resolves watch mode cleanly', () => {
    const source = fs.readFileSync(
      path.resolve(
        process.cwd(),
        'src/vite-jasmine-runner.ts',
      ),
      'utf8',
    );

    expect(source).toContain(
      "'sessionExitRequested'",
    );
    expect(source).toContain(
      "await this.browserManager.closeBrowser();",
    );
    expect(source).toContain(
      'watchFinishedResolve?.(EXIT_CODES.SUCCESS)',
    );
  });
});
````

## File: .gitignore
````
dist
coverage
.idea/
.DS_Store
node_modules/
tags
sauce_connect.log
yarn.lock
.envrc
````

## File: docs/vocabulary-audit.md
````markdown
# Testify vocabulary audit

## Rule

> **One concept → one vocabulary → one owner.**

Public language is polished aggressively. Internal vocabulary is also changed when it duplicates ownership or teaches a competing model.

## Decisions

| Concept | Owner | Frozen vocabulary | Removed/relocated vocabulary |
|---|---|---|---|
| Live execution context | `RunnerSession` | `session` | browser `runner` identity |
| Discovery | `RunnerSession` | `tests`, `suites`, `files` | `list*`, `find*`, Session `query()` |
| Planning | Session + Plan | `plan`, `planSpec`, `planSuite`, `planFile` | direct planner/cache controls on Session |
| Exact work | `ExecutionPlan` / `PlannedExecution` | `tests`, `filter`, `slice`, `add`, `subtract`, `intersect`, `not`, `passed`, `failed`, `unresolved`, `shard`, `partition` | competing plan/result-selection commands |
| Execution | `RunnerSession` | `run` for intent, `execute` for exact plan | aliases with identical meaning |
| Retry loop | Playground | `rerun`, `retry` | `rerunFailed`, `failed` |
| Catalog lifecycle | `RunnerSession` | `refresh`, `revision`, `changes` | raw catalog/index access on Session |
| Generated Node boundary | generated module + `NodeRunnerHost` | `run(reporter, selector?)` | `runTests`, `runTest`, `runSuite`, `runFile`, host `execute`, exported list/find/session diagnostics |
| Stable package root | Session/Plan/Result contracts | `RunnerSession` + contract types | catalog/index/query/planner construction helpers moved to `/internals` |
| Playground presentation | DevTools values | self-describing values | `.print()`, `.show()`, required `console.table(...)` |

## Stable root

The runtime value exported from the stable root is `RunnerSession`. Plan, Result, Selector, and Catalog are stable contract types.

Lower-level factories, catalog queries, indexes, selector resolvers, result summarizers, and planning state live under:

```ts
@epikodelabs/testify/internals
```

## Node boundary

Before:

```text
Generated module:
  runTests / runTest / runSuite / runFile
  list* / find*
  getSession / getStats / getIndex / ...

NodeRunnerHost:
  execute / run / runSpec / runSuite / runFile
  list* / find*
  getSession / getStats / getIndex / ...
```

After:

```text
Generated module:
  run(reporter, selector?)

NodeRunnerHost:
  run(reporter, selector?)
```

Planning and discovery remain owned by the `RunnerSession` created inside the generated module. The transport does not mirror Session as another API.

## Session boundary

Removed from `RunnerSession`:

```text
query()
catalog()
index()
planningStats()
invalidatePlans()
```

These exposed implementation objects rather than user concepts. Observable catalog lifecycle remains:

```ts
session.refresh()
session.revision()
session.changes()
```

Discovery remains:

```ts
session.tests()
session.suites()
session.files()
```

## Observability

> **Every value exposed by the Playground should be worth looking at.**

This remains a UX invariant. The vocabulary audit does not add console-only powers; it makes engine values coherent and observable.
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
          'forms.spec.mjs',
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
        'forms.spec.mjs',
      ]);

      expect(
        artifacts.specFiles,
      ).toEqual([
        'forms.spec.mjs',
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

## File: src/browser-page-builder-static.spec.ts
````typescript
import {
  BrowserPageBuilder,
} from './browser-page-builder';
import type {
  ViteJasmineConfig,
} from './vite-jasmine-config';

describe('BrowserPageBuilder static reporter bridge', () => {
  it('includes the WebSocket reporter and static spec imports', () => {
    const builder =
      new BrowserPageBuilder({
        outDir:
          'dist/.vite-jasmine-build',
        htmlOptions: {
          title: 'Testify',
          preludeModules: [],
        },
        jasmineConfig: {
          env: {
            random: false,
            seed: 0,
            stopSpecOnExpectationFailure:
              false,
          },
        },
      } as unknown as ViteJasmineConfig);

    const html =
      builder.buildStatic([
        'forms.spec.mjs',
      ]);

    expect(html).toContain(
      'WebSocketEventForwarder',
    );

    expect(html).toContain(
      'boot0.js',
    );

    expect(html).toContain(
      'boot1.js',
    );

    expect(html).toContain(
      'import "./forms.spec.mjs";',
    );
  });
});
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

  boot0.onload = () => {
    const boot1 =
      document.createElement(
        'script',
      );

    boot1.src =
      '/node_modules/jasmine-core/lib/jasmine-core/boot1.js';

    boot1.onload = async () => {
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

    boot1.onerror = (error) => {
      console.error(
        'Failed to load Jasmine boot1.js:',
        error,
      );
    };

    document.head.appendChild(
      boot1,
    );
  };

  boot0.onerror = (error) => {
    console.error(
      'Failed to load Jasmine boot0.js:',
      error,
    );
  };

  document.head.appendChild(boot0);
})();

${runtimeScript}
`;
}
````

## File: src/browser-websocket-runtime.spec.ts
````typescript
import {
  getBrowserWebSocketReporterScript,
} from './browser-websocket-runtime';

describe('Browser WebSocket runtime', () => {
  it('receives ordering configuration explicitly', () => {
    const source =
      getBrowserWebSocketReporterScript({
        initialSeed: 42,
        initialRandom: true,
      });

    expect(source).toContain(
      'self.getOrderedSuites(42, true)',
    );

    expect(source).toContain(
      'self.getOrderedSpecs(42, true)',
    );
  });

  it('captures browser async errors and attributes them to the active spec', () => {
    const source =
      getBrowserWebSocketReporterScript({
        initialSeed: 0,
        initialRandom: false,
      });

    expect(source).toContain(
      "window.addEventListener(\n      'unhandledrejection'",
    );

    expect(source).toContain(
      "window.addEventListener(\n      'error'",
    );

    expect(source).toContain(
      'this.currentSpecId = null;',
    );

    expect(source).toContain(
      'self.mergePendingSpecFailures(result)',
    );

    expect(source).toContain(
      'self.collectRunLevelFailures(result)',
    );
  });
});
````

## File: src/catalog-state.spec.ts
````typescript
import {
  CatalogState,
  fingerprintTestCatalog,
} from './catalog-state';
import type {
  TestCatalog,
} from './test-catalog';

describe('CatalogState', () => {
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
        file: 'forms.spec.mjs',
      },
    ],
  };

  it('keeps the same revision for equivalent catalog objects', () => {
    const state =
      new CatalogState(
        catalog,
      );

    const index =
      state.index;

    const change =
      state.update({
        rootSuiteId:
          catalog.rootSuiteId,
        suites:
          catalog.suites.map(
            (suite) => ({
              ...suite,
            }),
          ),
        specs:
          catalog.specs.map(
            (spec) => ({
              ...spec,
            }),
          ),
      });

    expect(change.changed)
      .toBeFalse();

    expect(state.version)
      .toBe(1);

    expect(state.index)
      .toBe(index);
  });

  it('increments revision and reports changes when catalog content changes', () => {
    const state =
      new CatalogState(
        catalog,
      );

    const change =
      state.update({
        ...catalog,
        specs: [
          ...catalog.specs,
          {
            id: 'spec2',
            description: 'two',
            fullName: 'Forms two',
            suiteId: 'suite1',
            file: 'forms.spec.mjs',
          },
        ],
      });

    expect(change.changed)
      .toBeTrue();

    expect(change.addedSpecIds)
      .toEqual([
        'spec2',
      ]);

    expect(state.version)
      .toBe(2);
  });

  it('fingerprints by content rather than object identity', () => {
    expect(
      fingerprintTestCatalog(
        catalog,
      ),
    ).toBe(
      fingerprintTestCatalog({
        ...catalog,
        suites:
          catalog.suites.map(
            (suite) => ({
              ...suite,
            }),
          ),
        specs:
          catalog.specs.map(
            (spec) => ({
              ...spec,
            }),
          ),
      }),
    );
  });
});
````

## File: src/cli-entry.ts
````typescript
import { CLIHandler } from './cli-handler';

CLIHandler.run()
  .then((code) => process.exit(code))
  .catch(() => process.exit(1));
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
        globalFailures: [],
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
        globalFailures: [],
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
        globalFailures: [],
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
        globalFailures: [],
      }),
    ).toBe(
      EXIT_CODES.SUCCESS,
    );
  });

  it('maps global failures to test failure exit code', () => {
    expect(
      getExecutionExitCode({
        specResults: [],
        total: 0,
        passed: 0,
        failed: 0,
        pending: 0,
        globalFailures: [{
          message:
            'Unhandled promise rejection: Error: authorization service unavailable',
        }],
      }),
    ).toBe(
      EXIT_CODES.TEST_FAILURES,
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

  if (
    result.failed > 0 ||
    (result.globalFailures?.length ?? 0) > 0
  ) {
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

## File: src/console-reporter-abort.spec.ts
````typescript
import util from 'util';
import {
  ConsoleReporter,
} from './console-reporter';
import {
  EXIT_CODES,
} from './exit-codes';

describe('ConsoleReporter abort', () => {
  it('returns the SIGINT exit code without writing to process stdout', () => {
    const output: string[] = [];

    const reporter =
      new ConsoleReporter({
        showColors: false,
        print: (...args) => {
          output.push(
            util.format(
              ...args,
            ),
          );
        },
      });

    expect(
      reporter.testsAborted(),
    ).toBe(
      EXIT_CODES.SIGINT,
    );

    const rendered =
      output.join('');

    expect(rendered)
      .toContain(
        'TESTS INTERRUPTED',
      );

    expect(rendered)
      .toContain(
        'time: 0.000s',
      );
  });

  it('returns the SIGTERM exit code when requested', () => {
    const reporter =
      new ConsoleReporter({
        showColors: false,
        print: () => {},
      });

    expect(
      reporter.testsAborted(
        'SIGTERM',
      ),
    ).toBe(
      EXIT_CODES.SIGTERM,
    );
  });
});
````

## File: src/console-reporter-output.spec.ts
````typescript
import {
  ConsoleReporter,
} from './console-reporter';

describe('ConsoleReporter output sink', () => {
  it('uses the injected print sink', () => {
    const messages: string[] = [];

    const reporter =
      new ConsoleReporter({
        showColors: false,
        print: (...args) => {
          messages.push(
            args.join(''),
          );
        },
      });

    reporter.jasmineStarted({
      totalTime: 0,
    });

    expect(
      messages.join(''),
    ).toContain(
      'Test Runner Started',
    );
  });

  it('prints a failed final status for jasmineDone global failures', () => {
    const messages: string[] = [];

    const reporter =
      new ConsoleReporter({
        showColors: false,
        print: (...args) => {
          messages.push(
            args.join(''),
          );
        },
      });

    reporter.jasmineStarted({
      totalTime: 0,
    });

    reporter.jasmineDone({
      overallStatus: 'passed',
      failedExpectations: [{
        message:
          'Unhandled promise rejection: Error: authorization service unavailable',
        globalErrorType:
          'unhandledRejection',
      }],
      totalTime: 0,
    });

    expect(
      messages.join(''),
    ).toContain(
      '1 TEST FAILED',
    );
  });
});
````

## File: src/embedded-source.spec.ts
````typescript
import {
  getEmbeddedCatalogStateSource,
} from './catalog-state';
import {
  getEmbeddedNameHelperSource,
} from './embedded-source';
import {
  getEmbeddedPlanningEngineSource,
} from './planning-engine';
import {
  getEmbeddedRunnerSessionSource,
} from './runner-session';

describe('embedded class source', () => {
  it('provides the __name helper for embedded transformed sources', () => {
    expect(
      getEmbeddedNameHelperSource(),
    ).toContain(
      'function __name(target, value)',
    );

    expect(
      getEmbeddedNameHelperSource(),
    ).toContain(
      'return target;',
    );
  });

  it('binds embedded classes to stable names', () => {
    expect(
      getEmbeddedCatalogStateSource(),
    ).toContain(
      'const CatalogState = class',
    );

    expect(
      getEmbeddedPlanningEngineSource(),
    ).toContain(
      'const PlanningEngine = class',
    );

    expect(
      getEmbeddedRunnerSessionSource(),
    ).toContain(
      'const RunnerSession = class',
    );
  });

  it('does not emit bare anonymous class statements', () => {
    const source = [
      getEmbeddedCatalogStateSource(),
      getEmbeddedPlanningEngineSource(),
      getEmbeddedRunnerSessionSource(),
    ].join('\\n\\n');

    expect(
      /(^|\\n)class\\s*\\{/.test(
        source,
      ),
    ).toBeFalse();
  });
});
````

## File: src/embedded-source.ts
````typescript
export function getEmbeddedNameHelperSource():
  string {
  return `function __name(target, value) {
  try {
    Object.defineProperty(
      target,
      'name',
      {
        value,
        configurable: true,
      },
    );
  } catch {}

  return target;
}`;
}

export function embedFunctionSource(
  value: Function,
): string {
  return value.toString();
}

export function embedClassSource(
  name: string,
  value: Function,
): string {
  return `const ${name} = ${value.toString()};`;
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
    expect(result.globalFailures).toEqual([]);
  });

  it('preserves global failures separately from spec results', () => {
    const result =
      summarizeExecutionResults(
        [],
        {
          globalFailures: [{
            message:
              'Unhandled promise rejection: Error: authorization service unavailable',
            globalErrorType:
              'unhandledRejection',
          }],
        },
      );

    expect(result.total).toBe(0);
    expect(result.failed).toBe(0);
    expect(result.globalFailures)
      .toHaveSize(1);
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

export interface ExecutionGlobalFailure {
  message?: string;
  stack?: string;
  [key: string]: unknown;
}

export interface ExecutionResult {
  specResults: ExecutionSpecResult[];
  total: number;
  passed: number;
  failed: number;
  pending: number;
  globalFailures?: ExecutionGlobalFailure[];
  duration?: number;
  exitCode?: number;
}

export function summarizeExecutionResults(
  specResults: ExecutionSpecResult[],
  options: {
    duration?: number;
    exitCode?: number;
    globalFailures?: ExecutionGlobalFailure[];
  } = {},
): ExecutionResult {
  let passed = 0;
  let failed = 0;
  let pending = 0;
  const globalFailures =
    Array.isArray(
      options.globalFailures,
    )
      ? [...options.globalFailures]
      : [];

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
    globalFailures,
    duration: options.duration,
    exitCode: options.exitCode,
  };
}
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
  runnerFileName = 'test-runner.mjs',
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
        /\.mjs$/i.test(file),
    )
    .sort();

  return {
    outDir: normalizedOutDir,
    files,
    specFiles: files.filter(
      (file) =>
        /\.spec\.mjs$/i.test(file),
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

## File: src/node-cli-runner.ts
````typescript
import type {
  ExecutionResult,
} from './execution-result';
import {
  applyExecutionExitCode,
} from './cli-result-adapter';
import {
  EXIT_CODES,
  getSignalExitCode,
} from './exit-codes';
import {
  NodeTestRunner,
} from './node-test-runner';
import {
  NodeProcessHost,
} from './node-process-host';
import {
  NodeRunnerMessages,
} from './log-messages';
import { logger } from './logger';

export async function runNodeCli(
  runner: NodeTestRunner,
): Promise<ExecutionResult> {
  const processHost =
    new NodeProcessHost({
      onUnhandledRejection(error) {
        logger.error(
          NodeRunnerMessages
            .unhandledRejection(
              error instanceof Error
                ? error.message
                : String(error),
            ),
        );

        process.exitCode =
          EXIT_CODES.INTERNAL_ERROR;
      },

      onUncaughtException(error) {
        logger.error(
          NodeRunnerMessages
            .uncaughtException(
              error.message,
            ),
        );

        process.exitCode =
          EXIT_CODES.INTERNAL_ERROR;
      },

      onSignal(signal) {
        logger.println(
          NodeRunnerMessages
            .caughtSignal(
              signal,
            ),
        );

        process.exitCode =
          getSignalExitCode(
            signal,
          );

        void runner.stop();
      },
    });

  processHost.attach();

  try {
    const result =
      await runner.start();

    applyExecutionExitCode(
      result,
    );

    return result;
  } catch (error) {
    process.exitCode =
      EXIT_CODES.INTERNAL_ERROR;

    throw error;
  } finally {
    processHost.detach();
  }
}
````

## File: src/node-execution-host.ts
````typescript
import type {
  ExecutionResult,
} from './execution-result';
import type {
  TestSelector,
} from './test-selection';
import {
  NodeExecutionEnvironmentHost,
} from './node-execution-environment-host';
import {
  NodeArtifactHost,
} from './node-artifact-host';
import {
  NodeRuntimeHost,
} from './node-runtime-host';
import {
  CoverageHost,
} from './coverage-host';

export interface NodeExecutionHostOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  file?: string;
  suppressConsoleLogs?: boolean;
  selector?: TestSelector;
}

export class NodeExecutionHost {
  constructor(
    private readonly artifacts:
      NodeArtifactHost,
    private readonly runtime:
      NodeRuntimeHost,
    private readonly coverage:
      CoverageHost,
  ) {}

  async run(
    reporter: jasmine.CustomReporter,
    options:
      NodeExecutionHostOptions = {},
  ): Promise<ExecutionResult> {
    const environment =
      new NodeExecutionEnvironmentHost({
        env: options.env,
        nodeEnv: 'test',
        suppressConsoleLogs:
          options.suppressConsoleLogs,
      });

    return environment.run(
      async () => {
        const host =
          this.artifacts
            .resolveRunner(
              options.cwd,
              options.file,
            );

        const result =
          await this.runtime.run(
            host,
            reporter,
            options.selector,
          );

        await this.coverage
          .generateGlobal();

        return result;
      },
    );
  }
}
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
    expect(result.globalFailures)
      .toEqual([]);
  });

  it('captures jasmineDone global failures in the execution result', async () => {
    let reporter:
      | {
          jasmineStarted?(): void;
          jasmineDone?(
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
        reporter?.jasmineStarted?.();
        reporter?.jasmineDone?.({
          failedExpectations: [{
            message:
              'Unhandled promise rejection: Error: authorization service unavailable',
            globalErrorType:
              'unhandledRejection',
          }],
        });
      },
    };

    const plan: ExecutionPlan = {
      specIds: [],
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

    expect(result.globalFailures)
      .toEqual([{
        message:
          'Unhandled promise rejection: Error: authorization service unavailable',
        globalErrorType:
          'unhandledRejection',
      }]);
  });
});
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

## File: src/node-test-runner-environment.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('NodeTestRunner environment boundary', () => {
  it('delegates execution to NodeExecutionHost, which owns environment mutation', () => {
    const runnerSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/node-test-runner.ts',
        ),
        'utf8',
      );

    const executionSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/node-execution-host.ts',
        ),
        'utf8',
      );

    expect(runnerSource).toContain(
      'new NodeExecutionHost(',
    );

    expect(runnerSource).not.toContain(
      'new NodeExecutionEnvironmentHost(',
    );

    expect(executionSource).toContain(
      'new NodeExecutionEnvironmentHost(',
    );

    expect(runnerSource).not.toContain(
      "process.env.NODE_ENV = 'test'",
    );
  });
});
````

## File: src/node-test-runner-plan.spec.ts
````typescript
import fs from 'fs';
import path from 'path';
import {
  createNodeRunnerModuleSource,
} from './node-runner-module-source';

describe('NodeTestRunner execution-plan integration', () => {
  it('keeps planning in the generated Node runner and delegates execution through NodeExecutionHost', () => {
    const runnerSource =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/node-test-runner.ts',
        ),
        'utf8',
      );

    expect(
      runnerSource,
    ).toContain(
      'NodeExecutionHost',
    );

    expect(
      runnerSource,
    ).toContain(
      'selector:',
    );

    const generatedSource =
      createNodeRunnerModuleSource({
        jasmineCoreUrl:
          'file:///jasmine-core.mjs',
        imports: '',
        config: {
          browser: 'node',
          outDir:
            './dist/.vite-jasmine-build',
          srcDirs: ['./src'],
          testDirs: ['./src'],
          exclude: [],
          jasmineConfig: {
            env: {
              random: false,
              seed: 0,
              stopSpecOnExpectationFailure:
                false,
            },
          },
        } as any,
      });

    expect(
      generatedSource,
    ).toContain(
      'createExecutionPlan(',
    );

    expect(
      generatedSource,
    ).toContain(
      'executeNodePlan(',
    );
  });
});
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

  constructor(projectPath?: string, port?: number, lockDir?: string) {
    const cwd = norm(path.resolve(lockDir ?? process.cwd()));
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
    fs.mkdirSync(path.dirname(this.pidFile), { recursive: true });
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
        logger.error(ProcessLockMessages.couldNotTerminate(pid));
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

  getPidFilePath(): string {
    return this.pidFile;
  }
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
        file: 'root.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Root Child two',
        suiteId: 'suite2',
        file: 'child.spec.mjs',
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
        'child.spec.mjs',
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
        file: 'forms.spec.mjs',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'binds controls',
        fullName:
          'Membrane Forms binds controls',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'measures snapshots',
        fullName:
          'Performance measures snapshots',
        file:
          'performance.spec.mjs',
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

## File: src/vite-config-builder-node-mode.spec.ts
````typescript
import {
  ViteConfigBuilder,
} from './vite-config-builder';

describe('ViteConfigBuilder Node mode', () => {
  it('uses a multi-entry ESM build with Node/SSR resolution semantics', () => {
    const builder =
      new ViteConfigBuilder({
        srcDirs: ['./src'],
        testDirs: ['./src'],
        outDir:
          './dist/.vite-jasmine-build',
        browser: 'node',
        jasmineConfig: {
          env: {
            random: false,
            seed: 0,
            stopSpecOnExpectationFailure:
              false,
          },
        },
      } as any);

    const config =
      builder.createViteConfig([
        './src/example.ts',
      ]);

    expect(
      config.build?.ssr,
    ).toBeTrue();

    expect(
      config.build?.modulePreload,
    ).toBeFalse();

    const rolldown =
      config.build
        ?.rolldownOptions as any;

    expect(
      rolldown.input,
    ).toBeDefined();

    expect(
      rolldown.output
        .entryFileNames,
    ).toBe(
      '[name].mjs',
    );

    expect(
      typeof rolldown.external,
    ).toBe(
      'function',
    );
  });
});
````

## File: src/vite-config-builder-rolldown.spec.ts
````typescript
import {
  ViteConfigBuilder,
} from './vite-config-builder';

describe('ViteConfigBuilder Rolldown contract', () => {
  it('keeps input and output under rolldownOptions', () => {
    const builder =
      new ViteConfigBuilder({
        srcDirs: ['./src'],
        testDirs: ['./src'],
        outDir:
          './dist/.vite-jasmine-build',
        browser: 'node',
        jasmineConfig: {
          env: {
            random: false,
            seed: 0,
            stopSpecOnExpectationFailure:
              false,
          },
        },
      } as any);

    const config =
      builder.createViteConfig([
        './src/example.ts',
      ]);

    const build =
      config.build as any;

    expect(
      build.rolldownOptions,
    ).toBeDefined();

    expect(
      build.rolldownOptions.input,
    ).toBeDefined();

    expect(
      build.rolldownOptions.output,
    ).toBeDefined();

    expect(
      build.rollupOptions,
    ).toBeUndefined();

    expect(
      build.emptyOutDir,
    ).toBeFalse();
  });
});
````

## File: src/vite-jasmine-runner-mjs.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('ViteJasmineRunner mjs pipeline', () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        'src/vite-jasmine-runner.ts',
      ),
      'utf8',
    );

  it('strips the final .mjs before assigning Rolldown input keys', () => {
    expect(source).toContain(
      '/\\.mjs$/',
    );

    expect(source).not.toContain(
      "/\\.js$/",
    );
  });

  it('instruments generated .mjs source modules', () => {
    expect(source).toContain(
      '**/*.mjs',
    );

    expect(source).toContain(
      '/\\.spec\\.mjs$/i',
    );
  });
});
````

## File: docs/architecture-vocabulary.md
````markdown
# Testify architectural vocabulary

> **One concept → one vocabulary → one owner.**

This document is the vocabulary freeze for Testify 2.

## Core concepts

### Session

Owner: `RunnerSession`

Meaning: a live execution context with a current catalog, planning state, execution adapter, and lifecycle.

Preferred vocabulary:

```text
session
tests / suites / files
plan
run / execute
refresh / revision / changes
close
```

Avoid parallel Session vocabulary such as `runner`, `listTests`, `findTests`, or `queryTests` for the same operation.

### Plan

Owner: `ExecutionPlan` / `PlannedExecution`

Meaning: exact work selected for execution.

Preferred vocabulary:

```text
plan
specIds
tests()
filter()
slice()
add() / subtract() / intersect() / not()
passed(result)
failed(result)
unresolved(result)
shard
partition
```

A plan is data first. Interactive operations are non-enumerable and must not change serialization.

### Result

Owner: `ExecutionResult`

Meaning: what happened during one execution.

Preferred vocabulary:

```text
result
specResults
passed
failed
pending
duration
```

Execution outcomes remain Result data; Plan may derive `passed(result)`, `failed(result)`, and `unresolved(result)` subsets without creating a second execution model.

### Catalog

Owner: Session internally; catalog utilities under `/internals`.

Meaning: discovered test identities available for selection/planning.

Stable Session vocabulary is `tests/suites/files`. `CatalogQuery`, indexes, list helpers, and selector resolvers are lower-level implementation/building blocks, not competing public entry points.

## Execution verbs

```text
run       intent-oriented: resolve current intent, create a fresh plan, execute
execute   plan-oriented: execute the exact supplied plan
rerun     Playground: repeat previous intent
retry     Playground: resolve previous failures against the current catalog
```

Do not use `runTests`, `runTest`, and `execute` as aliases for the same host operation.

## Host vocabulary

Hosts transport or execute the core model; they do not redefine it.

### Generated Node runner

Single exported operation:

```ts
run(reporter, selector?)
```

### NodeRunnerHost

Single execution operation:

```ts
host.run(reporter, selector?)
```

The generated module does not expose duplicate catalog/query/session helper APIs.

### Browser Playground

The browser exposes the actual Session as:

```ts
globalThis.session
```

The Playground adds only interaction-specific controls such as `rerun`, `retry`, `help`, `reload`, and `exit`. Previous execution state remains private and exists only to support rerun/retry semantics.

## Observability invariant

> **Every value exposed by the Playground should be worth looking at.**

Observability belongs to values, not to a parallel presentation API. Avoid `.print()`, `.show()`, and user-required `console.table(...)` rituals for core Playground values.

## Admission rule

Before adding a new noun or verb, ask:

1. Is this a genuinely new concept?
2. Which layer owns it?
3. Does an existing word already describe it?
4. Would this create another path to the same operation?
5. If exposed in the Playground, is the returned value understandable by inspection?

If ownership or vocabulary is ambiguous, the API is not ready to grow.
````

## File: scripts/verify-publish.mjs
````javascript
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  spawnSync,
} from 'node:child_process';
import {
  fileURLToPath,
} from 'node:url';

const scriptFile =
  fileURLToPath(
    import.meta.url,
  );

const projectRoot =
  path.resolve(
    path.dirname(scriptFile),
    '..',
  );

const distRoot =
  path.join(
    projectRoot,
    'dist/testify',
  );

const npmCommand =
  process.platform === 'win32'
    ? 'npm.cmd'
    : 'npm';

const npxCommand =
  process.platform === 'win32'
    ? 'npx.cmd'
    : 'npx';

function run(
  command,
  args,
  options = {},
) {
  const result =
    spawnSync(
      command,
      args,
      {
        cwd:
          options.cwd ??
          projectRoot,
        encoding: 'utf8',
        stdio:
          options.capture
            ? 'pipe'
            : 'inherit',
        env: {
          ...process.env,
          ...options.env,
        },
      },
    );

  if (
    result.error
  ) {
    throw result.error;
  }

  if (
    result.status !== 0
  ) {
    const details = [
      result.stdout,
      result.stderr,
    ]
      .filter(Boolean)
      .join('\n');

    throw new Error(
      `${command} ${args.join(' ')} failed with exit code ${result.status}`
      + (
        details
          ? `\n${details}`
          : ''
      ),
    );
  }

  return result;
}

function assertFile(
  relativePath,
) {
  const filePath =
    path.join(
      distRoot,
      relativePath,
    );

  assert.ok(
    fs.existsSync(
      filePath,
    ),
    `Missing packaged file: ${relativePath}`,
  );
}

assert.ok(
  fs.existsSync(
    distRoot,
  ),
  'dist/testify does not exist. Run npm run build first.',
);

const packageJson =
  JSON.parse(
    fs.readFileSync(
      path.join(
        distRoot,
        'package.json',
      ),
      'utf8',
    ),
  );

assert.equal(
  packageJson.name,
  '@epikodelabs/testify',
);

assert.equal(
  packageJson.version,
  '2.0.0',
);

assert.equal(
  packageJson.exports?.['.']?.import,
  './lib/index.js',
);

assert.equal(
  packageJson.exports?.['.']?.types,
  './lib/index.d.ts',
);

assert.equal(
  packageJson.exports?.['./internals']?.import,
  './lib/internals.js',
);

assert.equal(
  packageJson.exports?.['./internals']?.types,
  './lib/internals.d.ts',
);

for (
  const relativePath of [
    'bin/testify',
    'bin/jasmine',
    'lib/index.js',
    'lib/index.d.ts',
    'lib/internals.js',
    'lib/internals.d.ts',
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    'assets/favicon.ico',
  ]
) {
  assertFile(
    relativePath,
  );
}

const temporaryRoot =
  fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      'testify-publish-',
    ),
  );

const packDirectory =
  path.join(
    temporaryRoot,
    'pack',
  );

const fixtureDirectory =
  path.join(
    temporaryRoot,
    'fixture',
  );

fs.mkdirSync(
  packDirectory,
  { recursive: true },
);

fs.mkdirSync(
  fixtureDirectory,
  { recursive: true },
);

try {
  const packResult =
    run(
      npmCommand,
      [
        'pack',
        '--json',
        '--pack-destination',
        packDirectory,
      ],
      {
        cwd: distRoot,
        capture: true,
      },
    );

  const packed =
    JSON.parse(
      packResult.stdout,
    );

  assert.ok(
    Array.isArray(packed) &&
    packed.length === 1,
    'npm pack did not return exactly one package.',
  );

  const tarballPath =
    path.join(
      packDirectory,
      packed[0].filename,
    );

  assert.ok(
    fs.existsSync(
      tarballPath,
    ),
    'npm pack tarball was not created.',
  );

  fs.writeFileSync(
    path.join(
      fixtureDirectory,
      'package.json',
    ),
    JSON.stringify(
      {
        name:
          'testify-publish-fixture',
        version:
          '1.0.0',
        private:
          true,
        type:
          'module',
      },
      null,
      2,
    ) + '\n',
  );

  fs.mkdirSync(
    path.join(
      fixtureDirectory,
      'src',
    ),
    { recursive: true },
  );

  fs.mkdirSync(
    path.join(
      fixtureDirectory,
      'tests',
    ),
    { recursive: true },
  );

  fs.writeFileSync(
    path.join(
      fixtureDirectory,
      'src',
      'fixture.ts',
    ),
    `export const fixtureValue = 42;\n`,
  );

  fs.writeFileSync(
    path.join(
      fixtureDirectory,
      'tests',
      'fixture.spec.ts',
    ),
    `import { fixtureValue } from '../src/fixture';\n\n`
      + `describe('Fixture suite', () => {\n`
      + `  it('runs through npx testify', () => {\n`
      + `    expect(fixtureValue).toBe(42);\n`
      + `  });\n`
      + `});\n`,
  );

  fs.writeFileSync(
    path.join(
      fixtureDirectory,
      'testify.json',
    ),
    JSON.stringify(
      {
        srcDirs: [
          './src',
        ],
        testDirs: [
          './tests',
        ],
        exclude: [
          '**/node_modules/**',
        ],
        preserveOutputs: false,
        outDir:
          './dist/.vite-jasmine-build',
        browser: 'node',
        headless: true,
        // Deliberately stale/legacy value: plain `npx testify` must still
        // perform a one-shot run. Only --watch may enable HMR.
        watch: true,
        coverage: false,
        port: 8888,
        viteBuildOptions: {
          target: 'es2022',
          sourcemap: true,
          minify: false,
          preserveModules: false,
          preserveModulesRoot: '.',
        },
        jasmineConfig: {
          env: {
            stopSpecOnExpectationFailure:
              false,
            random: false,
            seed: 0,
            timeout: 120000,
          },
        },
        htmlOptions: {
          title:
            'Jasmine Test Runner',
          preludeModules: [],
        },
        suppressConsoleLogs: false,
      },
      null,
      2,
    ) + '\n',
  );

  fs.writeFileSync(
    path.join(
      fixtureDirectory,
      'smoke.mjs',
    ),
    `import assert from 'node:assert/strict';

import {
  RunnerSession,
} from '@epikodelabs/testify';

import {
  CatalogQuery,
  CatalogState,
  PlanningEngine,
  createExecutionPlan,
  partitionExecutionPlan,
  summarizeExecutionResults,
} from '@epikodelabs/testify/internals';

const catalog = {
  suites: [
    {
      id: 'suite-1',
      description: 'Fixture',
      fullName: 'Fixture',
    },
  ],
  specs: [
    {
      id: 'spec-1',
      suiteId: 'suite-1',
      description: 'works',
      fullName: 'Fixture works',
      file: 'fixture.spec.ts',
    },
  ],
};

const query =
  new CatalogQuery(catalog);

assert.equal(
  query.tests().length,
  1,
);

const plan =
  createExecutionPlan(
    catalog,
  );

assert.deepEqual(
  plan.specIds,
  ['spec-1'],
);

assert.equal(
  partitionExecutionPlan(
    plan,
    2,
  ).length,
  2,
);

const session =
  new RunnerSession(
    () => catalog,
    {
      async execute(executionPlan) {
        return summarizeExecutionResults(
          executionPlan.specIds.map(
            (id) => ({
              id,
              description: id,
              status: 'passed',
            }),
          ),
        );
      },
    },
  );

const result =
  await session.run();

assert.equal(
  result.failed,
  0,
);

assert.equal(
  result.passed,
  1,
);

assert.equal(
  session.query().tests().length,
  1,
);

assert.ok(
  typeof CatalogState === 'function',
);

assert.ok(
  typeof PlanningEngine === 'function',
);

console.log('Testify package smoke test passed.');
`,
  );

  run(
    npmCommand,
    [
      'install',
      '--no-audit',
      '--no-fund',
      tarballPath,
    ],
    {
      cwd:
        fixtureDirectory,
    },
  );

  const testifyRun =
    run(
      npxCommand,
      [
        '--no-install',
        'testify',
      ],
      {
        cwd:
          fixtureDirectory,
        capture: true,
        env: {
          NO_COLOR: '1',
          FORCE_COLOR: '0',
        },
      },
    );

  const testifyOutput =
    [
      testifyRun.stdout,
      testifyRun.stderr,
    ]
      .filter(Boolean)
      .join('\n');

  assert.match(
    testifyOutput,
    /Test Runner Started/,
    'npx testify did not preserve the v1 reporter start output.',
  );

  assert.match(
    testifyOutput,
    /Fixture suite/,
    'npx testify did not execute the fixture suite.',
  );

  assert.match(
    testifyOutput,
    /runs through npx testify/,
    'npx testify did not execute the fixture spec.',
  );

  assert.doesNotMatch(
    testifyOutput,
    /watch mode|HMR watcher|HMR-enabled/i,
    'plain npx testify unexpectedly entered watch/HMR mode.',
  );

  run(
    process.execPath,
    [
      'smoke.mjs',
    ],
    {
      cwd:
        fixtureDirectory,
    },
  );

  const packageRoot =
    path.join(
      fixtureDirectory,
      'node_modules',
      '@epikodelabs',
      'testify',
    );

  run(
    process.execPath,
    [
      path.join(
        packageRoot,
        'bin/testify',
      ),
      '--help',
    ],
    {
      cwd:
        fixtureDirectory,
    },
  );

  run(
    process.execPath,
    [
      path.join(
        packageRoot,
        'bin/jasmine',
      ),
      '--help',
    ],
    {
      cwd:
        fixtureDirectory,
    },
  );

  console.log(
    `Verified packed Testify ${packageJson.version}: ${tarballPath}`,
  );
} finally {
  fs.rmSync(
    temporaryRoot,
    {
      recursive: true,
      force: true,
    },
  );
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
        file: 'forms.spec.mjs',
      },
    ],
    specs: [
      {
        id: 'spec1',
        description: 'one',
        fullName: 'Forms one',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Forms two',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
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
        file: 'forms.spec.mjs',
      },
      {
        suiteId: 'suite1',
        id: 'spec2',
        name: 'two',
        fullName: 'Forms two',
        file: 'forms.spec.mjs',
      },
    ]);
  });

  it('lists suites', () => {
    expect(
      listCatalogSuites(catalog)[0],
    ).toEqual({
      parentSuiteId: '',
      id: 'suite1',
      name: 'Forms',
      fullName: 'Forms',
      file: 'forms.spec.mjs',
    });
  });

  it('groups files with spec counts', () => {
    expect(
      listCatalogFiles(catalog),
    ).toEqual([
      {
        file: 'forms.spec.mjs',
        specs: 2,
      },
    ]);
  });
});
````

## File: src/cli-flags.spec.ts
````typescript
import { cliDependencies, CLIHandler } from './cli-handler';
import { ConfigManager } from './config-manager';
import { ProcessLock } from './process-lock';
import { logger } from './logger';
import { EXIT_CODES } from './exit-codes';

function baseConfig(overrides: Record<string, unknown> = {}) {
  return {
    srcDirs: ['./src'],
    testDirs: ['./tests'],
    exclude: [],
    outDir: './dist/.vite-jasmine-build',
    preserveOutputs: false,
    browser: 'chrome',
    headless: false,
    coverage: false,
    port: 8888,
    ...overrides,
  } as any;
}

function stubSuccessfulRunner() {
  let capturedConfig: any;
  const fakeRunner: any = {
    start: async () => 0,
    watch: async () => 0,
    cleanup: async () => undefined,
    abort: () => 0,
  };
  spyOn(cliDependencies, 'createViteJasmineRunner').and.callFake((config: any) => {
    capturedConfig = config;
    return fakeRunner;
  });
  return { getConfig: () => capturedConfig };
}

describe('Testify CLI flags', () => {
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = process.argv;
    process.setMaxListeners(50);
    spyOn(ConfigManager, 'loadViteJasmineBrowserConfig').and.returnValue(baseConfig());
    spyOn(ProcessLock.prototype, 'acquire').and.resolveTo(undefined);
    spyOn(ProcessLock.prototype, 'releaseSync').and.stub();
    spyOn(ProcessLock.prototype, 'getPidFilePath').and.returnValue('/tmp/testify.pid');
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('prints a version string for --version and -v without starting a run', async () => {
    spyOn(logger, 'printlnRaw');
    for (const flag of ['--version', '-v']) {
      process.argv = ['node', 'testify', flag];

      const exitCode = await CLIHandler.run();

      expect(exitCode).toBe(EXIT_CODES.SUCCESS);
      expect(logger.printlnRaw).toHaveBeenCalledWith(jasmine.stringMatching(/^testify /));
      (logger.printlnRaw as jasmine.Spy).calls.reset();
    }
  });

  it('loads an alternate config file passed via --config', async () => {
    process.argv = ['node', 'testify', '--config', 'ci.testify.json'];
    stubSuccessfulRunner();

    await CLIHandler.run();

    expect(ConfigManager.loadViteJasmineBrowserConfig).toHaveBeenCalledWith('ci.testify.json');
  });

  it('returns INVALID_USAGE with a clear message when --config has no value', async () => {
    spyOn(logger, 'error');
    process.argv = ['node', 'testify', '--config'];

    const exitCode = await CLIHandler.run();

    expect(exitCode).toBe(EXIT_CODES.INVALID_USAGE);
    expect(logger.error).toHaveBeenCalledWith(jasmine.stringMatching(/--config/));
  });

  it('maps --bail to stopSpecOnExpectationFailure', async () => {
    process.argv = ['node', 'testify', '--bail'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().jasmineConfig?.env?.stopSpecOnExpectationFailure).toBe(true);
  });

  it('maps --no-random to a deterministic (non-random) run', async () => {
    process.argv = ['node', 'testify', '--no-random'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().jasmineConfig?.env?.random).toBe(false);
  });

  it('maps --timeout to the jasmine env timeout', async () => {
    process.argv = ['node', 'testify', '--timeout', '5000'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().jasmineConfig?.env?.timeout).toBe(5000);
  });

  it('rejects a non-numeric --timeout', async () => {
    spyOn(logger, 'error');
    process.argv = ['node', 'testify', '--timeout', 'soon'];

    const exitCode = await CLIHandler.run();

    expect(exitCode).toBe(EXIT_CODES.INVALID_USAGE);
  });

  it('returns INVALID_USAGE (not a generic failure) for an invalid --seed', async () => {
    spyOn(logger, 'error');
    process.argv = ['node', 'testify', '--seed', 'not-a-number'];

    const exitCode = await CLIHandler.run();

    expect(exitCode).toBe(EXIT_CODES.INVALID_USAGE);
  });

  it('returns INVALID_USAGE (not a generic failure) for an invalid --port', async () => {
    spyOn(logger, 'error');
    process.argv = ['node', 'testify', '--port', '999999'];

    const exitCode = await CLIHandler.run();

    expect(exitCode).toBe(EXIT_CODES.INVALID_USAGE);
  });

  it('accepts -w -c -b -p -q short aliases', async () => {
    process.argv = ['node', 'testify', '-w', '-b', 'node'];
    const { watch } = { watch: jasmine.createSpy('watch').and.resolveTo(0) };
    spyOn(cliDependencies, 'createViteJasmineRunner').and.returnValue({
      start: async () => 0,
      watch,
      cleanup: async () => undefined,
      abort: () => 0,
    } as any);

    // --watch + --browser node is an explicitly incompatible combination,
    // so this should be rejected rather than silently accepted.
    const exitCode = await CLIHandler.run();
    expect(exitCode).toBe(EXIT_CODES.INVALID_USAGE);
  });

  it('maps --file and -f to a file selector', async () => {
    process.argv = ['node', 'testify', '-f', 'forms.spec.ts'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().fileFilter).toBe('forms.spec.ts');
    expect(getConfig().selector).toBeUndefined();
  });

  it('maps --suite and -s to a suite selector', async () => {
    process.argv = ['node', 'testify', '-s', 'Forms validation'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().selector).toEqual({ suite: 'Forms validation' });
  });

  it('accepts file and suite values containing parentheses', async () => {
    process.argv = [
      'node',
      'testify',
      '-f',
      'forms (legacy).spec.ts',
      '-s',
      'Validation (async)',
    ];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().fileFilter).toBe('forms (legacy).spec.ts');
    expect(getConfig().selector).toEqual({ suite: 'Validation (async)' });
  });

  it('treats shell-quoted and unquoted selector values identically after argv parsing', async () => {
    // Shell quotes are not part of process.argv. Both `-f forms.spec.ts` and
    // `-f "forms.spec.ts"` arrive here as the same string value.
    process.argv = ['node', 'testify', '-f', 'forms.spec.ts', '-s', 'Validation'];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().fileFilter).toBe('forms.spec.ts');
    expect(getConfig().selector).toEqual({ suite: 'Validation' });
  });

  it('combines --file and --suite into an intersecting selector object', async () => {
    process.argv = [
      'node',
      'testify',
      '--file',
      'forms.spec.ts',
      '--suite',
      'Validation',
    ];
    const { getConfig } = stubSuccessfulRunner();

    await CLIHandler.run();

    expect(getConfig().fileFilter).toBe('forms.spec.ts');
    expect(getConfig().selector).toEqual({ suite: 'Validation' });
  });

  it('rejects --file and --suite when their values are missing', async () => {
    spyOn(logger, 'error');

    process.argv = ['node', 'testify', '--file'];
    expect(await CLIHandler.run()).toBe(EXIT_CODES.INVALID_USAGE);
    expect(logger.error).toHaveBeenCalledWith(jasmine.stringMatching(/--file/));

    (logger.error as jasmine.Spy).calls.reset();
    process.argv = ['node', 'testify', '-s'];
    expect(await CLIHandler.run()).toBe(EXIT_CODES.INVALID_USAGE);
    expect(logger.error).toHaveBeenCalledWith(jasmine.stringMatching(/--suite/));
  });

  it('rejects empty --file/-f and --suite/-s values', async () => {
    spyOn(logger, 'error');

    for (const argv of [
      ['--file', ''],
      ['-f', ''],
      ['--suite', ''],
      ['-s', ''],
      ['--file', '   '],
      ['--suite', '   '],
    ]) {
      (logger.error as jasmine.Spy).calls.reset();
      process.argv = ['node', 'testify', ...argv];

      expect(await CLIHandler.run()).toBe(EXIT_CODES.INVALID_USAGE);
      expect(logger.error).toHaveBeenCalled();
    }
  });

  it('rejects unknown flags and commands as INVALID_USAGE', async () => {
    spyOn(logger, 'error');

    process.argv = ['node', 'testify', '--watc'];
    expect(await CLIHandler.run()).toBe(EXIT_CODES.INVALID_USAGE);

    process.argv = ['node', 'testify', 'watc'];
    expect(await CLIHandler.run()).toBe(EXIT_CODES.INVALID_USAGE);
  });

});
````

## File: src/file-discovery-service.spec.ts
````typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  FileDiscoveryService,
} from './file-discovery-service';

describe('FileDiscoveryService', () => {
  function createConfig(
    root: string,
    browser: string,
  ) {
    return {
      srcDirs: [
        path.join(root, 'src'),
      ],
      testDirs: [
        path.join(root, 'tests'),
      ],
      exclude: [],
      outDir: path.join(root, 'dist'),
      browser,
      preserveOutputs: false,
    } as any;
  }

  it('skips Node-only specs in browser mode', async () => {
    const root =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-discovery-',
        ),
      );

    try {
      fs.mkdirSync(
        path.join(root, 'src'),
        { recursive: true },
      );
      fs.mkdirSync(
        path.join(root, 'tests'),
        { recursive: true },
      );

      fs.writeFileSync(
        path.join(root, 'src', 'browser.ts'),
        'export const answer = 42;\n',
      );
      fs.writeFileSync(
        path.join(root, 'src', 'node-helper.ts'),
        "import fs from 'fs';\nexport const nodeFs = fs;\n",
      );
      fs.writeFileSync(
        path.join(root, 'src', 'node-global-helper.ts'),
        'export const pid = process.pid;\n',
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'browser.spec.ts'),
        "import { answer } from '../src/browser';\nvoid answer;\n",
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'node-only.spec.ts'),
        "import fs from 'fs';\nvoid fs;\n",
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'transitive-node.spec.ts'),
        "import { nodeFs } from '../src/node-helper';\nvoid nodeFs;\n",
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'process-global.spec.ts'),
        'void process.pid;\n',
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'transitive-process.spec.ts'),
        "import { pid } from '../src/node-global-helper';\nvoid pid;\n",
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'env-marked-node.spec.ts'),
        "import { ndescribe } from '../src/env.spec';\nndescribe('node only', () => { void process.pid; });\n",
      );

      const service =
        new FileDiscoveryService(
          createConfig(
            root,
            'chrome',
          ),
        );

      const result =
        await service.discoverSources();

      expect(
        result.specFiles.map(
          (file) =>
            path.basename(file),
        ).sort(),
      ).toEqual([
        'browser.spec.ts',
        'env-marked-node.spec.ts',
      ]);

      expect(
        result.srcFiles.map(
          (file) =>
            path.basename(file),
        ).sort(),
      ).toEqual([
        'browser.ts',
      ]);
    } finally {
      fs.rmSync(
        root,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });

  it('keeps Node-only specs in Node mode', async () => {
    const root =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-discovery-',
        ),
      );

    try {
      fs.mkdirSync(
        path.join(root, 'tests'),
        { recursive: true },
      );

      fs.writeFileSync(
        path.join(root, 'tests', 'browser.spec.ts'),
        "describe('browser', () => undefined);\n",
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'node-only.spec.ts'),
        "import path from 'path';\nvoid path;\n",
      );

      const service =
        new FileDiscoveryService(
          createConfig(
            root,
            'node',
          ),
        );

      const result =
        await service.discoverSources();

      expect(
        result.specFiles.map(
          (file) =>
            path.basename(file),
        ).sort(),
      ).toEqual([
        'browser.spec.ts',
        'node-only.spec.ts',
      ]);
    } finally {
      fs.rmSync(
        root,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });

});
````

## File: src/generated-module-extension.spec.ts
````typescript
import {
  FileDiscoveryService,
} from './file-discovery-service';
import {
  ViteConfigBuilder,
} from './vite-config-builder';

describe('generated module extension', () => {
  const config = {
    srcDirs: ['./src'],
    testDirs: ['./tests'],
    outDir:
      './dist/.vite-jasmine-build',
    browser: 'node',
    jasmineConfig: {
      env: {
        random: false,
        seed: 0,
        stopSpecOnExpectationFailure:
          false,
      },
    },
  } as any;

  it('keeps Rollup entry names extensionless', () => {
    const builder =
      new ViteConfigBuilder(
        config,
      );

    const viteConfig =
      builder.createViteConfig([
        './src/example.ts',
        './tests/example.spec.ts',
      ]);

    const input =
      viteConfig
        .build
        ?.rolldownOptions
        ?.input as
          Record<string, string>;

    for (
      const name of
      Object.keys(input)
    ) {
      expect(name)
        .not.toMatch(
          /\.(?:js|mjs)$/,
        );
    }
  });

  it('lets Rollup append .mjs exactly once', () => {
    const builder =
      new ViteConfigBuilder(
        config,
      );

    const viteConfig =
      builder.createViteConfig([
        './src/example.ts',
        './tests/example.spec.ts',
      ]);

    const output =
      viteConfig
        .build
        ?.rolldownOptions
        ?.output as any;

    expect(
      output.entryFileNames,
    ).toBe(
      '[name].mjs',
    );

    expect(
      output.chunkFileNames,
    ).toBe(
      '[name].mjs',
    );
  });

  it('reports final source/spec names with one .mjs suffix', () => {
    const discovery =
      new FileDiscoveryService(
        config,
      );

    expect(
      discovery.getOutputName(
        './src/example.ts',
      ),
    ).toMatch(
      /__[\da-f]{8}\.mjs$/,
    );

    expect(
      discovery.getOutputName(
        './tests/example.spec.ts',
      ),
    ).toMatch(
      /__[\da-f]{8}\.spec\.mjs$/,
    );
  });
});
````

## File: src/hmr-file-classification.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('HMR source/test classification', () => {
  it('classifies specs by filename when srcDirs and testDirs overlap', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/hmr-manager.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      '/\\.spec\\.(?:ts|tsx|js|jsx|mts|cts|mjs)$/i',
    );

    expect(source).toContain(
      '!this.isTestFile(',
    );
  });

  it('does not classify every file in testDirs as a test', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/hmr-manager.ts',
        ),
        'utf8',
      );

    expect(source).not.toContain(
      'return normalized.startsWith(this.primaryTestDir);',
    );
  });
});
````

## File: src/hmr-test-add.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('HMR new spec contract', () => {
  it('awaits the rebuild before completing a file-add operation', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/hmr-manager.ts',
        ),
        'utf8',
      );

    expect(source.replace(/\s+/g, '')).toContain(
      "awaitthis.queueRebuild(filePath,'add',",
    );
  });

  it('keeps added specs on the spec-entry rebuild path', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/hmr-manager.ts',
        ),
        'utf8',
      );

    expect(source.replace(/\s+/g, '')).toContain(
      '.createViteConfigForFiles(validTestFiles,',
    );

    expect(source).not.toContain(
      '[...validSourceFiles, ...validTestFiles]',
    );
  });
});
````

## File: src/index.ts
````typescript
import { fileURLToPath } from 'url';
import path from 'path';
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
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  CLIHandler.run().then((code) => process.exit(code)).catch(() => process.exit(1));
}
````

## File: src/internals.ts
````typescript
/**
 * Unstable Testify implementation APIs.
 *
 * No compatibility guarantee is made for this subpath.
 */
export {
  CatalogState,
  diffTestCatalogs,
  fingerprintTestCatalog,
} from './catalog-state';

export type {
  CatalogChangeSet,
} from './catalog-state';

export {
  PlanningEngine,
} from './planning-engine';

export type {
  PlanningEngineStats,
} from './planning-engine';

export {
  createExecutionPlan,
  createFileExecutionPlan,
  createSpecExecutionPlan,
  createSuiteExecutionPlan,
  partitionExecutionPlan,
  shardExecutionPlan,
} from './execution-plan';

export {
  summarizeExecutionResults,
} from './execution-result';

export {
  CatalogQuery,
} from './catalog-query-builder';

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
  createTestCatalogIndex,
  normalizeSearchText,
  searchIndexEntries,
} from './test-catalog-index';

export type {
  SearchIndexEntry,
  TestCatalogIndex,
} from './test-catalog-index';

export {
  findCatalogSpecs,
  findCatalogSuites,
  getSpecIdsForFiles,
  resolveTestSelector,
} from './test-selection';

export {
  embedClassSource,
  embedFunctionSource,
} from './embedded-source';
````

## File: src/log-messages.cli-block.ts
````typescript
// ─── cli-handler.ts ───────────────────────────────────────────────────────────

export const CLIMessages = {
  invalidSeed: () =>
    `Invalid --seed value (expected a number).`,

  failedToInitializeProject: (error: unknown) =>
    `Failed to initialize testify config: ${error}`,

  browserArgMissing: () =>
    `--browser requires a browser name (chrome|chromium|firefox|webkit|node).`,

  projectArgMissing: () =>
    `--project requires a package name or path.`,

  portArgMissing: () =>
    `--port requires a number between 1 and 65535.`,

  invalidPort: () =>
    `Invalid --port value (expected an integer between 1 and 65535).`,

  configArgMissing: () =>
    `--config requires a path to a config file.`,

  timeoutArgMissing: () =>
    `--timeout requires a number of milliseconds.`,

  invalidTimeout: () =>
    `Invalid --timeout value (expected a positive integer, in milliseconds).`,

  fileArgMissing: () =>
    `--file / -f requires a spec filename.`,

  suiteArgMissing: () =>
    `--suite / -s requires a suite name.`,

  unknownCommand: (command: string) =>
    `Unknown command: ${command}`,

  invalidArguments: (error: unknown) =>
    `Invalid command line arguments: ${error instanceof Error ? error.message : String(error)}`,

  watchIncompatibleFlags: (flags: string[]) =>
    `The --watch flag cannot be used with: ${flags.join(', ')}`,

  couldNotResolveProject: (name: string) =>
    `Could not resolve project "${name}". It is not a directory and not a known package name.`,

  preserveOutputsEnabled: () =>
    `%info% Preserve outputs enabled (skip regenerating index.html and test-runner.mjs when present).`,

  failedToStartTestRunner: (error: unknown) =>
    `Failed to start test runner: ${error}`,

  // Help text — kept as a single block so the caller can println() each line
  helpLines: (): string[] => [
    'testify - simple test execution for real browsers and Node.js.',
    '',
    'Usage:',
    '  npx testify [options]',
    '  npx testify init               # prepare editor and debugging support',
    '',
    'Options:',
    '  --headless           Run tests in the default Playwright browser without UI',
    '  --browser, -b <name> Target browser (chrome|chromium|firefox|webkit|node)',
    '  --watch, -w          Launch browser mode + HMR for rapid feedback (cannot be headless)',
    '  --coverage, -c       Generate Istanbul coverage reports after the run',
    '  --file, -f <file>    Run specs from the matching spec filename',
    '  --suite, -s <name>   Run the matching suite (descendants included)',
    '  --seed <number>      Seed used for randomization order',
    '  --random             Force randomized spec order (overrides testify.json)',
    '  --no-random          Force sequential spec order (overrides testify.json)',
    '  --bail               Stop on the first expectation failure',
    '  --timeout <ms>       Per-spec timeout, in milliseconds',
    '  --port <number>      Override the runner port',
    '  --silent, --quiet, -q  Suppress console logs when running in Node.js mode',
    '  --preserve           Skip regenerating index.html and test-runner.mjs when outputs exist',
    '  --ansi               Use plain ASCII output (no colors, emoji, or cursor control)',
    '  --project, -p <name> Run tests only for the specified package or directory',
    '  --config <path>      Use a config file other than ./testify.json',
    '  --exclusive          Close any previously running testify instance before starting',
    '  --version, -v        Print the installed testify version',
    '  --help, -h           Show this help message',
    '',
    'Smart defaults:',
    '  Testify handles the usual setup path without much ceremony.',
    '  Use --preserve when you want to inspect generated assets by hand.',
    '',
    'Tip:',
    '  npx testify --browser node              # fastest route for non-DOM specs',
    '  npx testify --watch                     # fast feedback with HMR',
    '  npx testify --headless                  # quiet browser run for CI',
    '  npx testify -f forms.spec.ts            # run one spec file',
    '  npx testify -s "Validation"            # run one suite',
    '  npx testify --bail --seed 42            # stop on first failure, reproducible order',
    '  npx testify --config ci.testify.json    # run with an alternate config file',
    '',
    'Playwright Browsers:',
    '  npx playwright install                         # install all supported browsers',
    '  npx playwright install chromium                # install only Chromium',
  ],
};
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
          'shared.mjs',
        ),
        '',
      );

      fs.writeFileSync(
        path.join(
          dir,
          'forms.spec.mjs',
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
        'forms.spec.mjs',
        'shared.mjs',
      ]);

      expect(
        artifacts.specFiles,
      ).toEqual([
        'forms.spec.mjs',
      ]);

      expect(
        artifacts.runnerFile,
      ).toContain(
        'test-runner.mjs',
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

## File: src/node-runner-host-types.spec.ts
````typescript
import type {
  ExecutionResult,
} from './execution-result';
import type {
  TestSelector,
} from './test-selection';
import {
  NodeRunnerHost,
} from './node-runner-host';

describe('NodeRunnerHost typed surface', () => {
  it('exposes one typed run operation', () => {
    const host =
      new NodeRunnerHost(
        'test-runner.mjs',
      );

    const run:
      (
        reporter: jasmine.CustomReporter,
        selector?: TestSelector,
      ) => Promise<ExecutionResult> =
        host.run.bind(host);

    void run;
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
  it('writes, loads, and runs a generated runner module', async () => {
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
        export async function run(
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

      const result =
        await host.run(
          reporter,
          {
            suite: 'suite1',
          },
        );

      expect(result.exitCode).toBe(7);

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

## File: src/runner-session-hmr-lifecycle.spec.ts
````typescript
import {
  RunnerSession,
} from './runner-session';
import type {
  TestCatalog,
} from './test-catalog';

function createCatalog(
  specIds: string[],
): TestCatalog {
  return {
    rootSuiteId: 'root',
    suites: [
      {
        id: 'suite1',
        description: 'Example',
        fullName: 'Example',
        file: 'example.spec.mjs',
      },
    ],
    specs:
      specIds.map(
        (id) => {
          const number =
            id.replace(
              /^spec/,
              '',
            );

          return {
            id,
            description:
              `spec ${number}`,
            fullName:
              `Example spec ${number}`,
            suiteId: 'suite1',
            file:
              'example.spec.mjs',
          };
        },
      ),
  };
}

describe('RunnerSession HMR lifecycle', () => {
  it('advances catalog revision and invalidates plans when a spec is added', () => {
    let catalog =
      createCatalog([
        'spec1',
      ]);

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute(plan) {
            return plan.specIds;
          },
        },
      );

    const firstPlan =
      session.plan();

    expect(
      firstPlan.specIds,
    ).toEqual([
      'spec1',
    ]);

    expect(
      session.revision(),
    ).toBe(1);

    catalog =
      createCatalog([
        'spec1',
        'spec2',
      ]);

    expect(
      session.tests().map(
        (test) => test.id,
      ),
    ).toEqual([
      'spec1',
      'spec2',
    ]);

    expect(
      session.revision(),
    ).toBe(2);

    const secondPlan =
      session.plan();

    expect(
      secondPlan.specIds,
    ).toEqual([
      'spec1',
      'spec2',
    ]);

    expect(
      secondPlan.catalogVersion,
    ).toBe(2);
  });

  it('drops removed specs from queries and future plans', () => {
    let catalog =
      createCatalog([
        'spec1',
        'spec2',
      ]);

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute(plan) {
            return plan.specIds;
          },
        },
      );

    session.plan();

    catalog =
      createCatalog([
        'spec2',
      ]);

    expect(
      session.tests().map(
        (test) => test.id,
      ),
    ).toEqual([
      'spec2',
    ]);

    expect(
      session.tests(
        'spec 1',
      ),
    ).toEqual([]);

    const plan =
      session.plan();

    expect(
      plan.specIds,
    ).toEqual([
      'spec2',
    ]);

    expect(
      session.revision(),
    ).toBe(2);
  });

  it('replans against replacement Jasmine ids after HMR re-registration', async () => {
    let catalog =
      createCatalog([
        'spec1',
      ]);

    let executedIds:
      string[] = [];

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute(plan) {
            executedIds =
              [...plan.specIds];

            return executedIds;
          },
        },
      );

    const oldPlan =
      session.planSpec(
        'Example spec 1',
      );

    expect(
      oldPlan.specIds,
    ).toEqual([
      'spec1',
    ]);

    // HMR detaches the old Jasmine registration and imports the spec again.
    // Jasmine may assign a fresh runtime id even when authored structure is
    // unchanged, so the session must observe the new catalog and replan.
    catalog = {
      ...createCatalog([
        'spec9',
      ]),
      specs: [
        {
          id: 'spec9',
          description:
            'spec 1',
          fullName:
            'Example spec 1',
          suiteId:
            'suite1',
          file:
            'example.spec.mjs',
        },
      ],
    };

    await session.runSpec(
      'Example spec 1',
    );

    expect(
      executedIds,
    ).toEqual([
      'spec9',
    ]);

    expect(
      session.revision(),
    ).toBe(2);

    expect(
      session.changes()
        .removedSpecIds,
    ).toEqual([
      'spec1',
    ]);

    expect(
      session.changes()
        .addedSpecIds,
    ).toEqual([
      'spec9',
    ]);
  });

  it('keeps the revision stable for an equivalent catalog snapshot', () => {
    let catalog =
      createCatalog([
        'spec1',
      ]);

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute(plan) {
            return plan.specIds;
          },
        },
      );

    session.plan();

    catalog = {
      ...catalog,
      suites:
        catalog.suites.map(
          (suite) => ({
            ...suite,
          }),
        ),
      specs:
        catalog.specs.map(
          (spec) => ({
            ...spec,
          }),
        ),
    };

    session.plan();

    expect(
      session.revision(),
    ).toBe(1);

  });
});
````

## File: src/symbols.ts
````typescript
import { supportsEmoji, setAnsiMode as setAnsiModeConstant, isAnsiMode } from './ansi-constants';

// ─── TTY symbols (emojis & fancy unicode) ──────────────────
export const TTY_SYMBOLS: Record<string, string> = {
  checked: '✓',
  cross: '✕',
  warn: 'WARN',
  info: '💡',
  globe: '🌐',
  doc: '📄',
  puzzle: '🧩',
  stop: '🛑',
  bulb: '📌',
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
  failed: 'x',
  pending: '○',
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
  checked: '[OK]',
  cross: '[ERROR]',
  warn: 'WARN',
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
    .join('\n');
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
          entry.text
            .toLocaleLowerCase()
            .includes(
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

## File: docs/playground-api.md
````markdown
# Testify Playground API

> **Every value exposed by the Playground should be worth looking at.**

The Playground is a thin browser-console control surface over the Testify engine. It does not introduce a second testing model.

## Discover

```ts
session.tests(selector?)
session.suites(selector?)
session.files(selector?)
```

An omitted selector returns the current collection. A string or `RegExp` filters it. These are the only direct discovery aliases on `RunnerSession`; there are no parallel `list*` or `find*` spellings.

## Run

```ts
await session.run(selector?, options?)
await session.runSpec(selector, options?)
await session.runSuite(selector, options?)
await session.runFile(selector, options?)

await session.rerun()
await session.retry()
```

Semantics:

```text
run      = new intent → fresh plan → execute
rerun    = previous intent → fresh plan → execute
retry    = previous failures → fresh plan → execute
execute  = exact supplied plan → execute
```

## Plan

```ts
const plan = session.plan(selector?, options?)

plan.tests()
plan.filter(test => ...)
plan.slice(start, end)
plan.add(other)
plan.subtract(other)
plan.intersect(other)
plan.not()
plan.where(result, 'passed')
plan.where(result, 'failed')
plan.where(result, 'unresolved')

await session.execute(plan)
```

Outcome methods classify the current plan using an `ExecutionResult`: `passed` and `failed` select terminal outcomes; `unresolved` includes non-terminal or missing outcomes.

Plans remain serializable execution data. Interactive operations and collection identity are non-enumerable. Transformations are immutable and preserve execution options and plan identity metadata. `add`, `subtract`, and `intersect` combine plans from the same catalog revision; `not()` selects the complement within that plan's catalog snapshot.

## Session

```ts
session.state
session.stats()
session.revision()
session.changes()
session.refresh()

session.setSeed(12345)
session.resetSeed()
session.reload()
await session.exit()
```

`exit()` is the Playground lifecycle control. `RunnerSession.close()` remains the lower-level programmatic lifecycle API.

## Help

```ts
session.help()
session.help('plan')
session.help('retry')
```

`help()` returns the current Playground command registry. The optional `query` must be a string and accepts a section name (`discover`, `run`, `plan`, or `session`) or any free-text search. Matching is case-insensitive across section, usage, and description. Calling `session.help()` without a query shows the accepted query forms in DevTools. Help values remain observable even when the filtered result is empty.

## UX invariant

Playground values are ordinary JavaScript values with enough semantic identity to be useful when evaluated directly in DevTools. Testify does not require `.print()`, `.show()`, or user-written `console.table(...)` calls to make its core values understandable. Empty test, suite, file, and result collections preserve their identity as well.
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

function getRuntimeProcess(): NodeJS.Process | undefined {
  return typeof process === 'undefined' ? undefined : process;
}

export function setAnsiMode(value = true): void {
  ansiMode = value;
  const runtimeProcess = getRuntimeProcess();
  if (value && runtimeProcess) {
    runtimeProcess.env.NO_EMOJI = '1';
    runtimeProcess.env.NO_COLOR = '1';
  }
}

export function isAnsiMode(): boolean {
  return ansiMode;
}

export function supportsEmoji(): boolean {
  if (ansiMode) return false;
  const runtimeProcess = getRuntimeProcess();
  if (!runtimeProcess) return false;
  if (runtimeProcess.env.NO_EMOJI) return false;
  if (runtimeProcess.env.FORCE_EMOJI) return true;
  return runtimeProcess.stdout.isTTY ?? false;
}

export function supportsColor(): boolean {
  if (ansiMode) return false;
  const runtimeProcess = getRuntimeProcess();
  if (!runtimeProcess) return false;
  if (runtimeProcess.env.NO_COLOR) return false;
  if (runtimeProcess.env.FORCE_COLOR === '1' || runtimeProcess.env.FORCE_COLOR === 'true' || runtimeProcess.env.FORCE_COLOR) return true;
  return runtimeProcess.stdout.isTTY ?? false;
}
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
    window.__testifyHost = forwarder;
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
          'x  HMRClient not available after waiting',
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

## File: src/browser-playground-formatters.ts
````typescript
export function getBrowserPlaygroundFormattersSource(): string {
  return `
function installTestifyPlaygroundFormatters() {
  const formatters =
    Array.isArray(globalThis.devtoolsFormatters)
      ? globalThis.devtoolsFormatters
      : [];

  if (
    formatters.some(
      (formatter) =>
        formatter?.__testifyPlaygroundFormatter === true,
    )
  ) {
    return;
  }

  function text(value) {
    return value === undefined || value === null
      ? ''
      : String(value);
  }

  function shortFile(file) {
    const value = text(file).replace(/\\\\/g, '/');
    const parts = value.split('/');
    return parts[parts.length - 1] || value;
  }

  function isSession(value) {
    return Boolean(
      value &&
      typeof value === 'object' &&
      typeof value.plan === 'function' &&
      typeof value.execute === 'function' &&
      typeof value.revision === 'function' &&
      typeof value.tests === 'function',
    );
  }

  function isPlan(value) {
    return Boolean(
      value &&
      typeof value === 'object' &&
      Array.isArray(value.specIds) &&
      value.source &&
      typeof value.tests === 'function' &&
      typeof value.filter === 'function' &&
      typeof value.slice === 'function',
    );
  }

  function isExecutionResult(value) {
    return Boolean(
      value &&
      typeof value === 'object' &&
      Array.isArray(value.specResults) &&
      typeof value.total === 'number' &&
      typeof value.passed === 'number' &&
      typeof value.failed === 'number' &&
      typeof value.pending === 'number',
    );
  }

  function globalFailureCount(value) {
    return Array.isArray(value?.globalFailures)
      ? value.globalFailures.length
      : 0;
  }

  function collectionKind(value) {
    if (!Array.isArray(value)) return null;

    const explicitKind =
      value.__testifyCollectionKind;

    if (
      explicitKind === 'tests' ||
      explicitKind === 'suites' ||
      explicitKind === 'files' ||
      explicitKind === 'results' ||
      explicitKind === 'help'
    ) {
      return explicitKind;
    }

    if (!value.length) return null;

    const item = value[0];
    if (!item || typeof item !== 'object') return null;

    if (
      typeof item.status === 'string' &&
      typeof item.id === 'string'
    ) {
      return 'results';
    }

    if (
      typeof item.specs === 'number' &&
      typeof item.file === 'string'
    ) {
      return 'files';
    }

    if (
      Object.prototype.hasOwnProperty.call(
        item,
        'parentSuiteId',
      )
    ) {
      return 'suites';
    }

    if (
      typeof item.id === 'string' &&
      typeof item.fullName === 'string' &&
      (
        Object.prototype.hasOwnProperty.call(
          item,
          'suiteId',
        ) ||
        Object.prototype.hasOwnProperty.call(
          item,
          'description',
        )
      )
    ) {
      return 'tests';
    }

    return null;
  }

  function summarySpan(label, detail) {
    return [
      'span',
      {},
      [
        'span',
        {
          style:
            'font-weight:600;color:#0b7a53',
        },
        label,
      ],
      detail
        ? [
            'span',
            {
              style:
                'margin-left:8px;color:#777',
            },
            detail,
          ]
        : '',
    ];
  }

  function row(columns) {
    return [
      'div',
      {
        style:
          'display:grid;grid-template-columns:minmax(80px,1fr) minmax(180px,3fr) minmax(100px,1.3fr);gap:10px;padding:2px 0;font-family:monospace',
      },
      ...columns.map(
        (column) => [
          'span',
          {
            style:
              'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
          },
          text(column),
        ],
      ),
    ];
  }

  function testRows(tests) {
    return tests.map(
      (test) =>
        row([
          test.id,
          test.fullName || test.name || test.description,
          shortFile(test.file),
        ]),
    );
  }

  function suiteRows(suites) {
    return suites.map(
      (suite) =>
        row([
          suite.id,
          suite.fullName || suite.name,
          shortFile(suite.file),
        ]),
    );
  }

  function fileRows(files) {
    return files.map(
      (file) =>
        row([
          file.specs + ' specs',
          file.file,
          '',
        ]),
    );
  }

  function resultRows(results) {
    return results.map(
      (result) =>
        row([
          result.status,
          result.fullName || result.description,
          result.failedExpectations?.length
            ? result.failedExpectations.length + ' failures'
            : '',
        ]),
    );
  }

  function globalFailureRows(failures) {
    return failures.map(
      (failure) =>
        row([
          'error',
          failure.message || failure.globalErrorType || 'Global error',
          failure.globalErrorType || '',
        ]),
    );
  }

  function helpRows(entries) {
    const rows = [];
    let section = null;

    for (const entry of entries) {
      if (entry.section !== section) {
        section = entry.section;
        rows.push([
          'div',
          {
            style:
              'margin-top:6px;font-weight:600;color:#0b7a53',
          },
          text(section),
        ]);
      }

      rows.push(
        row([
          '',
          entry.usage,
          entry.description,
        ]),
      );
    }

    return rows;
  }

  function collectionHeader(kind, value) {
    const labels = {
      tests: 'Tests',
      suites: 'Suites',
      files: 'Files',
      results: 'Results',
      help: 'Help',
    };

    const first = value[0];
    let hint = value.length + (kind === 'help' ? ' commands' : ' items');

    if (
      kind === 'results' &&
      value.some(
        (result) => result.status === 'failed',
      )
    ) {
      const failed = value.filter(
        (result) => result.status === 'failed',
      ).length;
      hint = value.length + ' items В· ' + failed + ' failed';
    } else if (
      (kind === 'tests' || kind === 'suites') &&
      first
    ) {
      const name =
        first.fullName ||
        first.name ||
        first.description;
      if (name) {
        hint += ' В· ' + name + (value.length > 1 ? ' вЂ¦' : '');
      }
    }

    return summarySpan(
      labels[kind] || 'Collection',
      hint,
    );
  }

  const formatter = {
    __testifyPlaygroundFormatter: true,

    header(value) {
      if (isSession(value)) {
        let revision = '?';
        try {
          revision = value.revision();
        } catch {}

        return summarySpan(
          'Testify Session',
          text(value.state) + ' В· revision ' + revision,
        );
      }

      if (isPlan(value)) {
        const tests = value.tests();
        const files = new Set(
          tests
            .map((test) => test.file)
            .filter(Boolean),
        );
        const source = value.source?.kind || 'plan';

        return summarySpan(
          'Execution Plan',
          tests.length +
            ' tests В· ' +
            files.size +
            ' files В· ' +
            source +
            (value.catalogVersion !== undefined
              ? ' В· revision ' + value.catalogVersion
              : ''),
        );
      }

      if (isExecutionResult(value)) {
        const globalErrors =
          globalFailureCount(value);
        const detailParts = [
          value.passed + ' passed',
          value.failed + ' failed',
          value.pending + ' pending',
        ];

        if (globalErrors > 0) {
          detailParts.push(
            globalErrors +
              ' global error' +
              (globalErrors === 1
                ? ''
                : 's'),
          );
        }

        return summarySpan(
          'Execution Result',
          detailParts.join(
            ' В· ',
          ),
        );
      }

      const kind = collectionKind(value);
      if (kind) {
        return collectionHeader(
          kind,
          value,
        );
      }

      return null;
    },

    hasBody(value) {
      if (
        isSession(value) ||
        isPlan(value) ||
        isExecutionResult(value)
      ) {
        return true;
      }

      return Boolean(
        collectionKind(value),
      );
    },

    body(value) {
      if (isSession(value)) {
        return [
          'div',
          {},
          row([
            'state',
            value.state,
            '',
          ]),
          row([
            'revision',
            (() => {
              try {
                return value.revision();
              } catch {
                return '?';
              }
            })(),
            '',
          ]),
          row([
            'controls',
            'tests В· plan В· run В· rerun В· retry В· exit',
            '',
          ]),
        ];
      }

      if (isPlan(value)) {
        return [
          'div',
          {},
          ...testRows(
            value.tests(),
          ),
        ];
      }

      if (isExecutionResult(value)) {
        return [
          'div',
          {},
          ...resultRows(
            value.specResults,
          ),
          ...globalFailureRows(
            value.globalFailures || [],
          ),
        ];
      }

      const kind = collectionKind(value);
      if (kind === 'tests') {
        return ['div', {}, ...testRows(value)];
      }
      if (kind === 'suites') {
        return ['div', {}, ...suiteRows(value)];
      }
      if (kind === 'files') {
        return ['div', {}, ...fileRows(value)];
      }
      if (kind === 'results') {
        return ['div', {}, ...resultRows(value)];
      }
      if (kind === 'help') {
        return ['div', {}, ...helpRows(value)];
      }

      return null;
    },
  };

  formatters.push(formatter);
  globalThis.devtoolsFormatters = formatters;
}
`;
}
````

## File: src/browser-runtime-console-ux.spec.ts
````typescript
import {
  getBrowserRuntimeScript,
} from './browser-runtime';

describe('Browser runtime Playground console UX', () => {
  const source =
    getBrowserRuntimeScript({
      stopOnSpecFailure: false,
      initialSeed: 0,
      initialRandom: false,
    });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });

  it('installs the Playground runtime', () => {
    expect(source).toContain(
      'function installTestifyPlayground(',
    );

    expect(source).toContain(
      'installTestifyPlayground(',
    );
  });

  it('installs Playground value formatters', () => {
    expect(source).toContain(
      'function installTestifyPlaygroundFormatters(',
    );

    expect(source).toContain(
      'installTestifyPlaygroundFormatters();',
    );
  });

  it('keeps the browser runtime wired to the session Playground', () => {
    expect(source).toContain(
      '✅ Testify Playground ready!',
    );

    expect(source).toContain(
      'globalThis.session = session;',
    );
  });
});
````

## File: src/browser-websocket-runtime.ts
````typescript
export interface BrowserWebSocketReporterScriptOptions {
  initialSeed: number;
  initialRandom: boolean;
}

export function getBrowserWebSocketReporterScript(
  options: BrowserWebSocketReporterScriptOptions,
): string {
  const {
    initialSeed: seed,
    initialRandom: random,
  } = options;

  return `
function WebSocketEventForwarder() {
  this.ws = null;
  this.connected = false;
  this.messageQueue = [];
  this.currentSpecId = null;
  this.pendingSpecFailures = new Map();
  this.globalFailures = [];
  this.attributedFailureSignatures = new Set();
  this.errorHooksInstalled = false;

  const self = this;

  this.failureSignature = function (failure) {
    return [
      failure?.message || '',
      failure?.stack || '',
    ].join('\\n@@\\n');
  };

  this.dedupeFailures = function (failures, excludedSignatures) {
    const seen = new Set();
    const deduped = [];

    for (const failure of failures || []) {
      const signature = self.failureSignature(failure);
      if (excludedSignatures?.has(signature) || seen.has(signature)) {
        continue;
      }

      seen.add(signature);
      deduped.push(failure);
    }

    return deduped;
  };

  this.describeThrownValue = function (value) {
    if (value instanceof Error) {
      return {
        message: value.message || String(value),
        stack: value.stack || value.message || String(value),
      };
    }

    if (value && typeof value === 'object') {
      const message =
        typeof value.message === 'string'
          ? value.message
          : (() => {
              try {
                return JSON.stringify(value);
              } catch {
                return String(value);
              }
            })();

      return {
        message,
        stack:
          typeof value.stack === 'string'
            ? value.stack
            : undefined,
      };
    }

    return {
      message:
        typeof value === 'string'
          ? value
          : String(value),
      stack: undefined,
    };
  };

  this.createFailure = function (type, value) {
    const details =
      self.describeThrownValue(value);

    return {
      matcherName: '',
      passed: false,
      globalErrorType: type,
      message: details.message,
      stack: details.stack,
    };
  };

  this.recordAsyncFailure = function (type, value) {
    const failure =
      self.createFailure(type, value);
    const signature =
      self.failureSignature(failure);

    if (self.currentSpecId) {
      const pending =
        self.pendingSpecFailures.get(
          self.currentSpecId,
        ) ?? [];

      if (
        !pending.some(
          (entry) =>
            self.failureSignature(entry) === signature,
        )
      ) {
        pending.push(failure);
        self.pendingSpecFailures.set(
          self.currentSpecId,
          pending,
        );
      }

      self.attributedFailureSignatures.add(
        signature,
      );
      return;
    }

    if (
      self.globalFailures.some(
        (entry) =>
          self.failureSignature(entry) === signature,
      )
    ) {
      return;
    }

    self.globalFailures.push(failure);
  };

  this.installErrorHooks = function () {
    if (self.errorHooksInstalled) {
      return;
    }

    self.errorHooksInstalled = true;

    window.addEventListener(
      'unhandledrejection',
      (event) => {
        self.recordAsyncFailure(
          'unhandledRejection',
          event.reason,
        );
      },
    );

    window.addEventListener(
      'error',
      (event) => {
        if (event.error) {
          self.recordAsyncFailure(
            'error',
            event.error,
          );
          return;
        }

        const location =
          typeof event.filename === 'string' && event.filename
            ? event.filename + ':' + event.lineno + ':' + event.colno
            : undefined;

        self.recordAsyncFailure(
          'error',
          {
            message:
              event.message || 'Uncaught browser error',
            stack: location,
          },
        );
      },
    );
  };

  this.mergePendingSpecFailures = function (result) {
    const pending =
      self.pendingSpecFailures.get(result.id) ?? [];

    self.pendingSpecFailures.delete(
      result.id,
    );

    if (!pending.length) {
      return result;
    }

    return {
      ...result,
      status: 'failed',
      failedExpectations:
        self.dedupeFailures([
          ...(Array.isArray(result.failedExpectations)
            ? result.failedExpectations
            : []),
          ...pending,
        ]),
    };
  };

  this.collectRunLevelFailures = function (result) {
    return self.dedupeFailures(
      [
        ...(
          Array.isArray(result?.failedExpectations)
            ? result.failedExpectations
            : []
        ),
        ...self.globalFailures,
      ],
      self.attributedFailureSignatures,
    );
  };

  this.installErrorHooks();

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
    self.currentSpecId = null;
    self.pendingSpecFailures.clear();
    self.globalFailures = [];
    self.attributedFailureSignatures.clear();

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
    self.currentSpecId = spec.id;

    self.send({
      type: 'specStarted',
      id: spec.id,
      description: spec.description,
      fullName: spec.fullName,
      timestamp: Date.now()
    });
  };

  this.specDone = function (result) {
    const mergedResult =
      self.mergePendingSpecFailures(result);

    if (self.currentSpecId === result.id) {
      self.currentSpecId = null;
    }

    self.send({
      type: 'specDone',
      ...mergedResult,
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
    self.currentSpecId = null;

    const coverage = globalThis.__coverage__;
    self.send({
      type: 'jasmineDone',
      ...result,
      failedExpectations:
        self.collectRunLevelFailures(result),
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

## File: src/catalog-state.ts
````typescript
import {
  embedClassSource,
  embedFunctionSource,
} from './embedded-source';
import type {
  TestCatalog,
} from './test-catalog';
import {
  createTestCatalogIndex,
  type TestCatalogIndex,
} from './test-catalog-index';

export interface CatalogChangeSet {
  version: number;
  changed: boolean;
  addedSpecIds: string[];
  removedSpecIds: string[];
  addedSuiteIds: string[];
  removedSuiteIds: string[];
  addedFiles: string[];
  removedFiles: string[];
}

export function fingerprintTestCatalog(
  catalog: TestCatalog,
): string {
  const suites =
    catalog.suites.map(
      (suite) => [
        suite.id,
        suite.parentSuiteId ?? '',
        suite.description,
        suite.fullName,
        suite.file ?? '',
      ].join('\u001f'),
    );

  const specs =
    catalog.specs.map(
      (spec) => [
        spec.id,
        spec.suiteId ?? '',
        spec.description,
        spec.fullName,
        spec.file ?? '',
      ].join('\u001f'),
    );

  return [
    catalog.rootSuiteId ?? '',
    suites.join('\u001e'),
    specs.join('\u001e'),
  ].join('\u001d');
}

export function diffTestCatalogs(
  previous: TestCatalog | null,
  current: TestCatalog,
  version: number,
): CatalogChangeSet {
  if (!previous) {
    return {
      version,
      changed: true,
      addedSpecIds:
        current.specs.map(
          (spec) => spec.id,
        ),
      removedSpecIds: [],
      addedSuiteIds:
        current.suites.map(
          (suite) => suite.id,
        ),
      removedSuiteIds: [],
      addedFiles:
        collectCatalogFiles(
          current,
        ),
      removedFiles: [],
    };
  }

  const previousSpecIds =
    new Set(
      previous.specs.map(
        (spec) => spec.id,
      ),
    );

  const currentSpecIds =
    new Set(
      current.specs.map(
        (spec) => spec.id,
      ),
    );

  const previousSuiteIds =
    new Set(
      previous.suites.map(
        (suite) => suite.id,
      ),
    );

  const currentSuiteIds =
    new Set(
      current.suites.map(
        (suite) => suite.id,
      ),
    );

  const previousFiles =
    new Set(
      collectCatalogFiles(
        previous,
      ),
    );

  const currentFiles =
    new Set(
      collectCatalogFiles(
        current,
      ),
    );

  return {
    version,
    changed: true,
    addedSpecIds:
      setDifference(
        currentSpecIds,
        previousSpecIds,
      ),
    removedSpecIds:
      setDifference(
        previousSpecIds,
        currentSpecIds,
      ),
    addedSuiteIds:
      setDifference(
        currentSuiteIds,
        previousSuiteIds,
      ),
    removedSuiteIds:
      setDifference(
        previousSuiteIds,
        currentSuiteIds,
      ),
    addedFiles:
      setDifference(
        currentFiles,
        previousFiles,
      ),
    removedFiles:
      setDifference(
        previousFiles,
        currentFiles,
      ),
  };
}

function collectCatalogFiles(
  catalog: TestCatalog,
): string[] {
  return [
    ...new Set(
      [
        ...catalog.suites.map(
          (suite) => suite.file,
        ),
        ...catalog.specs.map(
          (spec) => spec.file,
        ),
      ].filter(
        (
          file,
        ): file is string =>
          !!file,
      ),
    ),
  ].sort();
}

function setDifference(
  left: Set<string>,
  right: Set<string>,
): string[] {
  return [...left].filter(
    (value) =>
      !right.has(value),
  );
}

export class CatalogState {
  private catalogValue:
    TestCatalog;

  private indexValue:
    TestCatalogIndex;

  private fingerprintValue:
    string;

  private versionValue = 1;

  private changesValue:
    CatalogChangeSet;

  constructor(
    catalog: TestCatalog,
  ) {
    this.catalogValue =
      catalog;

    this.indexValue =
      createTestCatalogIndex(
        catalog,
      );

    this.fingerprintValue =
      fingerprintTestCatalog(
        catalog,
      );

    this.changesValue =
      diffTestCatalogs(
        null,
        catalog,
        this.versionValue,
      );
  }

  get catalog(): TestCatalog {
    return this.catalogValue;
  }

  get index(): TestCatalogIndex {
    return this.indexValue;
  }

  get version(): number {
    return this.versionValue;
  }

  get fingerprint(): string {
    return this.fingerprintValue;
  }

  get changes():
    CatalogChangeSet {
    return this.changesValue;
  }

  update(
    catalog: TestCatalog,
  ): CatalogChangeSet {
    const fingerprint =
      fingerprintTestCatalog(
        catalog,
      );

    if (
      fingerprint ===
      this.fingerprintValue
    ) {
      this.catalogValue =
        catalog;

      // An equivalent snapshot is not a new catalog revision. Return a
      // transient no-change result to the caller, but preserve changesValue
      // as the last structural change observed by this state. Otherwise any
      // read that synchronizes again (revision(), tests(), ...)
      // would erase the change information before changes() can inspect it.
      return {
        version:
          this.versionValue,
        changed: false,
        addedSpecIds: [],
        removedSpecIds: [],
        addedSuiteIds: [],
        removedSuiteIds: [],
        addedFiles: [],
        removedFiles: [],
      };
    }

    const previous =
      this.catalogValue;

    this.versionValue++;

    this.catalogValue =
      catalog;

    this.indexValue =
      createTestCatalogIndex(
        catalog,
      );

    this.fingerprintValue =
      fingerprint;

    this.changesValue =
      diffTestCatalogs(
        previous,
        catalog,
        this.versionValue,
      );

    return this.changesValue;
  }
}

export function getEmbeddedCatalogStateSource():
  string {
  return [
    embedFunctionSource(
      collectCatalogFiles,
    ),
    embedFunctionSource(
      setDifference,
    ),
    embedFunctionSource(
      fingerprintTestCatalog,
    ),
    embedFunctionSource(
      diffTestCatalogs,
    ),
    embedClassSource(
      'CatalogState',
      CatalogState,
    ),
  ].join('\n\n');
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
  type:
    | 'update'
    | 'full-reload'
    | 'test-update'
    | 'test-remove';
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
   * Determines if a file is a test file.
   *
   * Test and source directories may intentionally overlap (for example both
   * may be "./src"), so directory membership alone cannot classify a file.
   */
  private isTestFile(filePath: string): boolean {
    const normalized =
      norm(filePath);

    if (
      !normalized.startsWith(
        this.primaryTestDir,
      )
    ) {
      return false;
    }

    return /\.spec\.(?:ts|tsx|js|jsx|mts|cts|mjs)$/i
      .test(normalized);
  }

  /**
   * Determines if a file is a source file.
   *
   * Specs are never sources, even when testDirs and srcDirs point at the
   * same directory.
   */
  private isSourceFile(filePath: string): boolean {
    const normalized =
      norm(filePath);

    return (
      normalized.startsWith(
        this.primarySrcDir,
      ) &&
      !this.isTestFile(
        normalized,
      )
    );
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
      logger.error(HmrMessages.cannotExtractDependencies(filePath, (error as Error).message));
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
        
        await this.queueRebuild(
          filePath,
          'add',
        );
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
    
      const removedTest =
        this.isTestFile(filePath);

      this.emit('hmr:update', {
        type:
          removedTest
            ? 'test-remove'
            : strategy.type,
        path:
          this.fileDiscovery
            .getOutputName(filePath),
        timestamp:
          Date.now(),
        affectedTests:
          this.isSourceFile(filePath)
            ? Array.from(
                affectedFiles,
              ).filter(
                (file) =>
                  this.isTestFile(file),
              )
            : undefined,
        reason:
          removedTest
            ? 'Test file removed'
            : strategy.reason,
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

        // Specs are the only build entries. Source files participate only in
        // dependency analysis and determine which specs are affected.
        const validSourceFiles =
          rebuiltFiles.filter(
            (file) =>
              this.isSourceFile(file) &&
              fs.existsSync(file),
          );

        const validTestFiles =
          rebuiltFiles.filter(
            (file) =>
              this.isTestFile(file) &&
              fs.existsSync(file),
          );

        logger.println(
          HmrMessages.rebuildSummary(
            directChangedFiles.length,
            rebuiltFiles.length,
            validSourceFiles.length,
            validTestFiles.length,
          ),
        );

        // A source change with no dependent spec does not require a browser
        // build. The source will be pulled transitively the next time a spec
        // that imports it is rebuilt.
        if (validTestFiles.length === 0) {
          logger.println(
            HmrMessages.noValidSourceOrTestFiles(),
          );
          continue;
        }

        await this.buildDependencyGraph(
          rebuiltFiles,
        );

        const viteConfig =
          this.viteConfigBuilder
            .createViteConfigForFiles(
              validTestFiles,
              this.viteCache,
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
            // Retry with the remaining spec entries only.
            const finalTestFiles =
              validTestFiles.filter(
                fs.existsSync,
              );

            if (
              finalTestFiles.length === 0
            ) {
              logger.println(
                HmrMessages
                  .allEntryPointsDeleted(),
              );
              continue;
            }

            const retryConfig =
              this.viteConfigBuilder
                .createViteConfigForFiles(
                  finalTestFiles,
                  this.viteCache,
                );
            const result = await build(retryConfig);
            this.viteCache = result;
          } else {
            throw buildError;
          }
        }

        // Only spec entries have stable output names. Source modules are
        // dependency chunks and must never be addressed as HMR entries.
        for (
          const file of
          validTestFiles
        ) {
          const relative =
            this.fileDiscovery
              .getOutputName(file);

          const outputPath =
            path.join(
              this.config.outDir,
              relative,
            );

          if (
            fs.existsSync(
              outputPath,
            )
          ) {
            const content =
              fs.readFileSync(
                outputPath,
                'utf-8',
              );

            const strategy =
              this.determineUpdateStrategy(
                directChangedFiles,
                'change',
              );

            const affectedTests =
              directChangedFiles
                .filter(
                  (changedFile) =>
                    this.isSourceFile(
                      changedFile,
                    ),
                )
                .flatMap(
                  (changedFile) =>
                    this.getAffectedTests(
                      changedFile,
                    ),
                );

            this.emit(
              'hmr:update',
              {
                type: strategy.type,
                path: relative,
                timestamp:
                  Date.now(),
                content,
                affectedTests:
                  affectedTests.length > 0
                    ? affectedTests
                    : undefined,
                reason:
                  strategy.reason,
              },
            );
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
import {
  getEmbeddedTestMetadataSource,
} from './test-metadata-runtime';

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
    getEmbeddedTestMetadataSource(),
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
        icon: 'x',
        text: (projectName: string) => `%error% Project "${projectName}" not found in tsconfig.json or workspace definitions.`,
    },
    invalidExitCode: {
        type: 'warning',
        icon: '🚨',
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
        icon: '🚨',
        text: (pid: number, error: string) => `%error% BrowserManager: Failed to terminate process ${pid}. Reason: ${error}`,
    },
    headlessModeImplied: {
        type: 'info',
        icon: '💡',
        text: () => '[info] Using --browser node implies --headless. Running in headless mode.',
    },

    // =================================================================
    // Test Runner (NodeTestRunner)
    // =================================================================
    
    noJsFilesForRunner: {
        type: 'warning',
        icon: '🚨',
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
    testProcessAlreadyRunning: {
        type: 'warning',
        icon: '🚨',
        text: () => '%error% Test process already running.',
    },
    testExecutionError: {
        type: 'error',
        icon: 'x',
        text: (message: string) => `%error% Test execution error: ${message}`,
    },
    failedToRunTests: {
        type: 'error',
        icon: 'x',
        text: (error: string) => `%error% Failed to run tests: ${error}`,
    },
    errorDuringExecution: {
        type: 'error',
        icon: 'x',
        text: (error: string) => `%error% Error during test execution: ${error}`,
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
        icon: 'x',
        text: (error: string) => `%error% Unhandled Rejection: ${error}`,
    },
    uncaughtException: {
        type: 'error',
        icon: 'x',
        text: (error: string) => `%error% Uncaught Exception: ${error}`,
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

## File: src/node-execution-adapter.ts
````typescript
import type { ExecutionPlan } from './execution-plan';
import {
  summarizeExecutionResults,
  type ExecutionResult,
  type ExecutionGlobalFailure,
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
      jasmineDone?(
        result?: {
          failedExpectations?: ExecutionGlobalFailure[];
        },
      ): void;
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
  let globalFailures:
    ExecutionGlobalFailure[] =
      [];

  env.addReporter?.({
    jasmineStarted() {
      specResults.length = 0;
      globalFailures = [];
    },

    specDone(result) {
      if (specIdSet.has(result.id)) {
        specResults.push(result);
      }
    },

    jasmineDone(result) {
      globalFailures =
        Array.isArray(
          result?.failedExpectations,
        )
          ? [...result.failedExpectations]
          : [];
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
      globalFailures,
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

## File: src/node-execution-environment-host.spec.ts
````typescript
import {
  NodeExecutionEnvironmentHost,
} from './node-execution-environment-host';

describe('NodeExecutionEnvironmentHost', () => {
  it('applies and restores environment values', async () => {
    const originalNodeEnv =
      process.env.NODE_ENV;

    const originalValue =
      process.env
        .TESTIFY_STEP29_VALUE;

    const host =
      new NodeExecutionEnvironmentHost({
        env: {
          TESTIFY_STEP29_VALUE:
            'inside',
        },
        nodeEnv: 'test',
      });

    try {
      await host.run(
        async () => {
          expect(
            process.env.NODE_ENV,
          ).toBe('test');

          expect(
            process.env
              .TESTIFY_STEP29_VALUE,
          ).toBe('inside');
        },
      );

      expect(
        process.env.NODE_ENV,
      ).toBe(
        originalNodeEnv,
      );

      expect(
        process.env
          .TESTIFY_STEP29_VALUE,
      ).toBe(
        originalValue,
      );
    } finally {
      if (
        originalNodeEnv ===
        undefined
      ) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV =
          originalNodeEnv;
      }

      if (
        originalValue ===
        undefined
      ) {
        delete process.env
          .TESTIFY_STEP29_VALUE;
      } else {
        process.env
          .TESTIFY_STEP29_VALUE =
          originalValue;
      }
    }
  });

  it('restores environment even when work fails', async () => {
    const original =
      process.env
        .TESTIFY_STEP29_FAILURE;

    const host =
      new NodeExecutionEnvironmentHost({
        env: {
          TESTIFY_STEP29_FAILURE:
            'inside',
        },
      });

    try {
      await expectAsync(
        host.run(
          async () => {
            throw new Error(
              'expected',
            );
          },
        ),
      ).toBeRejected();

      expect(
        process.env
          .TESTIFY_STEP29_FAILURE,
      ).toBe(original);
    } finally {
      if (original === undefined) {
        delete process.env
          .TESTIFY_STEP29_FAILURE;
      } else {
        process.env
          .TESTIFY_STEP29_FAILURE =
          original;
      }
    }
  });

  it('suppresses and restores console methods', async () => {
    const originalLog =
      console.log;

    let calls = 0;

    console.log =
      (() => {
        calls++;
      }) as typeof console.log;

    const installedLog =
      console.log;

    const host =
      new NodeExecutionEnvironmentHost({
        suppressConsoleLogs: true,
      });

    try {
      await host.run(
        async () => {
          console.log(
            'hidden',
          );

          expect(calls).toBe(0);
        },
      );

      expect(
        console.log,
      ).toBe(installedLog);

      console.log(
        'visible',
      );

      expect(calls).toBe(1);
    } finally {
      console.log =
        originalLog;
    }
  });
});
````

## File: src/node-execution-environment-host.ts
````typescript
export interface NodeExecutionEnvironmentHostOptions {
  env?: NodeJS.ProcessEnv;
  nodeEnv?: string;
  suppressConsoleLogs?: boolean;
}

type ConsoleMethod =
  | 'log'
  | 'info'
  | 'debug'
  | 'trace'
  | 'warn'
  | 'table';

const SILENT_CONSOLE_METHODS:
  readonly ConsoleMethod[] = [
    'log',
    'info',
    'debug',
    'trace',
    'warn',
    'table',
  ];

export class NodeExecutionEnvironmentHost {
  constructor(
    private readonly options:
      NodeExecutionEnvironmentHostOptions = {},
  ) {}

  async run<T>(
    work: () => Promise<T>,
  ): Promise<T> {
    const envSnapshot =
      this.captureEnvironment();

    const consoleSnapshot =
      this.captureConsole();

    const logSuppressionSnapshot =
      (globalThis as any)
        .__testifySuppressLogs;

    try {
      this.applyEnvironment();

      if (
        this.options
          .suppressConsoleLogs
      ) {
        this.suppressConsole();
        (globalThis as any)
          .__testifySuppressLogs = true;
      }

      return await work();
    } finally {
      this.restoreConsole(
        consoleSnapshot,
      );

      (globalThis as any)
        .__testifySuppressLogs =
        logSuppressionSnapshot;

      this.restoreEnvironment(
        envSnapshot,
      );
    }
  }

  private captureEnvironment():
    Map<
      string,
      string | undefined
    > {
    const keys =
      new Set<string>([
        ...Object.keys(
          this.options.env ?? {},
        ),
        'NODE_ENV',
      ]);

    return new Map(
      [...keys].map(
        (key) => [
          key,
          process.env[key],
        ],
      ),
    );
  }

  private applyEnvironment(): void {
    for (
      const [key, value] of
      Object.entries(
        this.options.env ?? {},
      )
    ) {
      if (value == null) {
        delete process.env[key];
      } else {
        process.env[key] =
          value;
      }
    }

    if (
      this.options.nodeEnv !==
      undefined
    ) {
      process.env.NODE_ENV =
        this.options.nodeEnv;
    }
  }

  private restoreEnvironment(
    snapshot: Map<
      string,
      string | undefined
    >,
  ): void {
    for (
      const [key, value] of
      snapshot
    ) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] =
          value;
      }
    }
  }

  private captureConsole():
    Map<
      ConsoleMethod,
      (...args: any[]) => any
    > {
    return new Map(
      SILENT_CONSOLE_METHODS.map(
        (method) => [
          method,
          console[method],
        ],
      ),
    );
  }

  private suppressConsole(): void {
    for (
      const method of
      SILENT_CONSOLE_METHODS
    ) {
      console[method] =
        (() => {}) as
          typeof console[
            typeof method
          ];
    }
  }

  private restoreConsole(
    snapshot: Map<
      ConsoleMethod,
      (...args: any[]) => any
    >,
  ): void {
    for (
      const [method, value] of
      snapshot
    ) {
      console[method] =
        value as
          typeof console[
            typeof method
          ];
    }
  }
}
````

## File: src/node-process-host.spec.ts
````typescript
import {
  NodeProcessHost,
} from './node-process-host';

describe('NodeProcessHost', () => {
  it('attaches and detaches only its own handlers', () => {
    const beforeSigint =
      process.listenerCount(
        'SIGINT',
      );

    const beforeRejection =
      process.listenerCount(
        'unhandledRejection',
      );

    const host =
      new NodeProcessHost();

    host.attach();

    expect(
      process.listenerCount(
        'SIGINT',
      ),
    ).toBe(
      beforeSigint + 1,
    );

    expect(
      process.listenerCount(
        'unhandledRejection',
      ),
    ).toBe(
      beforeRejection + 1,
    );

    host.detach();

    expect(
      process.listenerCount(
        'SIGINT',
      ),
    ).toBe(
      beforeSigint,
    );

    expect(
      process.listenerCount(
        'unhandledRejection',
      ),
    ).toBe(
      beforeRejection,
    );
  });

  it('is idempotent', () => {
    const before =
      process.listenerCount(
        'SIGTERM',
      );

    const host =
      new NodeProcessHost();

    host.attach();
    host.attach();

    expect(
      process.listenerCount(
        'SIGTERM',
      ),
    ).toBe(
      before + 1,
    );

    host.detach();
    host.detach();

    expect(
      process.listenerCount(
        'SIGTERM',
      ),
    ).toBe(
      before,
    );
  });
});
````

## File: src/package-surface.spec.ts
````typescript
import * as testify from './lib';
import * as internals from './internals';

describe('Testify 2 package surface', () => {
  it('keeps the stable root focused on Session/Plan/Result contracts', () => {
    const rootSurface =
      testify as Record<
        string,
        unknown
      >;

    expect(
      testify.RunnerSession,
    ).toBeDefined();

    for (const internalName of [
      'createExecutionPlan',
      'summarizeExecutionResults',
      'CatalogQuery',
      'createTestCatalogIndex',
      'listCatalogTests',
      'findCatalogSpecs',
      'PlanningEngine',
      'CatalogState',
    ]) {
      expect(
        Object.keys(rootSurface),
      ).not.toContain(
        internalName,
      );

      expect(
        rootSurface[internalName],
      ).toBeUndefined();
    }
  });

  it('keeps construction/query/planning helpers opt-in through internals', () => {
    expect(
      internals.createExecutionPlan,
    ).toBeDefined();

    expect(
      internals.summarizeExecutionResults,
    ).toBeDefined();

    expect(
      internals.CatalogQuery,
    ).toBeDefined();

    expect(
      internals.createTestCatalogIndex,
    ).toBeDefined();

    expect(
      internals.PlanningEngine,
    ).toBeDefined();

    expect(
      internals.CatalogState,
    ).toBeDefined();
  });
});
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
      _filePath: 'forms.spec.mjs',
      children: [spec],
      getFullName: () => 'Forms',
    };

    setTestifyFile(spec, 'forms.spec.mjs');
    setTestifyFile(suite, 'forms.spec.mjs');

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
      'forms.spec.mjs',
    );
    expect(catalog.specs[0]!.file).toBe(
      'forms.spec.mjs',
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
      const file =
        getItemFile(
          suite,
        );

      suites.push({
        id: suite.id,
        description:
          getItemDescription(
            suite,
          ),
        fullName:
          getItemFullName(
            suite,
          ),
        parentSuiteId,
        ...(file
          ? { file }
          : {}),
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
        const file =
          getItemFile(
            child,
          ) ??
          getItemFile(
            suite,
          );

        specs.push({
          id: child.id,
          description:
            getItemDescription(
              child,
            ),
          fullName:
            getItemFullName(
              child,
            ),
          suiteId:
            owningSuiteId,
          ...(file
            ? { file }
            : {}),
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

## File: src/test-metadata-runtime.ts
````typescript
export function getEmbeddedTestMetadataSource(): string {
  return `
const __testifyMetadataByItem = new WeakMap();
const __testifyRegistrationScopes = [];

function normalizeTestifyFilePath(file) {
  return String(file)
    .replace(/\\\\/g, '/')
    .replace(/\\/+/g, '/')
    .replace(/^\\/+/, '');
}

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
  setTestifyMetadata(item, {
    file: normalizeTestifyFilePath(file),
  });
}

function getTestifyFile(item) {
  return getTestifyMetadata(item)?.file;
}

function beginTestifyRegistrationScope(file) {
  __testifyRegistrationScopes.push(
    normalizeTestifyFilePath(file),
  );
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

## File: src/test-metadata.ts
````typescript
export interface TestifyItemMetadata {
  file?: string;
}

const metadataByItem =
  new WeakMap<object, TestifyItemMetadata>();

export function normalizeTestifyFilePath(
  file: string,
): string {
  return String(file)
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^\/+/, '');
}

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
    {
      file:
        normalizeTestifyFilePath(
          file,
        ),
    },
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
  registrationScopes.push(
    normalizeTestifyFilePath(
      file,
    ),
  );
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
    modulePreload: false,
    outDir: 'dist/testify/',
    emptyOutDir: false,
    minify: false,
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: path.resolve(configDirectory, './src/cli-entry.ts'),
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

## File: docs/session-contract.md
````markdown
# RunnerSession contract

> **Session creates and executes work. Plan shapes work. Result describes what happened.**

`RunnerSession` is Testify's stable execution boundary. It owns catalog synchronization, discovery, planning, execution, and lifecycle. It does not expose planner/index/query implementation objects directly.

## 1. Session surface

```ts
session.state

session.tests(selector?)
session.suites(selector?)
session.files(selector?)
session.stats()

session.plan(selector?, options?)
session.planSpec(selector, options?)
session.planSuite(selector, options?)
session.planFile(selector, options?)

session.shard(plan, index, count)
session.partition(plan, count)

await session.execute(plan)
await session.run(selector?, options?)
await session.runSpec(selector, options?)
await session.runSuite(selector, options?)
await session.runFile(selector, options?)

session.revision()
session.changes()
session.refresh()

await session.close()
```

There are deliberately no parallel `list*` / `find*` / `query()` spellings on Session.

## 2. Discovery

```ts
session.tests()
session.tests(/snapshot/)

session.suites()
session.suites('Membrane')

session.files()
session.files(/lazy/)
```

Discovery always reflects the current catalog. Session owns synchronization before discovery.

## 3. Planning

`plan()` resolves intent into exact work:

```ts
const plan = session.plan({
  suite: 'Membrane',
});
```

Plans carry their catalog revision and execution options. A plan remains exact work; Session never silently re-plans a supplied plan. Plans can also derive outcome-specific subsets with `passed(result)`, `failed(result)`, and `unresolved(result)` without changing the Result contract.

Interactive plans can be shaped immutably:

```ts
const focused = session
  .plan()
  .filter(test => /snapshot/i.test(test.fullName))
  .slice(0, 10);
```

## 4. Execution

Two verbs have intentionally different meanings:

```text
run(intent)     resolve current intent → fresh plan → execute
execute(plan)   execute this exact plan
```

Convenience forms are owned by the same Session:

```ts
await session.runSpec('works')
await session.runSuite('Membrane')
await session.runFile(/lazy/)
```

## 5. Catalog lifecycle

```ts
session.revision()
session.changes()
session.refresh()
```

`refresh()` makes synchronization explicit and observable:

```ts
{
  changed,
  previousRevision,
  revision,
  changes,
}
```

Normal Session operations may synchronize lazily for ergonomics.

A historical plan remains executable after unrelated catalog growth. Execution rejects it only when one or more selected spec IDs no longer exist.

## 6. Lifecycle

```ts
session.state
// 'ready' | 'closing' | 'closed'

await session.close()
```

`close()` is idempotent and belongs to the reusable Session contract.

The browser Playground adds `session.exit()` as a host-level convenience for terminating the live Testify environment. `exit()` is not a replacement for `RunnerSession.close()` in embedded/programmatic usage.

## 7. Ownership boundary

`RunnerSession` does not expose:

```text
CatalogQuery
TestCatalogIndex
PlanningEngine
planner cache controls
raw catalog access
```

Those are implementation/building-block concerns available through `@epikodelabs/testify/internals` when needed.

The stable model is:

```text
Catalog
  ↓
Session
  ↓
Plan
  ↓
Execution
  ↓
Result
```

Hosts and transports do not create alternative versions of these concepts.
````

## File: src/browser-playground-formatters.spec.ts
````typescript
import {
  getBrowserPlaygroundFormattersSource,
} from './browser-playground-formatters';

describe('Testify Playground DevTools formatters', () => {
  function installFormatter(): any {
    const previous =
      (globalThis as any).devtoolsFormatters;

    (globalThis as any).devtoolsFormatters = [];

    const source =
      getBrowserPlaygroundFormattersSource();

    const install = new Function(
      source +
        '\nreturn installTestifyPlaygroundFormatters;',
    )();

    install();

    const formatter =
      (globalThis as any)
        .devtoolsFormatters[0];

    (globalThis as any).devtoolsFormatters =
      previous;

    return formatter;
  }

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () =>
        new Function(
          getBrowserPlaygroundFormattersSource(),
        ),
    ).not.toThrow();
  });

  it('formats a planned execution without changing its data shape', () => {
    const formatter =
      installFormatter();

    const tests = Object.freeze([
      Object.freeze({
        id: 'spec-1',
        description: 'restores snapshot',
        fullName:
          'Membrane restores snapshot',
        suiteId: 'suite-1',
        file: 'src/lazy.spec.mjs',
      }),
    ]);

    const plan: any = {
      specIds: ['spec-1'],
      random: false,
      catalogVersion: 7,
      source: {
        kind: 'suite',
      },
    };

    Object.defineProperties(plan, {
      tests: {
        enumerable: false,
        value: () => tests,
      },
      filter: {
        enumerable: false,
        value: () => plan,
      },
      slice: {
        enumerable: false,
        value: () => plan,
      },
    });

    const header =
      formatter.header(plan);

    expect(
      JSON.stringify(header),
    ).toContain(
      'Execution Plan',
    );

    expect(
      JSON.stringify(header),
    ).toContain(
      '1 tests',
    );

    expect(
      JSON.stringify(
        formatter.body(plan),
      ),
    ).toContain(
      'Membrane restores snapshot',
    );

    expect(
      JSON.stringify(plan),
    ).toBe(
      '{"specIds":["spec-1"],"random":false,"catalogVersion":7,"source":{"kind":"suite"}}',
    );
  });

  it('formats test, suite, file, and result collections by identity', () => {
    const formatter =
      installFormatter();

    const tests = [{
      suiteId: 'suite-1',
      id: 'spec-1',
      name: 'works',
      fullName: 'Forms works',
      file: 'forms.spec.mjs',
    }];

    const suites = [{
      parentSuiteId: '',
      id: 'suite-1',
      name: 'Forms',
      fullName: 'Forms',
      file: 'forms.spec.mjs',
    }];

    const files = [{
      file: 'forms.spec.mjs',
      specs: 3,
    }];

    const results = [{
      id: 'spec-1',
      description: 'works',
      fullName: 'Forms works',
      status: 'failed',
      failedExpectations: [{}],
    }];

    expect(
      JSON.stringify(
        formatter.header(tests),
      ),
    ).toContain('Tests');

    expect(
      JSON.stringify(
        formatter.header(suites),
      ),
    ).toContain('Suites');

    expect(
      JSON.stringify(
        formatter.header(files),
      ),
    ).toContain('Files');

    expect(
      JSON.stringify(
        formatter.header(results),
      ),
    ).toContain('Results');

    expect(
      JSON.stringify(
        formatter.body(results),
      ),
    ).toContain('Forms works');
  });

  it('formats explicitly identified empty collections', () => {
    const formatter =
      installFormatter();

    const tests: any[] = [];
    Object.defineProperty(
      tests,
      '__testifyCollectionKind',
      { value: 'tests' },
    );

    expect(
      JSON.stringify(
        formatter.header(tests),
      ),
    ).toContain('Tests');

    expect(
      formatter.hasBody(tests),
    ).toBeTrue();
  });

  it('formats execution results and help values', () => {
    const formatter =
      installFormatter();

    const result = {
      specResults: [{
        id: 'spec-1',
        description: 'works',
        fullName: 'Forms works',
        status: 'passed',
      }],
      total: 1,
      passed: 1,
      failed: 0,
      pending: 0,
      globalFailures: [{
        message:
          'Unhandled promise rejection: Error: authorization service unavailable',
        globalErrorType:
          'unhandledRejection',
      }],
    };

    const help: any[] = [{
      section: 'Plan',
      usage: "plan.where(result, 'failed')",
      description: 'Keep tests that failed',
    }];
    Object.defineProperty(
      help,
      '__testifyCollectionKind',
      { value: 'help' },
    );

    expect(
      JSON.stringify(
        formatter.header(result),
      ),
    ).toContain(
      'Execution Result',
    );

    expect(
      JSON.stringify(
        formatter.header(result),
      ),
    ).toContain(
      '1 global error',
    );

    expect(
      JSON.stringify(
        formatter.body(result),
      ),
    ).toContain(
      'authorization service unavailable',
    );

    expect(
      JSON.stringify(
        formatter.header(help),
      ),
    ).toContain('Help');

    expect(
      JSON.stringify(
        formatter.body(help),
      ),
    ).toContain(
      "plan.where(result, 'failed')",
    );
  });
});
````

## File: src/browser-runtime.spec.ts
````typescript
import {
  getBrowserRuntimeScript,
} from './browser-runtime';

describe('Browser runtime', () => {
  const source =
    getBrowserRuntimeScript({
      stopOnSpecFailure: false,
      initialSeed: 0,
      initialRandom: false,
    });

  it('wires the reusable session into the Playground installer', () => {
    expect(source).toContain(
      'new RunnerSession(',
    );

    expect(source).toContain(
      'installTestifyPlaygroundFormatters();',
    );

    expect(source).toContain(
      'installTestifyPlayground(',
    );
  });

  it('does not expose a separate runner facade', () => {
    expect(source).not.toContain(
      'globalThis.runner =',
    );
  });

  it('captures jasmineDone global failures in the execution result', () => {
    expect(source).toContain(
      'globalFailures:',
    );

    expect(source).toContain(
      'result?.failedExpectations',
    );
  });

  it('attributes async browser errors to the active spec before falling back to run-level failures', () => {
    expect(source).toContain(
      "window.addEventListener(\n        'unhandledrejection'",
    );

    expect(source).toContain(
      'pendingSpecFailures: new Map()',
    );

    expect(source).toContain(
      'currentSpecId =\n          config.id;',
    );

    expect(source).toContain(
      'status:\n                  \'failed\'',
    );

    expect(source).toContain(
      'this.attributedFailureSignatures',
    );
  });

  it('generates syntactically valid browser JavaScript', () => {
    expect(
      () => new Function(source),
    ).not.toThrow();
  });
});
````

## File: src/cli-watch-contract.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('Testify CLI watch contract', () => {
  it('makes watch mode explicit through --watch only', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/cli-handler.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      "watch: { type: 'boolean', short: 'w' }",
    );

    expect(source).toContain(
      'watch,',
    );

    expect(source).not.toContain(
      'config.watch || false',
    );
  });

  it('forces headed mode for watch even when config is headless', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/cli-handler.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      ': watch',
    );

    expect(source).toContain(
      '? false',
    );
  });

  it('keeps start() one-shot instead of redirecting to HMR', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'this.config.watch = false',
    );

    expect(source).not.toContain(
      'return this.watch();',
    );
  });

  it('keeps runner headless default false when config omits it', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      'headless: config.headless ?? false',
    );
  });

  it('keeps runner browser default chrome when config omits it', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/vite-jasmine-runner.ts',
        ),
        'utf8',
      );

    expect(source).toContain(
      "browser: config.browser ?? 'chrome'",
    );
  });
});
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

interface ResolvedRequestPath {
  rootDir: string;
  resolvedPath: string;
}

interface StaticPathRoots {
  outDir: string;
  workspaceNodeModulesDir: string;
  vendorDir: string;
  assetDirs: string[];
}

export function resolveStaticRequestPath(
  filePath: string,
  roots: StaticPathRoots,
): ResolvedRequestPath {
  if (filePath.startsWith('/node_modules/')) {
    const relativePath =
      filePath.replace(
        /^\/node_modules\//,
        '',
      );

    const resolvedCandidate = [
      roots.workspaceNodeModulesDir,
      roots.vendorDir,
    ]
      .map((candidateRoot) => ({
        rootDir: candidateRoot,
        resolvedPath: path.resolve(
          candidateRoot,
          relativePath,
        ),
      }))
      .find((candidate) =>
        isPathInside(
          candidate.rootDir,
          candidate.resolvedPath,
        ) &&
        fs.existsSync(
          candidate.resolvedPath,
        ),
      );

    return {
      rootDir:
        resolvedCandidate?.rootDir ??
        roots.workspaceNodeModulesDir,
      resolvedPath: path.normalize(
        resolvedCandidate?.resolvedPath ??
          path.resolve(
            roots.workspaceNodeModulesDir,
            relativePath,
          ),
      ),
    };
  }

  if (filePath === '/favicon.ico') {
    const faviconCandidate =
      roots.assetDirs
        .map((assetDir) => ({
          rootDir: assetDir,
          resolvedPath: path.resolve(
            assetDir,
            'favicon.ico',
          ),
        }))
        .find((candidate) =>
          isPathInside(
            candidate.rootDir,
            candidate.resolvedPath,
          ) &&
          fs.existsSync(
            candidate.resolvedPath,
          ),
        );

    if (faviconCandidate) {
      return {
        rootDir:
          faviconCandidate.rootDir,
        resolvedPath: path.normalize(
          faviconCandidate.resolvedPath,
        ),
      };
    }
  }

  if (filePath.startsWith('/assets/')) {
    const relativePath =
      filePath.replace(
        /^\/assets\//,
        '',
      );

    const assetCandidate =
      roots.assetDirs
        .map((assetDir) => ({
          rootDir: assetDir,
          resolvedPath: path.resolve(
            assetDir,
            relativePath,
          ),
        }))
        .find((candidate) =>
          isPathInside(
            candidate.rootDir,
            candidate.resolvedPath,
          ) &&
          fs.existsSync(
            candidate.resolvedPath,
          ),
        );

    if (assetCandidate) {
      return {
        rootDir: assetCandidate.rootDir,
        resolvedPath: path.normalize(
          assetCandidate.resolvedPath,
        ),
      };
    }

    return {
      rootDir: path.resolve(
        roots.outDir,
        'assets',
      ),
      resolvedPath: path.normalize(
        path.resolve(
          roots.outDir,
          `.${filePath}`,
        ),
      ),
    };
  }

  return {
    rootDir: roots.outDir,
    resolvedPath: path.normalize(
      path.resolve(
        roots.outDir,
        `.${filePath}`,
      ),
    ),
  };
}

function isPathInside(
  root: string,
  candidate: string,
): boolean {
  const relative = path.relative(
    path.resolve(root),
    path.resolve(candidate),
  );

  return (
    relative === '' ||
    (!relative.startsWith('..') &&
      !path.isAbsolute(relative))
  );
}

export class HttpServerManager {
  private server: http.Server | null = null;

  constructor(private config: ViteJasmineConfig) {}

  private createHttpServer(): http.Server {
    const outDir = path.resolve(this.config.outDir);
    const __filename = norm(fileURLToPath(import.meta.url));
    const __dirname = norm(path.dirname(__filename));
    const vendorDir = path.resolve(path.join(__dirname, '../node_modules'));
    const workspaceNodeModulesDir = path.resolve(path.join(process.cwd(), 'node_modules'));
    const packageRoot = path.resolve(path.join(__dirname, '..'));
    const assetDirs = [
      path.resolve(outDir, 'assets'),
      path.resolve(process.cwd(), 'assets'),
      path.resolve(packageRoot, 'assets'),
    ];

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

      const {
        rootDir,
        resolvedPath,
      } = resolveStaticRequestPath(
        filePath,
        {
          outDir,
          workspaceNodeModulesDir,
          vendorDir,
          assetDirs,
        },
      );

      if (!isPathInside(rootDir, resolvedPath)) {
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

## File: src/planning-engine.spec.ts
````typescript
import {
  PlanningEngine,
} from './planning-engine';
import type {
  TestCatalog,
} from './test-catalog';

describe('PlanningEngine', () => {
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
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Forms two',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec3',
        description: 'three',
        fullName: 'Forms three',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
    ],
  };

  it('caches equivalent plans within a catalog revision', () => {
    const planner =
      new PlanningEngine(
        catalog,
      );

    planner.plan({
      suite: 'suite1',
    });

    planner.plan({
      suite: 'suite1',
    });

    expect(
      planner.stats(),
    ).toEqual({
      catalogVersion: 1,
      cachedPlans: 1,
      cacheHits: 1,
      cacheMisses: 1,
    });
  });

  it('invalidates plans only when catalog content changes', () => {
    const planner =
      new PlanningEngine(
        catalog,
      );

    planner.plan();

    planner.update({
      ...catalog,
      suites:
        catalog.suites.map(
          (suite) => ({
            ...suite,
          }),
        ),
      specs:
        catalog.specs.map(
          (spec) => ({
            ...spec,
          }),
        ),
    });

    expect(
      planner.stats()
        .cachedPlans,
    ).toBe(1);

    planner.update({
      ...catalog,
      specs:
        catalog.specs.slice(
          0,
          2,
        ),
    });

    expect(
      planner.stats()
        .cachedPlans,
    ).toBe(0);

    expect(
      planner.version,
    ).toBe(2);
  });

  it('partitions a plan without overlap', () => {
    const planner =
      new PlanningEngine(
        catalog,
      );

    const partitions =
      planner.partition(
        planner.plan(),
        2,
      );

    expect(
      partitions[0]
        .specIds,
    ).toEqual([
      'spec1',
      'spec3',
    ]);

    expect(
      partitions[1]
        .specIds,
    ).toEqual([
      'spec2',
    ]);
  });

  it('keeps combined selector cache keys distinct', () => {
    const catalog: TestCatalog = {
      suites: [
        { id: 'suite1', description: 'Forms', fullName: 'Forms' },
      ],
      specs: [
        { id: 'spec1', description: 'one', fullName: 'Forms one', suiteId: 'suite1', file: 'a.spec.mjs' },
        { id: 'spec2', description: 'two', fullName: 'Forms two', suiteId: 'suite1', file: 'b.spec.mjs' },
      ],
    };
    const engine = new PlanningEngine(catalog);

    expect(engine.plan({ suite: 'Forms', file: 'a.spec.ts' }).specIds).toEqual(['spec1']);
    expect(engine.plan({ suite: 'Forms', file: 'b.spec.ts' }).specIds).toEqual(['spec2']);
  });

});

describe('PlanningEngine programmable plans', () => {
  const catalog = {
    suites: [],
    specs: [
      {
        id: 'spec1',
        description: 'one',
        fullName: 'one',
        file: 'one.spec.ts',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'two',
        file: 'two.spec.ts',
      },
    ],
  };

  it('returns programmable plans on cache hits', () => {
    const planner =
      new PlanningEngine(catalog);

    planner.plan();

    const cached =
      planner.plan();

    expect(
      cached.tests().map(
        (test) => test.id,
      ),
    ).toEqual([
      'spec1',
      'spec2',
    ]);

    expect(
      cached.filter(
        (test) =>
          test.id === 'spec2',
      ).specIds,
    ).toEqual([
      'spec2',
    ]);
  });

  it('preserves plan operations through sharding and partitioning', () => {
    const planner =
      new PlanningEngine(catalog);
    const plan =
      planner.plan();

    const shard =
      planner.shard(
        plan,
        0,
        2,
      );

    expect(
      shard.tests().map(
        (test) => test.id,
      ),
    ).toEqual([
      'spec1',
    ]);

    const partitions =
      planner.partition(
        plan,
        2,
      );

    expect(
      partitions[1]
        .slice(0, 1)
        .specIds,
    ).toEqual([
      'spec2',
    ]);
  });

  it('keeps combined selector cache keys distinct', () => {
    const catalog: TestCatalog = {
      suites: [
        { id: 'suite1', description: 'Forms', fullName: 'Forms' },
      ],
      specs: [
        { id: 'spec1', description: 'one', fullName: 'Forms one', suiteId: 'suite1', file: 'a.spec.mjs' },
        { id: 'spec2', description: 'two', fullName: 'Forms two', suiteId: 'suite1', file: 'b.spec.mjs' },
      ],
    };
    const engine = new PlanningEngine(catalog);

    expect(engine.plan({ suite: 'Forms', file: 'a.spec.ts' }).specIds).toEqual(['spec1']);
    expect(engine.plan({ suite: 'Forms', file: 'b.spec.ts' }).specIds).toEqual(['spec2']);
  });

});
````

## File: src/planning-engine.ts
````typescript
import {
  embedClassSource,
  embedFunctionSource,
} from './embedded-source';
import type {
  TestCatalog,
} from './test-catalog';
import type {
  TestSelector,
} from './test-selection';
import {
  createExecutionPlan,
  partitionExecutionPlan,
  shardExecutionPlan,
  createPlannedExecution,
  type ExecutionPlan,
  type ExecutionPlanOptions,
  type PlannedExecution,
} from './execution-plan';
import {
  CatalogState,
  type CatalogChangeSet,
} from './catalog-state';
import type {
  TestCatalogIndex,
} from './test-catalog-index';

export interface PlanningEngineStats {
  catalogVersion: number;
  cachedPlans: number;
  cacheHits: number;
  cacheMisses: number;
}

export class PlanningEngine {
  private readonly state:
    CatalogState;

  private readonly planCache =
    new Map<
      string,
      ExecutionPlan
    >();

  private cacheHitsValue = 0;
  private cacheMissesValue = 0;

  constructor(
    catalog: TestCatalog,
  ) {
    this.state =
      new CatalogState(
        catalog,
      );
  }

  get catalog(): TestCatalog {
    return this.state.catalog;
  }

  get index(): TestCatalogIndex {
    return this.state.index;
  }

  get version(): number {
    return this.state.version;
  }

  get changes():
    CatalogChangeSet {
    return this.state.changes;
  }

  update(
    catalog: TestCatalog,
  ): CatalogChangeSet {
    const changes =
      this.state.update(
        catalog,
      );

    if (changes.changed) {
      this.planCache.clear();
    }

    return changes;
  }

  plan(
    selector?: TestSelector,
    options:
      ExecutionPlanOptions = {},
  ): PlannedExecution {
    const key =
      createPlanCacheKey(
        this.version,
        selector,
        options,
      );

    const cached =
      this.planCache.get(key);

    if (cached) {
      this.cacheHitsValue++;

      return createPlannedExecution(
        cloneExecutionPlan(
          cached,
        ),
        this.catalog,
      );
    }

    this.cacheMissesValue++;

    const plan =
      createExecutionPlan(
        this.catalog,
        selector,
        options,
      );

    plan.catalogVersion =
      this.version;

    this.planCache.set(
      key,
      cloneExecutionPlan(
        plan,
      ),
    );

    return plan;
  }

  shard(
    plan: PlannedExecution,
    index: number,
    count: number,
  ): PlannedExecution;
  shard(
    plan: ExecutionPlan,
    index: number,
    count: number,
  ): ExecutionPlan;
  shard(
    plan: ExecutionPlan,
    index: number,
    count: number,
  ): ExecutionPlan {
    return shardExecutionPlan(
      plan,
      index,
      count,
    );
  }

  partition(
    plan: PlannedExecution,
    count: number,
  ): PlannedExecution[];
  partition(
    plan: ExecutionPlan,
    count: number,
  ): ExecutionPlan[];
  partition(
    plan: ExecutionPlan,
    count: number,
  ): ExecutionPlan[] {
    return partitionExecutionPlan(
      plan,
      count,
    );
  }

  invalidate(): void {
    this.planCache.clear();
  }

  stats():
    PlanningEngineStats {
    return {
      catalogVersion:
        this.version,
      cachedPlans:
        this.planCache.size,
      cacheHits:
        this.cacheHitsValue,
      cacheMisses:
        this.cacheMissesValue,
    };
  }
}

function createPlanCacheKey(
  version: number,
  selector: TestSelector | undefined,
  options: ExecutionPlanOptions,
): string {
  return [
    version,
    serializeSelector(
      selector,
    ),
    options.random ?? false,
    options.seed ?? '',
    options.stopOnFailure ?? false,
  ].join('|');
}

function serializeSelector(
  selector:
    | TestSelector
    | undefined,
): string {
  if (selector === undefined) {
    return 'all';
  }

  if (
    typeof selector === 'string'
  ) {
    return `text:${selector}`;
  }

  if (
    selector instanceof RegExp
  ) {
    return [
      'regexp',
      selector.source,
      selector.flags,
    ].join(':');
  }

  const parts: string[] = [];

  if (selector.spec) {
    parts.push(`spec:${serializeSelectorValue(selector.spec)}`);
  }

  if (selector.suite) {
    parts.push(`suite:${serializeSelectorValue(selector.suite)}`);
  }

  if (selector.file) {
    parts.push(`file:${serializeSelectorValue(selector.file)}`);
  }

  return parts.length > 0
    ? parts.join('&')
    : 'empty';
}

function serializeSelectorValue(
  selector: string | RegExp,
): string {
  return typeof selector ===
    'string'
    ? selector
    : `/${selector.source}/${selector.flags}`;
}

function cloneExecutionPlan(
  plan: ExecutionPlan,
): ExecutionPlan {
  return {
    ...plan,
    specIds: [
      ...plan.specIds,
    ],
    source: {
      ...plan.source,
    },
    shard:
      plan.shard
        ? { ...plan.shard }
        : undefined,
  };
}

export function getEmbeddedPlanningEngineSource():
  string {
  return [
    embedFunctionSource(
      createPlanCacheKey,
    ),
    embedFunctionSource(
      serializeSelector,
    ),
    embedFunctionSource(
      serializeSelectorValue,
    ),
    embedFunctionSource(
      cloneExecutionPlan,
    ),
    embedClassSource(
      'PlanningEngine',
      PlanningEngine,
    ),
  ].join('\n\n');
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
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'binds controls',
        fullName: 'Forms Bindings binds controls',
        suiteId: 'suite2',
        file: 'bindings.spec.mjs',
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
        { file: 'bindings.spec.mjs' },
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

  it('matches a source spec filename against the built .mjs catalog file', () => {
    expect(
      resolveTestSelector(
        catalog,
        { file: 'bindings.spec.ts' },
      ),
    ).toEqual(['spec2']);
  });

  it('matches a basename when the CLI does not provide the catalog path', () => {
    const nestedCatalog: TestCatalog = {
      ...catalog,
      specs: catalog.specs.map((spec) => ({
        ...spec,
        file: spec.file ? `dist/tests/${spec.file}` : spec.file,
      })),
    };

    expect(
      resolveTestSelector(
        nestedCatalog,
        { file: 'bindings.spec.ts' },
      ),
    ).toEqual(['spec2']);
  });

  it('intersects file and suite selectors', () => {
    expect(
      resolveTestSelector(
        catalog,
        {
          file: 'bindings.spec.ts',
          suite: 'Forms',
        },
      ),
    ).toEqual(['spec2']);

    expect(
      resolveTestSelector(
        catalog,
        {
          file: 'forms.spec.ts',
          suite: 'Bindings',
        },
      ),
    ).toEqual([]);
  });

});
````

## File: src/vite-jasmine-config.ts
````typescript
import type { TestSelector } from './test-selection';
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
  lockFilePath?: string;

  browser?: string;
  port?: number;
  coverage?: boolean;
  headless?: boolean;
  watch?: boolean;
  suppressConsoleLogs?: boolean;
  preserveOutputs: boolean;
  ansi?: boolean;
  selector?: TestSelector;
  fileFilter?: string;
  
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
          const globalFailureCount =
            Array.isArray(
              message.failedExpectations,
            )
              ? message.failedExpectations.length
              : 0;
          const success = message.overallStatus === 'passed' && this.failedSpecsCount === 0 && globalFailureCount === 0;
          const hasPending = message.overallStatus === 'incomplete' || this.pendingSpecsCount > 0;
          this.emit('testsCompleted', { success, hasPending, coverage });
          break;

        case 'session:exit':
          this.emit('sessionExitRequested');
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

## File: testify.json
````json
{
  "srcDirs": [
    "./src"
  ],
  "testDirs": [
    "./src"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/dist/**"
  ],
  "outDir": "./dist/.vite-jasmine-build",
  "browser": "node",
  "headless": true,
  "watch": false,
  "coverage": false,
  "suppressConsoleLogs": true,
  "preserveOutputs": false,
  "viteConfig": {
    "build": {
      "rolldownOptions": {
        "external": [
          "playwright",
          "playwright-core",
          "chromium-bidi"
        ]
      }
    }
  },
  "jasmineConfig": {
    "env": {
      "random": false,
      "seed": 0,
      "stopSpecOnExpectationFailure": false,
      "timeout": 120000
    }
  }
}
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
        internals: resolve(__dirname, 'src/internals.ts'),
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

      this.clearBrowserState();

      if (error.code === 'MODULE_NOT_FOUND') {
        logger.println(BrowserMessages.playwrightNotInstalled(browserName));
        logger.println(BrowserMessages.playwrightInstallTip());
      } else {
        logger.error(
          BrowserMessages.failedToOpenBrowser(
            error?.message ?? String(error),
          ),
        );
      }

      throw error;
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
      'forms.spec.mjs',
      'binding.spec.mjs',
    ]);

    expect(html).toContain(
      'forms.spec.mjs',
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
      '<title>Testify</title>',
    );
    expect(html).toContain(
      'data:image/x-icon;base64,',
    );
    expect(html).not.toContain(
      'assets/favicon.ico',
    );
  });
  it('installs a static Jasmine specFilter for a suite selector', () => {
    const builder = new BrowserPageBuilder({
      ...config,
      selector: { suite: 'Validation' },
    });

    const html = builder.buildStatic(['forms.spec.mjs']);

    expect(html).toContain('specFilter');
    expect(html).toContain('Validation');
  });

});
````

## File: src/browser-page-builder.ts
````typescript
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
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Forms two',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
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
        'forms.spec.mjs',
      ).specIds,
    ).toEqual([
      'spec1',
      'spec2',
    ]);
  });
});

describe('ExecutionPlan programmable selection', () => {
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
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec2',
        description: 'two',
        fullName: 'Forms two',
        suiteId: 'suite1',
        file: 'forms.spec.mjs',
      },
      {
        id: 'spec3',
        description: 'three',
        fullName: 'Other three',
        file: 'other.spec.mjs',
      },
    ],
  };

  it('exposes immutable test descriptors in plan order', () => {
    const plan =
      createExecutionPlan(catalog);

    expect(
      plan.tests().map(
        (test) => test.id,
      ),
    ).toEqual([
      'spec1',
      'spec2',
      'spec3',
    ]);

    expect(
      Object.isFrozen(
        plan.tests(),
      ),
    ).toBeTrue();

    expect(
      Object.isFrozen(
        plan.tests()[0],
      ),
    ).toBeTrue();
  });

  it('filters into a new plan without mutating the original', () => {
    const plan =
      createExecutionPlan(
        catalog,
        undefined,
        {
          random: true,
          seed: 42,
          stopOnFailure: true,
        },
      );

    const filtered =
      plan.filter(
        (test) =>
          test.file ===
          'forms.spec.mjs',
      );

    expect(plan.specIds).toEqual([
      'spec1',
      'spec2',
      'spec3',
    ]);

    expect(filtered.specIds).toEqual([
      'spec1',
      'spec2',
    ]);

    expect(filtered.random).toBeTrue();
    expect(filtered.seed).toBe(42);
    expect(filtered.stopOnFailure).toBeTrue();
    expect(filtered.source).toEqual(
      plan.source,
    );
  });

  it('supports chained filtering and slicing', () => {
    const plan =
      createExecutionPlan(catalog)
        .filter(
          (test) =>
            test.fullName.startsWith(
              'Forms',
            ),
        )
        .slice(1);

    expect(plan.specIds).toEqual([
      'spec2',
    ]);

    expect(
      plan.tests().map(
        (test) => test.fullName,
      ),
    ).toEqual([
      'Forms two',
    ]);
  });


  it('supports plan set operations', () => {
    const all =
      createExecutionPlan(catalog);
    const forms =
      all.filter(
        (test) =>
          test.file === 'forms.spec.mjs',
      );
    const second =
      all.filter(
        (test) =>
          test.id === 'spec2',
      );
    const other =
      all.filter(
        (test) =>
          test.id === 'spec3',
      );

    expect(
      second.add(other).specIds,
    ).toEqual([
      'spec2',
      'spec3',
    ]);

    expect(
      forms.subtract(second).specIds,
    ).toEqual([
      'spec1',
    ]);

    expect(
      forms.intersect(second).specIds,
    ).toEqual([
      'spec2',
    ]);

    expect(
      forms.not().specIds,
    ).toEqual([
      'spec3',
    ]);
  });

  it('keeps set operations immutable and preserves left-plan options', () => {
    const left =
      createExecutionPlan(
        catalog,
        undefined,
        {
          random: true,
          seed: 42,
          stopOnFailure: true,
        },
      ).slice(0, 1);
    const right =
      createExecutionPlan(catalog)
        .slice(1, 3);

    const combined =
      left.add(right);

    expect(left.specIds).toEqual([
      'spec1',
    ]);
    expect(combined.specIds).toEqual([
      'spec1',
      'spec2',
      'spec3',
    ]);
    expect(combined.random).toBeTrue();
    expect(combined.seed).toBe(42);
    expect(combined.stopOnFailure).toBeTrue();
  });

  it('rejects plan operations across catalog revisions', () => {
    const left =
      createExecutionPlan(catalog);
    const right =
      createExecutionPlan(catalog);

    left.catalogVersion = 1;
    right.catalogVersion = 2;

    expect(
      () => left.add(right),
    ).toThrowError(
      /different catalog revisions/,
    );
  });

  it('rejects plan operations across different catalogs', () => {
    const left =
      createExecutionPlan(catalog);
    const right =
      createExecutionPlan({
        ...catalog,
        specs: catalog.specs.slice(0, 2),
      });

    expect(
      () => left.intersect(right),
    ).toThrowError(
      /different catalogs/,
    );
  });

  it('derives passed, failed, and unresolved plans from execution results', () => {
    const plan =
      createExecutionPlan(catalog);
    plan.catalogVersion = 7;

    const result: any = {
      specResults: [
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
      ],
      total: 2,
      passed: 1,
      failed: 1,
      pending: 0,
    };

    Object.defineProperty(
      result,
      '__testifyCatalogVersion',
      { value: 7 },
    );

    expect(
      plan.where(result, 'passed').specIds,
    ).toEqual(['spec1']);
    expect(
      plan.where(result, 'failed').specIds,
    ).toEqual(['spec2']);
    expect(
      plan.where(result, 'unresolved').specIds,
    ).toEqual(['spec3']);
  });

  it('treats non-terminal statuses as unresolved', () => {
    const plan =
      createExecutionPlan(catalog);

    const result: any = {
      specResults: [
        { id: 'spec1', description: 'one', status: 'pending' },
        { id: 'spec2', description: 'two', status: 'incomplete' },
        { id: 'spec3', description: 'three', status: 'disabled' },
      ],
      total: 3,
      passed: 0,
      failed: 0,
      pending: 2,
    };

    expect(
      plan.where(result, 'unresolved').specIds,
    ).toEqual([
      'spec1',
      'spec2',
      'spec3',
    ]);
  });

  it('classifies only tests from the current plan', () => {
    const plan =
      createExecutionPlan(catalog)
        .slice(0, 2);

    const result: any = {
      specResults: [
        { id: 'spec1', description: 'one', status: 'passed' },
        { id: 'spec2', description: 'two', status: 'failed' },
        { id: 'spec3', description: 'three', status: 'passed' },
      ],
      total: 3,
      passed: 2,
      failed: 1,
      pending: 0,
    };

    expect(plan.where(result, 'passed').specIds)
      .toEqual(['spec1']);
    expect(plan.where(result, 'failed').specIds)
      .toEqual(['spec2']);
    expect(plan.where(result, 'unresolved').specIds)
      .toEqual([]);
  });

  it('rejects outcome selection from a different catalog revision', () => {
    const plan =
      createExecutionPlan(catalog);
    plan.catalogVersion = 1;

    const result: any = {
      specResults: [],
      total: 0,
      passed: 0,
      failed: 0,
      pending: 0,
    };

    Object.defineProperty(
      result,
      '__testifyCatalogVersion',
      { value: 2 },
    );

    expect(
      () => plan.where(result, 'failed'),
    ).toThrowError(
      /different catalog revision/,
    );
  });

  it('rejects results containing tests outside the plan catalog', () => {
    const plan =
      createExecutionPlan(catalog);
    const result: any = {
      specResults: [
        { id: 'foreign', description: 'foreign', status: 'failed' },
      ],
      total: 1,
      passed: 0,
      failed: 1,
      pending: 0,
    };

    expect(
      () => plan.where(result, 'failed'),
    ).toThrowError(
      /outside this plan catalog/,
    );
  });

  it('keeps plan operations out of serialized execution data', () => {
    const plan =
      createExecutionPlan(catalog);

    const serialized =
      JSON.parse(
        JSON.stringify(plan),
      );

    expect(serialized.tests)
      .toBeUndefined();
    expect(serialized.filter)
      .toBeUndefined();
    expect(serialized.slice)
      .toBeUndefined();
    expect(serialized.add)
      .toBeUndefined();
    expect(serialized.subtract)
      .toBeUndefined();
    expect(serialized.intersect)
      .toBeUndefined();
    expect(serialized.not)
      .toBeUndefined();
    expect(serialized.passed)
      .toBeUndefined();
    expect(serialized.failed)
      .toBeUndefined();
    expect(serialized.unresolved)
      .toBeUndefined();
    expect(serialized.specIds).toEqual([
      'spec1',
      'spec2',
      'spec3',
    ]);
  });

  it('rejects unknown outcome selectors', () => {
    const plan = createExecutionPlan(catalog);
    const result: any = {
      specResults: [],
      total: 0,
      passed: 0,
      failed: 0,
      pending: 0,
    };

    expect(() =>
      plan.where(result, 'unknown' as any),
    ).toThrowError(
      TypeError,
      'Execution plan where expects passed, failed, or unresolved.',
    );
  });

});
````

## File: src/file-discovery-service.ts
````typescript
import { glob } from "glob";
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { norm } from "./utils";
import * as fs from "fs/promises";
import * as path from "path";
import { builtinModules } from "module";
import { createHash } from 'crypto';
import { logger } from './logger';
import { FileDiscoveryMessages } from './log-messages';

const NODE_BUILTIN_SPECIFIERS = new Set(
  builtinModules.map((specifier) => specifier.replace(/^node:/, '')),
);

const BROWSER_UNSUPPORTED_PACKAGES = new Set([
  'glob',
  'playwright',
  'playwright-core',
  'chromium-bidi',
  'ws',
  'istanbul-api',
  'istanbul-lib-coverage',
  'istanbul-lib-instrument',
  'istanbul-lib-report',
  'istanbul-lib-source-maps',
  'istanbul-reports',
]);

const BROWSER_UNSUPPORTED_GLOBAL_PATTERNS = [
  /\bprocess\s*(?:\.|\[)/,
  /\bBuffer\s*(?:\.|\[|\()/,
  /\b__dirname\b/,
  /\b__filename\b/,
];

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
    const { srcFiles, specFiles } = await this.discoverAllSources();

    return await this.filterBrowserCompatibleFiles(
      srcFiles,
      specFiles,
    );
  }

  async discoverAllSources(): Promise<{ srcFiles: string[]; specFiles: string[] }> {
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

      const dedupedSrcFiles =
        [...new Set(srcFiles)];

      const dedupedSpecFiles =
        [...new Set(specFiles)];

      return {
        srcFiles: dedupedSrcFiles,
        specFiles: dedupedSpecFiles,
      };
    } catch (error) {
      logger.error(FileDiscoveryMessages.errorDiscoveringFiles(error));
      throw new Error("Failed to discover source and test files");
    }
  }

  private async filterBrowserCompatibleFiles(
    srcFiles: string[],
    specFiles: string[],
  ): Promise<{
    srcFiles: string[];
    specFiles: string[];
  }> {
    if (this.config.browser === 'node') {
      return {
        srcFiles,
        specFiles,
      };
    }

    const compatibility =
      new Map<string, boolean>();

    const isCompatible = async (
      filePath: string,
      stack = new Set<string>(),
    ): Promise<boolean> => {
      const normalizedPath =
        norm(path.resolve(filePath));

      const cached =
        compatibility.get(
          normalizedPath,
        );

      if (cached !== undefined) {
        return cached;
      }

      if (stack.has(normalizedPath)) {
        return true;
      }

      stack.add(normalizedPath);

      const result =
        await this.computeBrowserCompatibility(
          normalizedPath,
          isCompatible,
          stack,
        );

      stack.delete(normalizedPath);
      compatibility.set(
        normalizedPath,
        result,
      );

      return result;
    };

    const filterFiles = async (
      files: string[],
    ): Promise<string[]> => {
      const matches =
        await Promise.all(
          files.map(
            async (filePath) => ({
              filePath,
              isCompatible:
                await isCompatible(
                  filePath,
                ),
            }),
          ),
        );

      return matches
        .filter(
          (entry) =>
            entry.isCompatible,
        )
        .map(
          (entry) =>
            entry.filePath,
        );
    };

    return {
      srcFiles:
        await filterFiles(srcFiles),
      specFiles:
        await filterFiles(specFiles),
    };
  }

  private async computeBrowserCompatibility(
    filePath: string,
    isCompatible: (
      filePath: string,
      stack?: Set<string>,
    ) => Promise<boolean>,
    stack: Set<string>,
  ): Promise<boolean> {
    let source = '';

    try {
      source =
        await fs.readFile(
          filePath,
          'utf8',
        );
    } catch {
      return true;
    }

    const importedSpecifiers =
      this.collectImportedSpecifiers(
        source,
      );

    if (
      !this.usesEnvironmentSpecHelper(
        source,
      ) &&
      this.usesBrowserUnsupportedGlobals(
        source,
      )
    ) {
      return false;
    }

    for (
      const specifier of
      importedSpecifiers
    ) {
      if (
        this.isBrowserUnsupportedSpecifier(
          specifier,
        )
      ) {
        return false;
      }

      const resolvedImport =
        await this.resolveLocalImport(
          filePath,
          specifier,
        );

      if (
        resolvedImport &&
        !(await isCompatible(
          resolvedImport,
          stack,
        ))
      ) {
        return false;
      }
    }

    return true;
  }

  private usesEnvironmentSpecHelper(
    source: string,
  ): boolean {
    return /from\s*['"][^'"]*env\.spec['"]/.test(
      source,
    ) || /require\s*\(\s*['"][^'"]*env\.spec['"]\s*\)/.test(
      source,
    );
  }

  private usesBrowserUnsupportedGlobals(
    source: string,
  ): boolean {
    const code =
      this.stripCommentsAndStrings(
        source,
      );

    return BROWSER_UNSUPPORTED_GLOBAL_PATTERNS.some(
      (pattern) => {
        pattern.lastIndex = 0;
        return pattern.test(code);
      },
    );
  }

  private stripCommentsAndStrings(
    source: string,
  ): string {
    let output = source.replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    );

    output = output.replace(
      /\/\/.*$/gm,
      '',
    );

    output = output.replace(
      /'(?:\\.|[^'\\])*'/g,
      "''",
    );

    output = output.replace(
      /"(?:\\.|[^"\\])*"/g,
      '""',
    );

    output = output.replace(
      /`(?:\\.|[^`\\])*`/g,
      '``',
    );

    return output;
  }

  private collectImportedSpecifiers(
    source: string,
  ): string[] {
    const patterns = [
      /\bimport\s+[\s\S]*?\s+from\s*['"]([^'"]+)['"]/g,
      /\bexport\s+[\s\S]*?\s+from\s*['"]([^'"]+)['"]/g,
      /\bimport\s*['"]([^'"]+)['"]/g,
      /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    ];

    const specifiers: string[] = [];

    for (const pattern of patterns) {
      pattern.lastIndex = 0;

      for (
        const match of
        source.matchAll(pattern)
      ) {
        const specifier = match[1]?.trim();
        if (specifier) {
          specifiers.push(specifier);
        }
      }
    }

    return [...new Set(specifiers)];
  }

  private isBrowserUnsupportedSpecifier(
    specifier: string,
  ): boolean {
    if (
      specifier.startsWith('.') ||
      specifier.startsWith('/')
    ) {
      return false;
    }

    const normalizedSpecifier =
      specifier.replace(/^node:/, '');

    if (
      NODE_BUILTIN_SPECIFIERS.has(
        normalizedSpecifier,
      ) ||
      NODE_BUILTIN_SPECIFIERS.has(
        normalizedSpecifier.split('/')[0]!,
      )
    ) {
      return true;
    }

    const packageName =
      normalizedSpecifier.startsWith('@')
        ? normalizedSpecifier
            .split('/')
            .slice(0, 2)
            .join('/')
        : (normalizedSpecifier
            .split('/')[0] ??
          normalizedSpecifier);

    return BROWSER_UNSUPPORTED_PACKAGES.has(
      packageName,
    );
  }

  private async resolveLocalImport(
    importerPath: string,
    specifier: string,
  ): Promise<string | null> {
    if (
      !specifier.startsWith('.') &&
      !specifier.startsWith('/')
    ) {
      return null;
    }

    const basePath =
      specifier.startsWith('/')
        ? path.resolve(specifier)
        : path.resolve(
            path.dirname(importerPath),
            specifier,
          );

    const candidates = [
      basePath,
      `${basePath}.ts`,
      `${basePath}.js`,
      `${basePath}.mjs`,
      path.join(basePath, 'index.ts'),
      path.join(basePath, 'index.js'),
      path.join(basePath, 'index.mjs'),
    ];

    for (const candidate of candidates) {
      try {
        await fs.access(candidate);
        return norm(candidate);
      } catch {
        // Keep probing the local import candidates.
      }
    }

    return null;
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
      return `${flattened}__${hash}.spec.mjs`;
    }

    const sanitized =
      segments.length > 0 ? `${segments.join('_')}__${fileName}` : fileName;
    
    return `${sanitized}__${hash}.mjs`;
  }
}
````

## File: src/logger-prompt.spec.ts
````typescript
import fs from 'fs';
import path from 'path';

describe('Logger prompt styling', () => {
  const source = fs.readFileSync(
    path.resolve(
      process.cwd(),
      'src/logger.ts',
    ),
    'utf8',
  );

  it('uses a thicker prompt marker for interactive output', () => {
    expect(source).toContain(
      '> ',
    );
    expect(source).toContain(
      "plainPrompt = '> '",
    );
  });

  it('uses the %error% prefix to drive error formatting', () => {
    expect(source).toContain(
      "const errorToken =",
    );
    expect(source).toContain(
      "'%error% ';",
    );
    expect(source).toContain(
      'this.errorPrefix() +',
    );
  });

  it('uses the %warn% prefix to drive warning badge formatting', () => {
    expect(source).toContain(
      "const warnToken =",
    );
    expect(source).toContain(
      "'%warn% ';",
    );
    expect(source).toContain(
      'this.warnPrefix() +',
    );
  });

  it('exposes a dedicated warn logger method', () => {
    expect(source).toContain(
      'warn(msg: string)',
    );
    expect(source).toContain(
      'forceWarnPrefix',
    );
  });
});
````

## File: src/node-runtime-host.ts
````typescript
import type {
  ExecutionResult,
} from './execution-result';
import type {
  TestSelector,
} from './test-selection';
import type {
  NodeRunnerHost,
} from './node-runner-host';
import {
  logger,
} from './logger';

export class NodeRuntimeHost {
  async run(
    host: NodeRunnerHost,
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<ExecutionResult> {
    if (process.env.TESTIFY_DEBUG === '1') {
      logger.error(
        `[Testify debug] runner file: ${host.file}`,
      );
    }

    try {
      await host.load();
    } catch (error) {
      if (process.env.TESTIFY_DEBUG === '1') {
        logger.error(
          '[Testify debug] failure occurred while loading test-runner.mjs',
        );
      }
      throw error;
    }

    if (process.env.TESTIFY_DEBUG === '1') {
      logger.error(
        '[Testify debug] generated runner loaded; starting run()',
      );
    }

    try {
      return await host.run(
        reporter,
        selector,
      );
    } catch (error) {
      if (process.env.TESTIFY_DEBUG === '1') {
        logger.error(
          `[Testify debug] failure occurred inside run(): ${
            error instanceof Error
              ? error.stack ??
                error.message
              : String(error)
          }`,
        );
      }
      throw error;
    }
  }
}
````

## File: src/public-api.ts
````typescript
/**
 * Stable Testify public API.
 *
 * The root package exposes the engine contracts users program against:
 * Session creates and executes work, Plan shapes work, Result describes it.
 */
export {
  RunnerSession,
} from './runner-session';

export type {
  RunnerSessionAdapter,
  RunnerSessionOptions,
  RunnerSessionRefreshResult,
  RunnerSessionState,
  TestifyRunnerSession,
} from './runner-session';

export type {
  ExecutionPlan,
  ExecutionPlanOptions,
  ExecutionPlanPredicate,
  ExecutionPlanTest,
  PlannedExecution,
} from './execution-plan';

export type {
  ExecutionResult,
  ExecutionSpecResult,
} from './execution-result';

export type {
  TestSelector,
} from './test-selection';

export type {
  TestCatalog,
  TestCatalogSpec,
  TestCatalogSuite,
} from './test-catalog';
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

## File: src/browser-hmr-client.ts
````typescript
export function getBrowserHmrClientScript(): string {
  return `
// HMR Client Runtime
window.HMRClient = (function() {
  const moduleRegistry = new Map();

  function normalizeHmrPath(filePath) {
    if (
      typeof normalizeTestifyFilePath === 'function'
    ) {
      return normalizeTestifyFilePath(
        filePath,
      );
    }

    return String(filePath)
      .replace(/\\\\/g, '/')
      .replace(/\\/+/g, '/')
      .replace(/^\\/+/, '');
  }

  function getEnv() {
    return window.jasmine?.getEnv?.();
  }

  function detachFilePathSuites(filePath) {
    const normalizedFilePath =
      normalizeHmrPath(filePath);

    const env = getEnv();
    if (!env) return;

    const topSuite = env.topSuite();
    if (!topSuite) return;

    const catalog =
      window.jasmine?.getCatalog?.() ??
      createTestCatalogFromJasmineEnv(env);

    const specIds = new Set(
      catalog.specs
        .filter(
          (spec) =>
            normalizeHmrPath(
              spec.file ?? '',
            ) === normalizedFilePath,
        )
        .map(spec => spec.id)
    );

    const suiteIds = new Set(
      catalog.suites
        .filter(
          (suite) =>
            normalizeHmrPath(
              suite.file ?? '',
            ) === normalizedFilePath,
        )
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
    console.log(
      \`🧹 Detached catalog entries for file: \${normalizedFilePath}\`
    );
  }

  async function hotUpdateSpec(filePath) {
    const normalizedFilePath =
      normalizeHmrPath(filePath);

    detachFilePathSuites(filePath);

    const module =
      await withTestifyRegistrationScope(
        normalizedFilePath,
        () =>
          import(
            '/' +
            normalizedFilePath +
            \`?t=\${Date.now()}\`
          ),
      );

    moduleRegistry.set(
      normalizedFilePath,
      module,
    );

    console.log(
      '✅ Hot updated Jasmine registrations from:',
      normalizedFilePath,
    );

    return module;
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

      const updatePath =
        normalizeHmrPath(
          update.path,
        );

      if (update.type === 'test-remove') {
        detachFilePathSuites(
          updatePath,
        );

        moduleRegistry.delete(
          updatePath,
        );

        console.log(
          '🗑️ Removed test registrations:',
          updatePath,
        );

        return;
      }

      console.log(
        '🔥 Hot updating:',
        updatePath,
      );

      try {
        await hotUpdateSpec(
          updatePath,
        );

        console.log(
          '✅ HMR update applied:',
          updatePath,
        );
      } catch (err) {
        console.error(
          'x  HMR update failed:',
          err,
        );
        location.reload();
      }
    }
  }

  return {
    handleMessage,
    detachFilePathSuites,
    clearCache: (filePath) => {
      if (filePath) {
        moduleRegistry.delete(
          normalizeHmrPath(
            filePath,
          ),
        );
      } else {
        moduleRegistry.clear();
      }
    }
  };
})();
`;
}
````

## File: src/browser-playground-runtime.spec.ts
````typescript
import {
  getBrowserPlaygroundRuntimeSource,
} from './browser-playground-runtime';

function loadInstaller(): (
  session: any,
  context: any,
) => any {
  const source =
    getBrowserPlaygroundRuntimeSource();

  return new Function(
    `${source}\nreturn installTestifyPlayground;`,
  )();
}

describe('Browser Playground runtime', () => {
  function createHarness() {
    const executedPlans: any[] = [];
    const hostMessages: any[] = [];
    let revision = 1;

    const createPlan = (
      specIds: string[],
      source: any,
      options: any = {},
    ) => {
      const descriptors =
        specIds.map(
          (id) => ({
            id,
            description: id,
            fullName: id,
            file: 'fixture.spec.ts',
          }),
        );

      const plan: any = {
        specIds: [...specIds],
        source,
        catalogVersion: revision,
        ...options,
      };

      plan.tests = () => descriptors;
      plan.filter = (predicate: any) => {
        const selected = descriptors.filter(predicate);
        return createPlan(
          selected.map((test) => test.id),
          source,
          options,
        );
      };
      plan.slice = (start?: number, end?: number) => {
        const selected = descriptors.slice(start, end);
        return createPlan(
          selected.map((test) => test.id),
          source,
          options,
        );
      };

      return plan;
    };

    const session: any = {
      state: 'ready',
      execute: async (plan: any) => {
        executedPlans.push(plan);
        return {
          specResults: plan.specIds.map(
            (id: string) => ({
              id,
              description: id,
              fullName: id,
              status:
                id === 'failed-spec'
                  ? 'failed'
                  : 'passed',
              failedExpectations:
                id === 'failed-spec'
                  ? [{}]
                  : [],
            }),
          ),
        };
      },
      plan: (selector?: any, options: any = {}) =>
        createPlan(
          ['failed-spec', 'spec-1'],
          selector === undefined
            ? { kind: 'all' }
            : { kind: 'selector', selector },
          options,
        ),
      planSpec: (selector: any, options: any = {}) =>
        createPlan(
          ['spec-1'],
          { kind: 'spec', selector },
          options,
        ),
      planSuite: (selector: any, options: any = {}) =>
        createPlan(
          ['spec-1'],
          { kind: 'suite', selector },
          options,
        ),
      planFile: (selector: any, options: any = {}) =>
        createPlan(
          ['spec-1'],
          { kind: 'file', selector },
          options,
        ),
      tests: () => [{ id: 'spec-1' }],
      suites: () => [{ id: 'suite-1' }],
      files: () => [{ file: 'fixture.spec.ts' }],
      catalog: () => ({
        specs: [
          {
            id: 'failed-spec',
            fullName: 'failed-spec',
          },
          {
            id: 'spec-1',
            fullName: 'spec-1',
          },
        ],
      }),
      revision: () => revision,
      setRevision(value: number) {
        revision = value;
      },
    };

    const previousHost =
      (globalThis as any).__testifyHost;
    const previousSession =
      (globalThis as any).session;

    (globalThis as any).__testifyHost = {
      send(message: any) {
        hostMessages.push(message);
      },
    };

    const install = loadInstaller();

    install(
      session,
      {
        currentPlanOptions: () => ({
          random: false,
          seed: 0,
          stopOnFailure: false,
        }),
        setSeed: () => 0,
        resetSeed: () => 0,
        summarizeExecutionResults: (
          specResults: any[],
        ) => ({ specResults }),
      },
    );

    return {
      session,
      executedPlans,
      hostMessages,
      restore() {
        (globalThis as any).__testifyHost =
          previousHost;
        (globalThis as any).session =
          previousSession;
      },
    };
  }

  it('installs the live RunnerSession as the Playground handle', () => {
    const harness = createHarness();

    try {
      expect(
        (globalThis as any).session,
      ).toBe(harness.session);
      expect(
        typeof harness.session.help,
      ).toBe('function');
      expect(
        typeof harness.session.exit,
      ).toBe('function');
    } finally {
      harness.restore();
    }
  });

  it('keeps previous execution state private', async () => {
    const harness = createHarness();

    try {
      await harness.session.runSuite(
        'Forms',
      );

      expect(
        harness.session.last,
      ).toBeUndefined();
      expect(
        harness.session.failures,
      ).toBeUndefined();
    } finally {
      harness.restore();
    }
  });

  it('rerun replans the previous intent against the current revision', async () => {
    const harness = createHarness();

    try {
      await harness.session.runSuite(
        'Forms',
      );

      harness.session.setRevision(2);

      await harness.session.rerun();

      expect(
        harness.executedPlans,
      ).toHaveSize(2);
      expect(
        harness.executedPlans.at(-1)
          .catalogVersion,
      ).toBe(2);
      expect(
        harness.executedPlans.at(-1)
          .source.kind,
      ).toBe('suite');
    } finally {
      harness.restore();
    }
  });

  it('execute records an exact-plan intent and rerun reuses that plan', async () => {
    const harness = createHarness();

    try {
      const plan = {
        specIds: ['spec-1'],
        source: {
          kind: 'spec',
          selector: 'spec-1',
        },
        catalogVersion: 1,
      };

      await harness.session.execute(plan);
      harness.session.setRevision(2);
      await harness.session.rerun();

      expect(
        harness.executedPlans.at(-1),
      ).toBe(plan);
      expect(
        harness.executedPlans.at(-1),
      ).toBe(plan);
    } finally {
      harness.restore();
    }
  });


  it('retry resolves previous failures against the current catalog', async () => {
    const harness = createHarness();

    try {
      await harness.session.execute({
        specIds: ['failed-spec'],
        source: {
          kind: 'spec',
          selector: 'failed-spec',
        },
        catalogVersion: 1,
      });

      harness.session.setRevision(2);

      await harness.session.retry();

      expect(
        harness.executedPlans.at(-1)
          .specIds,
      ).toEqual(['failed-spec']);
      expect(
        harness.executedPlans.at(-1)
          .catalogVersion,
      ).toBe(2);
      expect(
        harness.executedPlans.at(-1)
          .catalogVersion,
      ).toBe(2);
    } finally {
      harness.restore();
    }
  });

  it('keeps discovery collections observable even when empty', () => {
    const harness = createHarness();

    try {
      const tests =
        harness.session.tests('missing');

      expect(
        (tests as any).__testifyCollectionKind,
      ).toBe('tests');
    } finally {
      harness.restore();
    }
  });

  it('sends exit through the host command channel', async () => {
    const harness = createHarness();

    try {
      await harness.session.exit();

      expect(
        harness.hostMessages[0]?.type,
      ).toBe('session:exit');
    } finally {
      harness.restore();
    }
  });

  it('keeps searchable help synchronized with the execution language', () => {
    const harness = createHarness();

    try {
      const help =
        harness.session.help();

      expect(
        (help as any).__testifyCollectionKind,
      ).toBe('help');

      const usages = help.map(
        (entry: any) => entry.usage,
      );

      for (const command of [
        'session.tests(selector?)',
        'session.suites(selector?)',
        'session.files(selector?)',
        'await session.rerun()',
        'await session.retry()',
        'session.plan(selector?, options?)',
        'plan.tests()',
        'plan.filter(test => ...)',
        'plan.slice(start, end)',
        'plan.add(other)',
        'plan.subtract(other)',
        'plan.intersect(other)',
        'plan.not()',
        "plan.where(result, 'passed' | 'failed' | 'unresolved')",
        'await session.execute(plan)',
        'session.refresh()',
        'await session.exit()',
      ]) {
        expect(usages).toContain(command);
      }

      expect(usages).not.toContain(
        'session.last()',
      );
      expect(usages).not.toContain(
        'session.failures()',
      );

      expect(
        (help as any).__testifyHelp,
      ).toEqual(jasmine.objectContaining({
        usage: 'session.help(query?)',
        sections: [
          'discover',
          'run',
          'plan',
          'session',
        ],
        accepts: 'section name or free-text search',
      }));

      const planHelp =
        harness.session.help('plan');

      expect(planHelp.length)
        .toBeGreaterThan(0);
      expect(
        planHelp.every(
          (entry: any) =>
            [
              entry.section,
              entry.usage,
              entry.description,
            ].some((value: string) =>
              value.toLowerCase().includes('plan'),
            ),
        ),
      ).toBeTrue();

      expect(
        () => harness.session.help(123),
      ).toThrowError(
        TypeError,
        'session.help(query?) expects a string query.',
      );

      const missing =
        harness.session.help('definitely-missing');

      expect(missing).toHaveSize(0);
      expect(
        (missing as any).__testifyCollectionKind,
      ).toBe('help');
    } finally {
      harness.restore();
    }
  });

  it('generates syntactically valid browser JavaScript', () => {
    const source =
      getBrowserPlaygroundRuntimeSource();

    expect(
      () => new Function(source),
    ).not.toThrow();
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

function normalizeFileSelectorValue(value: string): string {
  return value
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/\.(?:[cm]?[jt]sx?)$/i, '');
}

export function fileSelectorMatches(
  selector: string | RegExp,
  file: string,
): boolean {
  if (selector instanceof RegExp) {
    selector.lastIndex = 0;
    return selector.test(file);
  }

  const selected = normalizeFileSelectorValue(selector);
  const candidate = normalizeFileSelectorValue(file);

  return (
    candidate === selected ||
    candidate.endsWith('/' + selected) ||
    candidate.split('/').at(-1) === selected.split('/').at(-1)
  );
}

export function getSpecIdsForFiles(
  catalog: TestCatalog,
  selector: string | RegExp,
): string[] {
  const matchingFiles =
    [...new Set(
      catalog.specs
        .map((spec) => spec.file)
        .filter((file): file is string => !!file),
    )].filter((file) =>
      fileSelectorMatches(selector, file),
    );

  const matching = new Set(matchingFiles);
  return catalog.specs
    .filter((spec) => !!spec.file && matching.has(spec.file))
    .map((spec) => spec.id);
}

export function resolveTestSelector(
  catalog: TestCatalog,
  selector: TestSelector,
): string[] {
  if (typeof selector === 'string') {
    const index = createTestCatalogIndex(catalog);
    const exactSpec = index.specById.get(selector);
    if (exactSpec) return [exactSpec.id];

    const exactSuite = index.suiteById.get(selector);
    if (exactSuite) {
      return getSpecIdsForSuitesFromIndex(index, [exactSuite.id]);
    }

    return findCatalogSpecs(catalog, selector).map((spec) => spec.id);
  }

  if (selector instanceof RegExp) {
    return findCatalogSpecs(catalog, selector).map((spec) => spec.id);
  }

  const selections: string[][] = [];

  if (selector.spec) {
    selections.push(
      findCatalogSpecs(catalog, selector.spec).map((spec) => spec.id),
    );
  }

  if (selector.suite) {
    const suites = findCatalogSuites(catalog, selector.suite);
    selections.push(
      getSpecIdsForSuitesFromIndex(
        createTestCatalogIndex(catalog),
        suites.map((suite) => suite.id),
      ),
    );
  }

  if (selector.file) {
    selections.push(getSpecIdsForFiles(catalog, selector.file));
  }

  if (selections.length === 0) return [];
  if (selections.length === 1) return selections[0];

  const [first, ...rest] = selections;
  const restSets = rest.map((ids) => new Set(ids));
  return first.filter((id) => restSets.every((ids) => ids.has(id)));
}


export function getEmbeddedTestSelectionSource(): string {
  return [
    matchesText,
    findCatalogSpecs,
    findCatalogSuites,
    getDescendantSuiteIds,
    getSpecIdsForSuites,
    normalizeFileSelectorValue,
    fileSelectorMatches,
    getSpecIdsForFiles,
    resolveTestSelector,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
````

## File: src/execution-plan.ts
````typescript
import type {
  TestCatalog,
  TestCatalogSpec,
} from './test-catalog';
import {
  resolveTestSelector,
  type TestSelector,
} from './test-selection';
import type {
  ExecutionResult,
  ExecutionSpecResult,
} from './execution-result';

export interface ExecutionPlan {
  specIds: string[];
  random: boolean;
  seed?: number;
  stopOnFailure?: boolean;
  catalogVersion?: number;
  shard?: {
    index: number;
    count: number;
  };
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

export interface ExecutionPlanTest {
  readonly id: string;
  readonly description: string;
  readonly fullName: string;
  readonly suiteId?: string;
  readonly file?: string;
}

export type ExecutionPlanPredicate = (
  test: ExecutionPlanTest,
  index: number,
  tests: readonly ExecutionPlanTest[],
) => unknown;

export interface PlannedExecution
  extends ExecutionPlan {
  tests(): readonly ExecutionPlanTest[];

  filter(
    predicate: ExecutionPlanPredicate,
  ): PlannedExecution;

  slice(
    start?: number,
    end?: number,
  ): PlannedExecution;

  add(
    plan: PlannedExecution,
  ): PlannedExecution;

  subtract(
    plan: PlannedExecution,
  ): PlannedExecution;

  intersect(
    plan: PlannedExecution,
  ): PlannedExecution;

  not(): PlannedExecution;

  where(
    result: ExecutionResult,
    outcome: ExecutionPlanOutcome,
  ): PlannedExecution;
}

export type ExecutionPlanOutcome =
  | 'passed'
  | 'failed'
  | 'unresolved';

export interface ExecutionPlanOptions {
  random?: boolean;
  seed?: number;
  stopOnFailure?: boolean;
}

function snapshotExecutionPlanTest(
  spec: TestCatalogSpec,
): ExecutionPlanTest {
  return Object.freeze({
    id: spec.id,
    description: spec.description,
    fullName: spec.fullName,
    suiteId: spec.suiteId,
    file: spec.file,
  });
}

function getExecutionPlanUniverse(
  plan: PlannedExecution,
): readonly ExecutionPlanTest[] {
  return (
    plan as PlannedExecution & {
      readonly __testifyPlanUniverse:
        readonly ExecutionPlanTest[];
    }
  ).__testifyPlanUniverse;
}

function assertCompatibleExecutionPlans(
  left: PlannedExecution,
  right: PlannedExecution,
): void {
  if (!isPlannedExecution(right)) {
    throw new TypeError(
      'Execution plan operation expects another planned execution.',
    );
  }

  if (
    left.catalogVersion !== undefined &&
    right.catalogVersion !== undefined &&
    left.catalogVersion !== right.catalogVersion
  ) {
    throw new Error(
      'Cannot combine execution plans from different catalog revisions.',
    );
  }

  const leftUniverse =
    getExecutionPlanUniverse(left);
  const rightUniverse =
    getExecutionPlanUniverse(right);

  if (
    leftUniverse.length !==
      rightUniverse.length ||
    leftUniverse.some(
      (test, index) =>
        test.id !==
        rightUniverse[index]?.id,
    )
  ) {
    throw new Error(
      'Cannot combine execution plans from different catalogs.',
    );
  }
}

function getExecutionResultCatalogVersion(
  result: ExecutionResult,
): number | undefined {
  return (
    result as ExecutionResult & {
      readonly __testifyCatalogVersion?: number;
    }
  ).__testifyCatalogVersion;
}

function selectExecutionPlanByResult(
  plan: PlannedExecution,
  tests: readonly ExecutionPlanTest[],
  result: ExecutionResult,
  outcome: ExecutionPlanOutcome,
): readonly ExecutionPlanTest[] {
  if (!result || !Array.isArray(result.specResults)) {
    throw new TypeError(
      'Execution plan outcome selection expects an execution result.',
    );
  }

  if (
    outcome !== 'passed' &&
    outcome !== 'failed' &&
    outcome !== 'unresolved'
  ) {
    throw new TypeError(
      'Execution plan where expects passed, failed, or unresolved.',
    );
  }

  const resultVersion =
    getExecutionResultCatalogVersion(result);

  if (
    plan.catalogVersion !== undefined &&
    resultVersion !== undefined &&
    plan.catalogVersion !== resultVersion
  ) {
    throw new Error(
      'Cannot classify an execution plan with a result from a different catalog revision.',
    );
  }

  const universeIds = new Set(
    getExecutionPlanUniverse(plan).map(
      (test) => test.id,
    ),
  );
  const resultsById =
    new Map<string, ExecutionSpecResult>();

  for (const specResult of result.specResults) {
    if (!specResult || typeof specResult.id !== 'string') {
      throw new TypeError(
        'Execution result contains an invalid test identity.',
      );
    }

    if (!universeIds.has(specResult.id)) {
      throw new Error(
        `Execution result contains tests outside this plan catalog: ${specResult.id}.`,
      );
    }

    resultsById.set(specResult.id, specResult);
  }

  return tests.filter((test) => {
    const status = resultsById.get(test.id)?.status;

    if (outcome === 'passed') {
      return status === 'passed';
    }

    if (outcome === 'failed') {
      return status === 'failed';
    }

    return status !== 'passed' && status !== 'failed';
  });
}

function attachExecutionPlanOperations(
  plan: ExecutionPlan,
  testSnapshot: readonly ExecutionPlanTest[],
  universeSnapshot: readonly ExecutionPlanTest[],
): PlannedExecution {
  const tests = [...testSnapshot];
  const universe = [...universeSnapshot];

  Object.defineProperty(
    tests,
    '__testifyCollectionKind',
    {
      enumerable: false,
      configurable: false,
      writable: false,
      value: 'tests',
    },
  );

  Object.freeze(tests);
  Object.freeze(universe);

  const createDerivedPlan = (
    selected: readonly ExecutionPlanTest[],
    options: {
      clearShard?: boolean;
    } = {},
  ): PlannedExecution => {
    const nextPlan =
      cloneExecutionPlanData(
        plan,
        selected.map(
          (test) => test.id,
        ),
      );

    if (options.clearShard) {
      delete nextPlan.shard;
    }

    return attachExecutionPlanOperations(
      nextPlan,
      selected,
      universe,
    );
  };

  Object.defineProperties(
    plan,
    {
      __testifyPlanUniverse: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: universe,
      },
      tests: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: () => tests,
      },
      filter: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (
          predicate: ExecutionPlanPredicate,
        ) => {
          if (
            typeof predicate !== 'function'
          ) {
            throw new TypeError(
              'Execution plan filter expects a predicate function.',
            );
          }

          return createDerivedPlan(
            tests.filter(
              (test, index) =>
                Boolean(
                  predicate(
                    test,
                    index,
                    tests,
                  ),
                ),
            ),
          );
        },
      },
      slice: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (
          start?: number,
          end?: number,
        ) =>
          createDerivedPlan(
            tests.slice(
              start,
              end,
            ),
          ),
      },
      add: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (
          other: PlannedExecution,
        ) => {
          const current =
            plan as PlannedExecution;

          assertCompatibleExecutionPlans(
            current,
            other,
          );

          const selectedIds =
            new Set(
              tests.map(
                (test) => test.id,
              ),
            );
          const selected = [...tests];

          for (const test of other.tests()) {
            if (!selectedIds.has(test.id)) {
              selectedIds.add(test.id);
              selected.push(test);
            }
          }

          return createDerivedPlan(
            selected,
            { clearShard: true },
          );
        },
      },
      subtract: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (
          other: PlannedExecution,
        ) => {
          const current =
            plan as PlannedExecution;

          assertCompatibleExecutionPlans(
            current,
            other,
          );

          const excluded =
            new Set(other.specIds);

          return createDerivedPlan(
            tests.filter(
              (test) =>
                !excluded.has(test.id),
            ),
          );
        },
      },
      intersect: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (
          other: PlannedExecution,
        ) => {
          const current =
            plan as PlannedExecution;

          assertCompatibleExecutionPlans(
            current,
            other,
          );

          const included =
            new Set(other.specIds);

          return createDerivedPlan(
            tests.filter(
              (test) =>
                included.has(test.id),
            ),
          );
        },
      },
      not: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: () => {
          const excluded =
            new Set(plan.specIds);

          return createDerivedPlan(
            universe.filter(
              (test) =>
                !excluded.has(test.id),
            ),
            { clearShard: true },
          );
        },
      },
      where: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: (
          result: ExecutionResult,
          outcome: ExecutionPlanOutcome,
        ) =>
          createDerivedPlan(
            selectExecutionPlanByResult(
              plan as PlannedExecution,
              tests,
              result,
              outcome,
            ),
          ),
      },
    },
  );

  return plan as PlannedExecution;
}

function cloneExecutionPlanData(
  plan: ExecutionPlan,
  specIds: string[] = [...plan.specIds],
): ExecutionPlan {
  return {
    ...plan,
    specIds: [...specIds],
    source: {
      ...plan.source,
    },
    shard:
      plan.shard
        ? { ...plan.shard }
        : undefined,
  };
}

export function createPlannedExecution(
  plan: ExecutionPlan,
  catalog: TestCatalog,
): PlannedExecution {
  const universe =
    catalog.specs.map(
      snapshotExecutionPlanTest,
    );

  const testsById =
    new Map(
      universe.map(
        (test) => [
          test.id,
          test,
        ] as const,
      ),
    );

  const tests =
    plan.specIds.flatMap(
      (id) => {
        const test =
          testsById.get(id);

        return test
          ? [test]
          : [];
      },
    );

  return attachExecutionPlanOperations(
    plan,
    tests,
    universe,
  );
}

export function isPlannedExecution(
  plan: ExecutionPlan,
): plan is PlannedExecution {
  const candidate =
    plan as Partial<PlannedExecution>;

  return (
    typeof candidate.tests === 'function' &&
    typeof candidate.filter === 'function' &&
    typeof candidate.slice === 'function' &&
    typeof candidate.add === 'function' &&
    typeof candidate.subtract === 'function' &&
    typeof candidate.intersect === 'function' &&
    typeof candidate.not === 'function' &&
    typeof candidate.where === 'function' &&
    Array.isArray(
      (candidate as PlannedExecution & {
        __testifyPlanUniverse?: unknown;
      }).__testifyPlanUniverse,
    )
  );
}

export function createExecutionPlan(
  catalog: TestCatalog,
  selector?: TestSelector,
  options: ExecutionPlanOptions = {},
): PlannedExecution {
  const specIds =
    selector === undefined
      ? catalog.specs.map(
          (spec) => spec.id,
        )
      : resolveTestSelector(
          catalog,
          selector,
        );

  return createPlannedExecution(
    {
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
    },
    catalog,
  );
}

export function createSpecExecutionPlan(
  catalog: TestCatalog,
  selector: string | RegExp,
  options: ExecutionPlanOptions = {},
): PlannedExecution {
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
): PlannedExecution {
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
): PlannedExecution {
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

  const kinds = [
    selector.spec ? 'spec' : undefined,
    selector.suite ? 'suite' : undefined,
    selector.file ? 'file' : undefined,
  ].filter(Boolean);

  if (kinds.length !== 1) return 'selector';
  return kinds[0] as 'spec' | 'suite' | 'file';
}

export function shardExecutionPlan(
  plan: PlannedExecution,
  index: number,
  count: number,
): PlannedExecution;
export function shardExecutionPlan(
  plan: ExecutionPlan,
  index: number,
  count: number,
): ExecutionPlan;
export function shardExecutionPlan(
  plan: ExecutionPlan,
  index: number,
  count: number,
): ExecutionPlan {
  if (
    !Number.isInteger(index) ||
    !Number.isInteger(count) ||
    count <= 0 ||
    index < 0 ||
    index >= count
  ) {
    throw new RangeError(
      'Invalid execution shard.',
    );
  }

  const selectedIds =
    plan.specIds.filter(
      (
        _,
        specIndex,
      ) =>
        specIndex % count ===
        index,
    );

  const sharded: ExecutionPlan = {
    ...cloneExecutionPlanData(
      plan,
      selectedIds,
    ),
    shard: {
      index,
      count,
    },
  };

  if (!isPlannedExecution(plan)) {
    return sharded;
  }

  const selectedIdsSet =
    new Set(selectedIds);

  return attachExecutionPlanOperations(
    sharded,
    plan.tests().filter(
      (test) =>
        selectedIdsSet.has(
          test.id,
        ),
    ),
    getExecutionPlanUniverse(plan),
  );
}

export function partitionExecutionPlan(
  plan: PlannedExecution,
  count: number,
): PlannedExecution[];
export function partitionExecutionPlan(
  plan: ExecutionPlan,
  count: number,
): ExecutionPlan[];
export function partitionExecutionPlan(
  plan: ExecutionPlan,
  count: number,
): ExecutionPlan[] {
  if (
    !Number.isInteger(count) ||
    count <= 0
  ) {
    throw new RangeError(
      'Execution partition count must be a positive integer.',
    );
  }

  return Array.from(
    { length: count },
    (_, index) =>
      shardExecutionPlan(
        plan,
        index,
        count,
      ),
  );
}

export function getEmbeddedExecutionPlanSource():
  string {
  return [
    snapshotExecutionPlanTest,
    cloneExecutionPlanData,
    getExecutionPlanUniverse,
    assertCompatibleExecutionPlans,
    getExecutionResultCatalogVersion,
    selectExecutionPlanByResult,
    attachExecutionPlanOperations,
    createPlannedExecution,
    isPlannedExecution,
    inferSelectorKind,
    createExecutionPlan,
    createSpecExecutionPlan,
    createSuiteExecutionPlan,
    createFileExecutionPlan,
    shardExecutionPlan,
    partitionExecutionPlan,
  ]
    .map((fn) => fn.toString())
    .join('\n\n');
}
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
          "        await import('./forms.spec.mjs');",
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
      "./forms.spec.mjs",
    );

    expect(source).toContain(
      'function __name(target, value)',
    );
  });

  it('keeps process lifecycle concerns out of the generated runner', () => {
    const source =
      createNodeRunnerModuleSource({
        jasmineCoreUrl:
          'file:///jasmine.js',
        imports: '',
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

    expect(source).not.toContain(
      "process.on(",
    );

    expect(source).not.toContain(
      "process.exit(",
    );

    expect(source).not.toContain(
      "pathToFileURL",
    );

    expect(source).toContain(
      'export async function run(',
    );

    expect(source).not.toContain(
      'new Promise(',
    );
  });

  it('does not read process environment or patch console in generated runtime', () => {
    const source =
      createNodeRunnerModuleSource({
        jasmineCoreUrl:
          'file:///jasmine.js',
        imports: '',
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

    expect(source).not.toContain(
      'TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS',
    );

    expect(source).not.toContain(
      'process.env',
    );

    expect(source).not.toContain(
      'restoreConsole',
    );

    expect(source).not.toContain(
      'console[method] = () => {}',
    );
  });

  it('contains the metadata dependency required by TestCatalog', () => {
    const source =
      createNodeRunnerModuleSource({
        jasmineCoreUrl:
          'file:///jasmine.js',
        imports: '',
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
      'function getTestifyFile(',
    );

    expect(source).toContain(
      'function createTestCatalogFromJasmineEnv(',
    );

    expect(
      source.indexOf(
        'function getTestifyFile(',
      ),
    ).toBeLessThan(
      source.indexOf(
        'function createTestCatalogFromJasmineEnv(',
      ),
    );
  });

  it('embeds test selection helpers so generated Node runners can honor CLI selectors', () => {
    const source = createNodeRunnerModuleSource({
      jasmineCoreUrl: 'file:///jasmine-core.js',
      imports: '',
      config: {
        srcDirs: [],
        testDirs: [],
        exclude: [],
        outDir: 'dist',
        preserveOutputs: false,
      },
    });

    expect(source).toContain('function resolveTestSelector');
    expect(source).toContain('function fileSelectorMatches');
    expect(
      source.match(/function createTestCatalogIndex\(/g)?.length,
    ).toBe(1);
  });

});
````

## File: src/browser-playground-runtime.ts
````typescript
export function getBrowserPlaygroundRuntimeSource(): string {
  return `
function installTestifyPlayground(
  session,
  context,
) {
  const {
    currentPlanOptions,
    setSeed,
    resetSeed,
    summarizeExecutionResults,
  } = context;

  const executeSessionPlan =
    session.execute.bind(session);
  const baseTests =
    session.tests.bind(session);
  const baseSuites =
    session.suites.bind(session);
  const baseFiles =
    session.files.bind(session);
  const basePlan =
    session.plan.bind(session);
  const basePlanSpec =
    session.planSpec.bind(session);
  const basePlanSuite =
    session.planSuite.bind(session);
  const basePlanFile =
    session.planFile.bind(session);

  function observableCollection(
    kind,
    values,
  ) {
    Object.defineProperty(
      values,
      '__testifyCollectionKind',
      {
        enumerable: false,
        configurable: true,
        writable: false,
        value: kind,
      },
    );

    return values;
  }

  let lastExecution = null;

  function emptyResult() {
    return summarizeExecutionResults([]);
  }

  async function executeRecordedPlan(
    plan,
    intent,
  ) {
    const result =
      await executeSessionPlan(
        plan,
      );

    lastExecution = {
      plan,
      result,
      intent,
      revision:
        plan.catalogVersion ??
        session.revision(),
    };

    return result;
  }

  function collectFailures() {
    const failed =
      lastExecution?.result?.specResults?.filter(
        (result) =>
          result.status === 'failed',
      ) ?? [];

    if (!lastExecution) {
      console.info(
        '[Testify] Nothing has run yet.',
      );

      return observableCollection(
        'results',
        [],
      );
    }

    if (!failed.length) {
      console.info(
        '[Testify] No failures in the last run.',
      );

      return observableCollection(
        'results',
        [],
      );
    }

    return observableCollection(
      'results',
      failed,
    );
  }

  function resolveFailureSpecIds(
    failures,
    tests,
  ) {
    const failedNames =
      new Set(
        failures
          .map(
            (result) =>
              result.fullName,
          )
          .filter(Boolean),
      );

    const failedIds =
      new Set(
        failures.map(
          (result) =>
            result.id,
        ),
      );

    return tests
      .filter(
        (test) =>
          failedIds.has(
            test.id,
          ) ||
          failedNames.has(
            test.fullName,
          ),
      )
      .map(
        (test) =>
          test.id,
      );
  }

  function planIntent(intent) {
    switch (intent?.kind) {
      case 'all':
        return basePlan();

      case 'run':
        return basePlan(
          intent.selector,
          intent.options,
        );

      case 'spec':
        return basePlanSpec(
          intent.selector,
          intent.options,
        );

      case 'suite':
        return basePlanSuite(
          intent.selector,
          intent.options,
        );

      case 'file':
        return basePlanFile(
          intent.selector,
          intent.options,
        );

      case 'retry': {
        const plan =
          basePlan(
            undefined,
            currentPlanOptions(),
          );
        const specIds =
          resolveFailureSpecIds(
            intent.failures,
            plan.tests(),
          );

        if (!specIds.length) {
          return null;
        }

        const selectedIds =
          new Set(specIds);

        return plan
          .filter(
            (test) =>
              selectedIds.has(
                test.id,
              ),
          );
      }

      case 'plan':
      default:
        return lastExecution?.plan ?? null;
    }
  }

  async function rerunLastExecution() {
    if (!lastExecution) {
      console.info(
        '[Testify] Nothing to rerun yet.',
      );

      return emptyResult();
    }

    const plan =
      planIntent(
        lastExecution.intent,
      );

    if (!plan) {
      console.warn(
        '[Testify] The previous selection is no longer present in the current catalog.',
      );

      return emptyResult();
    }

    return executeRecordedPlan(
      plan,
      lastExecution.intent,
    );
  }

  async function retryFailures() {
    const failures =
      collectFailures();

    if (!failures.length) {
      return emptyResult();
    }

    const intent = {
      kind: 'retry',
      failures: failures.map(
        (result) => ({
          id: result.id,
          fullName: result.fullName,
        }),
      ),
    };

    const plan =
      planIntent(intent);

    if (!plan) {
      console.warn(
        '[Testify] Previous failures are no longer present in the current catalog.',
      );

      return emptyResult();
    }

    return executeRecordedPlan(
      plan,
      intent,
    );
  }

  function formatSelector(selector) {
    if (selector instanceof RegExp) {
      return selector.toString();
    }

    return JSON.stringify(selector);
  }

  async function runSelection(
    kind,
    selector,
    options,
    findMatches,
    planMatches,
    listCommand,
  ) {
    if (
      selector === undefined ||
      selector === null ||
      selector === ''
    ) {
      console.warn(
        '[Testify] Missing ' + kind + ' selector.',
      );

      console.info(
        'Try ' + listCommand,
      );

      return emptyResult();
    }

    const matches =
      findMatches(selector);

    if (!matches.length) {
      console.warn(
        '[Testify] No ' + kind + 's matched ' + formatSelector(selector) + '.',
      );

      console.info(
        'Try ' + listCommand,
      );

      return emptyResult();
    }

    if (matches.length > 1) {
      console.info(
        '[Testify] ' + matches.length + ' ' + kind + 's matched ' + formatSelector(selector) + '.',
      );

      console.info(
        observableCollection(
          kind === 'spec'
            ? 'tests'
            : kind === 'suite'
              ? 'suites'
              : 'files',
          matches,
        ),
      );
    }

    const intent = {
      kind,
      selector,
      options,
    };

    return executeRecordedPlan(
      planMatches(
        selector,
        options,
      ),
      intent,
    );
  }

  const helpEntries = Object.freeze([
    { section: 'Discover', usage: 'session.tests(selector?)', description: 'Tests in the current catalog' },
    { section: 'Discover', usage: 'session.suites(selector?)', description: 'Suites in the current catalog' },
    { section: 'Discover', usage: 'session.files(selector?)', description: 'Files in the current catalog' },

    { section: 'Run', usage: 'await session.run(selector?, options?)', description: 'Resolve new intent, create a fresh plan, and execute it' },
    { section: 'Run', usage: 'await session.runSpec(selector, options?)', description: 'Run matching specs' },
    { section: 'Run', usage: 'await session.runSuite(selector, options?)', description: 'Run matching suites' },
    { section: 'Run', usage: 'await session.runFile(selector, options?)', description: 'Run matching files' },
    { section: 'Run', usage: 'await session.rerun()', description: 'Repeat the previous execution intent against the current catalog' },
    { section: 'Run', usage: 'await session.retry()', description: 'Retry previous failures against the current catalog' },

    { section: 'Plan', usage: 'session.plan(selector?, options?)', description: 'Resolve test intent without executing it' },
    { section: 'Plan', usage: 'session.planSpec(selector, options?)', description: 'Create a plan from matching specs' },
    { section: 'Plan', usage: 'session.planSuite(selector, options?)', description: 'Create a plan from matching suites' },
    { section: 'Plan', usage: 'session.planFile(selector, options?)', description: 'Create a plan from matching files' },
    { section: 'Plan', usage: 'plan.tests()', description: 'Exact tests selected by the plan' },
    { section: 'Plan', usage: 'plan.filter(test => ...)', description: 'Create a filtered plan' },
    { section: 'Plan', usage: 'plan.slice(start, end)', description: 'Create a positional subset' },
    { section: 'Plan', usage: 'plan.add(other)', description: 'Combine compatible plans' },
    { section: 'Plan', usage: 'plan.subtract(other)', description: 'Remove tests contained in another compatible plan' },
    { section: 'Plan', usage: 'plan.intersect(other)', description: 'Keep tests shared by compatible plans' },
    { section: 'Plan', usage: 'plan.not()', description: 'Select the catalog complement of this plan' },
    { section: 'Plan', usage: "plan.where(result, 'passed' | 'failed' | 'unresolved')", description: 'Keep tests by outcome from an execution result' },
    { section: 'Plan', usage: 'await session.execute(plan)', description: 'Execute this exact plan' },
    { section: 'Plan', usage: 'session.shard(plan, index, count)', description: 'Create one deterministic shard' },
    { section: 'Plan', usage: 'session.partition(plan, count)', description: 'Partition a plan into deterministic shards' },

    { section: 'Session', usage: 'session.state', description: 'Current session state' },
    { section: 'Session', usage: 'session.stats()', description: 'Current session statistics' },
    { section: 'Session', usage: 'session.revision()', description: 'Current catalog revision' },
    { section: 'Session', usage: 'session.changes()', description: 'Catalog changes from the latest refresh' },
    { section: 'Session', usage: 'session.refresh()', description: 'Refresh the current catalog' },
    { section: 'Session', usage: 'session.setSeed(12345)', description: 'Set the execution seed' },
    { section: 'Session', usage: 'session.resetSeed()', description: 'Reset the execution seed' },
    { section: 'Session', usage: 'session.reload()', description: 'Reload the Playground page' },
    { section: 'Session', usage: 'await session.exit()', description: 'Close the live session and browser' },
  ].map((entry) => Object.freeze(entry)));

  const helpSections = Object.freeze([
    'discover',
    'run',
    'plan',
    'session',
  ]);

  function sessionHelp(query) {
    if (
      query !== undefined &&
      typeof query !== 'string'
    ) {
      throw new TypeError(
        'session.help(query?) expects a string query.',
      );
    }

    const needle =
      query === undefined
        ? ''
        : query.trim().toLowerCase();

    const entries = !needle
      ? [...helpEntries]
      : helpEntries.filter((entry) =>
          [
            entry.section,
            entry.usage,
            entry.description,
          ].some((value) =>
            value.toLowerCase().includes(needle),
          ),
        );

    const help = observableCollection(
      'help',
      entries,
    );

    Object.defineProperty(
      help,
      '__testifyHelp',
      {
        enumerable: false,
        configurable: false,
        writable: false,
        value: Object.freeze({
          usage: 'session.help(query?)',
          query: needle || undefined,
          sections: helpSections,
          accepts: 'section name or free-text search',
        }),
      },
    );

    return help;
  }

  Object.assign(
    session,
    {
      help:
        sessionHelp,

      tests: (selector) =>
        observableCollection(
          'tests',
          baseTests(selector),
        ),

      suites: (selector) =>
        observableCollection(
          'suites',
          baseSuites(selector),
        ),

      files: (selector) =>
        observableCollection(
          'files',
          baseFiles(selector),
        ),

      execute: (plan) =>
        executeRecordedPlan(
          plan,
          {
            kind: 'plan',
          },
        ),

      run: (
        selector,
        options = {},
      ) => {
        const intent =
          selector === undefined
            ? {
                kind: 'all',
              }
            : {
                kind: 'run',
                selector,
                options,
              };

        return executeRecordedPlan(
          session.plan(
            selector,
            options,
          ),
          intent,
        );
      },

      runSpec: (
        selector,
        options = {},
      ) =>
        runSelection(
          'spec',
          selector,
          options,
          (value) =>
            session.tests(value),
          (value, nextOptions) =>
            session.planSpec(
              value,
              nextOptions,
            ),
          'session.tests(...)',
        ),

      runSuite: (
        selector,
        options = {},
      ) =>
        runSelection(
          'suite',
          selector,
          options,
          (value) =>
            session.suites(value),
          (value, nextOptions) =>
            session.planSuite(
              value,
              nextOptions,
            ),
          'session.suites(...)',
        ),

      runFile: (
        selector,
        options = {},
      ) =>
        runSelection(
          'file',
          selector,
          options,
          (value) =>
            session.files(value),
          (value, nextOptions) =>
            session.planFile(
              value,
              nextOptions,
            ),
          'session.files(...)',
        ),


      rerun:
        rerunLastExecution,

      retry:
        retryFailures,

      setSeed,
      resetSeed,

      reload: () =>
        location.reload(),

      exit: async () => {
        const host =
          globalThis.__testifyHost;

        if (!host?.send) {
          throw new Error(
            'Testify host connection is unavailable.',
          );
        }

        host.send({
          type: 'session:exit',
          timestamp: Date.now(),
        });
      },
    },
  );

  globalThis.session = session;

  console.log(
    '%c✅ Testify Playground ready!',
    'color: green; font-weight: bold;',
  );
  console.log(
    '💡 Browser console: session.help() · session.tests() · session.retry()',
  );

  return session;
}
`;
}
````

## File: src/vite-config-builder.ts
````typescript
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { builtinModules, createRequire } from 'module';
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
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

export class ViteConfigBuilder {
  private inputMap: Record<string, string> = {};

  private nodeExternalPackages:
    Set<string> | null = null;

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

  private getNodeExternalPackages():
    Set<string> {
    if (this.nodeExternalPackages) {
      return this.nodeExternalPackages;
    }

    const packages =
      new Set<string>();

    try {
      const packagePath =
        path.resolve(
          process.cwd(),
          'package.json',
        );

      if (fs.existsSync(packagePath)) {
        const manifest =
          JSON.parse(
            fs.readFileSync(
              packagePath,
              'utf8',
            ),
          ) as PackageManifest;

        for (
          const group of [
            manifest.dependencies,
            manifest.devDependencies,
            manifest.peerDependencies,
            manifest.optionalDependencies,
          ]
        ) {
          for (
            const packageName of
            Object.keys(
              group ?? {},
            )
          ) {
            packages.add(
              packageName,
            );
          }
        }
      }
    } catch {
      // Dependency externalization is an optimization/isolation boundary.
      // A malformed package.json should still be reported by the normal
      // project/tooling path instead of making Testify config construction fail.
    }

    this.nodeExternalPackages =
      packages;

    return packages;
  }

  private isNodeExternal(
    id: string,
  ): boolean {
    // Testify-owned/project modules still go through the build.
    if (
      id.startsWith('.') ||
      id.startsWith('/') ||
      path.isAbsolute(id)
    ) {
      return false;
    }

    // Node built-ins must stay native imports.
    if (
      id.startsWith('node:') ||
      builtinModules.includes(id)
    ) {
      return true;
    }

    // Any remaining bare specifier is a package import.
    // In Node mode, Node owns package resolution. Bundling these is what
    // allowed Vite to substitute browser stubs such as __vite-browser-external.
    return true;
  }

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
      const outputName =
        this.buildOutputName(
          file,
        );
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
      return `${sanitizedBaseName}__${hash}.spec`;
    }

    return `${sanitizedBaseName}__${hash}`;
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
          emptyOutDir: false,
          sourcemap: true,
          target: 'es2022',
          minify: false,
          // Node mode must use Node/SSR resolution semantics so Vite never
          // substitutes browser stubs for built-ins such as `events`.
          ssr:
            isNodeTarget
              ? true
              : undefined,

          modulePreload:
            isNodeTarget
              ? false
              : true,

          rolldownOptions: {
            input,
            external:
              isNodeTarget
                ? (id) =>
                    this.isNodeExternal(
                      id,
                    )
                : undefined,
            preserveEntrySignatures: incremental
              ? 'allow-extension'
              : 'strict',

            onwarn,

            output: {
              format: 'es',
              entryFileNames: '[name].mjs',
              chunkFileNames:
                isNodeTarget
                  ? '[name].mjs'
                  : 'vendor.mjs',
              manualChunks:
                isNodeTarget
                  ? undefined
                  : id =>
                      this.vendorChunk(
                        id,
                      )
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

    return this.normalizeGeneratedOutput(
      this.normalizeAliasConfig(
        this.mergeUserConfig(
          this.baseConfig(
            this.inputMap,
            false,
          ),
        ),
      ),
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

    return this.normalizeGeneratedOutput(
      this.normalizeAliasConfig(
        this.mergeUserConfig(
          this.baseConfig(
            this.inputMap,
            true,
            cache,
          ),
        ),
      ),
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

  private normalizeGeneratedOutput(
    config: InlineConfig,
  ): InlineConfig {
    const rolldownOptions =
      config.build
        ?.rolldownOptions;

    if (!rolldownOptions) {
      return config;
    }

    const normalizeOutput = (
      entry: NonNullable<
        typeof rolldownOptions.output
      > extends readonly (infer T)[]
        ? T
        : NonNullable<
            typeof rolldownOptions.output
          >,
    ) => ({
      ...(entry as any),
      entryFileNames:
        '[name].mjs',
    });

    const output =
      Array.isArray(
        rolldownOptions.output,
      )
        ? rolldownOptions.output.map(
            (entry) =>
              normalizeOutput(
                entry as any,
              ),
          )
        : normalizeOutput(
            (
              rolldownOptions.output ??
              {}
            ) as any,
          );

    return {
      ...config,
      build: {
        ...config.build,
        rolldownOptions: {
          ...rolldownOptions,
          output,
        },
      },
    };
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

const buildFilePath =
  fileURLToPath(
    import.meta.url,
  );

const buildDirectory =
  path.dirname(
    buildFilePath,
  );

const mainPackage =
  JSON.parse(
    fs.readFileSync(
      path.join(
        buildDirectory,
        'package.json',
      ),
      'utf8',
    ),
  );

const distRoot =
  path.join(
    buildDirectory,
    'dist/testify',
  );

function ensureDir(
  dirPath,
) {
  fs.mkdirSync(
    dirPath,
    { recursive: true },
  );
}

function copyFile(
  from,
  to,
) {
  ensureDir(
    path.dirname(to),
  );

  fs.copyFileSync(
    from,
    to,
  );
}

const distPackage = {
  name:
    mainPackage.name,
  version:
    mainPackage.version,
  description:
    mainPackage.description,
  type:
    'module',
  types:
    mainPackage.types,
  exports:
    mainPackage.exports,
  bin:
    mainPackage.bin,
  files: [
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    'package.json',
    'assets/',
    'bin/',
    'lib/',
  ],
  repository:
    mainPackage.repository,
  bugs:
    mainPackage.bugs,
  homepage:
    mainPackage.homepage,
  keywords:
    mainPackage.keywords ?? [],
  author:
    mainPackage.author,
  license:
    mainPackage.license,
  engines:
    mainPackage.engines,
  dependencies:
    mainPackage.dependencies ?? {},
  peerDependencies:
    mainPackage.peerDependencies ?? {},
  overrides:
    mainPackage.overrides ?? {},
  publishConfig:
    mainPackage.publishConfig,
  testifySetup: {
    jasmineTypesVersion:
      mainPackage.devDependencies?.[
        '@types/jasmine'
      ],
  },
};

ensureDir(
  distRoot,
);

fs.writeFileSync(
  path.join(
    distRoot,
    'package.json',
  ),
  JSON.stringify(
    distPackage,
    null,
    2,
  ) + '\n',
);

copyFile(
  path.join(
    buildDirectory,
    'assets/favicon.ico',
  ),
  path.join(
    distRoot,
    'assets/favicon.ico',
  ),
);
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
  black: '\x1b[30m',
  red: '\x1b[31m',
  brightRed: '\x1b[91m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  brightGreen: '\x1b[92m',
  gray: '\x1b[90m',
};

type LogMessageKey = keyof typeof LOG_MESSAGES;

function areTestLogsSuppressed(): boolean {
  return (globalThis as any).__testifySuppressLogs === true;
}

interface LoggedLine {
  text: string;
  isRaw?: boolean;
  hasPrompt?: boolean;
}

export class Logger {
  private previousLines: LoggedLine[] = [];
  private showPrompt = true;
  private prompt: string;
  private plainPrompt = '> ';

  constructor() {
    this.prompt = `${colors.bold}${colors.brightGreen}> ${colors.reset}`;
  }

  // ─── New API: structured log messages ────────────────────

  public log<T extends LogMessageKey>(
    key: T,
    ...args: Parameters<(typeof LOG_MESSAGES)[T]['text']>
  ) {
    if (areTestLogsSuppressed()) return;

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
    if (areTestLogsSuppressed()) return true;

    const prompt =
      supportsColor()
        ? this.prompt
        : this.plainPrompt;
    const lines = msg.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const formatted =
        this.formatLine(lines[i]);
      const renderedLine =
        i === 0 &&
        this.showPrompt &&
        !formatted.hasOwnPrompt
          ? prompt + formatted.text
          : formatted.text;

      this.writeLine(
        renderedLine,
        formatted.color,
      );
      if (i < lines.length - 1) process.stdout.write('\n');
      this.addLine(renderedLine);
    }
    this.showPrompt = false;
    return true;
  }

  println(msg = '') {
    if (areTestLogsSuppressed()) return true;

    if (msg) this.print(msg);
    process.stdout.write('\n');
    this.addLine('');
    this.showPrompt = true;
    return true;
  }

  printRaw(line: string) {
    if (areTestLogsSuppressed()) return true;

    process.stdout.write(line);
    this.addLine(line, { isRaw: true });
    return true;
  }

  printlnRaw(line = '') {
    if (areTestLogsSuppressed()) return true;

    this.printRaw(line);
    process.stdout.write('\n');
    this.addLine('', { isRaw: true });
    return true;
  }

  error(msg: string) {
    if (areTestLogsSuppressed()) return true;

    msg = this.stripLegacyPrefix(
      msg,
      'error',
    );
    const lines = msg.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const formatted =
        this.formatLine(
          lines[i],
          {
            forceErrorPrefix:
              i === 0,
            forceColor:
              supportsColor()
                ? colors.red
                : '',
          },
        );

      this.writeLine(
        formatted.text,
        formatted.color,
      );
      if (i < lines.length - 1) process.stdout.write('\n');
      this.addLine(
        formatted.text,
      );
    }
    process.stdout.write('\n');
    this.showPrompt = true;
    return true;
  }

  warn(msg: string) {
    if (areTestLogsSuppressed()) return true;

    msg = this.stripLegacyPrefix(
      msg,
      'warn',
    );
    const lines = msg.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const formatted =
        this.formatLine(
          lines[i],
          {
            forceWarnPrefix:
              i === 0,
          },
        );

      this.writeLine(
        formatted.text,
        formatted.color,
      );
      if (i < lines.length - 1) process.stdout.write('\n');
      this.addLine(
        formatted.text,
      );
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

  private formatLine(
    line: string,
    options: {
      forceErrorPrefix?: boolean;
      forceWarnPrefix?: boolean;
      forceColor?: string;
    } = {},
  ): {
    text: string;
    color: string;
    hasOwnPrompt: boolean;
  } {
    const errorToken =
      '%error% ';
    const warnToken =
      '%warn% ';
    const shouldPrefixError =
      options.forceErrorPrefix &&
      !line.startsWith(errorToken);
    const shouldPrefixWarn =
      options.forceWarnPrefix &&
      !line.startsWith(warnToken);
    const sourceLine =
      shouldPrefixError
        ? errorToken + line
        : shouldPrefixWarn
          ? warnToken + line
          : line;

    if (
      sourceLine.startsWith(
        errorToken,
      )
    ) {
      return {
        text:
          this.errorPrefix() +
          replacePlaceholders(
            sourceLine.slice(
              errorToken.length,
            ),
          ),
        color:
          options.forceColor ??
          (supportsColor()
            ? colors.red
            : ''),
        hasOwnPrompt: true,
      };
    }

    if (
      sourceLine.startsWith(
        warnToken,
      )
    ) {
      return {
        text:
          this.warnPrefix() +
          replacePlaceholders(
            sourceLine.slice(
              warnToken.length,
            ),
          ),
        color: '',
        hasOwnPrompt: true,
      };
    }

    return {
      text: replacePlaceholders(
        sourceLine,
      ),
      color:
        options.forceColor ?? '',
      hasOwnPrompt: false,
    };
  }

  private stripLegacyPrefix(
    message: string,
    type: 'error' | 'warn',
  ): string {
    const marker =
      type === 'error'
        ? '%error%'
        : '%warn%';

    return message
      .split('\n')
      .map((line) =>
        line.replace(
          new RegExp(
            `^(?:${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+|\\[(?:ERROR|WARN|INFO|BROWSER|FILE|TREE|STOP|TIP|START|WAIT|READY|ADD|REM|DIR|BUILD|RETRY|CLEAN|LOCK|HMR|WS|CONN|OK|WATCH)\\]|[^\\p{L}\\p{N}\\s"'\\\`([{<]+)\\s+`,
            'u',
          ),
          '',
        ),
      )
      .join('\n');
  }

  private errorPrefix(): string {
    return supportsColor()
      ? `${colors.bold}${colors.black}${colors.bgRed} ERROR ${colors.red}`
      : '[ERROR] ';
  }

  private warnPrefix(): string {
    return supportsColor()
      ? `${colors.bold}${colors.black}${colors.bgYellow} WARN ${colors.reset}`
      : 'WARN ';
  }

}

// Export a singleton instance for project-wide use
export const logger = new Logger();
````

## File: src/ts-jasmine-cli.ts
````typescript
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import util from 'util';
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

async function registerSpecRuntime(
  specPath: string,
): Promise<() => Promise<void>> {
  const tsconfig =
    findNearestTsconfig(
      path.dirname(
        specPath,
      ),
    );

  type TsxRegister = (
    options: {
      tsconfig: string | false;
    },
  ) =>
    | (() => void)
    | (() => Promise<void>);

  const tsxApi =
    await nativeImport(
      'tsx/esm/api',
    ) as {
      register: TsxRegister;
    };

  // Register tsx first. It installs its own CommonJS resolver; Testify then
  // wraps that resolver to add bundler-style relative path compatibility.
  const unregisterTsx =
    tsxApi.register({
      tsconfig:
        tsconfig ?? false,
    });

  const unregisterRelativeResolver =
    registerTestifyRelativeResolver();

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

  const unregisterRuntime =
    await registerSpecRuntime(
      args.spec,
    );
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
        file: 'forms.spec.mjs',
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
        'forms.spec.mjs',
      );

    expect(plan.specIds).toEqual([
      'spec1',
    ]);
    expect(plan.random).toBeTrue();
    expect(plan.seed).toBe(42);
  });

  it('exposes concise Playground discovery methods', () => {
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
      session.tests(),
    ).toHaveSize(1);

    expect(
      session.tests('works')[0]?.id,
    ).toBe('spec1');

    expect(
      session.suites('Forms')[0]?.id,
    ).toBe('suite1');

    expect(
      session.files(/forms/)[0]?.file,
    ).toBe('forms.spec.mjs');
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

  it('keeps the same revision across equivalent catalog snapshots', () => {
    let currentCatalog =
      catalog;

    const session =
      new RunnerSession(
        () => currentCatalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    session.plan();

    currentCatalog = {
      ...catalog,
      suites:
        catalog.suites.map(
          (suite) => ({
            ...suite,
          }),
        ),
      specs:
        catalog.specs.map(
          (spec) => ({
            ...spec,
          }),
        ),
    };

    session.plan();

    expect(
      session.revision(),
    ).toBe(1);

  });
  it('exposes explicit refresh results', () => {
    let currentCatalog = catalog;

    const session =
      new RunnerSession(
        () => currentCatalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    expect(
      session.refresh(),
    ).toEqual({
      changed: false,
      previousRevision: 1,
      revision: 1,
      changes: jasmine.objectContaining({
        version: 1,
        changed: false,
      }),
    });

    currentCatalog = {
      ...catalog,
      specs: [
        ...catalog.specs,
        {
          id: 'spec2',
          description: 'also works',
          fullName: 'Forms also works',
          suiteId: 'suite1',
          file: 'forms.spec.mjs',
        },
      ],
    };

    const refresh =
      session.refresh();

    expect(refresh.changed).toBeTrue();
    expect(refresh.previousRevision).toBe(1);
    expect(refresh.revision).toBe(2);
    expect(
      refresh.changes.addedSpecIds,
    ).toEqual(['spec2']);
    expect(session.changes())
      .toBe(refresh.changes);
  });

  it('allows per-plan options to override session defaults', () => {
    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
        },
        () => ({
          random: false,
          seed: 1,
          stopOnFailure: false,
        }),
      );

    const plan =
      session.planSuite(
        'suite1',
        {
          random: true,
          seed: 42,
        },
      );

    expect(plan.random).toBeTrue();
    expect(plan.seed).toBe(42);
    expect(plan.stopOnFailure).toBeFalse();
  });

  it('keeps plans executable across unrelated catalog additions', async () => {
    let currentCatalog = catalog;
    let executions = 0;

    const session =
      new RunnerSession(
        () => currentCatalog,
        {
          async execute(plan) {
            executions++;
            return plan.specIds;
          },
        },
      );

    const plan =
      session.planSpec('spec1');

    currentCatalog = {
      ...catalog,
      specs: [
        ...catalog.specs,
        {
          id: 'spec2',
          description: 'new',
          fullName: 'Forms new',
          suiteId: 'suite1',
          file: 'forms.spec.mjs',
        },
      ],
    };

    const result =
      await session.execute(plan);

    expect(result).toEqual(['spec1']);
    expect(executions).toBe(1);
  });

  it('rejects a stale plan when selected specs disappear', async () => {
    let currentCatalog = catalog;

    const session =
      new RunnerSession(
        () => currentCatalog,
        {
          async execute() {
            return undefined;
          },
        },
      );

    const plan =
      session.planSpec('spec1');

    currentCatalog = {
      ...catalog,
      specs: [],
    };

    await expectAsync(
      session.execute(plan),
    ).toBeRejectedWithError(
      /Execution plan is stale; missing spec ids: spec1/,
    );
  });

  it('closes once and rejects later operations', async () => {
    let closes = 0;

    const session =
      new RunnerSession(
        () => catalog,
        {
          async execute() {
            return undefined;
          },
          async close() {
            closes++;
          },
        },
      );

    expect(session.state).toBe('ready');

    const first = session.close();
    const second = session.close();

    expect(session.state).toBe('closing');

    await Promise.all([
      first,
      second,
    ]);

    expect(closes).toBe(1);
    expect(session.state).toBe('closed');

    await session.close();
    expect(closes).toBe(1);

    expect(() => session.plan())
      .toThrowError(
        /Testify session is closed/,
      );
  });


  it('marks execution results with the plan catalog revision without changing serialization', async () => {
    const result: any = {
      specResults: [],
      total: 0,
      passed: 0,
      failed: 0,
      pending: 0,
    };

    const session =
      new RunnerSession(
        () => catalog,
        {
          execute: async () => result,
        },
      );

    const plan = session.plan();
    const executed =
      await session.execute(plan);

    expect(
      (executed as any).__testifyCatalogVersion,
    ).toBe(plan.catalogVersion);
    expect(
      JSON.stringify(executed),
    ).not.toContain(
      '__testifyCatalogVersion',
    );
  });

});
````

## File: src/cli-handler.ts
````typescript
import * as fs from "fs";
import * as path from "path";
import { parseArgs } from "node:util";
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

// Keep runtime construction replaceable for tests. ESM namespace exports are
// read-only, so Jasmine cannot safely spy on `createViteJasmineRunner` itself.
export const cliDependencies = {
  createViteJasmineRunner,
};

// ─── argv parsing ───────────────────────────────────────────────────────────
// Declarative flag definitions consumed by node:util's built-in parseArgs.
// Adding a new boolean/string flag means adding one entry here instead of
// hand-scanning `process.argv` with indexOf/includes.

const CLI_OPTIONS = {
  help: { type: 'boolean', short: 'h' },
  version: { type: 'boolean', short: 'v' },
  watch: { type: 'boolean', short: 'w' },
  headless: { type: 'boolean' },
  coverage: { type: 'boolean', short: 'c' },
  exclusive: { type: 'boolean' },
  browser: { type: 'string', short: 'b' },
  ansi: { type: 'boolean' },
  seed: { type: 'string' },
  project: { type: 'string', short: 'p' },
  port: { type: 'string' },
  silent: { type: 'boolean' },
  quiet: { type: 'boolean', short: 'q' },
  preserve: { type: 'boolean' },
  config: { type: 'string' },
  bail: { type: 'boolean' },
  random: { type: 'boolean' },
  'no-random': { type: 'boolean' },
  timeout: { type: 'string' },
  file: { type: 'string', short: 'f' },
  suite: { type: 'string', short: 's' },
} as const;

interface ParsedValues {
  help?: boolean;
  version?: boolean;
  watch?: boolean;
  headless?: boolean;
  coverage?: boolean;
  exclusive?: boolean;
  browser?: string | boolean;
  ansi?: boolean;
  seed?: string | boolean;
  project?: string | boolean;
  port?: string | boolean;
  silent?: boolean;
  quiet?: boolean;
  preserve?: boolean;
  config?: string | boolean;
  bail?: boolean;
  random?: boolean;
  'no-random'?: boolean;
  timeout?: string | boolean;
  file?: string | boolean;
  suite?: string | boolean;
}

interface ParsedCli {
  helpRequested: boolean;
  versionRequested: boolean;
  initOnly: boolean;
  watch: boolean;
  headless: boolean;
  coverage: boolean;
  exclusive: boolean;
  ansiFlag: boolean;
  silentLogs: boolean;
  preserveOutputsFlag: boolean;
  hasBrowserArg: boolean;
  hasProjectArg: boolean;
  browserName: string;
  seedValue?: number;
  projectValue?: string;
  portValue?: number;
  configFileName: string;
  bail: boolean;
  randomValue?: boolean;
  timeoutValue?: number;
  fileValue?: string;
  suiteValue?: string;
}

/**
 * Reads a flag that requires a string value (e.g. `--browser chrome`).
 * Returns `undefined` when the flag was not passed at all, and throws an
 * ExitCodeError (with the supplied message) when the flag was passed but no
 * usable value followed it -- either because it was the last token, or
 * because the next token was itself another flag.
 */
function requireStringValue(value: string | boolean | undefined, missingMessage: () => string): string | undefined {
  if (value === undefined) return undefined;
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (normalized.length === 0 || normalized.startsWith('-')) {
    logger.error(missingMessage());
    throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, missingMessage());
  }
  return normalized;
}

export class CLIHandler {
  private static runner: ViteJasmineRunner | null = null;

  static async cleanup(): Promise<void> {
    if (this.runner) {
      await this.runner.cleanup();
      this.runner = null;
    }
  }

  private static parseCliArgs(argv: string[]): ParsedCli {
    let parsedArgs;
    try {
      parsedArgs = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: true,
      options: CLI_OPTIONS as any,
      });
    } catch (error) {
      logger.error(CLIMessages.invalidArguments(error));
      throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid command line arguments');
    }

    const { values, positionals } = parsedArgs;
    const v = values as ParsedValues;

    const hasBrowserArg = v.browser !== undefined;
    const browserRaw = requireStringValue(v.browser, CLIMessages.browserArgMissing);
    const browserName = browserRaw ?? 'chrome';

    const hasProjectArg = v.project !== undefined;
    const projectValue = requireStringValue(v.project, CLIMessages.projectArgMissing);

    const configFileName = requireStringValue(v.config, CLIMessages.configArgMissing) ?? 'testify.json';
    const fileValue = requireStringValue(v.file, CLIMessages.fileArgMissing);
    const suiteValue = requireStringValue(v.suite, CLIMessages.suiteArgMissing);

    const unknownPositionals = positionals.filter((value) => value !== 'init');
    if (unknownPositionals.length > 0 || positionals.filter((value) => value === 'init').length > 1) {
      logger.error(CLIMessages.unknownCommand(unknownPositionals[0] ?? 'init'));
      throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Unknown command');
    }

    const seedRaw = requireStringValue(v.seed, CLIMessages.invalidSeed);
    let seedValue: number | undefined;
    if (seedRaw !== undefined) {
      const parsed = Number(seedRaw);
      if (!Number.isFinite(parsed)) {
        logger.error(CLIMessages.invalidSeed());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid seed value');
      }
      seedValue = parsed;
    }

    const portRaw = requireStringValue(v.port, CLIMessages.portArgMissing);
    let portValue: number | undefined;
    if (portRaw !== undefined) {
      const parsed = Number(portRaw);
      if (!Number.isFinite(parsed) || parsed < 1 || parsed > 65535 || !Number.isInteger(parsed)) {
        logger.error(CLIMessages.invalidPort());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid port value');
      }
      portValue = parsed;
    }

    const timeoutRaw = requireStringValue(v.timeout, CLIMessages.timeoutArgMissing);
    let timeoutValue: number | undefined;
    if (timeoutRaw !== undefined) {
      const parsed = Number(timeoutRaw);
      if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
        logger.error(CLIMessages.invalidTimeout());
        throw new ExitCodeError(EXIT_CODES.INVALID_USAGE, 'Invalid timeout value');
      }
      timeoutValue = parsed;
    }

    const randomValue = v['no-random'] === true ? false : v.random === true ? true : undefined;

    return {
      helpRequested: v.help === true,
      versionRequested: v.version === true,
      initOnly: positionals.includes('init'),
      watch: v.watch === true,
      headless: v.headless === true,
      coverage: v.coverage === true,
      exclusive: v.exclusive === true,
      ansiFlag: v.ansi === true,
      silentLogs: v.silent === true || v.quiet === true,
      preserveOutputsFlag: v.preserve === true,
      hasBrowserArg,
      hasProjectArg,
      browserName,
      seedValue,
      projectValue,
      portValue,
      configFileName,
      bail: v.bail === true,
      randomValue,
      timeoutValue,
      fileValue,
      suiteValue,
    };
  }

  private static printVersion(): void {
    try {
      const pkgUrl = new URL('../package.json', import.meta.url);
      const pkg = JSON.parse(fs.readFileSync(pkgUrl, 'utf8'));
      logger.printlnRaw(`testify ${pkg.version}`);
    } catch {
      logger.printlnRaw('testify (version unknown)');
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

    const rawArgs = process.argv.slice(2);

    let parsed: ParsedCli;
    try {
      parsed = this.parseCliArgs(rawArgs);
    } catch (error) {
      return getExitCode(error);
    }

    if (parsed.helpRequested) {
      this.printHelp();
      return EXIT_CODES.SUCCESS;
    }

    if (parsed.versionRequested) {
      this.printVersion();
      return EXIT_CODES.SUCCESS;
    }

    const {
      initOnly,
      watch,
      headless,
      coverage,
      exclusive,
      browserName,
      ansiFlag,
      seedValue,
      projectValue: initialProjectValue,
      portValue,
      configFileName,
      bail,
      randomValue,
      timeoutValue,
      fileValue,
      suiteValue,
    } = parsed;
    let projectValue = initialProjectValue;

    const preserveOutputsArg = parsed.preserveOutputsFlag ? true : undefined;

    if (initOnly) {
      try {
        ConfigManager.initViteJasmineConfig(configFileName);
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
        return EXIT_CODES.INVALID_USAGE;
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

      let config = ConfigManager.loadViteJasmineBrowserConfig(configFileName);

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
          return EXIT_CODES.INVALID_USAGE;
        }
      }

      if (ansiFlag) {
        setAnsiMode();
      }

      config = {
        ...config,
        headless:
          headless ||
          browserName === 'node'
            ? true
            : watch
              ? false
              : (config.headless || false),
        coverage: coverage ? true : (config.coverage || false),
        browser: parsed.hasBrowserArg ? browserName : (config.browser || 'chrome'),
        // CLI contract: plain `testify` always performs a one-shot run.
        // Watch/HMR is opt-in through `--watch`; a stale `watch` value in
        // testify.json must not change the default CLI behavior.
        watch,
        suppressConsoleLogs: parsed.silentLogs ? true : config.suppressConsoleLogs,
        srcDirs: normalizeDirConfig(config.srcDirs, './src'),
        testDirs: normalizeDirConfig(config.testDirs, './tests'),
        preserveOutputs: preserveOutputsArg ?? !!config.preserveOutputs,
        project: projectValue ?? config.project,
        port: portValue ?? config.port,
        ansi: ansiFlag ? true : config.ansi,
        fileFilter: fileValue ?? config.fileFilter,
        selector:
          suiteValue
            ? { suite: suiteValue }
            : config.selector,
      };

      if (config.ansi) {
        setAnsiMode();
      }

      if (seedValue !== undefined || randomValue !== undefined || bail || timeoutValue !== undefined) {
        const env = config.jasmineConfig?.env ?? {};
        config.jasmineConfig = {
          ...config.jasmineConfig,
          env: {
            ...env,
            ...(seedValue !== undefined ? { seed: seedValue } : {}),
            ...(randomValue !== undefined ? { random: randomValue } : {}),
            ...(bail ? { stopSpecOnExpectationFailure: true } : {}),
            ...(timeoutValue !== undefined ? { timeout: timeoutValue } : {}),
          },
        };
      }

      if (config.preserveOutputs) {
        logger.println(CLIMessages.preserveOutputsEnabled());
      }

      const resolvedOutDir = path.resolve(config.outDir ?? path.join(process.cwd(), 'dist/.vite-jasmine-build/'));
      const lock = new ProcessLock(config.project, config.port ?? 8888, resolvedOutDir);
      await lock.acquire(exclusive);
      process.on('exit', () => lock.releaseSync());

      const runner = cliDependencies.createViteJasmineRunner({
        ...config,
        lockFilePath: lock.getPidFilePath(),
      });
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

## File: src/console-reporter.ts
````typescript
import util from 'util';
import { logger } from './logger';
import { wrapLine, visibleWidth, ANSI_FULL_REGEX, normalize } from './utils';
import { EXIT_CODES } from './exit-codes';
import { getMaxWidth, isAnsiMode } from './ansi-constants';
import { ReporterMessages } from './log-messages';
import { SYMBOLS, replacePlaceholders } from './symbols';

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
  print?: (...args: any[]) => void;
}

export class ConsoleReporter {
  private print: (...args: any[]) => void;
  private showColors: boolean;
  private specCount: number;
  private executableSpecCount: number;
  private failureCount: number;
  private failedSpecs: any[];
  private globalFailures: any[];
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
  private orderedSuites: any[] | null = null;
  private orderedSpecs: any[] | null = null;
  private isTTY: boolean;

  constructor(options: ConsoleReporterOptions = {}) {
    this.print =
      options.print ??
      ((...args) =>
        process.stdout.write(
          util.format(...args),
        ));
    this.showColors = options.showColors ?? this.detectColorSupport();
    this.isTTY = !isAnsiMode() && (process.stdout.isTTY ?? false);
    this.config = null;
    this.specCount = 0;
    this.executableSpecCount = 0;
    this.failureCount = 0;
    this.failedSpecs = [];
    this.globalFailures = [];
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

  getFailureCount(): number {
    return this.failureCount;
  }

  // Detect if terminal supports colors
  private detectColorSupport(): boolean {
    if (isAnsiMode()) return false;
    if (process.env.NO_COLOR) return false;
    if (process.env.FORCE_COLOR === '1' || process.env.FORCE_COLOR === 'true' || process.env.FORCE_COLOR) return true;
    return process.stdout.isTTY ?? false;
  }

  private createRootSuite(): TestSuite {
    return {
      id: 'suite0',
      description: 'Jasmine__TopLevel__Suite',
      fullName: '',
      specs: [],
      children: [],
      status: 'skipped'
    };
  }

  private buildSuiteTree(config: any) {
    // Create root suite
    this.rootSuite = this.createRootSuite();
    this.suiteById.clear();
    this.specById.clear();
    this.suiteStack = [this.rootSuite];
    this.currentSuite = null;
    this.currentSpec = null;

    this.suiteById.set(this.rootSuite.id, this.rootSuite);

    const orderedSuites = this.orderedSuites;
    // 1️⃣ Register suites
    if (orderedSuites) {
      orderedSuites.forEach((suiteConfig: any) => {
        const suite = {
          id: suiteConfig.id,
          description: this.normalizeDescription(suiteConfig.description ?? suiteConfig.id),
          fullName: suiteConfig.fullName ?? suiteConfig.id,
          specs: [],
          children: [],
          parent: undefined,
          status: 'skipped' as const // default until executed
        };
        this.suiteById.set(suite.id, suite);
      });
    }

    // 2️⃣ Attach specs to their suites (skip root)
    const orderedSpecs = this.orderedSpecs;
    if (orderedSpecs) {
      orderedSpecs.forEach((specConfig: any) => {
        const spec = {
          id: specConfig.id,
          description: specConfig.description ?? specConfig.id,
          fullName: specConfig.fullName ?? specConfig.id,
          status: 'skipped' as const
        };

        this.specById.set(spec.id, spec);

        const parentSuiteId =
          specConfig.suiteId ?? this.findSuiteIdForSpec(specConfig);
        const parentSuite = this.suiteById.get(parentSuiteId);

        if (parentSuite && parentSuite.id !== this.rootSuite.id) {
          parentSuite.specs.push(spec);
        } else {
          // orphaned spec → does not belong to any known suite
          this.rootSuite.specs.push(spec);
        }
      });
    }

    // 3️⃣ Attach suites to their parents
    if (orderedSuites) {
      orderedSuites.forEach((suiteConfig: any) => {
        const suite = this.suiteById.get(suiteConfig.id);
        if (!suite) return;

        const parentSuiteId =
          suiteConfig.parentSuiteId ?? this.findParentSuiteId(suiteConfig);
        const parentSuite =
          this.suiteById.get(parentSuiteId) ?? this.rootSuite;

        if (parentSuite.id !== suite.id) {
          suite.parent = parentSuite;
          if (!parentSuite.children.includes(suite)) {
            parentSuite.children.push(suite);
          }
        }
      });
    }

    // Debug summary
    const totalSuites = this.orderedSuites?.length; // real suites (root excluded)
    const totalSpecs = this.orderedSpecs?.length;   // all specs
    logger.println(ReporterMessages.suiteTreeBuilt(totalSuites, totalSpecs));
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

  private findSuiteIdForSpec(specConfig: any): string {
    // Try to find suite ID from spec's fullName or other hints
    // This is a fallback - ideally suiteId should be in the config
    if (specConfig.suiteId) return specConfig.suiteId;

    // If we have a fullName, try to match it with suite fullNames
    if (specConfig.fullName) {
      for (const [id, suite] of this.suiteById) {
        if (id !== this.rootSuite.id && specConfig.fullName.startsWith(suite.fullName)) {
          return id;
        }
      }
    }

    return this.rootSuite.id;
  }

  private findParentSuiteId(suiteConfig: any): string {
    if (suiteConfig.parentSuiteId) return suiteConfig.parentSuiteId;

    // Try to deduce from fullName
    if (suiteConfig.fullName) {
      const parts = suiteConfig.fullName.split(' ');
      if (parts.length > 1) {
        const parentFullName = parts.slice(0, -1).join(' ');
        for (const [id, suite] of this.suiteById) {
          if (suite.fullName === parentFullName) {
            return id;
          }
        }
      }
    }

    return this.rootSuite.id;
  }

  userAgent(message: any, suites: any, specs: any) {
    this.envInfo = this.gatherEnvironmentInfo();
    this.orderedSuites = Array.isArray(suites) ? suites : null;
    this.orderedSpecs = Array.isArray(specs) ? specs : null;

    if (message) {
      const userAgent = { ...message };
      delete userAgent?.timestamp;
      delete userAgent?.type;
      this.envInfo = {
        ...this.envInfo,
        userAgent
      };
    }
  }

  /**
   * Supplies the Node runner's catalog. Browser transports provide the two
   * arrays through `userAgent`; the in-process runner already has the catalog
   * in its canonical `{ suites, specs }` form.
   */
  setCatalog(catalog: any) {
    this.orderedSuites = Array.isArray(catalog?.suites)
      ? catalog.suites
      : null;
    this.orderedSpecs = Array.isArray(catalog?.specs)
      ? catalog.specs
      : null;
  }

  jasmineStarted(config: any) {
    this.startTime = Date.now();
    this.specCount = 0;
    this.executableSpecCount = 0;
    this.failureCount = 0;
    this.config = config;
    this.failedSpecs = [];
    this.globalFailures = [];
    this.pendingSpecs = [];
    this.rootSuite = this.createRootSuite();
    this.suiteStack = [this.rootSuite];
    this.currentSuite = null;
    this.currentSpec = null;
    this.interrupted = false;

    this.buildSuiteTree(config);
    this.setupInterruptHandler();

    this.print('\n');
    this.printBox('Test Runner Started', 'cyan');
    this.printEnvironmentInfo();
    this.printTestConfiguration(config);
  }

  suiteStarted(config: any) {
    if (this.interrupted) return;

    // Try to get or create the suite node
    let suite = this.suiteById.get(config.id);
    const parentSuite = this.suiteStack[this.suiteStack.length - 1];

    if (!suite) {
      // Create new suite node if not built from config
      suite = {
        id: config.id,
        description: config.description,
        fullName: config.fullName,
        specs: [],
        children: [],
        parent: parentSuite,
        status: 'running'
      };
      this.suiteById.set(suite.id, suite);
    } else {
      suite.status = 'running';
      suite.parent = parentSuite;
    }

    // Attach to parent if not already
    if (parentSuite && !parentSuite.children.includes(suite)) {
      parentSuite.children.push(suite);
    }

    // Push to stack
    this.suiteStack.push(suite);
    this.currentSuite = suite;
  }

  specStarted(config: any) {
    if (this.interrupted) return;

    const spec = this.specById.get(config.id) ?? {
      id: config.id,
      description: config.description,
      fullName: config.fullName,
      status: 'running'
    };

    spec.status = 'running';
    this.specById.set(spec.id, spec);
    this.currentSpec = spec;

    // Attach to current suite
    if (this.currentSuite) {
      if (!this.currentSuite.specs.includes(spec)) {
        this.currentSuite.specs.push(spec);
      }
    } else {
      // Fallback to root if somehow outside any suite
      this.rootSuite.specs.push(spec);
    }

    this.updateStatusLine();
  }

  specDone(result: any) {
    if (this.interrupted) return;

    this.specCount++;

    // Defensively handle both spec-level status and suite-level overallStatus
    const status = result?.status ?? result?.overallStatus;
    if (!status) return;

    const spec = this.specById.get(result.id);
    if (spec) {
      spec.status = status;
      spec.duration = result.duration;
      spec.failedExpectations = result.failedExpectations;
      spec.pendingReason = result.pendingReason;
    }

    switch (status) {
      case 'passed':
        this.executableSpecCount++;
        break;
      case 'failed':
        this.failureCount++;
        this.failedSpecs.push(result);
        this.executableSpecCount++;
        break;
      case 'pending':
        this.pendingSpecs.push(result);
        this.executableSpecCount++;
        break;
      default:
        break;
    }

    this.currentSpec = null;
    this.updateStatusLine();
  }

  suiteDone(result: any) {
    if (this.interrupted) return;

    const suite = this.suiteStack[this.suiteStack.length - 1];
    if (!suite) return;

    // Mark suite result
    suite.status = this.determineSuiteStatusFromInternal(suite);

    // Print final suite result
    this.printSuiteLine(suite);
    this.print('\n');

    // Pop from stack
    this.suiteStack.pop();
    this.currentSuite = this.suiteStack[this.suiteStack.length - 1] ?? null;
  }

  jasmineDone(result?: any) {
    const globalFailures =
      Array.isArray(
        result?.failedExpectations,
      )
        ? result.failedExpectations
        : [];

    this.globalFailures =
      globalFailures;
    this.failureCount =
      this.failedSpecs.length +
      globalFailures.length;

    const totalTimeMs =
      typeof result?.totalTime === 'number'
        ? result.totalTime
        : Date.now() - this.startTime;

    const totalTime = totalTimeMs / 1000;

    this.clearCurrentLine();

    // Filter out stale specs (e.g., retried specs that later passed)
    const actualFailedSpecs = this.failedSpecs.filter(s => s.status === 'failed' || s.overallStatus === 'failed');
    const actualPendingSpecs = this.pendingSpecs.filter(s => s.status === 'pending' || s.overallStatus === 'pending');

    if (actualFailedSpecs.length > 0) {
      this.failedSpecs = actualFailedSpecs;
      this.printFailures();
    } else {
      this.failedSpecs = [];
    }

    this.failureCount =
      this.failedSpecs.length +
      this.globalFailures.length;

    if (this.globalFailures.length > 0) {
      this.printGlobalFailures();
    }

    if (actualPendingSpecs.length > 0) {
      this.pendingSpecs = actualPendingSpecs;
      this.printPendingSpecs();
    } else {
      this.pendingSpecs = [];
    }

    this.printSummary(totalTime);

    this.print('\n');
    this.printFinalStatus(result?.overallStatus);

    this.print('\n\n');
    this.removeInterruptHandler();
  }

  /** Mark all specs and suites that were never executed as skipped */
  markUnexecutedAsSkipped() {
    // Mark the currently running spec as incomplete (if exists)
    if (this.currentSpec) {
      if (!this.currentSpec.status || this.currentSpec.status === "running") {
        this.currentSpec.status = "incomplete";
      }
    }

    // Mark the currently running suite as incomplete (if exists)
    if (this.currentSuite && this.currentSuite.id !== this.rootSuite.id) {
      if (!this.currentSuite.status || this.currentSuite.status === "running") {
        this.currentSuite.status = "incomplete";
      }
    }

    // All other unexecuted specs are skipped
    for (const [id, spec] of this.specById) {
      if (this.currentSpec && id === this.currentSpec.id) continue;
      if (!spec.status || spec.status === "running") {
        spec.status = "skipped";
      }
    }

    // All other unexecuted suites are skipped
    for (const [id, suite] of this.suiteById) {
      if (id === this.rootSuite.id) continue;
      if (this.currentSuite && id === this.currentSuite.id) continue;
      if (!suite.status || suite.status === "running") {
        suite.status = "skipped";
      }
    }
  }

  testsAborted(message?: string): number {
    if (this.interrupted) {
      return message === 'SIGTERM' ? EXIT_CODES.SIGTERM : EXIT_CODES.SIGINT;
    }
    this.interrupted = true;

    if (this.isTTY) {
      // Clear the status line (which is on the line above)
      this.print('\r\x1b[1A'); // Move up one line
      this.clearCurrentLine();  // Clear that line
      this.clearCurrentLine();  // Clear current line
      this.print('\n');
    }

    // Mark all unexecuted specs as skipped
    this.markUnexecutedAsSkipped();

    // A reporter may be exercised directly in tests before jasmineStarted().
    // In that case there is no meaningful elapsed time yet.
    const totalTime =
      this.startTime > 0
        ? (
            Date.now() -
            this.startTime
          ) / 1000
        : 0;

    // Filter out stale specs before printing
    const actualFailedSpecs = this.failedSpecs.filter(s => s.status === 'failed' || s.overallStatus === 'failed');
    if (actualFailedSpecs.length > 0) {
      this.failedSpecs = actualFailedSpecs;
      this.printFailures();
    } else {
      this.failedSpecs = [];
    }

    // Print test tree
    this.printTestTree();

    // Print summary
    this.print('\n');
    this.printSummary(totalTime);

    this.print('\n');
    this.printBox(ReporterMessages.testsInterrupted(), 'yellow');
    this.print('\n');
    this.removeInterruptHandler();

    return message === 'SIGTERM' ? EXIT_CODES.SIGTERM : EXIT_CODES.SIGINT;
  }

  /** Determine suite status based on its specs and children */
  private determineSuiteStatusFromInternal(suite: TestSuite): TestStatus {
    // Leaf suite: check specs
    if (suite.specs.length > 0) {
      if (suite.specs.some(s => s.status === 'failed')) return 'failed';
      if (suite.specs.some(s => s.status === 'incomplete')) return 'incomplete';
      if (suite.specs.some(s => s.status === 'running')) return 'incomplete';
      if (suite.specs.some(s => s.status === 'pending')) return 'pending';
      if (suite.specs.every(s => s.status === 'skipped')) return 'skipped';
      if (suite.specs.every(s => s.status === 'passed' || s.status === 'skipped')) return 'passed';
    }
  
    // If no specs, check children
    if (suite.children.length > 0) {
      if (suite.children.some(c => this.determineSuiteStatusFromInternal(c) === 'failed')) return 'failed';
      if (suite.children.some(c => this.determineSuiteStatusFromInternal(c) === 'incomplete')) return 'incomplete';
      if (suite.children.some(c => this.determineSuiteStatusFromInternal(c) === 'pending')) return 'pending';
      if (suite.children.every(c => this.determineSuiteStatusFromInternal(c) === 'skipped')) return 'skipped';
      if (suite.children.every(c => ['passed', 'skipped'].includes(this.determineSuiteStatusFromInternal(c)))) return 'passed';
    }
  
    // Default for empty suites or suites with only passed/skipped specs/children
    return suite.specs.length > 0 || suite.children.length > 0 ? 'passed' : 'skipped';
  }

  private setupInterruptHandler() {
    // Intentionally no-op: process-lifecycle and signal handling are owned by
    // the CLI entry point so the test runner library never kills the process.
  }

  private removeInterruptHandler() {
    // Intentionally no-op: the CLI owns signal handling.
  }

  private clearCurrentLine() {
    if (!this.isTTY) return;
    this.print('\x1b[2K\r');
  }

  private updateStatusLine() {
    if (!this.isTTY || !this.currentSuite) return;

    const total = this.specById.size;
    if (total === 0) return;

    const suiteName = this.currentSuite.description;
    const statusText = `\n  ${this.colored('dim', SYMBOLS.arrow)} ${suiteName} ${this.colored('gray', `(${this.specCount}/${total})`)}`;
    this.clearCurrentLine();
    this.print(statusText);
    this.print('\r\x1b[1A');
  }

  private printSuiteLine(suite: TestSuite) {
    const suiteName = this.colored('brightBlue', suite.description);
    const dots = suite.specs.map(spec => this.getSpecSymbol(spec));
    const prefix = '  ';
    const maxWidth = this.lineWidth;

    const visibleNameLength = visibleWidth(suiteName);
    const dotsLength = dots.reduce((sum, dot) => sum + visibleWidth(dot), 0);
    const totalLength = prefix.length + visibleNameLength + 1 + dotsLength;

    if (totalLength <= maxWidth) {
      // Fits on one line
      const spaces = ' '.repeat(maxWidth - totalLength);
      this.print(prefix + suiteName + ' ' + spaces + dots.join(''));
    } else {
      // Does not fit: use the suite-name line too, then wrap remaining dots right-aligned
      const availableForName = maxWidth - prefix.length;
      let truncatedName = suiteName;
      if (visibleNameLength > availableForName) {
        // Truncate name with three dots if it does not fit on its own line
        const rawName = suite.description;
        const ellipsis = '...';
        truncatedName = this.colored('brightBlue', rawName.substring(0, Math.max(0, availableForName - ellipsis.length)) + ellipsis);
      }

      this.print(prefix + truncatedName);

      // Fit as many dots as possible on the same line as the suite name, right-aligned
      const firstLineCapacity = Math.max(0, maxWidth - prefix.length - visibleWidth(truncatedName) - 1);
      const firstLineDots: string[] = [];
      let firstLineWidth = 0;
      let remainingDots = dots;

      for (const dot of dots) {
        const dotWidth = visibleWidth(dot);
        if (firstLineWidth + dotWidth > firstLineCapacity && firstLineDots.length > 0) break;
        firstLineDots.push(dot);
        firstLineWidth += dotWidth;
        remainingDots = remainingDots.slice(1);
      }

      if (firstLineDots.length > 0) {
        const spaces = ' '.repeat(firstLineCapacity - firstLineWidth);
        this.print(' ' + spaces + firstLineDots.join(''));
      }

      // Print remaining dots on subsequent lines, each chunk right-aligned
      this.printWrappedDots(remainingDots, prefix, maxWidth);
    }
  }

  private printWrappedDots(dots: string[], prefix: string, maxWidth: number) {
    const lineCapacity = maxWidth - prefix.length;
    if (lineCapacity <= 0) return;

    let currentLineWidth = 0;
    let currentLineDots: string[] = [];

    for (const dot of dots) {
      const dotWidth = visibleWidth(dot);
      if (dotWidth > lineCapacity) continue; // should not happen for single-char dots

      if (currentLineWidth + dotWidth > lineCapacity && currentLineDots.length > 0) {
        // Flush current line right-aligned
        const spaces = ' '.repeat(lineCapacity - currentLineWidth);
        this.print('\n' + prefix + spaces + currentLineDots.join(''));
        currentLineDots = [];
        currentLineWidth = 0;
      }

      currentLineDots.push(dot);
      currentLineWidth += dotWidth;
    }

    // Flush remaining dots
    if (currentLineDots.length > 0) {
      const spaces = ' '.repeat(lineCapacity - currentLineWidth);
      this.print('\n' + prefix + spaces + currentLineDots.join(''));
    }
  }

  private getSpecDots(suite: TestSuite): string {
    return suite.specs.map(spec => this.getSpecSymbol(spec)).join('');
  }

  private getSpecSymbol(spec: TestSpec): string {
    if (!this.showColors) {
      switch (spec.status) {
        case 'passed': return SYMBOLS.passed;
        case 'failed': return SYMBOLS.failed;
        case 'pending': return SYMBOLS.pending;
        default: return '';
      }
    }
    switch (spec.status) {
      case 'passed':
        return this.colored('brightGreen', SYMBOLS.passed);
      case 'failed':
        return this.colored('brightRed', SYMBOLS.failed);
      case 'pending':
        return this.colored('brightYellow', SYMBOLS.pending);
      default:
        return '';
    }
  }

  private compressDots(suite: TestSuite, sideCount: number): string {
    const dots = suite.specs.map(spec => this.getSpecSymbol(spec));

    if (dots.length <= sideCount * 2) {
      return dots.join('');
    }

    const start = dots.slice(0, sideCount).join('');
    const end = dots.slice(-sideCount).join('');
    const ellipsis = this.colored('gray', '...');

    return start + ellipsis + end;
  }

  private countVisualDots(dotsString: string): number {
    return dotsString.replace(/\x1b\[[0-9;]*m/g, '').length;
  }

  private separator(): string {
    return '  ' + SYMBOLS.box_h.repeat(this.lineWidth - 2);
  }

  private printFailures() {
    this.print('\n');
    this.printSectionHeader('FAILURES', 'red');
    this.print(this.colored('red', this.separator() + '\n'));

    if (!this.failedSpecs.length) return;

    this.failedSpecs.forEach((spec, idx) => {
      // Print numbered spec header
      const header = wrapLine(`${idx + 1}) ${spec.fullName}`, this.lineWidth, 1);
      header.forEach(line => (this.print(this.colored("white", `  ${line.trimStart()}`)), this.print('\n')));

      if (spec.failedExpectations?.length > 0) {
        spec.failedExpectations.forEach((expectation: any, exIndex: number) => {
          const messageLines = wrapLine(`${SYMBOLS.cross} ${normalize(expectation.message)}`, this.lineWidth, 0);
          // Continuation lines of same message
          messageLines.forEach(line => (this.print(this.colored('brightRed', `  ${line.trimStart()}`)), this.print('\n')));

          // Stack trace — lightly indented and gray
          if (expectation.stack) {
            const stackLines = wrapLine(normalize(expectation.stack), this.lineWidth, 0);
            stackLines.forEach(line => (this.print(this.colored('gray', `  ${line.trimStart()}`)), this.print('\n')));
          }

          // Space between multiple expectations for same spec
          if (exIndex < spec.failedExpectations.length - 1) this.print('\n');
        });
      }

      // Extra spacing between specs
      this.print('\n');
    });
  }

  private printGlobalFailures() {
    this.print('\n');
    this.printSectionHeader(
      'GLOBAL ERRORS',
      'red',
    );
    this.print(
      this.colored(
        'red',
        this.separator() + '\n',
      ),
    );

    this.globalFailures.forEach(
      (failure, idx) => {
        const label =
          failure.globalErrorType ||
          failure.type ||
          'global error';
        const message =
          normalize(
            failure.message ??
              String(failure),
          );
        const header = wrapLine(
          `${idx + 1}) ${label}`,
          this.lineWidth,
          0,
        );
        header.forEach(
          (line) => (
            this.print(
              this.colored(
                'white',
                `  ${line.trimStart()}`,
              ),
            ),
            this.print('\n')
          ),
        );

        const messageLines =
          wrapLine(
            `${SYMBOLS.cross} ${message}`,
            this.lineWidth,
            0,
          );
        messageLines.forEach(
          (line) => (
            this.print(
              this.colored(
                'brightRed',
                `  ${line.trimStart()}`,
              ),
            ),
            this.print('\n')
          ),
        );

        if (failure.stack) {
          const stackLines =
            wrapLine(
              normalize(
                failure.stack,
              ),
              this.lineWidth,
              0,
            );
          stackLines.forEach(
            (line) => (
              this.print(
                this.colored(
                  'gray',
                  `  ${line.trimStart()}`,
                ),
              ),
              this.print('\n')
            ),
          );
        }

        this.print('\n');
      },
    );
  }

  private printPendingSpecs() {
    this.print('\n');
    this.printSectionHeader('PENDING', 'yellow');
    this.print(this.colored('yellow', this.separator() + '\n'));

    this.pendingSpecs.forEach((spec, idx) => {
      // Print numbered spec header with wrapping
      const header = wrapLine(`${this.colored('brightYellow', SYMBOLS.pending)} ${this.colored('white', spec.fullName)}`, this.lineWidth, 1, 'word');
      header.forEach(line => (this.print(line), this.print('\n')));
    });
  }

  private computeOverallStatus(jasmineOverallStatus?: string): 'passed' | 'failed' | 'incomplete' {
    if (this.failureCount > 0) return 'failed';

    const hasIncompleteSpec = [...this.specById.values()].some(
      (spec) => spec.status === 'incomplete' || spec.status === 'running'
    );

    const hasIncompleteSuite = [...this.suiteById.values()].some(
      (suite) => suite.status === 'incomplete' || suite.status === 'running'
    );
  
    if (this.interrupted || hasIncompleteSpec || hasIncompleteSuite || jasmineOverallStatus === 'incomplete') {
      return 'incomplete';
    }
  
    return 'passed';
  }

  private printFinalStatus(jasmineOverallStatus?: string) {
    const overallStatus = this.computeOverallStatus(jasmineOverallStatus);
    if (overallStatus === 'passed') {
      const msg = this.pendingSpecs.length === 0
        ? ReporterMessages.allTestsPassed()
        : ReporterMessages.allTestsPassedWithPending(this.pendingSpecs.length);
      this.printBox(msg, 'green');
    } else if (overallStatus === 'failed') {
      this.printBox(ReporterMessages.testsFailed(this.failureCount), 'red');
    } else if (overallStatus === 'incomplete') {
      this.printBox(ReporterMessages.testsIncomplete(), 'yellow');
    } else {
      this.printBox(ReporterMessages.unknownStatus(overallStatus), 'red');
    }
  }

  private printTestTree() {
    this.print(this.colored('bold', '  Demanding Attention\n'));
    this.print(this.colored('gray', this.separator() + '\n'));

    // Calculate suite statuses starting from root (recursively covers all suites)
    this.calculateSuiteStatuses(this.rootSuite);

    // Print all top-level suites (those whose parent is rootSuite)
    let hasProblems = false;

    for (const [id, suite] of this.suiteById) {
      // Skip root suite itself
      if (suite.id === this.rootSuite.id) continue;

      // Only print top-level suites (direct children of root)
      // Their children will be printed recursively
      if (!suite.parent || suite.parent.id === this.rootSuite.id) {
        if (this.printProblemSuite(suite, 1)) {
          hasProblems = true;
        }
      }
    }

    if (!hasProblems) {
      this.print('  ' + this.colored('brightGreen', SYMBOLS.checked) + ' ' + this.colored('dim', 'All suites completed successfully\n'));
    }
  }

  private calculateSuiteStatuses(suite: TestSuite): TestStatus {
    const childStatuses = suite.children.map(child => this.calculateSuiteStatuses(child));

    // Normalize spec statuses first
    for (const spec of suite.specs) {
      if (!spec.status) {
        spec.status = 'skipped';
      } else if (spec.status === 'running') {
        spec.status = 'incomplete';
      }
    }

    const specs = suite.specs;
    const failedCount = specs.filter(s => s.status === 'failed').length;
    const pendingCount = specs.filter(s => s.status === 'pending').length;
    const incompleteCount = specs.filter(s => s.status === 'incomplete' || s.status === 'running').length;
    const skippedCount = specs.filter(s => s.status === 'skipped').length;

    const hasFailedChildren = childStatuses.includes('failed');
    const hasPendingChildren = childStatuses.includes('pending') || childStatuses.includes('running');
    const hasIncompleteChildren = childStatuses.includes('incomplete');

    // 🚨 FIX: Check incomplete status BEFORE passed status
    if (failedCount > 0 || hasFailedChildren) {
      suite.status = 'failed';
    } else if (incompleteCount > 0 || hasIncompleteChildren) {
      suite.status = 'incomplete';  // This should come before pending/passed
    } else if (pendingCount > 0 || hasPendingChildren) {
      suite.status = 'pending';
    } else if (skippedCount > 0) {
      suite.status = 'skipped';
    } else {
      suite.status = 'passed';
    }

    return suite.status;
  }

  /** Print only suites/specs that need attention */
  printProblemSuite(suite: TestSuite, indentLevel: number = 0): boolean {
    if (suite.id === this.rootSuite.id) return false;

    const indent = "  ".repeat(indentLevel);
    let hasProblems = false;

    // --- 1️⃣ Process children ---
    let childHasProblems = false;
    for (const child of suite.children) {
      if (this.printProblemSuite(child, indentLevel + 1)) {
        childHasProblems = true;
        hasProblems = true;
      }
    }

    // --- 2️⃣ Determine if this suite is a problem node ---
    const isProblemSuite = ["failed", "pending", "incomplete", "skipped"].includes(suite.status!);

    if (isProblemSuite || childHasProblems) {
      hasProblems = true;

      if (isProblemSuite) {
        const { symbol, color } = this.getSuiteSymbol(suite.status!);
        const specs = suite.specs;
        const specCount = specs.length;

        const failed = specs.filter(s => s.status === "failed").length;
        const pending = specs.filter(s => s.status === "pending").length;
        const incomplete = specs.filter(s => s.status === "incomplete").length;
        const skipped = specs.filter(s => s.status === "skipped").length;
        const passed = specs.filter(s => s.status === "passed").length;

        const statusParts: string[] = [];

        // Show status based on the suite's overall status
        switch (suite.status) {
          case "failed":
            if (failed > 0) statusParts.push(`${failed} failed`);
            if (passed > 0) statusParts.push(`${passed} passed`);
            if (pending > 0) statusParts.push(`${pending} pending`);
            if (incomplete > 0) statusParts.push(`${incomplete} incomplete`);
            if (skipped > 0) statusParts.push(`${skipped} skipped`);
            break;

          case "incomplete":
            if (incomplete > 0) statusParts.push(`${incomplete} incomplete`);
            if (passed > 0) statusParts.push(`${passed} passed`);
            if (failed > 0) statusParts.push(`${failed} failed`);
            if (pending > 0) statusParts.push(`${pending} pending`);
            break;

          case "pending":
            if (pending > 0) statusParts.push(`${pending} pending`);
            if (passed > 0) statusParts.push(`${passed} passed`);
            if (failed > 0) statusParts.push(`${failed} failed`);
            break;

          case "skipped":
            statusParts.push(`${specCount} skipped`);
            break;

          case "passed":
            statusParts.push(`${specCount} passed`);
            break;
        }

        // Add child suite count if applicable
        if (suite.children.length > 0) {
          statusParts.push(`${suite.children.length} child suite${suite.children.length !== 1 ? "s" : ""}`);
        }

        const details = statusParts.length ? this.colored("gray", ` (${statusParts.join(", ")})`) : "";
        // Truncate description so status details stay on the same line.
        const rawDesc = suite.description;
        const statusSymbol = this.colored(color, symbol);
        const prefix = `${indent}${statusSymbol} `;
        const availableForDesc = Math.max(0, this.lineWidth - visibleWidth(prefix) - visibleWidth(details));
        const truncatedDesc =
          availableForDesc > 0 && visibleWidth(rawDesc) > availableForDesc
            ? this.truncateString(rawDesc, availableForDesc)
            : rawDesc;
        const desc = suite.status === "incomplete" ? this.colored("yellow", truncatedDesc) : truncatedDesc;

        this.print(`${prefix}${desc}${details}\n`);
      } else if (childHasProblems) {
        // Visual grouping for parent of problem children
        const hasNonSkippedChildProblems = suite.children.some(c =>
          ["failed", "pending", "incomplete"].includes(c.status!)
        );
        if (hasNonSkippedChildProblems) {
          const arrow = this.colored("brightBlue", SYMBOLS.arrow_down_right);
          const prefix = `${indent}${arrow} `;
          const rawDesc = suite.description;
          const availableForDesc = Math.max(0, this.lineWidth - visibleWidth(prefix));
          const truncatedDesc =
            availableForDesc > 0 && visibleWidth(rawDesc) > availableForDesc
              ? this.truncateString(rawDesc, availableForDesc)
              : rawDesc;
          this.print(`${prefix}${this.colored("dim", truncatedDesc)}\n`);
        }
      }
    }

    return hasProblems;
  }

  private getSuiteSymbol(status: 'failed' | 'pending' | 'skipped' | 'incomplete' | 'passed' | 'running'): { symbol: string; color: string } {
    if (!this.showColors) {
      switch (status) {
        case 'failed': return { symbol: SYMBOLS.cross, color: 'brightRed' };
        case 'pending': return { symbol: SYMBOLS.pending, color: 'brightYellow' };
        case 'skipped': return { symbol: SYMBOLS.skip, color: 'gray' };
        case 'incomplete': return { symbol: SYMBOLS.incomplete, color: 'cyan' };
        case 'passed': return { symbol: SYMBOLS.checked, color: 'brightGreen' };
        default: return { symbol: '?', color: 'white' };
      }
    }
    switch (status) {
      case 'failed':
        return { symbol: SYMBOLS.cross, color: 'brightRed' };
      case 'pending':
        return { symbol: SYMBOLS.pending, color: 'brightYellow' };
      case 'skipped':
        return { symbol: SYMBOLS.skip, color: 'gray' };
      case 'incomplete':
        return { symbol: SYMBOLS.incomplete, color: 'cyan' };
      case 'passed':
        return { symbol: SYMBOLS.checked, color: 'brightGreen' };
      default:
        return { symbol: '?', color: 'white' };
    }
  }

  private printBox(text: string, color: string) {
    text = replacePlaceholders(text);
    const strippedText = text.replace(ANSI_FULL_REGEX, '');
    const width = visibleWidth(text) + 4;

    if (!this.showColors) {
      const border =
        '-'.repeat(width);

      this.print(
        `  +${border}+\n`,
      );

      this.print(
        `  |  ${strippedText}  |\n`,
      );

      this.print(
        `  +${border}+\n`,
      );

      return;
    }

    const topBottom = SYMBOLS.box_double_h.repeat(width);    
    this.print(this.colored(color, `  ${SYMBOLS.box_tl}${topBottom}${SYMBOLS.box_tr}\n`));
    this.print(`${this.colored(color, `  ${SYMBOLS.box_v}  `)}${this.colored(['bold', color], text)}${this.colored(color, `  ${SYMBOLS.box_v}`)}\n`);
    this.print(this.colored(color, `  ${SYMBOLS.box_bl}${topBottom}${SYMBOLS.box_br}\n`));
  }

  private printSectionHeader(text: string, color: string) {
    this.print(this.colored('bold', this.colored(color, `  ${text}\n`)));
  }

  private printDivider() {
    this.print(this.colored('gray', this.separator() + '\n'));
  }

  private printSummary(totalTime: number) {
    // Count specs by their actual status
    let passed = 0;
    let failed = 0;
    let pending = 0;
    let skipped = 0;
    let incomplete = 0;
    let notRun = 0;

    // Iterate through all specs to get accurate counts
    for (const [id, spec] of this.specById) {
      switch (spec.status) {
        case 'passed':
          passed++;
          break;
        case 'failed':
          failed++;
          break;
        case 'pending':
          pending++;
          break;
        case 'skipped':
          skipped++;
          break;
        case 'incomplete':
          incomplete++;
          break;
        default:
          // Specs that never got a status are "not run"
          notRun++;
          break;
      }
    }

    const totalSpecs = this.specById.size;
    const executed = passed + failed + pending;
    const duration = `${totalTime.toFixed(3)}s`;

    const lineWidth = this.lineWidth;

    // Build right-aligned info (total and duration)
    const rightInfo = `total: ${totalSpecs}  time: ${duration}`;
    const title = '  Test Summary';
    const spacing = Math.max(1, lineWidth - title.length - rightInfo.length);

    // Header
    const headerLine =
      this.colored('bold', title) +
      ' '.repeat(spacing) +
      this.colored('gray', rightInfo);

    this.print('\n');
    this.print(headerLine + '\n');
    this.print(this.colored('gray', this.separator() + '\n'));

    // Inline summary line
    const parts: string[] = [];

    if (passed > 0)
      parts.push(this.colored('brightGreen', `${SYMBOLS.checked} Passed: ${passed}`));

    if (failed > 0)
      parts.push(this.colored('brightRed', `${SYMBOLS.cross} Failed: ${failed}`));

    if (pending > 0)
      parts.push(this.colored('brightYellow', `${SYMBOLS.pending} Pending: ${pending}`));

    if (incomplete > 0)
      parts.push(this.colored('cyan', `${SYMBOLS.incomplete} Incomplete: ${incomplete}`));

    if (skipped > 0)
      parts.push(this.colored('gray', `${SYMBOLS.skip} Skipped: ${skipped}`));

    if (notRun > 0)
      parts.push(this.colored('gray', `${SYMBOLS.not_run} Not Run: ${notRun}`));

    if (parts.length > 0)
      this.print('  ' + parts.join(this.colored('gray', '  |  ')) + '\n');
    else
      this.print(this.colored('gray', '  (no specs executed)\n'));
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

  private printEnvironmentInfo() {
    if (!this.envInfo) this.envInfo = this.gatherEnvironmentInfo();

    this.print('\n');
    this.print(this.colored('bold', '  Environment\n'));
    this.print(this.colored('gray', this.separator() + '\n'));

    this.print(this.colored('cyan', '  Node.js:   ') + this.colored('white', `${this.envInfo.node}\n`));
    this.print(this.colored('cyan', '  Platform:  ') + this.colored('white', `${this.envInfo.platform}\n`));
    this.print(this.colored('cyan', '  Arch:      ') + this.colored('white', `${this.envInfo.arch}\n`));

    this.print(this.colored('cyan', '  PID:       ') + this.colored('white', `${this.envInfo.pid}\n`));
    this.print(this.colored('cyan', '  Uptime:    ') + this.colored('white', `${this.envInfo.uptime}\n`));
    this.print(this.colored('cyan', '  Memory:    ') + this.colored('white', `${this.envInfo.memory} heap\n`));

    if (this.envInfo.userAgent) {
      this.printUserAgentInfo(this.envInfo.userAgent);
    }

    this.print('\n');
    this.printLabeledField('Directory:  ', this.envInfo.cwd, 'gray', true);
  }

  private detectBrowser(userAgent: string): { name: string; version: string } {
    let name = 'Unknown';
    let version = '';

    const ua = userAgent.toLowerCase();

    if (/firefox\/(\d+\.\d+)/.test(ua)) {
      name = 'Firefox';
      version = ua.match(/firefox\/(\d+\.\d+)/)![1];
    } else if (/edg\/(\d+\.\d+)/.test(ua)) {
      name = 'Edge';
      version = ua.match(/edg\/(\d+\.\d+)/)![1];
    } else if (/chrome\/(\d+\.\d+)/.test(ua)) {
      name = 'Chrome';
      version = ua.match(/chrome\/(\d+\.\d+)/)![1];
    } else if (/safari\/(\d+\.\d+)/.test(ua) && /version\/(\d+\.\d+)/.test(ua)) {
      name = 'Safari';
      version = ua.match(/version\/(\d+\.\d+)/)![1];
    } else if (/opr\/(\d+\.\d+)/.test(ua)) {
      name = 'Opera';
      version = ua.match(/opr\/(\d+\.\d+)/)![1];
    }

    return { name, version };
  }

  private printUserAgentInfo(userAgent: UserAgent) {
    const { name: browserName, version: browserVersion } = this.detectBrowser(userAgent.userAgent);

    this.print('\n');
    this.print(this.colored('bold', '  Browser/Navigator\n'));
    this.print(this.colored('gray', this.separator() + '\n'));

    this.printLabeledField('User Agent: ', userAgent.userAgent, 'white');
    this.printLabeledField('Browser:    ', `${browserName} ${browserVersion}`, 'white');

    if (userAgent.platform) {
      this.printLabeledField('Platform:   ', userAgent.platform, 'white');
    }

    if (userAgent.vendor) {
      this.printLabeledField('Vendor:     ', userAgent.vendor, 'white');
    }

    if (userAgent.language) {
      this.printLabeledField('Language:   ', userAgent.language, 'white');
    }

    if (userAgent.languages?.length > 0) {
      const langs = userAgent.languages.join(', ');
      this.printLabeledField('Languages:  ', langs, 'white');
    }
  }

  private printLabeledField(label: string, value: string, valueColor: string, fromStart: boolean = false): void {
    const prefix = `  ${this.colored('cyan', label)}`;
    const available = Math.max(0, this.lineWidth - visibleWidth(prefix));
    const displayValue = available > 3 && visibleWidth(value) > available
      ? this.truncateString(value, available, fromStart)
      : value;
    this.print(prefix + this.colored(valueColor, `${displayValue}\n`));
  }

  private truncateString(str: string, maxLength: number, fromStart: boolean = false): string {
    if (str.length <= maxLength) return str;

    if (fromStart) {
      return '...' + str.slice(-(maxLength - 3));
    }
    return str.substring(0, maxLength - 3) + '...';
  }

  private printTestConfiguration(config: any) {
    if (!config || Object.keys(config).length === 0) return;

    const lineWidth = this.lineWidth; // adjust or detect terminal width

    const orderPart =
      config.order?.random !== void 0
        ? (config.order.random ? "random" : "sequential")
        : null;

    const seedPart =
      config.order?.seed !== void 0 ? `seed: ${config.order.seed}` : null;

    const rightInfo = [orderPart, seedPart].filter(Boolean).join("  ");

    // Header line with right alignment
    const title = "  Test Configuration";
    const spacing = Math.max(1, lineWidth - title.length - rightInfo.length);
    const headerLine =
      this.colored("bold", title) +
      " ".repeat(spacing) +
      this.colored("gray", rightInfo);

    this.print("\n");
    this.print(headerLine + "\n");
    this.print(this.colored("gray", this.separator() + "\n"));

    // Then list the other flags in single line
    const parts = [];

    if (config.stopOnSpecFailure !== void 0)
      parts.push(
        this.colored("magenta", "Fail Fast:") +
        " " +
        this.colored("white", config.stopOnSpecFailure ? `${SYMBOLS.checked} enabled` : `${SYMBOLS.cross} disabled`)
      );

    if (config.stopSpecOnExpectationFailure !== void 0)
      parts.push(
        this.colored("magenta", "Stop Spec:") +
        " " +
        this.colored("white", config.stopSpecOnExpectationFailure ? `${SYMBOLS.checked} enabled` : `${SYMBOLS.cross} disabled`)
      );

    if (config.failSpecWithNoExpectations !== void 0)
      parts.push(
        this.colored("magenta", "No Expect:") +
        " " +
        this.colored("white", config.failSpecWithNoExpectations ? `${SYMBOLS.checked} fail` : `${SYMBOLS.cross} pass`)
      );

    if (parts.length > 0) {
      this.print("  " + parts.join(this.colored("gray", "  |  ")) + "\n");
    }
  }
}
````

## File: src/runner-session.ts
````typescript
import {
  embedClassSource,
} from './embedded-source';
import type {
  TestCatalog,
} from './test-catalog';
import type {
  TestSelector,
} from './test-selection';
import type {
  ExecutionPlan,
  ExecutionPlanOptions,
  PlannedExecution,
} from './execution-plan';
import type {
  FileListRow,
  SuiteListRow,
  TestListRow,
} from './catalog-query';
import {
  PlanningEngine,
} from './planning-engine';
import type {
  CatalogChangeSet,
} from './catalog-state';
import {
  CatalogQuery,
} from './catalog-query-builder';

export interface RunnerSessionAdapter<TResult> {
  execute(
    plan: ExecutionPlan,
  ): Promise<TResult>;

  close?():
    | void
    | Promise<void>;
}

export interface RunnerSessionOptions
  extends ExecutionPlanOptions {}

export type RunnerSessionState =
  | 'ready'
  | 'closing'
  | 'closed';

export interface RunnerSessionRefreshResult {
  changed: boolean;
  previousRevision: number;
  revision: number;
  changes: CatalogChangeSet;
}

export class RunnerSession<TResult> {
  private readonly planner:
    PlanningEngine;

  private stateValue:
    RunnerSessionState =
      'ready';

  private closePromise:
    Promise<void> | null = null;

  constructor(
    private readonly getCatalogValue:
      () => TestCatalog,
    private readonly adapter:
      RunnerSessionAdapter<TResult>,
    private readonly getOptions:
      () => RunnerSessionOptions =
        () => ({}),
  ) {
    this.planner =
      new PlanningEngine(
        this.getCatalogValue(),
      );
  }

  get state(): RunnerSessionState {
    return this.stateValue;
  }

  refresh():
    RunnerSessionRefreshResult {
    this.assertOpen();

    const previousRevision =
      this.planner.version;

    const changes =
      this.planner.update(
        this.getCatalogValue(),
      );

    return {
      changed: changes.changed,
      previousRevision,
      revision: this.planner.version,
      changes,
    };
  }

  revision(): number {
    this.refresh();

    return this.planner.version;
  }

  changes(): CatalogChangeSet {
    this.assertOpen();

    return this.planner.changes;
  }

  tests(
    selector?: string | RegExp,
  ): TestListRow[] {
    this.refresh();

    return new CatalogQuery(
      this.planner.catalog,
    ).tests(
      selector,
    );
  }

  suites(
    selector?: string | RegExp,
  ): SuiteListRow[] {
    this.refresh();

    return new CatalogQuery(
      this.planner.catalog,
    ).suites(
      selector,
    );
  }

  files(
    selector?: string | RegExp,
  ): FileListRow[] {
    this.refresh();

    return new CatalogQuery(
      this.planner.catalog,
    ).files(
      selector,
    );
  }

  stats(): {
    specs: number;
    suites: number;
    files: number;
  } {
    this.refresh();
    const catalog = this.planner.catalog;

    return {
      specs: catalog.specs.length,
      suites: catalog.suites.length,
      files: this.files().length,
    };
  }

  plan(
    selector?: TestSelector,
    options: ExecutionPlanOptions = {},
  ): PlannedExecution {
    this.refresh();

    return this.planner.plan(
      selector,
      {
        ...this.getOptions(),
        ...options,
      },
    );
  }

  planSpec(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): PlannedExecution {
    return this.plan(
      { spec: selector },
      options,
    );
  }

  planSuite(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): PlannedExecution {
    return this.plan(
      { suite: selector },
      options,
    );
  }

  planFile(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): PlannedExecution {
    return this.plan(
      { file: selector },
      options,
    );
  }

  shard(
    plan: PlannedExecution,
    index: number,
    count: number,
  ): PlannedExecution;
  shard(
    plan: ExecutionPlan,
    index: number,
    count: number,
  ): ExecutionPlan;
  shard(
    plan: ExecutionPlan,
    index: number,
    count: number,
  ): ExecutionPlan {
    this.assertOpen();

    return this.planner.shard(
      plan,
      index,
      count,
    );
  }

  partition(
    plan: PlannedExecution,
    count: number,
  ): PlannedExecution[];
  partition(
    plan: ExecutionPlan,
    count: number,
  ): ExecutionPlan[];
  partition(
    plan: ExecutionPlan,
    count: number,
  ): ExecutionPlan[] {
    this.assertOpen();

    return this.planner.partition(
      plan,
      count,
    );
  }

  async execute(
    plan: ExecutionPlan,
  ): Promise<TResult> {
    this.assertOpen();
    this.refresh();
    this.validatePlan(plan);

    const result =
      await this.adapter.execute(
        plan,
      );

    if (
      result !== null &&
      typeof result === 'object' &&
      Object.isExtensible(result) &&
      !(
        '__testifyCatalogVersion' in
        (result as object)
      )
    ) {
      Object.defineProperty(
        result,
        '__testifyCatalogVersion',
        {
          enumerable: false,
          configurable: false,
          writable: false,
          value:
            plan.catalogVersion ??
            this.planner.version,
        },
      );
    }

    return result;
  }

  run(
    selector?: TestSelector,
    options: ExecutionPlanOptions = {},
  ): Promise<TResult> {
    return this.execute(
      this.plan(
        selector,
        options,
      ),
    );
  }

  runSpec(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): Promise<TResult> {
    return this.execute(
      this.planSpec(
        selector,
        options,
      ),
    );
  }

  runSuite(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): Promise<TResult> {
    return this.execute(
      this.planSuite(
        selector,
        options,
      ),
    );
  }

  runFile(
    selector: string | RegExp,
    options: ExecutionPlanOptions = {},
  ): Promise<TResult> {
    return this.execute(
      this.planFile(
        selector,
        options,
      ),
    );
  }

  close(): Promise<void> {
    if (this.stateValue === 'closed') {
      return Promise.resolve();
    }

    if (this.closePromise) {
      return this.closePromise;
    }

    this.stateValue = 'closing';

    this.closePromise =
      Promise.resolve()
        .then(() =>
          this.adapter.close?.(),
        )
        .then(
          () => undefined,
        )
        .finally(() => {
          this.stateValue = 'closed';
        });

    return this.closePromise;
  }

  private assertOpen(): void {
    if (this.stateValue !== 'ready') {
      throw new Error(
        'Testify session is closed.',
      );
    }
  }

  private validatePlan(
    plan: ExecutionPlan,
  ): void {
    if (
      plan.catalogVersion === undefined ||
      plan.catalogVersion ===
        this.planner.version
    ) {
      return;
    }

    const knownSpecIds =
      this.planner.index.specById;

    const missing =
      plan.specIds.filter(
        (id) =>
          !knownSpecIds.has(id),
      );

    if (!missing.length) {
      return;
    }

    throw new Error(
      `Execution plan is stale; missing spec ids: ${missing.join(', ')}.`,
    );
  }
}

export function getEmbeddedRunnerSessionSource():
  string {
  return embedClassSource(
    'RunnerSession',
    RunnerSession,
  );
}


export type TestifyRunnerSession =
  RunnerSession<
    import('./execution-result')
      .ExecutionResult
  >;
````

## File: src/node-runner-host.ts
````typescript
import * as fs from 'fs';
import { pathToFileURL } from 'url';
import {
  logger,
} from './logger';
import { norm } from './utils';
import type { TestSelector } from './test-selection';
import type {
  ExecutionResult,
} from './execution-result';

export interface NodeRunnerModule {
  run(
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<ExecutionResult>;
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

    if (process.env.TESTIFY_DEBUG === '1') {
      logger.error(
        `[Testify debug] importing generated runner: ${moduleUrl}`,
      );
    }

    try {
      const runnerModule =
        await import(
          moduleUrl
        ) as NodeRunnerModule;

      if (process.env.TESTIFY_DEBUG === '1') {
        logger.error(
          `[Testify debug] generated runner exports: ${
            Object.keys(
              runnerModule,
            ).sort().join(', ')
          }`,
        );
      }

      this.runnerModule =
        runnerModule;

      return runnerModule;
    } catch (error) {
      if (process.env.TESTIFY_DEBUG === '1') {
        logger.error(
          `[Testify debug] generated runner import failed: ${
            error instanceof Error
              ? error.stack ??
                error.message
              : String(error)
          }`,
        );
      }

      throw error;
    }
  }

  async run(
    reporter: jasmine.CustomReporter,
    selector?: TestSelector,
  ): Promise<ExecutionResult> {
    const runner =
      this.runnerModule ??
      await this.load();

    return runner.run(
      reporter,
      selector,
    );
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

## File: src/node-test-runner.ts
````typescript
import type {
  TestSelector,
} from './test-selection';
import type {
  ExecutionResult,
} from './execution-result';
import type {
  ViteJasmineConfig,
} from './vite-jasmine-config';
import {
  ConsoleReporter,
} from './console-reporter';
import {
  logger,
} from './logger';
import {
  NodeRunnerMessages,
} from './log-messages';
import {
  NodeArtifactHost,
} from './node-artifact-host';
import {
  NodeRuntimeHost,
} from './node-runtime-host';
import {
  NodeExecutionHost,
} from './node-execution-host';
import {
  CoverageHost,
} from './coverage-host';

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
  private readonly selector: TestSelector | undefined;
  private readonly reporter:
    jasmine.CustomReporter;

  private readonly artifacts:
    NodeArtifactHost;

  private readonly execution:
    NodeExecutionHost;

  private isRunning = false;

  constructor(
    config: ViteJasmineConfig,
    private readonly options:
      TestRunnerOptions = {},
  ) {
    this.selector = options.selector ?? config.selector;
    this.reporter =
      options.reporter ??
      new ConsoleReporter();

    this.artifacts =
      new NodeArtifactHost(
        config,
      );

    this.execution =
      new NodeExecutionHost(
        this.artifacts,
        new NodeRuntimeHost(),
        new CoverageHost(
          !!options.coverage,
        ),
      );
  }

  generateTestRunner(): void {
    this.artifacts.generate();
  }

  async start():
    Promise<ExecutionResult> {
    if (this.isRunning) {
      logger.error(
        NodeRunnerMessages
          .testProcessAlreadyRunning(),
      );

      throw new Error(
        'Test process already running',
      );
    }

    this.isRunning = true;

    try {
      logger.println(
        NodeRunnerMessages
          .startingTestRunner(),
      );

      return await this.execution
        .run(
          this.reporter,
          {
            cwd: this.options.cwd,
            env: this.options.env,
            file: this.options.file,
            suppressConsoleLogs:
              this.options
                .suppressConsoleLogs,
            selector:
              this.selector,
          },
        );
    } catch (error: unknown) {
      const details =
        error instanceof Error
          ? error.stack ??
            error.message
          : String(error);

      logger.error(
        NodeRunnerMessages
          .testExecutionError(
            details,
          ),
      );

      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    this.artifacts.clear();
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }
}
````

## File: README.md
````markdown
# Testify

Testify is a test execution engine for Jasmine that runs the same TypeScript test suites in real browsers or Node.js.

It handles test discovery, execution planning, runtime control, watch mode, HMR, coverage, and interactive browser debugging. Jasmine remains the test language and provides familiar `describe`, `it`, and `expect` APIs.

<p align="center">
  <a href="https://github.com/epikodelabs/testify/actions/workflows/build.yml"><img src="https://github.com/epikodelabs/testify/actions/workflows/build.yml/badge.svg?branch=main" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/@epikodelabs/testify"><img src="https://img.shields.io/npm/v/@epikodelabs/testify.svg?style=flat-square" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/@epikodelabs/testify"><img src="https://img.shields.io/npm/dt/@epikodelabs/testify.svg?style=flat-square" alt="NPM Downloads"></a>
</p>

## Why Testify

Use Testify when you want one testing workflow across fast Node.js execution and real browser environments.

- Run Jasmine specs in Chrome, Firefox, WebKit, or Node.js.
- Use Node.js for fast tests that do not require browser APIs.
- Run tests in real browsers when DOM or browser behavior matters.
- Work with TypeScript and source maps without a separate test compilation workflow.
- Use watch mode and HMR during development.
- Generate HTML, LCOV, and text coverage reports.
- Select tests by file or suite from the CLI.
- Debug individual specs directly in Node.js.
- Inspect and execute tests interactively through the browser Playground.

## Installation

Install Testify as a development dependency:

```bash
npm install --save-dev @epikodelabs/testify
```

Install the Playwright browser binaries if you plan to run browser tests:

```bash
npx playwright install
```

Testify does not use a postinstall script to modify your project. Browser binaries are installed only when you explicitly install them.

## Quick Start

Run the test suite:

```bash
npx testify
```

A standard Jasmine spec works without Testify-specific test syntax:

```typescript
// tests/calculator.spec.ts
import { Calculator } from '@contoso/calculator';

describe('Calculator', () => {
  it('should add', () => {
    expect(new Calculator().add(2, 3)).toBe(5);
  });
});
```

Choose the execution mode that fits the test:

```bash
# Headed browser
npx testify

# Headless browser
npx testify --headless

# Node.js
npx testify --browser node

# Browser coverage
npx testify --coverage

# Development watch mode
npx testify --watch
```

## Execution Modes

| Mode | Command | Recommended use |
|------|---------|-----------------|
| Headed browser | `npx testify` | Local development and browser debugging |
| Headless browser | `npx testify --headless` | Automated browser testing and CI |
| Headless Firefox | `npx testify --headless --browser firefox` | Firefox-specific browser testing |
| Headless WebKit | `npx testify --headless --browser webkit` | WebKit-specific browser testing |
| Node.js | `npx testify --browser node` | Fast tests that do not require browser APIs |
| Watch | `npx testify --watch` | Interactive development with HMR |

### Mode restrictions

`--watch` requires headed browser mode. It cannot be combined with `--headless`, `--coverage`, or `--browser node`.

`--coverage` cannot be combined with `--watch`.

For quieter Node.js output, use `--silent` or `--quiet`.

## Selecting Tests

Testify can select tests by spec filename or suite name.

### Select a file

Use `--file` or `-f`:

```bash
npx testify --file forms.spec.ts
npx testify -f forms.spec.ts
```

Quoting is optional for simple filenames:

```bash
npx testify --file "forms.spec.ts"
npx testify --file forms.spec.ts
```

Use normal shell quoting when the filename contains spaces or shell-sensitive characters:

```bash
npx testify --file "forms (legacy).spec.ts"
```

Testify accepts source filenames such as `forms.spec.ts` and resolves them to the corresponding built test artifacts internally.

### Select a suite

Use `--suite` or `-s`:

```bash
npx testify --suite Validation
npx testify -s Validation
```

Quote suite names that contain spaces or shell-sensitive characters:

```bash
npx testify --suite "Form Validation"
npx testify -s "Validation (async)"
```

Selecting a suite includes its descendant suites.

### Select a suite within a file

File and suite selectors can be combined:

```bash
npx testify --file forms.spec.ts --suite Validation
npx testify -f "forms (legacy).spec.ts" -s "Form Validation"
```

The resulting test set must match both selectors.

## Playground

In headed watch mode, Testify exposes a live `session` object in browser DevTools. It provides an interactive API for discovering tests, creating execution plans, running selected tests, and inspecting results.

Inspect the current catalog:

```js
session.tests()
session.suites()
session.files()
```

Create a plan:

```js
const plan = session
  .plan()
  .filter(test => /validation/i.test(test.fullName));
```

Execute it:

```js
const result = await session.execute(plan);
```

Create another plan from failed results:

```js
const failed = plan.where(result, 'failed');
```

Repeat the previous run or retry its failures:

```js
await session.rerun()
await session.retry()
```

Display the interactive API reference:

```js
session.help()
```

Close the session when finished:

```js
await session.exit()
```

## Code Coverage

Run browser tests with coverage enabled:

```bash
npx testify --coverage
```

Testify generates:

- `coverage/index.html`
- `coverage/lcov.info`
- a text summary in the console

Coverage cannot be combined with watch mode.

## Single-Spec Debugging

Testify also provides a Jasmine CLI for running an individual spec directly in Node.js.

Initialize editor support once:

```bash
npx jasmine init
```

The Jasmine CLI uses `tsx` and the nearest TypeScript project configuration automatically. Testify also resolves extensionless relative imports and directory indexes consistently with its browser runner.

Run a single spec:

```bash
node --enable-source-maps \
  ./node_modules/@epikodelabs/testify/bin/jasmine \
  --spec ./tests/example.spec.ts
```

This is useful when you want to debug one test file directly without running the complete suite.

## CLI Reference

| Flag | Description |
|------|-------------|
| `--headless` | Run in headless browser mode |
| `--browser <name>` | Select `chrome`, `firefox`, `webkit`, or `node` |
| `--watch` | Run headed browser mode with watch and HMR |
| `--coverage` | Generate coverage reports |
| `--file <file>`, `-f <file>` | Run specs matching a spec filename |
| `--suite <name>`, `-s <name>` | Run a matching suite and its descendants |
| `--seed <n>` | Set the randomization seed |
| `--silent`, `--quiet` | Suppress console logs in Node.js mode |
| `--preserve` | Preserve generated outputs instead of regenerating them |
| `--help` | Display CLI help |

### Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Test failures |
| `2` | Invalid CLI usage |
| `3` | Configuration error |
| `4` | Internal error |
| `130` | Interrupted with SIGINT |
| `143` | Terminated with SIGTERM |

## CI Example

A CI pipeline can run fast Node.js tests first and then execute the browser suite with coverage:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx testify --browser node
      - run: npx testify --headless --browser chrome --coverage
```

## Troubleshooting

| Problem | Suggested action |
|---------|------------------|
| Browser executable is unavailable | Run `npx playwright install` |
| Configured port is already in use | Select another port with `--port` |
| No tests are discovered | Check test directories, `.spec.ts` filenames, and exclude patterns |
| TypeScript imports fail | Verify that the active TypeScript project resolves the imports |
| Watch mode does not start | Use headed browser mode without `--headless`, `--coverage`, or `--browser node` |
| Coverage is not generated | Run with `--coverage` and without `--watch` |

## License

MIT (c) 2026

<p align="center">
  <a href="https://www.npmjs.com/package/@epikodelabs/testify">Install from NPM</a> -
  <a href="https://github.com/epikodelabs/testify">View on GitHub</a>
</p>
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

  async generateHtmlFile(
    selectedSpecFiles?: string[],
  ): Promise<void> {
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

    const htmlContent = this.pageBuilder.buildStatic(
      selectedSpecFiles ?? artifacts.specFiles,
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

## File: src/node-runner-module-source.ts
````typescript
import type { ViteJasmineConfig } from './vite-jasmine-config';
import {
  getEmbeddedNodeJasmineRuntimeSource,
} from './jasmine-node-runtime';
import {
  getEmbeddedExecutionPlanSource,
} from './execution-plan';
import {
  getEmbeddedTestSelectionSource,
} from './test-selection';
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
  getEmbeddedCatalogStateSource,
} from './catalog-state';
import {
  getEmbeddedPlanningEngineSource,
} from './planning-engine';
import {
  getEmbeddedCatalogQuerySource,
} from './catalog-query';
import {
  getEmbeddedNameHelperSource,
} from './embedded-source';

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

  const nameHelperSource =
    getEmbeddedNameHelperSource();

  const catalogIndexSource =
    getEmbeddedTestCatalogIndexSource();

  const testSelectionSource =
    getEmbeddedTestSelectionSource();

  const executionPlanSource =
    getEmbeddedExecutionPlanSource();

  const nodeExecutionAdapterSource =
    getEmbeddedNodeExecutionAdapterSource();

  const catalogQuerySource =
    getEmbeddedCatalogQuerySource();

  const catalogStateSource =
    getEmbeddedCatalogStateSource();

  const planningEngineSource =
    getEmbeddedPlanningEngineSource();

  const runnerSessionSource =
    getEmbeddedRunnerSessionSource();

  return `// Auto-generated in-process Jasmine test runner
${nameHelperSource}

${jasmineRuntimeSource}

${catalogIndexSource}

${testSelectionSource}

${executionPlanSource}

${nodeExecutionAdapterSource}

${catalogQuerySource}

${catalogStateSource}

${planningEngineSource}

${runnerSessionSource}

export async function run(reporter, selector) {
  const jasmineCore =
    await import(
      ${JSON.stringify("JASMINE_CORE_URL_PLACEHOLDER")}
    );

  const jasmineRequire =
    jasmineCore.default;

  const jasmineRuntime =
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

  const session =
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

  try {
    return await session.run(
      selector,
    );
  } finally {
    await session.close();
  }
}
`
    .replace(
      'JASMINE_CORE_URL_PLACEHOLDER',
      jasmineCoreUrl,
    );
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
import { CoverageHost } from './coverage-host';
import { HmrManager } from './hmr-manager';
import { logger } from './logger';
import { setAnsiMode } from './symbols';
import { RunnerMessages } from './log-messages';
import { ExitCodeError, EXIT_CODES } from './exit-codes';
import { getExecutionExitCode } from './cli-result-adapter';

const { build: viteBuild } = await import('vite');

type PreprocessResult = 'built' | 'no-specs';

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
  private coverageHost: CoverageHost;
  private hmrManager: HmrManager | null = null;
  private completePromiseResolve: (() => void) | null = null;
  private completePromise = new Promise<void>((resolve, reject) => { this.completePromiseResolve = resolve; });
  private primarySrcDir: string;
  private primaryTestDir: string;
  private shouldPreserve(): boolean {
    return !!this.config.preserveOutputs;
  }

  private cleanOutputDirectory(): void {
    const outDir = path.resolve(this.config.outDir);
    const lockFilePath =
      this.config.lockFilePath
        ? path.resolve(this.config.lockFilePath)
        : null;

    if (!lockFilePath || path.dirname(lockFilePath) !== outDir) {
      fs.rmSync(outDir, { recursive: true, force: true });
      return;
    }

    const lockFileName = path.basename(lockFilePath);
    for (const entry of fs.readdirSync(outDir)) {
      if (entry === lockFileName) {
        continue;
      }

      fs.rmSync(path.join(outDir, entry), { recursive: true, force: true });
    }
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
      browser: config.browser ?? 'chrome',
      port: config.port ?? 8888,
      headless: config.headless ?? false,
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
    this.coverageHost = new CoverageHost(
      !!this.config.coverage,
    );
    this.consoleReporter = new ConsoleReporter();
    this.nodeTestRunner = new NodeTestRunner(this.config, {
      reporter: this.consoleReporter,
      cwd: this.config.outDir,
      file: 'test-runner.mjs',
      coverage: this.config.coverage,
      suppressConsoleLogs: this.config.suppressConsoleLogs
    });
  }



  private describeConfiguredTestDirs(): string {
    const configured =
      Array.isArray(this.config.testDirs)
        ? this.config.testDirs
        : [this.config.testDirs];

    const relativeDirs =
      configured
        .filter((dir): dir is string => !!dir)
        .map((dir) => {
          const relative =
            norm(
              path.relative(
                process.cwd(),
                dir,
              ),
            );

          return relative.length > 0
            ? relative
            : '.';
        });

    return relativeDirs.length > 0
      ? relativeDirs.join(', ')
      : norm(
          path.relative(
            process.cwd(),
            this.primaryTestDir,
          ),
        ) || '.';
  }

  async preprocess(): Promise<PreprocessResult> {
    try {
      let { srcFiles, specFiles: discoveredSpecFiles } = await this.fileDiscovery.discoverSources();
      const normalizeSpecFile = (value: string) =>
        norm(value)
          .replace(/^\.\//, '')
          .replace(/\.(?:[cm]?[jt]sx?)$/i, '');
      const selectedFile = this.config.fileFilter
        ? normalizeSpecFile(this.config.fileFilter)
        : undefined;
      const selector = selectedFile ?? '';
      const matchesSelector = (file: string) => {
            const candidate = normalizeSpecFile(
              norm(path.relative(process.cwd(), file)),
            );
            return (
              candidate === selector ||
              candidate.endsWith('/' + selector) ||
              path.posix.basename(candidate) === path.posix.basename(selector)
            );
          };

      let specFiles = selectedFile
        ? discoveredSpecFiles.filter(matchesSelector)
        : discoveredSpecFiles;

      if (selectedFile && specFiles.length === 0 && this.config.browser !== 'node') {
        const { specFiles: allSpecFiles } = await this.fileDiscovery.discoverAllSources();
        const nodeOnlyMatches = allSpecFiles.filter(matchesSelector);

        if (nodeOnlyMatches.length > 0) {
          // The requested spec belongs to the Node host graph. Switch the
          // isolated run to the Node pipeline instead of handing its imports
          // to Vite's browser resolver.
          this.config.browser = 'node';
          this.config.headless = true;
          ({ srcFiles, specFiles: discoveredSpecFiles } = await this.fileDiscovery.discoverSources());
          specFiles = discoveredSpecFiles.filter(matchesSelector);
        }
      }

      if (specFiles.length === 0) {
        logger.println(
          RunnerMessages.noTestFilesFound(
            this.describeConfiguredTestDirs(),
          ),
        );
        return 'no-specs';
      }

      const entryFiles = [...srcFiles, ...specFiles];
      const selectedSpecArtifacts = specFiles.map((file) =>
        this.fileDiscovery.getOutputName(file),
      );
      const viteConfig = this.viteConfigBuilder.createViteConfig(entryFiles);
      const input: Record<string, string> = {};
 
      const entryKeyFromOutput = (
        file: string,
      ) =>
        this.fileDiscovery
          .getOutputName(
            file,
          )
          .replace(
            /\.mjs$/,
            '',
          );

      for (const file of entryFiles) {
        input[entryKeyFromOutput(file)] = file;
      }

      if (fs.existsSync(this.config.outDir) && !this.shouldPreserve()) {
        logger.println(RunnerMessages.cleaningOutputDirectory());
        this.cleanOutputDirectory();
      }

      if (!fs.existsSync(this.config.outDir)) {
        fs.mkdirSync(this.config.outDir, { recursive: true });
      }

      viteConfig.build!.rolldownOptions!.input = input;

      logger.println(RunnerMessages.buildingFiles(Object.keys(input).length));
      this.viteCache = await viteBuild(viteConfig);

      const moduleFiles =
        (
          await glob(
            path
              .join(
                this.config.outDir,
                '**/*.mjs',
              )
              .replace(
                /\\/g,
                '/',
              ),
          )
        ).filter(
          (file) =>
            !/\.spec\.mjs$/i.test(
              file,
            ),
        );

      for (
        const moduleFile of
        moduleFiles
      ) {
        const result =
          await this.instrumenter
            .instrumentFile(
              moduleFile,
            );

        const outFile =
          path.join(
            this.config.outDir,
            path.relative(
              this.config.outDir,
              moduleFile,
            ),
          );
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
          await this.htmlGenerator.generateHtmlFile(selectedSpecArtifacts);
        }
      } else if (preserveHtml) {
        logger.println(RunnerMessages.preservingExistingHtml());
      }

      const runnerPath = path.join(this.config.outDir, 'test-runner.mjs');
      const preserveRunner = this.shouldPreserve() && fs.existsSync(runnerPath);
      if (this.config.headless && this.config.browser === 'node' && !preserveRunner) {
        this.nodeTestRunner.generateTestRunner();
      } else if (this.config.headless && this.config.browser === 'node' && preserveRunner) {
        logger.println(RunnerMessages.preservingExistingRunner());
      }

      return 'built';
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
    // `start()` is intentionally one-shot. Watch/HMR has its own explicit
    // entrypoint (`watch()`), used by the CLI only when --watch is present.
    this.config.watch = false;

    logger.println(this.config.headless ? RunnerMessages.startingHeadless() : RunnerMessages.startingServer());

    try {
      const preprocessResult = await this.preprocess();
      if (preprocessResult === 'no-specs') {
        return EXIT_CODES.SUCCESS;
      }
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
    const preprocessResult = await this.preprocess();
    if (preprocessResult === 'no-specs') {
      return EXIT_CODES.SUCCESS;
    }
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

    const shutdown = async (source: 'browser' | 'session') => {
      if (shuttingDown) return;
      shuttingDown = true;

      if (source === 'session') {
        logger.println(RunnerMessages.sessionExitRequested());
        await this.browserManager.closeBrowser();
      } else {
        logger.println(RunnerMessages.browserWindowClosed());
      }

      await this.cleanup();
      watchFinishedResolve?.(EXIT_CODES.SUCCESS);
    };

    this.webSocketManager.on(
      'sessionExitRequested',
      () => {
        void shutdown('session');
      },
    );

    const onBrowserClose = async () => {
      await shutdown('browser');
    };

    try {
      await this.browserManager.openBrowser(
        this.config.port!,
        onBrowserClose,
        { exitOnClose: false },
      );
    } catch {
      await this.cleanup();
      return EXIT_CODES.INTERNAL_ERROR;
    }

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
      coveragePromise =
        this.coverageHost.generate(
          coverage,
        );
      testsCompletedResolve?.();
    });

    const browserType = await this.browserManager.checkBrowser(this.config.browser!);

    if (!browserType) {
      logger.println(RunnerMessages.headlessBrowserUnavailable());
      this.nodeTestRunner.generateTestRunner();
      const result =
        await this.nodeTestRunner.start();

      await this.cleanup();

      return getExecutionExitCode(
        result,
      );
    }

    try {
      await this.browserManager.runHeadlessBrowserTests(browserType, this.config.port!);
      // Wait for the jasmineDone WebSocket message to be processed so the final
      // summary is printed before we tear down the WebSocket server and exit.
      const testsCompletedTimeout = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('Timed out waiting for test completion message')), 5000);
      });
      await Promise.race([testsCompletedPromise, testsCompletedTimeout]).catch((error) => {
        logger.error(RunnerMessages.testsCompletedTimeout(error.message));
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
      const result =
        await this.nodeTestRunner.start();

      return getExecutionExitCode(
        result,
      );
    } catch (_error: any) {
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
      await this.coverageHost.generate(
        coverage,
      );
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

    try {
      await this.browserManager.openBrowser(
        this.config.port!,
        onBrowserClose,
      );
    } catch {
      await this.cleanup();
      return EXIT_CODES.INTERNAL_ERROR;
    }

    // Keep the runner alive until the browser closes or an explicit shutdown signal.
    return runFinishedPromise;
  }
}
````

## File: src/log-messages.ts
````typescript
// ─── Emoji/symbol placeholders ────────────────────────────────────────────────
// Replace these with actual emoji or terminal symbols at render time if desired.
// They are intentionally kept as plain ASCII placeholders so the strings remain
// portable and easy to localise / override.
import { toConsoleSafe } from './ascii-sanitizer';

// %checked%       → ✅  (success / done)
// %cross%         → x  (error / failure)
// %error%         → ERROR prompt (logger-resolved)
// %warn%          → WARN prompt (logger-resolved)
// %info%          → 💡  (informational)
// %globe%         → 🌐  (browser / network)
// %doc%           → 📄  (file / document)
// %puzzle%        → 🧩  (suite tree)
// %stop%          → 🛑  (abort / halt)
// %bulb%          → 📌  (tip / hint)
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
    `%warn% Unknown browser "${name}", falling back to Node.js mode`,

  playwrightNotInstalled: (name: string) =>
    `%info% Playwright runtime not available. Browser "${name}" not available.`,

  playwrightInstallTip: () =>
    `%bulb% Tip: Reinstall dependencies, then install browsers explicitly:\n   npx playwright install`,

  browserExecutionFailed: (name: string, message: string) =>
    `%error% Browser execution failed for "${name}": ${message}`,

  navigatingToTestPage: () =>
    `%globe% Navigating to test page...`,

  testsAbortedByUser: () =>
    `%stop% Tests aborted by user (Ctrl+C)`,

  testExecutionFailed: (error: unknown) =>
    `%error% Test execution failed: ${error}`,

  browserConsoleError: (text: string) =>
    `%error% ${text}`,

  browserConsoleWarn: (text: string) =>
    `%warn% ${text}`,

  pageError: (message: string) =>
    `%error% Page error: ${message}`,

  requestFailed: (url: string, errorText: string | undefined) =>
    `%error% ${url}, ${errorText}`,

  unknownBrowserFallbackToChrome: (name: string) =>
    `%warn%  Unknown browser "${name}", using Chrome instead`,

  browserNotInstalled: (name: string) =>
    `%error% Browser "${name}" is not installed.`,

  browserInstallTip: (name: string) =>
    `%bulb% Tip: Install it by running: npx playwright install ${name.toLowerCase()}`,

  openingBrowser: (name: string) =>
    `%globe% Opening ${name} browser...`,

  playwrightNotInstalledManual: (url: string) =>
    `%info% Playwright runtime not available. Please open browser manually: ${url}`,

  playwrightAutoOpenTip: () =>
    `%bulb% Tip: Install browsers explicitly to enable automatic browser opening:\n   npx playwright install`,

  failedToOpenBrowser: (message: string) =>
    `%error% Failed to open browser: ${message}`,

  openBrowserManually: (url: string) =>
    `%bulb% Please open browser manually: ${url}`,

  failedToCloseBrowser: (error: unknown) =>
    `%error% Failed to close browser: ${error}`,
};

// ─── cli-handler.ts ───────────────────────────────────────────────────────────

export const CLIMessages = {
  invalidSeed: () =>
    `%error% Invalid --seed value (expected a number).`,

  failedToInitializeProject: (error: unknown) =>
    `%error% Failed to initialize testify config: ${error}`,

  browserArgMissing: () =>
    `%error% --browser requires a browser name (chrome|chromium|firefox|webkit|node).`,

  projectArgMissing: () =>
    `%error% --project requires a package name or path.`,

  portArgMissing: () =>
    `%error% --port requires a number between 1 and 65535.`,

  invalidPort: () =>
    `%error% Invalid --port value (expected an integer between 1 and 65535).`,

  configArgMissing: () =>
    `%error% --config requires a path to a config file.`,

  timeoutArgMissing: () =>
    `%error% --timeout requires a number of milliseconds.`,

  invalidTimeout: () =>
    `%error% Invalid --timeout value (expected a positive integer, in milliseconds).`,

  fileArgMissing: () =>
    `%error% --file / -f requires a spec filename.`,

  suiteArgMissing: () =>
    `%error% --suite / -s requires a suite name.`,

  unknownCommand: (command: string) =>
    `%error% Unknown command: ${command}`,

  invalidArguments: (error: unknown) =>
    `%error% Invalid command line arguments: ${error instanceof Error ? error.message : String(error)}`,

  watchIncompatibleFlags: (flags: string[]) =>
    `%error% The --watch flag cannot be used with: ${flags.join(', ')}`,

  couldNotResolveProject: (name: string) =>
    `%error% Could not resolve project "${name}". It is not a directory and not a known package name.`,

  preserveOutputsEnabled: () =>
    `%info% Preserve outputs enabled (skip regenerating index.html and test-runner.mjs when present).`,

  failedToStartTestRunner: (error: unknown) =>
    `%error% Failed to start test runner: ${toConsoleSafe(String(error))}`,

  // Help text — kept as a single block so the caller can println() each line
  helpLines: (): string[] => [
    'testify - simple test execution for real browsers and Node.js.',
    '',
    'Usage:',
    '  npx testify [options]',
    '  npx testify init               # prepare editor and debugging support',
    '',
    'Options:',
    '  --headless           Run tests in the default Playwright browser without UI',
    '  --browser, -b <name> Target browser (chrome|chromium|firefox|webkit|node)',
    '  --watch, -w          Launch browser mode + HMR for rapid feedback (cannot be headless)',
    '  --coverage, -c       Generate Istanbul coverage reports after the run',
    '  --file, -f <file>    Run specs from the matching spec filename',
    '  --suite, -s <name>   Run the matching suite (descendants included)',
    '  --seed <number>      Seed used for randomization order',
    '  --random             Force randomized spec order (overrides testify.json)',
    '  --no-random          Force sequential spec order (overrides testify.json)',
    '  --bail               Stop on the first expectation failure',
    '  --timeout <ms>       Per-spec timeout, in milliseconds',
    '  --port <number>      Override the runner port',
    '  --silent, --quiet, -q  Suppress console logs when running in Node.js mode',
    '  --preserve           Skip regenerating index.html and test-runner.mjs when outputs exist',
    '  --ansi               Use plain ASCII output (no colors, emoji, or cursor control)',
    '  --project, -p <name> Run tests only for the specified package or directory',
    '  --config <path>      Use a config file other than ./testify.json',
    '  --exclusive          Close any previously running testify instance before starting',
    '  --version, -v        Print the installed testify version',
    '  --help, -h           Show this help message',
    '',
    'Smart defaults:',
    '  Testify handles the usual setup path without much ceremony.',
    '  Use --preserve when you want to inspect generated assets by hand.',
    '',
    'Tip:',
    '  npx testify --browser node              # fastest route for non-DOM specs',
    '  npx testify --watch                     # fast feedback with HMR',
    '  npx testify --headless                  # quiet browser run for CI',
    '  npx testify -f forms.spec.ts            # run one spec file',
    '  npx testify -s "Validation"            # run one suite',
    '  npx testify --bail --seed 42            # stop on first failure, reproducible order',
    '  npx testify --config ci.testify.json    # run with an alternate config file',
    '',
    'Playwright Browsers:',
    '  npx playwright install                         # install all supported browsers',
    '  npx playwright install chromium                # install only Chromium',
  ],
};

// ─── config-manager.ts ────────────────────────────────────────────────────────

export const ConfigMessages = {
  failedToParseConfig: (error: unknown) =>
    `%error% Failed to parse existing testify.json: ${error}`,

  failedToCreateConfig: (error: unknown) =>
    `%error% Failed to create default testify.json: ${error}`,

  createdDefaultConfig: (path: string) =>
    `%info% Created default test runner config at ${path}`,

  configAlreadyExists: (path: string) =>
    `%info% Config already exists at ${path}`,

  failedToWriteConfig: (error: unknown) =>
    `%error% Failed to write testify.json: ${error}`,

  generatedDefaultConfig: (path: string) =>
    `%info% Generated default Vite Jasmine config at ${path}`,
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
    `%error% Failed to write coverage file: ${error}`,

  coverageReportsGenerated: () =>
    `%checked% Coverage reports generated successfully`,
};

// ─── file-discovery-service.ts ───────────────────────────────────────────────

export const FileDiscoveryMessages = {
  errorDiscoveringFiles: (error: unknown) =>
    `%error% Error discovering files: ${error}`,
};

// ─── host-adapter.ts ─────────────────────────────────────────────────────────

export const HostAdapterMessages = {
  ipcEventError: (message: string) =>
    `%error% Error processing IPC event: ${message}`,

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
    `%error% Failed to kill process on port ${port}: ${message}\n${stderr}`,

  portReclaimed: (port: number) =>
    `%checked% Port ${port} reclaimed.`,

  portStillBusy: (port: number) =>
    `%error% Port ${port} is still busy after reclaim attempt.`,

  serverError: (error: unknown) =>
    `%error% ${error}`,
};

// ─── hmr-manager.ts ──────────────────────────────────────────────────────────

export const HmrMessages = {
  fileFilterUpdated: (filter: unknown) =>
    `%checked% File filter updated: ${filter}`,

  rebuildModeSet: (mode: string) =>
    `%checked% Rebuild mode set to: ${mode}`,

  sourceChangeStrategySet: (strategy: string) =>
    `%checked% Source change strategy set to: ${strategy}`,

  cannotExtractDependencies: (filePath: string, message: string) =>
    `%error% Could not extract dependencies from ${filePath}: ${message}`,

  watchingFiles: (count: number, mode: string, strategy: string) =>
    `%checked% HMR watching ${count} files (mode: ${mode}, strategy: ${strategy})`,

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
    `%error% Error in handleFileAdd: ${error}`,

  errorInHandleFileRemove: (error: unknown) =>
    `%error% Error in handleFileRemove: ${error}`,

  errorInHandleDirectoryAdd: (error: unknown) =>
    `%error% Error in handleDirectoryAdd: ${error}`,

  errorInHandleDirectoryRemove: (error: unknown) =>
    `%error% Error in handleDirectoryRemove: ${error}`,

  skippingRebuildNonExistent: (filePath: string) =>
    `%warn%  Skipping rebuild for non-existent file: ${filePath}`,

  rebuildFailed: (error: unknown) =>
    `%error% Rebuild failed: ${toConsoleSafe(String(error))}`,

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
    `%error% Vite build failed: ${toConsoleSafe(String(error))}`,

  retryingWithFilteredEntries: () =>
    `%refresh% Retrying build with filtered entry points...`,

  allEntryPointsDeleted: () =>
    `%warn%  All entry points were deleted, skipping build`,

  viteBuildCompleted: (ms: number) =>
    `%box% Vite rebuild completed in ${ms}ms`,

  rebuildComplete: (type: string, count: number, ms: number) =>
    `%checked% Rebuild complete (${type}): ${count} files in ${ms}ms`,

  watcherStopped: () =>
    `%checked% HMR watcher stopped`,
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

  testExecutionError: (message: string) =>
    `%error% Test execution error: ${message}`,

  testProcessAlreadyRunning: () =>
    `%error% Test process is already running`,

  unhandledRejection: (error: string) =>
    `%error% ${error}`,

  uncaughtException: (error: string) =>
    `%error% ${error}`,

  caughtSignal: (signal: string) =>
    `%stop% Caught signal: ${signal}`,

  errorDuringExecution: (message: string) =>
    `%error% Error during test execution: ${message}`,

  failedToRunTests: (message: string) =>
    `%error% Failed to run tests: ${message}`,
};

// ─── process-lock.ts ─────────────────────────────────────────────────────────

export const ProcessLockMessages = {
  staleLockFile: (pid: number) =>
    `%broom% Stale lock file found (PID ${pid} is gone). Removing.`,

  nonNodeProcess: (pid: number, name: string) =>
    `%warn%  PID ${pid} does not appear to be a Node process (${name}). Skipping kill.`,

  couldNotTerminate: (pid: number) =>
    `%error% Could not terminate previous testify instance (PID ${pid}).`,

  terminatedPrevious: (pid: number) =>
    `%lock% Terminated previous testify instance (PID ${pid}).`,
};

// ─── ts-jasmine-cli.ts ────────────────────────────────────────────────────────

export const JasmineCLIMessages = {
  unknownCommand: (command: string) =>
    `%error% Unknown command: ${command}`,

  missingSpecArg: () =>
    `%error% Missing required --spec <path>`,

  specFileNotFound: (spec: string) =>
    `%error% Spec file not found: ${spec}`,

  invalidSeedValue: (value: string) =>
    `%error% Invalid --seed value: ${value}`,

  notRunningInVsCode: () =>
    `%error% \`npx jasmine init\` is only supported when run from VS Code.`,

  openVsCodeTerminalHint: () =>
    `%info% Open VS Code, then run this from the integrated terminal (Terminal -> New Terminal).`,

  createdVsCodeLaunchConfig: (path: string) =>
    `%info% Created VS Code launch config at ${path}`,

  addedVsCodeConfiguration: (name: string) =>
    `Added configuration: ${name}`,

  failedToParseVsCodeConfig: (path: string) =>
    `%error% Failed to parse existing VS Code launch config: ${path}`,

  addConfigManually: () =>
    `%info% Add this configuration manually:`,

  vsCodeConfigAlreadyContains: (name: string) =>
    `%info% VS Code launch config already contains: ${name}`,

  updatedVsCodeLaunchConfig: (path: string) =>
    `%info% Updated VS Code launch config at ${path}`,

  unhandledRejection: (message: string) =>
    `%error% ${message}`,

  uncaughtException: (message: string) =>
    `%error% ${message}`,

  failedToRunJasmine: (stack: string) =>
    `%error% Failed to run jasmine: ${stack}`,
};

// ─── vite-config-builder.ts ──────────────────────────────────────────────────

export const ViteConfigMessages = {
  noFilesToBuild: () =>
    `%error% No files found to build`,

  incrementalBuild: (count: number) =>
    `%box% Incremental build: ${count} files`,

  tsconfigParseFailed: (error: unknown) =>
    `%error% tsconfig parse failed: ${error}`,
};

// ─── vite-jasmine-runner.ts ──────────────────────────────────────────────────

export const RunnerMessages = {
  startingHeadless: () =>
    `%rocket% Starting Jasmine Test Runner (Headless)...`,

  startingServer: () =>
    `%rocket% Starting Jasmine Test Server...`,

  noTestFilesFound: (locations: string) =>
    `%info% No matching spec files found in ${locations}. Nothing to run.`,

  buildFailed: (error: unknown) =>
    `%error% Build failed: ${toConsoleSafe(String(error))}`,

  preprocessFailed: (error: unknown) =>
    `%error% Preprocessing failed: ${toConsoleSafe(String(error))}`,

  invalidNodeHeadedMode: () =>
    `%error% Invalid configuration: Node.js runner cannot run in headed mode.`,

  watchOnlyHeaded: () =>
    `%error% --watch mode is only supported in headed browser environments.`,

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

  sessionExitRequested: () =>
    `%stop% Testify Playground requested session exit`,

  headlessBrowserUnavailable: () =>
    `%warn%  Headless browser not available. Falling back to Node.js runner.`,

  browserTestExecutionFailed: () =>
    `%error% Browser test execution failed. Need to install browser binaries?`,

  nodeTestExecutionFailed: (message: string) =>
    `%error% Node test execution failed: ${message}`,

  webSocketReadyWithReporting: () =>
    `%satellite% WebSocket server ready for real-time test reporting`,

  browserWindowClosedPrematurely: () =>
    `%refresh% Browser window closed prematurely`,

  finishHeadedRunFailed: (error: unknown) =>
    `%error% Failed to finish headed browser run: ${error}`,

  preservingExistingHtml: () =>
    `%info% Preserving existing index.html (no regeneration).`,

  preservingExistingRunner: () =>
    `%info% Preserving existing test-runner.mjs (no regeneration).`,

  buildingFiles: (count: number) =>
    `%box% Building ${count} files...`,

  cleaningOutputDirectory: () =>
    `%broom% Cleaning output directory...`,

  testsCompletedTimeout: (message: string) =>
    `%error% ${message}`,
};

// ─── websocket-manager.ts ────────────────────────────────────────────────────

export const WebSocketMessages = {
  clientConnected: () =>
    `%plug% WebSocket client connected`,

  failedToParseMessage: (error: unknown) =>
    `%error% Failed to parse WebSocket message: ${error}`,

  websocketError: (error: unknown) =>
    `%error% WebSocket error: ${error}`,

  hmrClientReady: () =>
    `%fire% Client HMR runtime ready`,

  hmrClientError: (message: string) =>
    `%error% HMR error on client: ${message}`,

  unknownMessageType: (type: string) =>
    `%warn%  Unknown WebSocket message type: ${type}`,

  errorHandlingMessage: (error: unknown) =>
    `%error% Error handling WebSocket message: ${error}`,

  hmrEnabled: () =>
    `%fire% HMR enabled on WebSocket server`,

  errorClosingClient: (error: unknown) =>
    `%error% Error closing WebSocket client: ${error}`,
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
  getEmbeddedCatalogStateSource,
} from './catalog-state';
import {
  getEmbeddedPlanningEngineSource,
} from './planning-engine';
import {
  getEmbeddedCatalogQuerySource,
} from './catalog-query';
import {
  summarizeExecutionResults,
} from './execution-result';
import {
  getBrowserPlaygroundRuntimeSource,
} from './browser-playground-runtime';
import {
  getBrowserPlaygroundFormattersSource,
} from './browser-playground-formatters';

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

  const catalogStateSource =
    getEmbeddedCatalogStateSource();

  const planningEngineSource =
    getEmbeddedPlanningEngineSource();

  const runnerSessionSource =
    getEmbeddedRunnerSessionSource();

  const playgroundFormattersSource =
    getBrowserPlaygroundFormattersSource();

  const playgroundRuntimeSource =
    getBrowserPlaygroundRuntimeSource();

  return `
(function(globalThis) {
  ${catalogSource}

  ${catalogIndexSource}

  ${selectionSource}

  ${executionPlanSource}

  ${catalogQuerySource}

  ${executionResultSource}

  ${catalogStateSource}

  ${planningEngineSource}

  ${runnerSessionSource}

  ${playgroundFormattersSource}

  ${playgroundRuntimeSource}

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
        'вњ… Jasmine environment found',
      );
    } catch (error) {
      console.error(
        'вљ пёЏ  Jasmine environment not found:',
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
    let currentSpecId = null;
    let errorHooksInstalled = false;

    function failureSignature(
      failure,
    ) {
      return [
        failure?.message || '',
        failure?.stack || '',
      ].join('\\n@@\\n');
    }

    function dedupeFailures(
      failures,
      excludedSignatures,
    ) {
      const seen = new Set();
      const deduped = [];

      for (const failure of failures || []) {
        const signature =
          failureSignature(
            failure,
          );

        if (
          excludedSignatures?.has(
            signature,
          ) ||
          seen.has(signature)
        ) {
          continue;
        }

        seen.add(signature);
        deduped.push(failure);
      }

      return deduped;
    }

    function describeThrownValue(
      value,
    ) {
      if (value instanceof Error) {
        return {
          message:
            value.message ||
            String(value),
          stack:
            value.stack ||
            value.message ||
            String(value),
        };
      }

      if (
        value &&
        typeof value === 'object'
      ) {
        const message =
          typeof value.message ===
          'string'
            ? value.message
            : (() => {
                try {
                  return JSON.stringify(
                    value,
                  );
                } catch {
                  return String(value);
                }
              })();

        return {
          message,
          stack:
            typeof value.stack ===
            'string'
              ? value.stack
              : undefined,
        };
      }

      return {
        message:
          typeof value === 'string'
            ? value
            : String(value),
        stack: undefined,
      };
    }

    function createFailure(
      type,
      value,
    ) {
      const details =
        describeThrownValue(
          value,
        );

      return {
        matcherName: '',
        passed: false,
        globalErrorType: type,
        message:
          details.message,
        stack: details.stack,
      };
    }

    const inBrowserReporter = {
      results: [],
      globalFailures: [],
      pendingSpecFailures: new Map(),
      attributedFailureSignatures:
        new Set(),
      currentSpecIdSet: null,

      jasmineStarted() {
        this.results = [];
        this.globalFailures = [];
        this.pendingSpecFailures.clear();
        this.attributedFailureSignatures.clear();
        currentSpecId = null;
      },

      recordAsyncFailure(
        type,
        value,
      ) {
        const failure =
          createFailure(
            type,
            value,
          );
        const signature =
          failureSignature(
            failure,
          );

        if (currentSpecId) {
          const pending =
            this.pendingSpecFailures.get(
              currentSpecId,
            ) ?? [];

          if (
            !pending.some(
              (entry) =>
                failureSignature(
                  entry,
                ) === signature,
            )
          ) {
            pending.push(
              failure,
            );
            this.pendingSpecFailures.set(
              currentSpecId,
              pending,
            );
          }

          this.attributedFailureSignatures.add(
            signature,
          );
          return;
        }

        if (
          this.globalFailures.some(
            (entry) =>
              failureSignature(
                entry,
              ) === signature,
          )
        ) {
          return;
        }

        this.globalFailures.push(
          failure,
        );
      },

      specStarted(config) {
        currentSpecId =
          config.id;

        if (
          this.currentSpecIdSet?.has(
            config.id,
          )
        ) {
          console.log(
            \`в–¶пёЏ Running [\${config.id}]: \${config.description}\`,
          );
        }
      },

      specDone(result) {
        const pending =
          this.pendingSpecFailures.get(
            result.id,
          ) ?? [];
        const mergedResult =
          pending.length > 0
            ? {
                ...result,
                status:
                  'failed',
                failedExpectations:
                  dedupeFailures([
                    ...(Array.isArray(
                      result.failedExpectations,
                    )
                      ? result.failedExpectations
                      : []),
                    ...pending,
                  ]),
              }
            : result;

        this.pendingSpecFailures.delete(
          result.id,
        );

        if (currentSpecId === result.id) {
          currentSpecId =
            null;
        }

        if (
          !this.currentSpecIdSet?.has(
            result.id,
          )
        ) {
          return;
        }

        this.results.push(
          mergedResult,
        );

        console.log(
          \`[\${mergedResult.status.toUpperCase()}] \${mergedResult.description}\`,
        );

        mergedResult.failedExpectations?.forEach(
          (failure) =>
            console.error(
              'вќЊ',
              failure.message,
              failure.stack
                ? '\\n' + failure.stack
                : '',
            ),
        );
      },

      jasmineDone(result) {
        currentSpecId = null;
        this.globalFailures =
          dedupeFailures(
            [
              ...(
                Array.isArray(
                  result?.failedExpectations,
                )
                  ? result.failedExpectations
                  : []
              ),
              ...this.globalFailures,
            ],
            this.attributedFailureSignatures,
          );

        if (originalSpecFilter !== null) {
          env.configure({
            specFilter:
              originalSpecFilter,
          });
        }

        isExecuting = false;
      },
    };

    function installErrorHooks() {
      if (errorHooksInstalled) {
        return;
      }

      errorHooksInstalled =
        true;

      window.addEventListener(
        'unhandledrejection',
        (event) => {
          inBrowserReporter.recordAsyncFailure(
            'unhandledRejection',
            event.reason,
          );
        },
      );

      window.addEventListener(
        'error',
        (event) => {
          if (event.error) {
            inBrowserReporter.recordAsyncFailure(
              'error',
              event.error,
            );
            return;
          }

          const location =
            typeof event.filename ===
              'string' &&
            event.filename
              ? event.filename +
                ':' +
                event.lineno +
                ':' +
                event.colno
              : undefined;

          inBrowserReporter.recordAsyncFailure(
            'error',
            {
              message:
                event.message ||
                'Uncaught browser error',
              stack: location,
            },
          );
        },
      );
    }

    env.addReporter(
      inBrowserReporter,
    );

    installErrorHooks();

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
          'вљ пёЏ  Execution already in progress. Please wait...',
        );
        return summarizeExecutionResults([]);
      }

      if (!plan.specIds.length) {
        return summarizeExecutionResults([]);
      }

      return new Promise((resolve) => {
        isExecuting = true;

        inBrowserReporter.results = [];
        inBrowserReporter.globalFailures = [];
        inBrowserReporter.pendingSpecFailures.clear();
        inBrowserReporter.attributedFailureSignatures.clear();
        currentSpecId = null;

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
          (result) => {
            originalDone.call(
              inBrowserReporter,
              result,
            );

            resolve(
              summarizeExecutionResults(
                inBrowserReporter.results,
                {
                  globalFailures:
                    inBrowserReporter.globalFailures,
                },
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

    installTestifyPlaygroundFormatters();

    installTestifyPlayground(
      session,
      {
        currentPlanOptions,
        setSeed,
        resetSeed,
        summarizeExecutionResults,
      },
    );
  }

  init().catch((error) => {
    console.error(
      'Failed to initialize Testify Playground:',
      error,
    );
  });
})(window);
`;
}
````

## File: CHANGELOG.md
````markdown
# Changelog

## 1.0.41 - 2026-08-21

### Fixed

* Improved formatting for errors output.


## 1.0.40 - 2026-08-17

### Added

* Added `--file, -f <spec filename>` and `--suite, -s <suite name>` CLI selection.
* `--file` and `--suite` can be combined; selectors are intersected.
* Added `--version` and `-v` CLI version output.


## 1.0.39 - 2026-08-13

### Improved

* Major core rework: stabilized the main engine, simplified the public API, and streamlined test execution.
* Added tests for the reworked core and runtime behavior.
* Catch and report global exceptions during test runs, including `unhandledRejection` and `uncaughtException`.


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

## File: package.json
````json
{
  "name": "@epikodelabs/testify",
  "version": "1.0.42",
  "description": "A programmable test engine for Node and real browsers, with Jasmine as its first hosted test language.",
  "bin": {
    "jasmine": "bin/jasmine",
    "testify": "bin/testify"
  },
  "type": "module",
  "files": [
    "LICENSE",
    "README.md",
    "CHANGELOG.md",
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
    "copyfiles": "copyfiles README.md CHANGELOG.md LICENSE ./dist/testify",
    "test:public-api": "tsc -p tsconfig.public-api.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "verify:source": "npm run typecheck && npm run test:public-api",
    "verify:package": "node scripts/verify-publish.mjs",
    "verify:release": "npm run verify:source && npm run build && npm run verify:package",
    "prepublishOnly": "npm run verify:release"
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
    "tsx": "^4.20.0",
    "vite": "^8.1.5",
    "ws": "^8.21.1"
  },
  "devDependencies": {
    "@epikodelabs/testify": "^1.0.40",
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
    "./internals": {
      "types": "./lib/internals.d.ts",
      "import": "./lib/internals.js",
      "default": "./lib/internals.js"
    },
    "./package.json": "./package.json"
  },
  "types": "./lib/index.d.ts",
  "publishConfig": {
    "access": "public"
  }
}
````

## File: src/lib.ts
````typescript
/**
 * Stable Testify 2 public API.
 */

export * from './public-api';
````
