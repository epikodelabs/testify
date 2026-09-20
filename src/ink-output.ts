import { createElement } from 'react';
import { Box, renderToString, Text } from 'ink';
import { getMaxWidth, supportsColor } from './ansi-constants';
import { visibleWidth } from './utils';

const ANSI_ESCAPE = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;

/** Marks a panel row that should replace, rather than sit inside, side borders. */
export const PANEL_RULE = '\uE000';

/** The presentation boundary for synchronous Node terminal output. */
export interface InkTextStyle {
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
  dimColor?: boolean;
}

const FOREGROUND: Readonly<Record<string, number>> = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  gray: 90,
  grey: 90,
  blackBright: 90,
  redBright: 91,
  greenBright: 92,
  yellowBright: 93,
  blueBright: 94,
  magentaBright: 95,
  cyanBright: 96,
  whiteBright: 97,
};

const BACKGROUND: Readonly<Record<string, number>> = {
  black: 40,
  red: 41,
  green: 42,
  yellow: 43,
  blue: 44,
  magenta: 45,
  cyan: 46,
  white: 47,
  gray: 100,
  grey: 100,
  blackBright: 100,
  redBright: 101,
  greenBright: 102,
  yellowBright: 103,
  blueBright: 104,
  magentaBright: 105,
  cyanBright: 106,
  whiteBright: 107,
};

/**
 * Style a terminal fragment without spinning up an Ink/React render tree.
 * Panels and live surfaces still belong to Ink; tiny fragments use ANSI
 * directly because reporters may style hundreds of them per test run.
 */
export function renderTerminalText(
  text: string,
  style: InkTextStyle = {},
): string {
  if (!text || !supportsColor()) return text;

  const codes: number[] = [];
  if (style.bold) codes.push(1);
  if (style.dimColor) codes.push(2);
  if (style.color && FOREGROUND[style.color] !== undefined) {
    codes.push(FOREGROUND[style.color]);
  }
  if (style.backgroundColor && BACKGROUND[style.backgroundColor] !== undefined) {
    codes.push(BACKGROUND[style.backgroundColor]);
  }

  return codes.length > 0
    ? `\x1b[${codes.join(';')}m${text}\x1b[0m`
    : text;
}

function renderPlainPanel(
  title: string,
  lines: readonly string[],
  fullWidth = false,
): string {
  const maxWidth = Math.max(24, getMaxWidth());
  const contentWidth = Math.max(
    visibleWidth(title),
    ...lines.filter((line) => line !== PANEL_RULE).map((line) => visibleWidth(line)),
  );
  // Keep a small right margin for a live panel. Some Windows terminals wrap
  // a box border at (or very near) the final column, which shifts a
  // subsequent cursor-based redraw down and leaves duplicate borders behind.
  const innerWidth = fullWidth
    ? maxWidth - 7
    : Math.min(Math.max(contentWidth, visibleWidth(title)), maxWidth - 4);
  const border = `+${'-'.repeat(innerWidth + 2)}+`;
  const rule = `+${'-'.repeat(innerWidth + 2)}+`;
  const row = (value: string) => {
    const clean = value.replace(ANSI_ESCAPE, '');
    const clipped = visibleWidth(clean) > innerWidth
      ? `${clean.slice(0, Math.max(0, innerWidth - 3))}...`
      : clean;
    return `| ${clipped}${' '.repeat(Math.max(0, innerWidth - visibleWidth(clipped)))} |`;
  };

  return [
    border,
    row(title),
    ...lines.map((line) => line === PANEL_RULE ? rule : row(line)),
    border,
  ].join('\n');
}

/** A compact Ink panel used for reporter milestones and result summaries. */
export function renderTerminalPanel(
  title: string,
  lines: readonly string[],
  tone: string = 'cyan',
  rich = supportsColor(),
  fullWidth = true,
): string {
  if (!rich || !supportsColor()) return renderPlainPanel(title, lines, fullWidth);

  const rendered = renderToString(
    createElement(
      Box,
      {
        borderStyle: 'round',
        borderColor: tone,
        flexDirection: 'column',
        paddingX: 1,
        ...(fullWidth ? { width: getMaxWidth() - 3 } : {}),
      },
      createElement(Text, { bold: true, color: tone }, title),
      ...lines.map((line, index) =>
        createElement(Text, { key: index }, line),
      ),
    ),
    { columns: getMaxWidth() },
  );

  const connectedRule = renderTerminalText(
    `├${'─'.repeat(Math.max(1, getMaxWidth() - 2))}┤`,
    { color: tone },
  );
  return rendered
    .split('\n')
    .map((line) => line.includes(PANEL_RULE) ? connectedRule : line)
    .join('\n');
}

/** A small persistent terminal surface for reporter-owned live output. */
export interface LiveTerminalView {
  update(text: string): void;
  replace(text: string): void;
  stop(preserve?: boolean): void;
}

const CURSOR_SAVE = '\x1b[s';
const CURSOR_RESTORE = '\x1b[u';
const CLEAR_LINE = '\x1b[2K';

function cursorUp(lines: number): string {
  return lines > 0 ? `\x1b[${lines}A` : '';
}

function moveRight(columns: number): string {
  return columns > 0 ? `\x1b[${columns}C` : '';
}

/**
 * Keeps a rendered panel on screen without asking Ink/React to reconcile the
 * entire tree for every spec result. Same-height updates are diffed by row.
 * When a row only grows (the common suite-glyph case), only the appended
 * suffix is written. Other changed rows are replaced in place. A structural
 * height change falls back to replacing the live surface once.
 */
export function startLiveTerminalView(initialText: string): LiveTerminalView {
  let previousText = initialText;
  let previousLines = initialText.split('\n');
  process.stdout.write(initialText);

  const replaceSurface = (nextText: string, nextLines: string[]) => {
    const up = Math.max(0, previousLines.length - 1);
    process.stdout.write(
      `\r${cursorUp(up)}\x1b[J${nextText}`,
    );
    previousText = nextText;
    previousLines = nextLines;
  };

  return {
    update: (nextText) => {
      if (nextText === previousText) return;

      const nextLines = nextText.split('\n');
      if (nextLines.length !== previousLines.length) {
        // A panel which only gains body rows can grow from its bottom border.
        // This is both cheaper and more reliable on Windows terminals than
        // repainting upward from a cursor whose wrapped-row position varies.
        const sharedHeaderLength = previousLines.length - 1;
        const growsFromBottom =
          nextLines.length > previousLines.length &&
          previousLines.slice(0, sharedHeaderLength).every(
            (line, index) => line === nextLines[index],
          ) &&
          previousLines[previousLines.length - 1] === nextLines[nextLines.length - 1];

        if (growsFromBottom) {
          const addedLines = nextLines.slice(sharedHeaderLength, -1);
          process.stdout.write(
            `\r${CLEAR_LINE}\r${addedLines.join('\n')}\n${nextLines[nextLines.length - 1]}`,
          );
          previousText = nextText;
          previousLines = nextLines;
          return;
        }
        replaceSurface(nextText, nextLines);
        return;
      }

      const lastLineIndex = previousLines.length - 1;
      let output = CURSOR_SAVE;
      let changed = false;

      for (let index = 0; index < nextLines.length; index++) {
        const previous = previousLines[index];
        const next = nextLines[index];
        if (previous === next) continue;

        changed = true;
        output += CURSOR_RESTORE;
        output += `\r${cursorUp(lastLineIndex - index)}`;

        if (next.startsWith(previous)) {
          output += moveRight(visibleWidth(previous));
          output += next.slice(previous.length);
        } else {
          output += `${CLEAR_LINE}\r${next}`;
        }
      }

      if (changed) {
        output += CURSOR_RESTORE;
        process.stdout.write(output);
      }

      previousText = nextText;
      previousLines = nextLines;
    },
    replace: (nextText) => replaceSurface(nextText, nextText.split('\n')),
    stop: (preserve = false) => {
      if (!preserve) {
        const up = Math.max(0, previousLines.length - 1);
        process.stdout.write(`\r${cursorUp(up)}\x1b[J`);
      }
    },
  };
}
