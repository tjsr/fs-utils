import { isWindows } from './isWindows.ts';
import path from 'path';

export const isBaseDirectory = (p: string): boolean => {
  const parsedPath = path.parse(p);
  return parsedPath.root === parsedPath.dir;
};

export const isTopDirectory = (path: string): boolean => {
  if (isWindows) {
    return isBaseDirectory(path);
  }
  return path === '/';
};
