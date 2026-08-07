import { handleGetArEntry, handleListArEntries } from "@voyzu/core/ar-subledger-ledger-entries/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import {
  ArLedgerEntriesListPage,
  ArLedgerEntryDetailPage,
} from "@voyzu/core/ar-subledger-ledger-entries/server";

export const arSubledgerLedgerEntriesModule = {
  pageRoutes: {
    list: {
          id: "voyzu.ar-subledger-ledger-entries.page.list",
          pageTitle: "AR Ledger Entries",
          helpPath: "modules-help/company-ledger/ar-ledger-entries",
          path: "/finance/subledgers/ar/ledger-entries",
          Page: ArLedgerEntriesListPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ar/ledger-entries" },
                { label: "AR Subledger", href: "/finance/subledgers/ar/ledger-entries" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.ar-subledger-ledger-entries.page.detail",
          pageTitle: "AR Ledger Entry",
          helpPath: "modules-help/company-ledger/ar-ledger-entries",
          path: "/finance/subledgers/ar/ledger-entries/[code]",
          Page: ArLedgerEntryDetailPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ar/ledger-entries" },
                { label: "AR Ledger Entries", href: "/finance/subledgers/ar/ledger-entries" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detailDocumentPrintable: {
          id: "voyzu.ar-subledger-ledger-entries.page.detail.documentPrintable",
          pageTitle: "AR Ledger Entry",
          path: "/finance/subledgers/ar/ledger-entries/[code]/document-printable",
          Page: ArLedgerEntryDetailPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/ar-subledger/entries",
      handler: (request: any) => handleListArEntries(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List AR Subledger Ledger Entries.",
        tags: ["AR Subledger Ledger Entries"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("ArSubledgerEntryResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/ar-subledger/entries/[code]",
      handler: (request: any, context: any) => handleGetArEntry(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get AR Subledger Ledger Entries.",
        tags: ["AR Subledger Ledger Entries"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("ArSubledgerEntryResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const satisfies VoyzuPackageModuleDefinition;
