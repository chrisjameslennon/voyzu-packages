import { handleCount as handleAuditCount, handleExportAll as handleAuditExportAll, handleGetById as handleAuditGetById, handleList as handleAuditList } from "@voyzu-modules/all-modules/organization-audit/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationAuditModule = {
  id: "voyzu.organization-audit",
  name: "Audit",
  pageRoutes: {
    list: {
      id: "voyzu.organization-audit.page.list",
      pageTitle: "Audit Log",
      helpUrl: "modules-help/organization-financial-settings/audit-log",
    },
    detail: {
      id: "voyzu.organization-audit.page.detail",
      pageTitle: "Audit Event",
      helpUrl: "modules-help/organization-financial-settings/audit-log",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/audit",
      handler: (request: any) => handleAuditList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization Audit.",
        tags: ["Organization Audit"],
        responses: { "200": { description: "Audit events matching the supplied filters.", schema: dtoRef("AuditEventListResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    count: {
      method: "GET",
      path: "/organization/audit/count",
      handler: (request: any) => handleAuditCount(request),
      apiDoc: {
        summary: "Count",
        description: "Count Organization Audit.",
        tags: ["Organization Audit"],
        responses: { "200": { description: "The number of matching audit events.", schema: dtoRef("OrganizationAuditCountResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    export: {
      method: "GET",
      path: "/organization/audit/export",
      handler: (request: any) => handleAuditExportAll(request),
      apiDoc: {
        summary: "Export",
        description: "Export Organization Audit.",
        tags: ["Organization Audit"],
        responses: { "200": { description: "Audit events exported for the selected filters.", schema: arrayOf(dtoRef("AuditEventResponseDto")) }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    get: {
      method: "GET",
      path: "/organization/audit/[id]",
      handler: (request: any, context: any) => handleAuditGetById(request, context),
      apiDoc: { 
        requestPathParams: { id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Organization Audit.",
        tags: ["Organization Audit"],
        responses: {
          "200": { description: "The requested audit event.", schema: dtoRef("AuditEventResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
