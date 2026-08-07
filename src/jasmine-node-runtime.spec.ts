import {
  getEmbeddedNodeJasmineRuntimeSource,
} from './jasmine-node-runtime';

describe('Node Jasmine runtime', () => {

  it('embeds Testify metadata before catalog helpers', () => {
    const source =
      getEmbeddedNodeJasmineRuntimeSource();

    const metadataIndex =
      source.indexOf(
        'function getTestifyFile(',
      );

    const catalogIndex =
      source.indexOf(
        'function createTestCatalogFromJasmineEnv(',
      );

    expect(metadataIndex)
      .toBeGreaterThan(-1);

    expect(catalogIndex)
      .toBeGreaterThan(
        metadataIndex,
      );

    expect(source).toContain(
      'function getTestifyMetadata(',
    );
  });
});
