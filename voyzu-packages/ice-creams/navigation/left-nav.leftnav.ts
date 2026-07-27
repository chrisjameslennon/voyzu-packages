import { iceCreamsModule } from "../module";

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
    label: "Reports",
    items: [
      {
        label: "All Ice Creams",
        icon: "summarize",
        routeId: iceCreamsModule.pageRoutes.reportAll.id,
      },
    ],
  },
  {
    label: "Audit",
    items: [
      {
        label: "Audit Log",
        icon: "history",
        routeId: iceCreamsModule.pageRoutes.auditList.id,
      },
    ],
  },
] as const;

export default iceCreamsLeftNav;
