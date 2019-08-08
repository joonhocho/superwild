import { CompareResult } from '_src/compareCommon';
import { compareValueToArray } from './compareValueToArray';

const { Disjoint, Subset, Identity } = CompareResult;

test('compareValueToArray', () => {
  expect(compareValueToArray('a', [])).toBe(Disjoint);
  expect(compareValueToArray('a', [''])).toBe(Disjoint);
  expect(compareValueToArray('a', ['a'])).toBe(Identity);
  expect(compareValueToArray('a', ['a', 'a'])).toBe(Identity);
  expect(compareValueToArray('a', ['a', 'a'])).toBe(Identity);
  expect(compareValueToArray('a', ['a', 'b'])).toBe(Subset);
  expect(compareValueToArray('a', ['b'])).toBe(Disjoint);
  expect(compareValueToArray('a', ['b', 'c'])).toBe(Disjoint);
});
