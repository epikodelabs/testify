export interface TestifyItemMetadata {
  file?: string;
}

const metadataByItem =
  new WeakMap<object, TestifyItemMetadata>();

export function normalizeTestifyFilePath(
  file: string,
): string {
  return String(file)
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^\/+/, '');
}

export function setTestifyMetadata(
  item: object,
  metadata: TestifyItemMetadata,
): void {
  const current =
    metadataByItem.get(item) ?? {};

  metadataByItem.set(item, {
    ...current,
    ...metadata,
  });
}

export function getTestifyMetadata(
  item: unknown,
): TestifyItemMetadata | undefined {
  if (
    !item ||
    (typeof item !== 'object' &&
      typeof item !== 'function')
  ) {
    return undefined;
  }

  return metadataByItem.get(
    item as object,
  );
}

export function setTestifyFile(
  item: unknown,
  file: string,
): void {
  if (
    !item ||
    (typeof item !== 'object' &&
      typeof item !== 'function')
  ) {
    return;
  }

  setTestifyMetadata(
    item as object,
    {
      file:
        normalizeTestifyFilePath(
          file,
        ),
    },
  );
}

export function getTestifyFile(
  item: unknown,
): string | undefined {
  return getTestifyMetadata(item)?.file;
}

const registrationScopes: string[] = [];

export function beginTestifyRegistrationScope(
  file: string,
): void {
  registrationScopes.push(
    normalizeTestifyFilePath(
      file,
    ),
  );
}

export function endTestifyRegistrationScope(): void {
  registrationScopes.pop();
}

export function getCurrentTestifyRegistrationFile():
  | string
  | undefined {
  return registrationScopes[
    registrationScopes.length - 1
  ];
}

export async function withTestifyRegistrationScope<T>(
  file: string,
  work: () => Promise<T>,
): Promise<T> {
  beginTestifyRegistrationScope(file);

  try {
    return await work();
  } finally {
    endTestifyRegistrationScope();
  }
}

export function captureTestifyRegistration(
  item: unknown,
): void {
  const file =
    getCurrentTestifyRegistrationFile();

  if (file) {
    setTestifyFile(item, file);
  }
}
