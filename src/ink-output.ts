import { createElement } from 'react';
import { Box, renderToString, Text } from 'ink';
import { getMaxWidth, supportsColor } from './ansi-constants';

const ANSI_ESCAPE = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1B\\))/g;

/** Marks a panel row that should replace, rather than sit inside, side borders. */
export const PANEL_RULE = '\uE000';

/** The presentation boundary for synchronous Node terminal output. */
export interface InkTextStyle {
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
  dimColor?: boolean;
}

/**
 * Render a log fragment through Ink without taking ownership of stdin or
 * redrawing earlier output. That preserves callback ordering for Jasmine and
 * watch mode while making Ink responsible for terminal styling.
 */
export function renderTerminalText(
  text: string,
  style: InkTextStyle = {},
): string {
  if (!text || !supportsColor()) return text;

  return renderToString(
    createElement(Text, { ...style, wrap: 'wrap' }, text),
    // Ink normally wraps at the terminal edge. Existing Testify output owns
    // its wrapping, so provide enough virtual width to preserve each line.
    {
      columns: Math.max(
        getMaxWidth(),
        ...text.split('\n').map(line => [...line.replace(ANSI_ESCAPE, '')].length + 1),
      ),
    },
  );
}

/** A compact Ink panel used for reporter milestones and result summaries. */
export function renderTerminalPanel(
  title: string,
  lines: readonly string[],
  tone: string = 'cyan',
): string {
  if (!supportsColor()) return [title, ...lines].join('\n');

  const rendered = renderToString(
    createElement(
      Box,
      {
        borderStyle: 'round',
        borderColor: tone,
        flexDirection: 'column',
        paddingX: 1,
      },
      createElement(Text, { bold: true, color: tone }, title),
      ...lines.map((line, index) =>
        createElement(Text, { key: index }, line),
      ),
    ),
    // Panels are viewport-bound: long diagnostics must wrap inside the border.
    { columns: getMaxWidth() },
  );

  // Ink borders every child row. A rule deliberately replaces those sides with
  // T-junctions so adjacent sections read as one connected report.
  const connectedRule = renderTerminalText(
    `├${'─'.repeat(Math.max(1, getMaxWidth() - 2))}┤`,
    { color: tone },
  );
  return rendered
    .split('\n')
    .map(line => line.includes(PANEL_RULE) ? connectedRule : line)
    .join('\n');
}

/** A preparation milestone that can be appended without redrawing prior logs. */
export function renderTerminalStage(
  label: string,
  description: string,
  tone: string = 'cyan',
): string {
  if (!supportsColor()) return `${label}: ${description}`;

  return renderToString(
    createElement(
      Box,
      { paddingLeft: 2 },
      createElement(Text, { bold: true, color: tone }, '◆'),
      createElement(Text, { dimColor: true }, `  ${label.padEnd(10)} `),
      createElement(Text, { color: tone === 'green' ? 'green' : undefined }, description),
    ),
    { columns: getMaxWidth() },
  );
}
