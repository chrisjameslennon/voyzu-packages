const loadPage = () => import("./server/pages/AllIceCreamsReportPage").then((module) => module.AllIceCreamsReportPage);

export const pageRoutes = {
  "voyzu.ice-creams.reports.page.all": {
    httpApiDocumentationGroupId: "ice-creams.reports",
    path: "/ice-creams/reports/all",
    loadPage,
    pageTitle: "All Ice Creams",
    helpPath: "voyzu-platform-patterns/pdf-generation",
    breadcrumbBase: [
      { label: "Ice Creams" },
      { label: "Reports" },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.ice-creams.reports.page.all.printable": {
    httpApiDocumentationGroupId: "ice-creams.reports",
    path: "/ice-creams/reports/all/printable",
    loadPage,
    pageTitle: "All Ice Creams",
    helpPath: "voyzu-platform-patterns/pdf-generation",
    unframed: true,
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
