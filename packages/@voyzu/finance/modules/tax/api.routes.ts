import Type from "typebox";
import { handleGetTaxAuthority, handleListTaxAuthorities } from "@voyzu/finance/tax/server";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { TaxAuthorityResponseDto } from "../../types/modules/tax/tax.response.dto";



export const apiDefinitions = {
  authoritiesList: {
    method: "GET",
    path: "/finance/tax/authorities",
    handler: (request: any) => handleListTaxAuthorities(request),
    summary: "Authorities List",
    description: "Authorities List Tax.",
    tags: ["Tax"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(TaxAuthorityResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  authoritiesGet: {
    method: "GET",
    path: "/finance/tax/authorities/[code]",
    handler: (request: any, context: any) => handleGetTaxAuthority(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Authorities Get",
    description: "Authorities Get Tax.",
    tags: ["Tax"],
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
