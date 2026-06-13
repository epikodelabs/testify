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

// ─── Emoji support ─────────────────────────────────────────
let ansiMode = false;

export function setAnsiMode(value = true): void {
  ansiMode = value;
  if (value) {
    process.env.NO_EMOJI = '1';
    process.env.NO_COLOR = '1';
  }
}

export function isAnsiMode(): boolean {
  return ansiMode;
}

export function supportsEmoji(): boolean {
  if (ansiMode) return false;
  if (process.env.NO_EMOJI) return false;
  if (process.env.FORCE_EMOJI) return true;
  return process.stdout.isTTY ?? false;
}
