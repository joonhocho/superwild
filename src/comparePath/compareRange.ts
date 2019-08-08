import { CompareResult } from '_src/compareCommon';

const { Disjoint, Intersect, Subset, Identity, Superset } = CompareResult;

export const compareRange = (
  min1: number,
  max1: number,
  min2: number,
  max2: number
): CompareResult => {
  if (min1 === min2 && max1 === max2) {
    return Identity;
  }

  if (min1 <= min2 && max1 >= max2) {
    return Superset;
  }

  if (min1 >= min2 && max1 <= max2) {
    return Subset;
  }

  if (max1 < min2 || max2 < min1) {
    return Disjoint;
  }

  return Intersect;
};
