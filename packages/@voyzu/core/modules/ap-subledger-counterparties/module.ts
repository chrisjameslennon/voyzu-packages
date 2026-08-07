import { handleGetApCounterparty, handleListApCounterparties } from "@voyzu/core/ap-subledger-counterparties/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { ApCounterpartiesListPage, ApCounterpartyDetailPage } from "@voyzu/core/ap-subledger-counterparties/server";

export const apSubledgerCounterpartiesModule = {
  pageRoutes: {
    list: {
          id: "voyzu.ap-subledger-counterparties.page.list",
          pageTitle: "AP Counterparties",
          helpPath: "modules-help/company-ledger/ap-counterparties",
          path: "/finance/subledgers/ap/counterparties",
          Page: ApCounterpartiesListPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ap/counterparties" },
                { label: "AP Subledger", href: "/finance/subledgers/ap/counterparties" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.ap-subledger-counterparties.page.detail",
          pageTitle: "AP Counterparty",
          helpPath: "modules-help/company-ledger/ap-counterparties",
          path: "/finance/subledgers/ap/counterparties/[code]",
          Page: ApCounterpartyDetailPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ap/counterparties" },
                { label: "AP Counterparties", href: "/finance/subledgers/ap/counterparties" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detailPrintable: {
          id: "voyzu.ap-subledger-counterparties.page.detail.printable",
          pageTitle: "AP Counterparty",
          path: "/finance/subledgers/ap/counterparties/[code]/printable",
          Page: ApCounterpartyDetailPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/ap-subledger/counterparties",
      handler: (request: any) => handleListApCounterparties(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List AP Subledger Counterparties.",
        tags: ["AP Subledger Counterparties"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("ApCounterpartyResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/ap-subledger/counterparties/[code]",
      handler: (request: any, context: any) => handleGetApCounterparty(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get AP Subledger Counterparties.",
        tags: ["AP Subledger Counterparties"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("ApCounterpartyResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const satisfies VoyzuPackageModuleDefinition;
