export function embedFunctionSource(
  value: Function,
): string {
  return value.toString();
}

export function embedClassSource(
  name: string,
  value: Function,
): string {
  return `const ${name} = ${value.toString()};`;
}
