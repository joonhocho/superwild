import { CompareResult, IKeySet } from './const';

const { Disjoint, Intersect, Subset, Identity, Superset } = CompareResult;

const { keys } = Object;

export const compareKeySet = (
  a: IKeySet,
  b: IKeySet,
  aKeys = keys(a),
  bKeys = keys(b)
): CompareResult => {
  const aLen = aKeys.length;
  const bLen = bKeys.length;

  let intersects = false;
  let aOnly = false;
  let bOnly = false;

  if (aLen <= bLen) {
    // check shorter keys first
    for (let i = 0; i < aLen; i += 1) {
      if (b[aKeys[i]] === 1) {
        intersects = true;
      } else {
        aOnly = true;
      }
    }

    if (!intersects) {
      return Disjoint;
    }

    for (let i = 0; i < bLen; i += 1) {
      if (a[bKeys[i]] !== 1) {
        bOnly = true;
        break;
      }
    }
  } else {
    for (let i = 0; i < bLen; i += 1) {
      if (a[bKeys[i]] === 1) {
        intersects = true;
      } else {
        bOnly = true;
      }
    }

    if (!intersects) {
      return Disjoint;
    }

    for (let i = 0; i < aLen; i += 1) {
      if (b[aKeys[i]] !== 1) {
        aOnly = true;
        break;
      }
    }
  }

  if (aOnly) {
    if (bOnly) {
      return Intersect;
    }
    return Superset;
  }

  if (bOnly) {
    return Subset;
  }

  return Identity;
};
