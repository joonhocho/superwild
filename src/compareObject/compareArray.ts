import { CompareResult } from '_src/compareCommon';
import { compareKeySet } from '_src/comparePath/compareKeySet';
import { IKeySet } from '_src/comparePath/const';

export const compareArray = (a: string[], b: string[]): CompareResult => {
  const aMap: IKeySet = {};
  for (let i = 0, aLen = a.length; i < aLen; i += 1) {
    aMap[a[i]] = 1;
  }

  const bMap: IKeySet = {};
  for (let i = 0, bLen = b.length; i < bLen; i += 1) {
    bMap[b[i]] = 1;
  }

  return compareKeySet(aMap, bMap, a, b);
};
