// tslint:disable no-console
import { compareRange } from './compareRange';
import { CompareResult } from './const';

test('compareRange', () => {
  expect(compareRange(0, 1, 0, 1)).toBe(CompareResult.Identity);
  expect(compareRange(1, 1, 1, 1)).toBe(CompareResult.Identity);
  expect(compareRange(1, Infinity, 1, Infinity)).toBe(CompareResult.Identity);
  expect(compareRange(0, Infinity, 1, Infinity)).toBe(CompareResult.Superset);
  expect(compareRange(1, Infinity, 0, Infinity)).toBe(CompareResult.Subset);
  expect(compareRange(0, 1, 2, 3)).toBe(CompareResult.Disjoint);
  expect(compareRange(0, 1, 1, 2)).toBe(CompareResult.Intersect);
  expect(compareRange(0, 3, 2, 4)).toBe(CompareResult.Intersect);
});
