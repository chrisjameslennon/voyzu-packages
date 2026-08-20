import { TemplateDetailPage } from "./server/pages/TemplateDetailPage";
import { TemplatesListPage } from "./server/pages/TemplatesListPage";

export const pageRoutes = {
  list: {
    id: "voyzu.template.page.list", path: "/template", Page: TemplatesListPage,
    pageTitle: "Template", helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [], auth: { required: true, minRole: "ORGANIZATION_USER" },
  },
  detail: {
    id: "voyzu.template.page.detail", path: "/template/[code]", Page: TemplateDetailPage,
    pageTitle: "Template", helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [{ label: "Template", href: "/template" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" },
  },
} as const;
