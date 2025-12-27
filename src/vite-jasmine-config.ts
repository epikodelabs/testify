import type { InlineConfig } from "vite";

export interface ImportEntry {
  name: string;
  path: string;
}

export interface ViteJasmineConfig {
  srcDirs: string[];
  testDirs: string[];
  exclude: string[];
  outDir: string;

  browser?: string;
  port?: number;
  coverage?: boolean;
  headless?: boolean;
  watch?: boolean;
  suppressConsoleLogs?: boolean;
  preserveOutputs: boolean;
  
  tsconfig?: string;
  viteConfig?: InlineConfig;
  viteBuildOptions?: {
    target?: string;
    sourcemap?: boolean;
    minify?: boolean;
    preserveModules?: boolean;
    preserveModulesRoot?: string;
  };
  jasmineConfig?: {
    env?: { 
      stopSpecOnExpectationFailure?: boolean; 
      random?: boolean; 
      seed?: number;
      timeout?: number; 
    };
  };
  htmlOptions?: {
    title?: string;
  };
}
