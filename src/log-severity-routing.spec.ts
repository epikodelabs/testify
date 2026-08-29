import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

interface SeverityMessage {
  group: string;
  key: string;
}

function collectSeverityMessages(
  source: string,
  marker: '%warn%' | '%error%',
): SeverityMessage[] {
  const messages: SeverityMessage[] = [];
  const groupPattern = /export const (\w+)\s*=\s*\{(.*?)^\};/gms;

  for (const groupMatch of source.matchAll(groupPattern)) {
    const group = groupMatch[1];
    const body = groupMatch[2];
    if (!group || !body) continue;

    const messagePattern = /^\s{2}(\w+):.*?(?=^\s{2}\w+:|\s*$)/gms;
    for (const messageMatch of body.matchAll(messagePattern)) {
      const key = messageMatch[1];
      const definition = messageMatch[0];
      if (key && definition.includes(marker)) {
        messages.push({ group, key });
      }
    }
  }

  return messages;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe('log severity routing', () => {
  const srcDir = path.dirname(fileURLToPath(import.meta.url));
  const messageSource = fs.readFileSync(
    path.join(srcDir, 'log-messages.ts'),
    'utf8',
  );
  const sourceFiles = fs
    .readdirSync(srcDir)
    .filter(
      (file) =>
        file.endsWith('.ts') &&
        !file.endsWith('.spec.ts'),
    );

  function expectSeverityToUse(
    marker: '%warn%' | '%error%',
    expectedMethod: 'warn' | 'error',
  ): void {
    const messages = collectSeverityMessages(
      messageSource,
      marker,
    );
    const violations: string[] = [];

    for (const file of sourceFiles) {
      const source = fs.readFileSync(
        path.join(srcDir, file),
        'utf8',
      );

      for (const { group, key } of messages) {
        const callPattern = new RegExp(
          `logger\\.(println|print|printlnRaw|printRaw|warn|error)\\s*\\(\\s*${escapeRegExp(group)}(?:\\s*\\.\\s*)?${escapeRegExp(key)}\\s*\\(`,
          's',
        );
        const match = source.match(callPattern);
        if (match && match[1] !== expectedMethod) {
          violations.push(
            `${file}: ${group}.${key} uses logger.${match[1]} instead of logger.${expectedMethod}`,
          );
        }
      }
    }

    expect(violations).withContext(
      violations.join('\n'),
    ).toEqual([]);
  }

  it('routes %warn% messages through logger.warn', () => {
    expectSeverityToUse('%warn%', 'warn');
  });

  it('routes %error% messages through logger.error', () => {
    expectSeverityToUse('%error%', 'error');
  });
});
