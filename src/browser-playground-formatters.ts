export function getBrowserPlaygroundFormattersSource(): string {
  return `
function installTestifyPlaygroundFormatters() {
  const formatters =
    Array.isArray(globalThis.devtoolsFormatters)
      ? globalThis.devtoolsFormatters
      : [];

  if (
    formatters.some(
      (formatter) =>
        formatter?.__testifyPlaygroundFormatter === true,
    )
  ) {
    return;
  }

  function text(value) {
    return value === undefined || value === null
      ? ''
      : String(value);
  }

  function shortFile(file) {
    const value = text(file).replace(/\\\\/g, '/');
    const parts = value.split('/');
    return parts[parts.length - 1] || value;
  }

  function isSession(value) {
    return Boolean(
      value &&
      typeof value === 'object' &&
      typeof value.plan === 'function' &&
      typeof value.execute === 'function' &&
      typeof value.revision === 'function' &&
      typeof value.tests === 'function',
    );
  }

  function isPlan(value) {
    return Boolean(
      value &&
      typeof value === 'object' &&
      Array.isArray(value.specIds) &&
      value.source &&
      typeof value.tests === 'function' &&
      typeof value.filter === 'function' &&
      typeof value.slice === 'function',
    );
  }

  function isExecutionResult(value) {
    return Boolean(
      value &&
      typeof value === 'object' &&
      Array.isArray(value.specResults) &&
      typeof value.total === 'number' &&
      typeof value.passed === 'number' &&
      typeof value.failed === 'number',
    );
  }

  function isExecutionRecord(value) {
    return Boolean(
      value &&
      typeof value === 'object' &&
      isPlan(value.plan) &&
      isExecutionResult(value.result) &&
      typeof value.revision === 'number',
    );
  }

  function collectionKind(value) {
    if (!Array.isArray(value)) return null;

    const explicitKind =
      value.__testifyCollectionKind;

    if (
      explicitKind === 'tests' ||
      explicitKind === 'suites' ||
      explicitKind === 'files' ||
      explicitKind === 'results'
    ) {
      return explicitKind;
    }

    if (!value.length) return null;

    const item = value[0];
    if (!item || typeof item !== 'object') return null;

    if (
      typeof item.status === 'string' &&
      typeof item.id === 'string'
    ) {
      return 'results';
    }

    if (
      typeof item.specs === 'number' &&
      typeof item.file === 'string'
    ) {
      return 'files';
    }

    if (
      Object.prototype.hasOwnProperty.call(
        item,
        'parentSuiteId',
      )
    ) {
      return 'suites';
    }

    if (
      typeof item.id === 'string' &&
      typeof item.fullName === 'string' &&
      (
        Object.prototype.hasOwnProperty.call(
          item,
          'suiteId',
        ) ||
        Object.prototype.hasOwnProperty.call(
          item,
          'description',
        )
      )
    ) {
      return 'tests';
    }

    return null;
  }

  function summarySpan(label, detail) {
    return [
      'span',
      {},
      [
        'span',
        {
          style:
            'font-weight:600;color:#0b7a53',
        },
        label,
      ],
      detail
        ? [
            'span',
            {
              style:
                'margin-left:8px;color:#777',
            },
            detail,
          ]
        : '',
    ];
  }

  function row(columns) {
    return [
      'div',
      {
        style:
          'display:grid;grid-template-columns:minmax(80px,1fr) minmax(180px,3fr) minmax(100px,1.3fr);gap:10px;padding:2px 0;font-family:monospace',
      },
      ...columns.map(
        (column) => [
          'span',
          {
            style:
              'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
          },
          text(column),
        ],
      ),
    ];
  }

  function testRows(tests) {
    return tests.map(
      (test) =>
        row([
          test.id,
          test.fullName || test.name || test.description,
          shortFile(test.file),
        ]),
    );
  }

  function suiteRows(suites) {
    return suites.map(
      (suite) =>
        row([
          suite.id,
          suite.fullName || suite.name,
          shortFile(suite.file),
        ]),
    );
  }

  function fileRows(files) {
    return files.map(
      (file) =>
        row([
          file.specs + ' specs',
          file.file,
          '',
        ]),
    );
  }

  function resultRows(results) {
    return results.map(
      (result) =>
        row([
          result.status,
          result.fullName || result.description,
          result.failedExpectations?.length
            ? result.failedExpectations.length + ' failures'
            : '',
        ]),
    );
  }

  function collectionHeader(kind, value) {
    const labels = {
      tests: 'Tests',
      suites: 'Suites',
      files: 'Files',
      results: 'Results',
    };

    const first = value[0];
    let hint = value.length + ' items';

    if (
      kind === 'results' &&
      value.some(
        (result) => result.status === 'failed',
      )
    ) {
      const failed = value.filter(
        (result) => result.status === 'failed',
      ).length;
      hint = value.length + ' items · ' + failed + ' failed';
    } else if (
      (kind === 'tests' || kind === 'suites') &&
      first
    ) {
      const name =
        first.fullName ||
        first.name ||
        first.description;
      if (name) {
        hint += ' · ' + name + (value.length > 1 ? ' …' : '');
      }
    }

    return summarySpan(
      labels[kind] || 'Collection',
      hint,
    );
  }

  const formatter = {
    __testifyPlaygroundFormatter: true,

    header(value) {
      if (isSession(value)) {
        let revision = '?';
        try {
          revision = value.revision();
        } catch {}

        return summarySpan(
          'Testify Session',
          text(value.state) + ' · revision ' + revision,
        );
      }

      if (isPlan(value)) {
        const tests = value.tests();
        const files = new Set(
          tests
            .map((test) => test.file)
            .filter(Boolean),
        );
        const source = value.source?.kind || 'plan';

        return summarySpan(
          'Execution Plan',
          tests.length +
            ' tests · ' +
            files.size +
            ' files · ' +
            source +
            (value.catalogVersion !== undefined
              ? ' · revision ' + value.catalogVersion
              : ''),
        );
      }

      if (isExecutionRecord(value)) {
        const result = value.result;
        return summarySpan(
          'Execution',
          result.passed +
            ' passed · ' +
            result.failed +
            ' failed · revision ' +
            value.revision,
        );
      }

      if (isExecutionResult(value)) {
        return summarySpan(
          'Execution Result',
          value.passed +
            ' passed · ' +
            value.failed +
            ' failed · ' +
            value.pending +
            ' pending',
        );
      }

      const kind = collectionKind(value);
      if (kind) {
        return collectionHeader(
          kind,
          value,
        );
      }

      return null;
    },

    hasBody(value) {
      if (
        isSession(value) ||
        isPlan(value) ||
        isExecutionRecord(value) ||
        isExecutionResult(value)
      ) {
        return true;
      }

      return Boolean(
        collectionKind(value),
      );
    },

    body(value) {
      if (isSession(value)) {
        return [
          'div',
          {},
          row([
            'state',
            value.state,
            '',
          ]),
          row([
            'revision',
            (() => {
              try {
                return value.revision();
              } catch {
                return '?';
              }
            })(),
            '',
          ]),
          row([
            'controls',
            'tests · plan · run · rerun · retry · exit',
            '',
          ]),
        ];
      }

      if (isPlan(value)) {
        return [
          'div',
          {},
          ...testRows(
            value.tests(),
          ),
        ];
      }

      if (isExecutionRecord(value)) {
        return [
          'div',
          {},
          row([
            'intent',
            value.intent?.kind || 'plan',
            '',
          ]),
          row([
            'revision',
            value.revision,
            '',
          ]),
          row([
            'result',
            value.result.passed +
              ' passed · ' +
              value.result.failed +
              ' failed',
            '',
          ]),
          ...resultRows(
            value.result.specResults,
          ),
        ];
      }

      if (isExecutionResult(value)) {
        return [
          'div',
          {},
          ...resultRows(
            value.specResults,
          ),
        ];
      }

      const kind = collectionKind(value);
      if (kind === 'tests') {
        return ['div', {}, ...testRows(value)];
      }
      if (kind === 'suites') {
        return ['div', {}, ...suiteRows(value)];
      }
      if (kind === 'files') {
        return ['div', {}, ...fileRows(value)];
      }
      if (kind === 'results') {
        return ['div', {}, ...resultRows(value)];
      }

      return null;
    },
  };

  formatters.push(formatter);
  globalThis.devtoolsFormatters = formatters;
}
`;
}
