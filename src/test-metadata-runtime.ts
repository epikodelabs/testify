export function getEmbeddedTestMetadataSource(): string {
  return `
const __testifyMetadataByItem = new WeakMap();
const __testifyRegistrationScopes = [];

function normalizeTestifyFilePath(file) {
  return String(file)
    .replace(/\\\\/g, '/')
    .replace(/\\/+/g, '/')
    .replace(/^\\/+/, '');
}

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
  setTestifyMetadata(item, {
    file: normalizeTestifyFilePath(file),
  });
}

function getTestifyFile(item) {
  return getTestifyMetadata(item)?.file;
}

function beginTestifyRegistrationScope(file) {
  __testifyRegistrationScopes.push(
    normalizeTestifyFilePath(file),
  );
}

function endTestifyRegistrationScope() {
  __testifyRegistrationScopes.pop();
}

function getCurrentTestifyRegistrationFile() {
  return __testifyRegistrationScopes[
    __testifyRegistrationScopes.length - 1
  ];
}

async function withTestifyRegistrationScope(file, work) {
  beginTestifyRegistrationScope(file);

  try {
    return await work();
  } finally {
    endTestifyRegistrationScope();
  }
}

function captureTestifyRegistration(item) {
  const file = getCurrentTestifyRegistrationFile();

  if (file) {
    setTestifyFile(item, file);
  }
}
`;
}
