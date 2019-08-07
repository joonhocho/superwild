import { SegmentType } from './const';
import { ParsedSegment } from './ParsedSegment';

const { Nil } = SegmentType;

export class SegmentsMatcher {
  public _segments?: ParsedSegment[];
  public _varLengthIndex?: number;
  public _length?: [number, number];
  public _hasNilSegment?: boolean;

  constructor(public pattern: string, public separator = '/') {}

  public parse(): void {
    const patterns = this.pattern.split(this.separator);
    const segments = new Array(patterns.length) as ParsedSegment[];

    let minSum = 0;
    let maxSum = 0;
    for (let i = 0, len = patterns.length; i < len; i += 1) {
      const segment = (segments[i] = new ParsedSegment(patterns[i]));
      const [min, max] = segment.length;
      minSum += min;
      maxSum += max;
      if (min !== max) {
        if (this._varLengthIndex !== undefined) {
          throw new Error('cannot have more than one *? or **');
        }
        this._varLengthIndex = i;
      }
      if (segment.type === Nil) {
        this._hasNilSegment = true;
      }
    }

    if (this._varLengthIndex === undefined) {
      this._varLengthIndex = -1;
    }

    this._length = [minSum, maxSum];
    this._segments = segments;
  }

  public segments(): ParsedSegment[] {
    if (this._segments === undefined) {
      this.parse();
    }
    return this._segments!;
  }

  get length(): [number, number] {
    if (this._length === undefined) {
      this.parse();
    }
    return this._length!;
  }
}
