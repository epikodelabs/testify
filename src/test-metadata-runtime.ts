export function getEmbeddedTestMetadataSource(): string {
  return `
const __testifyMetadataByItem = new WeakMap();

function setTestifyMetadata(item, metadata) {
  if (!item || (typeof item !== 'object' && typeof item !== 'function')) {
    return;
  }

  const current =
    __testifyMetadataByItem.get(item) ?? {};

  __testifyMetadataByItem.set(item, {
    ...current,
    ...metadata,
  });
}

function getTestifyMetadata(item) {
  if (!item || (typeof item !== 'object' && typeof item !== 'function')) {
    return undefined;
  }

  return __testifyMetadataByItem.get(item);
}

function setTestifyFile(item, file) {
  setTestifyMetadata(item, { file });
}

function getTestifyFile(item) {
  return getTestifyMetadata(item)?.file;
}
`;
}
