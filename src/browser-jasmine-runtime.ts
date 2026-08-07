import { getEmbeddedTestMetadataSource } from './test-metadata-runtime';

export function getBrowserJasmineRegistrationPatchScript(): string {
  const metadataSource =
    getEmbeddedTestMetadataSource();

  return `
${metadataSource}

(function patchJasmineRegistrationCapture() {
  if (!window.jasmineRequire) {
    return setTimeout(patchJasmineRegistrationCapture, 10);
  }

  const root = window.jasmineRequire || jasmineRequire;
  const j$ = jasmineRequire.core(jasmineRequire);
  const OriginalSuiteFactory = jasmineRequire.Suite || j$.Suite || null;
  const OriginalSpecFactory = jasmineRequire.Spec || j$.Spec || null;

  if (OriginalSuiteFactory) {
    root.Suite = function(j$local) {
      const OriginalSuite = OriginalSuiteFactory(j$local);

      return class TestifySuite extends OriginalSuite {
        constructor(attrs) {
          super(attrs);
          captureTestifyRegistration(this);
        }
      };
    };
  }

  if (OriginalSpecFactory) {
    root.Spec = function(j$local) {
      const OriginalSpec = OriginalSpecFactory(j$local);

      return class TestifySpec extends OriginalSpec {
        constructor(attrs) {
          super(attrs);
          captureTestifyRegistration(this);
        }
      };
    };
  }
})();
`;
  }
