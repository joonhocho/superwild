import { CompareResult } from '_src/compareCommon';
import { EmptySet, SegmentType, w01, w0p, w1 } from './const';

const { Subset, Identity, Superset } = CompareResult;
const { Nil, Value, Wild, Or, NotOr } = SegmentType;

export interface IEnumSet {
  [key: string]: 1;
}

export type Infinity = typeof Infinity;
const length1: [1, 1] = [1, 1];
const length01: [0, 1] = [0, 1];
const length0p: [0, Infinity] = [0, Infinity];

export type Length = typeof length1 | typeof length01 | typeof length0p;

export class ParsedSegment {
  public pattern: string;
  public type: SegmentType;
  public length: Length;
  public _enums?: string[];
  public _enumMap?: IEnumSet;

  constructor(pattern: string) {
    switch (pattern) {
      case w1:
      case '!()':
        this.pattern = w1;
        this.type = Wild;
        this.length = length1;
        return;
      case w01:
        this.pattern = pattern;
        this.type = Wild;
        this.length = length01;
        return;
      case w0p:
        this.pattern = pattern;
        this.type = Wild;
        this.length = length0p;
        return;
      case EmptySet:
        this.pattern = pattern;
        this.type = Nil;
        this.length = length1;
        return;
      default:
        this.pattern = pattern;
        this.length = length1;
    }

    if (pattern[pattern.length - 1] === ')') {
      if (pattern[0] === '(') {
        // in set
        this.type = Or;
        return;
      }
      if (pattern[0] === '!' && pattern[1] === '(') {
        // not in set
        this.type = NotOr;
        return;
      }
    }

    this.type = Value;
  }

  get fixedLength(): boolean {
    const [min, max] = this.length;
    return min === max;
  }

  get enums(): string[] {
    if (this._enums === undefined) {
      const { pattern } = this;
      switch (this.type) {
        case Value:
        case Wild:
          this._enums = [pattern];
          break;
        case Nil:
          this._enums = [];
          break;
        case Or:
          this._enums = pattern.substring(1, pattern.length - 1).split('|');
          break;
        case NotOr:
          this._enums = pattern.substring(2, pattern.length - 1).split('|');
          break;
      }
    }
    return this._enums!;
  }

  get enumMap(): IEnumSet {
    if (this._enumMap === undefined) {
      const { enums } = this;
      const set: IEnumSet = {};
      for (let i = 0, len = enums.length; i < len; i += 1) {
        set[enums[i]] = 1;
      }
      this._enumMap = set;
    }
    return this._enumMap;
  }

  public compareLength({ length: toLength }: ParsedSegment): CompareResult {
    const { length } = this;
    if (length === toLength) {
      return Identity;
    }

    if (length === length1) {
      return Subset;
    }

    if (length === length0p) {
      return Superset;
    }

    // length = 01
    return toLength === length1 ? Superset : Subset;
  }
}
