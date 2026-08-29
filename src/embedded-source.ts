export function getEmbeddedNameHelperSource():
  string {
  return `function __name(target, value) {
  try {
    Object.defineProperty(
      target,
      'name',
      {
        value,
        configurable: true,
      },
    );
  } catch (error) { console.error('Testify runtime error:', error); }

  return target;
}`;
}

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