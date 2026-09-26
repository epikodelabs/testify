import fs from 'fs';
import path from 'path';

describe('standalone Jasmine process-error handling', () => {
  it('records unhandled promise rejections in the reporter instead of exiting mid-run', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/ts-jasmine-cli.ts',
        ),
        'utf8',
      );

    const start =
      source.indexOf(
        'const onUnhandledRejection',
      );
    const end =
      source.indexOf(
        'const onUncaughtException',
        start,
      );
    const handler =
      source.slice(start, end);

    expect(handler).toContain(
      'reporter.recordGlobalFailure',
    );
    expect(handler).not.toContain(
      'logger.error(',
    );
    expect(handler).not.toContain(
      'process.exit(',
    );
  });

  it('records uncaught exceptions in the reporter instead of exiting mid-run', () => {
    const source =
      fs.readFileSync(
        path.resolve(
          process.cwd(),
          'src/ts-jasmine-cli.ts',
        ),
        'utf8',
      );

    const start =
      source.indexOf(
        'const onUncaughtException',
      );
    const end =
      source.indexOf(
        "process.on('unhandledRejection'",
        start,
      );
    const handler =
      source.slice(start, end);

    expect(handler).toContain(
      'reporter.recordGlobalFailure',
    );
    expect(handler).toContain(
      "globalErrorType: 'uncaughtException'",
    );
    expect(handler).not.toContain(
      'logger.error(',
    );
    expect(handler).not.toContain(
      'process.exit(',
    );
  });

});
