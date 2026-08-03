# Ice Creams

Ice Creams is the golden reference package for extending Voyzu. It is deliberately
self-contained: its only business dependency is Voyzu auditing.

## Package contents

- `voyzu.package.ts` — intermediary exporting modules, dependencies, installation assets and scripts.
- `modules/*/module.ts` — authoritative page-route and API-route registries.
- `install/db/sql` — ordered, idempotent schema installation.
- `install/db/seed` — idempotent reference-flavour seeds.
- `modules/ice-creams` — owning CRUD module, APIs, UI, policy and tests.
- `modules/reports` — the All Ice Creams report and report API.
- `modules/audit` — package-owned pages that query the single platform audit API with the Ice Creams package code.
- `modules/types` — package-owned DTO contracts; it is not an installable module.
- `navigation` — optional top and left navigation exported by `package.json`.
- `scripts/sample-data` — optional repeatable demonstration-data installation.
- `uninstall` — ordered database removal artifacts used by `voyzu:uninstall-package`.

The package conforms to the current Voyzu package and module contracts and can
be installed or linked with the standard Voyzu package commands.
