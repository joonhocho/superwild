// tslint:disable no-console
import {
  getWildcardStringPathMatcher,
  WildcardPathMatcher,
} from './pathMatcher';

test('WildcardPathMatcher', () => {
  const matcher = new WildcardPathMatcher([
    'a',
    '**',
    '(b|d)',
    '*',
    '!(e|f)',
    'c',
  ]);

  expect(matcher.match(['a', 'b', 'xx', 'g', 'c'])).toBe(true);
  expect(matcher.match(['a', 'd', 'xy', 'g', 'c'])).toBe(true);
  expect(matcher.match(['a', 'd', 'xz', 'h', 'c'])).toBe(true);

  // (b|d)
  expect(matcher.match(['a', 'e', 'xx', 'g', 'c'])).toBe(false);

  // !(e|f)
  expect(matcher.match(['a', 'd', 'xx', 'e', 'c'])).toBe(false);

  // *
  expect(matcher.match(['a', 'b', 'g', 'c'])).toBe(false);

  expect(matcher.match(['a', 'xx', 'b', 'xx', 'g', 'c'])).toBe(true);

  expect(matcher.match(['a', 'xx', 'xx', 'b', 'c', 'g', 'c'])).toBe(true);

  expect(matcher.match(['a', 'xx', 'xx', 'b', 'xx', 'g', 'c'])).toBe(true);

  // a
  expect(matcher.match(['xx', 'xx', 'b', 'xx', 'g', 'c'])).toBe(false);

  expect(matcher.match(['a', 'xx', 'g', 'c'])).toBe(false);
  expect(matcher.match(['a', 'b', 'g', 'c'])).toBe(false);
  expect(matcher.match(['a', 'b', 'xx', 'g', 'c'])).toBe(true);
  expect(matcher.match(['a', 'b', 'xx', 'xx', 'g', 'c'])).toBe(false);
  expect(matcher.match(['a', 'b', 'xx', 'c', 'g', 'd'])).toBe(false);
  expect(matcher.match(['a', 'b', 'c', 'g', 'c'])).toBe(true);
  expect(matcher.match(['a', 'b', 'b', 'g', 'c'])).toBe(true);
  expect(matcher.match(['a', 'b', 'b', 'b', 'b', 'g', 'c'])).toBe(true);
});

test('getWildcardStringPathMatcher.match', () => {
  const run = (pattern: string, match: string, result: boolean): any =>
    expect(getWildcardStringPathMatcher(pattern)(match)).toBe(result);

  run('/a/b/c', '/a/b/c', true);
  run('/a/b/c', '/a/b/c/', false);
  run('/a/b/c/*', '/a/b/c/', true);
  run('/a/b/c', 'a/b/c', false);
  run('*/a/b/c', '/a/b/c', true);

  run('/a/(b|d)/c', '/a/b/c', true);
  run('/a/(b|d)/c', '/a/d/c', true);
  run('/a/(b|d)/c', '/a/e/c', false);

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
  const compiled = getWildcardStringPathMatcher('/foo/*/(bar|dar)/**/baz');
  const n = 1000000;
  let r1 = false;

  const t1 = Date.now();
  for (let i = 0; i < n; i += 1) {
    r1 = compiled('/foo/123/bar/234/345/baz');
  }
  const t2 = Date.now();
  console.log(t2 - t1, (t2 - t1) / n, r1);
});
