import {
  printTestifyConsoleBanner,
  renderTestifyConsoleBanner,
  renderTestifyConsoleBannerForWidth,
} from './console-banner';
import { ANSI_FULL_REGEX } from './ansi-constants';

describe('renderTestifyConsoleBanner', () => {
  const originalColumns = Object.getOwnPropertyDescriptor(process.stdout, 'columns');
  const originalIsTTY = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
  const originalNoColor = process.env.NO_COLOR;

  afterEach(() => {
    delete process.env.FORCE_COLOR;
    if (originalNoColor === undefined) delete process.env.NO_COLOR;
    else process.env.NO_COLOR = originalNoColor;
    if (originalColumns) {
      Object.defineProperty(process.stdout, 'columns', originalColumns);
    } else {
      delete (process.stdout as { columns?: number }).columns;
    }
    if (originalIsTTY) {
      Object.defineProperty(process.stdout, 'isTTY', originalIsTTY);
    } else {
      delete (process.stdout as { isTTY?: boolean }).isTTY;
    }
  });

  it('draws the six-row block caption without color support', () => {
    Object.defineProperty(process.stdout, 'isTTY', {
      value: false,
      configurable: true,
    });

    const banner = renderTestifyConsoleBanner();

    const lines = banner.split('\n');
    expect(lines).toHaveSize(6);
    expect(lines[0]).toContain('████████╗');
    expect(lines[5]).toContain('╚══════╝');
  });

  it('fills the letters with truecolor gradient escapes when color is forced', () => {
    process.env.FORCE_COLOR = '1';
    delete process.env.NO_COLOR;
    Object.defineProperty(process.stdout, 'columns', {
      value: 120,
      configurable: true,
    });

    const banner = renderTestifyConsoleBanner();

    expect(banner).toContain('\x1b[38;2;');
    expect(banner.split('\n')).toHaveSize(6);

    // The gradient starts at its first stop (cyan 34, 211, 238).
    expect(banner).toContain('\x1b[38;2;34;211;238m');
  });

  it('returns an empty string when the terminal is too narrow', () => {
    Object.defineProperty(process.stdout, 'columns', {
      value: 40,
      configurable: true,
    });

    expect(renderTestifyConsoleBanner()).toBe('');
  });

  it('drops the version before dropping the caption as terminal width shrinks', () => {
    const full = renderTestifyConsoleBannerForWidth('1.2.3', 120)
      .replace(ANSI_FULL_REGEX, '');
    const captionOnly = renderTestifyConsoleBannerForWidth('1.2.3', 70)
      .replace(ANSI_FULL_REGEX, '');
    const suppressed = renderTestifyConsoleBannerForWidth('1.2.3', 40);

    expect(full).toContain('██████╗');
    expect(full.split('\n')).toHaveSize(6);
    expect(captionOnly).toContain('████████╗');
    expect(Math.max(...captionOnly.split('\n').map((line) => line.length))).toBeLessThan(70);
    expect(captionOnly.split('\n')).toHaveSize(6);
    expect(suppressed).toBe('');
  });

  it('prints the complete caption and version only once without cursor controls', async () => {
    Object.defineProperty(process.stdout, 'isTTY', {
      value: true,
      configurable: true,
    });
    Object.defineProperty(process.stdout, 'columns', {
      value: 120,
      configurable: true,
    });

    const writes: string[] = [];
    const shown = await printTestifyConsoleBanner({
      version: '1.2.3',
      write: (text) => writes.push(text),
    });
    const duplicate = await printTestifyConsoleBanner({
      version: '1.2.3',
      write: (text) => writes.push(text),
    });

    expect(shown).toBeTrue();
    expect(duplicate).toBeFalse();
    expect(writes).toHaveSize(1);
    expect(writes[0]).not.toContain('\x1b[s');
    expect(writes[0]).not.toContain('\x1b[u');
    const lines = writes[0].replace(ANSI_FULL_REGEX, '').trim().split('\n');
    expect(lines).toHaveSize(6);
    expect(lines[0]).toContain('██████╗');
    expect(lines.at(-1)).toContain('╚═══╝');
  });
});
