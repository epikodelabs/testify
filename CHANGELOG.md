# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.22] - 2026-05-21

### Fixed
- Resolved a broad set of runtime bugs, ESM compatibility issues, and internal regressions across the package.
- Fixed project-scoped runtime issues that could break test execution in local setups.

### Changed
- Revised `testify` exit codes to make CLI failures easier to interpret.
- Improved console wrapping so long output stays readable.

## [1.0.20] - 2026-02-14

### Fixed
- Single `Ctrl+C` now aborts the current run and exits cleanly.
- Fixed double `Ctrl+C` handling during interrupted runs.
- Corrected line merging in console output.

### Changed
- Suite labels now always use exactly one space before dot fill.
- Suite names and dot leaders now respect `MAX_WIDTH`.

## [1.0.11] - 2025-10-03

### Added
- Initial public release of `testify`.
- Browser-based Jasmine runner.
- CLI binaries with shebang support.

### Changed
- Improved package configuration and logging.

## Historical Milestones

The sections below summarize major work that landed between `1.0.11` and `1.0.20` but was not published as separately tagged releases.

### Browser Runner and Watch Mode

- Added watch mode with hot module reloading.
- Added WebSocket-based event forwarding and hot test reload support.
- Switched test discovery to dynamic retrieval instead of hardcoded HTML entries.
- Added support for `js` and `mjs` sources and specs.
- Disabled random order by default in watch mode.
- Added cache-busting for dynamic imports and corrected browser runner HTML/script paths.
- Made Node.js headless mode the default runner.

### Reporting and Console UX

- Added the compound reporter with `userAgent` and abort callbacks.
- Added `console-repl` for interactive console access.
- Added suite tree rendering plus `orderedSuites` and `orderedSpecs` config support.
- Improved pending spec wrapping, status calculation, and first-line prompt behavior.
- Expanded console reporter output and normalized control-sequence handling.

### Coverage and Runtime Architecture

- Added coverage support for headless browser modes.
- Merged the Node runner and HTML generator so tests execute inside the host process.
- Reworked coverage generation to run synchronously.
- Removed the dedicated coverage reporter in favor of direct report generation.
- Fixed child-process initialization.
- Moved dependency and browser installation into the postinstall flow.

### CLI and Configuration

- Added `ts-jasmine-cli init` to create or update VS Code launch configuration.
- Added a VS Code environment check.
- Added `--silent` mode for the Node.js runner.
- Added `--preserve` to reuse existing build outputs.
- Simplified CLI config and reworked the config file structure.
- Ensured testify config is loaded before project config.
- Added path normalization and relative-path cleanup.
- Replaced the custom console reporter with `jasmine-console-reporter`.
- Added richer Jasmine failure output.
- Skipped types-only modules during build.
- Updated the runner, build script, and HTML generator.

### Rebrand and Package Refresh

- Renamed the project from `ts-test-runner` to `testify`.
- Updated organization metadata, package dependencies, and utility names.
- Refreshed the README, build workflow, and GitHub workflows.
- Added Open Collective funding metadata.

[1.0.22]: https://github.com/epikodelabs/testify/compare/1.0.20...1.0.22
[1.0.20]: https://github.com/epikodelabs/testify/compare/1.0.11...1.0.20
[1.0.11]: https://github.com/epikodelabs/testify/releases/tag/1.0.11
