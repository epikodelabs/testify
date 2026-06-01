// ─── Terminal width ─────────────────────────────────────────
export const getMaxWidth = (): number =>
  typeof process !== 'undefined' && process.stdout?.columns
    ? Math.max(40, process.stdout.columns)
    : 80;

/** @deprecated Use getMaxWidth() for accurate terminal width */
export const MAX_WIDTH = getMaxWidth();

// ─── ANSI regex ────────────────────────────────────────────
export const ANSI_FULL_REGEX =
  /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;