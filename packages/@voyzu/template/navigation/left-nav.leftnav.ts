export const templatesLeftNav = [
  {
    items: [
      {
        label: "Template",
        icon: "description",
        routeId: "voyzu.template.page.list",
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "Template Report",
        icon: "summarize",
        routeId: "voyzu.template.reports.page.all",
      },
    ],
  },
] as const;

export default templatesLeftNav;
