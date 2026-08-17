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

function getRuntimeProcess(): NodeJS.Process | undefined {
  return typeof process === 'undefined' ? undefined : process;
}

export function setAnsiMode(value = true): void {
  ansiMode = value;
  const runtimeProcess = getRuntimeProcess();
  if (value && runtimeProcess) {
    runtimeProcess.env.NO_EMOJI = '1';
    runtimeProcess.env.NO_COLOR = '1';
  }
}

export function isAnsiMode(): boolean {
  return ansiMode;
}

export function supportsEmoji(): boolean {
  if (ansiMode) return false;
  const runtimeProcess = getRuntimeProcess();
  if (!runtimeProcess) return false;
  if (runtimeProcess.env.NO_EMOJI) return false;
  if (runtimeProcess.env.FORCE_EMOJI) return true;
  return runtimeProcess.stdout.isTTY ?? false;
}

export function supportsColor(): boolean {
  if (ansiMode) return false;
  const runtimeProcess = getRuntimeProcess();
  if (!runtimeProcess) return false;
  if (runtimeProcess.env.NO_COLOR) return false;
  if (runtimeProcess.env.FORCE_COLOR === '1' || runtimeProcess.env.FORCE_COLOR === 'true' || runtimeProcess.env.FORCE_COLOR) return true;
  return runtimeProcess.stdout.isTTY ?? false;
}
