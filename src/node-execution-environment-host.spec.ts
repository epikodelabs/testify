import {
  NodeExecutionEnvironmentHost,
} from './node-execution-environment-host';

describe('NodeExecutionEnvironmentHost', () => {
  it('applies and restores environment values', async () => {
    const originalNodeEnv =
      process.env.NODE_ENV;

    const originalValue =
      process.env
        .TESTIFY_STEP29_VALUE;

    const host =
      new NodeExecutionEnvironmentHost({
        env: {
          TESTIFY_STEP29_VALUE:
            'inside',
        },
        nodeEnv: 'test',
      });

    try {
      await host.run(
        async () => {
          expect(
            process.env.NODE_ENV,
          ).toBe('test');

          expect(
            process.env
              .TESTIFY_STEP29_VALUE,
          ).toBe('inside');
        },
      );

      expect(
        process.env.NODE_ENV,
      ).toBe(
        originalNodeEnv,
      );

      expect(
        process.env
          .TESTIFY_STEP29_VALUE,
      ).toBe(
        originalValue,
      );
    } finally {
      if (
        originalNodeEnv ===
        undefined
      ) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV =
          originalNodeEnv;
      }

      if (
        originalValue ===
        undefined
      ) {
        delete process.env
          .TESTIFY_STEP29_VALUE;
      } else {
        process.env
          .TESTIFY_STEP29_VALUE =
          originalValue;
      }
    }
  });

  it('restores environment even when work fails', async () => {
    const original =
      process.env
        .TESTIFY_STEP29_FAILURE;

    const host =
      new NodeExecutionEnvironmentHost({
        env: {
          TESTIFY_STEP29_FAILURE:
            'inside',
        },
      });

    try {
      await expectAsync(
        host.run(
          async () => {
            throw new Error(
              'expected',
            );
          },
        ),
      ).toBeRejected();

      expect(
        process.env
          .TESTIFY_STEP29_FAILURE,
      ).toBe(original);
    } finally {
      if (original === undefined) {
        delete process.env
          .TESTIFY_STEP29_FAILURE;
      } else {
        process.env
          .TESTIFY_STEP29_FAILURE =
          original;
      }
    }
  });

  it('suppresses and restores console methods', async () => {
    const originalLog =
      console.log;

    let calls = 0;

    console.log =
      (() => {
        calls++;
      }) as typeof console.log;

    const installedLog =
      console.log;

    const host =
      new NodeExecutionEnvironmentHost({
        suppressConsoleLogs: true,
      });

    try {
      await host.run(
        async () => {
          console.log(
            'hidden',
          );

          expect(calls).toBe(0);
        },
      );

      expect(
        console.log,
      ).toBe(installedLog);

      console.log(
        'visible',
      );

      expect(calls).toBe(1);
    } finally {
      console.log =
        originalLog;
    }
  });
});
