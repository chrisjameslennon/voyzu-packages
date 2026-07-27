import { arrayOf, dtoRef } from "@voyzu/types/api";
import {
  handleCount,
  handleExportAll,
  handleGetById,
  handleList,
} from "./server";

export const iceCreamAuditModule = {
  id: "voyzu-packages.ice-creams.audit",
  name: "Ice Cream Audit",
  pageRoutes: {
    list: {
      id: "voyzu-packages.ice-creams.audit.page.list",
      pageTitle: "Ice Cream Audit Log",
      helpUrl: "packages/ice-creams/audit",
    },
    detail: {
      id: "voyzu-packages.ice-creams.audit.page.detail",
      pageTitle: "Ice Cream Audit Event",
      helpUrl: "packages/ice-creams/audit",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/ice-creams/audit",
      handler: (request: any) => handleList(request),
      apiDoc: {
        summary: "List",
        description: "Lists audit events for the Ice Creams package.",
        tags: ["Ice Cream Audit"],
        responses: {
          "200": { description: "Matching audit events.", schema: dtoRef("AuditEventListResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    count: {
      method: "GET",
      path: "/ice-creams/audit/count",
      handler: (request: any) => handleCount(request),
      apiDoc: {
        summary: "Count",
        description: "Counts matching audit events.",
        tags: ["Ice Cream Audit"],
        responses: {
          "200": { description: "Matching event count.", schema: dtoRef("OrganizationAuditCountResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    export: {
      method: "GET",
      path: "/ice-creams/audit/export",
      handler: (request: any) => handleExportAll(request),
      apiDoc: {
        summary: "Export",
        description: "Exports matching audit events.",
        tags: ["Ice Cream Audit"],
        responses: {
          "200": { description: "Exported audit events.", schema: arrayOf(dtoRef("AuditEventResponseDto")) },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    get: {
      method: "GET",
      path: "/ice-creams/audit/[id]",
      handler: (request: any, context: any) => handleGetById(request, context),
      apiDoc: {
        summary: "Get",
        description: "Gets one ice-cream audit event.",
        tags: ["Ice Cream Audit"],
        requestPathParams: {
          id: { description: "Audit event identifier.", schema: { type: "string" } },
        },
        responses: {
          "200": { description: "The audit event.", schema: dtoRef("AuditEventResponseDto") },
          "404": { description: "Audit event not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
  },
} as const;

export default iceCreamAuditModule;
