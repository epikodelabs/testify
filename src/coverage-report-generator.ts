import path from 'path';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import libSourceMaps from 'istanbul-lib-source-maps';
import libIstanbulApi from 'istanbul-api';
import { logger } from './console-repl';
import { norm } from './utils';
import deasync from 'deasync';

export class CoverageReportGenerator {
  private reportDir: string;

  constructor(reportDir: string = norm(path.join(process.cwd(), 'coverage'))) {
    this.reportDir = reportDir;
  }

generate(rawCoverageData: Record<string, any>): void {
    if (!rawCoverageData || Object.keys(rawCoverageData).length === 0) {
      logger.println('⚠️  No coverage data received.');
      return;
    }

    // 1️⃣ Coverage map from raw data
    const coverageMap = libCoverage.createCoverageMap(rawCoverageData);

    // 2️⃣ Remap coverage using source maps with polling
    const remapper = libSourceMaps.createSourceMapStore();
    let remappedCoverage = coverageMap;
    
    const maxAttempts = 50;
    let attempts = 0;
    let hasTransformed = false;
    
    // Iteratively call transformCoverage until we get TypeScript sources
    while (attempts < maxAttempts && !hasTransformed) {
      let done = false;
      let result: any = null;
      let error: any = null;
      
      // Call async transformCoverage
      remapper.transformCoverage(coverageMap)
        .then((transformed) => {
          result = transformed;
          done = true;
        })
        .catch((err) => {
          error = err;
          done = true;
        });
      
      // Block synchronously until promise resolves
      while (!done) {
        deasync.sleep(10);
      }
      
      // Check if we got valid transformed coverage
      if (result && !error) {
        const transformedFiles = Object.keys(result.data);
        const hasSourceFiles = transformedFiles.some(f => 
          f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.jsx')
        );
        
        if (hasSourceFiles) {
          remappedCoverage = result;
          hasTransformed = true;
          if (attempts > 0) {
            logger.println(`✅ Coverage remapped after ${attempts + 1} attempts`);
          }
          break;
        }
      }
      
      // Wait before retry
      if (attempts < maxAttempts - 1) {
        deasync.sleep(100);
      }
      
      attempts++;
    }
    
    if (!hasTransformed) {
      logger.println('⚠️  Could not transform coverage to source files, using raw coverage');
    }

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

    logger.println(`✅ Coverage reports generated in ${this.reportDir}`);
  }
}
