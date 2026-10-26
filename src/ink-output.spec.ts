import { startLiveTerminalView } from './ink-output';

const DISABLE_AUTO_WRAP = '\x1b[?7l';
const ENABLE_AUTO_WRAP = '\x1b[?7h';

describe('startLiveTerminalView', () => {
  let writes: string[];
  let originalWrite: PropertyDescriptor | undefined;
  let originalRows: PropertyDescriptor | undefined;

  beforeEach(() => {
    writes = [];
    originalWrite = Object.getOwnPropertyDescriptor(process.stdout, 'write');
    originalRows = Object.getOwnPropertyDescriptor(process.stdout, 'rows');
    Object.defineProperty(process.stdout, 'write', {
      value: ((chunk: unknown) => {
        writes.push(String(chunk));
        return true;
      }),
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    if (originalWrite) Object.defineProperty(process.stdout, 'write', originalWrite);
    else delete (process.stdout as { write?: unknown }).write;
    if (originalRows) Object.defineProperty(process.stdout, 'rows', originalRows);
    else delete (process.stdout as { rows?: number }).rows;
  });

  const setRows = (rows?: number): void => {
    Object.defineProperty(process.stdout, 'rows', { value: rows, configurable: true });
  };

  const emitted = () => writes.join('');

  it('writes the initial frame with auto-wrap disabled and CR LF row separators', () => {
    const view = startLiveTerminalView('top\nmid\nbottom');
    // The row contents are written inside the `?7l` window; wrapping is
    // re-enabled before the write returns so other writers keep DECAWM.
    expect(emitted()).toBe(`${DISABLE_AUTO_WRAP}\rtop\r\nmid\r\nbottom${ENABLE_AUTO_WRAP}`);
    view.stop(true);
  });

  it('re-enables auto-wrap around same-height row edits', () => {
    const view = startLiveTerminalView('a\nb\nc');
    writes.length = 0;
    view.update('a\nb\nC');
    expect(emitted()).toBe(
      `${DISABLE_AUTO_WRAP}\x1b[s\x1b[u\r\x1b[2K\rC\x1b[u${ENABLE_AUTO_WRAP}`,
    );
    view.stop(true);
  });

  it('appends only the grown suffix for rows that extend', () => {
    const view = startLiveTerminalView('a\nb\nc');
    writes.length = 0;
    view.update('a\nb\ncdef');
    expect(emitted()).toBe(
      `${DISABLE_AUTO_WRAP}\x1b[s\x1b[u\r\x1b[1Cdef\x1b[u${ENABLE_AUTO_WRAP}`,
    );
    view.stop(true);
  });

  it('re-enables auto-wrap around a full surface replacement', () => {
    const view = startLiveTerminalView('one\ntwo');
    writes.length = 0;
    view.replace('ONE\nTWO\nTHREE');
    expect(emitted()).toBe(
      `\r\x1b[1A\x1b[J${DISABLE_AUTO_WRAP}\rONE\r\nTWO\r\nTHREE${ENABLE_AUTO_WRAP}`,
    );
    view.stop(true);
  });

  it('re-enables auto-wrap around bottom growth', () => {
    const view = startLiveTerminalView('a\nb\nc');
    writes.length = 0;
    view.update('a\nb\nx\nc');
    expect(emitted()).toBe(`${DISABLE_AUTO_WRAP}\r\x1b[2K\rx\r\nc${ENABLE_AUTO_WRAP}`);
    view.stop(true);
  });

  it('does not write when the frame is unchanged', () => {
    const view = startLiveTerminalView('a\nb');
    writes.length = 0;
    view.update('a\nb');
    expect(writes.length).toBe(0);
    view.stop(true);
  });

  it('erases the surface on stop without touching auto-wrap', () => {
    const view = startLiveTerminalView('a\nb\nc');
    writes.length = 0;
    view.stop();
    expect(emitted()).toBe('\r\x1b[2A\x1b[J');
  });

  it('gives up live editing when a growth would reach the viewport height', () => {
    setRows(4);
    const view = startLiveTerminalView('top\nmid\nbottom');
    writes.length = 0;
    expect(view.update('top\nmid\none\ntwo\nbottom')).toBe(false);
    // The still-addressable frame is erased so the caller's append-only
    // fallback starts on a clean line instead of stacking under a duplicate.
    expect(emitted()).toBe('\r\x1b[2A\x1b[J');

    // After giving up, edits and erases are no-ops: the cursor's relationship
    // to the frame is no longer trusted.
    writes.length = 0;
    expect(view.update('anything\nelse')).toBe(false);
    expect(view.replace('new\nsurface')).toBe(false);
    view.stop(false);
    expect(writes.length).toBe(0);
  });

  it('stops editing without erasing when the viewport shrank under the frame', () => {
    const view = startLiveTerminalView('a\nb\nc');
    setRows(2);
    writes.length = 0;
    expect(view.update('A\nB\nC')).toBe(false);
    // The frame's top row is already in scrollback, so no erase is attempted
    // and no edit clamps to the viewport's top row; a newline simply hands
    // the line back to the caller.
    expect(emitted()).toBe('\n');
    view.stop(false);
    expect(emitted()).toBe('\n');
  });

  it('keeps editing while the frame fits the viewport', () => {
    setRows(10);
    const view = startLiveTerminalView('a\nb\nc');
    writes.length = 0;
    expect(view.update('a\nb\nC')).toBe(true);
    expect(emitted()).toBe(
      `${DISABLE_AUTO_WRAP}\x1b[s\x1b[u\r\x1b[2K\rC\x1b[u${ENABLE_AUTO_WRAP}`,
    );
    view.stop(true);
  });

  it('keeps bottom growth while the grown frame still fits the viewport', () => {
    setRows(10);
    const view = startLiveTerminalView('a\nb\nc');
    writes.length = 0;
    expect(view.update('a\nb\nx\nc')).toBe(true);
    expect(emitted()).toBe(`${DISABLE_AUTO_WRAP}\r\x1b[2K\rx\r\nc${ENABLE_AUTO_WRAP}`);
    view.stop(true);
  });

  it('does not cursor-erase on stop after the viewport shrank under the frame', () => {
    const view = startLiveTerminalView('a\nb\nc');
    setRows(2);
    writes.length = 0;
    view.stop(false);
    // The frame's top row is in scrollback; erasing would clamp mid-frame.
    // The caller gets a fresh line for its append-only output instead.
    expect(emitted()).toBe('\n');
  });
});
