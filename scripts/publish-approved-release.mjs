import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const npm = (args) => execFileSync('npm', args, { encoding: 'utf8' }).trim();
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
if (process.env.GITHUB_REF !== 'refs/heads/main' ||
    pkg.name !== '@tjsr/fs-utils' || pkg.version !== '0.0.9') {
  throw new Error('This release is authorized only for @tjsr/fs-utils 0.0.9 on main');
}
const registry = 'https://npm.pkg.github.com';
const versions = JSON.parse(npm(['view', pkg.name, 'versions', '--json', '--registry', registry]));
if ([versions].flat().includes(pkg.version)) {
  throw new Error('Version already exists; refusing to publish or overwrite it');
}
execFileSync('npm', ['run', 'prepack'], { stdio: 'inherit' });
const packed = JSON.parse(npm(['pack', '--ignore-scripts', '--json']));
const entry = Array.isArray(packed) ? packed[0] : Object.values(packed)[0];
const integrity = 'sha512-' + createHash('sha512').update(readFileSync(entry.filename)).digest('base64');
npm(['publish', entry.filename, '--registry', registry, '--tag', 'latest']);
const metadata = JSON.parse(npm(['view', pkg.name + '@' + pkg.version, '--json', '--registry', registry]));
console.log(JSON.stringify({ name: metadata.name, version: metadata.version, dist: metadata.dist, dependencies: metadata.dependencies, engines: metadata.engines, license: metadata.license }));
const published = metadata.dist.integrity;
if (published !== integrity) throw new Error('Published tarball integrity does not match');
execFileSync(process.execPath, ['scripts/test-package.mjs'], {
  stdio: 'inherit', env: { ...process.env, FS_UTILS_PACKAGE: pkg.name + '@' + pkg.version },
});
console.log('Verified published package ' + pkg.name + '@' + pkg.version + ' integrity, runtime and declarations');
