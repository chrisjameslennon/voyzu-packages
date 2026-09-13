# Semantic Data Contract migration

## Current status

Superseded: semantic data and semantic capabilities have both been removed. All active callers now use the internal API. ERP Core has moved to the preinstalled Platform package `@voyzu/organization`.

| Previous retrieval | Current internal API |
| --- | --- |
| `userSummary.byIds` | `@core/user.getSummaries` |
| `organizationDirectory.all` | `@core/organization.getDirectory` |
| `inventoryItem.byOrganization` | `@erp/inventory-item.byOrganization` |
| `inventoryItem.operational.bySkus` | `@erp/inventory-item-operational.bySkus` |
| `stockActivity.byCode` | `@erp/stock-activity.byCode` |

Identity, organization context, financial provisioning and inventory processing also use internal API implementations. Shared Finance compositions return a nested `finance` property. Method-only contracts may omit `dataDefinition`. Historical command tests remain disabled; migrated contract tests have been typechecked, not executed during this migration.

See [Internal API](../voyzu/docs/public/platform-contracts/internal-api.md).

## Previous migration (historical)

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
