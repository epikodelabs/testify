import { ViteJasmineConfig } from "./vite-jasmine-config";
import * as fs from "fs";
import path from "path";
import { createInstrumenter } from "istanbul-lib-instrument";

export interface InstrumenterOptions {
  filename: string;
  source: string;
  sourceMap: any;
}

export interface InstrumentationResult {
  code: string;
  sourceMap?: any;
}

export class IstanbulInstrumenter {
  private config: ViteJasmineConfig;

  constructor(config: ViteJasmineConfig) {
    this.config = config;
  }

  async instrument({ filename, source, sourceMap }: InstrumenterOptions): Promise<InstrumentationResult> {
    // Only instrument if coverage is enabled
    if (!this.config.coverage) return { code: source };

    // Skip test files (*.spec.js or *.spec.map.js)
    if (/\.spec(\.map)?\.js$/i.test(filename)) return { code: source };

    // Ensure only JS files are instrumented
    if (!filename.endsWith(".js")) return { code: source };

    // Create a fresh instrumenter for each file to avoid internal state mutation
    // (coverage variable counters accumulating across files/spec files)
    const instrumenter = createInstrumenter({
      coverageVariable: "__coverage__",
      produceSourceMap: true,
    });

    // Instrument with Istanbul, preserving original source map if provided
    const instrumentedCode = instrumenter.instrumentSync(source, filename, sourceMap);

    return { code: instrumentedCode };
  }

  /**
   * Convenience method: read file and instrument it, automatically using existing source map if available
   */
  async instrumentFile(filePath: string): Promise<InstrumentationResult> {
    const source = fs.readFileSync(filePath, "utf-8");

    // Check for existing source map
    const mapFile = filePath + ".map";
    let sourceMap;
    if (fs.existsSync(mapFile)) {
      sourceMap = JSON.parse(fs.readFileSync(mapFile, "utf-8"));
    }

    return this.instrument({ filename: filePath, source, sourceMap });
  }
}
