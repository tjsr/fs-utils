import { writeFileSync } from 'node:fs';

// Both JavaScript and declarations in this directory describe CommonJS modules.
writeFileSync(new URL('../dist/cjs/package.json', import.meta.url),
  JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');
