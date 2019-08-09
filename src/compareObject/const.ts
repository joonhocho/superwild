import { CompareResult } from '_src/compareCommon';

export const Not = '!';
export type Not = typeof Not;

export const WildKey = '*';
export type WildKey = typeof WildKey;

export const MatchAny = 1;
export type MatchAny = 1;

export const MatchNone = -1;
export type MatchNone = -1;

export type ObjectPropExpression = [Not, string[]];

export type ObjectPropPattern =
  | MatchAny
  | MatchNone
  | string
  | string[]
  | ObjectPropExpression;

export type ObjectPattern<Key extends string = string> = {
  [key in Key]?: ObjectPropPattern;
} & {
  [WildKey]?: ObjectPropPattern;
};

export type ObjectPropMatchType =
  | 'disjoint'
  | 'intersect'
  | 'subset'
  | 'identity'
  | 'superset';

export type ObjectMatchRule<Key extends string = string> = {
  [key in Key]?: CompareResult | ObjectPropMatchType;
} & {
  [WildKey]?: CompareResult | ObjectPropMatchType;
};

export enum ObjectPropType {
  Match = 1,
  NoMatch = -1,
  Value = 2,
  Or = 3,
  NotOr = 4,
}

export type ParsedProp =
  | [ObjectPropType.Match]
  | [ObjectPropType.NoMatch]
  | [ObjectPropType.Value, string]
  | [ObjectPropType.Or, string[]]
  | [ObjectPropType.NotOr, string[]];
