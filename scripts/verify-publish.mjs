import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  spawnSync,
} from 'node:child_process';
import {
  fileURLToPath,
} from 'node:url';

const scriptFile =
  fileURLToPath(
    import.meta.url,
  );

const projectRoot =
  path.resolve(
    path.dirname(scriptFile),
    '..',
  );

const distRoot =
  path.join(
    projectRoot,
    'dist/testify',
  );

const npmCommand =
  process.platform === 'win32'
    ? 'npm.cmd'
    : 'npm';

function run(
  command,
  args,
  options = {},
) {
  const result =
    spawnSync(
      command,
      args,
      {
        cwd:
          options.cwd ??
          projectRoot,
        encoding: 'utf8',
        stdio:
          options.capture
            ? 'pipe'
            : 'inherit',
        env: {
          ...process.env,
          ...options.env,
        },
      },
    );

  if (
    result.error
  ) {
    throw result.error;
  }

  if (
    result.status !== 0
  ) {
    const details = [
      result.stdout,
      result.stderr,
    ]
      .filter(Boolean)
      .join('\n');

    throw new Error(
      `${command} ${args.join(' ')} failed with exit code ${result.status}`
      + (
        details
          ? `\n${details}`
          : ''
      ),
    );
  }

  return result;
}

function assertFile(
  relativePath,
) {
  const filePath =
    path.join(
      distRoot,
      relativePath,
    );

  assert.ok(
    fs.existsSync(
      filePath,
    ),
    `Missing packaged file: ${relativePath}`,
  );
}

assert.ok(
  fs.existsSync(
    distRoot,
  ),
  'dist/testify does not exist. Run npm run build first.',
);

const packageJson =
  JSON.parse(
    fs.readFileSync(
      path.join(
        distRoot,
        'package.json',
      ),
      'utf8',
    ),
  );

assert.equal(
  packageJson.name,
  '@epikodelabs/testify',
);

assert.equal(
  packageJson.version,
  '2.0.0',
);

assert.equal(
  packageJson.exports?.['.']?.import,
  './lib/index.js',
);

assert.equal(
  packageJson.exports?.['.']?.types,
  './lib/index.d.ts',
);

assert.equal(
  packageJson.exports?.['./internals']?.import,
  './lib/internals.js',
);

assert.equal(
  packageJson.exports?.['./internals']?.types,
  './lib/internals.d.ts',
);

for (
  const relativePath of [
    'bin/testify',
    'bin/jasmine',
    'lib/index.js',
    'lib/index.d.ts',
    'lib/internals.js',
    'lib/internals.d.ts',
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    'assets/favicon.ico',
  ]
) {
  assertFile(
    relativePath,
  );
}

const temporaryRoot =
  fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      'testify-publish-',
    ),
  );

const packDirectory =
  path.join(
    temporaryRoot,
    'pack',
  );

const fixtureDirectory =
  path.join(
    temporaryRoot,
    'fixture',
  );

fs.mkdirSync(
  packDirectory,
  { recursive: true },
);

fs.mkdirSync(
  fixtureDirectory,
  { recursive: true },
);

try {
  const packResult =
    run(
      npmCommand,
      [
        'pack',
        '--json',
        '--pack-destination',
        packDirectory,
      ],
      {
        cwd: distRoot,
        capture: true,
      },
    );

  const packed =
    JSON.parse(
      packResult.stdout,
    );

  assert.ok(
    Array.isArray(packed) &&
    packed.length === 1,
    'npm pack did not return exactly one package.',
  );

  const tarballPath =
    path.join(
      packDirectory,
      packed[0].filename,
    );

  assert.ok(
    fs.existsSync(
      tarballPath,
    ),
    'npm pack tarball was not created.',
  );

  fs.writeFileSync(
    path.join(
      fixtureDirectory,
      'package.json',
    ),
    JSON.stringify(
      {
        name:
          'testify-publish-fixture',
        version:
          '1.0.0',
        private:
          true,
        type:
          'module',
      },
      null,
      2,
    ) + '\n',
  );

  fs.writeFileSync(
    path.join(
      fixtureDirectory,
      'smoke.mjs',
    ),
    `import assert from 'node:assert/strict';

import {
  CatalogQuery,
  RunnerSession,
  createExecutionPlan,
  partitionExecutionPlan,
  summarizeExecutionResults,
} from '@epikodelabs/testify';

import {
  CatalogState,
  PlanningEngine,
} from '@epikodelabs/testify/internals';

const catalog = {
  suites: [
    {
      id: 'suite-1',
      description: 'Fixture',
      fullName: 'Fixture',
    },
  ],
  specs: [
    {
      id: 'spec-1',
      suiteId: 'suite-1',
      description: 'works',
      fullName: 'Fixture works',
      file: 'fixture.spec.ts',
    },
  ],
};

const query =
  new CatalogQuery(catalog);

assert.equal(
  query.tests().length,
  1,
);

const plan =
  createExecutionPlan(
    catalog,
  );

assert.deepEqual(
  plan.specIds,
  ['spec-1'],
);

assert.equal(
  partitionExecutionPlan(
    plan,
    2,
  ).length,
  2,
);

const session =
  new RunnerSession(
    () => catalog,
    {
      async execute(executionPlan) {
        return summarizeExecutionResults(
          executionPlan.specIds.map(
            (id) => ({
              id,
              description: id,
              status: 'passed',
            }),
          ),
        );
      },
    },
  );

const result =
  await session.run();

assert.equal(
  result.failed,
  0,
);

assert.equal(
  result.passed,
  1,
);

assert.equal(
  session.query().tests().length,
  1,
);

assert.ok(
  typeof CatalogState === 'function',
);

assert.ok(
  typeof PlanningEngine === 'function',
);

console.log('Testify package smoke test passed.');
`,
  );

  run(
    npmCommand,
    [
      'install',
      '--no-audit',
      '--no-fund',
      tarballPath,
    ],
    {
      cwd:
        fixtureDirectory,
    },
  );

  run(
    process.execPath,
    [
      'smoke.mjs',
    ],
    {
      cwd:
        fixtureDirectory,
    },
  );

  const packageRoot =
    path.join(
      fixtureDirectory,
      'node_modules',
      '@epikodelabs',
      'testify',
    );

  run(
    process.execPath,
    [
      path.join(
        packageRoot,
        'bin/testify',
      ),
      '--help',
    ],
    {
      cwd:
        fixtureDirectory,
    },
  );

  run(
    process.execPath,
    [
      path.join(
        packageRoot,
        'bin/jasmine',
      ),
      '--help',
    ],
    {
      cwd:
        fixtureDirectory,
    },
  );

  console.log(
    `Verified packed Testify ${packageJson.version}: ${tarballPath}`,
  );
} finally {
  fs.rmSync(
    temporaryRoot,
    {
      recursive: true,
      force: true,
    },
  );
}
