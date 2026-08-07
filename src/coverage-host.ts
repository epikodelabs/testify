import {
  CoverageReportGenerator,
} from './coverage-report-generator';

export class CoverageHost {
  constructor(
    private readonly enabled = false,
  ) {}

  async generate(
    coverage:
      | Record<string, unknown>
      | undefined,
  ): Promise<void> {
    if (
      !this.enabled ||
      !coverage
    ) {
      return;
    }

    const generator =
      new CoverageReportGenerator();

    await generator.generate(
      coverage,
    );
  }

  async generateGlobal():
    Promise<void> {
    await this.generate(
      (globalThis as any)
        .__coverage__,
    );
  }
}
