import { handleGetArEntry, handleListArEntries } from "@voyzu-modules/all-modules/ar-subledger-ledger-entries/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const arSubledgerLedgerEntriesModule = {
  id: "voyzu.ar-subledger-ledger-entries",
  name: "AR Ledger Entries",
  pageRoutes: {
    list: {
      id: "voyzu.ar-subledger-ledger-entries.page.list",
      pageTitle: "AR Ledger Entries",
      helpUrl: "modules-help/company-ledger/ar-ledger-entries",
    },
    detail: {
      id: "voyzu.ar-subledger-ledger-entries.page.detail",
      pageTitle: "AR Ledger Entry",
      helpUrl: "modules-help/company-ledger/ar-ledger-entries",
    },
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
} as const;
