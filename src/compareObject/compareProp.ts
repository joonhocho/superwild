import {
  CompareResult,
  NotOrToNotOr,
  NotOrToOr,
  OrToNotOr,
} from '_src/compareCommon';
import { compareArray } from './compareArray';
import { compareValueToArray } from './compareValueToArray';
import { ObjectPropPattern, ObjectPropType } from './const';
import { MatchProp, NoMatchProp, parseProp } from './parseProp';

const { Disjoint, Subset, Identity, Superset } = CompareResult;
const { Value, Or, NotOr } = ObjectPropType;

export const compareProp = (
  prop1: ObjectPropPattern,
  prop2: ObjectPropPattern
): CompareResult => {
  const parsed1 = parseProp(prop1);
  if (parsed1 === NoMatchProp) {
    return Disjoint;
  }
  const parsed2 = parseProp(prop2);
  if (parsed2 === NoMatchProp) {
    return Disjoint;
  }

  if (parsed1 === parsed2) {
    return Identity;
  }

  if (parsed1 === MatchProp) {
    return Superset;
  }

  if (parsed2 === MatchProp) {
    return Subset;
  }

  switch (parsed1[0]) {
    case Value:
      switch (parsed2[0]) {
        case Value:
          return parsed1[1] === parsed2[1] ? Identity : Disjoint;
        case Or:
          return compareValueToArray(parsed1[1], parsed2[1]);
        case NotOr:
          return parsed2[1].indexOf(parsed1[1]) === -1 ? Subset : Disjoint;
      }
      break;
    case Or:
      switch (parsed2[0]) {
        case Value: {
          const res = compareValueToArray(parsed2[1], parsed1[1]);
          return res === Subset ? Superset : res;
        }
        case Or:
          return compareArray(parsed1[1], parsed2[1]);
        case NotOr:
          return OrToNotOr[compareArray(parsed1[1], parsed2[1])];
      }
      break;
    case NotOr:
      switch (parsed2[0]) {
        case Value:
          return parsed1[1].indexOf(parsed2[1]) === -1 ? Superset : Disjoint;
        case Or:
          return NotOrToOr[compareArray(parsed1[1], parsed2[1])];
        case NotOr:
          return NotOrToNotOr[compareArray(parsed1[1], parsed2[1])];
      }
      break;
  }

  return Disjoint;
};
