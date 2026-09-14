import type { VoyzuPackageDefinition } from "@voyzu/types/framework";
import { mergePageRoutes } from "@voyzu/types/page-routing";
import leftMenu from "./ui-surface/left-nav";
import { pageRoutes as pages0 } from "./modules/operations-invoices/pages.routes";
import { pageRoutes as pages1 } from "./modules/ar-subledger-invoices/pages.routes";
import { pageRoutes as pages2 } from "./modules/ap-subledger-bills/pages.routes";
import { pageRoutes as pages3 } from "./modules/ar-subledger-counterparties/pages.routes";
import { pageRoutes as pages4 } from "./modules/ap-subledger-counterparties/pages.routes";
import { pageRoutes as pages5 } from "./modules/ar-subledger-statements/pages.routes";
import { pageRoutes as pages6 } from "./modules/ap-subledger-statements/pages.routes";
import { httpApiRoutes as api0 } from "./modules/ar-subledger-counterparties/http-api.routes";
import { httpApiRoutes as api1 } from "./modules/ap-subledger-counterparties/http-api.routes";
import { httpApiRoutes as api2 } from "./modules/ar-subledger-statements/http-api.routes";
import { httpApiRoutes as api3 } from "./modules/ap-subledger-statements/http-api.routes";
import { implementations } from "./internal-api/implementations";
export default {
 contracts: {
  uiSurface: {
   "topnav.menu": { "finance.operations": { label: "Finance", routeId: "voyzu.operations-invoices.page.list" } },
   "leftnav.menu": { "/finance": { content: leftMenu } },
   "leftnav.header": { "/finance": { loadComponent: () => import("./ui-surface/left-nav-header").then(module => module.default) } },
  },
  pageRouting: { roots: { "/finance": { routes: mergePageRoutes(pages0, pages1, pages2, pages3, pages4, pages5, pages6) } } },
  httpApiRouting: { roots: ["/finance"], routes: { ...api0, ...api1, ...api2, ...api3 } },
  httpApiDocumentation: {
  "sections": {
    "finance.accounts-payable": {
      "title": "Accounts Payable",
      "description": "Accounts Payable HTTP operations for @voyzu/finance.",
      "groups": {
        "finance.ap-subledger-counterparties": {
          "title": "Ap Subledger Counterparties",
          "description": "Ap Subledger Counterparties operations.",
          "routes": [
            "finance.ap-subledger-counterparties.list",
            "finance.ap-subledger-counterparties.get"
          ]
        },
        "finance.ap-subledger-statements": {
          "title": "Ap Subledger Statements",
          "description": "Ap Subledger Statements operations.",
          "routes": [
            "finance.ap-subledger-statements.summariesList"
          ]
        }
      }
    },
    "finance.accounts-receivable": {
      "title": "Accounts Receivable",
      "description": "Accounts Receivable HTTP operations for @voyzu/finance.",
      "groups": {
        "finance.ar-subledger-counterparties": {
          "title": "Ar Subledger Counterparties",
          "description": "Ar Subledger Counterparties operations.",
          "routes": [
            "finance.ar-subledger-counterparties.list",
            "finance.ar-subledger-counterparties.get"
          ]
        },
        "finance.ar-subledger-statements": {
          "title": "Ar Subledger Statements",
          "description": "Ar Subledger Statements operations.",
          "routes": [
            "finance.ar-subledger-statements.summariesList"
          ]
        }
      }
    }
  }
},
  internalApi: { implements: implementations },
 },
 install: { sql: ["./install/finance.sql"] },
 uninstall: { sql: ["./uninstall/finance.sql"] },
} as const satisfies VoyzuPackageDefinition;
