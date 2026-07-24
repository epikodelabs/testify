# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
