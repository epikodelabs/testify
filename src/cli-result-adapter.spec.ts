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
      }),
    ).toBe(
      EXIT_CODES.TEST_FAILURES,
    );
  });

  it('maps pending-only runs to pending exit code', () => {
    expect(
      getExecutionExitCode({
        specResults: [],
        total: 1,
        passed: 0,
        failed: 0,
        pending: 1,
      }),
    ).toBe(
      EXIT_CODES.SUCCESS_WITH_PENDING,
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
      }),
    ).toBe(
      EXIT_CODES.SUCCESS,
    );
  });
});
