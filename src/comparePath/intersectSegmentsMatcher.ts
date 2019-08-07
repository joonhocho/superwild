import { EmptySet } from './const';
import { intersectParsedSegment } from './intersectParsedSegment';
import { SegmentsMatcher } from './SegmentsMatcher';

export const intersectSegmentsMatcher = (
  matcher1: SegmentsMatcher,
  matcher2: SegmentsMatcher
): boolean => {
  if (matcher1 === matcher2 || matcher1.pattern === matcher2.pattern) {
    return matcher1.pattern !== EmptySet;
  }

  const [min1, max1] = matcher1.length; // triggers parse()
  const [min2, max2] = matcher2.length;
  if (
    max1 < min2 ||
    max2 < min1 ||
    matcher1._hasNilSegment ||
    matcher2._hasNilSegment
  ) {
    return false;
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
    if (!intersectParsedSegment(segments1[i], segments2[i])) {
      return false;
    }
  }

  if (fixedLength1 && fixedLength2) {
    // no need to look right
    return true;
  }

  // right

  const lastIndex1 = segLen1 - 1;
  const lastIndex2 = segLen2 - 1;

  const rightLength1 = fixedLength1 ? segLen1 : lastIndex1 - varLengthIndex1;
  const rightLength2 = fixedLength2 ? segLen2 : lastIndex2 - varLengthIndex2;
  const rightLength = Math.min(rightLength1, rightLength2);

  for (let i = 0; i < rightLength; i += 1) {
    if (
      !intersectParsedSegment(
        segments1[lastIndex1 - i],
        segments2[lastIndex2 - i]
      )
    ) {
      return false;
    }
  }

  return true;
};
