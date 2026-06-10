import { getMaxWidth } from "./ansi-constants"; 

// ─── ANSI handling ─────────────────────────────────────────
export const ANSI_FULL_REGEX =
  /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;

export function visibleWidth(text: string): number {
  return [...text.replace(ANSI_FULL_REGEX, "")].length;
}

export type WrapMode = "word" | "char";
const MIN_LONG_WORD_REMAINDER = 4;

// ─── Text normalization ────────────────────────────────────
export function normalize(text: string): string {
  return text
    .replace(/\s*\r?\n\s*/g, "")   // strip newlines and surrounding whitespace
    .replace(/[\uFEFF\xA0\t]/g, " ")
    .replace(/\s{2,}/g, " ")
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

function toDisplayUnits(text: string): DisplayUnit[] {
  const units: DisplayUnit[] = [];

  for (const token of splitAnsiTokens(text)) {
    if (isAnsiToken(token)) {
      units.push({ value: token, visible: 0, whitespace: false });
      continue;
    }

    for (const ch of [...token]) {
      units.push({
        value: ch,
        visible: 1,
        whitespace: /\s/.test(ch),
      });
    }
  }

  return units;
}

// ─── Line wrapping ─────────────────────────────────────────
export function wrapLine(
  text: string,
  width: number,
  indentation = 0,
  mode: WrapMode = "char"
): string[] {
  const indent = " ".repeat(indentation);
  return text.split('\n').map(line => indent + line);
}

// ─── ANSI colors ───────────────────────────────────────────
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  brightRed: "\x1b[91m",
  green: "\x1b[32m",
  brightGreen: "\x1b[92m",
  gray: "\x1b[90m",
};

// ─── Types ────────────────────────────────────────────────
interface LoggedLine {
  text: string;
  isRaw?: boolean;
  hasPrompt?: boolean;
}

interface LoggerOptions {
  onError?: (msg: string) => void;
  promptColor?: string;
  errorPromptColor?: string;
}

export type Align = "left" | "center" | "right";

export interface ReformatOptions {
  width: number;
  align?: Align;
  padChar?: string;
  trim?: boolean;
}

// ─── Logger ───────────────────────────────────────────────
export class Logger {
  private previousLines: LoggedLine[] = [];
  private showPrompt = true;
  private prompt: string;
  private errorPrompt: string;

  constructor(options: LoggerOptions = {}) {
    this.prompt = `${colors.bold}${options.promptColor ?? colors.brightGreen}> ${colors.reset}`;
    this.errorPrompt = `${options.errorPromptColor ?? colors.brightRed}> ${colors.reset}`;
  }

  // ─── Utilities ───────────────────────────────────────────

  normalize(text: string): string {
    return normalize(text);
  }

  visibleWidth(str: string): number {
    return [...str.replace(ANSI_FULL_REGEX, "")].length;
  }

  clearLine() {
    process.stdout.write("\r\x1b[K");
  }

  private writeLine(line: string, color = "") {
    this.clearLine();
    process.stdout.write(color + line + colors.reset);
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

  // ─── REFORMAT (RESTORED) ─────────────────────────────────

  reformat(text: string, opts: ReformatOptions): string[] {
    const { width, align = "left", padChar = " " } = opts;
    const normalized = normalize(text);
    let result: string[] = [];
    let buf = "";
    let vis = 0;
    for (const unit of toDisplayUnits(normalized)) {
      if (unit.visible === 0) {
        buf += unit.value;
        continue;
      }

      if (vis >= width) {
        result.push(this.applyPadding(buf, vis, width, align, padChar));
        buf = "";
        vis = 0;
      }
      buf += unit.value;
      vis += unit.visible;
    }
    if (buf) {
      result.push(this.applyPadding(buf, vis, width, align, padChar));
    }
    return result;
  }

  private applyPadding(
    text: string,
    visible: number,
    width: number,
    align: Align,
    padChar: string
  ): string {
    const pad = Math.max(0, width - visible);

    switch (align) {
      case "right":
        return padChar.repeat(pad) + text;
      case "center": {
        const left = Math.floor(pad / 2);
        const right = pad - left;
        return padChar.repeat(left) + text + padChar.repeat(right);
      }
      default:
        return text + padChar.repeat(pad);
    }
  }

  // ─── Printing ────────────────────────────────────────────

  print(msg: string) {
    const fullMessage = this.showPrompt ? this.prompt + msg : msg;
    const lines = fullMessage.split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.writeLine(lines[i]);
      if (i < lines.length - 1) process.stdout.write("\n");
      this.addLine(lines[i]);
    }

    this.showPrompt = false;
    return true;
  }

  println(msg = "") {
    if (msg) this.print(msg);
    process.stdout.write("\n");
    this.addLine("");
    this.showPrompt = true;
    return true;
  }

  printRaw(line: string) {
    process.stdout.write(line);
    this.addLine(line, { isRaw: true });
    return true;
  }

  printlnRaw(line = "") {
    this.printRaw(line);
    process.stdout.write("\n");
    this.addLine("", { isRaw: true });
    return true;
  }

  error(msg: string) {
    const fullMessage = this.showPrompt ? this.errorPrompt + msg : msg;
    const lines = fullMessage.split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.writeLine(lines[i], colors.brightRed);
      if (i < lines.length - 1) process.stdout.write("\n");
      this.addLine(lines[i]);
    }

    process.stdout.write("\n");
    this.showPrompt = true;
    return true;
  }

  // ─── History ─────────────────────────────────────────────

  clearHistory() {
    this.previousLines = [];
  }

  getHistory(): LoggedLine[] {
    return [...this.previousLines];
  }
}

export const logger = new Logger();
