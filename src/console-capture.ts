import util from 'util';

const CAPTURED_METHODS = ['log', 'info', 'warn', 'error', 'debug'] as const;

export interface ConsoleCapture {
  /** Returns and clears the buffered lines. */
  flush(): string[];
  /** Restores the original console methods. */
  restore(): void;
}

/**
 * Buffers spec console output during an in-process Node run.
 *
 * The reporter's live result table tracks the terminal cursor, and every
 * spec console write (for example the Angular dev-mode banner) lands on
 * stdout mid-table, desynchronizing the cursor arithmetic and stacking
 * duplicate table rows. Capture the output for the duration of the run and
 * flush it after the table has closed; with `suppress` the lines are
 * dropped entirely.
 */
export function installConsoleCapture(
  options: { suppress?: boolean } = {},
): ConsoleCapture {
  const lines: string[] = [];
  const captured = new Map<string, (...args: unknown[]) => void>();

  const target = console as unknown as Record<string, unknown>;
  for (const method of CAPTURED_METHODS) {
    const original = target[method];
    if (typeof original !== 'function') continue;
    captured.set(method, original as (...args: unknown[]) => void);
    target[method] = (...args: unknown[]) => {
      if (!options.suppress) lines.push(util.format(...args));
    };
  }

  return {
    flush() {
      return lines.splice(0);
    },
    restore() {
      for (const [method, original] of captured) {
        target[method] = original;
      }
    },
  };
}
