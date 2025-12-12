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
      timeout?: number; 
    };
  };
  htmlOptions?: {
    title?: string;
  };
}
