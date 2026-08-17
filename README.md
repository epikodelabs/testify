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
