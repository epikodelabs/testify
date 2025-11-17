import { EnvironmentInfo, TestSpec, TestSuite, UserAgent } from "./console-reporter";
import os from "os";

type AnyObj = Record<string, any>;

function safeStringify(obj: any) {
  try { return JSON.stringify(obj); } catch (e) { return String(obj); }
}

function safeCall<T>(fn: () => T, fallback: any = null): any {
  try { return fn(); } catch { return fallback; }
}

// -----------------------------------------------------------------------------
// SERIALIZERS
// -----------------------------------------------------------------------------

function serializeFailedExpectation(fe: any) {
  if (!fe) return null;
  return {
    message: fe.message ?? null,
    stack: fe.stack ?? null,
    matcherName: fe.matcherName ?? null,
    passed: fe.passed ?? null,
  };
}

function serializePassedExpectation(pe: any) {
  if (!pe) return null;
  return {
    matcherName: pe.matcherName ?? null,
    message: pe.message ?? null,
  };
}

function serializeSpec(spec: any) {
  if (!spec) return null;
  return {
    id: typeof spec.id === 'string' ? spec.id : (spec.id ?? null),
    description: spec.description ?? (spec.getFullName ? safeCall(() => spec.getFullName()) : null),
    fullName: (typeof spec.getFullName === 'function') ? safeCall(() => spec.getFullName()) : (spec.fullName ?? null),
    status: spec.status ?? null,
    failedExpectations: Array.isArray(spec.failedExpectations)
      ? spec.failedExpectations.map(serializeFailedExpectation)
      : [],
    passedExpectations: Array.isArray(spec.passedExpectations)
      ? spec.passedExpectations.map(serializePassedExpectation)
      : [],
    duration: spec.duration ?? null,
    filePath: spec._filePath ?? spec.filePath ?? null,
  };
}

function serializeSuite(suite: any) {
  if (!suite) return null;
  return {
    id: suite.id ?? null,
    description: suite.description ?? null,
    fullName: (typeof suite.getFullName === 'function')
      ? safeCall(() => suite.getFullName())
      : (suite.fullName ?? null),
    filePath: suite._filePath ?? suite.filePath ?? null,
  };
}

// -----------------------------------------------------------------------------
// MAIN CLASS
// -----------------------------------------------------------------------------

export class ProcessEventForwarder {
  private connected = typeof process !== 'undefined' && !!(process as any).connected;
  private queue: AnyObj[] = [];
  private orderedSpecs: AnyObj[] = [];
  private orderedSuites: AnyObj[] = [];
  private jasmine: any;
  private envInfo: EnvironmentInfo | null = null;
  private hostReadyPromise: Promise<void> | null = null;
  private hostReadyResolve: any;
  private hostReadyReject: any;

  constructor(jasmine: any) {
    this.jasmine = jasmine;

    this.hostReadyPromise = new Promise<void>((resolve, reject) => {
      this.hostReadyResolve = resolve;
      this.hostReadyReject = reject;
    });

    if (typeof process !== 'undefined' && (process as any).on) {
      (process as any).on('message', this.onParentMessage.bind(this));
    }

    // initial event
    this.send({ type: "ready", data: null });
  }

  // ---------------------------------------------------------------------------
  // SEND (all events become: { type, data, timestamp })
  // ---------------------------------------------------------------------------
  private send(msg: { type: string; data?: any }) {
    const safeMsg = {
      type: msg.type,
      data: msg.data ?? null,
      timestamp: Date.now()
    };

    if (typeof process === 'undefined' || typeof (process as any).send !== 'function') {
      this.queue.push(safeMsg);
      return;
    }

    try {
      if (!(process as any).connected) {
        this.queue.push(safeMsg);
      } else {
        (process as any).send(safeMsg);

        while (this.queue.length && (process as any).connected) {
          const q = this.queue.shift();
          try { (process as any).send(q); }
          catch { break; }
        }
      }
    } catch {
      this.queue.push(safeMsg);
    }
  }

  private gatherNodeUserAgent(): UserAgent {
    return {
      userAgent: `Node.js/${process.version} (${os.type()} ${os.release()}; ${os.arch()})`,
      appName: "Node.js",
      appVersion: process.version,
      platform: `${os.type()} ${os.arch()}`,
      vendor: "Node.js Foundation",
      language: process.env.LANG?.split(".")[0] ?? "en",
      languages: [
        process.env.LANG?.split(".")[0] ?? "en"
      ]
    };
  }

  userAgent() {
    this.send({
      type: "userAgent",
      data: this.gatherNodeUserAgent()
    });
  }

  // ---------------------------------------------------------------------------
  // HELPERS FOR ORDERED SPECS/SUITES
  // ---------------------------------------------------------------------------

  private getAllSpecs(): TestSpec[] {
    const specs: TestSpec[] = [];
    const traverse = (suite: any) => {
      suite.children?.forEach((child: any) => {
        if (child && typeof child.id === 'string' && !child.children) specs.push(child);
        if (child?.children) traverse(child);
      });
    };
    traverse(this.jasmine.getEnv().topSuite());
    return specs;
  }

  private getAllSuites(): TestSuite[] {
    const suites: TestSuite[] = [];
    const traverse = (suite: any) => {
      suites.push(suite);
      suite.children?.forEach((child: any) => {
        if (child?.children) traverse(child);
      });
    };
    traverse(this.jasmine.getEnv().topSuite());
    return suites;
  }

  getOrderedSpecs(seed: number, random: boolean) {
    const all = this.getAllSpecs();
    if (!random) return all;

    const OrderCtor = this.jasmine.Order;
    try {
      const order = new OrderCtor({ random, seed });
      return typeof order.sort === "function" ? order.sort(all) : all;
    } catch {
      return all;
    }
  }

  getOrderedSuites(seed: number, random: boolean) {
    const all = this.getAllSuites();
    if (!random) return all;

    const OrderCtor = this.jasmine.Order;
    try {
      const order = new OrderCtor({ random, seed });
      return typeof order.sort === "function" ? order.sort(all) : all;
    } catch {
      return all;
    }
  }

  // ---------------------------------------------------------------------------
  // JASMINE EVENT CALLBACKS
  // ---------------------------------------------------------------------------

  async jasmineStarted(config: any) {
    if (config.order) {
      const random = !!config.order.random;
      const seed = config.order.seed;

      config.orderedSpecs = this.getOrderedSpecs(seed, random);
      config.orderedSuites = this.getOrderedSuites(seed, random);
    } else {
      config.orderedSpecs = this.getAllSpecs();
      config.orderedSuites = this.getAllSuites();
    }

    try {
      this.orderedSpecs = config.orderedSpecs.map((s: any) => serializeSpec(s));
      this.orderedSuites = config.orderedSuites.map((s: any) => serializeSuite(s));
    } catch { /* ignore */ }

    this.send({
      type: "jasmineStarted",
      data: config ?? null
    });

    await this.hostReadyPromise;
  }

  suiteStarted(suite: any) {
    this.send({
      type: "suiteStarted",
      data: serializeSuite(suite)
    });
  }

  specStarted(spec: any) {
    this.send({
      type: "specStarted",
      data: serializeSpec(spec)
    });
  }

  specDone(result: any) {
    this.send({
      type: "specDone",
      data: serializeSpec(result)
    });
  }

  suiteDone(suite: any) {
    this.send({
      type: "suiteDone",
      data: serializeSuite(suite)
    });
  }

  jasmineDone(result: any) {
    const coverage = (globalThis as any).__coverage__;
    this.send({
      type: "jasmineDone",
      data: {
        result: result ?? null,
        coverage: coverage ? safeStringify(coverage) : null
      }
    });
  }

  jasmineFailed = (err: any) => {
    this.send({
      type: "jasmineFailed",
      data: { error: String(err) }
    });
  };

  testsAborted(message: string) {
     this.send({
      type: "testsAborted",
      data: { message }
    });
  }

  // ---------------------------------------------------------------------------
  // PARENT MESSAGE HANDLER
  // ---------------------------------------------------------------------------

  private async onParentMessage(msg: any) {
    if (!msg || typeof msg !== "object" || !msg.type) return;

    try {
      switch (msg.type) {
        case "hostReady":
          this.hostReadyResolve();
          break;
        case "ping":
          this.send({ type: "pong", data: null });
          break;

        case "list":
          this.send({
            type: "list",
            data: {
              orderedSpecs: this.orderedSpecs,
              orderedSuites: this.orderedSuites
            }
          });
          break;

        case "ordered":
          this.send({
            type: "ordered",
            data: {
              orderedSpecs: this.orderedSpecs,
              orderedSuites: this.orderedSuites
            }
          });
          break;

        case "run":
          try {
            const specIds = Array.isArray(msg.specIds) ? msg.specIds : null;

            this.send({
              type: "run:ack",
              data: { specIds }
            });

            const runner = (globalThis as any).runner;

            if (runner?.runTests && specIds) {
              const results = await runner.runTests(specIds);
              this.send({ type: "run:done", data: results });
            } else if (runner?.runTest && specIds?.length === 1) {
              const results = await runner.runTest(specIds[0]);
              this.send({ type: "run:done", data: results });
            } else {
              this.send({
                type: "run:info",
                data: { message: "No local runner API found; acknowledged request." }
              });
            }

          } catch (err) {
            this.send({
              type: "run:error",
              data: { error: String(err) }
            });
          }
          break;

        case "shutdown":
          this.send({ type: "shutdown:ack", data: null });
          setTimeout(() => process.exit(0), 50);
          break;

        default:
          this.send({
            type: "unknownCommand",
            data: msg
          });
      }
    } catch (err) {
      this.send({
        type: "onParentMessageError",
        data: {
          error: String(err),
          original: msg
        }
      });
    }
  }
}
