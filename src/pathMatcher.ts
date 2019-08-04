const returnTrue = (): boolean => true;

// /a/**/b/*/c
// ** matches 0 or more parts
// *+ matches 1 or more parts
// * matches exactly part
// ** and *+ can appear only once

const tooWild = '*?, **, *+ can appear only once';

// single wildcard
const w = '*';

// double wildcards
const w01 = '*?';
const w0p = '**';
const w1p = '*+';

interface ICandidateSet {
  [key: string]: boolean;
}

const getCandidateSet = (str: string): ICandidateSet => {
  const candidates = str.split('|');
  const set: ICandidateSet = {};
  for (let i = 0, len = candidates.length; i < len; i += 1) {
    set[candidates[i]] = true;
  }
  return set;
};

enum SegMatchType {
  In = 1,
  NotIn,
}

const { In, NotIn } = SegMatchType;

type ISegmentMatcher = [SegMatchType, ICandidateSet];

const isSegmentMismatch = (
  pattern: string | ISegmentMatcher,
  match: string
): boolean => {
  if (pattern !== match) {
    if (pattern === w) {
      return match === w01 || match === w0p || match === w1p;
    }
    if (pattern[0] === In) {
      return (pattern[1] as ICandidateSet)[match] !== true;
    }
    if (pattern[0] === NotIn) {
      return (pattern[1] as ICandidateSet)[match] === true;
    }
    return true;
  }
  return false;
};

export class WildcardPathMatcher {
  public minLength: number;
  public maxLength: number;

  public segments: string[];

  // before double wildcard
  public left: Array<string | ISegmentMatcher>;

  // after double wildcard
  public right: Array<string | ISegmentMatcher>;

  // double wildcard
  public dw: typeof w01 | typeof w0p | typeof w1p | null = null;

  constructor(pattern: string | string[], public separator = '/') {
    const segments =
      typeof pattern === 'string' ? pattern.split(separator) : pattern;

    let minLength = 0;
    let maxLength = 0;
    let dwCount = 0;
    const left: Array<string | ISegmentMatcher> = [];
    const right: Array<string | ISegmentMatcher> = [];

    for (let i = 0, len = segments.length; i < len; i += 1) {
      const seg = segments[i];
      switch (seg) {
        case w01:
          // 0 or 1
          maxLength += 1;
          if (dwCount > 0) {
            throw new Error(tooWild);
          }
          dwCount += 1;
          this.dw = seg;
          break;
        case w0p:
          // 0 or more
          // minLength += 0;
          maxLength = Infinity;
          if (dwCount > 0) {
            throw new Error(tooWild);
          }
          dwCount += 1;
          this.dw = seg;
          break;
        case w1p:
          // 1 or more
          minLength += 1;
          maxLength = Infinity;
          if (dwCount > 0) {
            throw new Error(tooWild);
          }
          dwCount += 1;
          this.dw = seg;
          break;
        case w:
          // 1
          minLength += 1;
          maxLength += 1;
          (dwCount > 0 ? right : left).push(seg);
          break;
        default: {
          let item: string | ISegmentMatcher = seg;
          if (seg[seg.length - 1] === ')') {
            if (seg[0] === '(') {
              // in set
              item = [In, getCandidateSet(seg.substring(1, seg.length - 1))];
            } else if (seg[0] === '!' && seg[1] === '(') {
              // not in set
              item = [NotIn, getCandidateSet(seg.substring(2, seg.length - 1))];
            }
          }
          minLength += 1;
          maxLength += 1;
          (dwCount > 0 ? right : left).push(item);
        }
      }
    }

    this.minLength = minLength;
    this.maxLength = maxLength;
    this.segments = segments;
    this.left = left;
    this.right = right;
  }

  public match(match: string[]): boolean {
    const { length } = match;
    if (length < this.minLength || length > this.maxLength) {
      return false;
    }

    const { left, right } = this;
    const wildStart = left.length;
    const afterLen = right.length;
    const wildEndAfter = length - afterLen;

    const wildMatchLen = wildEndAfter - wildStart;
    switch (this.dw) {
      case w01:
        if (wildMatchLen < 0 || wildMatchLen > 1) {
          return false;
        }
        for (let i = wildStart; i < wildEndAfter; i += 1) {
          const mItem = match[i];
          if (mItem === w1p || mItem === w0p) {
            return false;
          }
        }
        break;
      case w1p:
        if (wildMatchLen < 1) {
          return false;
        }
        for (let i = wildStart; i < wildEndAfter; i += 1) {
          const mItem = match[i];
          if (mItem === w0p || mItem === w01) {
            return false;
          }
        }
        break;
      case w0p:
        // match anything
        break;
      case null:
        if (wildMatchLen !== 0) {
          return false;
        }
        break;
    }

    for (let i = 0; i < wildStart; i += 1) {
      if (isSegmentMismatch(left[i], match[i])) {
        return false;
      }
    }

    for (let i = 0, len = afterLen; i < len; i += 1) {
      if (isSegmentMismatch(right[i], match[wildEndAfter + i])) {
        return false;
      }
    }

    return true;
  }
}

export const getWildcardStringPathMatcher = (
  pattern: string,
  separator = '/'
): ((match: string) => boolean) => {
  if (pattern === w0p) {
    return returnTrue;
  }
  if (pattern.indexOf(w) === -1 && pattern.indexOf(')') === -1) {
    return (match: string): boolean => match === pattern;
  }
  const matcher = new WildcardPathMatcher(pattern.split(separator));
  return (match: string): boolean => matcher.match(match.split(separator));
};
