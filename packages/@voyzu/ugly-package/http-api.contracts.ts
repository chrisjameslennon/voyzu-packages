import { httpApiRoutes as routes0 } from "./modules/ugly/http-api.routes";

export const httpApiRouting = {
  roots: ["/ugly-package"],
  routes: { ...routes0 },
} as const;

export const httpApiDocumentation = {
  "sections": {
    "ugly-package.operations": {
      "title": "Operations",
      "description": "Operations HTTP operations for @voyzu/ugly-package.",
      "groups": {
        "ugly-package.ugly": {
          "title": "Ugly",
          "description": "Ugly operations.",
          "routes": {
            "ugly-package.ugly.rawRequestResponse": {
              "description": "Returns a demonstration snapshot of the raw Next.js request and response."
            }
          }
        }
      }
    }
  }
} as const;
