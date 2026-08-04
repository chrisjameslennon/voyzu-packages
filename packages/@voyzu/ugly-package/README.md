# @voyzu/ugly-package

This package deliberately demonstrates how much visual and implementation freedom a Voyzu package developer has.
It conforms to the minimum Voyzu package and module contracts, but intentionally rejects Voyzu UI components,
layout helpers, styling conventions, persistence, APIs and auditing.

It provides separately registered page routes and package-owned navigation between them. It does not export left
navigation. Its BYO Dependencies page uses the package-owned `cat-names` npm dependency and a static image published
from `public-assets`.

## Documentation

Package documentation belongs under `docs`. Public-facing and online-help
source begins at [`docs/public/README.md`](docs/public/README.md).
