import fs from 'fs';
import { isTopDirectory } from './isTopDirectory.js';
import os from 'os';
import path from 'path';

export const isWindows = os.platform() === 'win32';

export const findFileUpwards = (
  searchFilename: string = 'package.json',
  maxDepth: number = 2,
  startDir: string = import.meta.dirname
): string => {
  let currentLevel = 0;
  let searchPath = startDir;
  do {
    const searchFilePath = path.resolve(searchPath, searchFilename);
    if (fs.existsSync(searchFilePath)) {
      return searchFilePath;
    }
    if (isTopDirectory(searchPath)) {
      break;
    }

    searchPath = path.resolve(searchPath, '..');
  } while (currentLevel++ < maxDepth);

  throw new Error(`Could not find ${searchFilename} ${maxDepth} levels below ${startDir}`);
};
