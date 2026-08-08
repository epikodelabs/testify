# Testify Playground API

> **Every value exposed by the Playground should be worth looking at.**

The Playground is a thin browser-console control surface over the Testify engine. It does not introduce a second testing model.

## Discover

```ts
session.tests(selector?)
session.suites(selector?)
session.files(selector?)
```

An omitted selector returns the current collection. A string or `RegExp` filters it. These are the only direct discovery aliases on `RunnerSession`; there are no parallel `list*` or `find*` spellings.

## Run

```ts
await session.run(selector?, options?)
await session.runSpec(selector, options?)
await session.runSuite(selector, options?)
await session.runFile(selector, options?)

await session.rerun()
await session.retry()
```

Semantics:

```text
run      = new intent → fresh plan → execute
rerun    = previous intent → fresh plan → execute
retry    = previous failures → fresh plan → execute
execute  = exact supplied plan → execute
```

## Inspect

```ts
session.last()
session.failures()
```

`last()` returns the last Playground execution record (`plan`, `result`, `intent`, `revision`). `failures()` is derived from that execution.

## Plan

```ts
const plan = session.plan(selector?, options?)

plan.tests()
plan.filter(test => ...)
plan.slice(start, end)

await session.execute(plan)
```

Plans remain serializable execution data. Interactive operations and collection identity are non-enumerable. Transformations are immutable and preserve execution options and plan identity metadata.

## Session

```ts
session.state
session.stats()
session.revision()
session.changes()
session.refresh()

session.setSeed(12345)
session.resetSeed()
session.reload()
await session.exit()
```

`exit()` is the Playground lifecycle control. `RunnerSession.close()` remains the lower-level programmatic lifecycle API.

## UX invariant

Playground values are ordinary JavaScript values with enough semantic identity to be useful when evaluated directly in DevTools. Testify does not require `.print()`, `.show()`, or user-written `console.table(...)` calls to make its core values understandable. Empty test, suite, file, and result collections preserve their identity as well.
