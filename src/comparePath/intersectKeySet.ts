import { IKeySet } from './const';

const { keys } = Object;

export const intersectKeySet = (
  a: IKeySet,
  b: IKeySet,
  aKeys = keys(a),
  bKeys = keys(b)
): boolean => {
  const aLen = aKeys.length;
  const bLen = bKeys.length;

  if (aLen <= bLen) {
    // check shorter keys first
    for (let i = 0; i < aLen; i += 1) {
      const aKey = aKeys[i];
      if (b[aKey] === 1) {
        return true;
      }
    }
  } else {
    for (let i = 0; i < bLen; i += 1) {
      const bKey = bKeys[i];
      if (a[bKey] === 1) {
        return true;
      }
    }
  }

  return false;
};
