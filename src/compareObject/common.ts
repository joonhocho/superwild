import { Not, ObjectPropExpression } from './const';

const { isArray } = Array;

export const isNotOrExp = (
  prop: string | string[] | ObjectPropExpression
): prop is ObjectPropExpression => prop[0] === Not && isArray(prop[1]);
