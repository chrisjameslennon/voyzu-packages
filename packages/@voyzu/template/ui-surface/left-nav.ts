import type { UiSurfaceMenuGroup } from "@voyzu/types/ui-surface";

export default [
  {
    "items": {
      "template.menu1.template": {
        "label": "Template",
        "icon": "description",
        "routeId": "voyzu.template.page.list"
      }
    }
  },
  {
    "label": "Reports",
    "items": {
      "template.menu2.template-report": {
        "label": "Template Report",
        "icon": "summarize",
        "routeId": "voyzu.template.reports.page.all"
      }
    }
  }
] as const satisfies readonly UiSurfaceMenuGroup[];
