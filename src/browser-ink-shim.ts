/**
 * Browser test bundles import terminal helpers indirectly through Logger.
 * They never render an Ink surface (terminal colour support is unavailable),
 * so this avoids pulling Ink's Node-only reconciler into Chrome.
 */
export const Box = 'div';
export const Text = 'span';

export function renderToString(): string {
  return '';
}
