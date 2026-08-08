# Testify architectural vocabulary

> **One concept → one vocabulary → one owner.**

This document is the vocabulary freeze for Testify 2.

## Core concepts

### Session

Owner: `RunnerSession`

Meaning: a live execution context with a current catalog, planning state, execution adapter, and lifecycle.

Preferred vocabulary:

```text
session
tests / suites / files
plan
run / execute
refresh / revision / changes
close
```

Avoid parallel Session vocabulary such as `runner`, `listTests`, `findTests`, or `queryTests` for the same operation.

### Plan

Owner: `ExecutionPlan` / `PlannedExecution`

Meaning: exact work selected for execution.

Preferred vocabulary:

```text
plan
specIds
tests()
filter()
slice()
shard
partition
```

A plan is data first. Interactive operations are non-enumerable and must not change serialization.

### Result

Owner: `ExecutionResult`

Meaning: what happened during one execution.

Preferred vocabulary:

```text
result
specResults
passed
failed
pending
duration
```

The Playground may derive `failures()` from the last result, but failure state is not a second execution model.

### Catalog

Owner: Session internally; catalog utilities under `/internals`.

Meaning: discovered test identities available for selection/planning.

Stable Session vocabulary is `tests/suites/files`. `CatalogQuery`, indexes, list helpers, and selector resolvers are lower-level implementation/building blocks, not competing public entry points.

## Execution verbs

```text
run       intent-oriented: resolve current intent, create a fresh plan, execute
execute   plan-oriented: execute the exact supplied plan
rerun     Playground: repeat previous intent
retry     Playground: resolve previous failures against the current catalog
```

Do not use `runTests`, `runTest`, and `execute` as aliases for the same host operation.

## Host vocabulary

Hosts transport or execute the core model; they do not redefine it.

### Generated Node runner

Single exported operation:

```ts
run(reporter, selector?)
```

### NodeRunnerHost

Single execution operation:

```ts
host.run(reporter, selector?)
```

The generated module does not expose duplicate catalog/query/session helper APIs.

### Browser Playground

The browser exposes the actual Session as:

```ts
globalThis.session
```

The Playground adds only interaction-specific controls such as `last`, `failures`, `rerun`, `retry`, `help`, `reload`, and `exit`.

## Observability invariant

> **Every value exposed by the Playground should be worth looking at.**

Observability belongs to values, not to a parallel presentation API. Avoid `.print()`, `.show()`, and user-required `console.table(...)` rituals for core Playground values.

## Admission rule

Before adding a new noun or verb, ask:

1. Is this a genuinely new concept?
2. Which layer owns it?
3. Does an existing word already describe it?
4. Would this create another path to the same operation?
5. If exposed in the Playground, is the returned value understandable by inspection?

If ownership or vocabulary is ambiguous, the API is not ready to grow.
