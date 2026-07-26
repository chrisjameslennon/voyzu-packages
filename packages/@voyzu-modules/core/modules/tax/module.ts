import { handleGetTaxAuthority, handleListTaxAuthorities } from "@voyzu-modules/core/tax/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const taxModule = {
  id: "voyzu.tax",
  name: "Tax",
  apiDefinitions: {
    authoritiesList: {
      method: "GET",
      path: "/organization/tax/authorities",
      handler: (request: any) => handleListTaxAuthorities(request),
      apiDoc: {
        summary: "Authorities List",
        description: "Authorities List Tax.",
        tags: ["Tax"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("TaxAuthorityResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    authoritiesGet: {
      method: "GET",
      path: "/organization/tax/authorities/[code]",
      handler: (request: any, context: any) => handleGetTaxAuthority(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Authorities Get",
        description: "Authorities Get Tax.",
        tags: ["Tax"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("TaxAuthorityResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
