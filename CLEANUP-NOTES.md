# Testify 2 cleanup

This repository was reconstructed from the user's `testify-repomix(2).md`
bundle and reconciled with the final Testify 2 engine work.

## Canonical package surface

```text
@epikodelabs/testify
@epikodelabs/testify/internals
```

The temporary `/v2` namespace has been removed.

## Removed refactoring artifacts

Temporary step/milestone README files, changed-file manifests, stale v2
compatibility tests, and migration-only v2 aliases were removed.

## Replacements

- `src/v2.ts` -> `src/public-api.ts`
- `src/v2-internals.ts` -> `src/internals.ts`
- old v2 package-surface test -> `src/package-surface.spec.ts`

Use this tree as the canonical Testify 2 baseline.
