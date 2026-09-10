# TODO: Semantic Data Contract migration

Port these retrieval methods when implementing the new Semantic Data Contract
specification. They have been removed from the capability documentation only;
runtime code is unchanged. All five operations retrieve data, not modify it.

## Current interfaces

Package identifies the implementor; `Id` is a positive integer.

| Contract name | Method | Defining package | Package | Input parameters | Output parameters |
| --- | --- | --- | --- | --- | --- |
| `platform.identity` | `lookup` | Voyzu platform | `@voyzu/auth` | `{ ids: Id[] }` | `{ users: { id: Id, code: string, displayName: string }[] }` |
| `platform.organization-directory` | `list` | Voyzu platform | `@voyzu/erp-core` | `{}` | `{ organizations: { id: Id, code: string, name: string }[] }` |
| `erp.inventory-catalog` | `listItems` | `@voyzu/erp-core` | `@voyzu/inventory` | `{ organizationId: Id }` | `{ items: { id: Id, sku: string, name: string, category: string or null, unit: string or null, quantityTracked: boolean, status: "ACTIVE" / "INACTIVE" }[] }` |
| `erp.inventory-catalog` | `getOperationalItems` | `@voyzu/erp-core` | `@voyzu/inventory` | `{ organizationId: Id, skus: string[] }` | `{ items: { id: Id, sku: string, name: string, description: string, quantityTracked: boolean, status: "ACTIVE" / "INACTIVE" }[] }` |
| `erp.inventory-activity` | `getStockActivityDetail` | `@voyzu/erp-core` | `@voyzu/inventory` | `{ organizationId: Id, code: string }` | `{ record: StockActivityDetail or null }` |

- **StockActivityDetail:** `id: Id`, `code: string`, `date: string`, `type: string`, `reference: string or null`, `notes: string`, `audit` metadata, plus:
  - `linkedDocuments`: records containing `documentType: string`, `documentId: Id`, `documentCode: string`, `creationDate: string` and `href: string or null`.
  - `lines`: records containing `id: Id`, `itemId: Id`, `sku: string`, `itemName: string`, `warehouseId: Id`, `warehouse: string`, `quantityChange: number` and `reasonCode: string or null`.

## Tasks

- [ ] `platform.identity.lookup`: migrate to `user` or `user.summary` with a named batch query accepting numeric IDs. Resolve the difference from current user master-data lookup by code. Keep `current` as a capability.
- [ ] `platform.organization-directory.list`: platform defines `organization.summary`, ERP Core implements a named all-records query. Preserve optional-provider behaviour and Audit's independence from ERP Core definitions.
- [ ] `erp.inventory-catalog.listItems`: define `inventory.item` with an organization-scoped query.
- [ ] `erp.inventory-catalog.getOperationalItems`: support organization-scoped batch SKU lookup. Align the differing fields with `inventory.item`, or define a focused contract; query outputs must be full contract records.
- [ ] `erp.inventory-activity.getStockActivityDetail`: define `inventory.stockActivity`, preserving organization-and-code lookup, detail fields and not-found behaviour.

Candidate names are provisional. Define stable root identifiers and include them
in every result. Preserve authorization, organization scope and efficient batch
retrieval; do not replace batches with repeated `get` calls. Use named queries,
not a mandatory `list` method.

- [ ] Update providers, consumers and relevant tests. Adapt current response
  envelopes (`users`, `organizations`, `items`, `record`) to the new results.
- [ ] Remove obsolete capability definitions and registrations only after migration;
  update the documentation catalogs.

Reference: [Semantic Data Contracts](../voyzu/docs/public/platform-concepts/semantic-data-contracts.md).
