import os from 'os';
import path from 'path';

export const isWindows = os.platform() === 'win32';

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
