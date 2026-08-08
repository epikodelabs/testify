import type { InlineConfig } from 'vite';

export function applyBuildInputs(
  viteConfig: InlineConfig,
  input: Record<string, string>,
): void {
  const build = (viteConfig.build ??= {});
  const rollupOptions =
    (build.rollupOptions ??= {});

  rollupOptions.input = input;

  const buildWithRolldown =
    build as typeof build & {
      rolldownOptions?: {
        input?: Record<string, string>;
      };
    };

  buildWithRolldown.rolldownOptions = {
    ...buildWithRolldown.rolldownOptions,
    input,
  };
}
