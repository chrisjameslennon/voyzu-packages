# Deferred cross-package integrations

These calls were deliberately disabled while removing the command system. They must be restored using semantic contracts, not direct cross-package service imports. This list excludes ordinary CLI commands, which are unaffected.

| Caller → provider | Former command | Kind | Current effect |
| --- | --- | --- | --- |
| ERP Core → Finance | `deleteFinanceCompanyForErpOrganization` (single and batch deletion) | Data modification | Finance cleanup hook is disabled; existing DB constraints may block organization deletion. |
| ERP Core → Finance | `activateFinanceCompanyForErpOrganization` | Data modification | Activation no longer provisions missing Finance data. |
| ERP Core → Finance | `deactivateFinanceCompanyForErpOrganization` | Data modification hook | Hook disabled; its previous implementation was already a no-op because Finance derives status from the organization. |
| Inventory → Finance | `processInventoryMovement` | Data modification | Stock movements remain operational; financial activities are left unprocessed instead of marked posted. |
| Finance → Inventory | `getOperationalInventoryItems` | Data retrieval | Operational item lookup returns an empty collection. |
| Finance → Inventory | `listInventoryItems` (posting-profile usage lookup) | Data retrieval | Fails explicitly when local assignments exist, blocking unsafe deletion while SKU usage enrichment is unavailable. |
| Finance → Inventory | `listInventoryItems` (posting-profile assignments) | Data retrieval | Assignment UI reports Inventory unavailable; assignment mutations remain blocked. |
| Finance → Inventory | `listInventoryFinancialActivity` (availability probe only) | Data retrieval/availability | Inventory transactions page explicitly reports migration unavailable. Actual list data remains Finance-owned. |
| Finance → Inventory | `getInventoryStockActivityDetail` (probe and lookup) | Data retrieval | Inventory transaction detail/print entry page explicitly reports migration unavailable. |
| Platform Audit → ERP Core | `listOrganizations` | Data retrieval | Existing audit organization codes remain; missing codes are no longer enriched. |

Implemented now: ERP Core → Finance creation (including batch creation) uses `erp.organization-finance.createFinancialEntity`, with a shared transaction. Organization master data and its Finance extension are read through the new contract runtime.

Same-package Inventory and ERP Core sample-data scripts now import their own services directly. Old command definition files, package exports, module properties and runtime registries were removed. Historical command tests are retained with `.ts.disabled` extensions and TODO markers; no replacement command tests were created.
