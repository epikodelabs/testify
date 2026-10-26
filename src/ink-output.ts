import { createElement } from 'react';
import { Box, renderToString, Text } from 'ink';
import { getMaxWidth, supportsColor } from './ansi-constants';
import { visibleWidth, wrapLine } from './utils';

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

/**
 * Usable text width inside a full-width panel. Ink's `width` includes the
 * border pair and one cell of horizontal padding on each side, so a row wider
 * than this budget wraps and its overflow lands on a second visual row that
 * row-by-row consumers (the live result table) never read.
 */
export function panelContentWidth(): number {
  return Math.max(1, getMaxWidth() - 11);
}

/**
 * Column where a panel row's message starts, so wrapped continuations align
 * under it instead of hugging the border. Step rows look like
 * `×  ERROR        message`; already-indented rows keep their own indent;
 * anything else falls back to a small fixed gutter.
 */
function rowContinuationIndent(line: string): number {
  const clean = line.replace(ANSI_ESCAPE, '');
  const prefix = /^\S+\s{2,}\S{1,12}\s+/.exec(clean);
  if (prefix) return prefix[0].length;
  const leading = /^ +/.exec(clean);
  return leading ? leading[0].length : 3;
}

/**
 * Pre-wrap panel rows to the renderer's content budget. Ink would otherwise
 * wrap overflowing rows at arbitrary token boundaries with no hanging indent,
 * which shreds multi-line build diagnostics (nested error frames included)
 * and desynchronizes row-based live redraws. The plain renderer wraps at its
 * own inner width, which is wider than Ink's (it has no padding cells).
 */
function wrapPanelRows(lines: readonly string[], budget: number): string[] {
  const contentWidth = Math.max(1, budget);
  return lines.flatMap((line) =>
    line === PANEL_RULE
      ? [line]
      : wrapLine(line, contentWidth, rowContinuationIndent(line), 'word'),
  );
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
  const row = (value: string) =>
    `| ${value}${' '.repeat(Math.max(0, innerWidth - visibleWidth(value)))} |`;

  return [
    border,
    row(title),
    ...wrapPanelRows(lines, innerWidth)
      .map((line) => (line === PANEL_RULE ? rule : row(line.replace(ANSI_ESCAPE, '')))),
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
        // Ink's declared width includes the border differently from our plain
        // renderer. Reserve a full five-cell margin so the right border never
        // autowraps and invalidates cursor-up live footer updates.
        ...(fullWidth ? { width: getMaxWidth() - 7 } : {}),
      },
      createElement(Text, { bold: true, color: tone }, title),
      ...wrapPanelRows(lines, panelContentWidth()).map((line, index) =>
        createElement(Text, { key: index }, line),
      ),
    ),
    { columns: getMaxWidth() },
  );

  const renderedLines = rendered.split('\n');
  const panelWidth = Math.max(
    4,
    ...renderedLines.map((line) => visibleWidth(line)),
  );
  const connectedRule = renderTerminalText(
    `├${'─'.repeat(Math.max(1, panelWidth - 2))}┤`,
    { color: tone },
  );
  return renderedLines
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
const DISABLE_AUTO_WRAP = '\x1b[?7l';
const ENABLE_AUTO_WRAP = '\x1b[?7h';

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

  // Every view write happens with auto-wrap (DECAWM) disabled and is restored
  // before the write returns. When the reported terminal width overstates the
  // real one — a Windows console whose buffer stays wider than its window
  // after a resize — a row's trailing character lands on the physical last
  // column. With wrapping enabled the cursor then advances an extra physical
  // line per row, so the `\r` + cursor-up arithmetic below counts from rows
  // that only exist on screen: successive frames interleave instead of
  // replacing, stranding step rows and duplicate borders mid-panel. Disabled,
  // the trailing character simply overwrites the last column, each logical
  // row occupies exactly one physical line, and the redraw arithmetic stays
  // honest. Explicit `\r\n` separators keep every row starting at column 0,
  // which LF alone does not guarantee while wrapping is off. Restoring wrap
  // between writes means output from other writers keeps its normal wrapping.
  const writeFrame = (text: string): void => {
    process.stdout.write(
      DISABLE_AUTO_WRAP + '\r' + text.split('\n').join('\r\n') + ENABLE_AUTO_WRAP,
    );
  };

  writeFrame(initialText);

  const replaceSurface = (nextText: string, nextLines: string[]) => {
    const up = Math.max(0, previousLines.length - 1);
    process.stdout.write(
      `\r${cursorUp(up)}\x1b[J`,
    );
    writeFrame(nextText);
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
            DISABLE_AUTO_WRAP +
              `\r${CLEAR_LINE}\r${addedLines.join('\r\n')}\r\n${nextLines[nextLines.length - 1]}` +
              ENABLE_AUTO_WRAP,
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
        process.stdout.write(DISABLE_AUTO_WRAP + output + ENABLE_AUTO_WRAP);
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
