export const startsWith = (str: string, prefix: string): boolean =>
  str.lastIndexOf(prefix, 0) === 0;

export const endsWith = (str: string, suffix: string): boolean =>
  str.indexOf(suffix, str.length - suffix.length) !== -1;

export interface IPathParams {
  [key: string]: number | string | undefined;
}

export type BuildPath<Params extends IPathParams = IPathParams> = (
  params: Params
) => string;

export interface ICompilePathOptions {
  nilParam?: string;
  paramPrefix?: string;
  paramSuffix?: string;
  separator?: string;
}

// tslint:disable-next-line typedef
const getter = <T>(v: T) => () => v;

// tslint:disable-next-line typedef
const createParamBuilder = (
  parts: string[],
  varIndexes: number[],
  separator: string,
  nilParam: string
) => (params: IPathParams): string => {
  const fillParts = parts.slice();
  for (let i = 0, len = varIndexes.length; i < len; i += 1) {
    const index = varIndexes[i];
    const name = parts[index];
    const val = params[name];
    fillParts[index] = val == null ? nilParam : (val as any);
  }
  return fillParts.join(separator);
};

export const compilePathWithParams = <Params extends IPathParams = IPathParams>(
  path: string,
  options?: ICompilePathOptions
): BuildPath<Params> => {
  const paramPrefix = (options && options.paramPrefix) || '$';
  const paramSuffix = (options && options.paramSuffix) || '';
  const separator = (options && options.separator) || '/';
  const nilParam = (options && options.nilParam) || '*';

  const parts = path.split(separator);

  const varIndexes: number[] = [];
  const optimizedParts: string[] = [];
  let toCombine: string[] | null = [];

  for (let i = 0, len = parts.length; i < len; i += 1) {
    const part = parts[i];
    if (startsWith(part, paramPrefix) && endsWith(part, paramSuffix)) {
      // is variable
      if (toCombine.length) {
        optimizedParts.push(toCombine.join(separator));
        toCombine = [];
      }
      optimizedParts.push(
        part.substring(paramPrefix.length, part.length - paramSuffix.length)
      );
      varIndexes.push(optimizedParts.length - 1);
    } else {
      toCombine.push(part);
    }
  }

  if (toCombine.length) {
    optimizedParts.push(toCombine.join(separator));
    toCombine = null;
  }

  if (!varIndexes.length) {
    return getter(path);
  }

  return createParamBuilder(optimizedParts, varIndexes, separator, nilParam);
};
