export interface BrowserBootstrapScriptOptions {
  preludeModules: string[];
  jasmineBootScriptUrl: string;
}

export function getBrowserBootstrapScript(
  options: BrowserBootstrapScriptOptions,
): string {
  const {
    preludeModules,
    jasmineBootScriptUrl,
  } = options;

  return `
// Initialize everything after Jasmine is loaded
let jasmineLoadAttempts = 0;
(function initAfterJasmine() {
  if (!window.jasmineRequire) {
    if (++jasmineLoadAttempts >= 500) {
      console.error('Jasmine failed to load after 5 seconds');
      return;
    }
    return setTimeout(initAfterJasmine, 10);
  }

  const script = document.createElement('script');
  script.src = ${JSON.stringify(jasmineBootScriptUrl)};

  script.onload = () => {
    const forwarder = new WebSocketEventForwarder();
    window.__testifyHost = forwarder;
    forwarder.connect();
    jasmine.getEnv().addReporter(forwarder);

    window.loadSpecs = async function(specFiles) {
      let attempts = 0;

      while (!window.HMRClient && attempts < 100) {
        await new Promise(
          (resolve) => setTimeout(resolve, 50),
        );
        attempts++;
      }

      if (!window.HMRClient) {
        console.error(
          'x  HMRClient not available after waiting',
        );
        return;
      }

      console.log(
        'Loading prelude modules and spec files dynamically...',
      );

      try {
        for (const modulePath of ${JSON.stringify(preludeModules)}) {
          await import(modulePath);
        }

        for (const file of specFiles) {
          await withTestifyRegistrationScope(
            file,
            () => import('/' + file),
          );
        }

        console.log(
          'All prelude modules and specs loaded',
        );
      } catch (err) {
        console.error(
          'Failed to load specs:',
          err,
        );
      }
    };
  };

  script.onerror = (err) => {
    console.error(
      'Failed to load boot0.js:',
      err,
    );
  };

  document.head.appendChild(script);
})();
`;
}
