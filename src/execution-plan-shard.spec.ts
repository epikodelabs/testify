import {
  partitionExecutionPlan,
  shardExecutionPlan,
  type ExecutionPlan,
} from './execution-plan';

describe('ExecutionPlan sharding', () => {
  const plan: ExecutionPlan = {
    specIds: [
      'a',
      'b',
      'c',
      'd',
      'e',
    ],
    random: false,
    source: {
      kind: 'all',
    },
  };

  it('creates deterministic modulo shards', () => {
    expect(
      shardExecutionPlan(
        plan,
        0,
        2,
      ).specIds,
    ).toEqual([
      'a',
      'c',
      'e',
    ]);

    expect(
      shardExecutionPlan(
        plan,
        1,
        2,
      ).specIds,
    ).toEqual([
      'b',
      'd',
    ]);
  });

  it('partitions into the requested number of plans', () => {
    const partitions =
      partitionExecutionPlan(
        plan,
        3,
      );

    expect(partitions)
      .toHaveSize(3);

    expect(
      partitions.flatMap(
        (part) =>
          part.specIds,
      ).sort(),
    ).toEqual(
      [...plan.specIds].sort(),
    );
  });
});
