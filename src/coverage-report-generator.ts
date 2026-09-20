import fs from 'fs';
import path from 'path';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import libSourceMaps from 'istanbul-lib-source-maps';
import reports from 'istanbul-reports';
import { getMaxWidth, supportsColor } from './ansi-constants';
import { logger } from './logger';
import { norm } from './utils';
import { CoverageMessages } from './log-messages';
import { renderTerminalPanel } from './ink-output';

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

      logger.println(CoverageMessages.rawCoverageSaved(outFile));
    } catch (err) {
      logger.error(CoverageMessages.failedToWriteCoverage(err));
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
        } catch (error) {
          logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`);
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
        } catch (error) {
          logger.error(`${error instanceof Error ? error.stack ?? error.message : String(error)}`);
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
    reports.create('html').execute(context);
    reports.create('lcov').execute(context);

    // Keep the detailed table on disk. The terminal gets a compact summary so
    // it remains visible after the test-results panel.
    reports.create('text', { file: 'coverage.txt', maxCols: getMaxWidth() }).execute(context);
    const summary = filteredCoverage.getCoverageSummary().data;
    const metrics = [
      ['Statements', summary.statements],
      ['Branches', summary.branches],
      ['Functions', summary.functions],
      ['Lines', summary.lines],
    ] as const;
    const countWidth = Math.max(
      ...metrics.map(([, metric]) => `${metric.covered}/${metric.total}`.length),
    );
    const metricLine = (
      label: string,
      metric: { pct: number; covered: number; total: number },
    ) => {
      const cells = 20;
      const filled = Math.round(Math.max(0, Math.min(100, metric.pct)) / 100 * cells);
      const meter = `${'━'.repeat(filled)}${'─'.repeat(cells - filled)}`;
      const prefix = `${label.padEnd(11)} ${String(metric.pct).padStart(6)}%  ${meter}`;
      const total = `${metric.covered}/${metric.total}`;
      return `${prefix}  ${total.padStart(countWidth)}`;
    };
    const displayPath = (file: string) => norm(path.relative(process.cwd(), file)) || '.';
    const htmlReport = path.join(this.reportDir, 'index.html');
    const lines = [
      ...metrics.map(([label, metric]) => metricLine(label, metric)),
      '',
      `HTML report  ${displayPath(htmlReport)}`,
      `LCOV         ${displayPath(path.join(this.reportDir, 'lcov.info'))}`,
    ];
    logger.printRaw(
      renderTerminalPanel('COVERAGE', lines, '#f59e0b', supportsColor()) + '\n',
    );
  }
}
