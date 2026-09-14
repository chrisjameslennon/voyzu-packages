export const pageRoutes = {
  "voyzu.template.page.list": {

    httpApiDocumentationGroupId: "template.template",
     path: "/template", loadPage: () => import("./server/pages/TemplatesListPage").then((module) => module.TemplatesListPage),
    pageTitle: "Template", helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [], auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.template.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "template.template",
     path: "/template/[code]", loadPage: () => import("./server/pages/TemplateDetailPage").then((module) => module.TemplateDetailPage),
    pageTitle: "Template", helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [{ label: "Template", href: "/template" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
