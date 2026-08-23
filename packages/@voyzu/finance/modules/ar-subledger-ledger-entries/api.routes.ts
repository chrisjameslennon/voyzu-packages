import Type from "typebox";
import { handleGetArEntry, handleListArEntries } from "@voyzu/finance/ar-subledger-ledger-entries/server";
import {
  ArLedgerEntriesListPage,
  ArLedgerEntryDetailPage,
} from "@voyzu/finance/ar-subledger-ledger-entries/server";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ArSubledgerEntryResponseDto } from "../../types/modules/ar-subledger/ar-subledger-entry.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/ar-subledger/entries",
    handler: (request: any) => handleListArEntries(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List AR Subledger Ledger Entries.",
    tags: ["AR Subledger Ledger Entries"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ArSubledgerEntryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/ar-subledger/entries/[code]",
    handler: (request: any, context: any) => handleGetArEntry(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get AR Subledger Ledger Entries.",
    tags: ["AR Subledger Ledger Entries"],
    responses: {
      "200": {
        description: "Successful response.",
        body: ArSubledgerEntryResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
