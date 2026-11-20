import { isTopDirectory } from './isTopDirectory.ts';
import { isWindows } from './index.test.ts';

describe('isTopDirectory', () => {
  test.runIf(isWindows)('Should return true for C:\\', () => {
    expect(isTopDirectory('C:\\')).toBe(true);
  });

  test('Should return true for / on all platforms', () => {
    expect(isTopDirectory('/')).toBe(true);
  });
});
