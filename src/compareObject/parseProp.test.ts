import { MatchAny, MatchNone, ObjectPropType } from './const';
import { MatchProp, NoMatchProp, parseProp } from './parseProp';

const { Value, Or, NotOr } = ObjectPropType;

test('parseProp', () => {
  expect(parseProp(MatchAny)).toBe(MatchProp);
  expect(parseProp(MatchNone)).toBe(NoMatchProp);
  expect(parseProp('')).toEqual([Value, '']);
  expect(parseProp('a')).toEqual([Value, 'a']);
  expect(parseProp([])).toEqual(NoMatchProp);
  expect(parseProp(['a'])).toEqual([Value, 'a']);
  expect(parseProp(['a', 'b'])).toEqual([Or, ['a', 'b']]);
  expect(parseProp(['!', []])).toEqual(MatchProp);
  expect(parseProp(['!', ['a']])).toEqual([NotOr, ['a']]);
  expect(parseProp(['!', ['a', 'b']])).toEqual([NotOr, ['a', 'b']]);
});
