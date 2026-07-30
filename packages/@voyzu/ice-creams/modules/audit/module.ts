import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import {
  handleCount,
  handleExportAll,
  handleGetById,
  handleList,
} from "./server";
import {
  IceCreamAuditEventDetailPage,
  IceCreamAuditEventsPage,
} from "./server/pages/IceCreamAuditPages";

export const iceCreamAuditModule = {
  id: "voyzu.ice-creams.audit",
  name: "Ice Cream Audit",
  pageRoutes: {
    list: {
      id: "voyzu.ice-creams.audit.page.list",
      path: "/ice-creams/audit",
      Page: IceCreamAuditEventsPage,
      pageTitle: "Ice Cream Audit Log",
      helpUrl: "packages/ice-creams/audit",
      breadcrumbBase: [{ label: "Ice Creams", href: "/ice-creams" }],
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
    detail: {
      id: "voyzu.ice-creams.audit.page.detail",
      path: "/ice-creams/audit/[id]",
      Page: IceCreamAuditEventDetailPage,
      pageTitle: "Ice Cream Audit Event",
      helpUrl: "packages/ice-creams/audit",
      breadcrumbBase: [
        { label: "Ice Creams", href: "/ice-creams" },
        { label: "Audit Log", href: "/ice-creams/audit" },
      ],
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/ice-cream-audit-events",
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
      path: "/ice-cream-audit-event-count",
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
      path: "/ice-cream-audit-exports",
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
      path: "/ice-cream-audit-events/[id]",
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
} as const satisfies VoyzuPackageModuleDefinition;

export default iceCreamAuditModule;
