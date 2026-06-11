export const norm = (p: string) => p.replace(/\\/g, '/');
export const capitalize = (p?: string | null): string => {
  if (!p) return '';
  return p.charAt(0).toUpperCase() + p.slice(1);
};

export const ANSI_FULL_REGEX =
  /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;

export function visibleWidth(text: string): number {
  return [...text.replace(ANSI_FULL_REGEX, '')].length;
}

export type WrapMode = 'word' | 'char';

export function normalize(text: string): string {
  return text
    .replace(/\s*\r?\n\s*/g, '') // strip newlines and surrounding whitespace
    .replace(/[\uFEFF\xA0\t]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

interface DisplayUnit {
  value: string;
  visible: number;
  whitespace: boolean;
}

function splitAnsiTokens(text: string): string[] {
  const tokens: string[] = [];
  let lastIndex = 0;
  ANSI_FULL_REGEX.lastIndex = 0;

  for (let match = ANSI_FULL_REGEX.exec(text); match !== null; match = ANSI_FULL_REGEX.exec(text)) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    tokens.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens;
}

function isAnsiToken(token: string): boolean {
  return token.startsWith('\x1b');
}

export function wrapLine(
  text: string,
  width: number,
  indentation = 0,
  mode: WrapMode = 'char'
): string[] {
  const indent = ' '.repeat(indentation);
  // Simplified implementation for demonstration.
  // A more robust implementation would handle word wrapping with ANSI codes.
  return text.split('\n').map(line => indent + line);
}