# Testify

A flexible test runner for Jasmine that supports multiple execution environments with built-in TypeScript compilation, hot module reloading, and code coverage.

## Features

- **Multiple Execution Environments**
  - Real browsers (Chrome, Firefox, Safari) for DOM and browser API testing
  - Headless browsers for CI/CD pipelines
  - Node.js for fastest unit test execution
  
- **Developer Experience**
  - Hot Module Reload (HMR) for instant test feedback
  - TypeScript compilation with source maps
  - Interactive browser-based test reporter
  - VS Code debug integration
  
- **Testing Capabilities**
  - Istanbul code coverage reporting
  - Configurable test execution order and randomization
  - Cross-environment test compatibility

---

## Installation

```bash
# Install the test runner
npm install --save-dev @epikodelabs/testify

# Optional: Install Playwright for browser testing
npx playwright install
```

---

## Quick Start

### 1. Initialize Configuration

```bash
npx ts-test-runner init
```

This creates `ts-test-runner.json` with sensible defaults:

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

### 2. Write Jasmine Tests

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

### 3. Run Your Tests

```bash
# Development: Interactive browser mode
npx ts-test-runner

# CI/CD: Headless Chrome
npx ts-test-runner --headless

# Fastest: Direct Node.js execution
npx ts-test-runner --headless --browser node

# With code coverage
npx ts-test-runner --coverage

# Watch mode with HMR
npx ts-test-runner --watch
```

---

## Execution Modes

### Browser Mode (Default)

**Best for:** Development and debugging

```bash
npx ts-test-runner
```

- Opens `http://localhost:8888` in your default browser
- Interactive HTML test reporter with Jasmine UI
- Full browser DevTools for debugging
- Access to DOM, localStorage, fetch, and all browser APIs

### Headless Browser Mode

**Best for:** CI/CD and automated testing

```bash
# Chrome (default)
npx ts-test-runner --headless

# Firefox
npx ts-test-runner --headless --browser firefox

# Safari/WebKit
npx ts-test-runner --headless --browser webkit
```

- Runs real browser without UI
- Full browser API support
- Console output with test results
- Excellent for cross-browser testing

### Node.js Mode

**Best for:** Fast unit testing

```bash
npx ts-test-runner --headless --browser node
```

- Fastest execution (no browser startup overhead)
- Limited to Node.js APIs only
- Perfect for pure TypeScript logic
- No DOM or browser-specific APIs

**Suppress console output:**
```bash
# Using CLI flags
npx ts-test-runner --headless --browser node --silent
npx ts-test-runner --headless --browser node --quiet

# Or in ts-test-runner.json
{
  "suppressConsoleLogs": true
}

# Or via environment variable
TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS=1 npx ts-test-runner --headless --browser node
```

### Watch Mode

**Best for:** Rapid development iteration

```bash
npx ts-test-runner --watch
```

- Hot Module Reload for instant feedback
- Watches source and test files for changes
- Automatically re-runs affected tests
- Only works in headed browser mode
- WebSocket-based synchronization

**Important:** Watch mode cannot be combined with `--headless` or `--coverage`.

---

## Code Coverage

Enable Istanbul code coverage with the `--coverage` flag:

```bash
npx ts-test-runner --coverage
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

## Configuration Reference

### Configuration File: `ts-test-runner.json`

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

### Configuration Options

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

## Command Line Reference

### Basic Commands

| Command | Description |
|---------|-------------|
| `npx ts-test-runner` | Run in browser (development mode) |
| `npx ts-test-runner init` | Create configuration file |
| `npx ts-test-runner --help` | Show help message |

### Execution Flags

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
npx ts-test-runner --watch

# CI/CD pipeline
npx ts-test-runner --headless --coverage

# Cross-browser testing
npx ts-test-runner --headless --browser firefox
npx ts-test-runner --headless --browser webkit

# Deterministic test order
npx ts-test-runner --seed 12345

# Fast unit tests with clean console
npx ts-test-runner --headless --browser node --silent
```

---

## Environment-Specific Testing

### Browser-Only Tests

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

### Node.js-Only Tests

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

### Cross-Environment Tests

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

## Single Spec Runner (ts-jasmine-cli)

Run a single spec file in Node.js using `jasmine-core`:

```bash
# JavaScript specs
npx ts-jasmine-cli --spec ./tests/example.spec.js

# TypeScript specs (recommended)
node --loader @epikodelabs/testify/esm-loader.mjs \
  ./node_modules/@epikodelabs/testify/bin/ts-jasmine-cli \
  --spec ./tests/example.spec.ts
```

### VS Code Debug Configuration

Create or update `.vscode/launch.json`:

```bash
npx ts-jasmine-cli init
```

Or manually add this configuration:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug current spec (ts-jasmine-cli)",
  "runtimeExecutable": "node",
  "runtimeArgs": [
    "--loader",
    "@epikodelabs/testify/esm-loader.mjs",
    "--enable-source-maps"
  ],
  "program": "${workspaceFolder}/node_modules/@epikodelabs/testify/bin/ts-jasmine-cli",
  "args": ["--spec", "${file}"],
  "cwd": "${workspaceFolder}",
  "console": "integratedTerminal",
  "skipFiles": ["<node_internals>/**"]
}
```

**Important:** Do not point at `node_modules/.bin/ts-jasmine-cli` (shell shim). Always use the full path to the actual JS file.

### ts-jasmine-cli Options

```bash
npx ts-jasmine-cli --spec <path>        # Path to spec file
npx ts-jasmine-cli --random             # Randomize test order
npx ts-jasmine-cli --seed <number>      # Set random seed
npx ts-jasmine-cli --stop-on-fail       # Stop on first failure
npx ts-jasmine-cli --help               # Show help
npx ts-jasmine-cli init                 # Create VS Code debug config
```

---

## CI/CD Integration

### GitHub Actions Example

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
        run: npx ts-test-runner --headless --browser node
      
      - name: Run Chrome tests with coverage
        run: npx ts-test-runner --headless --browser chrome --coverage
      
      - name: Run Firefox tests
        run: npx ts-test-runner --headless --browser firefox
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

### Performance Comparison

| Environment | Speed | Browser APIs | Use Case |
|-------------|-------|-------------|----------|
| Node.js | ⚡ Fastest | ❌ None | Unit tests, pure logic |
| Headless Chrome | 🐌 Medium | ✅ Full | Integration tests, DOM |
| Headless Firefox | 🐌 Medium | ✅ Full | Cross-browser testing |
| Browser (headed) | 🐌 Slowest | ✅ Full + DevTools | Development, debugging |

---

## Project Structure

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
├── ts-test-runner.json              # Configuration file
└── tsconfig.json                    # TypeScript configuration
```

---

## Troubleshooting

### Browser Not Found

```bash
# Install all browsers
npx playwright install

# Or install specific browser
npx playwright install chrome
npx playwright install firefox
npx playwright install webkit
```

### Port Already in Use

Change the port in `ts-test-runner.json`:

```json
{
  "port": 3000
}
```

Or use a different port via command line:

```bash
# Note: Currently requires config file change
# CLI port override coming in future version
```

### No Tests Found

Verify:
- Test files are in the `testDirs` location
- Files have `.spec.ts` or `.spec.js` extension
- Tests use proper Jasmine syntax (`describe`, `it`, `expect`)
- Directories are not in the `exclude` list

### TypeScript Compilation Errors

1. Check your `tsconfig.json` matches your project structure
2. Ensure `tsconfig` path in `ts-test-runner.json` is correct
3. Verify path aliases are properly configured
4. Check that all dependencies are installed

### Watch Mode Not Working

Remember:
- Watch mode only works in headed browser mode
- Cannot use with `--headless` flag
- Cannot use with `--coverage` flag
- Cannot use with `--browser node`

### Coverage Reports Missing

Ensure:
- `--coverage` flag is used
- Tests complete successfully
- Output directory (`coverage/`) has write permissions
- Not using `--watch` mode (coverage disabled in watch mode)

---

## Comparison with Other Test Runners

| Feature | ts-test-runner | Jest | Vitest | Karma |
|---------|---------------|------|--------|-------|
| Real browser testing | ✅ | ❌ | ❌ | ✅ |
| Node.js execution | ✅ | ✅ | ✅ | ❌ |
| Hot Module Reload | ✅ | ✅ | ✅ | ❌ |
| TypeScript support | ✅ | ✅ | ✅ | ⚠️ Plugin |
| Code coverage | ✅ | ✅ | ✅ | ✅ |
| Setup complexity | Low | Medium | Low | High |
| Jasmine framework | ✅ | ❌ | ❌ | ✅ |
| Active maintenance | ✅ | ✅ | ✅ | ⚠️ Limited |

**Why choose ts-test-runner:**
- **vs Jest:** Better real browser testing support, actual browser environments
- **vs Vitest:** Established Jasmine ecosystem, simpler for existing Jasmine users
- **vs Karma:** Modern tooling, TypeScript-first, simpler setup, active development

---

## Advanced Configuration

### Custom Vite Configuration

You can extend the Vite configuration in `ts-test-runner.json`:

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

### TypeScript Path Mapping

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

### Multiple Source Directories

```json
{
  "srcDirs": ["./src/lib", "./src/utils", "./src/components"],
  "testDirs": ["./tests/unit", "./tests/integration"]
}
```

### Exclude Patterns

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

## License

MIT © 2025

---

## Support

- **Issues:** [GitHub Issues](https://github.com/actioncrew/ts-test-runner/issues)
- **Documentation:** [GitHub Wiki](https://github.com/actioncrew/ts-test-runner/wiki)
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md)