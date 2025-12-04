import path from 'path';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import libSourceMaps from 'istanbul-lib-source-maps';
import libIstanbulApi from 'istanbul-api';
import { logger } from './console-repl';
import { norm } from './utils';

export class CoverageReportGenerator {
  private reportDir: string;

  constructor(reportDir: string = norm(path.join(process.cwd(), 'coverage'))) {
    this.reportDir = reportDir;
  }

  saveCoverageToFile(coverage: any): void {
    try {
      const fs = require("fs");
      const path = require("path");

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
    const remappedCoverage = await remapper.transformCoverage(coverageMap);

    // 3️⃣ Create report context
    const context = libReport.createContext({
      dir: this.reportDir,
      coverageMap: remappedCoverage
    });

    // 4️⃣ Generate reports
    const reporter = libIstanbulApi.createReporter();
    reporter.dir = this.reportDir;
    reporter.addAll(['html', 'lcov', 'text']);
    reporter.write(remappedCoverage, true);

    logger.println(`✅ Coverage reports generated successfully`);
  }
}
