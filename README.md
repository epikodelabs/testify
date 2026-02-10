# testify

A flexible test runner for Jasmine that supports multiple execution environments with built-in TypeScript compilation, hot module reloading, and code coverage.

> “**testify** doesn’t mock the browser. It invites the browser into the courtroom and asks it to testify under oath.”

<p align="center">
  <a href="https://github.com/epikodelabs/testify/actions/workflows/build.yml">
    <img src="https://github.com/epikodelabs/testify/actions/workflows/build.yml/badge.svg?branch=main" alt="Build Status">
  </a>
  <a href="https://www.npmjs.com/package/@epikodelabs/testify">
    <img src="https://img.shields.io/npm/v/@epikodelabs/testify.svg?style=flat-square" alt="NPM Version">
  </a>
  <a href="https://www.npmjs.com/package/@epikodelabs/testify">
    <img src="https://img.shields.io/npm/dm/@epikodelabs/testify.svg?style=flat-square" alt="NPM Downloads">
  </a>
</p>

## Give a Star on GitHub

If testify helps you, please give it a star: https://github.com/epikodelabs/testify

---

## ✨ Why testify

**testify** is a modern test runner built for Jasmine that bridges the gap between fast unit testing and real browser testing. Whether you need blazing-fast feedback loops in Node.js or full DOM testing in actual browsers (yes, *actual* browsers—not JSDOM pretending to be one), testify adapts to your workflow with hot module reloading, TypeScript-first design, and zero-config coverage reporting. It's like having a Swiss Army knife for testing, except it actually works and won't get confiscated at the airport.

### Highlights

- 🌐 Real browsers (Chrome, Firefox, Safari) for DOM and browser API testing
- ⚡ Node.js execution for lightning-fast unit tests
- 🔥 Hot Module Reload for instant test feedback during development
- 📦 TypeScript compilation with source maps out of the box
- 📊 Istanbul code coverage with beautiful HTML reports
- 🎯 Interactive browser-based test reporter
- 🔧 VS Code debug integration for single-spec debugging

### Why "testify"?

Look, we'll be honest. Coming up with a testing library name in 2025 is like trying to find a good username on Twitter in 2010. Everything's taken. We considered:

- `test-runner` - Too generic (also taken)
- `jasmine-tester` - Too obvious (also taken)
- `vite-jasmine-runner` - Too long (and, you guessed it, taken)
- `super-mega-awesome-test-framework` - Too humble

So we landed on `testify` because:
1. Your tests should be able to testify about your code in court 🧑‍⚖️
2. It sounds vaguely spiritual, which you'll need when debugging flaky tests 🙏
3. The npm package name was actually available 🎉
4. It has the word "test" in it (we're nothing if not literal)

> **⚖️ The testify Promise**  
> *testify doesn't mock the browser. It invites the browser into the courtroom and asks it to testify under oath.*

---

## 📦 Installation

```bash
# Install the test runner
npm install --save-dev @epikodelabs/testify

# Optional: Install Playwright for browser testing
npx playwright install
```

---

## ⚡️ Quick start

### 1. Initialize configuration

```bash
npx testify init
```

This creates `testify.json` with sensible defaults:

```json
{
  "srcDirs": ["./src"],
  "testDirs": ["./tests"],
  "outDir": "./dist/.vite-jasmine-build",
  "browser": "chrome",
  "headless": false,
  "port": 8888,
  "coverage": false
}
```

### 2. Write Jasmine tests

Create `.spec.ts` files in your test directory:

```typescript
// tests/calculator.spec.ts
import { Calculator } from '../src/calculator';

describe('Calculator', () => {
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator();
  });

  it('should add two numbers', () => {
    expect(calc.add(2, 3)).toBe(5);
  });

  it('should work with browser APIs', () => {
    if (typeof window !== 'undefined') {
      expect(window.location).toBeDefined();
    }
  });
});
```

### 3. Run your tests

```bash
# Development: Interactive browser mode
npx testify

# CI/CD: Headless Chrome
npx testify --headless

# Fastest: Direct Node.js execution
npx testify --headless --browser node

# With code coverage
npx testify --coverage

# Watch mode with HMR
npx testify --watch
```

---

## 🎯 Execution modes

### 🌐 Browser mode (Default)

**Best for:** Development and debugging (and feeling like a real developer)

```bash
npx testify
```

- Opens `http://localhost:8888` in your default browser
- Interactive HTML test reporter with Jasmine UI
- Full browser DevTools for debugging (F12 is your friend)
- Access to DOM, localStorage, fetch, and all browser APIs
- Watch your tests fail in glorious 1080p

### 🤖 Headless browser mode

**Best for:** CI/CD and automated testing (robots don't need screens)

```bash
# Chrome (default)
npx testify --headless

# Firefox
npx testify --headless --browser firefox

# Safari/WebKit (for the brave)
npx testify --headless --browser webkit
```

- Runs real browser without UI (like a browser in witness protection)
- Full browser API support
- Console output with test results
- Excellent for cross-browser testing
- No awkward eye contact with DevTools

### ⚡ Node.js mode

**Best for:** Fast unit testing (when you just want to go home early)

```bash
npx testify --headless --browser node
```

- Fastest execution (no browser startup overhead—just pure speed)
- Limited to Node.js APIs only
- Perfect for pure TypeScript logic that doesn't need a browser's emotional support
- No DOM or browser-specific APIs
- Your tests run so fast you'll think they're not even running (they are, we promise)

**Suppress console output:**
```bash
# Using CLI flags
npx testify --headless --browser node --silent
npx testify --headless --browser node --quiet

# Or in testify.json
{
  "suppressConsoleLogs": true
}

# Or via environment variable
TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS=1 npx testify --headless --browser node
```

### 🔥 Watch mode

**Best for:** Rapid development iteration (and existential dread watching tests fail in real-time)

```bash
npx testify --watch
```

- Hot Module Reload for instant feedback (faster than your morning coffee)
- Watches source and test files for changes (like a very attentive guard dog)
- Automatically re-runs affected tests
- Only works in headed browser mode
- WebSocket-based synchronization
- Warning: May cause productivity addiction

**Important:** Watch mode cannot be combined with `--headless` or `--coverage`. (We tried. The universe said no.)

---

## 📊 Code coverage

Enable Istanbul code coverage with the `--coverage` flag:

```bash
npx testify --coverage
```

**How it works:**
- Source files are instrumented using `istanbul-lib-instrument` during preprocessing
- Coverage data is collected while tests run
- Reports are generated using `istanbul-lib-report` and `istanbul-reports`

**Output formats:**
- HTML report: `coverage/index.html`
- LCOV format: `coverage/lcov.info`
- Text summary in console

**Note:** Coverage cannot be used with `--watch` mode.

---

## 🧪 Environment-specific testing

### Browser-only tests

```typescript
describe('Browser APIs', () => {
  beforeEach(() => {
    if (typeof window === 'undefined') {
      pending('Browser-only test');
    }
  });

  it('should test localStorage', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    localStorage.removeItem('test');
  });

  it('should test DOM manipulation', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello World';
    document.body.appendChild(div);
    
    expect(document.querySelector('div')?.textContent).toBe('Hello World');
    
    document.body.removeChild(div);
  });
});
```

### Node.js-only tests

```typescript
describe('Node.js APIs', () => {
  beforeEach(() => {
    if (typeof process === 'undefined') {
      pending('Node.js-only test');
    }
  });

  it('should access process information', () => {
    expect(process.version).toMatch(/^v\d+/);
    expect(process.platform).toBeDefined();
  });

  it('should access file system', async () => {
    const fs = await import('fs/promises');
    const stats = await fs.stat(__filename);
    expect(stats.isFile()).toBe(true);
  });
});
```

### Cross-environment tests

```typescript
describe('Universal Code', () => {
  it('should work in any environment', () => {
    const result = myPureFunction('input');
    expect(result).toBe('processed input');
  });

  it('should detect environment correctly', () => {
    const isBrowser = typeof window !== 'undefined';
    const isNode = typeof process !== 'undefined';
    
    expect(isBrowser || isNode).toBe(true);
  });
});
```

---

## 🐛 Single spec runner (jasmine)

Run a single spec file in Node.js using `jasmine-core`:

```bash
# JavaScript specs
npx jasmine --spec ./tests/example.spec.js

# TypeScript specs (recommended)
node --loader @epikodelabs/testify/esm-loader.mjs \
  ./node_modules/@epikodelabs/testify/bin/jasmine \
  --spec ./tests/example.spec.ts
```

### VS Code debug configuration

Create or update `.vscode/launch.json`:

```bash
npx jasmine init
```

Or manually add this configuration:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug current spec (jasmine)",
  "runtimeExecutable": "node",
  "runtimeArgs": [
    "--loader",
    "@epikodelabs/testify/esm-loader.mjs",
    "--enable-source-maps"
  ],
  "program": "${workspaceFolder}/node_modules/@epikodelabs/testify/bin/jasmine",
  "args": ["--spec", "${file}"],
  "cwd": "${workspaceFolder}",
  "console": "integratedTerminal",
  "skipFiles": ["<node_internals>/**"]
}
```

**Important:** Do not point at `node_modules/.bin/jasmine` (shell shim). Always use the full path to the actual JS file.

### jasmine options

```bash
npx jasmine --spec <path>        # Path to spec file
npx jasmine --random             # Randomize test order
npx jasmine --seed <number>      # Set random seed
npx jasmine --stop-on-fail       # Stop on first failure
npx jasmine --help               # Show help
npx jasmine init                 # Create VS Code debug config
```

---

## 🚀 CI/CD integration

### GitHub Actions example

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
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run Node.js tests (fast)
        run: npx testify --headless --browser node
      
      - name: Run Chrome tests with coverage
        run: npx testify --headless --browser chrome --coverage
      
      - name: Run Firefox tests
        run: npx testify --headless --browser firefox
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

### Performance comparison

| Environment | Speed | Browser APIs | Use Case |
|-------------|-------|-------------|----------|
| Node.js | ⚡ Fastest (blink and you'll miss it) | ❌ None | Unit tests, pure logic |
| Headless Chrome | 🐌 Medium (coffee break pace) | ✅ Full | Integration tests, DOM |
| Headless Firefox | 🐌 Medium (also coffee break pace) | ✅ Full | Cross-browser testing |
| Browser (headed) | 🐌 Slowest (full meal pace) | ✅ Full + DevTools | Development, debugging |

---

## ⚖️ testify vs other test runners

| Feature | testify | Jest | Vitest | Karma |
|---------|---------|------|--------|-------|
| Real browser testing | ✅ | ❌ | ❌ | ✅ |
| Node.js execution | ✅ | ✅ | ✅ | ❌ |
| Hot Module Reload | ✅ | ✅ | ✅ | ❌ |
| TypeScript support | ✅ | ✅ | ✅ | ⚠️ Plugin |
| Code coverage | ✅ | ✅ | ✅ | ✅ |
| Setup complexity | Low | Medium | Low | High |
| Jasmine framework | ✅ | ❌ | ❌ | ✅ |
| Active maintenance | ✅ | ✅ | ✅ | ⚠️ Limited |
| Name sounds like courtroom drama | ✅ | ❌ | ❌ | ⚠️ Kinda |

**Why choose testify:**
- **vs Jest:** Better real browser testing support, actual browser environments (and our name is easier to spell)
- **vs Vitest:** Established Jasmine ecosystem, simpler for existing Jasmine users (also, we tested our name—it works)
- **vs Karma:** Modern tooling, TypeScript-first, simpler setup, active development (and way less karmic baggage)

---

## 🔧 Configuration reference

### Configuration file: `testify.json`

```json
{
  // Source and test directories
  "srcDirs": ["./src/lib"],
  "testDirs": ["./src/tests"],
  "exclude": ["**/node_modules/**", "**/.git/**"],
  
  // Build output
  "outDir": "./dist/.vite-jasmine-build",
  "preserveOutputs": false,
  
  // Execution settings
  "browser": "chrome",
  "headless": false,
  "port": 8888,
  "coverage": false,
  "watch": false,
  "suppressConsoleLogs": false,
  
  // TypeScript configuration
  "tsconfig": "tsconfig.json",
  
  // Jasmine configuration
  "jasmineConfig": {
    "env": {
      "random": true,
      "seed": 0,
      "timeout": 120000,
      "stopSpecOnExpectationFailure": false
    }
  },
  
  // HTML page customization
  "htmlOptions": {
    "title": "My Project Tests"
  },
  
  // Vite build options
  "viteBuildOptions": {
    "target": "es2022",
    "sourcemap": true,
    "minify": false
  }
}
```

### Configuration options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `srcDirs` | `string[]` | `["./src"]` | Source code directories |
| `testDirs` | `string[]` | `["./tests"]` | Test file directories |
| `exclude` | `string[]` | `["**/node_modules/**"]` | Patterns to exclude |
| `outDir` | `string` | `"./dist/.vite-jasmine-build"` | Build output directory |
| `browser` | `string` | `"chrome"` | Browser to use: `chrome`, `firefox`, `webkit`, `node` |
| `headless` | `boolean` | `false` | Run in headless mode |
| `port` | `number` | `8888` | Development server port |
| `coverage` | `boolean` | `false` | Enable code coverage |
| `watch` | `boolean` | `false` | Enable watch mode with HMR |
| `suppressConsoleLogs` | `boolean` | `false` | Hide spec-level console output in Node mode |
| `preserveOutputs` | `boolean` | `false` | Skip regenerating outputs when they exist |

---

## 📖 Command line reference

### Basic commands

| Command | Description |
|---------|-------------|
| `npx testify` | Run in browser (development mode) |
| `npx testify init` | Create configuration file |
| `npx testify --help` | Show help message |

### Execution flags

| Flag | Description |
|------|-------------|
| `--headless` | Run in headless mode |
| `--browser <n>` | Choose browser: `chrome`, `firefox`, `webkit`, `node` |
| `--watch` | Enable watch mode with HMR |
| `--coverage` | Generate code coverage reports |
| `--seed <number>` | Set randomization seed |
| `--silent` / `--quiet` | Suppress console logs (Node mode only) |
| `--preserve` | Skip regenerating outputs when they exist |
| `--config <path>` | Use custom config file |

### Examples

```bash
# Development workflow
npx testify --watch

# CI/CD pipeline
npx testify --headless --coverage

# Cross-browser testing
npx testify --headless --browser firefox
npx testify --headless --browser webkit

# Deterministic test order
npx testify --seed 12345

# Fast unit tests with clean console
npx testify --headless --browser node --silent
```

---

## 📁 Project structure

The test runner expects this structure (all paths are configurable):

```
your-project/
├── src/
│   ├── lib/                         # Source code
│   │   ├── calculator.ts
│   │   └── utils.ts
│   └── tests/                       # Test files
│       ├── calculator.spec.ts
│       └── utils.spec.ts
├── dist/
│   └── .vite-jasmine-build/         # Compiled output (auto-generated)
│       ├── index.html
│       ├── test-runner.js
│       └── *.js
├── coverage/                         # Coverage reports (auto-generated)
│   ├── index.html
│   └── lcov.info
├── testify.json                     # Configuration file
└── tsconfig.json                    # TypeScript configuration
```

---

## 🔧 Advanced configuration

### Custom Vite configuration

You can extend the Vite configuration in `testify.json`:

```json
{
  "viteConfig": {
    "plugins": [],
    "resolve": {
      "alias": {
        "@components": "/src/components"
      }
    }
  }
}
```

### TypeScript path mapping

Path aliases from `tsconfig.json` are automatically resolved:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@tests/*": ["tests/*"]
    }
  }
}
```

### Multiple source directories

```json
{
  "srcDirs": ["./src/lib", "./src/utils", "./src/components"],
  "testDirs": ["./tests/unit", "./tests/integration"]
}
```

### Exclude patterns

```json
{
  "exclude": [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**",
    "**/coverage/**",
    "**/*.d.ts"
  ]
}
```

---

## ❓ Troubleshooting

### Browser not found

Did you forget to invite the browsers to the party?

```bash
# Install all browsers (the whole squad)
npx playwright install

# Or install specific browser (selective guest list)
npx playwright install chrome
npx playwright install firefox
npx playwright install webkit
```

### Port already in use

Someone's camping on port 8888? Rude. Change the port in `testify.json`:

```json
{
  "port": 3000
}
```

Or use a different port via command line:

```bash
# Note: Currently requires config file change
# CLI port override coming in future version
# (We're working on it, okay? Rome wasn't built in a day)
```

### No tests found

testify is looking for tests like a detective at a crime scene. Make sure:
- Test files are in the `testDirs` location (it's not a treasure hunt)
- Files have `.spec.ts` or `.spec.js` extension (naming conventions matter, people!)
- Tests use proper Jasmine syntax (`describe`, `it`, `expect`) (no, `console.log` is not a test)
- Directories are not in the `exclude` list (check if you accidentally ghosted your tests)

### TypeScript compilation errors

TypeScript is being picky again? Let's troubleshoot:

1. Check your `tsconfig.json` matches your project structure (did you move files around and forget to tell TypeScript?)
2. Ensure `tsconfig` path in `testify.json` is correct (typos happen to the best of us)
3. Verify path aliases are properly configured (@ symbols need love too)
4. Check that all dependencies are installed (did you `npm install`? Did you *really*?)

### Watch mode not working

Watch mode is like that one friend who only shows up under specific conditions:
- Watch mode only works in headed browser mode (it likes to see what's happening)
- Cannot use with `--headless` flag (it's shy without a UI)
- Cannot use with `--coverage` flag (it can't multitask)
- Cannot use with `--browser node` (needs a real browser, not a pretend one)

### Coverage reports missing

Coverage reports playing hide and seek? Make sure:
- `--coverage` flag is used (it's not going to turn on itself)
- Tests complete successfully (failed tests don't generate coverage, obviously)
- Output directory (`coverage/`) has write permissions (is it read-only? That's a paddlin')
- Not using `--watch` mode (coverage and watch mode are like oil and water—they don't mix)

---

## 📜 License

MIT © 2025

---

## 🤝 Support

- **Issues:** [GitHub Issues](https://github.com/epikodelabs/testify/issues)
- **Documentation:** [GitHub Wiki](https://github.com/epikodelabs/testify/wiki)
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md)

---

<p align="center">
  <strong>Get started</strong><br>
  <a href="https://www.npmjs.com/package/@epikodelabs/testify">Install from NPM</a> •
  <a href="https://github.com/epikodelabs/testify">View on GitHub</a> •
  <a href="https://forms.gle/YOUR_FEEDBACK_FORM_ID">Give Feedback</a>
</p>
