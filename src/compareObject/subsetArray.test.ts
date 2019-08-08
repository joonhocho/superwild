// tslint:disable no-console
import { subsetArray } from './subsetArray';

test('subsetArray', () => {
  const run = (a: string[], b: string[], expected: boolean): any =>
    expect(subsetArray(a, b)).toBe(expected);

  run([], [], false);
  run(['a'], [], false);
  run([], ['a'], false);
  run(['a', 'b'], ['c'], false);
  run(['c'], ['a', 'b'], false);
  run(['a'], ['a', 'b'], true);
  run(['a', 'b'], ['a', 'b'], true);
  run(['a', 'b'], ['a'], false);
  run(['a'], ['a'], true);
  run(['a'], ['b'], false);
  run(['a', 'b'], ['b', 'c'], false);
});
