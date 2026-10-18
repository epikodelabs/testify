export const norm = (p: string) => p.replace(/\\/g, '/');
export const capitalize = (p?: string | null): string => {
  if (!p) return '';
  return p.charAt(0).toUpperCase() + p.slice(1);
};

export const ANSI_FULL_REGEX =
  /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;

// Terminals advance two cells for East Asian wide and emoji-presentation code
// points. Counting them as one underestimates row widths, which wraps panel
// borders and desynchronizes cursor-based live redraws.
const WIDE_CODE_POINT =
  /[\u1100-\u115F\u2E80-\u303E\u3041-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE6F\uFF00-\uFF60\uFFE0-\uFFE6\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{20000}-\u{3FFFD}]/u;

export function visibleWidth(text: string): number {
  let width = 0;
  for (const char of text.replace(ANSI_FULL_REGEX, '')) {
    width += WIDE_CODE_POINT.test(char) ? 2 : 1;
  }
  return width;
}

/**
 * Make text safe for panel rows and cursor-diffed live surfaces: strip ANSI
 * escapes and C0 controls that would move the cursor or inject styling, and
 * normalize line breaks. Embedded tool output (child processes, bundler
 * diagnostics) is the usual source of these characters.
 */
export function sanitizeTerminalText(text: string): string {
  return normalizeStackTrace(
    text
      .replace(ANSI_FULL_REGEX, '')
      .replace(/\r\n?/g, '\n')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''),
  );
}

export type WrapMode = 'word' | 'char';

export function normalize(text: string): string {
  return text
    .replace(/\s*\r?\n\s*/g, '') // strip newlines and surrounding whitespace
    .replace(/[\uFEFF\xA0\t]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Like normalize(), but preserves the line structure: stack traces read as one
 * frame per line, so collapsing newlines would merge "at ..." frames into an
 * unreadable run-on line.
 */
export function normalizeStackTrace(text: string): string {
  return text
    .split(/\r?\n/)
    .map(line => line.replace(/[\uFEFF\xA0\t]/g, ' ').replace(/\s{2,}/g, ' ').trim())
    .filter(line => line !== '')
    .join('\n');
}

interface DisplayUnit {
  value: string;
  visible: number;
  whitespace: boolean;
}

function splitAnsiTokens(text: string): string[] {
  const tokens: string[] = [];
  let lastIndex = 0;
  ANSI_FULL_REGEX.lastIndex = 0;

  for (let match = ANSI_FULL_REGEX.exec(text); match !== null; match = ANSI_FULL_REGEX.exec(text)) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    tokens.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens;
}

function isAnsiToken(token: string): boolean {
  return token.startsWith('\x1b');
}

const SGR_SEQUENCE = /^\x1b\[([0-9;]*)m$/;

interface WrapEntry {
  /** SGR sequences that must be open when this character is emitted. */
  style: string[];
  char: string;
}

/**
 * Turn a source line into one entry per visible code point, carrying the
 * active SGR state forward so wrapped segments can reopen styles exactly.
 */
function buildWrapEntries(line: string): WrapEntry[] {
  const entries: WrapEntry[] = [];
  const active: string[] = [];

  for (const token of splitAnsiTokens(line)) {
    if (!isAnsiToken(token)) {
      for (const char of [...token]) {
        entries.push({ style: [...active], char });
      }
      continue;
    }

    const sgr = SGR_SEQUENCE.exec(token);
    if (!sgr) continue; // Non-style escapes are dropped; panels never need them.

    const codes = sgr[1].split(';').filter(Boolean);
    if (codes.length === 0 || codes.includes('0')) {
      active.length = 0;
      continue;
    }
    for (const code of codes) {
      const sequence = `\x1b[${code}m`;
      if (!active.includes(sequence)) active.push(sequence);
    }
  }

  return entries;
}

function renderWrapEntries(entries: WrapEntry[], openStyles: string[]): string {
  let output = '';
  let current: string[] = openStyles;

  for (const entry of entries) {
    const changed =
      current.length !== entry.style.length ||
      entry.style.some((sequence, index) => current[index] !== sequence);
    if (changed) {
      if (current.length > 0) output += '\x1b[0m';
      output += entry.style.join('');
      current = entry.style;
    }
    output += entry.char;
  }

  if (current.length > 0) output += '\x1b[0m';
  openStyles.length = 0;
  return output;
}

function findWordBoundary(entries: WrapEntry[], from: number): number {
  for (let index = from; index < entries.length; index++) {
    if (entries[index].char === ' ') return index + 1;
  }
  return -1;
}

/**
 * Wrap one logical line into segments that each fit `width` visible columns.
 * ANSI styling is carried across breaks (reopened on continuations, reset at
 * segment ends), word mode breaks at spaces and only hard-splits tokens that
 * cannot fit a line on their own, and continuation segments are prefixed with
 * `indentation` spaces. Existing newlines always start a new segment.
 */
export function wrapLine(
  text: string,
  width: number,
  indentation = 0,
  mode: WrapMode = 'char'
): string[] {
  const budget = Math.max(1, width);
  // Keep room for at least one visible character. A caller can request an
  // indentation wider than a narrow terminal, but wrapped rows must still
  // honour their width budget.
  const continuationIndent = ' '.repeat(
    Math.min(Math.max(0, indentation), Math.max(0, budget - 1)),
  );
  const continuationBudget = Math.max(1, budget - continuationIndent.length);
  const segments: string[] = [];

  for (const sourceLine of text.split('\n')) {
    const entries = buildWrapEntries(sourceLine);
    // Styles left open by a wrapped segment are reopened on its continuation,
    // but an explicit newline starts a new independently styled row.
    const openStyles: string[] = [];
    let emittedForLine = false;
    let current: WrapEntry[] = [];
    // Index within `current` where the last open word starts; -1 when the
    // line is one unbroken word so far.
    let wordStart = -1;

    const emitSegment = (head: WrapEntry[]): void => {
      const isFirst = !emittedForLine;
      const rendered = renderWrapEntries(head, openStyles);
      segments.push(isFirst ? rendered : continuationIndent + rendered);
      emittedForLine = true;
    };

    const flush = (cut: number): void => {
      let head = current.slice(0, cut);
      let remainder = current.slice(cut);
      emitSegment(head);
      // A hard-split remainder can itself exceed the continuation budget;
      // keep splitting so no continuation ever overflows the width.
      while (remainder.length > continuationBudget) {
        head = remainder.slice(0, continuationBudget);
        remainder = remainder.slice(continuationBudget);
        emitSegment(head);
      }
      current = remainder;
      wordStart = mode === 'word' ? findWordBoundary(current, 0) : -1;
    };

    if (entries.length === 0) {
      segments.push('');
      continue;
    }

    // The first output line must not break inside its own prefix: either its
    // existing leading indent, or the message column the caller will align
    // continuations to (step rows like `×  ERROR        message`).
    const leadingSpaces = entries.findIndex((entry) => entry.char !== ' ');
    const firstGuard =
      leadingSpaces === -1
        ? entries.length
        : leadingSpaces > 0
          ? leadingSpaces
          : Math.min(continuationIndent.length, budget - 1);

    for (const entry of entries) {
      if (current.length >= (emittedForLine ? continuationBudget : budget)) {
        const guard = emittedForLine ? continuationIndent.length : firstGuard;
        const cut =
          mode === 'word' && wordStart > guard ? wordStart : current.length;
        flush(cut);
      }
      current.push(entry);
      if (entry.char === ' ') wordStart = current.length;
    }

    if (current.length > 0 || !emittedForLine) {
      emitSegment(current);
    }
  }

  return segments;
}
