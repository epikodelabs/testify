import { supportsColor } from './ansi-constants';
import { LOG_MESSAGES, LogMessageTemplate } from './messages';
import { replacePlaceholders } from './symbols';
import {
  InkTextStyle,
  renderTerminalPanel,
  renderTerminalText,
  startLiveTerminalView,
  type LiveTerminalView,
} from './ink-output';

type LogMessageKey = keyof typeof LOG_MESSAGES;

const LEGACY_LOG_TAG_PREFIX =
  /^\[(?:ERROR|WARN|INFO|BROWSER|FILE|TREE|STOP|TIP|START|WAIT|READY|ADD|REM|DIR|BUILD|RETRY|CLEAN|LOCK|HMR|WS|CONN|OK|WATCH)\]\s*/;

const LEADING_BADGE_PREFIX =
  /^[^\p{L}\p{N}\s"'([{<]+\s+/u;

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
  private plainPrompt = '> ';
  private preparationLines: string[] | null = null;
  private preparationFlushed = false;
  private preparationView: LiveTerminalView | null = null;

  // ─── New API: structured log messages ────────────────────

  public log<T extends LogMessageKey>(
    key: T,
    ...args: Parameters<(typeof LOG_MESSAGES)[T]['text']>
  ) {
    if (areTestLogsSuppressed()) return;

    const template: LogMessageTemplate = LOG_MESSAGES[key];
    const rawMessage = template.text(...args);
    const { formattedMessage, style, stream } = this.formatStructured(rawMessage, template);
    stream.write(renderTerminalText(formattedMessage, style) + '\n');
  }

  private formatStructured(
    rawMessage: string,
    template: LogMessageTemplate
  ): { formattedMessage: string; style: InkTextStyle; stream: NodeJS.WriteStream } {
    const { type, icon } = template;
    let style: InkTextStyle = {};
    let stream: NodeJS.WriteStream = process.stdout;
    let messageContent = rawMessage;

    switch (type) {
      case 'error':
        style = { color: 'red' };
        stream = process.stderr;
        break;
      case 'warning':
        style = { color: 'yellow' };
        break;
      case 'info':
        style = { color: 'cyan' };
        break;
      case 'debug':
        style = { color: 'blue' };
        break;
    }

    if (supportsColor()) {
      const iconStr = icon ? `${icon} ` : '';
      const prefixMatch = rawMessage.match(/^\[.*?\]\s*(.*)/);
      messageContent = prefixMatch && prefixMatch[1] ? prefixMatch[1] : rawMessage;
      return { formattedMessage: `${iconStr}${messageContent}`, style, stream };
    }

    const tag = `[${template.type.toUpperCase()}]`;
    const prefixMatch = rawMessage.match(/^\[.*?\]\s*(.*)/);
    messageContent = prefixMatch && prefixMatch[1] ? prefixMatch[1] : rawMessage;
    return { formattedMessage: `${tag} ${messageContent}`, style, stream };
  }

  // ─── Legacy API: direct printing ─────────────────────────

  print(msg: string) {
    if (areTestLogsSuppressed()) return true;

    const prompt =
      supportsColor()
        ? renderTerminalText('> ', { bold: true, color: 'green' })
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

    // Preparation is assembled as one card. Legacy callers still use
    // `println`, so absorb their ordinary setup notices instead of leaking
    // prompt-style rows above or below that card.
    if (msg && this.preparationLines) {
      this.preparationStep('STATUS', msg);
      return true;
    }
    if (msg && this.preparationFlushed) {
      this.printRuntimePanel('STATUS', msg, 'cyan');
      return true;
    }

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

  /** Collect setup messages so Ink can render one bounded preparation panel. */
  preparationStart(_message: string) {
    if (areTestLogsSuppressed()) return true;
    this.preparationLines ??= [];
    this.preparationFlushed = false;
    if (!this.preparationView && supportsColor() && process.stdout.isTTY) {
      this.preparationView = startLiveTerminalView(this.renderPreparationPanel());
    }
    return true;
  }

  preparationStep(label: string, message: string, _complete = false) {
    if (areTestLogsSuppressed()) return true;
    if (!this.preparationLines && this.preparationFlushed) {
      this.printRuntimePanel(label, message, 'cyan');
      return true;
    }
    this.preparationLines ??= [];
    const severity = /^%(error|warn)%\s*/i.exec(message)?.[1]?.toLowerCase();
    const labelText = label.trim();
    const badge = ` ${labelText} `;
    const columnPadding = ' '.repeat(Math.max(0, 12 - badge.length));
    const normalColumn =
      renderTerminalText(labelText, { color: 'white', backgroundColor: 'black' }) +
      ' '.repeat(Math.max(0, 12 - labelText.length));
    const styledColumn = severity === 'error'
      ? renderTerminalText(badge, { bold: true, color: 'white', backgroundColor: 'red' }) + columnPadding
      : severity === 'warn'
        ? renderTerminalText(badge, { bold: true, color: 'black', backgroundColor: 'yellow' }) + columnPadding
        : normalColumn;
    this.preparationLines.push(
      `${styledColumn} ${this.cleanPreparationMessage(message)}`,
    );
    this.preparationView?.update(this.renderPreparationPanel());
    return true;
  }

  /** Print the preparation card once, immediately before execution begins. */
  flushPreparation() {
    if (areTestLogsSuppressed() || !this.preparationLines) return true;

    if (this.preparationView) {
      // The interactive view is already in the terminal; retain its final
      // frame and let the following section start on the next line.
      this.preparationView.stop(true);
      this.preparationView = null;
    } else {
      this.printRaw(this.renderPreparationPanel() + '\n');
    }
    this.preparationLines = null;
    this.preparationFlushed = true;
    return true;
  }

  error(msg: string) {
    if (areTestLogsSuppressed()) return true;
    if (this.preparationLines) {
      this.preparationStep('ERROR', msg);
      return true;
    }
    if (this.preparationFlushed) {
      this.printRuntimePanel('ERROR', msg, 'red');
      return true;
    }

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
                ? 'red'
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
    if (this.preparationLines) {
      this.preparationStep('WARN', msg);
      return true;
    }
    if (this.preparationFlushed) {
      this.printRuntimePanel('WARNING', msg, 'yellow');
      return true;
    }

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
      process.stdout.write(renderTerminalText(line, color ? { color } : {}));
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
            ? 'red'
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
      .map((line) => {
        if (
          line.startsWith(
            marker + ' ',
          )
        ) {
          return line.slice(
            marker.length + 1,
          );
        }

        if (
          LEGACY_LOG_TAG_PREFIX.test(
            line,
          )
        ) {
          return line.replace(
            LEGACY_LOG_TAG_PREFIX,
            '',
          );
        }

        return line.replace(
          LEADING_BADGE_PREFIX,
          '',
        );
      })
      .join('\n');
  }

  private cleanPreparationMessage(message: string): string {
    return replacePlaceholders(
      message.replace(/^%[a-z_]+%\s*/i, ''),
    )
      .replace(LEGACY_LOG_TAG_PREFIX, '')
      .replace(LEADING_BADGE_PREFIX, '');
  }

  private printRuntimePanel(title: string, message: string, tone: string): void {
    const lines = message
      .split('\n')
      .map((line) => this.cleanPreparationMessage(line))
      .filter(Boolean);
    this.printRaw(
      '\n' + renderTerminalPanel(title, lines, tone, supportsColor()) + '\n',
    );
  }

  private renderPreparationPanel(): string {
    return renderTerminalPanel(
      'PREPARING TEST ENVIRONMENT',
      this.preparationLines ?? [],
      'cyan',
      supportsColor(),
      true,
    );
  }

  private errorPrefix(): string {
    return supportsColor()
      ? renderTerminalText(' ERROR ', { bold: true, color: 'black', backgroundColor: 'red' }) + ' '
      : '[ERROR] ';
  }

  private warnPrefix(): string {
    return supportsColor()
      ? renderTerminalText(' WARN ', { bold: true, color: 'black', backgroundColor: 'yellow' })
      : 'WARN ';
  }

}

// Export a singleton instance for project-wide use
export const logger = new Logger();
