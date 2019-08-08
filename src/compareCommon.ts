export enum CompareResult {
  Disjoint = 0,
  Intersect,
  Subset,
  Identity,
  Superset,
}

const { Disjoint, Intersect, Subset, Identity, Superset } = CompareResult;

export const OrToNotOr: { [K in CompareResult]: CompareResult } = {
  [Disjoint]: Subset,
  [Intersect]: Intersect,
  [Subset]: Disjoint,
  [Identity]: Disjoint,
  [Superset]: Intersect,
};

export const NotOrToOr: { [K in CompareResult]: CompareResult } = {
  [Disjoint]: Superset,
  [Intersect]: Intersect,
  [Subset]: Intersect,
  [Identity]: Disjoint,
  [Superset]: Disjoint,
};

export const NotOrToNotOr: { [K in CompareResult]: CompareResult } = {
  [Disjoint]: Intersect,
  [Intersect]: Intersect,
  [Subset]: Superset,
  [Identity]: Identity,
  [Superset]: Subset,
};
