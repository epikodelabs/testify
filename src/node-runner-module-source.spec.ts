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
});
