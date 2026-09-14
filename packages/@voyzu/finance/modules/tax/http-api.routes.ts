import Type from "typebox";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { TaxAuthorityResponseDto } from "./types/tax.response.dto";



export const httpApiRoutes = {
  "finance.tax.authoritiesList": {
    description: "Authorities List Tax.",
    method: "GET",
    path: "/finance/tax/authorities",
    loadHandler: () => import("./server/http-api/tax.http.handlers").then((module) => module.handleListTaxAuthorities),
    summary: "Authorities List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(TaxAuthorityResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.tax.authoritiesGet": {
    description: "Authorities Get Tax.",
    method: "GET",
    path: "/finance/tax/authorities/[code]",
    loadHandler: () => import("./server/http-api/tax.http.handlers").then((module) => module.handleGetTaxAuthority),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Authorities Get",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: TaxAuthorityResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
