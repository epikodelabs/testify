import {
  CoverageHost,
} from './coverage-host';

describe('CoverageHost', () => {
  it('is a no-op when coverage is disabled', async () => {
    const host =
      new CoverageHost(false);

    await expectAsync(
      host.generate(undefined),
    ).toBeResolved();
  });
});
