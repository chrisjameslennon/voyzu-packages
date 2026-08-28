import Type from "typebox";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ApCounterpartyResponseDto } from "../../types/modules/ap-subledger/ap-counterparty.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/ap-subledger/counterparties",
    loadHandler: () => import("./server/api/ap-subledger-counterparty.http.handlers").then((module) => module.handleListApCounterparties),
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
    loadHandler: () => import("./server/api/ap-subledger-counterparty.http.handlers").then((module) => module.handleGetApCounterparty),
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
