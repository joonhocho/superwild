import {
  CompareResult,
  NotOrToNotOr,
  NotOrToOr,
  OrToNotOr,
} from '_src/compareCommon';
import { compareKeySet } from './compareKeySet';
import { SegmentType } from './const';
import { ParsedSegment } from './ParsedSegment';

const { Disjoint, Subset, Identity, Superset } = CompareResult;

const { Value, Wild, Nil, Or, NotOr } = SegmentType;

export const compareParsedSegment = (
  a: ParsedSegment,
  b: ParsedSegment
): CompareResult => {
  if (a === b || a.pattern === b.pattern) {
    return a.type === Nil ? Disjoint : Identity;
  }

  switch (a.type) {
    case Value:
      switch (b.type) {
        case Value:
          return Disjoint;
        case Wild:
          return Subset;
        case Nil:
          return Disjoint;
        case Or:
          // could be identity
          return compareKeySet(a.enumMap, b.enumMap, a.enums, b.enums);
        case NotOr:
          // tslint:disable-next-line ter-computed-property-spacing
          return OrToNotOr[
            compareKeySet(a.enumMap, b.enumMap, a.enums, b.enums)
];
      }
      break;
    case Wild:
      switch (b.type) {
        case Value:
          return Superset;
        case Wild:
          return a.compareLength(b);
        case Nil:
          return Disjoint;
        case Or:
          return Superset;
        case NotOr:
          return Superset;
      }
      break;
    case Nil:
      return Disjoint;
    case Or:
      switch (b.type) {
        case Value:
          return compareKeySet(a.enumMap, b.enumMap, a.enums, b.enums);
        case Wild:
          return Subset;
        case Nil:
          return Disjoint;
        case Or:
          return compareKeySet(a.enumMap, b.enumMap, a.enums, b.enums);
        case NotOr:
          // tslint:disable-next-line ter-computed-property-spacing
          return OrToNotOr[
            compareKeySet(a.enumMap, b.enumMap, a.enums, b.enums)
];
      }
      break;
    case NotOr:
      switch (b.type) {
        case Value:
          // tslint:disable-next-line ter-computed-property-spacing
          return NotOrToOr[
            compareKeySet(a.enumMap, b.enumMap, a.enums, b.enums)
];
        case Wild:
          return Subset;
        case Nil:
          return Disjoint;
        case Or:
          // tslint:disable-next-line ter-computed-property-spacing
          return NotOrToOr[
            compareKeySet(a.enumMap, b.enumMap, a.enums, b.enums)
];
        case NotOr:
          // tslint:disable-next-line ter-computed-property-spacing
          return NotOrToNotOr[
            compareKeySet(a.enumMap, b.enumMap, a.enums, b.enums)
];
      }
      break;
  }
  return Disjoint;
};
