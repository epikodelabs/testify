import { supportsColor } from './ansi-constants';
import { LOG_MESSAGES, LogMessageTemplate } from './messages';
import { replacePlaceholders } from './symbols';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  brightRed: '\x1b[91m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  brightGreen: '\x1b[92m',
  gray: '\x1b[90m',
};

type LogMessageKey = keyof typeof LOG_MESSAGES;

interface LoggedLine {
  text: string;
  isRaw?: boolean;
  hasPrompt?: boolean;
}

export class Logger {
  private previousLines: LoggedLine[] = [];
  private showPrompt = true;
  private prompt: string;
  private errorPrompt: string;
  private plainPrompt = '> ';
  private plainErrorPrompt = '> ';

  constructor() {
    this.prompt = `${colors.bold}${colors.brightGreen}> ${colors.reset}`;
    this.errorPrompt = `${colors.brightRed}> ${colors.reset}`;
  }

  // ─── New API: structured log messages ────────────────────

  public log<T extends LogMessageKey>(
    key: T,
    ...args: Parameters<(typeof LOG_MESSAGES)[T]['text']>
  ) {
    const template: LogMessageTemplate = LOG_MESSAGES[key];
    const rawMessage = template.text(...args);
    const { formattedMessage, stream } = this.formatStructured(rawMessage, template);
    stream.write(formattedMessage + '\n');
  }

  private formatStructured(
    rawMessage: string,
    template: LogMessageTemplate
  ): { formattedMessage: string; stream: NodeJS.WriteStream } {
    const { type, icon } = template;
    let color = colors.reset;
    let stream: NodeJS.WriteStream = process.stdout;
    let messageContent = rawMessage;

    switch (type) {
      case 'error':
        color = colors.red;
        stream = process.stderr;
        break;
      case 'warning':
        color = colors.yellow;
        break;
      case 'info':
        color = colors.cyan;
        break;
      case 'debug':
        color = colors.blue;
        break;
    }

    if (supportsColor()) {
      const iconStr = icon ? `${icon} ` : '';
      const prefixMatch = rawMessage.match(/^\[.*?\]\s*(.*)/);
      messageContent = prefixMatch && prefixMatch[1] ? prefixMatch[1] : rawMessage;
      return { formattedMessage: `${color}${iconStr}${messageContent}${colors.reset}`, stream };
    }

    const tag = `[${template.type.toUpperCase()}]`;
    const prefixMatch = rawMessage.match(/^\[.*?\]\s*(.*)/);
    messageContent = prefixMatch && prefixMatch[1] ? prefixMatch[1] : rawMessage;
    return { formattedMessage: `${tag} ${messageContent}`, stream };
  }

  // ─── Legacy API: direct printing ─────────────────────────

  print(msg: string) {
    msg = replacePlaceholders(msg);
    const prompt = supportsColor() ? this.prompt : this.plainPrompt;
    const fullMessage = this.showPrompt ? prompt + msg : msg;
    const lines = fullMessage.split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.writeLine(lines[i]);
      if (i < lines.length - 1) process.stdout.write('\n');
      this.addLine(lines[i]);
    }
    this.showPrompt = false;
    return true;
  }

  println(msg = '') {
    if (msg) this.print(msg);
    process.stdout.write('\n');
    this.addLine('');
    this.showPrompt = true;
    return true;
  }

  printRaw(line: string) {
    process.stdout.write(line);
    this.addLine(line, { isRaw: true });
    return true;
  }

  printlnRaw(line = '') {
    this.printRaw(line);
    process.stdout.write('\n');
    this.addLine('', { isRaw: true });
    return true;
  }

  error(msg: string) {
    msg = replacePlaceholders(msg);
    const prompt = supportsColor() ? this.errorPrompt : this.plainErrorPrompt;
    const fullMessage = this.showPrompt ? prompt + msg : msg;
    const lines = fullMessage.split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.writeLine(lines[i], colors.brightRed);
      if (i < lines.length - 1) process.stdout.write('\n');
      this.addLine(lines[i]);
    }
    process.stdout.write('\n');
    this.showPrompt = true;
    return true;
  }

  clearLine() {
    if (!supportsColor()) return;
    process.stdout.write('\r\x1b[K');
  }

  // ─── Utilities ───────────────────────────────────────────

  normalize(text: string): string {
    return text
      .replace(/\s*\r?\n\s*/g, '')
      .replace(/[\uFEFF\xA0\t]/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  visibleWidth(str: string): number {
    const ANSI_FULL_REGEX =
      /\x1B(?:[@-Z\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;
    return [...str.replace(ANSI_FULL_REGEX, '')].length;
  }

  // ─── Internal helpers ────────────────────────────────────

  private writeLine(line: string, color = '') {
    if (supportsColor()) {
      this.clearLine();
      process.stdout.write(color + line + colors.reset);
    } else {
      process.stdout.write(line);
    }
  }

  private addLine(text: string, opts: Partial<LoggedLine> = {}) {
    this.previousLines.push({
      text,
      isRaw: opts.isRaw,
      hasPrompt: opts.hasPrompt ?? this.showPrompt,
    });
    if (this.previousLines.length > 200) {
      this.previousLines.splice(0, 100);
    }
  }
}

// Export a singleton instance for project-wide use
export const logger = new Logger();
