import type { UiSurfaceMenuGroup } from "@voyzu/types/ui-surface";

export default [
  {
    "label": "Properties",
    "items": {
      "cms.define-properties": {
        "label": "Define Properties",
        "icon": "tune",
        "path": "/website/define-properties"
      },
      "cms.property-groups": {
        "label": "Property Groups",
        "icon": "folder",
        "path": "/website/property-groups"
      },
      "cms.properties": {
        "label": "Properties",
        "icon": "list_alt",
        "path": "/website/properties"
      }
    }
  },
  {
    "label": "Fragments",
    "items": {
      "cms.fragments": {
        "label": "Fragments",
        "icon": "extension",
        "path": "/website/fragments"
      }
    }
  },
  {
    "label": "Collections",
    "items": {
      "cms.define-collections": {
        "label": "Define Collections",
        "icon": "schema",
        "path": "/website/define-collections"
      },
      "cms.collections": {
        "label": "Collections",
        "icon": "collections_bookmark",
        "path": "/website/collections"
      },
      "cms.views": {
        "label": "Views",
        "icon": "view_list",
        "path": "/website/views"
      }
    }
  },
  {
    "label": "Pages",
    "items": {
      "cms.define-pages": {
        "label": "Define Pages",
        "icon": "dashboard_customize",
        "path": "/website/define-pages"
      },
      "cms.pages": {
        "label": "Pages",
        "icon": "web",
        "path": "/website/pages"
      }
    }
  },
  {
    "label": "Settings",
    "items": {
      "cms.settings": {
        "label": "Settings",
        "icon": "settings",
        "path": "/website/settings"
      }
    }
  },
  {
    "label": "Reports",
    "items": {}
  }
] as const satisfies readonly UiSurfaceMenuGroup[];
