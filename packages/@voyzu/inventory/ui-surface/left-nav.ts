import type { UiSurfaceMenuGroup } from "@voyzu/types/ui-surface";

export default [
  {
    "label": "Inventory",
    "items": {
      "inventory.menu1.items": {
        "label": "Items",
        "icon": "box",
        "routeId": "voyzu.inventory.items.page.list"
      },
      "inventory.menu1.item-categories": {
        "label": "Item Categories",
        "icon": "category",
        "routeId": "voyzu.inventory.categories.page.list"
      },
      "inventory.menu1.stock": {
        "label": "Stock",
        "icon": "inventory",
        "routeId": "voyzu.inventory.stock.page.list"
      },
      "inventory.menu1.stock-counts": {
        "label": "Stock Counts",
        "icon": "fact_check",
        "routeId": "voyzu.inventory.stock-counts.page.list"
      },
      "inventory.menu1.stock-activity": {
        "label": "Stock Activity",
        "icon": "history",
        "routeId": "voyzu.inventory.stock-activity.page.list"
      },
      "inventory.menu1.warehouses": {
        "label": "Warehouses",
        "icon": "warehouse",
        "routeId": "voyzu.inventory.warehouses.page.list"
      }
    }
  },
  {
    "label": "Settings",
    "items": {
      "inventory.menu2.custom-fields": {
        "label": "Custom Fields",
        "icon": "dynamic_form",
        "routeId": "voyzu.inventory.custom-fields.page.list"
      },
      "inventory.menu2.custom-field-option-lists": {
        "label": "Custom Field Option Lists",
        "icon": "list_alt",
        "routeId": "voyzu.inventory.option-lists.page.list"
      }
    }
  },
  {
    "label": "Integration",
    "items": {
      "inventory.menu3.financial-activity": {
        "label": "Financial Activity",
        "icon": "account_balance",
        "routeId": "voyzu.inventory.financial-activity.page.list"
      }
    }
  },
  {
    "label": "Reports",
    "items": {
      "inventory.menu4.items": {
        "label": "Items",
        "icon": "box",
        "children": {
          "inventory.menu4.items.items": {
            "label": "Items",
            "routeId": "voyzu.inventory.reports.items"
          },
          "inventory.menu4.items.item-categories": {
            "label": "Item Categories",
            "routeId": "voyzu.inventory.reports.item-categories"
          }
        }
      },
      "inventory.menu4.stock": {
        "label": "Stock",
        "icon": "summarize",
        "children": {
          "inventory.menu4.stock.stock-on-hand": {
            "label": "Stock on Hand",
            "routeId": "voyzu.inventory.reports.stock-on-hand"
          },
          "inventory.menu4.stock.stock-availability": {
            "label": "Stock Availability",
            "routeId": "voyzu.inventory.reports.stock-availability"
          },
          "inventory.menu4.stock.stocktake-variance": {
            "label": "Stocktake Variance",
            "routeId": "voyzu.inventory.reports.stocktake-variance"
          }
        }
      },
      "inventory.menu4.stock-activity": {
        "label": "Stock Activity",
        "icon": "history",
        "children": {
          "inventory.menu4.stock-activity.stock-issuances": {
            "label": "Stock Issuances",
            "routeId": "voyzu.inventory.reports.stock-issuances"
          },
          "inventory.menu4.stock-activity.stock-receipts": {
            "label": "Stock Receipts",
            "routeId": "voyzu.inventory.reports.stock-receipts"
          },
          "inventory.menu4.stock-activity.stock-reservation-activity": {
            "label": "Stock Reservation Activity",
            "routeId": "voyzu.inventory.reports.stock-reservation-activity"
          },
          "inventory.menu4.stock-activity.stock-transfers": {
            "label": "Stock Transfers",
            "routeId": "voyzu.inventory.reports.stock-transfers"
          },
          "inventory.menu4.stock-activity.quantity-adjustments": {
            "label": "Quantity Adjustments",
            "routeId": "voyzu.inventory.reports.quantity-adjustments"
          },
          "inventory.menu4.stock-activity.stock-activity": {
            "label": "Stock Activity",
            "routeId": "voyzu.inventory.reports.stock-activity"
          },
          "inventory.menu4.stock-activity.financial-activity": {
            "label": "Financial Activity",
            "routeId": "voyzu.inventory.reports.financial-activity"
          }
        }
      }
    }
  }
] as const satisfies readonly UiSurfaceMenuGroup[];
