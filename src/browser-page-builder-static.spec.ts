import fs from 'fs';
import path from 'path';

describe('BrowserPageBuilder static reporter bridge', () => {
  it('includes the WebSocket reporter in static pages', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/browser-page-builder.ts',
        ),
        'utf8',
      );

    const staticStart =
      source.indexOf(
        'buildStatic(',
      );

    const hmrStart =
      source.indexOf(
        'buildHmr(',
      );

    const staticSource =
      source.slice(
        staticStart,
        hmrStart,
      );

    expect(staticSource).toContain(
      'getBrowserWebSocketReporterScript(',
    );

    expect(staticSource).toContain(
      'getStaticBrowserBootstrapScript(',
    );
  });
});
