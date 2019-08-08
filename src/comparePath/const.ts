// single wildcard
export const w1 = '*';

// double wildcards
export const w0p = '**';
export const w01 = '*?';

export const EmptySet = '()';

export enum SegmentType {
  Nil = 0,
  Value,
  Wild,
  Or,
  NotOr,
}

export interface IKeySet {
  [key: string]: 1;
}
