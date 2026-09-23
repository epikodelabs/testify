/** Compact terminal meter shared by coverage and live test output. */
export function renderTerminalProgressBar(
  value: number,
  cells = 20,
): string {
  const safeCells = Math.max(1, Math.floor(cells));
  const percentage = Math.max(0, Math.min(100, value));
  const filled = Math.round((percentage / 100) * safeCells);
  return `${'━'.repeat(filled)}${'─'.repeat(safeCells - filled)}`;
}
