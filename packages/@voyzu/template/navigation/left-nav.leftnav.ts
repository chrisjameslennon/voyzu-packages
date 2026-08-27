import { pageRoutes as templatePageRoutes } from "../modules/template/pages.routes";
import { pageRoutes as templateReportPageRoutes } from "../modules/reports/pages.routes";

export const templatesLeftNav = [
  {
    items: [
      {
        label: "Template",
        icon: "description",
        routeId: templatePageRoutes.list.id,
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "Template Report",
        icon: "summarize",
        routeId: templateReportPageRoutes.all.id,
      },
    ],
  },
] as const;

export default templatesLeftNav;
