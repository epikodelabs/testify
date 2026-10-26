import { startLiveTerminalView } from './ink-output';

const DISABLE_AUTO_WRAP = '\x1b[?7l';
const ENABLE_AUTO_WRAP = '\x1b[?7h';

describe('startLiveTerminalView', () => {
  let writes: string[];
  let originalWrite: PropertyDescriptor | undefined;

  beforeEach(() => {
    writes = [];
    originalWrite = Object.getOwnPropertyDescriptor(process.stdout, 'write');
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
  });

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
});
