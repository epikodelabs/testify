import {
  EXIT_CODES,
} from './exit-codes';
import {
  runNodeCli,
} from './node-cli-runner';
import {
  logger,
} from './logger';

describe('Node CLI deferred process errors', () => {
  it('captures uncaught exceptions for the final report instead of logging mid-run', async () => {
    const beforeHandlers =
      new Set(
        process.listeners(
          'uncaughtException',
        ),
      );
    const previousExitCode =
      process.exitCode;
    const recorded: any[] = [];
    const errorSpy =
      spyOn(logger, 'error');

    const runner = {
      recordGlobalFailure(failure: any) {
        recorded.push(failure);
      },
      async start() {
        const handler =
          process.listeners(
            'uncaughtException',
          ).find(
            (candidate) =>
              !beforeHandlers.has(candidate),
          );

        expect(handler).toBeDefined();
        handler?.(
          new Error(
            'background callback exploded',
          ),
          'uncaughtException',
        );

        return {
          specResults: [],
          total: 0,
          passed: 0,
          failed: 0,
          pending: 0,
          globalFailures: [],
        };
      },
      async stop() {},
    };

    try {
      const result =
        await runNodeCli(
          runner as any,
        );

      expect(recorded).toHaveSize(1);
      expect(recorded[0])
        .toEqual(
          jasmine.objectContaining({
            globalErrorType:
              'uncaughtException',
            message:
              'background callback exploded',
          }),
        );
      expect(errorSpy)
        .not.toHaveBeenCalled();
      expect(result.exitCode)
        .toBe(
          EXIT_CODES.INTERNAL_ERROR,
        );
    } finally {
      process.exitCode =
        previousExitCode;
    }
  });

  it('captures unhandled rejections through the same deferred path', async () => {
    const beforeHandlers =
      new Set(
        process.listeners(
          'unhandledRejection',
        ),
      );
    const previousExitCode =
      process.exitCode;
    const recorded: any[] = [];
    spyOn(logger, 'error');

    const runner = {
      recordGlobalFailure(failure: any) {
        recorded.push(failure);
      },
      async start() {
        const handler =
          process.listeners(
            'unhandledRejection',
          ).find(
            (candidate) =>
              !beforeHandlers.has(candidate),
          );

        expect(handler).toBeDefined();
        handler?.(
          new Error(
            'async callback rejected',
          ),
          Promise.resolve(),
        );

        return {
          specResults: [],
          total: 0,
          passed: 0,
          failed: 0,
          pending: 0,
          globalFailures: [],
        };
      },
      async stop() {},
    };

    try {
      await runNodeCli(
        runner as any,
      );

      expect(recorded).toHaveSize(1);
      expect(recorded[0])
        .toEqual(
          jasmine.objectContaining({
            globalErrorType:
              'unhandledRejection',
            message:
              'async callback rejected',
          }),
        );
    } finally {
      process.exitCode =
        previousExitCode;
    }
  });
});
