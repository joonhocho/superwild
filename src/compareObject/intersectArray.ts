import { IKeySet } from '_src/comparePath/const';
import { intersectKeySet } from '_src/comparePath/intersectKeySet';

export const intersectArray = (a: string[], b: string[]): boolean => {
  const aMap: IKeySet = {};
  for (let i = 0, aLen = a.length; i < aLen; i += 1) {
    aMap[a[i]] = 1;
  }

  const bMap: IKeySet = {};
  for (let i = 0, bLen = b.length; i < bLen; i += 1) {
    bMap[b[i]] = 1;
  }

  return intersectKeySet(aMap, bMap, a, b);
};
