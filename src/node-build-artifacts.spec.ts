import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  discoverNodeBuildArtifacts,
} from './node-build-artifacts';

describe('NodeBuildArtifacts', () => {
  it('discovers node build files and specs', () => {
    const dir =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-node-artifacts-',
        ),
      );

    try {
      fs.writeFileSync(
        path.join(
          dir,
          'shared.js',
        ),
        '',
      );

      fs.writeFileSync(
        path.join(
          dir,
          'forms.spec.js',
        ),
        '',
      );

      fs.writeFileSync(
        path.join(
          dir,
          'notes.txt',
        ),
        '',
      );

      const artifacts =
        discoverNodeBuildArtifacts(
          dir,
        );

      expect(
        artifacts.files,
      ).toEqual([
        'forms.spec.js',
        'shared.js',
      ]);

      expect(
        artifacts.specFiles,
      ).toEqual([
        'forms.spec.js',
      ]);

      expect(
        artifacts.runnerFile,
      ).toContain(
        'test-runner.js',
      );
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
