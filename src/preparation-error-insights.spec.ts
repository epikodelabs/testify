import { errorHint } from './preparation-error-insights';

describe('Preparation error insights', () => {
  it('maps known failure signatures to actionable remedies', () => {
    expect(errorHint('Error: listen EADDRINUSE: address already in use :::8888')).toContain('--port');
    expect(errorHint('Port 8888 is still busy after reclaim attempt.')).toContain('--port');

    expect(errorHint('Playwright browser installation exited with code 1.')).toContain('npx playwright install');
    expect(errorHint('browserType.launch: Executable doesn\'t exist at .../chromium')).toContain('npx playwright install');
    expect(errorHint('Error: Cannot find module \'playwright\'')).toContain('npm install');

    expect(errorHint('Failed to parse config: Unexpected token } in JSON')).toContain('testify.json');
    expect(errorHint('Error: Failed to discover source and test files')).toContain('testDirs');
    expect(errorHint('Build failed: [ RolldownError ] ...')).toContain('file and line');
  });

  it('returns undefined for unknown failures instead of guessing', () => {
    expect(errorHint('Something unexpected happened')).toBeUndefined();
    expect(errorHint('')).toBeUndefined();
  });
});
