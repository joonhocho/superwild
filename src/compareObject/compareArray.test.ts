import { CompareResult } from '_src/compareCommon';
import { compareArray } from './compareArray';

const { Disjoint, Intersect, Subset, Identity, Superset } = CompareResult;

test('compareArray', () => {
  expect(compareArray([], [])).toBe(Disjoint);
  expect(compareArray([''], [])).toBe(Disjoint);
  expect(compareArray([''], [''])).toBe(Identity);
  expect(compareArray([''], ['', ''])).toBe(Identity);
  expect(compareArray([''], ['', 'a'])).toBe(Subset);
  expect(compareArray(['', 'b'], ['', 'a'])).toBe(Intersect);
  expect(compareArray(['', 'a'], ['', 'a'])).toBe(Identity);
  expect(compareArray(['', 'a', 'b'], ['', 'a'])).toBe(Superset);
});
