# Testify vocabulary audit

## Rule

> **One concept → one vocabulary → one owner.**

Public language is polished aggressively. Internal vocabulary is also changed when it duplicates ownership or teaches a competing model.

## Decisions

| Concept | Owner | Frozen vocabulary | Removed/relocated vocabulary |
|---|---|---|---|
| Live execution context | `RunnerSession` | `session` | browser `runner` identity |
| Discovery | `RunnerSession` | `tests`, `suites`, `files` | `list*`, `find*`, Session `query()` |
| Planning | Session + Plan | `plan`, `planSpec`, `planSuite`, `planFile` | direct planner/cache controls on Session |
| Exact work | `ExecutionPlan` / `PlannedExecution` | `tests`, `filter`, `slice`, `shard`, `partition` | competing plan presentation commands |
| Execution | `RunnerSession` | `run` for intent, `execute` for exact plan | aliases with identical meaning |
| Retry loop | Playground | `rerun`, `retry` | `rerunFailed`, `failed` |
| Catalog lifecycle | `RunnerSession` | `refresh`, `revision`, `changes` | raw catalog/index access on Session |
| Generated Node boundary | generated module + `NodeRunnerHost` | `run(reporter, selector?)` | `runTests`, `runTest`, `runSuite`, `runFile`, host `execute`, exported list/find/session diagnostics |
| Stable package root | Session/Plan/Result contracts | `RunnerSession` + contract types | catalog/index/query/planner construction helpers moved to `/internals` |
| Playground presentation | DevTools values | self-describing values | `.print()`, `.show()`, required `console.table(...)` |

## Stable root

The runtime value exported from the stable root is `RunnerSession`. Plan, Result, Selector, and Catalog are stable contract types.

Lower-level factories, catalog queries, indexes, selector resolvers, result summarizers, and planning state live under:

```ts
@epikodelabs/testify/internals
```

## Node boundary

Before:

```text
Generated module:
  runTests / runTest / runSuite / runFile
  list* / find*
  getSession / getStats / getIndex / ...

NodeRunnerHost:
  execute / run / runSpec / runSuite / runFile
  list* / find*
  getSession / getStats / getIndex / ...
```

After:

```text
Generated module:
  run(reporter, selector?)

NodeRunnerHost:
  run(reporter, selector?)
```

Planning and discovery remain owned by the `RunnerSession` created inside the generated module. The transport does not mirror Session as another API.

## Session boundary

Removed from `RunnerSession`:

```text
query()
catalog()
index()
planningStats()
invalidatePlans()
```

These exposed implementation objects rather than user concepts. Observable catalog lifecycle remains:

```ts
session.refresh()
session.revision()
session.changes()
```

Discovery remains:

```ts
session.tests()
session.suites()
session.files()
```

## Observability

> **Every value exposed by the Playground should be worth looking at.**

This remains a UX invariant. The vocabulary audit does not add console-only powers; it makes engine values coherent and observable.
