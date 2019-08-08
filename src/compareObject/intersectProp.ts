import { ObjectPropPattern, ObjectPropType } from './const';
import { intersectArray } from './intersectArray';
import { MatchProp, NoMatchProp, parseProp } from './parseProp';
import { subsetArray } from './subsetArray';

const { Value, Or, NotOr } = ObjectPropType;

export const intersectProp = (
  prop1: ObjectPropPattern,
  prop2: ObjectPropPattern
): boolean => {
  const parsed1 = parseProp(prop1);
  if (parsed1 === NoMatchProp) {
    return false;
  }

  const parsed2 = parseProp(prop2);
  if (parsed2 === NoMatchProp) {
    return false;
  }

  if (parsed1 === parsed2 || parsed1 === MatchProp || parsed2 === MatchProp) {
    return true;
  }

  switch (parsed1[0]) {
    case Value:
      switch (parsed2[0]) {
        case Value:
          return parsed1[1] === parsed2[1];
        case Or:
          return parsed2[1].indexOf(parsed1[1]) !== -1;
        case NotOr:
          return parsed2[1].indexOf(parsed1[1]) === -1;
      }
      break;
    case Or:
      switch (parsed2[0]) {
        case Value:
          return parsed1[1].indexOf(parsed2[1]) !== -1;
        case Or:
          return intersectArray(parsed1[1], parsed2[1]);
        case NotOr:
          return !subsetArray(parsed1[1], parsed2[1]);
      }
      break;
    case NotOr:
      switch (parsed2[0]) {
        case Value:
          return parsed1[1].indexOf(parsed2[1]) === -1;
        case Or:
          return !subsetArray(parsed2[1], parsed1[1]);
        case NotOr:
          return true;
      }
      break;
  }

  return false;
};
