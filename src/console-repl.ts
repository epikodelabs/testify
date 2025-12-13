import { MAX_WIDTH } from "./console-reporter";

// Matches all ESC-based ANSI / OSC control sequences
export const ANSI_FULL_REGEX =
  /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;

// Returns *visible* column width (ignoring control sequences)
export function visibleWidth(text: string): number {
  const clean = text.replace(ANSI_FULL_REGEX, "");
  // Note: This assumes all characters have width 1.
  return [...clean].length; 
}

export type WrapMode = 'word' | 'char';

export function wrapLine(
  text: string,
  width: number,
  indentation: number = 0,
  mode: WrapMode = 'char'
): string[] {
  // Ultra-robust whitespace normalization (retained)
  text = text
    .replace(/\r?\n/g, ' ') 
    .replace(/[\uFEFF\xA0\t]/g, ' ') // Explicitly target non-standard spaces and tabs
    .replace(/\s{2,}/g, ' ') // Collapse 2 or more spaces into one
    .trim();

  // Use a standard space for indentation
  const indent = " ".repeat(indentation); 
  const indentWidth = indent.length;

  // Sanity check: ensure there is at least 1 character of space available
  if (width <= indentWidth) width = indentWidth + 1;

  // The maximum number of *visible* characters allowed on a line after indentation
  const availableWidth = width - indentWidth;

  // Use character-based wrapping for 'char' mode
  if (mode === 'char') {
    return wrapByChar(text, availableWidth, indent);
  }

  // Use word-based wrapping for 'word' mode
  return wrapByWord(text, availableWidth, indent);
}

/**
 * Corrected wrapByChar function: Strictly enforces maximum availableWidth.
 */
function wrapByChar(text: string, availableWidth: number, indent: string): string[] {
  const lines: string[] = [];
  let buffer = "";
  let visible = 0;

  const tokens = text.split(
    /(\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\)))/g
  );

  for (const token of tokens) {
    if (ANSI_FULL_REGEX.test(token)) {
      buffer += token;
      continue;
    }

    for (const ch of [...token]) {
      // Check if the line is FULL *before* adding the character.
      if (visible >= availableWidth) {
        lines.push(indent + buffer);
        buffer = "";
        visible = 0;
      }
      
      buffer += ch;
      visible += 1;
    }
  }

  // Flush remaining buffer
  if (buffer.length > 0) lines.push(indent + buffer);
  return lines;
}

/**
 * Corrected wrapByWord function: Ensures words never exceed availableWidth.
 */
function wrapByWord(text: string, availableWidth: number, indent: string): string[] {
  const lines: string[] = [];
  let buffer = "";
  let visible = 0;
  let wordBuffer = "";
  let wordVisible = 0;

  const tokens = text.split(
    /(\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\)))/g
  );

  const flushWord = () => {
    if (wordBuffer.length === 0) return;

    const lengthIfAdded = visible + wordVisible;

    // 1. Check for overflow
    if (lengthIfAdded > availableWidth) {
      // If current line has content, it must be flushed *before* the new word.
      if (visible > 0) {
        // This trim is correct: removes trailing space from the line being flushed.
        lines.push(indent + buffer.trimEnd()); 
        buffer = "";
        visible = 0;
      }
    }
    
    // 2. Handle word that is longer than the available width (character-splitting)
    if (wordVisible > availableWidth) {
      // Fallback to character wrapping using the *corrected* strict logic
      let tempBuffer = "";
      let tempVisible = 0;
      const wordTokens = wordBuffer.split(/(\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\)))/g);

      for (const token of wordTokens) {
        if (ANSI_FULL_REGEX.test(token)) {
          tempBuffer += token;
          continue;
        }
        for (const ch of [...token]) {
          if (tempVisible >= availableWidth) {
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
      // 3. Add the word to the (potentially new) line
      // FIX: Check one more time if it fits with current content
      if (visible + wordVisible > availableWidth && visible > 0) {
        lines.push(indent + buffer.trimEnd());
        buffer = "";
        visible = 0;
      }
      buffer += wordBuffer;
      visible += wordVisible;
    }

    wordBuffer = "";
    wordVisible = 0;
  };

  for (const token of tokens) {
    // Preserve ANSI escape sequences
    if (ANSI_FULL_REGEX.test(token)) {
      wordBuffer += token;
      continue;
    }

    for (const ch of [...token]) {
      if (/\s/.test(ch)) {
        flushWord();

        // Check if line is full *before* adding the space
        if (visible >= availableWidth) {
          // Line is full, flush it and don't add the space
          lines.push(indent + buffer.trimEnd());
          buffer = "";
          visible = 0;
        } else if (visible > 0) {
          // Space fits and there's content, add it.
          buffer += ch;
          visible += 1;
        }
      } else {
        // Accumulate non-whitespace characters into word buffer
        wordBuffer += ch;
        wordVisible += 1;
      }
    }
  }

  // Flush any remaining word.
  flushWord();

  // FIX: Restore trimEnd() on the final buffer flush for word-wrap. 
  // This removes the trailing space the state machine often leaves.
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
  trim?: boolean; 
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

    // Ultra-robust whitespace normalization (retained)
    const normalized = text
      .replace(/\r?\n/g, ' ') 
      .replace(/[\uFEFF\xA0\t]/g, ' ') 
      .replace(/\s{2,}/g, ' ') 
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
        // Break if the current visible length is already at the limit
        if (currentLineVisible >= width) {
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