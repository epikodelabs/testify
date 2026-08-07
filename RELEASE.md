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
