# Contract migration status

All integrations previously listed here are now restored or retired. Cross-package calls use semantic contracts rather than direct provider imports. Historical command tests remain disabled as originally requested.

Implemented now: ERP Core → Finance creation (including batch creation) uses `erp.organization-finance.createFinancialEntity`, with a shared transaction. Organization master data and its Finance extension are read through the new contract runtime.

Audit organization enrichment and filter options now use the optional platform-owned `platform.organization-directory.list` capability, implemented by ERP Core. Audit no longer calls ERP's HTTP endpoint or imports ERP code. Without a provider (or for deleted organizations), recorded IDs remain available; no historical labels are fabricated. Provider errors still propagate.

Inventory → Finance movement handoff now uses `erp.inventory-finance.processInventoryMovement`, defined by ERP Core and implemented lazily by Finance. Inventory uses `capabilities.optional`: without a provider, stock operations continue and activities remain available. A successful validated response marks the Inventory activity processed (handed off), even if Finance reports `RECEIVED` while waiting for a matched document. Processing and validation errors roll back the enclosing stock transaction.

Resolved without a contract: organization deletion (single and batch) now cascades through Finance's `finance_organization.organization_id` foreign key and the Finance-owned child relationships. The old `deleteFinanceCompanyForErpOrganization` hook is no longer required. Fresh-install SQL and the existing-schema cascade attachment both declare this behavior. Audit history is retained independently.

Same-package Inventory and ERP Core sample-data scripts now import their own services directly. Old command definition files, package exports, module properties and runtime registries were removed. Historical command tests are retained with `.ts.disabled` extensions and TODO markers; no replacement command tests were created.

Finance → Inventory retrieval now uses ERP Core-owned `erp.inventory-catalog` (`listItems`, `getOperationalItems`) and `erp.inventory-activity` (`getStockActivityDetail`), implemented lazily by Inventory. These restore assignment item lists, profile usage enrichment, operational item lookup, and transaction detail/print. The transactions list checks for the activity implementor without fetching Inventory's activity list; its rows remain Finance-owned. Missing providers retain unavailable/empty behaviour; profile usage checks fail closed when assignments cannot be resolved. Provider and validation errors propagate.

The obsolete Finance activation/deactivation hooks are retired: ERP Core owns organization status and Finance derives availability from it. Financial-entity creation/provisioning is separate and already implemented.
