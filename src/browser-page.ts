export interface BrowserPageScripts {
  jasminePatch: string;
  websocketReporter: string;
  hmrClient: string;
  bootstrap: string;
  runtime: string;
}

export interface BrowserPage {
  title: string;
  faviconTag: string;
  scripts: BrowserPageScripts;
}

export function createBrowserPage(
  page: BrowserPage,
): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${page.faviconTag}
  <title>${page.title}</title>
  <link rel="stylesheet" href="/node_modules/jasmine-core/lib/jasmine-core/jasmine.css">
  <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine.js"></script>
  <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js"></script>

  <script>
${page.scripts.jasminePatch}

${page.scripts.websocketReporter}

${page.scripts.hmrClient}

${page.scripts.bootstrap}

${page.scripts.runtime}
  </script>
</head>
<body>
  <div class="jasmine_html-reporter"></div>
</body>
</html>`;
}
