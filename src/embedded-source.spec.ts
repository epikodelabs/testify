import {
  getEmbeddedCatalogStateSource,
} from './catalog-state';
import {
  getEmbeddedNameHelperSource,
} from './embedded-source';
import {
  getEmbeddedPlanningEngineSource,
} from './planning-engine';
import {
  getEmbeddedRunnerSessionSource,
} from './runner-session';

describe('embedded class source', () => {
  it('provides the __name helper for embedded transformed sources', () => {
    expect(
      getEmbeddedNameHelperSource(),
    ).toContain(
      'function __name(target, value)',
    );

    expect(
      getEmbeddedNameHelperSource(),
    ).toContain(
      'return target;',
    );
  });

  it('binds embedded classes to stable names', () => {
    expect(
      getEmbeddedCatalogStateSource(),
    ).toContain(
      'const CatalogState = class',
    );

    expect(
      getEmbeddedPlanningEngineSource(),
    ).toContain(
      'const PlanningEngine = class',
    );

    expect(
      getEmbeddedRunnerSessionSource(),
    ).toContain(
      'const RunnerSession = class',
    );
  });

  it('does not emit bare anonymous class statements', () => {
    const source = [
      getEmbeddedCatalogStateSource(),
      getEmbeddedPlanningEngineSource(),
      getEmbeddedRunnerSessionSource(),
    ].join('\\n\\n');

    expect(
      /(^|\\n)class\\s*\\{/.test(
        source,
      ),
    ).toBeFalse();
  });
});
