# Testify 2 — Engine

Testify 2 is now the root API.

```ts
import {
  RunnerSession,
  createExecutionPlan,
  type ExecutionResult,
} from '@epikodelabs/testify';
```

Advanced implementation primitives are isolated behind:

```ts
import {
  CatalogState,
  PlanningEngine,
} from '@epikodelabs/testify/internals';
```

The temporary `/v2` migration namespace has been removed.

Core engine:

```text
TestCatalog
    ↓
CatalogQuery
    ↓
RunnerSession
    ↓
PlanningEngine
    ↓
ExecutionPlan
    ↓
Runtime Adapter
    ↓
ExecutionResult
```

Stable root concepts:

- `TestCatalog`
- `TestSelector`
- `CatalogQuery`
- `ExecutionPlan`
- `RunnerSession`
- `ExecutionResult`
- catalog list/find helpers
- deterministic plan partitioning/sharding

Unstable internals:

- `CatalogState`
- `PlanningEngine`
- normalized search-index internals

The root API intentionally does not expose process hosts, generated-source
helpers, CLI adapters, or Node runtime hosts.
