import { supportsEmoji, setAnsiMode as setAnsiModeConstant, isAnsiMode } from './ansi-constants';

// ─── TTY symbols (emojis & fancy unicode) ──────────────────
export const TTY_SYMBOLS: Record<string, string> = {
  checked: '✓',
  cross: '✕',
  warn: '🚨',
  info: '💡',
  globe: '🌐',
  doc: '📄',
  puzzle: '🧩',
  stop: '🛑',
  bulb: '📌',
  rocket: '🚀',
  hourglass: '⏳',
  circle_green: '🟢',
  plus: '➕',
  minus: '➖',
  folder: '📁',
  box: '📦',
  refresh: '🔄',
  broom: '🧹',
  lock: '🔒',
  fire: '🔥',
  satellite: '📡',
  ok: '👌',
  eyes: '👀',
  plug: '🔌',
  // Console reporter specific
  passed: '●',
  failed: 'x',
  pending: '○',
  arrow: '→',
  box_h: '─',
  box_double_h: '═',
  box_tl: '╔',
  box_tr: '╗',
  box_bl: '╚',
  box_br: '╝',
  box_v: '║',
  arrow_down_right: '↳',
  skip: '⤼',
  incomplete: '◷',
  not_run: '⊘',
};

// ─── ANSI symbols (plain ASCII text) ───────────────────────
export const ANSI_SYMBOLS: Record<string, string> = {
  checked: '[OK]',
  cross: '[ERROR]',
  warn: '[WARN]',
  info: '[INFO]',
  globe: '[BROWSER]',
  doc: '[FILE]',
  puzzle: '[TREE]',
  stop: '[STOP]',
  bulb: '[TIP]',
  rocket: '[START]',
  hourglass: '[WAIT]',
  circle_green: '[READY]',
  plus: '[ADD]',
  minus: '[REM]',
  folder: '[DIR]',
  box: '[BUILD]',
  refresh: '[RETRY]',
  broom: '[CLEAN]',
  lock: '[LOCK]',
  fire: '[HMR]',
  satellite: '[WS]',
  ok: '[OK]',
  eyes: '[WATCH]',
  plug: '[CONN]',
  // Console reporter specific
  passed: '+',
  failed: 'x',
  pending: '*',
  arrow: '->',
  box_h: '-',
  box_double_h: '=',
  box_tl: '+',
  box_tr: '+',
  box_bl: '+',
  box_br: '+',
  box_v: '|',
  arrow_down_right: '->',
  skip: '~',
  incomplete: 'o',
  not_run: '-',
};

export let SYMBOLS = supportsEmoji() ? TTY_SYMBOLS : ANSI_SYMBOLS;

export function setAnsiMode(): void {
  setAnsiModeConstant(true);
  SYMBOLS = ANSI_SYMBOLS;
}

const PLACEHOLDER_RE = /%([a-z_][a-z0-9_]*)%/g;

export function replacePlaceholders(message: string): string {
  return message.replace(PLACEHOLDER_RE, (match, key) => SYMBOLS[key] ?? match);
}
