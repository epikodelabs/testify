import { toAscii, toConsoleSafe } from './ascii-sanitizer';
import { supportsEmoji } from './ansi-constants';

describe('ascii-sanitizer', () => {
  describe('toAscii', () => {
    it('translates Rolldown/Oxc frame glyphs to plain ASCII', () => {
      const frame =
        '   ╭─[ path.ts:1:10 ]\n' +
        '   │\n' +
        ' 1 │ import { Component } from "@angular/core";\n' +
        '   │          ────┬────\n' +
        '   │              ╰────── `Component` has already been declared here\n' +
        '───╯\n';

      expect(toAscii(frame)).toBe(
        '   +-[ path.ts:1:10 ]\n' +
        '   |\n' +
        ' 1 | import { Component } from "@angular/core";\n' +
        '   |          ----+----\n' +
        '   |              +------ `Component` has already been declared here\n' +
        '---+\n'
      );
    });

    it('leaves existing ASCII text untouched', () => {
      const text =
        'Build failed with 2 errors: ' +
        '[PARSE_ERROR] Identifier `Component` has already been declared';

      expect(toAscii(text)).toBe(text);
    });

    it('translates esbuild-style note separators, arrows, and ellipsis', () => {
      expect(toAscii('· → …')).toBe('. -> ...');
    });
  });

  describe('toConsoleSafe', () => {
    it('matches the SYMBOLS mode: keeps Unicode on TTY, ASCII elsewhere', () => {
      const frame = '   ╭─[ path.ts:1:10 ]';
      const expected = supportsEmoji() ? frame : '   +-[ path.ts:1:10 ]';

      expect(toConsoleSafe(frame)).toBe(expected);
    });
  });
});
