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
});
