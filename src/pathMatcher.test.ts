// tslint:disable no-console
import {
  getWildcardStringPathMatcher,
  WildcardPathMatcher,
} from './pathMatcher';

test('WildcardPathMatcher', () => {
  const matcher = new WildcardPathMatcher(['a', '**', 'b', '*', 'c']);
  expect(matcher.match(['a', 'b', 'xx', 'c'])).toBe(true);
  expect(matcher.match(['a', 'b', 'c'])).toBe(false);
  expect(matcher.match(['a', 'xx', 'b', 'xx', 'c'])).toBe(true);
  expect(matcher.match(['a', 'xx', 'xx', 'b', 'c', 'c'])).toBe(true);
  expect(matcher.match(['a', 'xx', 'xx', 'b', 'xx', 'c'])).toBe(true);
  expect(matcher.match(['xx', 'xx', 'b', 'xx', 'c'])).toBe(false);
  expect(matcher.match(['a', 'xx', 'c'])).toBe(false);
  expect(matcher.match(['a', 'b', 'c'])).toBe(false);
  expect(matcher.match(['a', 'b', 'xx', 'c'])).toBe(true);
  expect(matcher.match(['a', 'b', 'xx', 'xx', 'c'])).toBe(false);
  expect(matcher.match(['a', 'b', 'xx', 'c', 'd'])).toBe(false);
  expect(matcher.match(['a', 'b', 'c', 'c'])).toBe(true);
  expect(matcher.match(['a', 'b', 'b', 'c'])).toBe(true);
  expect(matcher.match(['a', 'b', 'b', 'b', 'b', 'c'])).toBe(true);
});

test('getWildcardStringPathMatcher.match', () => {
  const run = (pattern: string, match: string, result: boolean): any =>
    expect(getWildcardStringPathMatcher(pattern)(match)).toBe(result);

  run('/a/b/c', '/a/b/c', true);
  run('/a/b/c', '/a/b/c/', false);
  run('/a/b/c/*', '/a/b/c/', true);
  run('/a/b/c', 'a/b/c', false);
  run('*/a/b/c', '/a/b/c', true);

  run('/a/*?/b/c', '/a/b/c', true);
  run('/a/*?/b/c', '/a/x/b/c', true);
  run('/a/*?/b/c', '/a/x/xx/b/c', false);

  run('/a/**/b/c', '/a/b/c', true);
  run('/a/**/b/c', '/a/x/b/c', true);
  run('/a/**/b/c', '/a/x/xx/b/c', true);

  run('/a/*+/b/c', '/a/b/c', false);
  run('/a/*+/b/c', '/a/xx/b/c', true);
  run('/a/*+/b/c', '/a/xx/xx/xx/b/c', true);

  run('**/a/b/c', '/a/b/c', true);
  run('**/a/b/c', 'a/b/c', true);
  run('**/a/b/c', 'a/b/c/', false);

  run('/a/b/c/**', '/a/b/c/', true);
  run('/a/b/c/**', '/a/b/c', true);
  run('/a/b/c/**', 'a/b/c', false);

  run('/a/a/*/a/a', '/a/a/a/a', false);
  run('/a/a/*/a/a', '/a/a/a/a/a', true);
  run('/a/a/*/a/a', '/a/a/a/a/a/a', false);

  run('/a/a/**/a/a', '/a/a/a', false);
  run('/a/a/**/a/a', '/a/a/a/a', true);
  run('/a/a/**/a/a', '/a/a/a/a/a', true);
  run('/a/a/**/a/a', '/a/a/a/a/a/a', true);

  run('/a/a/*?/a/a', '/a/a/a', false);
  run('/a/a/*?/a/a', '/a/a/a/a', true);
  run('/a/a/*?/a/a', '/a/a/a/a/a', true);
  run('/a/a/*?/a/a', '/a/a/a/a/a/a', false);

  run('/a/a/*+/a/a', '/a/a/a', false);
  run('/a/a/*+/a/a', '/a/a/a/a', false);
  run('/a/a/*+/a/a', '/a/a/a/a/a', true);
  run('/a/a/*+/a/a', '/a/a/a/a/a/a', true);

  run('/a/*/c', '/a/c', false);
  run('/a/*/c', '/a/b/c', true);
  run('/a/*/c', '/a/*/c', true);
  run('/a/*/c', '/a/**/c', false);
  run('/a/*/c', '/a/*?/c', false);
  run('/a/*/c', '/a/*+/c', false);

  run('/a/*?/c', '/a/c', true);
  run('/a/*?/c', '/a/b/c', true);
  run('/a/*?/c', '/a/*/c', true);
  run('/a/*?/c', '/a/**/c', false);
  run('/a/*?/c', '/a/*?/c', true);
  run('/a/*?/c', '/a/*+/c', false);

  run('/a/*+/c', '/a/c', false);
  run('/a/*+/c', '/a/b/c', true);
  run('/a/*+/c', '/a/*/c', true);
  run('/a/*+/c', '/a/**/c', false);
  run('/a/*+/c', '/a/*?/c', false);
  run('/a/*+/c', '/a/*+/c', true);

  run('/a/**/c', '/a/c', true);
  run('/a/**/c', '/a/b/c', true);
  run('/a/**/c', '/a/*/c', true);
  run('/a/**/c', '/a/**/c', true);
  run('/a/**/c', '/a/*?/c', true);
  run('/a/**/c', '/a/*+/c', true);

  expect(() => getWildcardStringPathMatcher('/a/**/a/**/a')).toThrowError(
    'once'
  );
});

test.skip('getWildcardStringPathMatcher benchmark', () => {
  const compiled = getWildcardStringPathMatcher('/foo/*/bar/**/baz');
  const n = 1000000;
  let r1 = false;

  const t1 = Date.now();
  for (let i = 0; i < n; i += 1) {
    r1 = compiled('/foo/123/bar/234/345/baz');
  }
  const t2 = Date.now();
  console.log(t2 - t1, (t2 - t1) / n, r1);
});
