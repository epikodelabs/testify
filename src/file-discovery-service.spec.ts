import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  FileDiscoveryService,
} from './file-discovery-service';

describe('FileDiscoveryService', () => {
  function createConfig(
    root: string,
    browser: string,
  ) {
    return {
      srcDirs: [
        path.join(root, 'src'),
      ],
      testDirs: [
        path.join(root, 'tests'),
      ],
      exclude: [],
      outDir: path.join(root, 'dist'),
      browser,
      preserveOutputs: false,
    } as any;
  }

  it('skips Node-only specs in browser mode', async () => {
    const root =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-discovery-',
        ),
      );

    try {
      fs.mkdirSync(
        path.join(root, 'src'),
        { recursive: true },
      );
      fs.mkdirSync(
        path.join(root, 'tests'),
        { recursive: true },
      );

      fs.writeFileSync(
        path.join(root, 'src', 'browser.ts'),
        'export const answer = 42;\n',
      );
      fs.writeFileSync(
        path.join(root, 'src', 'node-helper.ts'),
        "import fs from 'fs';\nexport const nodeFs = fs;\n",
      );
      fs.writeFileSync(
        path.join(root, 'src', 'node-global-helper.ts'),
        'export const pid = process.pid;\n',
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'browser.spec.ts'),
        "import { answer } from '../src/browser';\nvoid answer;\n",
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'node-only.spec.ts'),
        "import fs from 'fs';\nvoid fs;\n",
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'transitive-node.spec.ts'),
        "import { nodeFs } from '../src/node-helper';\nvoid nodeFs;\n",
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'process-global.spec.ts'),
        'void process.pid;\n',
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'transitive-process.spec.ts'),
        "import { pid } from '../src/node-global-helper';\nvoid pid;\n",
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'env-marked-node.spec.ts'),
        "import { ndescribe } from '../src/env.spec';\nndescribe('node only', () => { void process.pid; });\n",
      );

      const service =
        new FileDiscoveryService(
          createConfig(
            root,
            'chrome',
          ),
        );

      const result =
        await service.discoverSources();

      expect(
        result.specFiles.map(
          (file) =>
            path.basename(file),
        ).sort(),
      ).toEqual([
        'browser.spec.ts',
        'env-marked-node.spec.ts',
      ]);

      expect(
        result.srcFiles.map(
          (file) =>
            path.basename(file),
        ).sort(),
      ).toEqual([
        'browser.ts',
      ]);
    } finally {
      fs.rmSync(
        root,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });

  it('keeps Node-only specs in Node mode', async () => {
    const root =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          'testify-discovery-',
        ),
      );

    try {
      fs.mkdirSync(
        path.join(root, 'tests'),
        { recursive: true },
      );

      fs.writeFileSync(
        path.join(root, 'tests', 'browser.spec.ts'),
        "describe('browser', () => undefined);\n",
      );
      fs.writeFileSync(
        path.join(root, 'tests', 'node-only.spec.ts'),
        "import path from 'path';\nvoid path;\n",
      );

      const service =
        new FileDiscoveryService(
          createConfig(
            root,
            'node',
          ),
        );

      const result =
        await service.discoverSources();

      expect(
        result.specFiles.map(
          (file) =>
            path.basename(file),
        ).sort(),
      ).toEqual([
        'browser.spec.ts',
        'node-only.spec.ts',
      ]);
    } finally {
      fs.rmSync(
        root,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });
});
