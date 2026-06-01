# testify

A test runner for Jasmine that runs tests in **real browsers** (Chrome, Firefox, Safari) or **Node.js**, with TypeScript, HMR, and code coverage out of the box.

<p align="center">
  <a href="https://github.com/epikodelabs/testify/actions/workflows/build.yml"><img src="https://github.com/epikodelabs/testify/actions/workflows/build.yml/badge.svg?branch=main" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/@epikodelabs/testify"><img src="https://img.shields.io/npm/v/@epikodelabs/testify.svg?style=flat-square" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/@epikodelabs/testify"><img src="https://img.shields.io/npm/dm/@epikodelabs/testify.svg?style=flat-square" alt="NPM Downloads"></a>
</p>

---

## Highlights

- 🌐 Real browser testing (Chrome, Firefox, Safari) — not JSDOM
- ⚡ Node.js mode for fast unit tests
- 🔥 Hot Module Reload in headed browser mode
- 📦 TypeScript + source maps, zero config
- 📊 Istanbul coverage (HTML, LCOV, text)
- 🎯 VS Code debug support for single specs

---

## Installation

```bash
npm install --save-dev @epikodelabs/testify
npx playwright install        # required for browser testing
```

---

## Quick Start

```bash
npx testify init              # creates testify.json
```

Write tests as normal `.spec.ts` Jasmine specs:

```typescript
// tests/calculator.spec.ts
import { Calculator } from '../src/calculator';

describe('Calculator', () => {
  it('should add', () => {
    expect(new Calculator().add(2, 3)).toBe(5);
  });
});
```

Run:

```bash
npx testify                   # interactive browser mode
npx testify --headless        # headless Chrome (CI)
npx testify --browser node            # fastest, Node.js only
npx testify --coverage        # with code coverage
npx testify --watch           # HMR watch mode (headed only)
```

---

## Execution Modes

| Mode | Command | Best For |
|------|---------|----------|
| Browser (headed) | `npx testify` | Development, debugging |
| Headless browser | `npx testify --headless [--browser firefox\|webkit]` | CI/CD |
| Node.js | `npx testify --browser node` | Fast unit tests |
| Watch | `npx testify --watch` | Rapid iteration |

**Notes:**
- `--watch` requires headed browser mode; incompatible with `--headless`, `--coverage`, and `--browser node`.
- `--coverage` is incompatible with `--watch`.
- Suppress logs in Node mode: `--silent`, `--quiet`, or `"suppressConsoleLogs": true` in config.

---

## Code Coverage

```bash
npx testify --coverage
```

Generates `coverage/index.html`, `coverage/lcov.info`, and a console text summary.

---

## Single Spec Debugging

Run one spec with the bundled Jasmine CLI:

```bash
node --loader @epikodelabs/testify/esm-loader.mjs \
  ./node_modules/@epikodelabs/testify/bin/jasmine \
  --spec ./tests/example.spec.ts
```

**VS Code `launch.json`:**

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug current spec",
  "runtimeExecutable": "node",
  "runtimeArgs": [
    "--loader", "@epikodelabs/testify/esm-loader.mjs",
    "--enable-source-maps"
  ],
  "program": "${workspaceFolder}/node_modules/@epikodelabs/testify/bin/jasmine",
  "args": ["--spec", "${file}"],
  "env": { "TS_NODE_PROJECT": "${workspaceFolder}/tsconfig.json" },
  "cwd": "${workspaceFolder}",
  "console": "integratedTerminal",
  "skipFiles": ["<node_internals>/**"]
}
```

---

## Configuration (`testify.json`)

```json
{
  "srcDirs": ["./src"],
  "testDirs": ["./tests"],
  "outDir": "./dist/.vite-jasmine-build",
  "browser": "chrome",
  "headless": false,
  "port": 8888,
  "coverage": false,
  "watch": false,
  "suppressConsoleLogs": false,
  "tsconfig": "tsconfig.json",
  "jasmineConfig": {
    "env": { "random": true, "timeout": 120000 }
  },
  "viteConfig": {
    "resolve": { "alias": { "@": "/src" } }
  }
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `srcDirs` | `string[]` | `["./src"]` | Source directories |
| `testDirs` | `string[]` | `["./tests"]` | Test directories |
| `exclude` | `string[]` | `["**/node_modules/**"]` | Exclude patterns |
| `outDir` | `string` | `"./dist/.vite-jasmine-build"` | Build output |
| `browser` | `string` | `"chrome"` | `chrome`, `firefox`, `webkit`, `node` |
| `headless` | `boolean` | `false` | Headless mode |
| `port` | `number` | `8888` | Dev server port |
| `coverage` | `boolean` | `false` | Enable coverage |
| `watch` | `boolean` | `false` | Watch mode with HMR |
| `suppressConsoleLogs` | `boolean` | `false` | Hide spec console output (Node) |
| `preserveOutputs` | `boolean` | `false` | Skip regenerating existing outputs |
| `tsconfig` | `string` | `"tsconfig.json"` | TypeScript config path |
| `jasmineConfig` | `object` | — | Jasmine env options |
| `viteConfig` | `object` | — | Custom Vite config |

Path aliases from `tsconfig.json` are resolved automatically.

---

## CLI Reference

| Flag | Description |
|------|-------------|
| `--headless` | Run headless |
| `--browser <name>` | `chrome`, `firefox`, `webkit`, `node` |
| `--watch` | Watch mode |
| `--coverage` | Generate coverage reports |
| `--seed <n>` | Randomization seed |
| `--silent` / `--quiet` | Suppress console logs (Node) |
| `--preserve` | Skip regenerating outputs |
| `--config <path>` | Custom config file |
| `--help` | Show help |

**Exit codes:** `0` success, `1` failures, `2` invalid usage, `3` config error, `4` internal error, `130` SIGINT, `143` SIGTERM.

---

## CI/CD Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx testify --browser node
      - run: npx testify --headless --browser chrome --coverage
```

---

## Comparison

| Feature | testify | Jest | Vitest | Karma |
|---------|---------|------|--------|-------|
| Real browser testing | ✅ | ❌ | ❌ | ✅ |
| Node.js execution | ✅ | ✅ | ✅ | ❌ |
| HMR | ✅ | ✅ | ✅ | ❌ |
| TypeScript (zero config) | ✅ | ✅ | ✅ | ⚠️ Plugin |
| Code coverage | ✅ | ✅ | ✅ | ✅ |
| Jasmine framework | ✅ | ❌ | ❌ | ✅ |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Browser not found | `npx playwright install` |
| Port in use | Change `"port"` in `testify.json` |
| No tests found | Check `testDirs`, `.spec.ts` extension, and `exclude` patterns |
| TS errors | Verify `tsconfig.json` and `tsconfig` path in `testify.json` |
| Watch not working | Requires headed mode; incompatible with `--headless`, `--coverage`, `node` |
| Coverage missing | Use `--coverage`; incompatible with `--watch` |

---

## License

MIT © 2026

<p align="center">
  <a href="https://www.npmjs.com/package/@epikodelabs/testify">Install from NPM</a> •
  <a href="https://github.com/epikodelabs/testify">View on GitHub</a>
</p>
