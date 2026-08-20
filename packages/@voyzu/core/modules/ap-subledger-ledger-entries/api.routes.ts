import Type from "typebox";
import { handleGetApEntry, handleListApEntries } from "@voyzu/core/ap-subledger-ledger-entries/server";
import { ApLedgerEntriesListPage, ApLedgerEntryDetailPage } from "@voyzu/core/ap-subledger-ledger-entries/server";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ApSubledgerEntryResponseDto } from "../../types/modules/ap-subledger/ap-subledger-entry.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/ap-subledger/entries",
    handler: (request: any) => handleListApEntries(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List AP Subledger Ledger Entries.",
    tags: ["AP Subledger Ledger Entries"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ApSubledgerEntryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/ap-subledger/entries/[code]",
    handler: (request: any, context: any) => handleGetApEntry(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get AP Subledger Ledger Entries.",
    tags: ["AP Subledger Ledger Entries"],
    responses: {
      "200": {
        description: "Successful response.",
        body: ApSubledgerEntryResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
