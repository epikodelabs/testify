# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


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

[1.0.27]: https://github.com/epikodelabs/testify/compare/1.0.26...1.0.27
[1.0.26]: https://github.com/epikodelabs/testify/compare/1.0.25...1.0.26
[1.0.25]: https://github.com/epikodelabs/testify/compare/1.0.24...1.0.25
[1.0.24]: https://github.com/epikodelabs/testify/compare/1.0.23...1.0.24
[1.0.23]: https://github.com/epikodelabs/testify/compare/1.0.22...1.0.23
[1.0.22]: https://github.com/epikodelabs/testify/compare/1.0.20...1.0.22
[1.0.20]: https://github.com/epikodelabs/testify/compare/1.0.11...1.0.20
[1.0.11]: https://github.com/epikodelabs/testify/releases/tag/1.0.11
