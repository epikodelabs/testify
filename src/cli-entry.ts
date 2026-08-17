import { CLIHandler } from './cli-handler';

CLIHandler.run()
  .then((code) => process.exit(code))
  .catch(() => process.exit(1));
