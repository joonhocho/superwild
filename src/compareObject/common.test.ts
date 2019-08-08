import { isNotOrExp } from './common';

test('isNotOrExp', () => {
  expect(isNotOrExp('')).toBe(false);
  expect(isNotOrExp(['a', 'b'])).toBe(false);
  expect(isNotOrExp(['!', 'b'])).toBe(false);
  expect(isNotOrExp(['!', ['b']])).toBe(true);
});
