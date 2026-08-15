import { templateAuditModule } from "../modules/audit/module";
import { templateModule } from "../modules/template/module";
import { templateReportsModule } from "../modules/reports/module";

export const templatesLeftNav = [
  {
    items: [
      {
        label: "Template",
        icon: "description",
        routeId: templateModule.pageRoutes.list.id,
      },
    ],
  },
  {
    label: "Audit",
    items: [
      {
        label: "Audit Log",
        icon: "history",
        routeId: templateAuditModule.pageRoutes.list.id,
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "Template Report",
        icon: "summarize",
        routeId: templateReportsModule.pageRoutes.all.id,
      },
    ],
  },
] as const;

export default templatesLeftNav;
