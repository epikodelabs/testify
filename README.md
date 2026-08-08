# testify

Testify is a test execution engine for real browsers and Node.js. It gives you a simple path from install to running specs, then layers on smart features like watch mode, HMR, coverage, and a live browser Playground when you need them.

Jasmine is the test language Testify currently hosts. Testify owns discovery, planning, runtime control, and execution. Jasmine owns `describe` and `it`. That split is what lets the same specs run in Node.js for speed or in a real browser when the DOM starts making demands.

<p align="center">
  <a href="https://github.com/epikodelabs/testify/actions/workflows/build.yml"><img src="https://github.com/epikodelabs/testify/actions/workflows/build.yml/badge.svg?branch=main" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/@epikodelabs/testify"><img src="https://img.shields.io/npm/v/@epikodelabs/testify.svg?style=flat-square" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/@epikodelabs/testify"><img src="https://img.shields.io/npm/dt/@epikodelabs/testify.svg?style=flat-square" alt="NPM Downloads"></a>
</p>

---

## Highlights

- **Real browser testing** in Chrome, Firefox, and WebKit. No simulated DOM pretending to be brave.
- **Fast Node.js execution** for specs that do not need a browser at all.
- **Watch mode with HMR** so source and spec edits show up quickly without full-page drama.
- **TypeScript and source maps** out of the box for readable stacks and reliable breakpoints.
- **Code coverage** in HTML, LCOV, and text formats.
- **Single-spec debugging** when one stubborn test needs a private conversation.
- **A live Playground** in DevTools for inspecting tests, shaping plans, rerunning failures, and exploring the session interactively.

---

## Installation

```bash
npm install --save-dev @epikodelabs/testify
npx playwright install
```

`npm install` does not run a Testify postinstall script or quietly reshape your project. Browser binaries are installed only when you ask for them.

---

## Quick Start

```bash
npx testify
```

Testify is meant to be useful immediately. Install it, point it at your specs, and run.

Write ordinary Jasmine specs:

```typescript
// tests/calculator.spec.ts
import { Calculator } from '@contoso/calculator';

describe('Calculator', () => {
  it('should add', () => {
    expect(new Calculator().add(2, 3)).toBe(5);
  });
});
```

Run them in the mode that fits the moment:

```bash
npx testify
npx testify --headless
npx testify --browser node
npx testify --coverage
npx testify --watch
```

---

## Execution Modes

| Mode | Command | Best For |
|------|---------|----------|
| Browser (headed) | `npx testify` | Development, debugging |
| Headless browser | `npx testify --headless [--browser firefox\|webkit]` | CI/CD |
| Node.js | `npx testify --browser node` | Fast unit tests |
| Watch | `npx testify --watch` | Rapid iteration |

Notes:
- `--watch` requires headed browser mode and is incompatible with `--headless`, `--coverage`, and `--browser node`.
- `--coverage` is incompatible with `--watch`.
- If Node mode gets chatty, use `--silent` or `--quiet`.

### Playground

In headed watch mode, DevTools gets a live `session` object. The console stops being a dump of log lines and becomes a control surface.

Start by seeing what exists:

```js
session.tests()
session.suites()
session.files()
```

Build a plan:

```js
const plan = session
  .plan()
  .filter(test => /validation/i.test(test.fullName));
```

Run it:

```js
await session.execute(plan);
```

Inspect what happened:

```js
session.last()
session.failures()
```

Repeat the whole thing or just the failures:

```js
await session.rerun()
await session.retry()
```

Need the live reference:

```js
session.help()
```

Done for now:

```js
await session.exit()
```

---

## Code Coverage

```bash
npx testify --coverage
```

This produces `coverage/index.html`, `coverage/lcov.info`, and a console summary.

---

## Single Spec Debugging

Run `npx jasmine init` once to prepare single-spec debugging and editor support. After that, the path from failing test to breakpoint is short and predictable.

The Jasmine CLI uses `tsx` and the nearest TypeScript project settings automatically. Testify also resolves extensionless relative files and directory indexes the same way the browser runner does, so imports like `../lib`, `../lib/forms`, and `./helper` behave consistently across runners.

To run one spec directly:

```bash
node --enable-source-maps \
  ./node_modules/@epikodelabs/testify/bin/jasmine \
  --spec ./tests/example.spec.ts
```

Then you can debug exactly that spec in VS Code instead of marching the whole suite into the room.

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
| `--help` | Show help |

**Exit codes:** `0` success, `1` failures, `2` invalid usage, `3` config error, `4` internal error, `130` SIGINT, `143` SIGTERM.

---

## CI/CD Example

A typical pipeline runs the fast Node.js suite first, then follows it with a slower headless browser pass plus coverage:

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

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Browser not found | `npx playwright install` |
| Port in use | Pick a different port with `--port` |
| No tests found | Check your spec locations, `.spec.ts` extension, and excludes |
| TS errors | Make sure your TypeScript project resolves imports correctly |
| Watch not working | Requires headed mode; incompatible with `--headless`, `--coverage`, `node` |
| Coverage missing | Use `--coverage`; incompatible with `--watch` |

---

## License

MIT (c) 2026

<p align="center">
  <a href="https://www.npmjs.com/package/@epikodelabs/testify">Install from NPM</a> -
  <a href="https://github.com/epikodelabs/testify">View on GitHub</a>
</p>
