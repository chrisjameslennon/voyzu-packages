# Package decoupling audit

Date: 2026-09-08

## Conclusion

The Voyzu packages are **not 100% decoupled code-wise**. Removing the command system did not remove existing direct package imports, shared DTO dependencies, or package-specific HTTP dependencies.

## Scope

The scan covered 1,201 active TypeScript and JavaScript source files beneath `packages/@voyzu`, including scripts and active tests. It examined literal imports, re-exports, dynamic imports and CommonJS references, including relative paths between packages.

Generated `.run` output, dependencies, and disabled legacy tests (`.ts.disabled`) were excluded. Counts are import references, not unique files or individual imported symbols. This was a source-level audit, not a runtime bundle trace or an exhaustive assessment of database and HTTP coupling.

Shared platform libraries such as `@voyzu/capability`, `@voyzu/types`, and the UI libraries were excluded from cross-package counts. Pre-installed application packages such as Audit, Auth and Localization are listed separately below.

## Business-package dependencies

| Dependency | Import references | Purpose |
| --- | ---: | --- |
| Finance → ERP Core | 57 | Organization services, selection helpers, DTOs and schemas; includes a sample-data script |
| Inventory → ERP Core | 5 | Organization selection and types |
| Commercial → ERP Core | 3 | Organization-selection types |
| ERP Core → Finance | 1 | Explicit integration-test manifest import |

Type-only imports do not load runtime code, but still create compile-time coupling. The integration-test reference is test-only and should be distinguished from production dependencies.

### Concrete examples

- [Finance company service](packages/@voyzu/finance/modules/organization-finance/server/lib/finance-company.service.ts): directly imports ERP Core's organization-selection service and organization type.
- [Balance sheet report page](packages/@voyzu/finance/modules/company-reports/balance-sheet/server/pages/BalanceSheetReportPage.tsx): directly imports `listOrganizations`, the selected-organization cookie constant and ID parsing helper from ERP Core. Similar dependencies occur across Finance report pages.
- [Inventory organization context](packages/@voyzu/inventory/modules/common/server/organization-context.ts): directly imports ERP Core's selection service and cookie helpers.
- [Finance sample-data script](packages/@voyzu/finance/scripts/sample-data/sample-100-companies.ts): directly imports ERP Core's `createOrganization` function.
- [Commercial organization switcher](packages/@voyzu/commercial/modules/shared/client/CommercialOrganizationSwitcher.tsx): imports three ERP Core types and directly calls `/api/organization-selection` for retrieval and selection updates. The endpoint coupling is additional to the import counts.
- [Organization/Finance integration test](packages/@voyzu/erp-core/tests/contracts/organization-finance.integration.test.ts): imports Finance's `voyzu.package.ts` by relative path to register the provider for the test.

Finance's `package.json` also declares ERP Core and Inventory peer dependencies. A dependency declaration is separate from evidence of an active code import; no active Finance → Inventory import was found by this scan.

## Dependencies on pre-installed application packages

| Dependency | Import references |
| --- | ---: |
| ERP Core → Audit | 2 |
| ERP Core → Auth | 4 |
| ERP Core → Localization | 3 |
| Finance → Audit | 4 |
| Finance → Auth | 1 |
| Ice Creams → Audit | 2 |
| Inventory → Audit | 8 |
| Template → Audit | 2 |
| **Total** | **26** |

These include audit UI components and stamp helpers, user/access services, and country/currency services. They are package dependencies even though the providers ship with the platform.

## Implications

- Migrating cross-package commands to semantic contracts is only part of decoupling: existing direct service imports remain.
- Runtime services, runtime DTO schemas, type-only imports, HTTP dependencies and test-only imports need separate treatment when deciding the intended boundary.
- The earlier [contract migration TODO report](CONTRACT-MIGRATION-TODOS.md) covers deliberately disabled command integrations; it is not a complete inventory of all cross-package coupling.

No implementation changes were made as part of the original audit.

## Follow-up: country master data

ERP Core's country report now uses `masterData.list("platform.country")` instead of
importing `listCountries` from Localization. This removes one of the three original
ERP Core -> Localization references; the remaining two are currency imports.
The original counts above are retained as the audit snapshot (26 pre-installed
package references originally; 25 after this change).

Platform defines the base country contract, Localization implements it, ERP Core
defines the Finance extension and named `erp.country` composition, and Finance
implements the extension. These registrations use contract names, not cross-package
code imports. Existing country and tax-settings DTO shapes are unchanged.

## Follow-up: Audit decoupling

The 18 original business-package Audit import references have been removed, along
with their Audit peer dependencies. Stamp/enrichment helpers are now imported from
`@voyzu/capability/audit`. Panels resolve `audit.panel` through platform client-component
composition, with props owned by the platform UI contract. Localization uses the same
interfaces. Audit history remains internal to the Audit package.

Audit no longer imports Auth types/services or calls `/api/users/me`. Platform helpers
consume `platform.identity`, implemented by Auth. The page frame supplies the client
access context; server audit routes still enforce authorization. The organization
integration test explicitly bootstraps platform/Auth contracts as test infrastructure.

After country and Audit decoupling, seven of the original pre-installed-package import
references remain: ERP Core -> Auth (4), Finance -> Auth (1), ERP Core -> Localization
currencies (2). The earlier business-package dependencies are otherwise unchanged.

## Follow-up: currency master data

ERP Core's currency report and organization detail page now use
`masterData.list("platform.currency")`. Platform defines the currency contract and
Localization supplies `get` and `list`, preserving the existing DTO and list behaviour.
This removes the two remaining Localization imports from business-package source.

Five of the original pre-installed-package import references remain: ERP Core -> Auth
(4) and Finance -> Auth (1). This is code-import decoupling only: for example, the
organization detail page still directly queries the country table for active-country
options. Database ownership/dependencies were not included in the original audit.

## Follow-up: ERP Core identity/access

All four direct ERP Core -> Auth imports and its Auth peer dependency have been
removed. Platform user master data replaces user get/list calls. Current identity and
`users.manage` permission replace the Auth service imports; platform identity types
replace the Auth DTO import. API/service admin checks, UI-access checks and ERP-owned
organization assignments are preserved. The test-only Auth bootstrap remains explicit.

Only one of the original pre-installed-package import references remains:
Finance -> Auth (`UserRepo`). Business-package coupling to ERP Core is unchanged.

## Follow-up: Finance audit actors

Finance's final `UserRepo` import and Auth peer dependency have been removed. GL-account
enrichment now uses platform `withAuditActors`, which resolves actor identities through
`platform.identity.lookup`. The duplicate local lookup implementation was removed;
the returned audit metadata shape is unchanged.

All 26 original pre-installed-package code-import references are now resolved.
Remaining business-package imports are Finance -> ERP Core (57), Inventory -> ERP Core
(5), and Commercial -> ERP Core (3). Explicit integration-test bootstrapping and
HTTP/navigation/database dependencies remain separate from these production imports.

## Follow-up: organization consumers and switcher

The remaining application-code imports from ERP Core have been removed:

| Consumer | Provider | Remaining direct imports |
| --- | --- | ---: |
| Finance sample data | ERP Core | 1 |
| ERP Core integration test | Finance | 1 |

Finance's `scripts/sample-data/sample-100-companies.ts` import is intentionally
unchanged for the next sample-data work. Disabled legacy command tests and the
explicit platform/Auth integration-test bootstrap are also unchanged.

- Organization reads use `masterData.list("erp.organization")`; type-only consumers
  use the platform `MasterDataValue<"erp.organization">` contract type.
- ERP implements `erp.organization-context`: requested selection, selectable
  organizations, resolved current organization, and validated selection. Cookie
  names/options/parsing remain private to ERP. Selection writes require a route
  handler/server action; they are not master-data writes.
- ERP owns `erp.organization-switcher`, registered through client-component
  composition and rendered using the existing platform `ContextSwitcher`.
  Finance, Inventory and Commercial consume its identity, not its implementation.
  Finance supplies its own filtered selection endpoint; its finance-enabled filter
  and each package's navigation destination remain local.
- Finance owns its HTTP/report response schemas. These preserve the existing wire
  shape without importing ERP DTO implementations. ERP still owns organization
  master data; this is not a second master-data definition.

Inventory and Commercial no longer declare an ERP code peer dependency. Their
installation dependencies remain, because they require ERP-provided contracts/UI.
Finance retains its peer dependency while the sample-data import exists.
This completes application-code import decoupling, not HTTP, installation or
database decoupling.


## Follow-up: final semantic contract APIs

The runtime now uses `semanticData.get/getOptional/query/queryOptional` and the
new manifest sections. Earlier API names in this document are historical snapshots.
The five retrieval capabilities are migrated as recorded in
[Semantic Data Contract migration](SEMANTIC-DATA-MIGRATION-TODO.md).
Production consumers still import the platform contract API, not provider packages.
