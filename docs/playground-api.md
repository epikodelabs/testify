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

## Plan

```ts
const plan = session.plan(selector?, options?)

plan.tests()
plan.filter(test => ...)
plan.slice(start, end)
plan.add(other)
plan.subtract(other)
plan.intersect(other)
plan.not()
plan.where(result, 'passed')
plan.where(result, 'failed')
plan.where(result, 'unresolved')

await session.execute(plan)
```

Outcome methods classify the current plan using an `ExecutionResult`: `passed` and `failed` select terminal outcomes; `unresolved` includes non-terminal or missing outcomes.

Plans remain serializable execution data. Interactive operations and collection identity are non-enumerable. Transformations are immutable and preserve execution options and plan identity metadata. `add`, `subtract`, and `intersect` combine plans from the same catalog revision; `not()` selects the complement within that plan's catalog snapshot.

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

## Help

```ts
session.help()
session.help('plan')
session.help('retry')
```

`help()` returns the current Playground command registry. The optional `query` must be a string and accepts a section name (`discover`, `run`, `plan`, or `session`) or any free-text search. Matching is case-insensitive across section, usage, and description. Calling `session.help()` without a query shows the accepted query forms in DevTools. Help values remain observable even when the filtered result is empty.

## UX invariant

Playground values are ordinary JavaScript values with enough semantic identity to be useful when evaluated directly in DevTools. Testify does not require `.print()`, `.show()`, or user-written `console.table(...)` calls to make its core values understandable. Empty test, suite, file, and result collections preserve their identity as well.
