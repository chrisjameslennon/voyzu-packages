import { pageRoutes as iceCreamPageRoutes } from "../modules/ice-creams/pages.routes";
import { pageRoutes as iceCreamReportPageRoutes } from "../modules/reports/pages.routes";

export const iceCreamsLeftNav = [
  {
    items: [
      {
        label: "Ice Creams",
        icon: "icecream",
        routeId: iceCreamPageRoutes.list.id,
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "All Ice Creams",
        icon: "summarize",
        routeId: iceCreamReportPageRoutes.all.id,
      },
    ],
  },
] as const;

export default iceCreamsLeftNav;
