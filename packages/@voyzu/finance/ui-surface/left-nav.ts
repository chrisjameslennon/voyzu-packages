import type { UiSurfaceMenuGroup } from "@voyzu/types/ui-surface";
export default [
  {
    "label": "Accounting Operations",
    "items": {
      "finance.menu1.accounts-receivable": {
        "label": "Accounts Receivable",
        "icon": "receipt_long",
        "children": {
          "finance.menu1.accounts-receivable.invoices": {
            "label": "Invoices",
            "routeId": "voyzu.operations-invoices.page.list"
          },
          "finance.menu1.accounts-receivable.sales-items": {
            "label": "Sales Items",
            "routeId": "voyzu.operations-invoices.page.sales-items"
          },
          "finance.menu1.accounts-receivable.statements": {
            "label": "Statements",
            "routeId": "voyzu.ar-subledger-statements.page.list"
          },
          "finance.menu1.accounts-receivable.counterparties": {
            "label": "Counterparties",
            "routeId": "voyzu.ar-subledger-counterparties.page.list"
          }
        }
      },
      "finance.menu1.accounts-payable": {
        "label": "Accounts Payable",
        "icon": "payments",
        "children": {
          "finance.menu1.accounts-payable.bills": {
            "label": "Bills",
            "routeId": "voyzu.ap-subledger-bills.page.list"
          },
          "finance.menu1.accounts-payable.purchase-items": {
            "label": "Purchase Items",
            "path": "/finance/operations/accounts-payable/purchase-items"
          },
          "finance.menu1.accounts-payable.statements": {
            "label": "Statements",
            "routeId": "voyzu.ap-subledger-statements.page.list"
          },
          "finance.menu1.accounts-payable.counterparties": {
            "label": "Counterparties",
            "routeId": "voyzu.ap-subledger-counterparties.page.list"
          }
        }
      }
    }
  },
  {
    "label": "Integration",
    "items": {
      "finance.menu2.financial-activity": {
        "label": "Financial Activity",
        "icon": "account_balance",
        "path": "/finance/integration/financial-activity"
      }
    }
  }
] as const satisfies readonly UiSurfaceMenuGroup[];
