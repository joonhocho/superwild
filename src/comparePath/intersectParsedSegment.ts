import { SegmentType } from './const';
import { intersectKeySet } from './intersectKeySet';
import { ParsedSegment } from './ParsedSegment';
import { subsetKeySet } from './subsetKeySet';

const { Value, Wild, Nil, Or, NotOr } = SegmentType;

export const intersectParsedSegment = (
  a: ParsedSegment,
  b: ParsedSegment
): boolean => {
  if (a === b || a.pattern === b.pattern) {
    return a.type !== Nil;
  }

  switch (a.type) {
    case Value:
      switch (b.type) {
        case Value:
          return false;
        case Wild:
          return true;
        case Nil:
          return false;
        case Or:
          return b.enumMap[a.pattern] === 1;
        case NotOr:
          return b.enumMap[a.pattern] !== 1;
      }
      break;
    case Wild:
      return b.type !== Nil;
    case Nil:
      return false;
    case Or:
      switch (b.type) {
        case Value:
          return a.enumMap[b.pattern] === 1;
        case Wild:
          return true;
        case Nil:
          return false;
        case Or:
          return intersectKeySet(a.enumMap, b.enumMap, a.enums, b.enums);
        case NotOr:
          return !subsetKeySet(a.enumMap, b.enumMap, a.enums, b.enums);
      }
      break;
    case NotOr:
      switch (b.type) {
        case Value:
          return a.enumMap[b.pattern] !== 1;
        case Wild:
          return true;
        case Nil:
          return false;
        case Or:
          return !subsetKeySet(b.enumMap, a.enumMap, b.enums, a.enums);
        case NotOr:
          return true;
      }
      break;
  }
  return false;
};
