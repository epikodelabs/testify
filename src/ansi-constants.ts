// ─── Terminal width ─────────────────────────────────────────
export const MAX_WIDTH = typeof process !== 'undefined' && process.stdout?.columns
  ? Math.max(40, process.stdout.columns)
  : 80;

// ─── ANSI regex ────────────────────────────────────────────
export const ANSI_FULL_REGEX =
  /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;