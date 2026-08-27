const apiDocsUrl = "/api-reference/@voyzu-ice-creams/ice-cream-reports";
const loadPage = () => import("./server/pages/AllIceCreamsReportPage").then((module) => module.AllIceCreamsReportPage);

export const pageRoutes = {
  all: {
    id: "voyzu.ice-creams.reports.page.all",
    path: "/ice-creams/reports/all",
    loadPage,
    pageTitle: "All Ice Creams",
    helpPath: "voyzu-platform-patterns/pdf-generation",
    breadcrumbBase: [
      { label: "Ice Creams" },
      { label: "Reports" },
    ],
    apiDocsUrl,
    auth: { required: true, minRole: "STANDARD" },
  },
  allPrintable: {
    id: "voyzu.ice-creams.reports.page.all.printable",
    path: "/ice-creams/reports/all/printable",
    loadPage,
    pageTitle: "All Ice Creams",
    helpPath: "voyzu-platform-patterns/pdf-generation",
    unframed: true,
    apiDocsUrl,
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
