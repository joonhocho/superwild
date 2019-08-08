import {
  MatchAny,
  MatchNone,
  Not,
  ObjectPropPattern,
  ObjectPropType,
  ParsedProp,
} from './const';

const { Value, Or, NotOr } = ObjectPropType;
const { isArray } = Array;

export const MatchProp: ParsedProp = [ObjectPropType.Match];

export const NoMatchProp: ParsedProp = [ObjectPropType.NoMatch];

export const parseProp = (prop: ObjectPropPattern): ParsedProp => {
  if (typeof prop === 'string') {
    return [Value, prop];
  }
  if (prop === MatchAny) {
    return MatchProp;
  }
  if (prop === MatchNone) {
    return NoMatchProp;
  }
  if (prop[0] === Not && isArray(prop[1])) {
    return prop[1].length === 0 ? MatchProp : [NotOr, prop[1]];
  }
  const { length } = prop;
  if (length === 0) {
    return NoMatchProp;
  }
  if (length === 1) {
    return [Value, prop[0]];
  }
  return [Or, prop as string[]];
};
