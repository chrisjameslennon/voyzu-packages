import Type from "typebox";
import { handleGetArCounterparty, handleListArCounterparties } from "@voyzu/finance/ar-subledger-counterparties/server";
import { ArCounterpartiesListPage, ArCounterpartyDetailPage } from "@voyzu/finance/ar-subledger-counterparties/server";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ArCounterpartyResponseDto } from "../../types/modules/ar-subledger/ar-counterparty.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/ar-subledger/counterparties",
    handler: (request: any) => handleListArCounterparties(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List AR Subledger Counterparties.",
    tags: ["AR Subledger Counterparties"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ArCounterpartyResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/ar-subledger/counterparties/[code]",
    handler: (request: any, context: any) => handleGetArCounterparty(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get AR Subledger Counterparties.",
    tags: ["AR Subledger Counterparties"],
    responses: {
      "200": {
        description: "Successful response.",
        body: ArCounterpartyResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
