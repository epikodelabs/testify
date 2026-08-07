export interface NodeProcessHostOptions {
  onUnhandledRejection?: (
    error: unknown,
  ) => void;

  onUncaughtException?: (
    error: Error,
  ) => void;

  onSignal?: (
    signal: NodeJS.Signals,
  ) => void;
}

export class NodeProcessHost {
  private attached = false;

  private readonly onUnhandledRejection =
    (error: unknown): void => {
      this.options
        .onUnhandledRejection?.(
          error,
        );
    };

  private readonly onUncaughtException =
    (error: Error): void => {
      this.options
        .onUncaughtException?.(
          error,
        );
    };

  private readonly onSigint =
    (): void => {
      this.options
        .onSignal?.(
          'SIGINT',
        );
    };

  private readonly onSigterm =
    (): void => {
      this.options
        .onSignal?.(
          'SIGTERM',
        );
    };

  constructor(
    private readonly options:
      NodeProcessHostOptions = {},
  ) {}

  attach(): void {
    if (this.attached) {
      return;
    }

    this.attached = true;

    process.on(
      'unhandledRejection',
      this.onUnhandledRejection,
    );

    process.on(
      'uncaughtException',
      this.onUncaughtException,
    );

    process.on(
      'SIGINT',
      this.onSigint,
    );

    process.on(
      'SIGTERM',
      this.onSigterm,
    );
  }

  detach(): void {
    if (!this.attached) {
      return;
    }

    this.attached = false;

    process.off(
      'unhandledRejection',
      this.onUnhandledRejection,
    );

    process.off(
      'uncaughtException',
      this.onUncaughtException,
    );

    process.off(
      'SIGINT',
      this.onSigint,
    );

    process.off(
      'SIGTERM',
      this.onSigterm,
    );
  }
}
