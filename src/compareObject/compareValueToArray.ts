import { CompareResult } from '_src/compareCommon';

const { Disjoint, Subset, Identity } = CompareResult;

export const compareValueToArray = (
  value: string,
  enums: string[]
): CompareResult => {
  let found = false;
  let hasMore = false;
  for (let i = 0, len = enums.length; i < len; i += 1) {
    if (value === enums[i]) {
      if (hasMore) {
        return Subset;
      }
      found = true;
    } else {
      if (found) {
        return Subset;
      }
      hasMore = true;
    }
  }
  return found ? Identity : Disjoint;
};
