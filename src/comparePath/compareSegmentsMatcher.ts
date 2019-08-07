import { compareParsedSegment } from './compareParsedSegment';
import { compareRange } from './compareRange';
import { CompareResult, EmptySet } from './const';
import { SegmentsMatcher } from './SegmentsMatcher';

const { Disjoint, Intersect, Subset, Identity, Superset } = CompareResult;

const reduceCompareResult = (
  prev: CompareResult,
  next: CompareResult
): CompareResult => {
  if (prev === next || prev === Identity) {
    return next;
  }
  if (next === Identity) {
    return prev;
  }
  // if (prev === Disjoint || next === Disjoint) {
  //   return Disjoint;
  // }
  // if (prev === Intersect || next === Intersect) {
  //   return Intersect;
  // }
  return Intersect;
};

export const compareSegmentsMatcher = (
  matcher1: SegmentsMatcher,
  matcher2: SegmentsMatcher
): CompareResult => {
  if (matcher1 === matcher2 || matcher1.pattern === matcher2.pattern) {
    return matcher1.pattern === EmptySet ? Disjoint : Identity;
  }

  const [min1, max1] = matcher1.length; // triggers parse()
  const [min2, max2] = matcher2.length;
  let res = compareRange(min1, max1, min2, max2);
  if (res === Disjoint || matcher1._hasNilSegment || matcher2._hasNilSegment) {
    return Disjoint;
  }

  const segments1 = matcher1._segments!;
  const segments2 = matcher2._segments!;

  const segLen1 = segments1.length;
  const segLen2 = segments2.length;

  const varLengthIndex1 = matcher1._varLengthIndex!;
  const varLengthIndex2 = matcher2._varLengthIndex!;

  const fixedLength1 = varLengthIndex1 === -1;
  const fixedLength2 = varLengthIndex2 === -1;

  // left

  const leftLength1 = fixedLength1 ? segLen1 : varLengthIndex1;
  const leftLength2 = fixedLength2 ? segLen2 : varLengthIndex2;
  const leftLength = Math.min(leftLength1, leftLength2);

  for (let i = 0; i < leftLength; i += 1) {
    const segRes = compareParsedSegment(segments1[i], segments2[i]);
    if (segRes === Disjoint) {
      return Disjoint;
    }

    res = reduceCompareResult(res, segRes);
  }

  if (leftLength1 !== leftLength2) {
    res = reduceCompareResult(
      res,
      leftLength1 > leftLength2 ? Subset : Superset
    );
  }

  if (fixedLength1 && fixedLength2) {
    // no need to look right
    return res;
  }

  // right

  const lastIndex1 = segLen1 - 1;
  const lastIndex2 = segLen2 - 1;

  const rightLength1 = fixedLength1 ? segLen1 : lastIndex1 - varLengthIndex1;
  const rightLength2 = fixedLength2 ? segLen2 : lastIndex2 - varLengthIndex2;
  const rightLength = Math.min(rightLength1, rightLength2);

  for (let i = 0; i < rightLength; i += 1) {
    const segRes = compareParsedSegment(
      segments1[lastIndex1 - i],
      segments2[lastIndex2 - i]
    );
    if (segRes === Disjoint) {
      return Disjoint;
    }

    res = reduceCompareResult(res, segRes);
  }

  if (rightLength1 !== rightLength2) {
    res = reduceCompareResult(
      res,
      rightLength1 > rightLength2 ? Subset : Superset
    );
  }

  return res;
};
