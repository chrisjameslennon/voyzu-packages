import { handleGetInventoryEntry, handleListInventoryEntries } from "@voyzu-modules/core/inventory-ledger/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const inventoryLedgerModule = {
  pageRoutes: {
    list: {
      id: "voyzu.inventory-ledger.page.list",
      pageTitle: "Inventory Ledger Entries",
      helpUrl: "modules-help/company-ledger/inventory-ledger-entries",
    },
    detail: {
      id: "voyzu.inventory-ledger.page.detail",
      pageTitle: "Inventory Ledger Entry",
      helpUrl: "modules-help/company-ledger/inventory-ledger-entries",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/inventory/ledger",
      handler: (request: any) => handleListInventoryEntries(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Inventory Ledger.",
        tags: ["Inventory Ledger"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("InventoryLedgerEntryResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/inventory/ledger/[code]",
      handler: (request: any, context: any) => handleGetInventoryEntry(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Inventory Ledger.",
        tags: ["Inventory Ledger"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("InventoryLedgerEntryDetailResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
