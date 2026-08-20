import { FinanceAuditEventsPage, FinanceAuditEventDetailPage } from "./server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-audit.page.list",
    pageTitle: "Audit Log",
    helpPath: "modules-help/company-ledger/audit-log",
    path: "/finance/audit",
    Page: FinanceAuditEventsPage,
    breadcrumbBase: [
      { label: "Finance" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detail: {
    id: "voyzu.company-audit.page.detail",
    pageTitle: "Audit Event",
    helpPath: "modules-help/company-ledger/audit-log",
    path: "/finance/audit/[id]",
    Page: FinanceAuditEventDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Audit Log", href: "/finance/audit" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
