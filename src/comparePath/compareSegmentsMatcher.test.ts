// tslint:disable no-console
import { compareSegmentsMatcher } from './compareSegmentsMatcher';
import { CompareResult } from './const';
import { SegmentsMatcher } from './SegmentsMatcher';

const { Disjoint, Intersect, Subset, Identity, Superset } = CompareResult;

test('compareSegmentsMatcher simple', () => {
  const comparePath = (a: string, b: string, expected: CompareResult): any =>
    expect(
      compareSegmentsMatcher(new SegmentsMatcher(a), new SegmentsMatcher(b))
    ).toBe(expected);

  // value
  comparePath('', '', Identity);
  comparePath('', 'a', Disjoint);
  comparePath('a', 'a', Identity);
  comparePath('/', '', Disjoint);
  comparePath('', '/', Disjoint);
  comparePath('a/', '/', Disjoint);
  comparePath('/a', '/', Disjoint);

  // or
  comparePath('()', '', Disjoint);
  comparePath('', '()', Disjoint);

  comparePath('()', '()', Disjoint);
  comparePath('()', 'a', Disjoint);
  comparePath('a', '()', Disjoint);

  comparePath('()', '*', Disjoint);
  comparePath('*', '()', Disjoint);

  comparePath('()', '!()', Disjoint);
  comparePath('!()', '()', Disjoint);

  comparePath('!()', '(a)', Superset);
  comparePath('(a)', '!()', Subset);

  comparePath('(a)', '()', Disjoint);
  comparePath('()', '(a)', Disjoint);

  comparePath('(a)', 'a', Identity);
  comparePath('a', '(a)', Identity);

  comparePath('*', '!()', Identity);
  comparePath('!()', '*', Identity);
  comparePath('!()', '!()', Identity);

  comparePath('(a|b)', 'a', Superset);
  comparePath('(a|b)', '(a)', Superset);
  comparePath('(a|b)', '(a|b)', Identity);
  comparePath('(a|b)', '(b|a)', Identity);

  comparePath('(a|b)', '(b|c)', Intersect);
  comparePath('(a|b)', '(a|b|c)', Subset);

  // not or
  comparePath('!(a|b)', '(a|b|c)', Intersect);
  comparePath('!(a|b)', 'c', Superset);
  comparePath('!(a|b)', '!(c)', Intersect);
  comparePath('!(a|b|c)', '!(c)', Subset);
  comparePath('!(b|c)', '!(c|b)', Identity);
  comparePath('!(c|b)', '!(c|b)', Identity);
  comparePath('!(c|b)', '(c|b)', Disjoint);

  // *
  comparePath('*', '(c|b)', Superset);
  comparePath('*', '*', Identity);
  comparePath('*', '!(a)', Superset);
  comparePath('*', 'a', Superset);

  comparePath('(c|b)', '*', Subset);
  comparePath('*', '*', Identity);
  comparePath('!(a)', '*', Subset);
  comparePath('a', '*', Subset);

  // *?
  comparePath('*?', 'a', Superset);
  comparePath('*?', '(a|b)', Superset);
  comparePath('*?', '!(a|b)', Superset);
  comparePath('*?', '*', Superset);
  comparePath('*?', '*?', Identity);
  comparePath('*?', '**', Subset);

  comparePath('a', '*?', Subset);
  comparePath('(a|b)', '*?', Subset);
  comparePath('!(a|b)', '*?', Subset);
  comparePath('*', '*?', Subset);
  comparePath('*?', '*?', Identity);
  comparePath('**', '*?', Superset);

  // **
  comparePath('**', 'a', Superset);
  comparePath('**', '(a|b)', Superset);
  comparePath('**', '!(a|b)', Superset);
  comparePath('**', '*', Superset);
  comparePath('**', '*?', Superset);
  comparePath('**', '**', Identity);

  comparePath('a', '**', Subset);
  comparePath('(a|b)', '**', Subset);
  comparePath('!(a|b)', '**', Subset);
  comparePath('*', '**', Subset);
  comparePath('*?', '**', Subset);
  comparePath('**', '**', Identity);

  // path
  comparePath('a/b', 'a/b', Identity);
  comparePath('a/b/c', 'a/b', Disjoint);
  comparePath('a/b/c', 'a/b/*', Subset);
  comparePath('a/b/c', 'a/b/**', Subset);
  comparePath('a/b/c', 'a/b/**', Subset);

  comparePath('(a|b)/b/c', '(b|c)/b/c', Intersect);
  comparePath('(a|b)/b/c', '(b|a)/b/c', Identity);
  comparePath('(a|b)/*/c', '(b|a)/b/c', Superset);
  comparePath('(a|b)/*/c', '(b|a)/b/*', Intersect);
  comparePath('(a|b)/*?/c', '(b|a)/b/*', Intersect);
  comparePath('(a|b)/*?/c', '(b|a)/b/c', Superset);
  comparePath('(a|b)/*?/c', '(b|a)/*/c', Superset);
  comparePath('(a|b)/*/c', '(b|a)/*?/c', Subset);
  comparePath('(a|b)/**/c', '(b|a)/*?/c', Superset);
  comparePath('(a|b)/**/c', '(b|a)/*/c', Superset);
  comparePath('(a|b)/**/c', '(b|a)/*/*/c', Superset);
  comparePath('(a|b)/*/*/c', '(b|a)/**/c', Subset);
  comparePath('(a|b)/*/a/(b)/*/c', '(b|a)/**/c', Subset);
  comparePath('(a|b)/!(a)/c', '(b|a)/*/c', Subset);
  comparePath('(a|b)/!(a)/c', '(b|a)/a/c', Disjoint);
  comparePath('(a|b)/!(a)/c', '(b|a)/b/c', Superset);

  comparePath('(a|b)/*?/c', '(b|a)/c', Superset);
  comparePath('(a|b)/*?/c', '(b|a)/d', Disjoint);

  comparePath('a/(b|c)/c', 'a/b/**', Intersect);
  comparePath('a/*/c', 'a/b/**', Intersect);

  // a/b
  comparePath('a/*?', '*?/b', Intersect);

  // a/b/c
  comparePath('a/**/c', 'a/b/*?', Intersect);

  // a/b/c
  comparePath('a/*?/c', 'a/b/*?', Intersect);

  // a/b/c
  comparePath('a/*?/c', 'a/b/**', Intersect);

  // a/b/c
  comparePath('a/**/c', 'a/b/**', Intersect);

  // a/b/c/d/e/f
  comparePath('a/b/c/**', '**/d/e/f', Intersect);

  // a/b/*/c/b/c
  comparePath('a/**/b/c', 'a/b/*/c/**/c', Intersect);

  // a/b/*/c/b/c
  comparePath('a/**/b/c', 'a/b/*/c/**', Intersect);

  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/b/xx/g/c', Superset);
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/d/xy/g/c', Superset);
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/d/xz/h/c', Superset);

  // (b|d)
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/e/xx/g/c', Disjoint);

  // !(e|f)
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/d/xx/e/c', Disjoint);

  // *
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/b/g/c', Disjoint);

  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/xx/b/xx/g/c', Superset);

  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/xx/xx/b/c/g/c', Superset);

  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/xx/xx/b/xx/g/c', Superset);

  // a
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'xx/xx/b/xx/g/c', Disjoint);

  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/xx/g/c', Disjoint);
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/b/g/c', Disjoint);
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/b/xx/g/c', Superset);
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/b/xx/xx/g/c', Disjoint);
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/b/xx/c/g/d', Disjoint);
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/b/c/g/c', Superset);
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/b/b/g/c', Superset);
  comparePath('a/**/(b|d)/*/!(e|f)/c', 'a/b/b/b/b/g/c', Superset);

  comparePath('/a/b/c', '/a/b/c', Identity);
  comparePath('/a/b/c', '/a/b/c/', Disjoint);
  comparePath('/a/b/c/*', '/a/b/c/', Superset);
  comparePath('/a/b/c', 'a/b/c', Disjoint);
  comparePath('*/a/b/c', '/a/b/c', Superset);

  comparePath('/a/(b)/c', '/a/b/c', Identity);
  comparePath('/a/(b)/c', '/a/c/c', Disjoint);

  comparePath('/a/(b|d)/c', '/a/b/c', Superset);
  comparePath('/a/(b|d)/c', '/a/d/c', Superset);
  comparePath('/a/(b|d)/c', '/a/e/c', Disjoint);
  comparePath('/a/(b|d)/c', '/a/e/c', Disjoint);
  comparePath('/a/(b|d)/c', '/a/(b)/c', Superset);
  comparePath('/a/(b|d)/c', '/a/(b|d)/c', Identity);
  comparePath('/a/(b|d)/c', '/a/(d|b)/c', Identity);
  comparePath('/a/(b|d)/c', '/a/(b|d|e)/c', Subset);

  comparePath('/a/!(b)/c', '/a/b/c', Disjoint);
  comparePath('/a/!(b)/c', '/a/c/c', Superset);
  comparePath('/a/!(b|d)/c', '/a/c/c', Superset);
  comparePath('/a/!(b|d)/c', '/a/d/c', Disjoint);
  comparePath('/a/!(b|d)/c', '/a/!(d)/c', Subset);
  comparePath('/a/!(b|d)/c', '/a/!(b|d)/c', Identity);
  comparePath('/a/!(b|d)/c', '/a/!(d|b)/c', Identity);
  comparePath('/a/!(b|d)/c', '/a/!(d|b|e)/c', Superset);

  comparePath('/a/(b|d|e)/c', '/a/(d|e)/c', Superset);
  comparePath('/a/(b|d|e)/c', '/a/(e|f)/c', Intersect);
  comparePath('/a/(b|d|e)/c', '/a/(e)/c', Superset);
  comparePath('/a/(b|d|e)/c', '/a/e/c', Superset);

  comparePath('/a/!(b|d|e)/c', '/a/(a|c)/c', Superset);
  comparePath('/a/!(b|d|e)/c', '/a/(a|b)/c', Intersect);
  comparePath('/a/!(b|d|e)/c', '/a/a/c', Superset);
  comparePath('/a/!(b|d|e)/c', '/a/b/c', Disjoint);

  comparePath('/a/*?/b/c', '/a/b/c', Superset);
  comparePath('/a/*?/b/c', '/a/x/b/c', Superset);
  comparePath('/a/*?/b/c', '/a/x/xx/b/c', Disjoint);

  comparePath('/a/**/b/c', '/a/b/c', Superset);
  comparePath('/a/**/b/c', '/a/x/b/c', Superset);
  comparePath('/a/**/b/c', '/a/x/xx/b/c', Superset);

  comparePath('**/a/b/c', '/a/b/c', Superset);
  comparePath('**/a/b/c', 'a/b/c', Superset);
  comparePath('**/a/b/c', 'a/b/c/', Disjoint);

  comparePath('/a/b/c/**', '/a/b/c/', Superset);
  comparePath('/a/b/c/**', '/a/b/c', Superset);
  comparePath('/a/b/c/**', 'a/b/c', Disjoint);

  comparePath('/a/a/*/a/a', '/a/a/a/a', Disjoint);
  comparePath('/a/a/*/a/a', '/a/a/a/a/a', Superset);
  comparePath('/a/a/*/a/a', '/a/a/a/a/a/a', Disjoint);

  comparePath('/a/a/**/a/a', '/a/a/a', Disjoint);
  comparePath('/a/a/**/a/a', '/a/a/a/a', Superset);
  comparePath('/a/a/**/a/a', '/a/a/a/a/a', Superset);
  comparePath('/a/a/**/a/a', '/a/a/a/a/a/a', Superset);

  comparePath('/a/a/*?/a/a', '/a/a/a', Disjoint);
  comparePath('/a/a/*?/a/a', '/a/a/a/a', Superset);
  comparePath('/a/a/*?/a/a', '/a/a/a/a/a', Superset);
  comparePath('/a/a/*?/a/a', '/a/a/a/a/a/a', Disjoint);

  comparePath('/a/*/c', '/a/c', Disjoint);
  comparePath('/a/*/c', '/a/b/c', Superset);
  comparePath('/a/*/c', '/a/*/c', Identity);
  comparePath('/a/*/c', '/a/**/c', Subset);
  comparePath('/a/*/c', '/a/*?/c', Subset);

  comparePath('/a/*?/c', '/a/c', Superset);
  comparePath('/a/*?/c', '/a/b/c', Superset);
  comparePath('/a/*?/c', '/a/*/c', Superset);
  comparePath('/a/*?/c', '/a/**/c', Subset);
  comparePath('/a/*?/c', '/a/*?/c', Identity);

  comparePath('/a/**/c', '/a/c', Superset);
  comparePath('/a/**/c', '/a/b/c', Superset);
  comparePath('/a/**/c', '/a/*/c', Superset);
  comparePath('/a/**/c', '/a/**/c', Identity);
  comparePath('/a/**/c', '/a/*?/c', Superset);
});

test('compareSegmentsMatcher benchmark', () => {
  const n = 100000;
  let r1: any;

  const t1 = Date.now();
  for (let i = 0; i < n; i += 1) {
    r1 = compareSegmentsMatcher(
      new SegmentsMatcher('/foo/*/(bar|dar)/**/baz'),
      new SegmentsMatcher('/foo/123/bar/234/345/baz')
    );
  }
  const t2 = Date.now();
  console.log(t2 - t1, (t2 - t1) / n, r1);

  const matcher1 = new SegmentsMatcher('/foo/*/(bar|dar)/**/baz');
  const matcher2 = new SegmentsMatcher('/foo/123/bar/234/345/baz');
  const t3 = Date.now();
  for (let i = 0; i < n; i += 1) {
    r1 = compareSegmentsMatcher(matcher1, matcher2);
  }
  const t4 = Date.now();
  console.log(t4 - t3, (t4 - t3) / n, r1);
});
