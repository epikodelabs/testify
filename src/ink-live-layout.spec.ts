import { startLiveTerminalView } from './ink-output';
import { ConsoleReporter } from './console-reporter';
import { ANSI_FULL_REGEX } from './utils';

/**
 * The live surfaces (PREPARING card, TEST RESULTS table) are ink Box panels —
 * "divs" — redrawn with cursor-up arithmetic. Their contract: size may change
 * freely between frames, but a panel must never shift vertically and must
 * never leave repeated lines behind. Byte-level tests prove what was sent;
 * this suite replays the same bytes through a small virtual terminal and
 * proves what the user actually sees on screen.
 */

const stripAnsi = (line: string): string => line.replace(ANSI_FULL_REGEX, '');

/** A minimal ANSI screen: the exact escape vocabulary the live writers use. */
class VirtualScreen {
  private lines: string[] = [''];
  private row = 0;
  private col = 0;
  private savedRow = 0;
  private savedCol = 0;
  private wrap = true;

  constructor(
    public viewportRows: number,
    private readonly width: number,
  ) {}

  /** First row of the visible window; cursor-up cannot go above it. */
  private get viewportTop(): number {
    return Math.max(0, this.lines.length - this.viewportRows);
  }

  write(data: string): void {
    let index = 0;
    while (index < data.length) {
      const char = data[index];
      if (char === '\x1b') {
        const match = /^\x1b(\[[0-?]*[ -/]*[@-~]|[A-Za-z0-9])/.exec(
          data.slice(index),
        );
        if (match) {
          this.applyEscape(match[0]);
          index += match[0].length;
          continue;
        }
        index += 1;
        continue;
      }
      if (char === '\r') {
        this.col = 0;
        index += 1;
        continue;
      }
      if (char === '\n') {
        // Windows console hosts and cooked Unix terminals treat LF as a line
        // break to column 0; that is the environment the live writers target.
        this.row += 1;
        this.col = 0;
        if (this.row >= this.lines.length) this.lines.push('');
        index += 1;
        continue;
      }
      this.putChar(char);
      index += 1;
    }
  }

  private putChar(char: string): void {
    if (this.col >= this.width) {
      // DECAWM off: the trailing character overwrites the last column and the
      // cursor stays on the same physical row.
      if (!this.wrap) {
        this.col = this.width - 1;
      } else {
        this.row += 1;
        if (this.row >= this.lines.length) this.lines.push('');
        this.col = 0;
      }
    }
    const line = this.lines[this.row];
    this.lines[this.row] =
      line.slice(0, this.col).padEnd(this.col, ' ') +
      char +
      line.slice(this.col + 1);
    this.col += 1;
  }

  private applyEscape(sequence: string): void {
    if (sequence === '\x1b[?7l') {
      this.wrap = false;
      return;
    }
    if (sequence === '\x1b[?7h') {
      this.wrap = true;
      return;
    }
    if (sequence === '\x1b[s') {
      this.savedRow = this.row;
      this.savedCol = this.col;
      return;
    }
    if (sequence === '\x1b[u') {
      this.row = this.savedRow;
      this.col = this.savedCol;
      return;
    }
    const csi = /^\x1b\[([0-9]*)([AJKC])$/.exec(sequence);
    if (!csi) return; // SGR and other sequences never move the cursor here.
    const count = csi[1] === '' ? 1 : parseInt(csi[1], 10);
    if (csi[2] === 'A') {
      this.row = Math.max(this.viewportTop, this.row - count);
      return;
    }
    if (csi[2] === 'C') {
      this.col = Math.min(this.width - 1, this.col + count);
      return;
    }
    if (csi[2] === 'K' && (csi[1] === '' || count === 2)) {
      this.lines[this.row] = '';
      return;
    }
    if (csi[2] === 'J' && (csi[1] === '' || count === 0)) {
      this.lines[this.row] = this.lines[this.row].slice(0, this.col);
      this.lines.length = this.row + 1;
    }
  }

  /** Visible rows, ANSI-stripped and right-trimmed. */
  visible(): string[] {
    return this.lines
      .slice(this.viewportTop)
      .map((line) => stripAnsi(line).replace(/\s+$/, ''));
  }
}

const assertNoRepeatedLines = (screen: string[]): void => {
  for (let index = 1; index < screen.length; index++) {
    const previous = screen[index - 1];
    const current = screen[index];
    if (previous !== '' && previous === current) {
      throw new Error(`repeated line at screen row ${index}: "${current}"`);
    }
  }
};

interface StdoutStub {
  restore(): void;
  setRows(rows: number): void;
}

const stubTtyStdout = (
  rows: number,
  sink: (chunk: string) => void,
): StdoutStub => {
  const originalWrite = Object.getOwnPropertyDescriptor(process.stdout, 'write');
  const originalRows = Object.getOwnPropertyDescriptor(process.stdout, 'rows');
  const originalIsTTY = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
  const originalColumns = Object.getOwnPropertyDescriptor(process.stdout, 'columns');
  const apply = (key: string, descriptor: PropertyDescriptor | undefined) => {
    if (descriptor) Object.defineProperty(process.stdout, key, descriptor);
    else delete (process.stdout as any)[key];
  };
  Object.defineProperty(process.stdout, 'write', {
    value: (chunk: unknown) => {
      sink(String(chunk));
      return true;
    },
    configurable: true,
    writable: true,
  });
  Object.defineProperty(process.stdout, 'rows', { value: rows, configurable: true });
  Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
  Object.defineProperty(process.stdout, 'columns', { value: 80, configurable: true });
  return {
    restore: () => {
      apply('write', originalWrite);
      apply('rows', originalRows);
      apply('isTTY', originalIsTTY);
      apply('columns', originalColumns);
    },
    setRows: (nextRows: number) => {
      Object.defineProperty(process.stdout, 'rows', {
        value: nextRows,
        configurable: true,
      });
    },
  };
};

describe('live panel layout replay', () => {
  describe('startLiveTerminalView on a virtual screen', () => {
    let writes: string[];
    let screen: VirtualScreen;
    let stub: StdoutStub;

    const replay = (): string[] => {
      for (const chunk of writes) screen.write(chunk);
      writes.length = 0;
      return screen.visible();
    };

    beforeEach(() => {
      writes = [];
      screen = new VirtualScreen(24, 80);
      stub = stubTtyStdout(24, (chunk) => writes.push(chunk));
    });

    afterEach(() => {
      stub.restore();
    });

    it('grows and shrinks without shifting vertically or repeating lines', () => {
      const frame = (body: string[]): string[] => [
        '╭── TEST RESULTS ──────╮',
        ...body,
        '╰──────────────────────╯',
      ];

      const view = startLiveTerminalView(frame(['suite-a ✓✓']).join('\n'));
      let visible = replay();
      const topRow = visible.findIndex((line) => line.startsWith('╭'));
      expect(topRow).toBe(0);

      // Same-height edit: no vertical movement, no duplication.
      expect(view.update(frame(['suite-a ✓✓✓']).join('\n'))).toBe(true);
      visible = replay();
      expect(visible.findIndex((line) => line.startsWith('╭'))).toBe(topRow);
      expect(visible.slice(0, 3)).toEqual(frame(['suite-a ✓✓✓']));

      // Dynamic growth from the bottom border: the top border must stay put.
      const grown = frame(['suite-a ✓✓✓', 'suite-b ✓', 'suite-c ✓✓']);
      expect(view.update(grown.join('\n'))).toBe(true);
      visible = replay();
      expect(visible.findIndex((line) => line.startsWith('╭'))).toBe(topRow);
      expect(visible.slice(0, grown.length)).toEqual(grown);

      // Shrink back: a full surface replacement still lands on the same row.
      const shrunk = frame(['suite-c ✓✓']);
      expect(view.update(shrunk.join('\n'))).toBe(true);
      visible = replay();
      expect(visible.findIndex((line) => line.startsWith('╭'))).toBe(topRow);
      expect(visible.slice(0, shrunk.length)).toEqual(shrunk);

      // Grow again.
      const regrown = frame(['suite-c ✓✓', 'suite-d ✓✓✓✓']);
      expect(view.update(regrown.join('\n'))).toBe(true);
      visible = replay();
      expect(visible.findIndex((line) => line.startsWith('╭'))).toBe(topRow);
      expect(visible.slice(0, regrown.length)).toEqual(regrown);

      assertNoRepeatedLines(visible);
      view.stop(true);
    });

    it('leaves exactly one panel behind when handing off to append-only output', () => {
      const view = startLiveTerminalView(
        ['╭── card ──╮', 'row', '╰──────────╯'].join('\n'),
      );
      replay();

      // Growth to exactly the viewport height is the abandonment trigger.
      const fullFrame = ['╭── card ──╮'];
      for (let index = 0; index < 22; index++) fullFrame.push(`row ${index}`);
      fullFrame.push('╰──────────╯');
      expect(view.update(fullFrame.join('\n'))).toBe(false);

      // The still-addressable frame was erased, so the caller's append-only
      // panel must be the only copy on screen. Production appends the frame
      // without a trailing newline (the bottom border stays at the cursor).
      expect(replay().some((line) => line.includes('row'))).toBe(false);
      process.stdout.write(fullFrame.join('\n'));
      const after = replay();
      assertNoRepeatedLines(after);
      expect(after.filter((line) => line.startsWith('╭')).length).toBe(1);
      expect(after.filter((line) => line === 'row 21').length).toBe(1);
    });

    it('neither rewrites nor duplicates a frame the viewport shrank beneath', () => {
      const view = startLiveTerminalView(
        ['╭── card ──╮', 'row one', 'row two', '╰──────────╯'].join('\n'),
      );
      replay();
      stub.setRows(2);
      screen.viewportRows = 2;

      expect(view.update('╭── card ──╮\nchanged\n╰──────────╯')).toBe(false);
      const visible = replay();
      // The frame's top rows are in scrollback: only its bottom border is
      // still on screen, followed by the fresh line handed to the caller.
      expect(visible).toEqual(['╰──────────╯', '']);
      assertNoRepeatedLines(visible);
      view.stop(false);
    });
  });

  describe('append-only TEST RESULTS table on a virtual screen', () => {
    const originalEnv = {
      FORCE_COLOR: process.env.FORCE_COLOR,
      NO_COLOR: process.env.NO_COLOR,
      NO_EMOJI: process.env.NO_EMOJI,
    };
    let stub: StdoutStub;
    let screen: VirtualScreen;
    let topBorderRow: number | null;

    const checkLayout = (stage: string): void => {
      const visible = screen.visible();
      assertNoRepeatedLines(visible);
      const titles = visible.filter((line) => line.includes('TEST RESULTS'));
      expect(titles.length).toBe(1);
      const currentTop = visible.findIndex((line) => line.startsWith('╭'));
      if (topBorderRow === null) {
        expect(currentTop).toBeGreaterThanOrEqual(0);
        topBorderRow = currentTop;
      } else if (currentTop !== topBorderRow) {
        throw new Error(
          `top border moved at ${stage}: ${topBorderRow} -> ${currentTop}`,
        );
      }
    };

    beforeEach(() => {
      process.env.FORCE_COLOR = '1';
      delete process.env.NO_COLOR;
      delete process.env.NO_EMOJI;
      screen = new VirtualScreen(40, 80);
      topBorderRow = null;
      stub = stubTtyStdout(40, (chunk) => screen.write(chunk));
    });

    afterEach(() => {
      stub.restore();
      for (const [key, value] of Object.entries(originalEnv)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    });

    it('appends suites and repaints the final table without duplicating rows', () => {
      const catalog = {
        suites: [1, 2, 3].map((index) => ({
          id: `suite-${index}`,
          description: `suite ${index}`,
          fullName: `suite ${index}`,
        })),
        specs: [1, 2, 3].flatMap((index) =>
          [1, 2].map((specIndex) => ({
            id: `suite-${index}-spec-${specIndex}`,
            description: `spec ${specIndex}`,
            fullName: `suite ${index} spec ${specIndex}`,
            suiteId: `suite-${index}`,
          })),
        ),
      };

      const reporter = new ConsoleReporter({ showColors: true });
      reporter.setCatalog(catalog);
      reporter.jasmineStarted({
        totalSpecsDefined: catalog.specs.length,
        order: { random: false },
      });
      checkLayout('jasmineStarted');

      for (const suite of catalog.suites) {
        reporter.suiteStarted(suite);
        for (const spec of catalog.specs.filter(
          (entry) => entry.suiteId === suite.id,
        )) {
          reporter.specStarted(spec);
          reporter.specDone({ ...spec, status: 'passed', duration: 1 });
          checkLayout(`specDone ${spec.id}`);
        }
        reporter.suiteDone(suite);
        checkLayout(`suiteDone ${suite.id}`);
      }

      // Every suite row is visible exactly once while the table grows.
      const visible = screen.visible();
      for (const suite of catalog.suites) {
        expect(
          visible.filter((line) => line.includes(suite.description)).length,
        ).toBe(1);
      }

      reporter.jasmineDone({ overallStatus: 'passed', totalTime: 6 });
      checkLayout('jasmineDone');

      // The repaint erased the live frame, so the pinned progress row must be
      // gone rather than stranded mid-panel, and the summary appended once.
      const final = screen.visible();
      expect(final.join('\n')).toContain('TEST SUMMARY');
      expect(final.join('\n')).toContain('finished in');
      expect(final.join('\n')).not.toContain('PROGRESS');
      assertNoRepeatedLines(final);
    });
  });
});
