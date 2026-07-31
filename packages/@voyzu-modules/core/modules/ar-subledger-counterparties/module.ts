import { handleGetArCounterparty, handleListArCounterparties } from "@voyzu-modules/core/ar-subledger-counterparties/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const arSubledgerCounterpartiesModule = {
  pageRoutes: {
    list: {
      id: "voyzu.ar-subledger-counterparties.page.list",
      pageTitle: "AR Counterparties",
      helpPath: "modules-help/company-ledger/ar-counterparties",
    },
    detail: {
      id: "voyzu.ar-subledger-counterparties.page.detail",
      pageTitle: "AR Counterparty",
      helpPath: "modules-help/company-ledger/ar-counterparties",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/ar-subledger/counterparties",
      handler: (request: any) => handleListArCounterparties(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List AR Subledger Counterparties.",
        tags: ["AR Subledger Counterparties"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("ArCounterpartyResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/ar-subledger/counterparties/[code]",
      handler: (request: any, context: any) => handleGetArCounterparty(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get AR Subledger Counterparties.",
        tags: ["AR Subledger Counterparties"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("ArCounterpartyResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
