import fs from 'fs';
import path from 'path';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import libSourceMaps from 'istanbul-lib-source-maps';
import reports from 'istanbul-reports';
import { logger } from './console-repl';
import { norm } from './utils';

export class CoverageReportGenerator {
  private reportDir: string;

  constructor(reportDir: string = norm(path.join(process.cwd(), 'coverage'))) {
    this.reportDir = reportDir;
  }

  saveCoverageToFile(coverage: any): void {
    try {
      const outDir = path.resolve(process.cwd(), ".nyc_output");
      const outFile = path.join(outDir, "out.json");

      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

      fs.writeFileSync(outFile, JSON.stringify(coverage, null, 2), "utf8");

      logger.println(`📄 Raw coverage saved to ${outFile}`);
    } catch (err) {
      logger.error(`❌ Failed to write coverage file: ${err}`);
    }
  }

  async generate(coverage: Record<string, any>): Promise<void> {
    // 1️⃣ Coverage map from raw data
    const coverageMap = libCoverage.createCoverageMap(coverage);

    // 2️⃣ Remap coverage using source maps (assumes map files are alongside JS files)
    const remapper = libSourceMaps.createSourceMapStore();
    for (const filePath of coverageMap.files()) {
      const mapPath = filePath + '.map';
      if (fs.existsSync(mapPath)) {
        try {
          const sourceMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
          remapper.registerMap(filePath, sourceMap);
        } catch {
          // Skip unreadable or malformed source maps
        }
      }
    }
    const remappedCoverage = await remapper.transformCoverage(coverageMap);

    // 3️⃣ Filter out test/spec files from coverage (e.g., env.spec.ts, test helpers)
    const filteredCoverage = libCoverage.createCoverageMap();
    const filePaths = remappedCoverage.files();
    for (const filePath of filePaths) {
      // Skip files matching spec patterns (*.spec.ts, *.spec.js, etc.)
      if (!/\.spec\.(ts|tsx|js|jsx|mts|cts|mjs)$/i.test(filePath)) {
        try {
          const fileCoverage = remappedCoverage.fileCoverageFor(filePath);
          filteredCoverage.addFileCoverage(fileCoverage);
        } catch {
          // Skip files that don't have coverage data after remapping
        }
      }
    }

    // 4️⃣ Create report context
    const context = libReport.createContext({
      dir: this.reportDir,
      coverageMap: filteredCoverage
    });

    // 5️⃣ Generate reports using modern istanbul-reports API
    const reportTypes = ['html', 'lcov', 'text'] as const;
    for (const type of reportTypes) {
      reports.create(type).execute(context);
    }

    logger.println(`✅ Coverage reports generated successfully`);
  }
}
