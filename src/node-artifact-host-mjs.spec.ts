import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  discoverNodeBuildArtifacts,
} from './node-build-artifacts';

describe('Node mjs build artifacts', () => {
  it('discovers .spec.mjs and resolves test-runner.mjs', () => {
    const directory =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-mjs-',
        ),
      );

    try {
      fs.writeFileSync(
        path.join(
          directory,
          'fixture__12345678.spec.mjs',
        ),
        '',
      );

      fs.writeFileSync(
        path.join(
          directory,
          'source__12345678.mjs',
        ),
        '',
      );

      const artifacts =
        discoverNodeBuildArtifacts(
          directory,
        );

      expect(
        artifacts.specFiles,
      ).toEqual([
        'fixture__12345678.spec.mjs',
      ]);

      expect(
        artifacts.runnerFile,
      ).toMatch(
        /test-runner\.mjs$/,
      );
    } finally {
      fs.rmSync(
        directory,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });
});
