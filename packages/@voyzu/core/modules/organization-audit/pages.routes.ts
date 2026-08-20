import { OrganizationAuditEventDetailPage, OrganizationAuditEventsPage } from "./server";

export const pageRoutes = {
  list: { id: "voyzu.organization-audit.page.list", path: "/organization/audit", Page: OrganizationAuditEventsPage, pageTitle: "Audit Log", helpPath: "modules-help/organization-financial-settings/audit-log", auth: { required: true, minRole: "ADMIN" } },
  detail: { id: "voyzu.organization-audit.page.detail", path: "/organization/audit/[id]", Page: OrganizationAuditEventDetailPage, pageTitle: "Audit Event", helpPath: "modules-help/organization-financial-settings/audit-log", breadcrumbBase: [{ label: "Audit", href: "/organization/audit" }], auth: { required: true, minRole: "ADMIN" } },
} as const;
