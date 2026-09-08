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

- [Finance company service](packages/@voyzu/finance/modules/finance-companies/server/lib/finance-company.service.ts): directly imports ERP Core's organization-selection service and organization type.
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

No implementation changes were made as part of this audit.
