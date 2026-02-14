import { MAX_WIDTH } from "./console-reporter"; 

// ─── ANSI handling ─────────────────────────────────────────
export const ANSI_FULL_REGEX =
  /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;

export function visibleWidth(text: string): number {
  return [...text.replace(ANSI_FULL_REGEX, "")].length;
}

export type WrapMode = "word" | "char";

// ─── Line wrapping ─────────────────────────────────────────
export function wrapLine(
  text: string,
  width: number,
  indentation = 0,
  mode: WrapMode = "char"
): string[] {
  // Remove all newlines (do not replace with space), then normalize whitespace
  const normalized = text
    .replace(/\r?\n/g, "")
    .replace(/[\uFEFF\xA0\t]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const indent = " ".repeat(indentation);
  const indentWidth = indent.length;
  if (width <= indentWidth) width = indentWidth + 1;
  const availableWidth = width - indentWidth;
  return mode === "char"
    ? wrapByChar(normalized, availableWidth, indent)
    : wrapByWord(normalized, availableWidth, indent);
}

function wrapByChar(text: string, available: number, indent: string): string[] {
  const lines: string[] = [];
  let buf = "";
  let vis = 0;

  const tokens = text.split(ANSI_FULL_REGEX);

  for (const token of tokens) {
    if (ANSI_FULL_REGEX.test(token)) {
      buf += token;
      continue;
    }

    for (const ch of [...token]) {
      if (vis >= available) {
        lines.push(indent + buf);
        buf = "";
        vis = 0;
      }
      buf += ch;
      vis++;
    }
  }

  if (buf) lines.push(indent + buf);
  return lines;
}

function wrapByWord(text: string, available: number, indent: string): string[] {
  const lines: string[] = [];
  let buf = "";
  let vis = 0;
  let word = "";
  let wordVis = 0;

  const flushWord = () => {
    if (!word) return;

    if (wordVis > available) {
      for (const ch of [...word]) {
        if (vis >= available) {
          lines.push(indent + buf.trimEnd());
          buf = "";
          vis = 0;
        }
        buf += ch;
        vis++;
      }
    } else {
      if (vis + wordVis > available && vis > 0) {
        lines.push(indent + buf.trimEnd());
        buf = "";
        vis = 0;
      }
      buf += word;
      vis += wordVis;
    }

    word = "";
    wordVis = 0;
  };

  for (const ch of [...text]) {
    if (/\s/.test(ch)) {
      flushWord();
      if (vis < available && vis > 0) {
        buf += " ";
        vis++;
      }
    } else {
      word += ch;
      wordVis++;
    }
  }

  flushWord();
  if (buf) lines.push(indent + buf.trimEnd());
  return lines;
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

  visibleWidth(str: string): number {
    return [...str.replace(ANSI_FULL_REGEX, "")].length;
  }

  clearLine() {
    process.stdout.write("\r\x1b[K");
  }

  private writeLine(line: string, color = "") {
    this.clearLine();
    process.stdout.write(color + line + colors.reset);

    // ⭐ critical fix: force newline when width is exhausted
    if (this.visibleWidth(line) >= MAX_WIDTH) {
      process.stdout.write("\n");
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

  // ─── REFORMAT (RESTORED) ─────────────────────────────────

  reformat(text: string, opts: ReformatOptions): string[] {
    const { width, align = "left", padChar = " " } = opts;
    // Remove all newlines (do not replace with space), then normalize whitespace
    const normalized = text
      .replace(/\r?\n/g, "")
      .replace(/[\uFEFF\xA0\t]/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
    let result: string[] = [];
    let buf = "";
    let vis = 0;
    const tokens = normalized.split(
      /(\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\)))/g
    );
    for (const token of tokens) {
      if (ANSI_FULL_REGEX.test(token)) {
        buf += token;
        continue;
      }
      for (const ch of [...token]) {
        if (vis >= width) {
          result.push(this.applyPadding(buf, vis, width, align, padChar));
          buf = "";
          vis = 0;
        }
        buf += ch;
        vis++;
      }
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
    const lines = wrapLine(
      this.showPrompt ? this.prompt + msg : msg,
      MAX_WIDTH,
      0,
      "word"
    );

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
    const lines = wrapLine(
      this.showPrompt ? this.errorPrompt + msg : msg,
      MAX_WIDTH,
      0,
      "word"
    );

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
