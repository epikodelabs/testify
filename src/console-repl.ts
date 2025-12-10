// ─── Constants ──────────────────────────────────────────────
const MAX_WIDTH = 63;

// Matches all ESC-based ANSI / OSC control sequences
const ANSI_FULL_REGEX =
  /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;

// Returns *visible* column width (ignoring control sequences)
export function visibleWidth(text: string): number {
  const clean = text.replace(ANSI_FULL_REGEX, "");
  return [...clean].length; // Unicode-safe
}

export type WrapMode = 'word' | 'char';

export function wrapLine(
  text: string,
  width: number,
  indentation: number = 0,
  mode: WrapMode = 'char'
): string[] {
  // Remove all newline sequences before processing
  text = text.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();

  const indent = "  ".repeat(indentation); // 2 spaces per level
  const indentWidth = indent.length;

  // Sanity check: avoid zero-width rendering
  if (width <= indentWidth) width = indentWidth + 1;

  // Use character-based wrapping for 'char' mode
  if (mode === 'char') {
    return wrapByChar(text, width, indent, indentWidth);
  }

  // Use word-based wrapping for 'word' mode
  return wrapByWord(text, width, indent, indentWidth);
}

function wrapByChar(text: string, width: number, indent: string, indentWidth: number): string[] {
  const lines: string[] = [];
  let buffer = "";
  let visible = 0;
  const availableWidth = width - indentWidth;

  // Split text into ANSI-safe tokens (keeps escape sequences intact)
  const tokens = text.split(
    /(\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\)))/g
  );

  for (const token of tokens) {
    // Preserve ANSI escape sequences without affecting visible width
    if (ANSI_FULL_REGEX.test(token)) {
      buffer += token;
      continue;
    }

    for (const ch of [...token]) {
      // 🐛 FIX: Check if the *next* character would exceed the line limit (>=)
      if (visible + 1 > availableWidth) {
        // Push full line with indentation applied
        lines.push(indent + buffer);
        buffer = "";
        visible = 0;
      }
      buffer += ch;
      visible += 1;
    }
  }

  if (buffer.length > 0) lines.push(indent + buffer);
  return lines;
}

function wrapByWord(text: string, width: number, indent: string, indentWidth: number): string[] {
  const lines: string[] = [];
  let buffer = "";
  let visible = 0;
  let wordBuffer = "";
  let wordVisible = 0;
  const availableWidth = width - indentWidth;

  // Split text into ANSI-safe tokens (keeps escape sequences intact)
  const tokens = text.split(
    /(\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\)))/g
  );

  const flushWord = () => {
    if (wordBuffer.length === 0) return;

    // Check if adding the word (plus a preceding space if visible > 0) exceeds width.
    // The space is the one added by the main loop when it processed whitespace.
    const currentLineLength = visible + wordVisible; // visible already includes the preceding space or is 0

    if (currentLineLength > availableWidth) {
      // If current buffer has content, flush it as a complete line
      if (visible > 0) {
        lines.push(indent + buffer.trimEnd());
        buffer = "";
        visible = 0;
      }
    }

    // If word itself is longer than available width, split it character-by-character
    if (wordVisible > availableWidth) {
      let tempBuffer = "";
      let tempVisible = 0;
      // Split word back into tokens for safe character processing
      const wordTokens = wordBuffer.split(/(\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\)))/g);

      for (const token of wordTokens) {
        if (ANSI_FULL_REGEX.test(token)) {
          tempBuffer += token;
          continue;
        }

        for (const ch of [...token]) {
          if (tempVisible + 1 > availableWidth) {
            lines.push(indent + tempBuffer);
            tempBuffer = "";
            tempVisible = 0;
          }
          tempBuffer += ch;
          tempVisible += 1;
        }
      }

      buffer = tempBuffer;
      visible = tempVisible;
    } else {
      // ADDED WORD DIRECTLY: The space is already in 'buffer' if a word was previously
      // written and a space token was processed.
      buffer += wordBuffer;
      visible += wordVisible;
    }

    wordBuffer = "";
    wordVisible = 0;
  };

  for (const token of tokens) {
    // Preserve ANSI escape sequences without affecting visible width
    if (ANSI_FULL_REGEX.test(token)) {
      wordBuffer += token;
      continue;
    }

    for (const ch of [...token]) {
      // Check for whitespace (space, tab)
      if (/\s/.test(ch)) {
        flushWord();

        // Add space to buffer *only* if it fits
        // Since input is normalized, 'ch' will always be a single space here
        if (visible + 1 <= availableWidth) {
          buffer += ch;
          visible += 1;
        } else {
          // Space would overflow, start new line.
          lines.push(indent + buffer.trimEnd());
          buffer = "";
          visible = 0;
        }
      } else {
        // Accumulate non-whitespace characters into word buffer
        wordBuffer += ch;
        wordVisible += 1;
      }
    }
  }

  // Flush any remaining word and buffer
  flushWord();
  if (buffer.length > 0) lines.push(indent + buffer.trimEnd());

  return lines;
}

// ─── ANSI colors ────────────────────────────────────────────
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  brightRed: "\x1b[91m",
  green: "\x1b[32m",
  brightGreen: "\x1b[92m",
  gray: "\x1b[90m",
};

// ─── Types ─────────────────────────────────────────────────
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

type Align = "left" | "center" | "right";

interface ReformatOptions {
  width: number;
  align?: Align;
  padChar?: string;
  trim?: boolean; // Note: trim is largely ignored in the new ANSI-safe implementation
}

// ─── Logger Class ──────────────────────────────────────────
export class Logger {
  private previousLines: LoggedLine[] = [];
  private showPrompt = true;
  private prompt: string;
  private errorPrompt: string;

  constructor(options: LoggerOptions = {}) {
    const promptColor = options.promptColor ?? colors.brightGreen;
    const errorPromptColor = options.errorPromptColor ?? colors.brightRed;
    this.prompt = `${promptColor}> ${colors.reset}`;
    this.errorPrompt = `${errorPromptColor}> ${colors.reset}`;
  }

  visibleWidth(str: string): number {
    return [...str.replace(ANSI_FULL_REGEX, "")].length;
  }

  reformat(text: string, opts: ReformatOptions): string[] {
    const { width, align = "left", padChar = " " } = opts;

    // Normalize: merge newlines and collapse excessive spaces
    const normalized = text
      .replace(/\r?\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const lines: string[] = [];
    let currentLineText = "";
    let currentLineVisible = 0;

    // Tokenize text into ANSI escape sequences and visible characters
    const tokens = normalized.split(
      /(\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\)))/g
    );

    for (const token of tokens) {
      // 1. Handle ANSI codes (add to buffer without counting visible width)
      if (ANSI_FULL_REGEX.test(token)) {
        currentLineText += token;
        continue;
      }

      // 2. Handle visible characters
      for (const char of [...token]) {
        // If the next character would exceed width, flush the current line
        if (currentLineVisible + 1 > width) {
          // Apply padding/alignment to the segment collected so far
          lines.push(this.applyPadding(currentLineText, currentLineVisible, width, align, padChar));

          // Reset for the new line
          currentLineText = "";
          currentLineVisible = 0;
        }

        currentLineText += char;
        currentLineVisible += 1;
      }
    }

    // 3. Flush the last line
    if (currentLineText.length > 0) {
      lines.push(this.applyPadding(currentLineText, currentLineVisible, width, align, padChar));
    }

    return lines;
  }

  private applyPadding(
    text: string,
    visible: number,
    width: number,
    align: Align,
    padChar: string
  ): string {
    const pad = Math.max(0, width - visible);
    let formatted: string;

    switch (align) {
      case "right":
        formatted = padChar.repeat(pad) + text;
        break;
      case "center": {
        const left = Math.floor(pad / 2);
        const right = pad - left;
        formatted = padChar.repeat(left) + text + padChar.repeat(right);
        break;
      }
      default: // "left"
        formatted = text + padChar.repeat(pad);
    }

    return formatted;
  }

  clearLine() {
    process.stdout.write("\r\x1b[K");
  }

  private addLine(text: string, opts: { isRaw?: boolean; hasPrompt?: boolean } = {}) {
    this.previousLines.push({
      text,
      isRaw: opts.isRaw ?? false,
      hasPrompt: opts.hasPrompt ?? this.showPrompt,
    });

    if (this.previousLines.length > 200) {
      this.previousLines = this.previousLines.slice(-100);
    }
  }

  // ─── Basic printing ───────────────────────────────────────

  print(msg: string) {
    // Use wrapLine with 'word' mode for standard logging readability
    const lines = wrapLine(this.showPrompt ? this.prompt + msg : msg, MAX_WIDTH, 0, 'word');
    for (const [i, line] of lines.entries()) {
      this.clearLine();
      process.stdout.write(colors.bold + line + colors.reset);
      if (i < lines.length - 1) process.stdout.write("\n");
      this.addLine(line);
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

  // ─── Raw printing (with wrapping, but no prompt) ──────────

  printRaw(line: string) {
    // Simply print the line as-is
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

  // ─── Error output (wrapped + colored) ─────────────────────
  error(msg: string) {
    // Use wrapLine with 'word' mode for standard logging readability
    const lines = wrapLine(this.showPrompt ? this.errorPrompt + msg : msg, MAX_WIDTH, 0, 'word');
    for (const [i, line] of lines.entries()) {
      this.clearLine(); // Errors should clear the current interactive line too
      process.stdout.write(colors.brightRed + line + colors.reset);
      if (i < lines.length - 1) process.stdout.write("\n");
      this.addLine(line);
    }
    process.stdout.write("\n");
    this.addLine("");
    this.showPrompt = true;
    return true;
  }

  // ─── Misc ─────────────────────────────────────────────────

  clearHistory() {
    this.previousLines = [];
  }

  getHistory(): LoggedLine[] {
    return [...this.previousLines];
  }
}

// ─── Example ────────────────────────────────────────────────

export const logger = new Logger();