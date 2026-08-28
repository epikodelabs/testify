// ─── ASCII fallback for embedded tool diagnostics ─────────────────────────
// Bundlers/parsers (Rolldown, Oxc, esbuild) render their error frames with
// Unicode box-drawing characters:
//
//   ╭─[ path.ts:1:10 ]
//   │          ────┬────
//   │              ╰────── Identifier `X` has already been declared
// ───╯
//
// On consoles whose output code page is a legacy single-byte encoding (e.g.
// the Cyrillic OEM code page CP866 found on Russian/Ukrainian Windows),
// those UTF-8 glyphs are decoded byte-by-byte and come out as mojibake
// (тФВ тХнтФА ...). To keep diagnostics readable everywhere, translate the
// frame glyphs to plain ASCII whenever testify is not rendering to a
// Unicode-capable TTY. This mirrors how `SYMBOLS` already falls back to
// `ANSI_SYMBOLS` in the same situations: piped (non-TTY) output, `--ansi`
// mode, or `NO_EMOJI`.
import { supportsEmoji } from './ansi-constants';

const ASCII_TRANSLATIONS: ReadonlyArray<readonly [RegExp, string]> = [
  // Vertical box-drawing → pipe
  [/[│┃║]/g, '|'],
  // Single horizontal box-drawing → dash
  [/[─┄┈]/g, '-'],
  // Double horizontal → equals
  [/═/g, '='],
  // Corners, junctions, and round caps → plus
  [/[┌┐└┘├┤┼┬┴╭╮╰╯╔╗╚╝╠╣╦╩╬╪]/g, '+'],
  // Arrows used by diagnostics/notes
  [/[→↳⇒↦]/g, '->'],
  // Note separator used by esbuild-style frames
  [/·/g, '.'],
  // Ellipsis
  [/…/g, '...'],
];

/**
 * Translates Unicode box-drawing glyphs (and a few other common fancy
 * characters) in a message to plain ASCII equivalents. Purely functional;
 * callers decide when it applies.
 */
export function toAscii(message: string): string {
  let result = message;
  for (const [pattern, replacement] of ASCII_TRANSLATIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Returns the message unchanged when the environment renders Unicode
 * (TTY in normal mode), otherwise falls back to the ASCII translation.
 */
export function toConsoleSafe(message: string): string {
  if (supportsEmoji()) return message;
  return toAscii(message);
}
