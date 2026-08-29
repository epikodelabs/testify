import { supportsColor } from './ansi-constants';
import { LOG_MESSAGES, LogMessageTemplate } from './messages';
import { replacePlaceholders } from './symbols';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  brightRed: '\x1b[91m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  brightGreen: '\x1b[92m',
  gray: '\x1b[90m',
};

type LogMessageKey = keyof typeof LOG_MESSAGES;

function areTestLogsSuppressed(): boolean {
  return (globalThis as any).__testifySuppressLogs === true;
}

interface LoggedLine {
  text: string;
  isRaw?: boolean;
  hasPrompt?: boolean;
}

export class Logger {
  private previousLines: LoggedLine[] = [];
  private showPrompt = true;
  private prompt: string;
  private plainPrompt = '> ';

  constructor() {
    this.prompt = `${colors.bold}${colors.brightGreen}> ${colors.reset}`;
  }

  // ─── New API: structured log messages ────────────────────

  public log<T extends LogMessageKey>(
    key: T,
    ...args: Parameters<(typeof LOG_MESSAGES)[T]['text']>
  ) {
    if (areTestLogsSuppressed()) return;

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
    if (areTestLogsSuppressed()) return true;

    const prompt =
      supportsColor()
        ? this.prompt
        : this.plainPrompt;
    const lines = msg.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const formatted =
        this.formatLine(lines[i]);
      const renderedLine =
        i === 0 &&
        this.showPrompt &&
        !formatted.hasOwnPrompt
          ? prompt + formatted.text
          : formatted.text;

      this.writeLine(
        renderedLine,
        formatted.color,
      );
      if (i < lines.length - 1) process.stdout.write('\n');
      this.addLine(renderedLine);
    }
    this.showPrompt = false;
    return true;
  }

  println(msg = '') {
    if (areTestLogsSuppressed()) return true;

    if (msg) this.print(msg);
    process.stdout.write('\n');
    this.addLine('');
    this.showPrompt = true;
    return true;
  }

  printRaw(line: string) {
    if (areTestLogsSuppressed()) return true;

    process.stdout.write(line);
    this.addLine(line, { isRaw: true });
    return true;
  }

  printlnRaw(line = '') {
    if (areTestLogsSuppressed()) return true;

    this.printRaw(line);
    process.stdout.write('\n');
    this.addLine('', { isRaw: true });
    return true;
  }

  error(msg: string) {
    if (areTestLogsSuppressed()) return true;

    msg = this.stripLegacyPrefix(
      msg,
      'error',
    );
    const lines = msg.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const formatted =
        this.formatLine(
          lines[i],
          {
            forceErrorPrefix:
              i === 0,
            forceColor:
              supportsColor()
                ? colors.red
                : '',
          },
        );

      this.writeLine(
        formatted.text,
        formatted.color,
      );
      if (i < lines.length - 1) process.stdout.write('\n');
      this.addLine(
        formatted.text,
      );
    }
    process.stdout.write('\n');
    this.showPrompt = true;
    return true;
  }

  warn(msg: string) {
    if (areTestLogsSuppressed()) return true;

    msg = this.stripLegacyPrefix(
      msg,
      'warn',
    );
    const lines = msg.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const formatted =
        this.formatLine(
          lines[i],
          {
            forceWarnPrefix:
              i === 0,
          },
        );

      this.writeLine(
        formatted.text,
        formatted.color,
      );
      if (i < lines.length - 1) process.stdout.write('\n');
      this.addLine(
        formatted.text,
      );
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

  private formatLine(
    line: string,
    options: {
      forceErrorPrefix?: boolean;
      forceWarnPrefix?: boolean;
      forceColor?: string;
    } = {},
  ): {
    text: string;
    color: string;
    hasOwnPrompt: boolean;
  } {
    const errorToken =
      '%error% ';
    const warnToken =
      '%warn% ';
    const shouldPrefixError =
      options.forceErrorPrefix &&
      !line.startsWith(errorToken);
    const shouldPrefixWarn =
      options.forceWarnPrefix &&
      !line.startsWith(warnToken);
    const sourceLine =
      shouldPrefixError
        ? errorToken + line
        : shouldPrefixWarn
          ? warnToken + line
          : line;

    if (
      sourceLine.startsWith(
        errorToken,
      )
    ) {
      return {
        text:
          this.errorPrefix() +
          replacePlaceholders(
            sourceLine.slice(
              errorToken.length,
            ),
          ),
        color:
          options.forceColor ??
          (supportsColor()
            ? colors.red
            : ''),
        hasOwnPrompt: true,
      };
    }

    if (
      sourceLine.startsWith(
        warnToken,
      )
    ) {
      return {
        text:
          this.warnPrefix() +
          replacePlaceholders(
            sourceLine.slice(
              warnToken.length,
            ),
          ),
        color: '',
        hasOwnPrompt: true,
      };
    }

    return {
      text: replacePlaceholders(
        sourceLine,
      ),
      color:
        options.forceColor ?? '',
      hasOwnPrompt: false,
    };
  }

  private stripLegacyPrefix(
    message: string,
    type: 'error' | 'warn',
  ): string {
    const marker =
      type === 'error'
        ? '%error%'
        : '%warn%';

    return message
      .split('\n')
      .map((line) =>
        line.replace(
          new RegExp(
            `^(?:${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+|\\[(?:ERROR|WARN|INFO|BROWSER|FILE|TREE|STOP|TIP|START|WAIT|READY|ADD|REM|DIR|BUILD|RETRY|CLEAN|LOCK|HMR|WS|CONN|OK|WATCH)\\]|[^\\p{L}\\p{N}\\s"'\\\`([{<]+)\\s+`,
            'u',
          ),
          '',
        ),
      )
      .join('\n');
  }

  private errorPrefix(): string {
    return supportsColor()
      ? `${colors.bold}${colors.black}${colors.bgRed} ERROR ${colors.red}`
      : '[ERROR] ';
  }

  private warnPrefix(): string {
    return supportsColor()
      ? `${colors.bold}${colors.black}${colors.bgYellow} WARN ${colors.reset}`
      : 'WARN ';
  }

}

// Export a singleton instance for project-wide use
export const logger = new Logger();
