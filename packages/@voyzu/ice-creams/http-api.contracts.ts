import { httpApiRoutes as routes0 } from "./modules/ice-creams/http-api.routes";
import { httpApiRoutes as routes1 } from "./modules/reports/http-api.routes";

export const httpApiRouting = {
  roots: ["/ice-creams"],
  routes: { ...routes0, ...routes1 },
} as const;

export const httpApiDocumentation = {
  "sections": {
    "ice-creams.operations": {
      "title": "Operations",
      "description": "Operations HTTP operations for @voyzu/ice-creams.",
      "groups": {
        "ice-creams.ice-creams": {
          "title": "Ice Creams",
          "description": "Ice Creams operations.",
          "routes": {
            "ice-creams.ice-creams.list": {
              "description": "Lists all ice creams."
            },
            "ice-creams.ice-creams.create": {
              "description": "Creates an active ice cream."
            },
            "ice-creams.ice-creams.flavors": {
              "description": "Lists reference flavours available to ice creams."
            },
            "ice-creams.ice-creams.filter": {
              "description": "Filters ice creams using the shared filter contract."
            },
            "ice-creams.ice-creams.search": {
              "description": "Searches code, name, flavour and supplier."
            },
            "ice-creams.ice-creams.batchGet": {
              "description": "Gets ice creams by business code."
            },
            "ice-creams.ice-creams.batchCreate": {
              "description": "Creates ice creams atomically with one audit mutation."
            },
            "ice-creams.ice-creams.batchUpdate": {
              "description": "Fully updates ice creams atomically."
            },
            "ice-creams.ice-creams.batchPatch": {
              "description": "Partially updates ice creams atomically."
            },
            "ice-creams.ice-creams.batchDelete": {
              "description": "Deletes ice creams atomically after stamping deletion audit metadata."
            },
            "ice-creams.ice-creams.batchActivate": {
              "description": "Activates ice creams atomically."
            },
            "ice-creams.ice-creams.batchDeactivate": {
              "description": "Deactivates ice creams atomically."
            },
            "ice-creams.ice-creams.get": {
              "description": "Gets an ice cream by business code."
            },
            "ice-creams.ice-creams.update": {
              "description": "Fully updates the writable fields of an ice cream."
            },
            "ice-creams.ice-creams.patch": {
              "description": "Partially updates the writable fields of an ice cream."
            },
            "ice-creams.ice-creams.delete": {
              "description": "Deletes an ice cream after stamping deletion audit metadata."
            },
            "ice-creams.ice-creams.activate": {
              "description": "Activates an ice cream."
            },
            "ice-creams.ice-creams.deactivate": {
              "description": "Deactivates an ice cream."
            }
          }
        },
        "ice-creams.reports": {
          "title": "Reports",
          "description": "Reports operations.",
          "routes": {
            "ice-creams.reports.all": {
              "description": "Returns every ice cream for reporting."
            }
          }
        }
      }
    }
  }
} as const;
