export const pageRoutes = {
  list: {
    id: "voyzu.template.page.list", path: "/template", loadPage: () => import("./server/pages/TemplatesListPage").then((module) => module.TemplatesListPage),
    pageTitle: "Template", helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [], auth: { required: true, minRole: "STANDARD" },
  },
  detail: {
    id: "voyzu.template.page.detail", path: "/template/[code]", loadPage: () => import("./server/pages/TemplateDetailPage").then((module) => module.TemplateDetailPage),
    pageTitle: "Template", helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [{ label: "Template", href: "/template" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
