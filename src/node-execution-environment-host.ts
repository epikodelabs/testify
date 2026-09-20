export interface NodeExecutionEnvironmentHostOptions {
  env?: NodeJS.ProcessEnv;
  nodeEnv?: string;
  suppressConsoleLogs?: boolean;
}

type ConsoleMethod =
  | 'log'
  | 'info'
  | 'debug'
  | 'trace'
  | 'warn'
  | 'table';

const SILENT_CONSOLE_METHODS:
  readonly ConsoleMethod[] = [
    'log',
    'info',
    'debug',
    'trace',
    'warn',
    'table',
  ];

export class NodeExecutionEnvironmentHost {
  constructor(
    private readonly options:
      NodeExecutionEnvironmentHostOptions = {},
  ) {}

  async run<T>(
    work: () => Promise<T>,
  ): Promise<T> {
    const envSnapshot =
      this.captureEnvironment();

    const consoleSnapshot =
      this.captureConsole();
    const logSuppressionSnapshot =
      this.captureLogSuppression();

    try {
      this.applyEnvironment();
      // The reporter and test modules share a process. Keep incidental logger
      // calls from test subjects out of the reporter-owned terminal layout.
      (globalThis as any).__testifySuppressLogs = true;

      if (
        this.options
          .suppressConsoleLogs
      ) {
        this.suppressConsole();
      }

      return await work();
    } finally {
      this.restoreConsole(
        consoleSnapshot,
      );

      this.restoreEnvironment(
        envSnapshot,
      );
      this.restoreLogSuppression(
        logSuppressionSnapshot,
      );
    }
  }

  private captureLogSuppression(): {
    exists: boolean;
    value: unknown;
  } {
    return {
      exists: Object.prototype.hasOwnProperty.call(
        globalThis,
        '__testifySuppressLogs',
      ),
      value: (globalThis as any).__testifySuppressLogs,
    };
  }

  private restoreLogSuppression(
    snapshot: { exists: boolean; value: unknown },
  ): void {
    if (snapshot.exists) {
      (globalThis as any).__testifySuppressLogs = snapshot.value;
      return;
    }

    delete (globalThis as any).__testifySuppressLogs;
  }

  private captureEnvironment():
    Map<
      string,
      string | undefined
    > {
    const keys =
      new Set<string>([
        ...Object.keys(
          this.options.env ?? {},
        ),
        'NODE_ENV',
      ]);

    return new Map(
      [...keys].map(
        (key) => [
          key,
          process.env[key],
        ],
      ),
    );
  }

  private applyEnvironment(): void {
    for (
      const [key, value] of
      Object.entries(
        this.options.env ?? {},
      )
    ) {
      if (value == null) {
        delete process.env[key];
      } else {
        process.env[key] =
          value;
      }
    }

    if (
      this.options.nodeEnv !==
      undefined
    ) {
      process.env.NODE_ENV =
        this.options.nodeEnv;
    }
  }

  private restoreEnvironment(
    snapshot: Map<
      string,
      string | undefined
    >,
  ): void {
    for (
      const [key, value] of
      snapshot
    ) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] =
          value;
      }
    }
  }

  private captureConsole():
    Map<
      ConsoleMethod,
      (...args: any[]) => any
    > {
    return new Map(
      SILENT_CONSOLE_METHODS.map(
        (method) => [
          method,
          console[method],
        ],
      ),
    );
  }

  private suppressConsole(): void {
    for (
      const method of
      SILENT_CONSOLE_METHODS
    ) {
      console[method] =
        (() => {}) as
          typeof console[
            typeof method
          ];
    }
  }

  private restoreConsole(
    snapshot: Map<
      ConsoleMethod,
      (...args: any[]) => any
    >,
  ): void {
    for (
      const [method, value] of
      snapshot
    ) {
      console[method] =
        value as
          typeof console[
            typeof method
          ];
    }
  }
}
