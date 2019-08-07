// tslint:disable no-console
import { intersectKeySet } from './intersectKeySet';

test('intersectKeySet', () => {
  expect(intersectKeySet({}, {})).toBe(false);
  expect(intersectKeySet({ a: 1 }, {})).toBe(false);
  expect(intersectKeySet({}, { a: 1 })).toBe(false);
  expect(intersectKeySet({ a: 1, b: 1 }, { c: 1 })).toBe(false);
  expect(intersectKeySet({ c: 1 }, { a: 1, b: 1 })).toBe(false);
  expect(intersectKeySet({ a: 1 }, { a: 1, b: 1 })).toBe(true);
  expect(intersectKeySet({ a: 1, b: 1 }, { a: 1, b: 1 })).toBe(true);
  expect(intersectKeySet({ a: 1, b: 1 }, { a: 1 })).toBe(true);
  expect(intersectKeySet({ a: 1 }, { b: 1 })).toBe(false);
  expect(intersectKeySet({ a: 1 }, { a: 1 })).toBe(true);
  expect(intersectKeySet({ a: 1, b: 1 }, { b: 1, c: 1 })).toBe(true);
});
