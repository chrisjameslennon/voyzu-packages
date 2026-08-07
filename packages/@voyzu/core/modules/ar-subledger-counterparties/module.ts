import { handleGetArCounterparty, handleListArCounterparties } from "@voyzu/core/ar-subledger-counterparties/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { ArCounterpartiesListPage, ArCounterpartyDetailPage } from "@voyzu/core/ar-subledger-counterparties/server";

export const arSubledgerCounterpartiesModule = {
  pageRoutes: {
    list: {
          id: "voyzu.ar-subledger-counterparties.page.list",
          pageTitle: "AR Counterparties",
          helpPath: "modules-help/company-ledger/ar-counterparties",
          path: "/finance/subledgers/ar/counterparties",
          Page: ArCounterpartiesListPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Subledgers" },
                { label: "AR Subledger" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.ar-subledger-counterparties.page.detail",
          pageTitle: "AR Counterparty",
          helpPath: "modules-help/company-ledger/ar-counterparties",
          path: "/finance/subledgers/ar/counterparties/[code]",
          Page: ArCounterpartyDetailPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Subledgers" },
                { label: "AR Counterparties", href: "/finance/subledgers/ar/counterparties" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detailPrintable: {
          id: "voyzu.ar-subledger-counterparties.page.detail.printable",
          pageTitle: "AR Counterparty",
          path: "/finance/subledgers/ar/counterparties/[code]/printable",
          Page: ArCounterpartyDetailPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        }
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
} as const satisfies VoyzuPackageModuleDefinition;
