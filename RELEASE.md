# Testify 2.0.0 release

The repository is prepared for the Testify 2.0.0 release.

## Release gate

Run:

```bash
npm install
npm run verify:release
```

`verify:release` performs:

1. strict source type checking;
2. public API compile-time checks;
3. full production build;
4. `npm pack` of `dist/testify`;
5. installation of the packed tarball into a clean temporary project;
6. root API and `/internals` import smoke tests;
7. `testify --help` smoke test from the installed tarball;
8. `jasmine --help` smoke test from the installed tarball.

## Publish

After the release gate succeeds:

```bash
cd dist/testify
npm publish
```

The scoped package is configured with `publishConfig.access = "public"`.

## Expected package surface

```text
@epikodelabs/testify
@epikodelabs/testify/internals
```

Expected files include:

```text
bin/testify
bin/jasmine
lib/index.js
lib/index.d.ts
lib/internals.js
lib/internals.d.ts
README.md
CHANGELOG.md
LICENSE
assets/favicon.ico
package.json
```


## v1 console compatibility

Testify 2 intentionally preserves the Testify 1.x `ConsoleReporter`
presentation and default CLI behavior.

The packed-package release gate creates a real fixture project and runs:

```bash
npx --no-install testify
```

with no Testify CLI arguments. The fixture's `testify.json` selects Node
headless execution so CI does not require a browser. Verification requires the
real Jasmine spec to execute and the v1 `Test Runner Started` reporter output
to be present.


## Default CLI contract

```bash
npx testify
```

always performs a one-shot test run.

Watch/HMR is explicit:

```bash
npx testify --watch
```

A legacy or stale `watch: true` value in `testify.json` does not change the
default CLI behavior.


## Static browser compatibility

One-shot browser runs preserve the Jasmine v1 boot sequence:

```text
jasmine.js
jasmine-html.js
boot0.js
boot1.js
spec modules
```

`boot1.js` installs Jasmine's HTML reporter and normal browser execution
lifecycle. Static pages also keep Testify's WebSocket reporter bridge so
terminal reporting remains available.


## All generated test modules use .mjs

Everything Testify emits into `.vite-jasmine-build` is an ES module with an
`.mjs` extension:

```text
source__<hash>.mjs
example__<hash>.spec.mjs
vendor.mjs
test-runner.mjs
```

This applies to compiled application sources, compiled specs, Rollup chunks,
and the generated Node runner. The user's source tree is not renamed or
modified.


## Node builds are not SSR builds

Testify Node mode uses a normal multi-entry ES-module build.

```text
source/test inputs
    -> Rolldown multi-entry build
    -> *.mjs
```

`build.ssr` is intentionally not enabled. Node built-ins and package
dependencies are externalized instead. This avoids Vite's dedicated SSR-entry
and `index.html` validation paths.
