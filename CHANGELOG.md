# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.22] — 2026-05-21

### Fixed
- Resolved 30+ bugs, ESM incompatibilities, and optimizations across the codebase.
- Fixed project-scoped runtime bugs.

### Changed
- Revised testify exit codes and console wrapping.

## [1.0.20] — 2026-02-14

### Fixed
- Single `Ctrl+C` now aborts tests and exits the program.
- Fixed double `Ctrl+C` press handling.
- Corrected line merging in console output.

### Changed
- Test dots and suite names now do not exceed `MAX_WIDTH` length.
- One space is now mandatory between suite name and dots.

## [1.0.14] — Synthetic tag: CLI & Configuration

### Added
- Added `ts-jasmine-cli` utility with `init` param to update/create VS Code launch configuration.
- Added VS Code environment check.
- Added `--silent` mode for Node.js runner.
- Added `--preserve` parameter.
- Added small console reporter to CLI.
- Added `setSeed` and `resetSeed()` methods to the runner.
- Added richer Jasmine failure output.
- Added normalization step for path parameters.

### Changed
- Modified config file structure.
- Cleaned CLI config.
- Our config added at the beginning of config array.
- Replaced custom console reporter with `jasmine-console-reporter`.
- Types-only modules are skipped during build.
- Updated runner, build script, and HTML generator.

## [1.0.13] — Synthetic tag: Rebrand

### Changed
- Renamed project from `ts-test-runner` to `testify`.
- Updated organisation name and package dependencies.
- Updated README and build workflow.
- Added GitHub workflows folder.
- Added Open Collective funding.
- Lowercased testify and updated utility names.

## [1.0.12] — Synthetic tag: In-Process Execution & Coverage

### Added
- Added coverage step to headless browser modes.
- Added introspection methods.
- Added delay before test execution.

### Changed
- Merged node runner and generator; tests are executed within the host process.
- Coverage report generator rewritten to be synchronous.
- Removed coverage reporter in favor of direct use of coverage report generator.
- Removed `playwright-core` dependency, corrected postinstall script.
- Instead of copying dependencies, they are installed in the postinstall step.
- Browser installation moved to postinstall script.
- Postinstall script renamed to avoid postinstallation within the package.

### Fixed
- Corrected child process initialization.

## [1.0.11] — 2025-10-03

### Added
- Initial version of the test runner.
- Serve and run Jasmine specs in a browser.
- Shebang support for CLI binaries.

### Changed
- Improved logging.
- Updated package config and version.

## Milestones

### HMR & Browser Runner
> `watch mode` → `dynamic test retrieval`

- Added support for watch mode.
- Added HMR support with hot test reload.
- Enhanced HMR manager and HMR client.
- Script runner retrieves test cases dynamically; they are not hardcoded in HTML.
- By default, runner uses Node headless mode.
- Added support for `js`/`mjs` sources and specs.
- Enabled WebSocket forwarder.
- Random order is disabled in watch mode by default.
- Cache-busting for dynamic import calls.
- Corrected HTML template for browser runner and path to test script.

### Reporting & Console
> `compound reporter` → `console-repl`

- Added compound reporter supporting `userAgent` callback.
- Added console-repl (interactive console).
- Added suite tree rendering.
- Added `orderedSuites` and `orderedSpecs` to config.
- Added word wrapping for pending specs.
- Implemented proper status calculation for test results.
- Extended WebSocket event forwarder and console reporter.
- Console reporter logs all callback parameters.
- Added `testsAborted` callback to compound reporter.
- Added `capitalize` method.
- Added regex for control sequences.
- Output shortened and prompt restricted to first line.
- `undefined` userAgent fix returned by test runner.

### Tooling & Linting
> `eslint update` → `package lock renewal`

- Updated ESLint with import plugin.
- Downgraded and renewed package lock.
- Corrected `ts-node` imports.
- Absolute paths within config file replaced with relative ones.
- Backslashes replaced with forward slashes.
- Refactored `vite-config-builder`.
- Removed logic related to imports.

[1.0.22]: https://github.com/epikodelabs/testify/compare/1.0.20...1.0.22
[1.0.20]: https://github.com/epikodelabs/testify/compare/1.0.14...1.0.20
[1.0.14]: https://github.com/epikodelabs/testify/compare/1.0.13...1.0.14
[1.0.13]: https://github.com/epikodelabs/testify/compare/1.0.12...1.0.13
[1.0.12]: https://github.com/epikodelabs/testify/compare/1.0.11...1.0.12
[1.0.11]: https://github.com/epikodelabs/testify/releases/tag/1.0.11
