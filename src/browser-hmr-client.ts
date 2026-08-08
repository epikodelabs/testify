export function getBrowserHmrClientScript(): string {
    return `
// HMR Client Runtime
window.HMRClient = (function() {
  const moduleRegistry = new Map();
  
  function getEnv() {
    return window.jasmine?.getEnv?.();
  }

  function detachFilePathSuites(filePath) {
    const env = getEnv();
    if (!env) return;

    const topSuite = env.topSuite();
    if (!topSuite) return;

    const catalog =
      window.jasmine?.getCatalog?.() ??
      createTestCatalogFromJasmineEnv(env);

    const specIds = new Set(
      catalog.specs
        .filter(spec => spec.file === filePath)
        .map(spec => spec.id)
    );

    const suiteIds = new Set(
      catalog.suites
        .filter(suite => suite.file === filePath)
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
    console.log(\`🧹 Detached catalog entries for file: \${filePath}\`);
  }

  async function hotUpdateSpec(filePath) {
    detachFilePathSuites(filePath);

    const module =
      await withTestifyRegistrationScope(
        filePath,
        () =>
          import(
            '/' +
            filePath +
            \`?t=\${Date.now()}\`
          ),
      );

    moduleRegistry.set(
      filePath,
      module,
    );

    console.log(
      '✅ Hot updated Jasmine registrations from:',
      filePath,
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

      if (update.type === 'test-remove') {
        detachFilePathSuites(
          update.path,
        );

        moduleRegistry.delete(
          update.path,
        );

        console.log(
          '🗑️ Removed test registrations:',
          update.path,
        );

        return;
      }

      console.log('🔥 Hot updating:', update.path);

      try {
        await hotUpdateSpec(
          update.path,
        );

        console.log(
          '✅ HMR update applied:',
          update.path,
        );
      } catch (err) {
        console.error('❌ HMR update failed:', err);
        location.reload();
      }
    }
  }

  return {
    handleMessage,
    detachFilePathSuites,
    clearCache: (filePath) => {
      if (filePath) moduleRegistry.delete(filePath);
      else moduleRegistry.clear();
    }
  };
})();
`;
  }