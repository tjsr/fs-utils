import fs from 'fs';
import { isTopDirectory } from './isTopDirectory.js';
import path from 'path';

export { isWindows } from './isWindows.js';
export { getSafeTmpDir } from './safeTmpDir.js';

export const findFileUpwards = (
  searchFilename: string = 'package.json',
  maxDepth: number = 2,
  startDir: string = process.cwd()
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
