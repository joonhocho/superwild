import { IKeySet } from './const';

const { keys } = Object;

// whether a is subset of b
// b must have all a keys or more
// a keys <= b keys
export const subsetKeySet = (
  a: IKeySet,
  b: IKeySet,
  aKeys = keys(a),
  bKeys = keys(b)
): boolean => {
  const aLen = aKeys.length;
  const bLen = bKeys.length;

  if (aLen > bLen || aLen === 0) {
    return false;
  }

  // check shorter keys first
  for (let i = 0; i < aLen; i += 1) {
    if (b[aKeys[i]] !== 1) {
      return false;
    }
  }

  return true;
};
