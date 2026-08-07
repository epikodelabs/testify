export interface StaticBrowserBootstrapOptions {
  preludeModules: string[];
  specFiles: string[];
  runtimeScript?: string;
}

export function getStaticBrowserBootstrapScript(
  options: StaticBrowserBootstrapOptions,
): string {
  const {
    preludeModules,
    specFiles,
    runtimeScript = '',
  } = options;

  return `
(function bootstrapStaticTestify() {
  if (!window.jasmineRequire) {
    return setTimeout(
      bootstrapStaticTestify,
      10,
    );
  }

  const boot0 = document.createElement('script');
  boot0.src =
    '/node_modules/jasmine-core/lib/jasmine-core/boot0.js';

  boot0.onload = async () => {
    try {
      for (const modulePath of ${JSON.stringify([...preludeModules, ...specFiles.map(file => './' + file)])}) {
        await import(modulePath);
      }
    } catch (error) {
      console.error(
        'Failed to load static Testify modules:',
        error,
      );
    }
  };

  document.head.appendChild(boot0);
})();

${runtimeScript}
`;
}
