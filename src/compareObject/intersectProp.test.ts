import { CompareResult } from '_src/compareCommon';
import { MatchAny, MatchNone, ObjectPropPattern } from './const';
import { intersectProp } from './intersectProp';

const { Disjoint, Intersect, Subset, Identity, Superset } = CompareResult;

test('intersectProp', () => {
  const runCase = (
    prop1: ObjectPropPattern,
    prop2: ObjectPropPattern,
    expected: CompareResult
  ): any => expect(intersectProp(prop1, prop2)).toBe(expected !== Disjoint);

  runCase('', '', Identity);
  runCase('a', '', Disjoint);
  runCase('a', 'a', Identity);
  runCase('a', 'a', Identity);
  runCase(MatchAny, 'a', Superset);
  runCase(MatchAny, MatchAny, Identity);
  runCase('a', MatchAny, Subset);
  runCase(MatchNone, MatchAny, Disjoint);
  runCase(MatchAny, MatchNone, Disjoint);
  runCase(MatchNone, MatchNone, Disjoint);

  runCase(MatchAny, MatchNone, Disjoint);
  runCase(MatchAny, [], Disjoint);
  runCase(MatchAny, MatchAny, Identity);
  runCase(MatchAny, ['!', []], Identity);
  runCase(MatchAny, '', Superset);
  runCase(MatchAny, 'a', Superset);
  runCase(MatchAny, ['a'], Superset);
  runCase(MatchAny, ['a', 'b'], Superset);
  runCase(MatchAny, ['!', ['a']], Superset);
  runCase(MatchAny, ['!', ['a', 'b']], Superset);

  runCase(['!', []], MatchNone, Disjoint);
  runCase(['!', []], [], Disjoint);
  runCase(['!', []], MatchAny, Identity);
  runCase(['!', []], ['!', []], Identity);
  runCase(['!', []], '', Superset);
  runCase(['!', []], 'a', Superset);
  runCase(['!', []], ['a'], Superset);
  runCase(['!', []], ['a', 'b'], Superset);
  runCase(['!', []], ['!', ['a']], Superset);
  runCase(['!', []], ['!', ['a', 'b']], Superset);

  runCase(MatchNone, MatchNone, Disjoint);
  runCase(MatchNone, [], Disjoint);
  runCase(MatchNone, MatchAny, Disjoint);
  runCase(MatchNone, ['!', []], Disjoint);
  runCase(MatchNone, '', Disjoint);
  runCase(MatchNone, 'a', Disjoint);
  runCase(MatchNone, ['a'], Disjoint);
  runCase(MatchNone, ['a', 'b'], Disjoint);
  runCase(MatchNone, ['!', ['a']], Disjoint);
  runCase(MatchNone, ['!', ['a', 'b']], Disjoint);

  runCase([], MatchNone, Disjoint);
  runCase([], [], Disjoint);
  runCase([], MatchAny, Disjoint);
  runCase([], ['!', []], Disjoint);
  runCase([], '', Disjoint);
  runCase([], 'a', Disjoint);
  runCase([], ['a'], Disjoint);
  runCase([], ['a', 'b'], Disjoint);
  runCase([], ['!', ['a']], Disjoint);
  runCase([], ['!', ['a', 'b']], Disjoint);

  runCase('a', MatchNone, Disjoint);
  runCase('a', [], Disjoint);
  runCase('a', MatchAny, Subset);
  runCase('a', ['!', []], Subset);
  runCase('a', '', Disjoint);
  runCase('a', 'a', Identity);
  runCase('a', ['a'], Identity);
  runCase('a', ['a', 'a'], Identity);
  runCase('a', ['a', 'b'], Subset);
  runCase('a', ['!', ['a']], Disjoint);
  runCase('a', ['!', ['a', 'b']], Disjoint);
  runCase('a', ['!', ['c']], Subset);

  runCase(['a'], MatchNone, Disjoint);
  runCase(['a'], [], Disjoint);
  runCase(['a'], MatchAny, Subset);
  runCase(['a'], ['!', []], Subset);
  runCase(['a'], '', Disjoint);
  runCase(['a'], 'a', Identity);
  runCase(['a'], ['a'], Identity);
  runCase(['a'], ['a', 'a'], Identity);
  runCase(['a'], ['a', 'b'], Subset);
  runCase(['a'], ['!', ['a']], Disjoint);
  runCase(['a'], ['!', ['a', 'b']], Disjoint);
  runCase(['a'], ['!', ['c']], Subset);

  runCase(['a', 'a'], MatchNone, Disjoint);
  runCase(['a', 'a'], [], Disjoint);
  runCase(['a', 'a'], MatchAny, Subset);
  runCase(['a', 'a'], ['!', []], Subset);
  runCase(['a', 'a'], '', Disjoint);
  runCase(['a', 'a'], 'a', Identity);
  runCase(['a', 'a'], ['a'], Identity);
  runCase(['a', 'a'], ['a', 'a'], Identity);
  runCase(['a', 'a'], ['a', 'b'], Subset);
  runCase(['a', 'a'], ['b', 'a', 'c'], Subset);
  runCase(['a', 'a'], ['b', 'c'], Disjoint);
  runCase(['a', 'a'], ['c', 'd'], Disjoint);
  runCase(['a', 'a'], ['!', ['a']], Disjoint);
  runCase(['a', 'a'], ['!', ['a', 'b']], Disjoint);
  runCase(['a', 'a'], ['!', ['c']], Subset);

  runCase(['a', 'b'], MatchNone, Disjoint);
  runCase(['a', 'b'], [], Disjoint);
  runCase(['a', 'b'], MatchAny, Subset);
  runCase(['a', 'b'], ['!', []], Subset);
  runCase(['a', 'b'], '', Disjoint);
  runCase(['a', 'b'], 'a', Superset);
  runCase(['a', 'b'], ['a'], Superset);
  runCase(['a', 'b'], ['a', 'a'], Superset);
  runCase(['a', 'b'], ['b', 'a'], Identity);
  runCase(['a', 'b'], ['b', 'a', 'c'], Subset);
  runCase(['a', 'b'], ['b', 'c'], Intersect);
  runCase(['a', 'b'], ['c', 'd'], Disjoint);
  runCase(['a', 'b'], ['!', ['a']], Intersect);
  runCase(['a', 'b'], ['!', ['a', 'b']], Disjoint);
  runCase(['a', 'b'], ['!', ['c']], Subset);

  runCase(['!', ['a']], MatchNone, Disjoint);
  runCase(['!', ['a']], [], Disjoint);
  runCase(['!', ['a']], MatchAny, Subset);
  runCase(['!', ['a']], ['!', []], Subset);
  runCase(['!', ['a']], '', Superset);
  runCase(['!', ['a']], 'a', Disjoint);
  runCase(['!', ['a']], ['a'], Disjoint);
  runCase(['!', ['a']], ['a', 'a'], Disjoint);
  runCase(['!', ['a']], ['a', 'b'], Intersect);
  runCase(['!', ['a']], ['!', ['a']], Identity);
  runCase(['!', ['a']], ['!', ['a', 'b']], Superset);
  runCase(['!', ['a']], ['!', ['c']], Intersect);

  runCase(['!', ['a', 'a']], MatchNone, Disjoint);
  runCase(['!', ['a', 'a']], [], Disjoint);
  runCase(['!', ['a', 'a']], MatchAny, Subset);
  runCase(['!', ['a', 'a']], ['!', []], Subset);
  runCase(['!', ['a', 'a']], '', Superset);
  runCase(['!', ['a', 'a']], 'a', Disjoint);
  runCase(['!', ['a', 'a']], ['a'], Disjoint);
  runCase(['!', ['a', 'a']], ['a', 'a'], Disjoint);
  runCase(['!', ['a', 'a']], ['a', 'b'], Intersect);
  runCase(['!', ['a', 'a']], ['b', 'a', 'c'], Intersect);
  runCase(['!', ['a', 'a']], ['b', 'c'], Superset);
  runCase(['!', ['a', 'a']], ['c', 'd'], Superset);
  runCase(['!', ['a', 'a']], ['!', ['a']], Identity);
  runCase(['!', ['a', 'a']], ['!', ['a', 'b']], Superset);
  runCase(['!', ['a', 'a']], ['!', ['c']], Intersect);

  runCase(['!', ['a', 'b']], MatchNone, Disjoint);
  runCase(['!', ['a', 'b']], [], Disjoint);
  runCase(['!', ['a', 'b']], MatchAny, Subset);
  runCase(['!', ['a', 'b']], ['!', []], Subset);
  runCase(['!', ['a', 'b']], '', Superset);
  runCase(['!', ['a', 'b']], 'a', Disjoint);
  runCase(['!', ['a', 'b']], ['a'], Disjoint);
  runCase(['!', ['a', 'b']], ['a', 'a'], Disjoint);
  runCase(['!', ['a', 'b']], ['b', 'a'], Disjoint);
  runCase(['!', ['a', 'b']], ['b', 'a', 'c'], Intersect);
  runCase(['!', ['a', 'b']], ['b', 'c'], Intersect);
  runCase(['!', ['a', 'b']], ['c', 'd'], Superset);
  runCase(['!', ['a', 'b']], ['!', ['a']], Subset);
  runCase(['!', ['a', 'b']], ['!', ['a', 'b']], Identity);
  runCase(['!', ['a', 'b']], ['!', ['c']], Intersect);

  runCase([], [], Disjoint);
  runCase([''], [], Disjoint);
  runCase([''], [''], Identity);
  runCase([''], ['', ''], Identity);
  runCase([''], ['', 'a'], Subset);
  runCase(['', 'b'], ['', 'a'], Intersect);
  runCase(['', 'a'], ['', 'a'], Identity);
  runCase(['', 'a', 'b'], ['', 'a'], Superset);

  runCase(['a', 'b'], 'a', Superset);
  runCase(['a'], 'a', Identity);
  runCase('a', ['a'], Identity);
  runCase('a', ['a', 'b'], Subset);

  runCase('a', ['!', []], Subset);
  runCase('a', ['!', ['b']], Subset);
  runCase('a', ['!', ['a', 'b']], Disjoint);

  runCase(['a'], ['!', ['a', 'b']], Disjoint);
  runCase(['a', 'b'], ['!', ['a', 'b']], Disjoint);
  runCase(['a', 'b', 'c'], ['!', ['a', 'b']], Intersect);

  runCase(['!', ['a', 'b', 'c']], ['!', ['a', 'b']], Subset);
  runCase(['!', ['a', 'b', 'c']], ['!', []], Subset);
});
