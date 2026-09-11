# Semantic Data Contract migration

The five retrieval capabilities have been migrated. The old capability definitions
and registrations are removed; callers use full-record queries and adapt results
to existing application DTOs.

| Previous capability method | Semantic Data Contract / query | Defining package | Implementing package |
| --- | --- | --- | --- |
| `platform.identity.lookup` | `userSummary.byIds({ ids })` | Platform | Auth |
| `platform.organization-directory.list` | `organizationDirectory.all({})` | Platform | ERP Core |
| `erp.inventory-catalog.listItems` | `inventoryItem.byOrganization({ organizationId })` | ERP Core | Inventory |
| `erp.inventory-catalog.getOperationalItems` | `inventoryItem.operational.bySkus({ organizationId, skus })` | ERP Core | Inventory |
| `erp.inventory-activity.getStockActivityDetail` | `stockActivity.byCode({ organizationId, code })` | ERP Core | Inventory |

All five contracts support get by numeric ID. The separate `user` contract retains
code-based lookup. The two item projections retain their respective fields; stock
activity retains audit metadata, document links and lines.

Batching and organization scope are unchanged. Optional queries return null for
a missing implementation, versus [] for no matches. Provider errors propagate.
Audit retains its empty-directory fallback; Finance retains unavailable/empty
states and fail-closed posting-profile usage checks.

Capabilities retain current identity, organization context, financial entity
creation and inventory movement processing. Context methods use the catalogue's
new names. Shared transactions are unchanged.

Existing list operations are now named `all` queries. Named Finance compositions
return complete flattened records or null, with optional contract-name wrapping.
The old masterData API is removed without compatibility aliases.

The active organization/Finance integration test is migrated and isolated runtime
regression tests are added. Historical disabled command tests are untouched.

Reference: [Master Semantic Data Contract](../voyzu/docs/public/platform-concepts/semantic-data-contract-master.md).
