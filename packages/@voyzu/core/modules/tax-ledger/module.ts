import { handleGetTaxEntry, handleListTaxEntries } from "@voyzu/core/tax-ledger/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { TaxLedgerEntriesListPage, TaxLedgerEntryDetailPage } from "@voyzu/core/tax-ledger/server";

export const taxLedgerModule = {
  pageRoutes: {
    list: {
          id: "voyzu.tax-ledger.page.list",
          pageTitle: "Tax Ledger Entries",
          helpPath: "modules-help/company-ledger/tax-ledger-entries",
          path: "/finance/subledgers/tax/ledger-entries",
          Page: TaxLedgerEntriesListPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Subledgers" },
                { label: "Tax Ledger" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.tax-ledger.page.detail",
          pageTitle: "Tax Ledger Entry",
          helpPath: "modules-help/company-ledger/tax-ledger-entries",
          path: "/finance/subledgers/tax/ledger-entries/[code]",
          Page: TaxLedgerEntryDetailPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Subledgers" },
                { label: "Tax Ledger Entries", href: "/finance/subledgers/tax/ledger-entries" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/tax-ledger/entries",
      handler: (request: any) => handleListTaxEntries(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Tax Ledger.",
        tags: ["Tax Ledger"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("TaxSubledgerEntryResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/tax-ledger/entries/[code]",
      handler: (request: any, context: any) => handleGetTaxEntry(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Tax Ledger.",
        tags: ["Tax Ledger"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("TaxSubledgerEntryResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const satisfies VoyzuPackageModuleDefinition;
