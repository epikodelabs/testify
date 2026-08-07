import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  NodeRunnerHost,
} from './node-runner-host';

describe('NodeRunnerHost', () => {
  it('writes, loads, and executes a generated runner module', async () => {
    const dir =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-node-host-',
        ),
      );

    try {
      const runnerFile =
        path.join(
          dir,
          'test-runner.mjs',
        );

      const host =
        new NodeRunnerHost(
          runnerFile,
        );

      host.write(`
        export async function runTests(
          reporter,
          selector
        ) {
          reporter.received = selector;
          return {
            specResults: [],
            total: 0,
            passed: 0,
            failed: 0,
            pending: 0,
            exitCode: 7,
          };
        }
      `);

      const reporter: any = {};

      const exitCode =
        await host.execute(
          reporter,
          {
            suite: 'suite1',
          },
        );

      expect(exitCode.exitCode).toBe(7);

      expect(
        reporter.received,
      ).toEqual({
        suite: 'suite1',
      });

      expect(
        host.loadedModule,
      ).not.toBeNull();

      host.clear();

      expect(
        host.loadedModule,
      ).toBeNull();
    } finally {
      fs.rmSync(
        dir,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });
});
