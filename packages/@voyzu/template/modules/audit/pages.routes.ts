import { TemplateAuditEventDetailPage, TemplateAuditEventsPage } from "./server/pages/TemplateAuditPages";

export const pageRoutes = {
  list: {
    id: "voyzu.template.audit.page.list", path: "/template/audit", Page: TemplateAuditEventsPage,
    pageTitle: "Template Audit Log", helpPath: "voyzu-platform-patterns/auditing-patterns",
    breadcrumbBase: [{ label: "Template", href: "/template" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" },
  },
  detail: {
    id: "voyzu.template.audit.page.detail", path: "/template/audit/[id]", Page: TemplateAuditEventDetailPage,
    pageTitle: "Template Audit Event", helpPath: "voyzu-platform-patterns/auditing-patterns",
    breadcrumbBase: [{ label: "Template", href: "/template" }, { label: "Audit Log", href: "/template/audit" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" },
  },
} as const;
