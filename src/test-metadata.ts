export interface TestifyItemMetadata {
  file?: string;
}

const metadataByItem =
  new WeakMap<object, TestifyItemMetadata>();

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
    { file },
  );
}

export function getTestifyFile(
  item: unknown,
): string | undefined {
  return getTestifyMetadata(item)?.file;
}
