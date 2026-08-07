import * as fs from 'fs';
import * as path from 'path';
import { ViteJasmineConfig } from "./vite-jasmine-config";
import { norm } from './utils';
import { fileURLToPath } from 'url';
import { FileDiscoveryService } from './file-discovery-service';
import { logger } from './logger';
import { HtmlMessages } from './log-messages';
import { resolveBrowserPreludeModules } from './prelude-modules';
import { getEmbeddedTestCatalogSource } from './test-catalog';
import {
  getEmbeddedTestMetadataSource,
} from './test-metadata-runtime';
import { getEmbeddedTestSelectionSource } from './test-selection';

export class HtmlGenerator {
  constructor(private fileDiscovery: FileDiscoveryService, private config: ViteJasmineConfig) { }

  async generateHtmlFile() {
    const htmlDir = this.config.outDir;
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true });
    }

    const builtFiles = fs.readdirSync(htmlDir)
      .filter(f => /\.(?:js|mjs)$/i.test(f))
      .sort();

    if (builtFiles.length === 0) {
      logger.println(HtmlMessages.noJsFilesForHtml());
      return;
    }

    const specFiles = builtFiles.filter(f => /\.spec\.(?:js|mjs)$/i.test(f));
    const imports = this.getStaticModuleImports(specFiles);

    const faviconTag = this.getFaviconTag();
    const htmlContent = this.generateHtmlTemplate(imports, faviconTag);
    const htmlPath = norm(path.join(htmlDir, 'index.html'));
    fs.writeFileSync(htmlPath, htmlContent);
    logger.println(HtmlMessages.generatedTestPage(norm(path.relative(this.config.outDir, htmlPath))));
  }

  async generateHtmlFileWithHmr() {
    const htmlDir = this.config.outDir;
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true });
    }

    const faviconTag = this.getFaviconTag();
    const htmlContent = this.generateHtmlTemplateWithHmr(faviconTag);
    const htmlPath = norm(path.join(htmlDir, 'index.html'));
    fs.writeFileSync(htmlPath, htmlContent);
    logger.println(HtmlMessages.generatedHmrTestPage(norm(path.relative(this.config.outDir, htmlPath))));
  }

  private getFaviconTag(): string {
    const __filename = norm(fileURLToPath(import.meta.url));
    const __dirname = norm(path.dirname(__filename));
    const faviconPath = path.resolve(__dirname, '../assets/favicon.ico');
    
    if (fs.existsSync(faviconPath)) {
      const faviconData = fs.readFileSync(faviconPath);
      const faviconBase64 = faviconData.toString('base64');
      return `<link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,${faviconBase64}">`;
    } else {
      logger.println(HtmlMessages.faviconNotFound(faviconPath));
      return `<link rel="icon" href="favicon.ico" type="image/x-icon" />`;
    }
  }

  private generateHtmlTemplate(imports: string, faviconTag: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${faviconTag}
  <title>${this.config.htmlOptions?.title || 'Jasmine Test Runner'}</title>
  <link rel="stylesheet" href="/node_modules/jasmine-core/lib/jasmine-core/jasmine.css">
  <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine.js"></script>
  <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js"></script>
  <script src="/node_modules/jasmine-core/lib/jasmine-core/boot0.js"></script>
  <script src="/node_modules/jasmine-core/lib/jasmine-core/boot1.js"></script>
  <script type="module">
    ${this.getWebSocketEventForwarderScript()}
    
    const forwarder = new WebSocketEventForwarder();
    forwarder.connect();
    jasmine.getEnv().addReporter(forwarder);
    
    ${imports}
  </script>
</head>
<body>
  <div class="jasmine_html-reporter"></div>
</body>
</html>`;
  }

  private getPreludeModules(): string[] {
    return resolveBrowserPreludeModules(this.config);
  }

  private getStaticModuleImports(specFiles: string[]): string {
    const imports = [
      ...this.getPreludeModules().map(specifier => `import ${JSON.stringify(specifier)};`),
      ...specFiles.map(file => `import ${JSON.stringify(`./${file}`)};`)
    ];

    return imports.join('\n    ');
  }

  private generateHtmlTemplateWithHmr(faviconTag: string): string {    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${faviconTag}
  <title>${this.config.htmlOptions?.title || "Jasmine Test Runner (HMR)"}</title>
  <link rel="stylesheet" href="/node_modules/jasmine-core/lib/jasmine-core/jasmine.css">
  <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine.js"></script>
  <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js"></script>

  <script>
${this.getJasminePatchScript()}

${this.getWebSocketEventForwarderScript()}

${this.getHmrClientScript()}

// Initialize everything after Jasmine is loaded
(function initAfterJasmine() {
  if (!window.jasmineRequire) {
    return setTimeout(initAfterJasmine, 10);
  }

  const script = document.createElement('script');
  script.src = '/node_modules/jasmine-core/lib/jasmine-core/boot0.js';
  
  script.onload = () => {
    // Add the WebSocket forwarder as a reporter
    const forwarder = new WebSocketEventForwarder();
    forwarder.connect();
    jasmine.getEnv().addReporter(forwarder);
    
    ${this.getRuntimeHelpersScript()}
  };
  
  script.onerror = (err) => {
    console.error('Failed to load boot0.js:', err);
  };
  
  document.head.appendChild(script);
})();
  </script>
</head>
<body>
  <div class="jasmine_html-reporter"></div>
</body>
</html>`;
  }

  private getJasminePatchScript(): string {
    return `
(function patchJasmineRegistrationCapture() {
  if (!window.jasmineRequire) {
    return setTimeout(patchJasmineRegistrationCapture, 10);
  }

  const root = window.jasmineRequire || jasmineRequire;
  const j$ = jasmineRequire.core(jasmineRequire);
  const OriginalSuiteFactory = jasmineRequire.Suite || j$.Suite || null;
  const OriginalSpecFactory = jasmineRequire.Spec || j$.Spec || null;

  if (OriginalSuiteFactory) {
    root.Suite = function(j$local) {
      const OriginalSuite = OriginalSuiteFactory(j$local);

      return class TestifySuite extends OriginalSuite {
        constructor(attrs) {
          super(attrs);
          captureTestifyRegistration(this);
        }
      };
    };
  }

  if (OriginalSpecFactory) {
    root.Spec = function(j$local) {
      const OriginalSpec = OriginalSpecFactory(j$local);

      return class TestifySpec extends OriginalSpec {
        constructor(attrs) {
          super(attrs);
          captureTestifyRegistration(this);
        }
      };
    };
  }
})();
`;
  }

  private getWebSocketEventForwarderScript(): string {
    const seed = (this.config.jasmineConfig?.env as any)?.seed ?? 0;
    const random = (this.config.jasmineConfig?.env as any)?.random ?? false;
    
    return `
function WebSocketEventForwarder() {
  this.ws = null;
  this.connected = false;
  this.messageQueue = [];

  const self = this;

  this.connect = function () {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = protocol + '//' + window.location.host;

    self.ws = new WebSocket(wsUrl);

    self.ws.onopen = () => {
      self.connected = true;
      console.log('WebSocket connected to', wsUrl);

      self.send({
        type: 'userAgent',
        data: {
          userAgent: navigator.userAgent,
          appName: navigator.appName,
          appVersion: navigator.appVersion,
          platform: navigator.platform,
          vendor: navigator.vendor,
          language: navigator.language,
          languages: navigator.languages,
          orderedSuites: self.getOrderedSuites(${seed}, ${random}).map(suite => ({
            id: suite.id,
            description: suite.description,
            fullName: suite.getFullName ? suite.getFullName() : suite.description
          })),
          orderedSpecs: self.getOrderedSpecs(${seed}, ${random}).map(spec => ({
            id: spec.id,
            description: spec.description,
            fullName: spec.getFullName ? spec.getFullName() : spec.description
          }))
        },
        timestamp: Date.now()
      });

      while (self.messageQueue.length > 0) {
        const msg = self.messageQueue.shift();
        self.send(msg);
      }
    };

    self.ws.onclose = () => {
      self.connected = false;
      console.log('WebSocket disconnected');
      setTimeout(() => self.connect(), 1000);
    };

    self.ws.onerror = (err) => {
      self.connected = false;
      console.error('WebSocket error:', err);
    };

    self.ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        if (window.HMRClient && (message.type === 'hmr:connected' || message.type === 'hmr:update')) {
          await window.HMRClient.handleMessage(message);
        }
      } catch (err) {
        console.error('Failed to handle WebSocket message:', err);
      }
    };
  };

  this.send = function (msg) {
    if (self.connected && self.ws && self.ws.readyState === WebSocket.OPEN) {
      try {
        self.ws.send(JSON.stringify(msg));
      } catch (err) {
        console.error('Failed to send WebSocket message:', err);
      }
    } else {
      self.messageQueue.push(msg);
    }
  };

  this.getAllSpecs = function () {
    const allSpecs = [];
    function collect(suite) {
      suite.children.forEach((child) => {
        if (child.children && child.children.length > 0) {
          collect(child);
        } else {
          allSpecs.push(child);
        }
      });
    }
    
    const env = jasmine?.getEnv?.();
    if (env) collect(env.topSuite());
    return allSpecs;
  };

  this.getAllSuites = function () {
    const allSuites = [];
    function collect(suite) {
      allSuites.push(suite);
      suite.children.forEach((child) => {
        if (child.children && child.children.length > 0) {
          collect(child);
        }
      });
    }
    
    const env = jasmine?.getEnv?.();
    if (env) collect(env.topSuite());
    return allSuites;
  };

  this.getOrderedSpecs = function (seed, random) {
    const allSpecs = self.getAllSpecs();
    if (!random) return allSpecs;

    const OrderCtor = jasmine.Order;
    if (typeof OrderCtor === 'function') {
      try {
        const order = new OrderCtor({ random, seed });
        if (typeof order.sort === 'function') {
          return order.sort(allSpecs);
        }
      } catch (err) {
        console.error('Failed to create jasmine.Order:', err);
      }
    }
    return allSpecs;
  };

  this.getOrderedSuites = function (seed, random) {
    const allSuites = self.getAllSuites();
    if (!random) return allSuites;

    const OrderCtor = jasmine.Order;
    if (typeof OrderCtor === 'function') {
      try {
        const order = new OrderCtor({ random, seed });
        if (typeof order.sort === 'function') {
          return order.sort(allSuites);
        }
      } catch (err) {
        console.error('Failed to create jasmine.Order for suites:', err);
      }
    }
    return allSuites;
  };

  // Jasmine reporter hooks
  this.jasmineStarted = function (config) {
    let orderedSpecs = [];
    let orderedSuites = [];

    if (config.order) {
      const random = !!config.order.random;
      const seed = config.order.seed;
      orderedSpecs = self.getOrderedSpecs(seed, random);
      orderedSuites = self.getOrderedSuites(seed, random);
    }

    self.send({
      type: 'jasmineStarted',
      data: config,
      timestamp: Date.now()
    });
  };

  this.suiteStarted = function (suite) {
    self.send({
      type: 'suiteStarted',
      id: suite.id,
      description: suite.description,
      fullName: suite.fullName,
      timestamp: Date.now()
    });
  };

  this.specStarted = function (spec) {
    self.send({
      type: 'specStarted',
      id: spec.id,
      description: spec.description,
      fullName: spec.fullName,
      timestamp: Date.now()
    });
  };

  this.specDone = function (result) {
    self.send({
      type: 'specDone',
      ...result,
      timestamp: Date.now()
    });
  };

  this.suiteDone = function (suite) {
    self.send({
      type: 'suiteDone',
      id: suite.id,
      description: suite.description,
      fullName: suite.fullName,
      timestamp: Date.now()
    });
  };

  this.jasmineDone = function (result) {
    const coverage = globalThis.__coverage__;
    self.send({
      type: 'jasmineDone',
      ...result,
      coverage: coverage ? JSON.stringify(coverage) : null,
      timestamp: Date.now()
    });

    window.jasmineFinished = true;

    if (!window.HMRClient) {
      setTimeout(() => {
        if (self.ws) self.ws.close();
      }, 1000);
    }
  };
}
`;
  }

  private getHmrClientScript(): string {
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
    console.log(`🧹 Detached catalog entries for file: ${filePath}`);
  }

  async function hotUpdateSpec(filePath) {
    detachFilePathSuites(filePath);

    await withTestifyRegistrationScope(
      filePath,
      () => import('/' + filePath + `?t=${Date.now()}`),
    );

    console.log('✅ Hot updated Jasmine registrations from:', filePath);
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

      console.log('🔥 Hot updating:', update.path);

      try {
        let newModule = null;
        if (update.content) {
          newModule = await import('/' + update.path + \`?t=\${Date.now()}\`);
          moduleRegistry.set(update.path, newModule);
        }

        await hotUpdateSpec(update.path, newModule);
        console.log('✅ HMR update applied:', update.path);
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

  private getRuntimeHelpersScript(): string {
    const stopOnSpecFailure = this.config.jasmineConfig?.env?.stopSpecOnExpectationFailure ?? false;
    const initialSeed = (this.config.jasmineConfig?.env as any)?.seed ?? 0;
    const initialRandom = this.config.jasmineConfig?.env?.random ?? false;
    
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
}
