import {
  EXIT_CODES,
} from './exit-codes';
import {
  getExecutionExitCode,
} from './cli-result-adapter';

describe('CLI result adapter', () => {
  it('uses explicit exitCode when present', () => {
    expect(
      getExecutionExitCode({
        specResults: [],
        total: 0,
        passed: 0,
        failed: 0,
        pending: 0,
        globalFailures: [],
        exitCode: 9,
      }),
    ).toBe(9);
  });

  it('maps failures to test failure exit code', () => {
    expect(
      getExecutionExitCode({
        specResults: [],
        total: 1,
        passed: 0,
        failed: 1,
        pending: 0,
        globalFailures: [],
      }),
    ).toBe(
      EXIT_CODES.TEST_FAILURES,
    );
  });

  it('maps skipped-only runs (Jasmine pending) to success', () => {
    expect(
      getExecutionExitCode({
        specResults: [],
        total: 1,
        passed: 0,
        failed: 0,
        pending: 1,
        globalFailures: [],
      }),
    ).toBe(
      EXIT_CODES.SUCCESS,
    );
  });

  it('maps clean runs to success', () => {
    expect(
      getExecutionExitCode({
        specResults: [],
        total: 1,
        passed: 1,
        failed: 0,
        pending: 0,
        globalFailures: [],
      }),
    ).toBe(
      EXIT_CODES.SUCCESS,
    );
  });

  it('maps global failures to test failure exit code', () => {
    expect(
      getExecutionExitCode({
        specResults: [],
        total: 0,
        passed: 0,
        failed: 0,
        pending: 0,
        globalFailures: [{
          message:
            'Unhandled promise rejection: Error: authorization service unavailable',
        }],
      }),
    ).toBe(
      EXIT_CODES.TEST_FAILURES,
    );
  });
});
