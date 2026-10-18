import { getTestifyVersion as getInstalledTestifyVersion } from './testify-version';
import { getMaxWidth, isAnsiMode, supportsColor } from './ansi-constants';

// ─── TESTIFY console wordmark ────────────────────────────────
// Big letters drawn from a 5x5 pixel font, one terminal cell per
// on-pixel (doubled horizontally so the letters keep cell proportions),
// filled left-to-right with a truecolor gradient.

const TESTIFY_CAPTION = [
  '████████╗███████╗███████╗████████╗██╗███████╗██╗   ██╗',
  '╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██║██╔════╝╚██╗ ██╔╝',
  '   ██║   █████╗  ███████╗   ██║   ██║█████╗   ╚████╔╝ ',
  '   ██║   ██╔══╝  ╚════██║   ██║   ██║██╔══╝    ╚██╔╝  ',
  '   ██║   ███████╗███████║   ██║   ██║██║        ██║   ',
  '   ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚═╝╚═╝        ╚═╝   ',
] as const;

/**
 * A single cool-to-warm spectrum shared by the TESTIFY wordmark and its
 * version: cyan → emerald → yellow → orange → red.
 */
const GRADIENT_STOPS: ReadonlyArray<readonly [number, number, number]> = [
  [34, 211, 238],
  [52, 211, 153],
  [250, 204, 21],
  [249, 115, 22],
  [239, 68, 68],
];

function gradientRgb(progress: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, progress));
  const scaled = clamped * (GRADIENT_STOPS.length - 1);
  const index = Math.min(GRADIENT_STOPS.length - 2, Math.floor(scaled));
  const local = scaled - index;
  const from = GRADIENT_STOPS[index];
  const to = GRADIENT_STOPS[index + 1];

  return [
    Math.round(from[0] + (to[0] - from[0]) * local),
    Math.round(from[1] + (to[1] - from[1]) * local),
    Math.round(from[2] + (to[2] - from[2]) * local),
  ];
}

/**
 * Renders the TESTIFY wordmark as large gradient-filled, italic-slanted
 * block letters: every row shifts one cell-column right of the row below,
 * shearing the letters the way italics lean. Terminals without color (or in
 * --ansi mode) get plain ASCII hash cells; narrow terminals drop to
 * single-width cells, and a terminal too narrow for even those gets an
 * empty string so callers can skip the banner.
 */
export function renderTestifyConsoleBanner(
  gradientWidth?: number,
  availableWidth = getMaxWidth() - 2,
): string {
  const maxWidth = availableWidth;
  const widestLine = Math.max(...TESTIFY_CAPTION.map((line) => line.length));
  if (widestLine > maxWidth) return '';
  if (!supportsColor() || isAnsiMode()) return TESTIFY_CAPTION.join('\n');

  return TESTIFY_CAPTION.map((line) => {
    let rendered = '';
    for (let column = 0; column < line.length; column++) {
      const character = line[column];
      if (character === ' ') {
        rendered += character;
        continue;
      }
      const [r, g, b] = gradientRgb(
        column / Math.max(1, (gradientWidth ?? widestLine) - 1),
      );
      rendered += `\x1b[38;2;${r};${g};${b}m${character}`;
    }
    return `${rendered}\x1b[0m`;
  }).join('\n');
}

function getTestifyVersion(): string {
  return getInstalledTestifyVersion().replace(/^v/, '');
}

function formatCaptionVersion(version: string): string {
  const finalSegment = version.trim().split('.').at(-1);
  return `v${finalSegment || version}`;
}

const VERSION_GLYPHS: Record<string, readonly string[]> = {
  // The lowercase v has a blank cap row, making its lower x-height explicit
  // while preserving the shared six-row canvas of the version banner.
  v: ['         ', '██╗   ██╗', '██║   ██║', '╚██╗ ██╔╝', ' ╚████╔╝ ', '  ╚═══╝  '],
  0: [' ██████╗', '██╔═══██╗', '██║   ██║', '██║   ██║', '╚██████╔╝', ' ╚═════╝ '],
  1: ['     ██╗', '    ███║', '    ╚██║', '     ██║', '     ██║', '     ╚═╝'],
  2: ['██████╗ ', '╚════██╗', ' █████╔╝', '██╔═══╝ ', '███████╗', '╚══════╝'],
  3: ['██████╗ ', '╚════██╗', ' █████╔╝', ' ╚═══██╗', '██████╔╝', '╚═════╝ '],
  4: ['██╗  ██╗', '██║  ██║', '███████║', '╚════██║', '     ██║', '     ╚═╝'],
  5: ['███████╗', '██╔════╝', '███████╗', '╚════██║', '███████║', '╚══════╝'],
  6: [' ██████╗', '██╔════╝', '███████╗', '██╔═══██╗', '╚██████╔╝', ' ╚═════╝ '],
  7: ['███████╗', '╚════██║', '    ██╔╝', '   ██╔╝ ', '   ██║  ', '   ╚═╝  '],
  8: [' █████╗ ', '██╔══██╗', '╚█████╔╝', '██╔══██╗', '╚█████╔╝', ' ╚════╝ '],
  9: [' █████╗ ', '██╔══██╗', '╚██████║', ' ╚═══██║', ' █████╔╝', ' ╚════╝ '],
};

const VERSION_INDENT = '        ';
let consoleBannerPrinted = false;

export function hasPrintedTestifyConsoleBanner(): boolean {
  return consoleBannerPrinted;
}

function versionGlyphWidth(character: string): number {
  const glyph = VERSION_GLYPHS[character];
  return glyph ? Math.max(...glyph.map((line) => line.length)) : character.length;
}

function versionDisplayWidth(version: string): number {
  return [...version].reduce((width, character) => width + versionGlyphWidth(character), 0);
}

function colorizeCaptionText(
  text: string,
  gradientOffset: number,
  gradientWidth: number,
): string {
  if (!supportsColor() || isAnsiMode()) return text;
  return [...text].map((character, index) => {
    if (character === ' ') return character;
    const [r, g, b] = gradientRgb(
      (gradientOffset + index) / Math.max(1, gradientWidth - 1),
    );
    return `\x1b[38;2;${r};${g};${b}m${character}`;
  }).join('') + '\x1b[0m';
}

function renderCaptionVersionFrame(
  version: string,
  gradientOffset: number,
  gradientWidth: number,
): string[] {
  const glyphs = [...version].map((character) => VERSION_GLYPHS[character]);
  if (glyphs.some((glyph) => !glyph)) return [version];

  return Array.from({ length: 6 }, (_, row) => {
    const content = glyphs
      .map((glyph) => glyph![row])
      .join('');
    return colorizeCaptionText(
      `${VERSION_INDENT}${content}`,
      gradientOffset,
      gradientWidth,
    );
  });
}

/**
 * Prints the wordmark followed by the installed version. It is intentionally
 * limited to interactive rich terminals so redirected output stays plain.
 */
export interface ConsoleBannerPrintOptions {
  version?: string;
  write?: (text: string) => void;
}

export function renderTestifyConsoleBannerForWidth(
  version: string,
  availableWidth: number,
): string {
  const captionBaselineWidth = Math.max(...TESTIFY_CAPTION.map((line) => line.length));
  if (availableWidth < captionBaselineWidth) return '';

  const formattedVersion = formatCaptionVersion(version);
  const versionOffset = captionBaselineWidth + VERSION_INDENT.length;
  const fullWidth = versionOffset + versionDisplayWidth(formattedVersion);

  // Prefer the complete wordmark. When only the version would make it wrap,
  // retain the TESTIFY caption rather than dropping the whole banner.
  if (fullWidth > availableWidth) {
    return renderTestifyConsoleBanner(captionBaselineWidth, availableWidth);
  }

  const banner = renderTestifyConsoleBanner(fullWidth, availableWidth);
  if (!banner) return '';

  const versionLines = renderCaptionVersionFrame(
    formattedVersion,
    captionBaselineWidth,
    fullWidth,
  );
  const captionLines = banner.split('\n');
  return captionLines.map((line, index) => (
    `${line}${' '.repeat(captionBaselineWidth - TESTIFY_CAPTION[index].length)}${versionLines[index] ?? ''}`
  )).join('\n');
}

export async function printTestifyConsoleBanner(
  options: ConsoleBannerPrintOptions = {},
): Promise<boolean> {
  if (consoleBannerPrinted) return false;
  if (!process.stdout.isTTY || isAnsiMode()) return false;

  const content = renderTestifyConsoleBannerForWidth(
    options.version ?? getTestifyVersion(),
    getMaxWidth() - 2,
  );
  if (!content) return false;

  const write = options.write ?? ((text: string) => process.stdout.write(text));
  // Do not leave a saved cursor position behind: the live results table owns
  // cursor movement while tests run. A single append-only write avoids its
  // redraws restoring into the banner and duplicating it in scrollback.
  write(`\n${content}\n\n`);
  consoleBannerPrinted = true;
  return true;
}
