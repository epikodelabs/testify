export const EXIT_CODES = {
  SUCCESS: 0,
  TEST_FAILURES: 1,
  INVALID_USAGE: 2,
  CONFIG_ERROR: 3,
  INTERNAL_ERROR: 4,
  SUCCESS_WITH_PENDING: 5,
  SIGINT: 130,
  SIGTERM: 143,
} as const;

export class ExitCodeError extends Error {
  constructor(
    public readonly exitCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ExitCodeError';
  }
}

export function getExitCode(error: unknown, fallback = EXIT_CODES.INTERNAL_ERROR): number {
  if (error instanceof ExitCodeError) {
    return error.exitCode;
  }
  return fallback;
}

export function getSignalExitCode(signal?: NodeJS.Signals | null): number {
  switch (signal) {
    case 'SIGINT':
      return EXIT_CODES.SIGINT;
    case 'SIGTERM':
      return EXIT_CODES.SIGTERM;
    default:
      return EXIT_CODES.INTERNAL_ERROR;
  }
}
