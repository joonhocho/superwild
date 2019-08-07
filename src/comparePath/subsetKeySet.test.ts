// tslint:disable no-console
import { subsetKeySet } from './subsetKeySet';

test('subsetKeySet', () => {
  expect(subsetKeySet({}, {})).toBe(false);
  expect(subsetKeySet({ a: 1 }, {})).toBe(false);
  expect(subsetKeySet({}, { a: 1 })).toBe(false);
  expect(subsetKeySet({ a: 1, b: 1 }, { c: 1 })).toBe(false);
  expect(subsetKeySet({ c: 1 }, { a: 1, b: 1 })).toBe(false);
  expect(subsetKeySet({ a: 1 }, { a: 1, b: 1 })).toBe(true);
  expect(subsetKeySet({ a: 1, b: 1 }, { a: 1, b: 1 })).toBe(true);
  expect(subsetKeySet({ a: 1, b: 1 }, { a: 1 })).toBe(false);
  expect(subsetKeySet({ a: 1 }, { a: 1 })).toBe(true);
  expect(subsetKeySet({ a: 1 }, { b: 1 })).toBe(false);
  expect(subsetKeySet({ a: 1, b: 1 }, { b: 1, c: 1 })).toBe(false);
});
