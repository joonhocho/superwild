// tslint:disable no-console
import { CompareResult } from '_src/compareCommon';
import { SegmentType } from './const';
import { ParsedSegment } from './ParsedSegment';

const { Nil, Value, Wild, Or, NotOr } = SegmentType;

test('ParsedSegment', () => {
  expect(new ParsedSegment('')).toMatchObject({
    type: Value,
    pattern: '',
    length: [1, 1],
    fixedLength: true,
    enums: [''],
    enumMap: { '': 1 },
  });
  expect(new ParsedSegment('()')).toMatchObject({
    type: Nil,
    pattern: '()',
    length: [1, 1],
    fixedLength: true,
    enums: [],
    enumMap: {},
  });
  expect(new ParsedSegment('*')).toMatchObject({
    type: Wild,
    pattern: '*',
    length: [1, 1],
    fixedLength: true,
    enums: ['*'],
    enumMap: { '*': 1 },
  });
  expect(new ParsedSegment('!()')).toMatchObject({
    type: Wild,
    pattern: '*',
    length: [1, 1],
    fixedLength: true,
    enums: ['*'],
    enumMap: { '*': 1 },
  });
  expect(new ParsedSegment('*?')).toMatchObject({
    type: Wild,
    pattern: '*?',
    length: [0, 1],
    fixedLength: false,
    enums: ['*?'],
    enumMap: { '*?': 1 },
  });
  expect(new ParsedSegment('**')).toMatchObject({
    type: Wild,
    pattern: '**',
    length: [0, Infinity],
    fixedLength: false,
    enums: ['**'],
    enumMap: { '**': 1 },
  });
  expect(new ParsedSegment('(a|b)')).toMatchObject({
    type: Or,
    pattern: '(a|b)',
    length: [1, 1],
    fixedLength: true,
    enums: ['a', 'b'],
    enumMap: { a: 1, b: 1 },
  });
  expect(new ParsedSegment('!(a|b)')).toMatchObject({
    type: NotOr,
    pattern: '!(a|b)',
    length: [1, 1],
    fixedLength: true,
    enums: ['a', 'b'],
    enumMap: { a: 1, b: 1 },
  });
});

test('ParsedSegment compareLength', () => {
  const testCase = (a: string, b: string, expected: CompareResult): any =>
    expect(new ParsedSegment(a).compareLength(new ParsedSegment(b))).toBe(
      expected
    );

  testCase('*', '*', CompareResult.Identity);
  testCase('*', '*?', CompareResult.Subset);
  testCase('*', '**', CompareResult.Subset);

  testCase('*?', '*', CompareResult.Superset);
  testCase('*?', '*?', CompareResult.Identity);
  testCase('*?', '**', CompareResult.Subset);

  testCase('**', '*', CompareResult.Superset);
  testCase('**', '*?', CompareResult.Superset);
  testCase('**', '**', CompareResult.Identity);
});
