import { handleGetApEntry, handleListApEntries } from "@voyzu-modules/core/ap-subledger-ledger-entries/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const apSubledgerLedgerEntriesModule = {
  pageRoutes: {
    list: {
      id: "voyzu.ap-subledger-ledger-entries.page.list",
      pageTitle: "AP Ledger Entries",
      helpUrl: "modules-help/company-ledger/ap-ledger-entries",
    },
    detail: {
      id: "voyzu.ap-subledger-ledger-entries.page.detail",
      pageTitle: "AP Ledger Entry",
      helpUrl: "modules-help/company-ledger/ap-ledger-entries",
    },
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
} as const;
