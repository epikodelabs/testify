import { Logger } from './logger';
import { ANSI_FULL_REGEX } from './ansi-constants';

function panelText(panel: string): string {
  return panel.replace(ANSI_FULL_REGEX, '').split('\n')
    .filter(line => line.startsWith('|'))
    .map(line => line.slice(1, -1).trim())
    .join(' ').replace(/\s+/g, ' ');
}

function expectPanelText(panel: string, text: string): void {
  expect(panelText(panel).replace(/\s/g, '')).toContain(text.replace(/\s/g, ''));
}

describe('Logger preparation pipeline', () => {
  it('defers preparation rendering in narrow terminals that would wrap live rows', () => {
    const originalIsTTY = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
    const originalColumns = Object.getOwnPropertyDescriptor(process.stdout, 'columns');

    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
    Object.defineProperty(process.stdout, 'columns', { value: 50, configurable: true });

    try {
      const logger = new Logger();
      logger.preparationStart('');

      expect((logger as any).preparationView).toBeNull();
    } finally {
      if (originalIsTTY) Object.defineProperty(process.stdout, 'isTTY', originalIsTTY);
      else delete (process.stdout as { isTTY?: boolean }).isTTY;
      if (originalColumns) Object.defineProperty(process.stdout, 'columns', originalColumns);
      else delete (process.stdout as { columns?: number }).columns;
    }
  });

  it('defers preparation rendering when the viewport is too short for cursor edits', () => {
    const originalIsTTY = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
    const originalColumns = Object.getOwnPropertyDescriptor(process.stdout, 'columns');
    const originalRows = Object.getOwnPropertyDescriptor(process.stdout, 'rows');

    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
    Object.defineProperty(process.stdout, 'columns', { value: 100, configurable: true });
    Object.defineProperty(process.stdout, 'rows', { value: 8, configurable: true });

    try {
      const logger = new Logger();
      logger.preparationStart('');

      expect((logger as any).preparationView).toBeNull();
    } finally {
      if (originalIsTTY) Object.defineProperty(process.stdout, 'isTTY', originalIsTTY);
      else delete (process.stdout as { isTTY?: boolean }).isTTY;
      if (originalColumns) Object.defineProperty(process.stdout, 'columns', originalColumns);
      else delete (process.stdout as { columns?: number }).columns;
      if (originalRows) Object.defineProperty(process.stdout, 'rows', originalRows);
      else delete (process.stdout as { rows?: number }).rows;
    }
  });

  it('drops the live surface when diagnostics push the card past the viewport and prints one complete card at flush', () => {
    const originalIsTTY = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
    const originalColumns = Object.getOwnPropertyDescriptor(process.stdout, 'columns');
    const originalRows = Object.getOwnPropertyDescriptor(process.stdout, 'rows');
    const originalWrite = Object.getOwnPropertyDescriptor(process.stdout, 'write');
    const previousSuppression = (globalThis as any).__testifySuppressLogs;
    const writes: string[] = [];

    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
    Object.defineProperty(process.stdout, 'columns', { value: 100, configurable: true });
    Object.defineProperty(process.stdout, 'rows', { value: 20, configurable: true });
    Object.defineProperty(process.stdout, 'write', {
      value: ((chunk: unknown) => { writes.push(String(chunk)); return true; }),
      configurable: true,
      writable: true,
    });
    (globalThis as any).__testifySuppressLogs = false;

    try {
      const logger = new Logger();
      const internal = logger as any;

      logger.preparationStart('');
      logger.preparationContextLabel('HEADLESS · CHROME');
      logger.preparationPlan([
        { label: 'DISCOVER', message: 'Discover test files' },
        { label: 'CONFIG', message: 'Prepare build configuration' },
        { label: 'OUTPUT', message: 'Prepare output directory' },
        { label: 'BUILD', message: 'Build test modules' },
        { label: 'INSTRUMENT', message: 'Instrument compiled modules' },
        { label: 'PAGE', message: 'Prepare browser test page' },
        { label: 'BROWSER', message: 'Ensure chrome is installed' },
        { label: 'PORT', message: 'Acquire test server port' },
        { label: 'SERVER', message: 'Start test server' },
        { label: 'EXECUTE', message: 'Start chrome test session' },
      ]);
      expect(internal.preparationView).not.toBeNull();

      writes.length = 0;
      logger.warn(
        'Browser compatibility excluded 9 spec file(s):\n' +
        Array.from({ length: 40 }, (_, i) => `  - excluded-${i}.ts`).join('\n'),
      );
      // A 20-row viewport cannot address a card grown by the diagnostic block,
      // so the live view hands back to the append-only narrow-terminal path.
      expect(internal.preparationView).toBeNull();

      logger.flushPreparation();
      expect(internal.preparationFlushed).toBe(true);

      const card = writes.join('').replace(ANSI_FULL_REGEX, '');
      expect(card).toContain('Browser compatibility excluded 9 spec file(s)');
      expect(card).toContain('excluded-39.ts');
      // The abandoned live frame was erased and exactly one complete card was
      // printed at the flush boundary — no stacked duplicate frames.
      expect((card.match(/PREPARING TEST ENVIRONMENT/g) ?? []).length).toBe(1);
    } finally {
      (globalThis as any).__testifySuppressLogs = previousSuppression;
      if (originalWrite) Object.defineProperty(process.stdout, 'write', originalWrite);
      else delete (process.stdout as { write?: unknown }).write;
      if (originalIsTTY) Object.defineProperty(process.stdout, 'isTTY', originalIsTTY);
      else delete (process.stdout as { isTTY?: boolean }).isTTY;
      if (originalColumns) Object.defineProperty(process.stdout, 'columns', originalColumns);
      else delete (process.stdout as { columns?: number }).columns;
      if (originalRows) Object.defineProperty(process.stdout, 'rows', originalRows);
      else delete (process.stdout as { rows?: number }).rows;
    }
  });

  it('renders one runner-independent preparation lifecycle without owning stdout', () => {
    // This is deliberately a state-only logger. Testify's outer reporter owns
    // stdout while this spec runs, so a logger contract test must never create
    // a nested live terminal surface.
    const logger = new Logger({ output: false });
    const internal = logger as any;

    // The outer Testify suite may suppress normal logger output globally. A
    // state-only logger must still execute its lifecycle because it cannot own
    // stdout in the first place.
    const previousSuppression = (globalThis as any).__testifySuppressLogs;
    (globalThis as any).__testifySuppressLogs = true;

    logger.preparationStart('');
    logger.preparationPlan([
      { label: 'DISCOVER', message: 'Discover test files' },
      { label: 'BUILD', message: 'Build test modules' },
      { label: 'EXECUTE', message: 'Start test session' },
    ]);

    expect(internal.preparationView).toBeNull();
    expect(internal.preparationItems.map((item: any) => item.label)).toEqual([
      'DISCOVER', 'BUILD', 'EXECUTE',
    ]);
    expect(internal.preparationItems.map((item: any) => item.status)).toEqual([
      'pending', 'pending', 'pending',
    ]);

    const initial = internal.renderPreparationPanel().replace(ANSI_FULL_REGEX, '');
    expect(initial).toContain('PREPARING TEST ENVIRONMENT');
    expect(initial).toContain('DISCOVER');
    expect(initial).toContain('BUILD');
    expect(initial).toContain('EXECUTE');

    logger.preparationStep('DISCOVER', 'Found test files.', true);
    logger.preparationStep('BUILD', 'Building test modules...');

    expect(internal.preparationItems.map((item: any) => [item.label, item.status])).toEqual([
      ['DISCOVER', 'complete'],
      ['BUILD', 'running'],
      ['EXECUTE', 'pending'],
    ]);

    logger.preparationComplete('BUILD');
    logger.preparationStep('EXECUTE', 'Starting test session...');

    expect(internal.preparationItems.map((item: any) => [item.label, item.status])).toEqual([
      ['DISCOVER', 'complete'],
      ['BUILD', 'complete'],
      ['EXECUTE', 'running'],
    ]);

    logger.flushPreparation();
    expect(internal.preparationItems).toBeNull();
    expect(internal.preparationDiagnostics).toBeNull();
    expect(internal.preparationLines).toBeNull();
    expect(internal.preparationView).toBeNull();

    // Flush remains the one-way preparation -> execution ownership boundary.
    logger.preparationStart('late runner start');
    logger.preparationContextLabel('HEADLESS · CHROME');
    logger.preparationPlan([
      { label: 'DISCOVER', message: 'Discover again' },
      { label: 'EXECUTE', message: 'Execute again' },
    ]);
    expect(internal.preparationItems).toBeNull();
    expect(internal.preparationLines).toBeNull();
    expect(internal.preparationView).toBeNull();

    (globalThis as any).__testifySuppressLogs = previousSuppression;
  });

  it('keeps warning and error diagnostics inside preparation without inventing pipeline steps', () => {
    const logger = new Logger({ output: false });
    const internal = logger as any;

    logger.preparationStart('');
    logger.preparationContextLabel('HEADLESS · CHROME');
    logger.preparationPlan([
      { label: 'DISCOVER', message: 'Discover test files' },
      { label: 'BUILD', message: 'Build test modules' },
      { label: 'EXECUTE', message: 'Start test session' },
    ]);

    logger.preparationStep('DISCOVER', 'Found test files.', true);
    logger.preparationStep('BUILD', 'Building test modules...');
    logger.warn('%warn% Bundler emitted a recoverable warning.');
    logger.warn('%warn% Bundler emitted a second warning.');
    logger.preparationComplete('BUILD');

    expect(internal.preparationItems.map((item: any) => [item.label, item.status])).toEqual([
      ['DISCOVER', 'complete'],
      ['BUILD', 'warning'],
      ['EXECUTE', 'pending'],
    ]);
    expect(internal.preparationItems.some((item: any) => item.label === 'WARN')).toBeFalse();
    expect(internal.preparationDiagnostics).toEqual([
      jasmine.objectContaining({
        severity: 'warning',
        stepLabel: 'BUILD',
        message: 'Bundler emitted a recoverable warning.',
      }),
      jasmine.objectContaining({
        severity: 'warning',
        stepLabel: 'BUILD',
        message: 'Bundler emitted a second warning.',
      }),
    ]);

    // Replanning (for example a browser -> Node fallback) must not erase the
    // diagnostic that already occurred during preparation.
    logger.preparationPlan([
      { label: 'DISCOVER', message: 'Discover test files' },
      { label: 'BUILD', message: 'Build test modules' },
      { label: 'RUNNER', message: 'Prepare in-process test runner' },
      { label: 'EXECUTE', message: 'Start Node test session' },
    ]);
    expect(internal.preparationDiagnostics.length).toBe(2);

    logger.preparationStep('RUNNER', 'Generating runner...');
    logger.error('%error% Runner generation failed.');
    logger.preparationComplete('RUNNER');

    const runner = internal.preparationItems.find((item: any) => item.label === 'RUNNER');
    expect(runner.status).toBe('failed');
    expect(internal.preparationItems.some((item: any) => item.label === 'ERROR')).toBeFalse();

    const rendered = internal.renderPreparationPanel();
    expect(rendered).toContain('[WARN]');
    expectPanelText(rendered, '[BUILD] Bundler emitted a recoverable warning.');
    expect(rendered).toContain('[FAIL]');
    expect(rendered).toContain('[ERROR]');
    expectPanelText(rendered, '[RUNNER] Runner generation failed.');
    // The failed run retitles the card instead of staying "preparing".
    expect(rendered).toContain('PREPARATION FAILED');
  });

  it('renders a warning-tagged stage as warning even when the caller marks it complete', () => {
    const logger = new Logger({ output: false });
    const internal = logger as any;

    logger.preparationStart('');
    logger.preparationPlan([
      { label: 'DISCOVER', message: 'Discover test files' },
      { label: 'CONFIG', message: 'Prepare build configuration' },
    ]);

    logger.preparationStep(
      'DISCOVER',
      '%warn% No matching spec files found in src. Nothing to run.',
      true,
    );

    expect(internal.preparationItems.map((item: any) => [item.label, item.status])).toEqual([
      ['DISCOVER', 'warning'],
      ['CONFIG', 'pending'],
    ]);

    const rendered = internal.renderPreparationPanel();
    expect(rendered).toContain('[WARN]  DISCOVER');
    expectPanelText(rendered, 'No matching spec files found in src. Nothing to run.');
    expect(rendered).not.toContain('%warn%');
  });

});

// Redirected output must never depend on Unicode terminal glyphs. This is a
// renderer contract: generate ASCII in the first place instead of stripping
// rich output after it has crossed a Windows code-page boundary.
describe('Logger redirected preparation output', () => {
  it('renders an ASCII-only, non-interactive preparation section', () => {
    const logger = new Logger({ output: false });
    const internal = logger as any;

    logger.preparationStart('');
    logger.preparationContextLabel('HEADED · CHROME');
    logger.preparationPlan([
      { label: 'DISCOVER', message: 'Discover test files' },
      { label: 'EXECUTE', message: 'Start browser test session' },
    ]);
    logger.preparationStep('DISCOVER', 'Found 32 spec files and 37 source files.', true);
    logger.preparationStep('EXECUTE', 'Starting browser test session...', true);

    const rendered = internal.renderPreparationPanel();
    expect(rendered).toContain('PREPARING TEST ENVIRONMENT - HEADED - CHROME');
    expect(rendered).toContain('[OK]  DISCOVER');
    expect(rendered).toContain('[OK]  EXECUTE');
    expect(rendered).not.toContain('✓');
    expect(rendered).not.toContain('·');
    expect(rendered).toMatch(/^\+-+\+$/m);
    expect(rendered).toContain('| PREPARING TEST ENVIRONMENT - HEADED - CHROME');
    expect(rendered).toMatch(/\+-+\+$/);
    expect(rendered).not.toContain('╭');
    expect(rendered).not.toContain('│');
    expect(rendered).not.toContain('─');
    expect(rendered).not.toContain('\x1b');
    expect(rendered).not.toContain('\r');
    expect(/^[\x00-\x7F]*$/.test(rendered)).toBeTrue();
  });
});

describe('Logger preparation failure signaling', () => {
  it('switches the card to a PREPARATION FAILED title once an error is recorded', () => {
    const logger = new Logger({ output: false });
    const internal = logger as any;

    logger.preparationStart('');
    logger.preparationContextLabel('HEADLESS · CHROME');
    logger.preparationPlan([
      { label: 'DISCOVER', message: 'Discover test files' },
      { label: 'BUILD', message: 'Build test modules' },
    ]);

    expect(internal.renderPreparationPanel()).toContain('PREPARING TEST ENVIRONMENT');

    logger.preparationStep('BUILD', 'Building test modules...');
    logger.error('%error% Preprocessing failed: SyntaxError: bad token\n    at build (file.ts:12:5)');

    const rendered = internal.renderPreparationPanel();
    expect(rendered).toContain('PREPARATION FAILED - HEADLESS - CHROME');
    expect(rendered).not.toContain('PREPARING TEST ENVIRONMENT');
    // Diagnostics sit below a section rule, separated from the step rows.
    expect((internal.preparationLines as string[]).includes('\uE000')).toBeTrue();
  });

  it('renders one error once even when stacked catches re-wrap the same failure', () => {
    const logger = new Logger({ output: false });
    const internal = logger as any;

    logger.preparationStart('');
    logger.preparationPlan([{ label: 'BUILD', message: 'Build test modules' }]);
    logger.preparationStep('BUILD', 'Building test modules...');

    logger.error('%error% Preprocessing failed: Error: boom\n    at foo (bar.ts:1:1)');
    logger.error('%error% Build failed: Error: boom\n    at foo (bar.ts:1:1)');
    logger.error('%error% Failed to start test runner: Error: boom\n    at foo (bar.ts:1:1)');

    expect(internal.preparationDiagnostics.length).toBe(1);
    expect(internal.preparationDiagnostics[0].message).toContain('Preprocessing failed');
  });

  it('attaches an actionable hint for known failure signatures', () => {
    const logger = new Logger({ output: false });
    const internal = logger as any;

    logger.preparationStart('');
    logger.preparationPlan([{ label: 'SERVER', message: 'Start test server' }]);
    logger.preparationStep('SERVER', 'Starting test server...');

    logger.error('%error% Port 8888 is still busy after reclaim attempt.');

    const diagnostic = internal.preparationDiagnostics[0];
    expect(diagnostic.hint).toContain('--port');
    const rendered = internal.renderPreparationPanel();
    expect(rendered).toContain('Hint:');
    expectPanelText(rendered, '[SERVER] Port 8888 is still busy after reclaim attempt.');
  });

  it('strips ANSI escapes and control characters before text reaches card rows', () => {
    const logger = new Logger({ output: false });
    const internal = logger as any;

    logger.preparationStart('');
    logger.preparationPlan([{ label: 'BUILD', message: 'Build test modules' }]);
    logger.preparationStep('BUILD', 'Building test modules...');

    logger.error('%error% Build failed: \x1b[31mred frame\x1b[0m\r\nprogress 50%\r\x1b[2Kdone');

    const diagnostic = internal.preparationDiagnostics[0];
    expect(diagnostic.message).not.toContain('\r');
    expect(diagnostic.message).not.toContain('\x1b');
    expect(diagnostic.message).toContain('Build failed: red frame');
    expect(diagnostic.message).toContain('progress 50%');
  });

  it('marks still-running steps skipped at flush when preparation failed, complete otherwise', () => {
    const coercions: Array<[string, string]> = [];
    const record = (logger: Logger) => {
      spyOn(logger as any, 'renderPreparationItem').and.callFake((item: any) => {
        coercions.push([item.label, item.status]);
        return '';
      });
      logger.flushPreparation();
    };

    const failed = new Logger({ output: false });
    failed.preparationStart('');
    failed.preparationPlan([
      { label: 'DISCOVER', message: 'Discover test files' },
      { label: 'BUILD', message: 'Build test modules' },
      { label: 'EXECUTE', message: 'Start test session' },
    ]);
    failed.preparationStep('DISCOVER', 'Found test files.', true);
    failed.preparationStep('BUILD', 'Building test modules...');
    failed.error('%error% Preprocessing failed: Error: boom');
    failed.preparationStep('EXECUTE', 'Starting test session...');
    record(failed);
    expect(coercions).toContain(['BUILD', 'failed']);
    expect(coercions).toContain(['EXECUTE', 'skipped']);

    coercions.length = 0;
    const succeeded = new Logger({ output: false });
    succeeded.preparationStart('');
    succeeded.preparationPlan([
      { label: 'DISCOVER', message: 'Discover test files' },
      { label: 'EXECUTE', message: 'Start test session' },
    ]);
    succeeded.preparationStep('DISCOVER', 'Found test files.', true);
    succeeded.preparationStep('EXECUTE', 'Starting test session...');
    record(succeeded);
    expect(coercions).toContain(['EXECUTE', 'complete']);
  });

  it('routes tip messages to hint rows instead of STATUS pseudo-steps', () => {
    const logger = new Logger({ output: false });
    const internal = logger as any;

    logger.preparationStart('');
    logger.preparationPlan([{ label: 'BROWSER', message: 'Ensure chrome is installed' }]);
    logger.preparationStep('BROWSER', 'Ensuring chrome is installed...');

    logger.println('%bulb% Tip: Reinstall dependencies, then install browsers explicitly:\n   npx playwright install');

    expect(internal.preparationItems.some((item: any) => item.label === 'STATUS')).toBeFalse();
    expect(internal.preparationDiagnostics).toEqual([
      jasmine.objectContaining({ severity: 'hint' }),
    ]);
    // A hint must not fail the step it appears under.
    expect(internal.preparationItems.find((item: any) => item.label === 'BROWSER').status).toBe('running');
    expect(internal.renderPreparationPanel()).toContain('[TIP]');
    expect(internal.renderPreparationPanel()).toContain('PREPARING TEST ENVIRONMENT');
  });
});

describe('Logger preparation wrapping', () => {
  for (const columns of [40, 55, 80, 120]) {
    it(`preserves warning and hint text at ${columns} columns`, () => {
      const originalColumns = Object.getOwnPropertyDescriptor(process.stdout, 'columns');
      Object.defineProperty(process.stdout, 'columns', { value: columns, configurable: true });
      try {
        const logger = new Logger({ output: false });
        logger.preparationStart('');
        logger.preparationPlan([{ label: 'SERVER', message: 'Start test server' }]);
        logger.preparationStep('SERVER', 'Starting test server...');
        logger.warn('Bundler emitted a recoverable warning.');
        logger.error('Port 8888 is still busy after reclaim attempt.');
        const rendered = (logger as any).renderPreparationPanel();
        const text = panelText(rendered);
        expectPanelText(rendered, '[SERVER] Bundler emitted a recoverable warning.');
        expectPanelText(rendered, '[SERVER] Port 8888 is still busy after reclaim attempt.');
        expect(text).toContain('Hint:');
        expect(text).toContain('--port');
        if (columns <= 55) {
          expect(rendered).not.toContain('[SERVER] Port 8888 is still busy after reclaim attempt.');
        }
      } finally {
        if (originalColumns) Object.defineProperty(process.stdout, 'columns', originalColumns);
        else delete (process.stdout as { columns?: number }).columns;
      }
    });
  }
});
