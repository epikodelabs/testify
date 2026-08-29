export interface BrowserPage {
  title: string;
  faviconTag: string;
  headStyles?: string[];
  headScripts?: string[];
  bodyHtml?: string;
  inlineScripts?: string[];
}

export function createBrowserPage(
  page: BrowserPage,
): string {
  const headStyles = (page.headStyles ?? [])
    .filter(Boolean)
    .join('\n');

  const headScripts = (page.headScripts ?? [])
    .filter(Boolean)
    .join('\n');

  const inlineScripts = (page.inlineScripts ?? [])
    .filter(Boolean)
    .map((script) => `<script>\n${script}\n</script>`)
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${page.faviconTag}
  <title>${page.title}</title>
  ${headStyles}
  ${headScripts}
</head>
<body>
  ${page.bodyHtml ?? '<div class="jasmine_html-reporter"></div>'}
  ${inlineScripts}
</body>
</html>`;
}
