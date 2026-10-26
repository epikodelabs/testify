import { installConsoleCapture } from './console-capture';

describe('installConsoleCapture', () => {
  const original = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  };

  afterEach(() => {
    console.log = original.log;
    console.info = original.info;
    console.warn = original.warn;
    console.error = original.error;
    console.debug = original.debug;
  });

  it('buffers console methods in order and restores the originals', () => {
    const capture = installConsoleCapture();

    console.log('first', 1);
    console.warn('second');
    console.error('third');

    expect(capture.flush()).toEqual(['first 1', 'second', 'third']);
    expect(capture.flush()).toEqual([]);

    capture.restore();
    expect(console.log).toBe(original.log);
    expect(console.warn).toBe(original.warn);
    expect(console.error).toBe(original.error);
  });

  it('drops lines entirely when suppressed', () => {
    const capture = installConsoleCapture({ suppress: true });

    console.log('hidden');
    console.error('also hidden');

    expect(capture.flush()).toEqual([]);
    capture.restore();
    expect(console.log).toBe(original.log);
  });

  it('leaves console functional after restore', () => {
    const capture = installConsoleCapture();
    capture.restore();

    // Smoke the restored path: the real console would print, so verify
    // identity instead of output.
    expect(console.log).toBe(original.log);
    expect(typeof console.log).toBe('function');
  });
});
