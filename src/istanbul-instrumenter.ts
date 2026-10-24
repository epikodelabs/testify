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

  /**
   * Vendor chunks are third-party code by construction: the browser build
   * routes everything it pulls from node_modules into `vendor.mjs` (suffixed
   * `vendor2.mjs`, `vendor3.mjs`, … when split). Coverage exists to describe
   * first-party code, and the chunks dwarf user sources — a large dependency
   * graph produces tens-of-MB chunks, and instrumenting those exhausts the
   * V8 heap both in the browser page and again while merging counters.
   */
  private isVendorChunk(filename: string): boolean {
    const resolved = path.resolve(filename);
    return (
      path.dirname(resolved) === path.resolve(this.config.outDir) &&
      /^vendor(?:\d+)?\.mjs$/i.test(path.basename(resolved))
    );
  }

  async instrument({ filename, source, sourceMap }: InstrumenterOptions): Promise<InstrumentationResult> {
    // Only instrument if coverage is enabled
    if (!this.config.coverage) return { code: source };

    // Vendor chunks are never first-party code; skip them entirely.
    if (this.isVendorChunk(filename)) return { code: source };

    // Skip generated test modules and their maps.
    if (
      /\.spec(?:\.map)?\.(?:js|mjs)$/i.test(
        filename,
      )
    ) {
      return { code: source };
    }

    // Testify emits runtime modules as .mjs, while .js remains supported
    // for compatibility with explicitly supplied JavaScript sources.
    if (
      !/\.(?:js|mjs)$/i.test(
        filename,
      )
    ) {
      return { code: source };
    }

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