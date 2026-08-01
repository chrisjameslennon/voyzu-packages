import { handleGetInventoryEntry, handleListInventoryEntries } from "@voyzu/core/inventory-ledger/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { InventoryLedgerEntriesListPage, InventoryLedgerEntryDetailPage } from "@voyzu/core/inventory-ledger/server";

export const inventoryLedgerModule = {
  pageRoutes: {
    list: {
          id: "voyzu.inventory-ledger.page.list",
          pageTitle: "Inventory Ledger Entries",
          helpPath: "modules-help/company-ledger/inventory-ledger-entries",
          path: "/finance/inventory/ledger",
          Page: InventoryLedgerEntriesListPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Inventory", href: "/finance/inventory/ledger" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.inventory-ledger.page.detail",
          pageTitle: "Inventory Ledger Entry",
          helpPath: "modules-help/company-ledger/inventory-ledger-entries",
          path: "/finance/inventory/ledger/[code]",
          Page: InventoryLedgerEntryDetailPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Inventory", href: "/finance/inventory/ledger" },
                { label: "Inventory Ledger Entries", href: "/finance/inventory/ledger" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        }
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
} as const satisfies VoyzuPackageModuleDefinition;
