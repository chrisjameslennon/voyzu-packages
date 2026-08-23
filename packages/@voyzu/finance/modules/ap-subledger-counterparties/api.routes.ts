import Type from "typebox";
import { handleGetApCounterparty, handleListApCounterparties } from "@voyzu/finance/ap-subledger-counterparties/server";
import { ApCounterpartiesListPage, ApCounterpartyDetailPage } from "@voyzu/finance/ap-subledger-counterparties/server";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ApCounterpartyResponseDto } from "../../types/modules/ap-subledger/ap-counterparty.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/ap-subledger/counterparties",
    handler: (request: any) => handleListApCounterparties(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List AP Subledger Counterparties.",
    tags: ["AP Subledger Counterparties"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ApCounterpartyResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/ap-subledger/counterparties/[code]",
    handler: (request: any, context: any) => handleGetApCounterparty(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get AP Subledger Counterparties.",
    tags: ["AP Subledger Counterparties"],
    responses: {
      "200": {
        description: "Successful response.",
        body: ApCounterpartyResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
