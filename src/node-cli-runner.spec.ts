import {
  getExecutionExitCode,
} from './cli-result-adapter';

describe('Node CLI result boundary', () => {
  it('keeps exit mapping outside runtime result creation', () => {
    const result = {
      specResults: [],
      total: 2,
      passed: 1,
      failed: 1,
      pending: 0,
    };

    expect(
      getExecutionExitCode(
        result,
      ),
    ).toBeGreaterThan(0);
  });
});
