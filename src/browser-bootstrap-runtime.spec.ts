import {
  getBrowserBootstrapScript,
} from './browser-bootstrap-runtime';

describe('Browser bootstrap runtime', () => {
  it('exposes the host connection for the Playground session', () => {
    const source =
      getBrowserBootstrapScript({
        preludeModules: [],
      });

    expect(source).toContain(
      'window.__testifyHost = forwarder;',
    );
  });
});
