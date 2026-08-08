import { iceCreamAuditModule } from "../modules/audit/module";
import { iceCreamsModule } from "../modules/ice-creams/module";
import { iceCreamReportsModule } from "../modules/reports/module";

export const iceCreamsLeftNav = [
  {
    items: [
      {
        label: "Ice Creams",
        icon: "icecream",
        routeId: iceCreamsModule.pageRoutes.list.id,
      },
    ],
  },
  {
    label: "Audit",
    items: [
      {
        label: "Audit Log",
        icon: "history",
        routeId: iceCreamAuditModule.pageRoutes.list.id,
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "All Ice Creams",
        icon: "summarize",
        routeId: iceCreamReportsModule.pageRoutes.all.id,
      },
    ],
  },
] as const;

export default iceCreamsLeftNav;
