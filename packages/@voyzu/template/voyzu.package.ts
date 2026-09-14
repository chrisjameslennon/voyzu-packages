import leftMenu from "./ui-surface/left-nav";
import { httpApiRoutes as routes0 } from "./modules/reports/http-api.routes";
import { httpApiRoutes as routes1 } from "./modules/template/http-api.routes";
import { mergePageRoutes } from "@voyzu/types/page-routing";
import { pageRoutes as reportsPageRoutes } from "./modules/reports/pages.routes";
import { pageRoutes as templatePageRoutes } from "./modules/template/pages.routes";
import type { VoyzuPackageDefinition } from "@voyzu/types/framework";
import { templateModule } from "./modules/template/module";
import { templateReportsModule } from "./modules/reports/module";
import { install as installSampleData } from "./scripts/sample-data/install";
import { templatesUninstall } from "./uninstall/manifest";

export const templatePackage = {
  contracts: {
    uiSurface: {
      "topnav.menu": {
        "template": {
          "label": "Template",
          "routeId": "voyzu.template.page.list"
        }
      },
      "leftnav.menu": {
        "/template": { content: leftMenu },
      },
    },
    pageRouting: {
      roots: {
        "/template": {
          routes: mergePageRoutes(
            reportsPageRoutes,
            templatePageRoutes,
          ),
        },
      },
    },
    httpApiRouting: {
      roots: ["/template"],
      routes: { ...routes0, ...routes1 },
    },
    httpApiDocumentation: {
      "sections": {
        "template.operations": {
          "title": "Operations",
          "description": "Operations HTTP operations for @voyzu/template.",
          "groups": {
            "template.reports": {
              "title": "Reports",
              "description": "Reports operations.",
              "routes": [
                "template.reports.all"
              ]
            },
            "template.template": {
              "title": "Template",
              "description": "Template operations.",
              "routes": [
                "template.template.list",
                "template.template.create",
                "template.template.filter",
                "template.template.search",
                "template.template.batchCreate",
                "template.template.batchGet",
                "template.template.batchUpdate",
                "template.template.batchPatch",
                "template.template.batchDelete",
                "template.template.batchActivate",
                "template.template.batchDeactivate",
                "template.template.get",
                "template.template.update",
                "template.template.patch",
                "template.template.delete",
                "template.template.activate",
                "template.template.deactivate"
              ]
            }
          }
        }
      }
    },
  },
  modules: [
    templateModule,
    templateReportsModule,
  ],
  install: {
    sql: ["./install/db/sql/template.sql"],
  },
  uninstall: templatesUninstall,
  scripts: {
    sampleData: installSampleData,
  },
} as const satisfies VoyzuPackageDefinition;

export default templatePackage;
