# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# Changelog

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
