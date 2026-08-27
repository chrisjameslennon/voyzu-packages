const loadPage = () => import("./server/pages/AllTemplatesReportPage").then((module) => module.AllTemplatesReportPage);

export const pageRoutes = {
  all: {
    id: "voyzu.template.reports.page.all", path: "/template/reports/all", loadPage,
    pageTitle: "Template Report", helpPath: "voyzu-platform-patterns/pdf-generation",
    breadcrumbBase: [{ label: "Template", href: "/template" }, { label: "Reports" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  allPrintable: {
    id: "voyzu.template.reports.page.all.printable", path: "/template/reports/all/printable", loadPage,
    pageTitle: "Template Report", helpPath: "voyzu-platform-patterns/pdf-generation", unframed: true,
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
