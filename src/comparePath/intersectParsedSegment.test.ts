// tslint:disable no-console
import { CompareResult } from './const';
import { intersectParsedSegment } from './intersectParsedSegment';
import { ParsedSegment } from './ParsedSegment';

const { Disjoint, Intersect, Subset, Identity, Superset } = CompareResult;

test('intersectParsedSegment', () => {
  const testCase = (a: string, b: string, expected: CompareResult): any =>
    expect(
      intersectParsedSegment(new ParsedSegment(a), new ParsedSegment(b))
    ).toBe(expected !== Disjoint);

  testCase('', '', Identity);
  testCase('', 'a', Disjoint);
  testCase('', '()', Disjoint);
  testCase('', '(a)', Disjoint);
  testCase('', '(a|b)', Disjoint);
  testCase('', '(a|b|)', Subset);
  testCase('', '!()', Subset);
  testCase('', '!(a)', Subset);
  testCase('', '!(a|b)', Subset);
  testCase('', '!(a|b|)', Disjoint);
  testCase('', '*', Subset);
  testCase('', '*?', Subset);
  testCase('', '**', Subset);

  testCase('a', '', Disjoint);
  testCase('a', 'a', Identity);
  testCase('a', 'b', Disjoint);
  testCase('a', '()', Disjoint);
  testCase('a', '(a)', Identity);
  testCase('a', '(a|b)', Subset);
  testCase('a', '(a|b|)', Subset);
  testCase('a', '(b|c)', Disjoint);
  testCase('a', '!()', Subset);
  testCase('a', '!(a)', Disjoint);
  testCase('a', '!(a|b)', Disjoint);
  testCase('a', '!(a|b|)', Disjoint);
  testCase('a', '!(b|c)', Subset);
  testCase('a', '*', Subset);
  testCase('a', '*?', Subset);
  testCase('a', '**', Subset);

  testCase('(a)', '', Disjoint);
  testCase('(a)', 'a', Identity);
  testCase('(a)', 'b', Disjoint);
  testCase('(a)', '()', Disjoint);
  testCase('(a)', '(a)', Identity);
  testCase('(a)', '(a|b)', Subset);
  testCase('(a)', '(a|b|)', Subset);
  testCase('(a)', '(b|c)', Disjoint);
  testCase('(a)', '!()', Subset);
  testCase('(a)', '!(a)', Disjoint);
  testCase('(a)', '!(a|b)', Disjoint);
  testCase('(a)', '!(a|b|)', Disjoint);
  testCase('(a)', '!(b|c)', Subset);
  testCase('(a)', '*', Subset);
  testCase('(a)', '*?', Subset);
  testCase('(a)', '**', Subset);

  testCase('()', '', Disjoint);
  testCase('()', 'a', Disjoint);
  testCase('()', 'b', Disjoint);
  testCase('()', '()', Disjoint);
  testCase('()', '(a)', Disjoint);
  testCase('()', '(a|b)', Disjoint);
  testCase('()', '(a|b|)', Disjoint);
  testCase('()', '(b|c)', Disjoint);
  testCase('()', '!()', Disjoint);
  testCase('()', '!(a)', Disjoint);
  testCase('()', '!(a|b)', Disjoint);
  testCase('()', '!(a|b|)', Disjoint);
  testCase('()', '!(b|c)', Disjoint);
  testCase('()', '*', Disjoint);
  testCase('()', '*?', Disjoint);
  testCase('()', '**', Disjoint);

  testCase('(a|b)', '', Disjoint);
  testCase('(a|b)', 'a', Superset);
  testCase('(a|b)', 'b', Superset);
  testCase('(a|b)', '()', Disjoint);
  testCase('(a|b)', '(a)', Superset);
  testCase('(a|b)', '(a|b)', Identity);
  testCase('(a|b)', '(a|b|)', Subset);
  testCase('(a|b)', '(b|c)', Intersect);
  testCase('(a|b)', '!()', Subset);
  testCase('(a|b)', '!(a)', Intersect);
  testCase('(a|b)', '!(a|b)', Disjoint);
  testCase('(a|b)', '!(a|b|)', Disjoint);
  testCase('(a|b)', '!(b|c)', Intersect);
  testCase('(a|b)', '!(c|d)', Subset);
  testCase('(a|b)', '*', Subset);
  testCase('(a|b)', '*?', Subset);
  testCase('(a|b)', '**', Subset);

  testCase('!(a|b)', '', Superset);
  testCase('!(a|b)', 'a', Disjoint);
  testCase('!(a|b)', 'b', Disjoint);
  testCase('!(a|b)', '()', Disjoint);
  testCase('!(a|b)', '(a)', Disjoint);
  testCase('!(a|b)', '(a|b)', Disjoint);
  testCase('!(a|b)', '(a|b|)', Intersect);
  testCase('!(a|b)', '(b|c)', Intersect);
  testCase('!(a|b)', '!()', Subset);
  testCase('!(a|b)', '!(a)', Subset);
  testCase('!(a|b)', '!(a|b)', Identity);
  testCase('!(a|b)', '!(a|b|)', Superset);
  testCase('!(a|b)', '!(b|c)', Intersect);
  testCase('!(a|b)', '!(c|d)', Intersect);
  testCase('!(a|b)', '*', Subset);
  testCase('!(a|b)', '*?', Subset);
  testCase('!(a|b)', '**', Subset);

  testCase('*', '', Superset);
  testCase('*', 'a', Superset);
  testCase('*', '()', Disjoint);
  testCase('*', '(a)', Superset);
  testCase('*', '(a|b)', Superset);
  testCase('*', '!()', Identity);
  testCase('*', '!(a)', Superset);
  testCase('*', '!(a|b)', Superset);
  testCase('*', '*', Identity);
  testCase('*', '*?', Subset);
  testCase('*', '**', Subset);

  testCase('*?', '', Superset);
  testCase('*?', 'a', Superset);
  testCase('*?', '()', Disjoint);
  testCase('*?', '(a)', Superset);
  testCase('*?', '(a|b)', Superset);
  testCase('*?', '!()', Superset);
  testCase('*?', '!(a)', Superset);
  testCase('*?', '!(a|b)', Superset);
  testCase('*?', '*', Superset);
  testCase('*?', '*?', Identity);
  testCase('*?', '**', Subset);

  testCase('**', '', Superset);
  testCase('**', 'a', Superset);
  testCase('**', '()', Disjoint);
  testCase('**', '(a)', Superset);
  testCase('**', '(a|b)', Superset);
  testCase('**', '!()', Superset);
  testCase('**', '!(a)', Superset);
  testCase('**', '!(a|b)', Superset);
  testCase('**', '*', Superset);
  testCase('**', '*?', Superset);
  testCase('**', '**', Identity);
});
