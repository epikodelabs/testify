// Maps known preparation failure signatures to a one-line actionable remedy.
// The README troubleshooting table is the source of truth for these remedies;
// this module is its runtime counterpart. Hints are plain ASCII strings: the
// logger adds the surrounding glyph and color when it renders them.

interface ErrorHintRule {
  pattern: RegExp;
  hint: string;
}

const ERROR_HINT_RULES: readonly ErrorHintRule[] = [
  {
    pattern: /playwright browser installation exited with code|playwright did not install/i,
    hint: 'Run the installer manually to see its full progress: npx playwright install',
  },
  {
    pattern: /executable doesn't exist|browserType\.launch|browser .* is not installed|playwright runtime not available|need to install browser binaries/i,
    hint: 'Install the browser binaries with: npx playwright install',
  },
  {
    pattern: /cannot find module 'playwright'|module not found.*playwright/i,
    hint: 'Reinstall project dependencies (npm install), then run: npx playwright install',
  },
  {
    pattern: /EADDRINUSE|still busy after reclaim|port \d+ is busy/i,
    hint: 'Stop the process holding the port, or start Testify with --port <number>',
  },
  {
    pattern: /failed to (?:parse|load) (?:the )?config|failed to initialize testify config/i,
    hint: 'Fix the reported field in testify.json, or rename it to regenerate a valid config',
  },
  {
    pattern: /failed to discover (?:source and )?(?:test )?files/i,
    hint: 'Check testDirs in testify.json and that specs use the *.spec.ts naming convention',
  },
  {
    pattern: /(?:preprocessing|build) failed/i,
    hint: 'The bundler diagnostic above points at the failing file and line',
  },
];

/**
 * Resolve a remedy for a failure message, or undefined when no known
 * signature matches. Matching is purely textual: every error funnel (card
 * diagnostics and runtime panels alike) passes the same sanitized message.
 */
export function errorHint(message: string): string | undefined {
  return ERROR_HINT_RULES.find((rule) => rule.pattern.test(message))?.hint;
}
