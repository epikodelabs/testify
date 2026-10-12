import { visibleWidth, wrapLine } from './utils';

describe('wrapLine', () => {
  describe('char mode', () => {
    it('hard-wraps at the exact visible width', () => {
      expect(wrapLine('abcdefghij', 4)).toEqual(['abcd', 'efgh', 'ij']);
    });

    it('keeps ANSI styling out of the width budget', () => {
      const segments = wrapLine('\x1b[31mabcdefghij\x1b[0m', 4);
      expect(segments.map((segment) => visibleWidth(segment))).toEqual([4, 4, 2]);
    });

    it('carries active styles into continuation segments', () => {
      const segments = wrapLine('\x1b[31mabcdefghij\x1b[0m', 4);
      expect(segments[1]).toContain('\x1b[31m');
      expect(segments[2]).toContain('\x1b[31m');
      expect(segments[2].endsWith('\x1b[0m')).toBeTrue();
    });
  });

  describe('line structure', () => {
    it('treats existing newlines as segment boundaries', () => {
      expect(wrapLine('ab\ncd', 10)).toEqual(['ab', 'cd']);
    });

    it('does not indent a row following an explicit newline', () => {
      expect(wrapLine('ab\ncd', 10, 4)).toEqual(['ab', 'cd']);
    });

    it('preserves blank lines', () => {
      expect(wrapLine('a\n\nb', 10)).toEqual(['a', '', 'b']);
    });

    it('returns one empty segment for empty input', () => {
      expect(wrapLine('', 10)).toEqual(['']);
    });
  });

  describe('word mode', () => {
    it('breaks at spaces instead of mid-token', () => {
      const segments = wrapLine('alpha beta gamma', 8, 0, 'word');
      expect(segments.map((segment) => segment.trim()).join(' '))
        .toBe('alpha beta gamma');
      segments.forEach((segment) => {
        expect(visibleWidth(segment)).toBeLessThanOrEqual(8);
      });
    });

    it('hard-splits tokens that cannot fit one line, indenting continuations', () => {
      const path = 'projects/libraries/streamix/vue/index.ts';
      const segments = wrapLine(path, 12, 4, 'word');

      expect(segments[0]).toBe('projects/lib');
      segments.forEach((segment) => {
        expect(visibleWidth(segment)).toBeLessThanOrEqual(12);
      });
      segments.slice(1).forEach((segment) => {
        expect(segment.startsWith('    ')).toBeTrue();
      });
      expect(segments.map((segment) => segment.replace(/^ +/, '')).join(''))
        .toBe(path);
    });

    it('caps indentation so narrow rows still fit their width budget', () => {
      const segments = wrapLine('abcd', 2, 4, 'word');
      segments.forEach((segment) => {
        expect(visibleWidth(segment)).toBeLessThanOrEqual(2);
      });
    });

    it('aligns continuations under already-indented rows', () => {
      const segments = wrapLine('    value that continues on', 16, 4, 'word');
      expect(segments[0]).toBe('    value that ');
      segments.slice(1).forEach((segment) => {
        expect(segment.startsWith('    ')).toBeTrue();
        expect(visibleWidth(segment)).toBeLessThanOrEqual(16);
      });
    });

    it('does not break inside a step-row label prefix', () => {
      const segments = wrapLine('×  ERROR        [BUILD] message text continues', 24, 16, 'word');
      expect(segments[0].startsWith('×  ERROR')).toBeTrue();
      segments.slice(1).forEach((segment) => {
        expect(segment.startsWith(' '.repeat(16))).toBeTrue();
        expect(visibleWidth(segment)).toBeLessThanOrEqual(24);
      });
    });
  });
});
