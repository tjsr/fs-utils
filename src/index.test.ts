import { findFileUpwards } from './index.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const isWindows = os.platform() === 'win32';

describe('findFileUpwards', () => {
  let rundir: string;
  let topRunDir: string;
  beforeAll(() => {
    const testRunId = (new Date()).getTime().toString();
    
    topRunDir = path.resolve(os.tmpdir(), 'fs-utils-tests');
    rundir = path.resolve(topRunDir, testRunId, 'testdata');

    fs.mkdirSync(rundir, { recursive: true });
    fs.writeFileSync(path.resolve(topRunDir, 'testfile.txt'), 'testfile\n');
    fs.writeFileSync(path.resolve(rundir, 'testfile2.txt'), 'testfile2\n');
    fs.writeFileSync(path.resolve(topRunDir, 'testfile3.txt'), 'testfile3-top\n');
    fs.writeFileSync(path.resolve(rundir, 'testfile3.txt'), 'testfile3-dir\n');
  });

  test('Should find testfile.txt in the top directory', () => {
    const foundLocation = findFileUpwards('testfile.txt', 3, rundir);
    expect(foundLocation).toBe(path.resolve(topRunDir, 'testfile.txt'));
  });

  test('Should not find testfile.txt if search depth is limited', () => {
    expect(() => {
      findFileUpwards('testfile.txt', 1, rundir);
    }).toThrowError(expect.any(Error));
  });

  test('Should find testfile.txt in the current directory', () => {
    const foundLocation = findFileUpwards('testfile3.txt', 3, rundir);
    expect(foundLocation).toBe(path.resolve(rundir, 'testfile3.txt'));
  });

  test('Should find package.json with no start specified', () => {
    const foundLocation = findFileUpwards('package.json', 3);
    const resolvePath = __dirname.endsWith('src')
      ? path.resolve(__dirname, '..', 'package.json')
      : path.resolve(__dirname, 'package.json');
    expect(foundLocation).toBe(resolvePath);
  });

  test('Should not find testfile.txt if search depth is limited and no base dir is given', () => {
    expect(() => {
      findFileUpwards('testfile.txt', 1);
    }).toThrowError(expect.any(Error));
  });
});
