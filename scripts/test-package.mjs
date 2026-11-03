import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), 'fs-utils-package-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (command, args, cwd = temporary) =>
  execFileSync(command, args, { cwd, stdio: 'inherit' });

try {
  // build:dist has just run; avoid recursively executing prepack.
  const packed = process.env.FS_UTILS_PACKAGE ? null : JSON.parse(execFileSync(npm,
    ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary],
    { cwd: root, encoding: 'utf8' }));
  writeFileSync(join(temporary, 'package.json'), '{"private":true}\n');
  run(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund',
    '--package-lock=false', process.env.FS_UTILS_PACKAGE || join(temporary, (Array.isArray(packed) ? packed[0] : Object.values(packed)[0]).filename)]);
  const source = `import { stripFileExtension, findFileUpwards } from '@tjsr/fs-utils';
import { strict as assert } from 'node:assert';
assert.equal(stripFileExtension('example.txt'), 'example');
assert.ok(findFileUpwards('package.json', 0).endsWith('package.json'));
`;
  writeFileSync(join(temporary, 'consumer.mjs'), source);
  writeFileSync(join(temporary, 'consumer.cjs'), source
    .replace("import { stripFileExtension, findFileUpwards } from '@tjsr/fs-utils';",
      "const { stripFileExtension, findFileUpwards } = require('@tjsr/fs-utils');")
    .replace("import { strict as assert } from 'node:assert';",
      "const { strict: assert } = require('node:assert');"));
  run(process.execPath, ['consumer.mjs']);
  run(process.execPath, ['consumer.cjs']);
  for (const extension of ['mts', 'cts']) {
    writeFileSync(join(temporary, 'consumer.' + extension), source +
      "\nconst result: string = stripFileExtension('example.txt');\n" +
      "// @ts-expect-error Public API requires a string, not a number.\n" +
      "stripFileExtension(123);\n");
  }
  for (const module of ['Node16', 'NodeNext']) {
    run(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'),
      '--noEmit', '--strict', '--skipLibCheck', 'false',
      '--module', module, '--moduleResolution', module,
      '--target', 'ES2022', '--lib', 'ES2022', '--types', 'node',
      '--typeRoots', resolve(root, 'node_modules/@types'),
      'consumer.mts', 'consumer.cts']);
  }
  const boundary = JSON.parse(readFileSync(join(temporary,
    'node_modules/@tjsr/fs-utils/dist/cjs/package.json'), 'utf8'));
  if (boundary.type !== 'commonjs') throw new Error('Missing CommonJS package boundary');
  console.log('Packed ESM/CJS runtime and Node16/NodeNext declaration consumers passed.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
