/**
 * Compatibility-only APIs retained for migration from Testify 1.x.
 *
 * New code should prefer RunnerSession.
 */

/**
 * @deprecated Use RunnerSession.run(), runSpec(), runSuite(), or runFile().
 */
export type LegacyRunTests = (
  ...args: unknown[]
) => Promise<unknown>;

/**
 * @deprecated Use RunnerSession.listTests().
 */
export type LegacyGetAllSpecs = () => unknown[];

/**
 * @deprecated Use RunnerSession.listSuites().
 */
export type LegacyGetAllSuites = () => unknown[];
