# RunnerSession contract

> **Session creates and executes work. Plan shapes work. Result describes what happened.**

`RunnerSession` is Testify's stable execution boundary. It owns catalog synchronization, discovery, planning, execution, and lifecycle. It does not expose planner/index/query implementation objects directly.

## 1. Session surface

```ts
session.state

session.tests(selector?)
session.suites(selector?)
session.files(selector?)
session.stats()

session.plan(selector?, options?)
session.planSpec(selector, options?)
session.planSuite(selector, options?)
session.planFile(selector, options?)

session.shard(plan, index, count)
session.partition(plan, count)

await session.execute(plan)
await session.run(selector?, options?)
await session.runSpec(selector, options?)
await session.runSuite(selector, options?)
await session.runFile(selector, options?)

session.revision()
session.changes()
session.refresh()

await session.close()
```

There are deliberately no parallel `list*` / `find*` / `query()` spellings on Session.

## 2. Discovery

```ts
session.tests()
session.tests(/snapshot/)

session.suites()
session.suites('Membrane')

session.files()
session.files(/lazy/)
```

Discovery always reflects the current catalog. Session owns synchronization before discovery.

## 3. Planning

`plan()` resolves intent into exact work:

```ts
const plan = session.plan({
  suite: 'Membrane',
});
```

Plans carry their catalog revision and execution options. A plan remains exact work; Session never silently re-plans a supplied plan.

Interactive plans can be shaped immutably:

```ts
const focused = session
  .plan()
  .filter(test => /snapshot/i.test(test.fullName))
  .slice(0, 10);
```

## 4. Execution

Two verbs have intentionally different meanings:

```text
run(intent)     resolve current intent → fresh plan → execute
execute(plan)   execute this exact plan
```

Convenience forms are owned by the same Session:

```ts
await session.runSpec('works')
await session.runSuite('Membrane')
await session.runFile(/lazy/)
```

## 5. Catalog lifecycle

```ts
session.revision()
session.changes()
session.refresh()
```

`refresh()` makes synchronization explicit and observable:

```ts
{
  changed,
  previousRevision,
  revision,
  changes,
}
```

Normal Session operations may synchronize lazily for ergonomics.

A historical plan remains executable after unrelated catalog growth. Execution rejects it only when one or more selected spec IDs no longer exist.

## 6. Lifecycle

```ts
session.state
// 'ready' | 'closing' | 'closed'

await session.close()
```

`close()` is idempotent and belongs to the reusable Session contract.

The browser Playground adds `session.exit()` as a host-level convenience for terminating the live Testify environment. `exit()` is not a replacement for `RunnerSession.close()` in embedded/programmatic usage.

## 7. Ownership boundary

`RunnerSession` does not expose:

```text
CatalogQuery
TestCatalogIndex
PlanningEngine
planner cache controls
raw catalog access
```

Those are implementation/building-block concerns available through `@epikodelabs/testify/internals` when needed.

The stable model is:

```text
Catalog
  ↓
Session
  ↓
Plan
  ↓
Execution
  ↓
Result
```

Hosts and transports do not create alternative versions of these concepts.
