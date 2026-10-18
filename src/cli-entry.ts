import { CLIHandler } from './cli-handler';
import { getExitCode } from './exit-codes';

CLIHandler.run({ printBanner: true })
  .then((code) => process.exit(code))
  .catch((error: unknown) => {
    // The last line of defense for defects in the runner itself. An escapee
    // here must never exit silently: print enough to file a bug, and keep the
    // internal-error code instead of masquerading as a test failure (1).
    const detail = error instanceof Error ? error.stack ?? error.message : String(error);
    process.stderr.write(`${detail}\n`);
    process.exit(getExitCode(error));
  });
