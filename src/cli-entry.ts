import { CLIHandler } from './cli-handler';

CLIHandler.run({ printBanner: true })
  .then((code) => process.exit(code))
  .catch(() => process.exit(1));
