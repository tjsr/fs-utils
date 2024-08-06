import { isWindows } from "./isWindows.js";
import os from 'os';

export const getSafeTmpDir = (): string => {
  // Platform-specific checks
  if (isWindows) {
    return process.env['TEMP'] || process.env['TMP'] || os.tmpdir() || "C:\\Windows\\Temp";
  } else {
    return process.env['TMPDIR'] || os.tmpdir() || '/tmp';
  }
};
