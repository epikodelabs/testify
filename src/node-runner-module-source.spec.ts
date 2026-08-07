import {
  createNodeRunnerModuleSource,
} from './node-runner-module-source';
import type {
  ViteJasmineConfig,
} from './vite-jasmine-config';

describe('Node runner module source', () => {
  it('generates a planned Node runner', () => {
    const source =
      createNodeRunnerModuleSource({
        jasmineCoreUrl:
          'file:///jasmine.js',
        imports:
          "        await import('./forms.spec.js');",
        config: {
          jasmineConfig: {
            env: {
              random: false,
              seed: 0,
              stopSpecOnExpectationFailure:
                false,
            },
          },
        } as unknown as ViteJasmineConfig,
      });

    expect(source).toContain(
      'createExecutionPlan(',
    );

    expect(source).toContain(
      'executeNodePlan(',
    );

    expect(source).toContain(
      "./forms.spec.js",
    );
  });

  it('keeps process lifecycle concerns out of the generated runner', () => {
    const source =
      createNodeRunnerModuleSource({
        jasmineCoreUrl:
          'file:///jasmine.js',
        imports: '',
        config: {
          jasmineConfig: {
            env: {
              random: false,
              seed: 0,
              stopSpecOnExpectationFailure:
                false,
            },
          },
        } as unknown as ViteJasmineConfig,
      });

    expect(source).not.toContain(
      "process.on(",
    );

    expect(source).not.toContain(
      "process.exit(",
    );

    expect(source).not.toContain(
      "pathToFileURL",
    );

    expect(source).toContain(
      "reject(error)",
    );
  });

  it('does not read process environment or patch console in generated runtime', () => {
    const source =
      createNodeRunnerModuleSource({
        jasmineCoreUrl:
          'file:///jasmine.js',
        imports: '',
        config: {
          jasmineConfig: {
            env: {
              random: false,
              seed: 0,
              stopSpecOnExpectationFailure:
                false,
            },
          },
        } as unknown as ViteJasmineConfig,
      });

    expect(source).not.toContain(
      'TS_TEST_RUNNER_SUPPRESS_CONSOLE_LOGS',
    );

    expect(source).not.toContain(
      'process.env',
    );

    expect(source).not.toContain(
      'restoreConsole',
    );

    expect(source).not.toContain(
      'console[method] = () => {}',
    );
  });
});
