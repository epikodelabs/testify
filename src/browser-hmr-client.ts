export function getBrowserHmrClientScript(): string {
  return `
// HMR Client Runtime
window.HMRClient = (function() {
  const moduleRegistry = new Map();

  function normalizeHmrPath(filePath) {
    if (
      typeof normalizeTestifyFilePath === 'function'
    ) {
      return normalizeTestifyFilePath(
        filePath,
      );
    }

    return String(filePath)
      .replace(/\\\\/g, '/')
      .replace(/\\/+/g, '/')
      .replace(/^\\/+/, '');
  }

  function getEnv() {
    return window.jasmine?.getEnv?.();
  }

  function detachFilePathSuites(filePath) {
    const normalizedFilePath =
      normalizeHmrPath(filePath);

    const env = getEnv();
    if (!env) return;

    const topSuite = env.topSuite();
    if (!topSuite) return;

    const catalog =
      window.jasmine?.getCatalog?.() ??
      createTestCatalogFromJasmineEnv(env);

    const specIds = new Set(
      catalog.specs
        .filter(
          (spec) =>
            normalizeHmrPath(
              spec.file ?? '',
            ) === normalizedFilePath,
        )
        .map(spec => spec.id)
    );

    const suiteIds = new Set(
      catalog.suites
        .filter(
          (suite) =>
            normalizeHmrPath(
              suite.file ?? '',
            ) === normalizedFilePath,
        )
        .map(suite => suite.id)
    );

    function cleanSuite(suite) {
      if (!suite || !Array.isArray(suite.children)) return;

      const keep = [];

      for (const child of suite.children) {
        if (!child) continue;

        if (suiteIds.has(child.id) || specIds.has(child.id)) {
          continue;
        }

        if (Array.isArray(child.children)) {
          cleanSuite(child);
        }

        keep.push(child);
      }

      if (suite.removeChildren && suite.addChild) {
        suite.removeChildren();
        keep.forEach(item => suite.addChild(item));
      } else {
        suite.children = keep;
      }

      if (Array.isArray(suite.specs)) {
        suite.specs = suite.specs.filter(
          spec => !specIds.has(spec.id)
        );
      }
    }

    cleanSuite(topSuite);
    console.log(
      \`🧹 Detached catalog entries for file: \${normalizedFilePath}\`
    );
  }

  async function hotUpdateSpec(filePath) {
    const normalizedFilePath =
      normalizeHmrPath(filePath);

    detachFilePathSuites(filePath);

    const module =
      await withTestifyRegistrationScope(
        normalizedFilePath,
        () =>
          import(
            '/' +
            normalizedFilePath +
            \`?t=\${Date.now()}\`
          ),
      );

    moduleRegistry.set(
      normalizedFilePath,
      module,
    );

    console.log(
      '✅ Hot updated Jasmine registrations from:',
      normalizedFilePath,
    );

    return module;
  }

  async function handleMessage(message) {
    if (message.type === 'hmr:connected') {
      console.log('🔥 HMR enabled on server');
      if (window.loadSpecs) {
        await window.loadSpecs(message.specFiles);
      }
      return;
    }

    if (message.type === 'hmr:update') {
      const update = message.data;
      if (!update) return;

      if (update.type === 'full-reload') {
        console.log('🔄 Full reload required');
        location.reload();
        return;
      }

      const updatePath =
        normalizeHmrPath(
          update.path,
        );

      if (update.type === 'test-remove') {
        detachFilePathSuites(
          updatePath,
        );

        moduleRegistry.delete(
          updatePath,
        );

        console.log(
          '🗑️ Removed test registrations:',
          updatePath,
        );

        return;
      }

      console.log(
        '🔥 Hot updating:',
        updatePath,
      );

      try {
        await hotUpdateSpec(
          updatePath,
        );

        console.log(
          '✅ HMR update applied:',
          updatePath,
        );
      } catch (err) {
        console.error(
          '❌ HMR update failed:',
          err,
        );
        location.reload();
      }
    }
  }

  return {
    handleMessage,
    detachFilePathSuites,
    clearCache: (filePath) => {
      if (filePath) {
        moduleRegistry.delete(
          normalizeHmrPath(
            filePath,
          ),
        );
      } else {
        moduleRegistry.clear();
      }
    }
  };
})();
`;
}
