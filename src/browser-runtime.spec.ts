import {
  getBrowserRuntimeScript,
} from './browser-runtime';

describe('Browser runtime', () => {
  it('exposes the RunnerSession directly as the Playground session', () => {
    const source =
      getBrowserRuntimeScript({
        stopOnSpecFailure: false,
        initialSeed: 0,
        initialRandom: false,
      });

    expect(source).toContain(
      'function printSessionHelp()',
    );

    expect(source).toContain(
      'Testify Playground commands',
    );

    expect(source).toContain(
      'globalThis.session = session;',
    );

    expect(source).toContain(
      'help: printSessionHelp',
    );

    expect(source).toContain(
      'printSessionHelp();',
    );

    for (const command of [
      'session.tests()',
      'session.suites()',
      'session.files()',
      'session.state',
      'session.refresh()',
      'session.revision()',
      'session.changes()',
      'session.plan(selector, options)',
      'await session.execute(plan)',
      'session.query()',
      'session.invalidatePlans()',
      'session.reload()',
      'await session.exit()',
    ]) {
      expect(source).toContain(command);
    }

    expect(source).toContain(
      "type: 'session:exit'",
    );

    expect(source).not.toContain(
      'globalThis.runner =',
    );
  });
});
