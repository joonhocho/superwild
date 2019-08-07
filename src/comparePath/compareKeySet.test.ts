// tslint:disable no-console
import { compareKeySet } from './compareKeySet';
import { CompareResult } from './const';

test('compareKeySet', () => {
  expect(compareKeySet({}, {})).toBe(CompareResult.Disjoint);
  expect(compareKeySet({ a: 1 }, {})).toBe(CompareResult.Disjoint);
  expect(compareKeySet({}, { a: 1 })).toBe(CompareResult.Disjoint);
  expect(compareKeySet({ a: 1, b: 1 }, { c: 1 })).toBe(CompareResult.Disjoint);
  expect(compareKeySet({ c: 1 }, { a: 1, b: 1 })).toBe(CompareResult.Disjoint);
  expect(compareKeySet({ a: 1 }, { a: 1, b: 1 })).toBe(CompareResult.Subset);
  expect(compareKeySet({ a: 1, b: 1 }, { a: 1, b: 1 })).toBe(
    CompareResult.Identity
  );
  expect(compareKeySet({ a: 1, b: 1 }, { a: 1 })).toBe(CompareResult.Superset);
  expect(compareKeySet({ a: 1 }, { b: 1 })).toBe(CompareResult.Disjoint);
  expect(compareKeySet({ a: 1 }, { a: 1 })).toBe(CompareResult.Identity);
  expect(compareKeySet({ a: 1, b: 1 }, { b: 1, c: 1 })).toBe(
    CompareResult.Intersect
  );
});

test('benchmark keys', () => {
  const n = 1000;

  const ok: { [key: string]: any } = {};
  // const o0: { [key: string]: any } = {};

  const klen = 100;
  for (let i = 0; i < klen; i += 1) {
    ok[i] = true;
  }

  const t1 = Date.now();
  let r: any;
  const a: any = 1;
  const b: any = 1;
  for (let i = 0; i < n; i += 1) {
    // Object.keys(ok);
    r = a === b;
  }
  const t2 = Date.now();
  console.log('100 keys', t2 - t1, (t2 - t1) / n, r);

  const t3 = Date.now();
  for (let i = 0; i < n; i += 1) {
    // Object.keys(o0);
  }
  const t4 = Date.now();
  console.log('0 keys', t4 - t3, (t4 - t3) / n);
});
