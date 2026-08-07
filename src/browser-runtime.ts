export interface BrowserRuntimeScriptOptions {
  stopOnSpecFailure: boolean;
  initialSeed: number;
  initialRandom: boolean;
}

export function getBrowserRuntimeScript(
  options: BrowserRuntimeScriptOptions,
): string {
  const {
    stopOnSpecFailure,
    initialSeed,
    initialRandom,
  } = options;
    
    return `
(function(globalThis) {
  async function waitForJasmine(maxAttempts = 50, interval = 100) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      function check() {
        if (globalThis.jasmine?.getEnv) {
          resolve(globalThis.jasmine.getEnv());
        } else if (attempts >= maxAttempts) {
          reject(new Error('Jasmine environment not found after waiting'));
        } else {
          attempts++;
          setTimeout(check, interval);
        }
      }
      
      check();
    });
  }

  async function init() {
    let env;
    try {
      env = await waitForJasmine();
      console.log('✅ Jasmine environment found');
    } catch (error) {
      console.error('⚠️  Jasmine environment not found:', error.message);
      return;
    }

    let random = ${initialRandom};
    let seed = ${initialSeed};

    env.configure({
      random,
      stopOnSpecFailure: ${stopOnSpecFailure},
      seed,
      autoCleanClosures: false
    });

    function getCatalog() {
      return createTestCatalogFromJasmineEnv(env);
    }

    function getAllSpecs() {
      return getCatalog().specs;
    }

    function getAllSuites() {
      return getCatalog().suites;
    }

    function orderCatalogItems(items, seed, random) {
      if (!random) return items;

      try {
        const order = new globalThis.jasmine.Order({ random, seed });
        return order.sort?.(items) ?? items;
      } catch {
        return items;
      }
    }

    function getOrderedSpecs(seed, random) {
      return orderCatalogItems(getAllSpecs(), seed, random);
    }

    function getOrderedSuites(seed, random) {
      return orderCatalogItems(getAllSuites(), seed, random);
    }

    globalThis.jasmine = {
      ...globalThis.jasmine,
      getCatalog,
      getAllSpecs,
      getAllSuites,
      getOrderedSpecs,
      getOrderedSuites
    };

    let originalSpecFilter = null;
    let isExecuting = false;

    const inBrowserReporter = {
      results: [],
      currentSpecIdSet: null,

      jasmineStarted: function () {
        this.results = [];
      },

      specStarted: function (config) {
        if (this.currentSpecIdSet?.has(config.id)) {
          console.log(\`▶️ Running [\${config.id}]: \${config.description}\`);
        }
      },

      specDone: function (result) {
        if (this.currentSpecIdSet?.has(result.id)) {
          this.results.push(result);
          const status = result.status.toUpperCase();
          console.log(\`[\${status}] \${result.description}\`);
          
          result.failedExpectations?.forEach(f => 
            console.error('❌', f.message, f.stack ? '\\n' + f.stack : '')
          );
        }
      },

      jasmineDone: () => {
        if (originalSpecFilter !== null) {
          env.configure({ specFilter: originalSpecFilter });
        }
        isExecuting = false;
      }
    };

    env.addReporter(inBrowserReporter);

    function resetEnvironment() {
      const resetNode = (node) => {
        if (node.result) {
          node.result = {
            status: 'pending',
            failedExpectations: [],
            passedExpectations: []
          };
        }
        node.children?.forEach(resetNode);
      };
      
      resetNode(env.topSuite());
    }

    async function executeSpecsByIds(specIds) {
      if (isExecuting) {
        console.warn('⚠️  Execution already in progress. Please wait...');
        return [];
      }

      return new Promise((resolve) => {
        isExecuting = true;
        inBrowserReporter.results = [];
        const specIdSet = new Set(specIds);
        inBrowserReporter.currentSpecIdSet = specIdSet;
        
        if (originalSpecFilter === null) {
          originalSpecFilter = env.specFilter;
        }

        resetEnvironment();

        env.configure({
          random,
          seed,
          specFilter: (spec) => specIdSet.has(spec.id),
          autoCleanClosures: false
        });

        const originalDone = inBrowserReporter.jasmineDone;
        inBrowserReporter.jasmineDone = () => {
          originalDone.call(inBrowserReporter);
          resolve(inBrowserReporter.results);
          inBrowserReporter.jasmineDone = originalDone;
        };

        env.execute();
      });
    }

    async function runTests(filters) {
      const catalog = getCatalog();
      const filterArr = filters === undefined
        ? []
        : (Array.isArray(filters) ? filters : [filters]);

      const ids = filterArr.length === 0
        ? catalog.specs.map(spec => spec.id)
        : [...new Set(
            filterArr.flatMap(filter =>
              resolveTestSelector(catalog, { spec: filter })
            )
          )];

      if (!ids.length) {
        console.warn('No matching specs found for:', filters);
        return [];
      }

      console.log(`🎯 Executing ${ids.length} spec(s)`);
      return await executeSpecsByIds(ids.sort());
    }

    async function runTest(filter) {
      if (Array.isArray(filter)) {
        throw new Error('runTest() only accepts a single spec or RegExp, not an array.');
      }
      return runTests(filter);
    }

    async function runSuite(selector) {
      const catalog = getCatalog();
      const ids = resolveTestSelector(catalog, { suite: selector });

      if (!ids.length) {
        console.warn('No matching suites found for:', selector);
        return [];
      }

      console.log(`🎯 Executing ${ids.length} spec(s) from suite`);
      return await executeSpecsByIds(ids.sort());
    }

    async function run(selector) {
      const catalog = getCatalog();
      const ids = resolveTestSelector(catalog, selector);

      if (!ids.length) {
        console.warn('No matching tests found for:', selector);
        return [];
      }

      console.log(`🎯 Executing ${ids.length} spec(s)`);
      return await executeSpecsByIds(ids.sort());
    }

    function listTests() {
      const rows = getOrderedSpecs(seed, random).map(spec => ({
        suiteId: spec.suiteId ?? '',
        id: spec.id,
        name: spec.description,
        fullName: spec.fullName
      }));

      console.table(rows);
      return rows;
    }

    function listSuites() {
      const rows = getOrderedSuites(seed, random).map(suite => ({
        parentSuiteId: suite.parentSuiteId ?? '',
        id: suite.id,
        name: suite.description,
        fullName: suite.fullName
      }));

      console.table(rows);
      return rows;
    }

    async function runFile(selector) {
      const catalog = getCatalog();
      const ids = resolveTestSelector(
        catalog,
        { file: selector },
      );

      if (!ids.length) {
        console.warn('No matching spec files found for:', selector);
        return [];
      }

      console.log(`🎯 Executing ${ids.length} spec(s) from file`);
      return await executeSpecsByIds(ids.sort());
    }

    function listFiles() {
      const catalog = getCatalog();
      const counts = new Map();

      for (const spec of catalog.specs) {
        if (!spec.file) continue;
        counts.set(
          spec.file,
          (counts.get(spec.file) ?? 0) + 1,
        );
      }

      const rows = [...counts.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([file, specs]) => ({
          file,
          specs,
        }));

      console.table(rows);
      return rows;
    }

    function setSeed(nextSeed) {
      const parsed = Number(nextSeed);
      if (!Number.isFinite(parsed)) {
        console.warn('Invalid seed (expected a number).');
        return seed;
      }
      random = true;
      seed = parsed;
      env.configure({ random, seed });
      console.log('✅ Seed updated to:', seed, '| Random enabled:', random);
      return seed;
    }

    function resetSeed() {
      random = false;
      seed = ${initialSeed};
      env.configure({ random, seed });
      console.log('✅ Seed reset to:', seed, '| Random reset to:', random);
      return seed;
    }

    globalThis.runner = {
      run,
      runTests,
      runTest,
      runSuite,
      runFile,
      listTests,
      listSuites,
      listFiles,
      catalog: getCatalog,
      setSeed,
      resetSeed,
      reload: () => location.reload(),
    };

    console.log('%c✅ Jasmine runner ready!', 'color: green; font-weight: bold;');
    console.log('Usage:');
    console.log('  await runner.runTest("spec-name") or await runner.runTest(/pattern/)');
    console.log('  await runner.runTests(["spec1", "spec2"])');
    console.log('  await runner.runSuite("suite12") or await runner.runSuite(/Suite Name/)');
    console.log('  await runner.run("spec12") or await runner.run("suite12")');
    console.log('  runner.listSuites() - Show all suites');
    console.log('  runner.listFiles() - Show all spec files');
    console.log('  await runner.runFile("forms.spec.js")');
    console.log('  runner.catalog() - Return the current TestCatalog');
    console.log('  runner.setSeed(12345) - Enable random order with seed');
    console.log('  runner.resetSeed() - Back to sequential order');
    console.log('  runner.listTests() - Show all tests');
  }

  init().catch(error => {
    console.error('Failed to initialize runner:', error);
  });
})(window);
`;
  }