import { CompareResult } from '_src/compareCommon';
import { compareProp } from './compareProp';
import {
  MatchNone,
  ObjectMatchRule,
  ObjectPattern,
  ObjectPropMatchType,
  ObjectPropPattern,
  WildKey,
} from './const';
import { intersectProp } from './intersectProp';

const { keys: getKeys } = Object;

const { Disjoint, Intersect, Subset, Identity, Superset } = CompareResult;

const ruleMap: {
  [key in CompareResult | ObjectPropMatchType]: { [k in CompareResult]?: 1 };
} = {
  [Disjoint]: { [Disjoint]: 1 },
  disjoint: { [Disjoint]: 1 },
  [Intersect]: { [Intersect]: 1, [Subset]: 1, [Identity]: 1, [Superset]: 1 },
  intersect: { [Intersect]: 1, [Subset]: 1, [Identity]: 1, [Superset]: 1 },
  [Subset]: { [Subset]: 1, [Identity]: 1 },
  subset: { [Subset]: 1, [Identity]: 1 },
  [Identity]: { [Identity]: 1 },
  identity: { [Identity]: 1 },
  [Superset]: { [Identity]: 1, [Superset]: 1 },
  superset: { [Identity]: 1, [Superset]: 1 },
};

export const matchObject = <Key extends string = string>(
  obj1: ObjectPattern<Key>,
  obj2: ObjectPattern<Key>,
  rules: ObjectMatchRule<Key>
): string | null => {
  const keys1 = getKeys(obj1);
  for (let i = 0, len = keys1.length; i < len; i += 1) {
    const key = keys1[i] as Key;
    if (key !== WildKey) {
      let v2: ObjectPropPattern | undefined = obj2[key];
      if (v2 == null) {
        v2 = obj2[WildKey];
        if (v2 == null) {
          v2 = MatchNone;
        }
      }

      let rule: CompareResult | ObjectPropMatchType | undefined = rules[key];
      if (rule == null) {
        rule = rules[WildKey];
        if (rule == null) {
          rule = Intersect;
        }
      }

      if (rule === Intersect) {
        if (!intersectProp(obj1[key]!, v2)) {
          return key;
        }
      } else {
        const res = compareProp(obj1[key]!, v2);

        if (ruleMap[rule][res] !== 1) {
          return key;
        }
      }
    }
  }

  const keys2 = getKeys(obj2);
  for (let i = 0, len = keys2.length; i < len; i += 1) {
    const key = keys2[i] as Key;
    if (key !== WildKey && !(key in obj1)) {
      let v1: ObjectPropPattern | undefined = obj1[WildKey];
      if (v1 == null) {
        v1 = MatchNone;
      }

      let rule: CompareResult | ObjectPropMatchType | undefined = rules[key];
      if (rule == null) {
        rule = rules[WildKey];
        if (rule == null) {
          rule = Intersect;
        }
      }

      if (rule === Intersect) {
        if (!intersectProp(v1, obj2[key]!)) {
          return key;
        }
      } else {
        const res = compareProp(v1, obj2[key]!);

        if (ruleMap[rule][res] !== 1) {
          return key;
        }
      }
    }
  }

  return null;
};
