import Type from "typebox";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ArCounterpartyResponseDto } from "../../types/modules/ar-subledger/ar-counterparty.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/ar-subledger/counterparties",
    loadHandler: () => import("./server/api/ar-subledger-counterparty.http.handlers").then((module) => module.handleListArCounterparties),
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
    loadHandler: () => import("./server/api/ar-subledger-counterparty.http.handlers").then((module) => module.handleGetArCounterparty),
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
