import type { UiSurfaceMenuGroup } from "@voyzu/types/ui-surface";

export default [
  {
    "items": {
      "ice-creams.menu1.ice-creams": {
        "label": "Ice Creams",
        "icon": "icecream",
        "routeId": "voyzu.ice-creams.page.list"
      }
    }
  },
  {
    "label": "Reports",
    "items": {
      "ice-creams.menu2.all-ice-creams": {
        "label": "All Ice Creams",
        "icon": "summarize",
        "routeId": "voyzu.ice-creams.reports.page.all"
      }
    }
  }
] as const satisfies readonly UiSurfaceMenuGroup[];
