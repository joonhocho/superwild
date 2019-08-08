// tslint:disable no-console
import { CompareResult } from '_src/compareCommon';
import { MatchAny, MatchNone } from './const';
import { matchObject } from './matchObject';

const { Disjoint, Intersect, Subset, Identity, Superset } = CompareResult;

test('matchObject', () => {
  expect(matchObject({}, {}, {})).toBe(null);
  expect(matchObject({ a: MatchAny }, {}, {})).toBe('a');
  expect(matchObject({ a: MatchAny }, { a: MatchAny }, {})).toBe(null);
  expect(matchObject({ a: MatchNone }, { a: MatchAny }, {})).toBe('a');
  expect(matchObject({ a: MatchAny }, { a: MatchNone }, {})).toBe('a');
  expect(matchObject({ a: MatchNone }, { a: MatchNone }, {})).toBe('a');

  expect(matchObject({ a: 'a' }, {}, {})).toBe('a');
  expect(matchObject({}, { a: 'a' }, {})).toBe('a');
  expect(matchObject({ '*': MatchAny }, { a: 'a' }, {})).toBe(null);
  expect(matchObject({ a: 'a' }, { a: 'b' }, {})).toBe('a');
  expect(matchObject({ a: 'a' }, { a: MatchAny }, {})).toBe(null);
  expect(matchObject({ a: 'a' }, { ['*']: MatchAny }, {})).toBe(null);
  expect(matchObject({ a: 'a' }, { ['*']: 'a' }, {})).toBe(null);
  expect(matchObject({ a: 'a' }, { ['*']: MatchNone }, {})).toBe('a');
  expect(matchObject({ a: 'a' }, { ['*']: ['a'] }, {})).toBe(null);
  expect(matchObject({ a: 'a' }, { ['*']: ['a', 'b'] }, {})).toBe(null);
  expect(matchObject({ a: 'a' }, { ['*']: ['b'] }, {})).toBe('a');
  expect(matchObject({ a: 'a' }, { ['*']: ['b'] }, { '*': Disjoint })).toBe(
    null
  );
  expect(matchObject({ a: 'a' }, { ['*']: ['a'] }, { '*': Disjoint })).toBe(
    'a'
  );
  expect(matchObject({}, { b: 'b' }, {})).toBe('b');
  expect(matchObject({}, { b: 'b' }, { '*': Disjoint })).toBe(null);

  // disjoint
  expect(matchObject({ a: 'a' }, { a: 'b' }, { a: Disjoint })).toBe(null);
  expect(
    matchObject({ a: ['a', 'b'] }, { a: ['b', 'c'] }, { a: Disjoint })
  ).toBe('a');
  expect(matchObject({ a: ['b'] }, { a: ['b', 'c'] }, { a: Disjoint })).toBe(
    'a'
  );
  expect(matchObject({ a: ['b'] }, { a: ['b'] }, { a: Disjoint })).toBe('a');
  expect(matchObject({ a: ['a', 'b'] }, { a: ['b'] }, { a: Disjoint })).toBe(
    'a'
  );

  // intersect
  expect(matchObject({ a: 'a' }, { a: 'b' }, { a: Intersect })).toBe('a');
  expect(
    matchObject({ a: ['a', 'b'] }, { a: ['b', 'c'] }, { a: Intersect })
  ).toBe(null);
  expect(matchObject({ a: ['b'] }, { a: ['b', 'c'] }, { a: Intersect })).toBe(
    null
  );
  expect(matchObject({ a: ['b'] }, { a: ['b'] }, { a: Intersect })).toBe(null);
  expect(matchObject({ a: ['a', 'b'] }, { a: ['b'] }, { a: Intersect })).toBe(
    null
  );

  // subset
  expect(matchObject({ a: 'a' }, { a: 'b' }, { a: Subset })).toBe('a');
  expect(matchObject({ a: ['a', 'b'] }, { a: ['b', 'c'] }, { a: Subset })).toBe(
    'a'
  );
  expect(matchObject({ a: ['b'] }, { a: ['b', 'c'] }, { a: Subset })).toBe(
    null
  );
  expect(matchObject({ a: ['b'] }, { a: ['b'] }, { a: Subset })).toBe(null);
  expect(matchObject({ a: ['a', 'b'] }, { a: ['b'] }, { a: Subset })).toBe('a');

  // identity
  expect(matchObject({ a: 'a' }, { a: 'b' }, { a: Identity })).toBe('a');
  expect(
    matchObject({ a: ['a', 'b'] }, { a: ['b', 'c'] }, { a: Identity })
  ).toBe('a');
  expect(matchObject({ a: ['b'] }, { a: ['b', 'c'] }, { a: Identity })).toBe(
    'a'
  );
  expect(matchObject({ a: ['b'] }, { a: ['b'] }, { a: Identity })).toBe(null);
  expect(matchObject({ a: ['a', 'b'] }, { a: ['b'] }, { a: Identity })).toBe(
    'a'
  );

  // superset
  expect(matchObject({ a: 'a' }, { a: 'b' }, { a: Superset })).toBe('a');
  expect(
    matchObject({ a: ['a', 'b'] }, { a: ['b', 'c'] }, { a: Superset })
  ).toBe('a');
  expect(matchObject({ a: ['b'] }, { a: ['b', 'c'] }, { a: Superset })).toBe(
    'a'
  );
  expect(matchObject({ a: ['b'] }, { a: ['b'] }, { a: Superset })).toBe(null);
  expect(matchObject({ a: ['a', 'b'] }, { a: ['b'] }, { a: Superset })).toBe(
    null
  );

  expect(
    matchObject({ a: 'a' }, { a: 'b' }, { a: Disjoint, b: Intersect })
  ).toBe(null);

  expect(
    matchObject(
      { a: 'a', b: ['a', 'b'] },
      { a: 'b', b: ['b', 'c'] },
      { a: Disjoint, b: Intersect }
    )
  ).toBe(null);

  expect(
    matchObject(
      { a: 'a', b: ['a', 'b'], c: 'a', d: ['a', 'b'], e: ['a', 'b'] },
      { a: 'b', b: ['b', 'c'], c: ['a', 'b'], d: ['a', 'b'], e: ['a'] },
      { a: Disjoint, b: Intersect, c: Subset, d: Identity, e: Superset }
    )
  ).toBe(null);

  expect(
    matchObject(
      { a: 'a', b: ['a', 'b'], c: 'a', d: ['a', 'b'], e: ['a', 'b'] },
      { a: 'b', b: ['b', 'c'], c: ['a'], d: ['a', 'b'], e: ['a'] },
      { a: Disjoint, b: Intersect, c: Subset, d: Identity, e: Superset }
    )
  ).toBe(null);

  expect(
    matchObject(
      { a: 'a', b: ['a', 'b'], c: 'a', d: ['a', 'b'], e: ['a', 'b'] },
      { a: 'b', b: ['b', 'c'], c: [], d: ['a', 'b'], e: ['a'] },
      { a: Disjoint, b: Intersect, c: Subset, d: Identity, e: Superset }
    )
  ).toBe('c');

  expect(
    matchObject(
      { a: 'a', b: ['a', 'b'], c: ['a', 'b'], d: ['a', 'b'], e: ['a', 'b'] },
      { a: 'b', b: ['b', 'c'], c: ['a'], d: ['a', 'b'], e: ['a'] },
      { a: Disjoint, b: Intersect, c: Subset, d: Identity, e: Superset }
    )
  ).toBe('c');
});

test('matchObject benchmark', () => {
  const n = 1000;
  let r1: any;

  const t1 = Date.now();
  for (let i = 0; i < n; i += 1) {
    r1 = matchObject(
      { a: 'a', b: ['a', 'b'], c: ['a', 'b'], d: ['a', 'b'], e: ['a', 'b'] },
      { a: 'b', b: ['b', 'c'], c: ['a'], d: ['a', 'b'], e: ['a'] },
      { a: Disjoint, b: Intersect, c: Subset, d: Identity, e: Superset }
    );
  }
  const t2 = Date.now();
  console.log('matchObject benchmark', t2 - t1, (t2 - t1) / n, r1);
});
