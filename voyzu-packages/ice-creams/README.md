# Ice Creams

Ice Creams is the golden reference package for extending Voyzu. It is deliberately
self-contained: its only business dependency is Voyzu auditing.

## Package contents

- `voyzu.package.ts` — package manifest, navigation and install assets.
- `module.ts` — the package's authoritative page-route and API-route registry.
- `install/db/sql` — ordered, idempotent schema installation.
- `install/db/seed` — idempotent reference-flavour seeds.
- `modules/ice-creams` — owning CRUD module, APIs, UI, policy and tests.
- `modules/reports` — the All Ice Creams report and report API.
- `modules/audit` — isolated adapter to the current Voyzu audit implementation.
- `modules/types` — package-owned DTO contracts; it is not an installable module.
- `navigation` — the package's single top-nav item and grouped left navigation.
- `scripts/sample-data` — optional repeatable demonstration-data installation.
- `scripts/uninstall` — explicit destructive removal, separated from installation.

The package is intentionally ahead of the current installer and composer. It is
the contract those tools will be changed to support.
