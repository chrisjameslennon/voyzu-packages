import { handleFinanceCount, handleFinanceExportAll, handleFinanceGetById, handleFinanceList } from "@voyzu-modules/core/company-audit/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const companyAuditModule = {
  pageRoutes: {
    list: {
      id: "voyzu.company-audit.page.list",
      pageTitle: "Audit Log",
      helpUrl: "modules-help/company-ledger/audit-log",
    },
    detail: {
      id: "voyzu.company-audit.page.detail",
      pageTitle: "Audit Event",
      helpUrl: "modules-help/company-ledger/audit-log",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/audit",
      handler: (request: any) => handleFinanceList(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company Audit.",
        tags: ["Company Audit"],
        responses: { "200": { description: "Audit events matching the supplied filters.", schema: dtoRef("AuditEventListResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    count: {
      method: "GET",
      path: "/finance/[companyCode]/audit/count",
      handler: (request: any) => handleFinanceCount(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Count",
        description: "Count Company Audit.",
        tags: ["Company Audit"],
        responses: { "200": { description: "The number of matching audit events.", schema: dtoRef("CompanyAuditCountResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    export: {
      method: "GET",
      path: "/finance/[companyCode]/audit/export",
      handler: (request: any) => handleFinanceExportAll(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Export",
        description: "Export Company Audit.",
        tags: ["Company Audit"],
        responses: { "200": { description: "Audit events exported for the selected filters.", schema: arrayOf(dtoRef("AuditEventResponseDto")) }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/audit/[id]",
      handler: (request: any, context: any) => handleFinanceGetById(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Company Audit.",
        tags: ["Company Audit"],
        responses: {
          "200": { description: "The requested audit event.", schema: dtoRef("AuditEventResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
