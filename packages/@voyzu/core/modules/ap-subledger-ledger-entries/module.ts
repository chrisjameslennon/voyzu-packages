import { handleGetApEntry, handleListApEntries } from "@voyzu/core/ap-subledger-ledger-entries/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { ApLedgerEntriesListPage, ApLedgerEntryDetailPage } from "@voyzu/core/ap-subledger-ledger-entries/server";

export const apSubledgerLedgerEntriesModule = {
  pageRoutes: {
    list: {
          id: "voyzu.ap-subledger-ledger-entries.page.list",
          pageTitle: "AP Ledger Entries",
          helpPath: "modules-help/company-ledger/ap-ledger-entries",
          path: "/finance/subledgers/ap/ledger-entries",
          Page: ApLedgerEntriesListPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ap/ledger-entries" },
                { label: "AP Subledger", href: "/finance/subledgers/ap/ledger-entries" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.ap-subledger-ledger-entries.page.detail",
          pageTitle: "AP Ledger Entry",
          helpPath: "modules-help/company-ledger/ap-ledger-entries",
          path: "/finance/subledgers/ap/ledger-entries/[code]",
          Page: ApLedgerEntryDetailPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ap/ledger-entries" },
                { label: "AP Ledger Entries", href: "/finance/subledgers/ap/ledger-entries" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detailDocumentPrintable: {
          id: "voyzu.ap-subledger-ledger-entries.page.detail.documentPrintable",
          pageTitle: "AP Ledger Entry",
          path: "/finance/subledgers/ap/ledger-entries/[code]/document-printable",
          Page: ApLedgerEntryDetailPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/ap-subledger/entries",
      handler: (request: any) => handleListApEntries(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List AP Subledger Ledger Entries.",
        tags: ["AP Subledger Ledger Entries"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("ApSubledgerEntryResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/ap-subledger/entries/[code]",
      handler: (request: any, context: any) => handleGetApEntry(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get AP Subledger Ledger Entries.",
        tags: ["AP Subledger Ledger Entries"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("ApSubledgerEntryResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const satisfies VoyzuPackageModuleDefinition;
