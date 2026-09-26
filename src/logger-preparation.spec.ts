import { Logger } from './logger';
import { ANSI_FULL_REGEX } from './ansi-constants';

describe('Logger preparation pipeline', () => {
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
    expect(rendered).toContain('WARNING');
    expect(rendered).toContain('[BUILD] Bundler emitted a recoverable warning.');
    expect(rendered).toContain('[FAIL]');
    expect(rendered).toContain('ERROR');
    expect(rendered).toContain('[RUNNER] Runner generation failed.');
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
    expect(rendered).toContain('No matching spec files found in src. Nothing to run.');
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