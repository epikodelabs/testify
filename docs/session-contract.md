# Testify Session v1 Contract

## Principle

**Testify is an execution engine for tests. Jasmine is one test language hosted by it.**

A `Session` is the stable runtime boundary of the Testify execution engine.

It represents a reusable relationship between:

* a test catalog,
* a planning engine,
* an execution environment,
* and the results produced by that environment.

A session does not represent one test run.

A session may execute zero, one, or many plans during its lifetime.

---

## 1. Core lifecycle

A session has a simple lifecycle:

```text
create
  ↓
ready
  ↓
plan / query / execute
  ↓
plan / query / execute
  ↓
...
  ↓
close
```

The fundamental usage is:

```ts
const session = await createSession(options);

const plan = session.plan(selector);

const result = await session.execute(plan);

await session.close();
```

`plan()` and `execute()` are the fundamental execution operations.

Higher-level methods such as `run()`, `runSuite()`, and `runFile()` are convenience methods.

---

## 2. Session is reusable

A session MUST support multiple executions.

```ts
const session = await createSession();

await session.runSuite('Parser');

await session.runSpec('rejects malformed input');

await session.runFile('serializer.spec.ts');

await session.run();

await session.close();
```

Running a plan does not consume or terminate the session.

This property is important for:

* headed browser development,
* watch mode,
* IDE integrations,
* programmatic testing,
* repeated selective runs,
* future worker execution,
* future affected-test execution.

---

## 3. Session responsibilities

A Session owns:

```text
Session
 ├─ catalog state
 ├─ catalog revision
 ├─ catalog query surface
 ├─ planning engine
 ├─ planning cache
 ├─ execution adapter
 └─ lifecycle
```

A Session does NOT own:

```text
CLI parsing
terminal presentation
browser UI
Jasmine test syntax
Jasmine reporters
Vite configuration authoring
process locking
coverage presentation
```

Those are hosts/adapters around the Session.

---

## 4. Proposed public contract

```ts
export interface TestSession<
  TResult = ExecutionResult,
> {
  readonly state: SessionState;

  catalog(): TestCatalog;

  revision(): number;

  changes(): CatalogChangeSet;

  query(): CatalogQuery;

  stats(): SessionStats;

  planningStats(): PlanningEngineStats;

  refresh(): SessionRefreshResult;

  invalidatePlans(): void;

  plan(
    selector?: TestSelector,
    options?: ExecutionPlanOptions,
  ): ExecutionPlan;

  planSpec(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): ExecutionPlan;

  planSuite(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): ExecutionPlan;

  planFile(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): ExecutionPlan;

  shard(
    plan: ExecutionPlan,
    index: number,
    count: number,
  ): ExecutionPlan;

  partition(
    plan: ExecutionPlan,
    count: number,
  ): ExecutionPlan[];

  execute(
    plan: ExecutionPlan,
  ): Promise<TResult>;

  run(
    selector?: TestSelector,
    options?: ExecutionPlanOptions,
  ): Promise<TResult>;

  runSpec(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): Promise<TResult>;

  runSuite(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): Promise<TResult>;

  runFile(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): Promise<TResult>;

  close(): Promise<void>;
}
```

---

## 5. Session states

Keep the state model intentionally small in v1.

```ts
export type SessionState =
  | 'ready'
  | 'closing'
  | 'closed';
```

I would NOT add an `executing` state.

Execution is an operation performed by a session, not the identity of the session.

This distinction becomes important once concurrent execution exists.

For example, later this should be legal:

```ts
await Promise.all([
  session.execute(planA),
  session.execute(planB),
]);
```

provided that the selected execution adapter supports concurrency.

Therefore:

```text
session state ≠ execution state
```

Execution state belongs to an execution/run object if we introduce one later.

---

## 6. Creation

Prefer a factory over requiring users to construct `RunnerSession` manually.

```ts
const session =
  await createSession({
    browser: 'chrome',
  });
```

The factory may perform environment-specific initialization.

The low-level constructor can remain available internally.

Public API:

```ts
export interface CreateSessionOptions {
  // Testify configuration / host options.
}

export function createSession(
  options?: CreateSessionOptions,
): Promise<TestifySession>;
```

A factory also gives us room later for:

```ts
createSession({
  environment: node(),
});
```

or:

```ts
createSession({
  language: jasmine(),
  environment: chrome(),
});
```

without changing the Session contract.

---

## 7. Catalog ownership

A session owns a logical catalog snapshot.

The current implementation lazily synchronizes its `PlanningEngine` against `getCatalogValue()` whenever catalog-related operations occur.

Session v1 should make this behavior explicit.

```ts
session.catalog();
session.revision();
session.changes();
```

The catalog should never be mutated by callers.

Conceptually:

```ts
interface SessionCatalogSnapshot {
  catalog: TestCatalog;
  revision: number;
}
```

Every plan is produced against a particular catalog revision.

That relationship should eventually become explicit on `ExecutionPlan`.

```ts
interface ExecutionPlan {
  catalogRevision: number;

  specIds: string[];

  // ...
}
```

This allows Testify to detect a stale plan.

Example:

```ts
const plan = session.plan();

session.refresh();

// catalog changed

await session.execute(plan);
```

Testify can then decide whether to:

* execute the historical plan,
* reject it,
* or revalidate it.

For Session v1, I recommend rejecting plans whose selected test IDs no longer exist.

Do not silently re-plan.

A plan should remain data with stable meaning.

---

## 8. Explicit refresh

The current session implicitly calls `syncCatalog()` before many operations.

That behavior is useful internally, but the public model needs an explicit concept.

```ts
const refresh =
  session.refresh();
```

Possible contract:

```ts
export interface SessionRefreshResult {
  changed: boolean;
  previousRevision: number;
  revision: number;
  changes: CatalogChangeSet;
}
```

Example:

```ts
const result = session.refresh();

if (result.changed) {
  console.log(
    `Catalog ${result.previousRevision} → ${result.revision}`,
  );
}
```

Normal operations may continue to refresh lazily for ergonomic reasons.

But `refresh()` makes the behavior observable and controllable for watch mode and IDE integrations.

---

## 9. Query surface

`query()` should remain the canonical query API.

```ts
session.query().tests();
session.query().suites();
session.query().files();
```

The existing convenience methods:

```ts
session.listTests();
session.listSuites();
session.listFiles();

session.findTests();
session.findSuites();
session.findFiles();
```

should eventually become convenience/UI helpers rather than primary API.

The stable conceptual hierarchy should be:

```text
session
  ↓
query()
  ↓
CatalogQuery
```

rather than continually adding query methods directly onto Session.

That keeps Session from becoming a giant object.

Preferred usage:

```ts
session.query().tests(/parser/);
session.query().suites(/Membrane/);
session.query().files(/validation/);
```

Compatibility methods may remain.

---

## 10. Planning

Planning is a pure session operation.

```ts
const plan =
  session.plan({
    suite: /Membrane/,
  });
```

`plan()` uses:

```text
current catalog
+
selector
+
execution-plan options
=
ExecutionPlan
```

Important rule:

> Planning MUST NOT execute tests.

Planning should remain inspectable and deterministic.

```ts
const plan =
  session.planSuite('Membrane');

console.log(plan.specIds);
```

This is the architectural foundation for:

* dry runs,
* parallelism,
* CI sharding,
* affected tests,
* IDE execution,
* remote execution.

---

## 11. Plan options

Today `RunnerSessionOptions` extends `ExecutionPlanOptions` and is supplied indirectly through `getOptions()`.

Session v1 should distinguish:

```text
session defaults
```

from:

```text
per-plan options
```

For example:

```ts
const session =
  await createSession({
    planning: {
      random: false,
    },
  });
```

Then:

```ts
session.plan(selector);
```

uses defaults.

But:

```ts
session.plan(selector, {
  random: true,
  seed: 1234,
});
```

overrides them for that plan only.

Semantics:

```ts
effectiveOptions = {
  ...sessionPlanningDefaults,
  ...planOptions,
};
```

This will be important when the execution planner becomes more sophisticated.

---

## 12. Execution adapter

The current adapter contract is beautifully small:

```ts
export interface RunnerSessionAdapter<TResult> {
  execute(
    plan: ExecutionPlan,
  ): Promise<TResult>;
}
```

Keep this property.

But rename it conceptually to:

```ts
SessionExecutionAdapter
```

or simply:

```ts
ExecutionAdapter
```

Possible v1:

```ts
export interface ExecutionAdapter<
  TResult = ExecutionResult,
> {
  execute(
    plan: ExecutionPlan,
  ): Promise<TResult>;

  close?(): Promise<void>;
}
```

Session delegates execution:

```ts
execute(
  plan: ExecutionPlan,
): Promise<TResult> {
  this.assertOpen();
  this.validatePlan(plan);

  return this.adapter.execute(plan);
}
```

And lifecycle:

```ts
async close(): Promise<void> {
  if (this.state === 'closed') {
    return;
  }

  this.state = 'closing';

  await this.adapter.close?.();

  this.state = 'closed';
}
```

---

## 13. Language must NOT leak into Session

Session should not contain Jasmine-specific APIs.

Wrong:

```ts
session.jasmineEnv()
session.jasmineReporter()
session.jasmineConfig()
```

Correct:

```ts
session.plan(...)
session.execute(...)
session.query(...)
```

Jasmine belongs behind the execution/language integration boundary.

Conceptually:

```text
            Testify Session
                  │
                  ↓
            Execution Plan
                  │
                  ↓
           Execution Adapter
                  │
            ┌─────┴─────┐
            │           │
        environment   language
            │           │
          Node       Jasmine
          Chrome
          Firefox
```

We do not need to implement the language abstraction in Session v1.

But Session v1 must avoid preventing it.

---

## 14. `run()` is sugar

This invariant should be guaranteed:

```ts
await session.run(selector);
```

is semantically equivalent to:

```ts
const plan =
  session.plan(selector);

await session.execute(plan);
```

Likewise:

```ts
session.runSuite(selector)
```

means:

```ts
session.execute(
  session.planSuite(selector),
);
```

The existing implementation already follows exactly this pattern.

Keep it.

---

## 15. No hidden execution inside queries

These operations:

```ts
session.catalog()
session.query()
session.plan()
session.stats()
session.revision()
session.refresh()
```

must never cause test execution.

They may discover/update metadata.

Only these trigger tests:

```ts
session.execute()
session.run()
session.runSpec()
session.runSuite()
session.runFile()
```

This separation should be treated as a contract.

---

## 16. Closing

Sessions need an explicit lifecycle boundary.

```ts
await session.close();
```

`close()` should be:

* asynchronous,
* idempotent,
* safe after failures.

Thus:

```ts
await session.close();
await session.close();
```

is valid.

After close:

```ts
session.query();
session.plan();
session.execute(plan);
```

should fail with a clear session-closed error.

I recommend using a specific error:

```ts
export class SessionClosedError
  extends Error {}
```

This is preferable to strange environment-specific errors from a browser/WebSocket/process that has already disappeared.

---

## 17. Async disposal

Once runtime requirements permit it, Session can additionally support:

```ts
await using session =
  await createSession();
```

through:

```ts
async [Symbol.asyncDispose]() {
  await this.close();
}
```

But `close()` remains the canonical API.

---

## 18. What Session v1 deliberately does NOT include

Do not add these yet:

```ts
session.workers(...)
session.retry(...)
session.watch(...)
session.affected(...)
session.remote(...)
session.history(...)
```

Those concepts can be layered later.

Most importantly, don't make Session v1 predict every future feature.

The contract only needs to provide the correct home for them.

---

## 19. Events

I would NOT put a large event system into Session v1.

If needed immediately, introduce one minimal subscription boundary:

```ts
session.subscribe(listener);
```

with structural events such as:

```ts
type SessionEvent =
  | {
      type: 'catalogChanged';
      revision: number;
      changes: CatalogChangeSet;
    }
  | {
      type: 'closed';
    };
```

Execution events such as:

```text
specStarted
specFinished
suiteStarted
consoleMessage
```

should NOT become Session events.

Those belong to an execution/reporting channel.

This prevents Session from becoming another Jasmine reporter.

---

## 20. Results belong to executions

For v1:

```ts
const result =
  await session.execute(plan);
```

returning `ExecutionResult` is sufficient.

Do not store:

```ts
session.lastResult
```

as fundamental state.

That creates unnecessary coupling between independent runs.

Future history support can introduce a separate abstraction.

---

## 21. Future execution handle

Session v1 should not require this yet, but its contract should permit:

```ts
const execution =
  session.start(plan);

execution.id;
execution.state;

const result =
  await execution.result;
```

This would later give us:

```ts
execution.abort();
execution.events();
execution.duration;
```

without changing `Session`.

For now:

```ts
execute(plan): Promise<ExecutionResult>
```

is enough.

---

## 22. Proposed concrete v1 surface

```ts
export interface TestifySession {
  readonly state: SessionState;

  catalog(): TestCatalog;
  revision(): number;
  changes(): CatalogChangeSet;

  query(): CatalogQuery;

  stats(): SessionStats;
  planningStats(): PlanningEngineStats;

  refresh(): SessionRefreshResult;
  invalidatePlans(): void;

  plan(
    selector?: TestSelector,
    options?: ExecutionPlanOptions,
  ): ExecutionPlan;

  planSpec(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): ExecutionPlan;

  planSuite(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): ExecutionPlan;

  planFile(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): ExecutionPlan;

  shard(
    plan: ExecutionPlan,
    index: number,
    count: number,
  ): ExecutionPlan;

  partition(
    plan: ExecutionPlan,
    count: number,
  ): ExecutionPlan[];

  execute(
    plan: ExecutionPlan,
  ): Promise<ExecutionResult>;

  run(
    selector?: TestSelector,
    options?: ExecutionPlanOptions,
  ): Promise<ExecutionResult>;

  runSpec(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): Promise<ExecutionResult>;

  runSuite(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): Promise<ExecutionResult>;

  runFile(
    selector: string | RegExp,
    options?: ExecutionPlanOptions,
  ): Promise<ExecutionResult>;

  close(): Promise<void>;
}
```

---

## 23. Conceptual model

The resulting architecture is:

```text
                  Testify
                     │
              createSession()
                     │
                     ↓
              ┌─────────────┐
              │   Session   │
              └─────────────┘
                │    │    │
        ┌───────┘    │    └─────────┐
        ↓            ↓              ↓
     Catalog       Planner        Query
        │            │
        │            ↓
        │      ExecutionPlan
        │            │
        └────────────┤
                     ↓
             ExecutionAdapter
                     │
             ┌───────┴────────┐
             ↓                ↓
        Environment        Language
        Node/Browser        Jasmine
                     │
                     ↓
              ExecutionResult
```

The important boundary is:

```text
Session plans.

Adapter executes.

Language defines tests.
```

---

## 24. Invariants

Session v1 should have explicit tests guaranteeing these invariants.

### Lifecycle

```text
session starts ready
close() is idempotent
operations after close fail predictably
```

### Reusability

```text
execute A
execute B
execute C
```

works on the same session.

### Planning

```text
plan() never executes
same catalog + selector + options => same plan
```

### Convenience API

```text
run(selector)
==
execute(plan(selector))
```

### Catalog

```text
catalog changes increment revision
planner cache invalidates appropriately
query observes current catalog
```

### Execution

```text
execute(plan) delegates exactly once to adapter
session does not interpret Jasmine behavior
```

### Separation

```text
Session contains no Jasmine-specific contract.
```

---

## 25. Migration from current RunnerSession

The current implementation should evolve rather than be replaced.

Keep:

```ts
RunnerSession
PlanningEngine
CatalogQuery
ExecutionPlan
ExecutionResult
RunnerSessionAdapter
```

The current class already implements most of:

```text
catalog
index
revision
changes
query
stats
planning stats
planning
sharding
partitioning
execution
run conveniences
```

The first Session v1 implementation should primarily add:

```text
explicit lifecycle
close()
refresh()
per-plan option overrides
plan revision validation
clean execution-adapter lifecycle
```

Then reduce duplicated list/find APIs over time.

No large rewrite is necessary.

---

# Session v1 summary

A Testify Session is:

> **A reusable execution context that owns a test catalog and planning state and delegates execution plans to an execution environment.**

Its two fundamental operations are:

```ts
const plan =
  session.plan(selector);

const result =
  await session.execute(plan);
```

Everything else follows from that.

And the architectural hierarchy remains:

> **Testify is an execution engine for tests. Jasmine is one test language hosted by it.**
