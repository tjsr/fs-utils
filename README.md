# npm-library-template

Template for npm libraries using Typescript.

## Repo configuration

The workflow files for this repo require the NODE_VERSION and NPM_VERSION var to be specified.

```bash
  gh auth login
  gh variable set NODE_VERSION -b "20.15.1"
  gh variable set NPM_VERSION -b "10.8.2"
```

## Distribution checks

`npm run test:package` builds and packs the library, installs the tarball into an
isolated consumer, and checks ESM imports, CommonJS requires, and strict
Node16/NodeNext TypeScript consumers. CI runs these checks on Node 22 and 24
with the latest npm.

The CommonJS output includes its own `package.json` with `type: commonjs`.
Conditional exports select matching runtime files and declarations for each
module format. After this fix is merged, a new fs-utils version must be
published and consumed by testutils before downstream packages can use it.
