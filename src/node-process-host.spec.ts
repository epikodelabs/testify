import {
  ndescribe,
} from './env.spec';
import {
  NodeProcessHost,
} from './node-process-host';

ndescribe('NodeProcessHost', () => {
  it('attaches and detaches only its own handlers', () => {
    const beforeSigint =
      process.listenerCount(
        'SIGINT',
      );

    const beforeRejection =
      process.listenerCount(
        'unhandledRejection',
      );

    const host =
      new NodeProcessHost();

    host.attach();

    expect(
      process.listenerCount(
        'SIGINT',
      ),
    ).toBe(
      beforeSigint + 1,
    );

    expect(
      process.listenerCount(
        'unhandledRejection',
      ),
    ).toBe(
      beforeRejection + 1,
    );

    host.detach();

    expect(
      process.listenerCount(
        'SIGINT',
      ),
    ).toBe(
      beforeSigint,
    );

    expect(
      process.listenerCount(
        'unhandledRejection',
      ),
    ).toBe(
      beforeRejection,
    );
  });

  it('is idempotent', () => {
    const before =
      process.listenerCount(
        'SIGTERM',
      );

    const host =
      new NodeProcessHost();

    host.attach();
    host.attach();

    expect(
      process.listenerCount(
        'SIGTERM',
      ),
    ).toBe(
      before + 1,
    );

    host.detach();
    host.detach();

    expect(
      process.listenerCount(
        'SIGTERM',
      ),
    ).toBe(
      before,
    );
  });
});
