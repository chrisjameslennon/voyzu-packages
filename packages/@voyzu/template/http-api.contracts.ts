import { httpApiRoutes as routes0 } from "./modules/reports/http-api.routes";
import { httpApiRoutes as routes1 } from "./modules/template/http-api.routes";

export const httpApiRouting = {
  roots: ["/template"],
  routes: { ...routes0, ...routes1 },
} as const;

export const httpApiDocumentation = {
  "sections": {
    "template.operations": {
      "title": "Operations",
      "description": "Operations HTTP operations for @voyzu/template.",
      "groups": {
        "template.reports": {
          "title": "Reports",
          "description": "Reports operations.",
          "routes": {
            "template.reports.all": {
              "description": "Returns every template for reporting."
            }
          }
        },
        "template.template": {
          "title": "Template",
          "description": "Template operations.",
          "routes": {
            "template.template.list": {
              "description": "Lists all template records."
            },
            "template.template.create": {
              "description": "Creates a template record."
            },
            "template.template.filter": {
              "description": "Returns templates matching the supplied filter criteria."
            },
            "template.template.search": {
              "description": "Searches template codes and descriptions."
            },
            "template.template.batchCreate": {
              "description": "Creates multiple templates in one transaction."
            },
            "template.template.batchGet": {
              "description": "Retrieves templates by business code."
            },
            "template.template.batchUpdate": {
              "description": "Fully updates multiple templates in one transaction."
            },
            "template.template.batchPatch": {
              "description": "Partially updates multiple templates in one transaction."
            },
            "template.template.batchDelete": {
              "description": "Deletes template records."
            },
            "template.template.batchActivate": {
              "description": "Activates template records."
            },
            "template.template.batchDeactivate": {
              "description": "Deactivates template records."
            },
            "template.template.get": {
              "description": "Gets a template by code."
            },
            "template.template.update": {
              "description": "Fully updates a template."
            },
            "template.template.patch": {
              "description": "Updates a template description."
            },
            "template.template.delete": {
              "description": "Deletes a template."
            },
            "template.template.activate": {
              "description": "Activates a template."
            },
            "template.template.deactivate": {
              "description": "Deactivates a template."
            }
          }
        }
      }
    }
  }
} as const;
