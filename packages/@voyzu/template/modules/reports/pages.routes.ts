import { AllTemplatesReportPage } from "./server/pages/AllTemplatesReportPage";

export const pageRoutes = {
  all: {
    id: "voyzu.template.reports.page.all", path: "/template/reports/all", Page: AllTemplatesReportPage,
    pageTitle: "Template Report", helpPath: "voyzu-platform-patterns/pdf-generation",
    breadcrumbBase: [{ label: "Template", href: "/template" }, { label: "Reports" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" },
  },
  allPrintable: {
    id: "voyzu.template.reports.page.all.printable", path: "/template/reports/all/printable", Page: AllTemplatesReportPage,
    pageTitle: "Template Report", helpPath: "voyzu-platform-patterns/pdf-generation", unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" },
  },
} as const;
