describe('process errors', () => {
  it('finishes the first test', async () => {
    setTimeout(() => {
      throw new Error('SIMULATED uncaughtException');
    }, 10);

    // Keep the run alive long enough for the timer to fire.
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(true).toBeTrue();
  });

  it('continues to another test', () => {
    expect(true).toBeTrue();
  });

  it('finishes despite an unhandled rejection', async () => {
    setTimeout(() => {
      void Promise.reject(
        new Error('SIMULATED unhandledRejection'),
      );
    }, 10);

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(true).toBeTrue();
  });

  it('continues running tests', () => {
    expect(true).toBeTrue();
  });
});