import Type from "typebox";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { TaxSubledgerEntryResponseDto } from "../../types/modules/tax-ledger/index";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/tax-ledger/entries",
    loadHandler: () => import("./server/api/tax-ledger.http.handlers").then((module) => module.handleListTaxEntries),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Tax Ledger.",
    tags: ["Tax Ledger"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(TaxSubledgerEntryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/tax-ledger/entries/[code]",
    loadHandler: () => import("./server/api/tax-ledger.http.handlers").then((module) => module.handleGetTaxEntry),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Tax Ledger.",
    tags: ["Tax Ledger"],
    responses: {
      "200": {
        description: "Successful response.",
        body: TaxSubledgerEntryResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
