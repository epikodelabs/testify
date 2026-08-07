import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  discoverBrowserBuildArtifacts,
} from './browser-build-artifacts';

describe('BrowserBuildArtifacts', () => {
  it('discovers JS output and spec artifacts', () => {
    const dir =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-artifacts-',
        ),
      );

    try {
      fs.writeFileSync(
        path.join(
          dir,
          'app.js',
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
        discoverBrowserBuildArtifacts(
          dir,
        );

      expect(
        artifacts.files,
      ).toEqual([
        'app.js',
        'forms.spec.js',
      ]);

      expect(
        artifacts.specFiles,
      ).toEqual([
        'forms.spec.js',
      ]);
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
