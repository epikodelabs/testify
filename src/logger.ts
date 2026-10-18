import { getMaxWidth, supportsColor } from './ansi-constants';
import { LOG_MESSAGES, LogMessageTemplate } from './messages';
import { replacePlaceholders } from './symbols';
import { sanitizeTerminalText } from './utils';
import { errorHint } from './preparation-error-insights';
import {
  InkTextStyle,
  PANEL_RULE,
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

type PreparationStatus = 'pending' | 'running' | 'complete' | 'warning' | 'failed' | 'skipped';
type PreparationDiagnosticSeverity = 'warning' | 'error' | 'hint';

interface PreparationItem {
  label: string;
  message: string;
  status: PreparationStatus;
}

interface PreparationDiagnostic {
  severity: PreparationDiagnosticSeverity;
  message: string;
  stepLabel?: string;
  hint?: string;
}

export interface PreparationPlanStep {
  label: string;
  message: string;
}

export interface LoggerOptions {
  /** Disable terminal side effects while retaining the full logger state machine. */
  output?: boolean;
}

export class Logger {
  private previousLines: LoggedLine[] = [];
  private showPrompt = true;
  private plainPrompt = '> ';
  private preparationLines: string[] | null = null;
  private preparationItems: PreparationItem[] | null = null;
  private preparationDiagnostics: PreparationDiagnostic[] | null = null;
  private preparationActiveLabel: string | null = null;
  private preparationFlushed = false;
  private preparationView: LiveTerminalView | null = null;
  private preparationContext = '';
  private readonly outputEnabled: boolean;

  constructor(options: LoggerOptions = {}) {
    this.outputEnabled = options.output !== false;
  }

  // ─── New API: structured log messages ────────────────────

  public log<T extends LogMessageKey>(
    key: T,
    ...args: Parameters<(typeof LOG_MESSAGES)[T]['text']>
  ) {
    if (areTestLogsSuppressed() || !this.outputEnabled) return;

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
    if (areTestLogsSuppressed() || !this.outputEnabled) return true;

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
    if (areTestLogsSuppressed() && this.outputEnabled) return true;

    // Preparation is assembled as one card. Legacy callers still use
    // `println`, so absorb their ordinary setup notices instead of leaking
    // prompt-style rows above or below that card.
    if (msg && this.preparationLines) {
      if (/^%bulb%\s*/i.test(msg)) this.preparationDiagnostic('hint', msg);
      else this.preparationStep('STATUS', msg);
      return true;
    }
    if (msg && this.preparationFlushed) {
      if (/^%bulb%\s*/i.test(msg)) this.printRuntimePanel('TIP', msg, 'yellow');
      else this.printRuntimePanel('STATUS', msg, 'cyan');
      return true;
    }
    if (!this.outputEnabled) return true;

    if (msg) this.print(msg);
    process.stdout.write('\n');
    this.addLine('');
    this.showPrompt = true;
    return true;
  }

  /** Surface an actionable tip with the standardized hint row style. */
  hint(msg: string) {
    if (areTestLogsSuppressed() && this.outputEnabled) return true;
    if (this.preparationLines) {
      this.preparationDiagnostic('hint', msg);
      return true;
    }
    if (this.preparationFlushed) {
      this.printRuntimePanel('TIP', msg, 'yellow');
      return true;
    }
    if (!this.outputEnabled) return true;

    const text = this.cleanPreparationMessage(msg);
    const rich = supportsColor();
    const line = rich
      ? renderTerminalText(`↳  ${text}`, { color: 'yellow' })
      : `[TIP] ${text}`;
    this.writeLine(line);
    process.stdout.write('\n');
    this.addLine(line);
    this.showPrompt = true;
    return true;
  }

  printRaw(line: string) {
    if (areTestLogsSuppressed() || !this.outputEnabled) return true;

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

  /** Start one live preparation surface. The banner remains completely separate. */
  preparationStart(_message: string) {
    if (areTestLogsSuppressed() && this.outputEnabled) return true;
    // Preparation has single ownership of the terminal before execution. Once
    // flushed, later runner/mode activity must never reopen the live surface.
    if (this.preparationFlushed) return true;
    this.preparationLines ??= [];
    this.preparationItems ??= [];
    this.preparationDiagnostics ??= [];
    // Cursor-based replacement cannot reliably account for terminal-wrapped
    // rows. Keep narrow terminals append-only and print their complete card
    // once at the execution boundary instead of leaving duplicate frames.
    if (
      this.outputEnabled &&
      !this.preparationView &&
      supportsColor() &&
      process.stdout.isTTY &&
      getMaxWidth() >= 80
    ) {
      this.preparationView = startLiveTerminalView(this.renderPreparationPanel());
    }
    return true;
  }

  /**
   * Declare the complete preparation pipeline before any work starts.
   * Every execution branch uses this same list; steps that do not apply to the
   * selected branch remain visible and are marked skipped when preparation ends.
   */
  preparationContextLabel(context: string) {
    if ((areTestLogsSuppressed() && this.outputEnabled) || this.preparationFlushed) return true;
    this.preparationContext = context.trim().toUpperCase();
    this.preparationView?.update(this.renderPreparationPanel());
    return true;
  }

  preparationPlan(steps: readonly PreparationPlanStep[]) {
    if ((areTestLogsSuppressed() && this.outputEnabled) || this.preparationFlushed) return true;
    const previous = new Map(
      (this.preparationItems ?? []).map((item) => [item.label, item] as const),
    );
    this.preparationItems = steps.map((step) => {
      const label = step.label.trim();
      const existing = previous.get(label);
      return {
        label,
        message: existing?.status === 'complete' || existing?.status === 'warning' || existing?.status === 'failed'
          ? existing.message
          : step.message,
        status: existing?.status ?? 'pending' as const,
      };
    });
    if (
      this.preparationActiveLabel &&
      !this.preparationItems.some((item) => item.label === this.preparationActiveLabel)
    ) {
      this.preparationActiveLabel = null;
    }
    this.syncPreparationLines();
    return true;
  }

  preparationStep(label: string, message: string, complete = false) {
    if (areTestLogsSuppressed() && this.outputEnabled) return true;
    if (!this.preparationItems && this.preparationFlushed) {
      this.printRuntimePanel(label, message, 'cyan');
      return true;
    }

    this.preparationItems ??= [];
    const labelText = label.trim();
    const severity = /^%(error|warn)%\s*/i.exec(message)?.[1]?.toLowerCase();

    // A newly active step closes the previous active row. This keeps callers
    // lightweight while still making the list behave as a real stage tracker.
    for (const item of this.preparationItems) {
      if (item.status === 'running' && item.label !== labelText) item.status = 'complete';
    }

    let item = this.preparationItems.find((candidate) => candidate.label === labelText);
    if (!item) {
      item = { label: labelText, message: '', status: 'pending' };
      this.preparationItems.push(item);
    }
    item.message = this.cleanPreparationMessage(message);
    const nextStatus: PreparationStatus = severity === 'error'
      ? 'failed'
      : severity === 'warn'
        ? 'warning'
        : complete
          ? 'complete'
          : 'running';

    // Once a stage has emitted a warning/error, later progress/completion
    // updates must not repaint it as a clean success. The stage can continue,
    // but its final state still reflects the most severe diagnostic observed.
    if (item.status === 'failed' && nextStatus !== 'failed') {
      item.status = 'failed';
    } else if (item.status === 'warning' && nextStatus !== 'failed' && nextStatus !== 'warning') {
      item.status = 'warning';
    } else {
      item.status = nextStatus;
    }

    this.preparationActiveLabel = complete ? null : labelText;
    this.syncPreparationLines();
    return true;
  }

  preparationComplete(label: string, message?: string) {
    if ((areTestLogsSuppressed() && this.outputEnabled) || this.preparationFlushed) return true;
    const item = this.preparationItems?.find((candidate) => candidate.label === label.trim());
    if (!item) return true;
    if (message) item.message = this.cleanPreparationMessage(message);
    if (item.status !== 'warning' && item.status !== 'failed') {
      item.status = 'complete';
    }
    if (this.preparationActiveLabel === item.label) {
      this.preparationActiveLabel = null;
    }
    this.syncPreparationLines();
    return true;
  }

  preparationSkip(label: string, message?: string) {
    if ((areTestLogsSuppressed() && this.outputEnabled) || this.preparationFlushed) return true;
    const item = this.preparationItems?.find((candidate) => candidate.label === label.trim());
    if (!item) return true;
    if (message) item.message = this.cleanPreparationMessage(message);
    item.status = 'skipped';
    if (this.preparationActiveLabel === item.label) {
      this.preparationActiveLabel = null;
    }
    this.syncPreparationLines();
    return true;
  }

  /** Print the preparation card once, immediately before execution begins. */
  flushPreparation() {
    if ((areTestLogsSuppressed() && this.outputEnabled) || !this.preparationLines) return true;

    const failed = this.preparationHasErrors();
    if (this.preparationItems) {
      for (const item of this.preparationItems) {
        if (item.status === 'running') item.status = failed ? 'skipped' : 'complete';
        else if (item.status === 'pending') item.status = 'skipped';
      }
      this.syncPreparationLines();
    }

    if (!this.outputEnabled) {
      // State-only loggers are used by contract tests and embedders. They run
      // the exact preparation lifecycle without ever taking terminal ownership.
    } else if (this.preparationView) {
      // The interactive view is already in the terminal; retain its final
      // frame and let the following section start on the next line.
      this.preparationView.stop(!failed);
      if (failed) process.stderr.write(this.renderPreparationPanel() + '\n');
      else process.stdout.write('\n');
      this.preparationView = null;
    } else {
      const panel = this.renderPreparationPanel() + '\n';
      if (failed) {
        process.stderr.write(panel);
        this.addLine(panel, { isRaw: true });
      } else {
        this.printRaw(panel);
      }
    }
    this.preparationLines = null;
    this.preparationItems = null;
    this.preparationDiagnostics = null;
    this.preparationActiveLabel = null;
    this.preparationFlushed = true;
    return true;
  }

  error(msg: string, hint?: string) {
    // State-only loggers must keep recording diagnostics under suppression;
    // only loggers that own stdout stand down (same contract as the
    // preparation lifecycle methods).
    if (areTestLogsSuppressed() && this.outputEnabled) return true;
    if (this.preparationLines) {
      this.preparationDiagnostic('error', msg, hint);
      return true;
    }
    if (this.preparationFlushed) {
      this.printRuntimePanel('ERROR', msg, 'red', hint);
      return true;
    }
    if (!this.outputEnabled) return true;

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
        process.stderr,
      );
      if (i < lines.length - 1) process.stderr.write('\n');
      this.addLine(
        formatted.text,
      );
    }
    const resolvedHint = hint ?? errorHint(msg);
    if (resolvedHint) this.printStandaloneHint(resolvedHint, process.stderr);
    process.stderr.write('\n');
    this.showPrompt = true;
    return true;
  }

  warn(msg: string, hint?: string) {
    if (areTestLogsSuppressed() && this.outputEnabled) return true;
    if (this.preparationLines) {
      this.preparationDiagnostic('warning', msg, hint);
      return true;
    }
    if (this.preparationFlushed) {
      this.printRuntimePanel('WARNING', msg, 'yellow', hint);
      return true;
    }
    if (!this.outputEnabled) return true;

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

  private writeLine(line: string, color = '', stream: NodeJS.WriteStream = process.stdout) {
    if (!this.outputEnabled) return;
    if (supportsColor()) {
      if (stream === process.stdout) this.clearLine();
      stream.write(renderTerminalText(line, color ? { color } : {}));
    } else {
      stream.write(line);
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

  private syncPreparationLines(): void {
    if (!this.preparationItems) return;
    const diagnostics = this.preparationDiagnostics ?? [];
    this.preparationLines = [
      ...this.preparationItems.map((item) => this.renderPreparationItem(item)),
      ...(diagnostics.length > 0 ? [PANEL_RULE] : []),
      ...diagnostics.flatMap((diagnostic) =>
        this.renderPreparationDiagnostic(diagnostic),
      ),
    ];
    this.preparationView?.update(this.renderPreparationPanel());
  }

  /** True once any step failed or an error diagnostic was buffered. */
  hasPreparationErrors(): boolean {
    return this.preparationHasErrors();
  }

  private preparationHasErrors(): boolean {
    return (
      this.preparationDiagnostics?.some((diagnostic) => diagnostic.severity === 'error') === true ||
      this.preparationItems?.some((item) => item.status === 'failed') === true
    );
  }

  /**
   * Two diagnostics describe the same underlying failure when the newer
   * message re-wraps one already recorded: either verbatim (same headline) or
   * through another catch-site template (same first stack frame). Log-then-
   * throw call sites make this easy to regress, so the renderer deduplicates
   * defensively instead of stacking three dumps of one error.
   */
  private isDuplicateErrorDiagnostic(existing: PreparationDiagnostic, message: string): boolean {
    if (existing.severity !== 'error') return false;
    const headline = existing.message.split('\n')[0]?.trim();
    if (headline && message.includes(headline)) return true;
    const frame = /^at .+$/m.exec(existing.message)?.[0];
    return !!frame && message.includes(frame);
  }

  private preparationDiagnostic(
    severity: PreparationDiagnosticSeverity,
    message: string,
    hint?: string,
  ): void {
    this.preparationDiagnostics ??= [];
    const sanitized = this.cleanPreparationMessage(message);

    if (
      severity === 'error' &&
      this.preparationDiagnostics.some((existing) =>
        this.isDuplicateErrorDiagnostic(existing, sanitized),
      )
    ) {
      return;
    }

    const activeItem = severity !== 'hint' && this.preparationActiveLabel
      ? this.preparationItems?.find((item) => item.label === this.preparationActiveLabel)
      : undefined;

    if (activeItem) {
      if (severity === 'error') {
        activeItem.status = 'failed';
      } else if (activeItem.status !== 'failed') {
        activeItem.status = 'warning';
      }
    }

    this.preparationDiagnostics.push({
      severity,
      message: sanitized,
      stepLabel: activeItem?.label,
      hint: hint ?? (severity === 'error' || severity === 'warning'
        ? errorHint(sanitized)
        : undefined),
    });

    this.syncPreparationLines();
  }

  private renderPreparationDiagnostic(diagnostic: PreparationDiagnostic): string[] {
    const rich = this.outputEnabled && process.stdout.isTTY && supportsColor();

    if (diagnostic.severity === 'hint') {
      const symbol = rich
        ? renderTerminalText('↳', { color: 'yellow' })
        : '[TIP]';
      const lines = diagnostic.message.split('\n').filter(Boolean);
      const body = lines.length > 0 ? lines : [''];
      return body.map((line, index) => {
        const text = rich ? renderTerminalText(line, { color: 'yellow' }) : line;
        return index === 0
          ? `${symbol}  ${text}`
          : `${' '.repeat(rich ? 3 : symbol.length + 2)}${text}`;
      });
    }

    const isError = diagnostic.severity === 'error';
    const symbol = rich
      ? renderTerminalText(isError ? '✕' : '!', {
          bold: true,
          color: isError ? 'redBright' : 'yellow',
        })
      : isError
        ? '[ERROR]'
        : '[WARN]';
    // Rich rows spell the severity out next to the glyph; plain rows let the
    // [ERROR]/[WARN] glyph carry it alone instead of stuttering the label.
    const labelText = (isError ? 'ERROR' : 'WARNING').padEnd(12);
    const label = rich
      ? renderTerminalText(labelText, {
          bold: true,
          color: isError ? 'redBright' : 'yellow',
        })
      : '';
    const context = diagnostic.stepLabel ? `[${diagnostic.stepLabel}] ` : '';
    const lines = diagnostic.message.split('\n').filter(Boolean);
    const body = lines.length > 0 ? lines : [''];
    const detailIndent = rich
      ? `${' '.repeat(3)}${' '.repeat(labelText.length)} `
      : ' '.repeat(symbol.length + 2);
    const rendered = body.map((line, index) => {
      if (index === 0) {
        const headline = rich
          ? renderTerminalText(`${context}${line}`, { bold: true, color: isError ? 'redBright' : 'yellow' })
          : `${context}${line}`;
        return label
          ? `${symbol}  ${label} ${headline}`
          : `${symbol}  ${headline}`;
      }
      // Stack frames and continuation lines read as supporting detail: dim
      // gray, hanging-indented under the headline like the FAILURES panel.
      const detail = rich
        ? renderTerminalText(line, { color: 'gray', dimColor: true })
        : line;
      return `${detailIndent}${detail}`;
    });

    if (diagnostic.hint) {
      const hintSymbol = rich
        ? renderTerminalText('↳', { color: 'yellow' })
        : '->';
      const hintText = rich
        ? renderTerminalText(`Hint: ${diagnostic.hint}`, { color: 'yellow' })
        : `Hint: ${diagnostic.hint}`;
      rendered.push(`${detailIndent}${hintSymbol}  ${hintText}`);
    }

    return rendered;
  }

  private renderPreparationItem(item: PreparationItem): string {
    // Redirected/file output must be ASCII-safe. Do not generate rich Unicode
    // and try to sanitize it afterwards: on Windows the bytes may already have
    // been decoded with the active code page by then (for example ✓ -> тЬУ).
    const rich = this.outputEnabled && process.stdout.isTTY && supportsColor();
    const symbols: Record<PreparationStatus, string> = rich
      ? {
          pending: '○',
          running: '●',
          complete: '✓',
          warning: '!',
          failed: '×',
          skipped: '–',
        }
      : {
          pending: '[ ]',
          running: '[..]',
          complete: '[OK]',
          warning: '[WARN]',
          failed: '[FAIL]',
          skipped: '[SKIP]',
        };
    const colors: Partial<Record<PreparationStatus, InkTextStyle['color']>> = {
      running: 'cyan',
      complete: 'green',
      warning: 'yellow',
      failed: 'red',
      skipped: 'gray',
      pending: 'gray',
    };
    const symbol = rich ? renderTerminalText(symbols[item.status], {
      bold: item.status === 'running' || item.status === 'failed',
      color: colors[item.status],
    }) : symbols[item.status];
    const labelText = item.label.padEnd(12);
    const label = rich ? renderTerminalText(labelText, {
      bold: item.status === 'running' || item.status === 'failed',
      color: item.status === 'running'
        ? 'cyan'
        : item.status === 'warning'
          ? 'yellow'
          : item.status === 'failed'
            ? 'red'
            : undefined,
    }) : labelText;
    const message = rich ? renderTerminalText(item.message, {
      color: item.status === 'pending' || item.status === 'skipped'
        ? 'gray'
        : item.status === 'warning'
          ? 'yellow'
          : item.status === 'failed'
            ? 'red'
            : undefined,
      dimColor: item.status === 'pending' || item.status === 'skipped',
    }) : item.message;
    return `${symbol}  ${label} ${message}`;
  }

  private cleanPreparationMessage(message: string): string {
    return sanitizeTerminalText(
      replacePlaceholders(
        message.replace(/^%[a-z_]+%\s*/i, ''),
      )
        .replace(LEGACY_LOG_TAG_PREFIX, '')
        .replace(LEADING_BADGE_PREFIX, ''),
    );
  }

  private printStandaloneHint(hint: string, stream: NodeJS.WriteStream = process.stdout): void {
    const rich = supportsColor();
    const line = rich
      ? renderTerminalText(`↳  Hint: ${hint}`, { color: 'yellow' })
      : `-> Hint: ${hint}`;
    this.writeLine(line, '', stream);
    this.addLine(line);
  }

  private printRuntimePanel(title: string, message: string, tone: string, hint?: string): void {
    const lines = message
      .split('\n')
      .map((line) => this.cleanPreparationMessage(line))
      .filter(Boolean);
    const rich = supportsColor();
    // Errors and warnings use the standardized block: bold colored headline,
    // dim gray detail, yellow hint row. Status and tips stay plain rows.
    const structured = (tone === 'red' || tone === 'yellow') && lines.length > 0;
    const rows = structured
      ? [
          renderTerminalText(lines[0], {
            bold: true,
            color: tone === 'red' ? 'redBright' : 'yellowBright',
          }),
          ...lines.slice(1).map((line) =>
            renderTerminalText(line, { color: 'gray', dimColor: true }),
          ),
          ...(hint
            ? [rich
                ? renderTerminalText(`↳  Hint: ${hint}`, { color: 'yellow' })
                : `-> Hint: ${hint}`]
            : []),
        ]
      : lines;
    const panel = renderTerminalPanel(title, rows, tone, rich) + '\n';
    if (tone === 'red') {
      if (this.outputEnabled) process.stderr.write(panel);
      this.addLine(panel, { isRaw: true });
    } else {
      this.printRaw(panel);
    }
  }

  private renderPreparationPanel(): string {
    const rich = this.outputEnabled && process.stdout.isTTY && supportsColor();
    const failed = this.preparationHasErrors();
    const context = rich
      ? this.preparationContext
      : this.preparationContext.replace(/\s*·\s*/g, ' - ');
    const heading = failed ? 'PREPARATION FAILED' : 'PREPARING TEST ENVIRONMENT';
    const tone = failed ? 'red' : 'magenta';
    const title = context
      ? `${heading}${rich ? '  ·  ' : ' - '}${context}`
      : heading;

    // Files, pipes and CI captures keep the section boundary, but render it
    // with the plain ASCII panel. This preserves structure without leaking
    // Unicode box drawing, ANSI styling, or interactive cursor controls.
    if (!rich) {
      return renderTerminalPanel(
        title,
        this.preparationLines ?? [],
        tone,
        false,
        true,
      );
    }

    return renderTerminalPanel(
      title,
      this.preparationLines ?? [],
      tone,
      true,
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
