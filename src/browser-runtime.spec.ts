import {
  getBrowserRuntimeScript,
} from './browser-runtime';

describe('Browser runtime', () => {
  it('prints runner help and exposes it on the global runner', () => {
    const source =
      getBrowserRuntimeScript({
        stopOnSpecFailure: false,
        initialSeed: 0,
        initialRandom: false,
      });

    expect(source).toContain(
      'function printRunnerHelp()',
    );

    expect(source).toContain(
      'console.group(',
    );

    expect(source).toContain(
      'Testify watch mode console commands',
    );

    expect(source).toContain(
      'help: printRunnerHelp',
    );

    expect(source).toContain(
      'printRunnerHelp();',
    );
  });
});
