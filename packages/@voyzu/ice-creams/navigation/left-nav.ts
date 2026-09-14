export const iceCreamsLeftNav = [
  {
    items: [
      {
        label: "Ice Creams",
        icon: "icecream",
        routeId: "voyzu.ice-creams.page.list",
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "All Ice Creams",
        icon: "summarize",
        routeId: "voyzu.ice-creams.reports.page.all",
      },
    ],
  },
] as const;

export default iceCreamsLeftNav;
