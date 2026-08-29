export interface BrowserWebSocketReporterScriptOptions {
  initialSeed: number;
  initialRandom: boolean;
}

export function getBrowserWebSocketReporterScript(
  options: BrowserWebSocketReporterScriptOptions,
): string {
  const {
    initialSeed: seed,
    initialRandom: random,
  } = options;

  return `
function WebSocketEventForwarder() {
  this.ws = null;
  this.connected = false;
  this.messageQueue = [];
  this.currentSpecId = null;
  this.pendingSpecFailures = new Map();
  this.globalFailures = [];
  this.attributedFailureSignatures = new Set();
  this.errorHooksInstalled = false;

  const self = this;

  this.failureSignature = function (failure) {
    return [
      failure?.message || '',
      failure?.stack || '',
    ].join('\\n@@\\n');
  };

  this.dedupeFailures = function (failures, excludedSignatures) {
    const seen = new Set();
    const deduped = [];

    for (const failure of failures || []) {
      const signature = self.failureSignature(failure);
      if (excludedSignatures?.has(signature) || seen.has(signature)) {
        continue;
      }

      seen.add(signature);
      deduped.push(failure);
    }

    return deduped;
  };

  this.describeThrownValue = function (value) {
    if (value instanceof Error) {
      return {
        message: value.message || String(value),
        stack: value.stack || value.message || String(value),
      };
    }

    if (value && typeof value === 'object') {
      const message =
        typeof value.message === 'string'
          ? value.message
          : (() => {
              try {
                return JSON.stringify(value);
              } catch (error) {
                console.error('Testify runtime error:', error);
                return String(value);
              }
            })();

      return {
        message,
        stack:
          typeof value.stack === 'string'
            ? value.stack
            : undefined,
      };
    }

    return {
      message:
        typeof value === 'string'
          ? value
          : String(value),
      stack: undefined,
    };
  };

  this.createFailure = function (type, value) {
    const details =
      self.describeThrownValue(value);

    return {
      matcherName: '',
      passed: false,
      globalErrorType: type,
      message: details.message,
      stack: details.stack,
    };
  };

  this.recordAsyncFailure = function (type, value) {
    const failure =
      self.createFailure(type, value);
    const signature =
      self.failureSignature(failure);

    if (self.currentSpecId) {
      const pending =
        self.pendingSpecFailures.get(
          self.currentSpecId,
        ) ?? [];

      if (
        !pending.some(
          (entry) =>
            self.failureSignature(entry) === signature,
        )
      ) {
        pending.push(failure);
        self.pendingSpecFailures.set(
          self.currentSpecId,
          pending,
        );
      }

      self.attributedFailureSignatures.add(
        signature,
      );
      return;
    }

    if (
      self.globalFailures.some(
        (entry) =>
          self.failureSignature(entry) === signature,
      )
    ) {
      return;
    }

    self.globalFailures.push(failure);
  };

  this.installErrorHooks = function () {
    if (self.errorHooksInstalled) {
      return;
    }

    self.errorHooksInstalled = true;

    window.addEventListener(
      'unhandledrejection',
      (event) => {
        self.recordAsyncFailure(
          'unhandledRejection',
          event.reason,
        );
      },
    );

    window.addEventListener(
      'error',
      (event) => {
        if (event.error) {
          self.recordAsyncFailure(
            'error',
            event.error,
          );
          return;
        }

        const location =
          typeof event.filename === 'string' && event.filename
            ? event.filename + ':' + event.lineno + ':' + event.colno
            : undefined;

        self.recordAsyncFailure(
          'error',
          {
            message:
              event.message || 'Uncaught browser error',
            stack: location,
          },
        );
      },
    );
  };

  this.mergePendingSpecFailures = function (result) {
    const pending =
      self.pendingSpecFailures.get(result.id) ?? [];

    self.pendingSpecFailures.delete(
      result.id,
    );

    if (!pending.length) {
      return result;
    }

    return {
      ...result,
      status: 'failed',
      failedExpectations:
        self.dedupeFailures([
          ...(Array.isArray(result.failedExpectations)
            ? result.failedExpectations
            : []),
          ...pending,
        ]),
    };
  };

  this.collectRunLevelFailures = function (result) {
    return self.dedupeFailures(
      [
        ...(
          Array.isArray(result?.failedExpectations)
            ? result.failedExpectations
            : []
        ),
        ...self.globalFailures,
      ],
      self.attributedFailureSignatures,
    );
  };

  this.installErrorHooks();

  this.connect = function () {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = protocol + '//' + window.location.host;

    self.ws = new WebSocket(wsUrl);

    self.ws.onopen = () => {
      self.connected = true;
      console.log('WebSocket connected to', wsUrl);

      self.send({
        type: 'userAgent',
        data: {
          userAgent: navigator.userAgent,
          appName: navigator.appName,
          appVersion: navigator.appVersion,
          platform: navigator.platform,
          vendor: navigator.vendor,
          language: navigator.language,
          languages: navigator.languages,
          orderedSuites: self.getOrderedSuites(${seed}, ${random}).map(suite => ({
            id: suite.id,
            description: suite.description,
            fullName: suite.getFullName ? suite.getFullName() : suite.description
          })),
          orderedSpecs: self.getOrderedSpecs(${seed}, ${random}).map(spec => ({
            id: spec.id,
            description: spec.description,
            fullName: spec.getFullName ? spec.getFullName() : spec.description
          }))
        },
        timestamp: Date.now()
      });

      while (self.messageQueue.length > 0) {
        const msg = self.messageQueue.shift();
        self.send(msg);
      }
    };

    self.ws.onclose = () => {
      self.connected = false;
      console.log('WebSocket disconnected');
      setTimeout(() => self.connect(), 1000);
    };

    self.ws.onerror = (err) => {
      self.connected = false;
      console.error('WebSocket error:', err);
    };

    self.ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        if (window.HMRClient && (message.type === 'hmr:connected' || message.type === 'hmr:update')) {
          await window.HMRClient.handleMessage(message);
        }
      } catch (err) {
        console.error('Failed to handle WebSocket message:', err);
      }
    };
  };

  this.send = function (msg) {
    if (self.connected && self.ws && self.ws.readyState === WebSocket.OPEN) {
      try {
        self.ws.send(JSON.stringify(msg));
      } catch (err) {
        console.error('Failed to send WebSocket message:', err);
      }
    } else {
      self.messageQueue.push(msg);
    }
  };

  this.getAllSpecs = function () {
    const allSpecs = [];
    function collect(suite) {
      suite.children.forEach((child) => {
        if (child.children && child.children.length > 0) {
          collect(child);
        } else {
          allSpecs.push(child);
        }
      });
    }
    
    const env = jasmine?.getEnv?.();
    if (env) collect(env.topSuite());
    return allSpecs;
  };

  this.getAllSuites = function () {
    const allSuites = [];
    function collect(suite) {
      allSuites.push(suite);
      suite.children.forEach((child) => {
        if (child.children && child.children.length > 0) {
          collect(child);
        }
      });
    }
    
    const env = jasmine?.getEnv?.();
    if (env) collect(env.topSuite());
    return allSuites;
  };

  this.getOrderedSpecs = function (seed, random) {
    const allSpecs = self.getAllSpecs();
    if (!random) return allSpecs;

    const OrderCtor = jasmine.Order;
    if (typeof OrderCtor === 'function') {
      try {
        const order = new OrderCtor({ random, seed });
        if (typeof order.sort === 'function') {
          return order.sort(allSpecs);
        }
      } catch (err) {
        console.error('Failed to create jasmine.Order:', err);
      }
    }
    return allSpecs;
  };

  this.getOrderedSuites = function (seed, random) {
    const allSuites = self.getAllSuites();
    if (!random) return allSuites;

    const OrderCtor = jasmine.Order;
    if (typeof OrderCtor === 'function') {
      try {
        const order = new OrderCtor({ random, seed });
        if (typeof order.sort === 'function') {
          return order.sort(allSuites);
        }
      } catch (err) {
        console.error('Failed to create jasmine.Order for suites:', err);
      }
    }
    return allSuites;
  };

  // Jasmine reporter hooks
  this.jasmineStarted = function (config) {
    self.currentSpecId = null;
    self.pendingSpecFailures.clear();
    self.globalFailures = [];
    self.attributedFailureSignatures.clear();

    self.send({
      type: 'jasmineStarted',
      data: config,
      timestamp: Date.now()
    });
  };

  this.suiteStarted = function (suite) {
    self.send({
      type: 'suiteStarted',
      id: suite.id,
      description: suite.description,
      fullName: suite.fullName,
      timestamp: Date.now()
    });
  };

  this.specStarted = function (spec) {
    self.currentSpecId = spec.id;

    self.send({
      type: 'specStarted',
      id: spec.id,
      description: spec.description,
      fullName: spec.fullName,
      timestamp: Date.now()
    });
  };

  this.specDone = function (result) {
    const mergedResult =
      self.mergePendingSpecFailures(result);

    if (self.currentSpecId === result.id) {
      self.currentSpecId = null;
    }

    self.send({
      type: 'specDone',
      ...mergedResult,
      timestamp: Date.now()
    });
  };

  this.suiteDone = function (suite) {
    self.send({
      type: 'suiteDone',
      id: suite.id,
      description: suite.description,
      fullName: suite.fullName,
      timestamp: Date.now()
    });
  };

  this.jasmineDone = function (result) {
    self.currentSpecId = null;

    const coverage = globalThis.__coverage__;
    self.send({
      type: 'jasmineDone',
      ...result,
      failedExpectations:
        self.collectRunLevelFailures(result),
      coverage: coverage ? JSON.stringify(coverage) : null,
      timestamp: Date.now()
    });

    window.jasmineFinished = true;

    if (!window.HMRClient) {
      setTimeout(() => {
        if (self.ws) self.ws.close();
      }, 1000);
    }
  };
}
`;
}