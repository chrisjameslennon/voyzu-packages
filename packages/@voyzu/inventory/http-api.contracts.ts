import { httpApiRoutes as routes0 } from "./modules/configuration/http-api.routes";
import { httpApiRoutes as routes1 } from "./modules/financial-activity/http-api.routes";
import { httpApiRoutes as routes2 } from "./modules/items/http-api.routes";
import { httpApiRoutes as routes3 } from "./modules/reports/http-api.routes";
import { httpApiRoutes as routes4 } from "./modules/stock/http-api.routes";

export const httpApiRouting = {
  roots: ["/inventory"],
  routes: { ...routes0, ...routes1, ...routes2, ...routes3, ...routes4 },
} as const;

export const httpApiDocumentation = {
  "sections": {
    "inventory.configuration": {
      "title": "Configuration",
      "description": "Configuration HTTP operations for @voyzu/inventory.",
      "groups": {
        "inventory.configuration": {
          "title": "Configuration",
          "description": "Configuration operations.",
          "routes": {
            "inventory.configuration.list": {
              "description": "Lists the selected inventory configuration record type for the active organization."
            },
            "inventory.configuration.create": {
              "description": "Creates a category, warehouse, custom field, or option list in the active organization."
            },
            "inventory.configuration.get": {
              "description": "Gets one inventory configuration record including audit and usage information."
            },
            "inventory.configuration.patch": {
              "description": "Updates writable details on an inventory configuration record."
            },
            "inventory.configuration.transition": {
              "description": "Activates, deactivates, or deletes selected inventory configuration records. Item categories containing items cannot be deactivated or deleted, and warehouses holding stock cannot be deleted."
            },
            "inventory.configuration.addOption": {
              "description": "Adds a value to an inventory custom-field option list."
            },
            "inventory.configuration.patchOption": {
              "description": "Renames, activates, or deactivates an option-list value."
            },
            "inventory.configuration.deleteOption": {
              "description": "Deletes an option-list value and permanently removes values that reference it."
            }
          }
        },
        "inventory.items": {
          "title": "Items",
          "description": "Items operations.",
          "routes": {
            "inventory.items.list": {
              "description": "Lists inventory items for the selected organization. Free-text search includes all custom-field values."
            },
            "inventory.items.options": {
              "description": "Returns categories for item forms."
            },
            "inventory.items.reserveSku": {
              "description": "Reserves the next item identity and returns its SKU."
            },
            "inventory.items.create": {
              "description": "Creates an inventory item in the selected organization."
            },
            "inventory.items.get": {
              "description": "Gets an inventory item by SKU in the selected organization."
            },
            "inventory.items.patch": {
              "description": "Updates writable item details."
            },
            "inventory.items.delete": {
              "description": "Deletes an item only when it has no units in stock."
            },
            "inventory.items.activate": {
              "description": "Changes an inventory item to active status."
            },
            "inventory.items.deactivate": {
              "description": "Changes an inventory item to inactive status."
            },
            "inventory.items.batchActivate": {
              "description": "Activates the supplied inventory item SKUs."
            },
            "inventory.items.batchDeactivate": {
              "description": "Deactivates the supplied inventory item SKUs."
            },
            "inventory.items.batchChangeCategory": {
              "description": "Assigns the supplied inventory items to an active category."
            },
            "inventory.items.deletionImpact": {
              "description": "Lists items that cannot be deleted because they have positive stock on hand."
            },
            "inventory.items.batchDelete": {
              "description": "Deletes supplied items only when none has units in stock."
            }
          }
        }
      }
    },
    "inventory.operations": {
      "title": "Operations",
      "description": "Operations HTTP operations for @voyzu/inventory.",
      "groups": {
        "inventory.financial-activity": {
          "title": "Financial Activity",
          "description": "Financial Activity operations.",
          "routes": {
            "inventory.financial-activity.list": {
              "description": "Lists financially significant inventory movement lines for consuming packages."
            },
            "inventory.financial-activity.get": {
              "description": "Gets one financial activity record and its inventory movement."
            }
          }
        },
        "inventory.reports": {
          "title": "Reports",
          "description": "Reports operations.",
          "routes": {
            "inventory.reports.report": {
              "description": "Builds the selected Inventory report for the active organization."
            }
          }
        },
        "inventory.stock": {
          "title": "Stock",
          "description": "Stock operations.",
          "routes": {
            "inventory.stock.positions": {
              "description": "Lists derived on-hand, reserved, and available positions by item and warehouse."
            },
            "inventory.stock.activity": {
              "description": "Lists stock movements and reservation activity for the active organization."
            },
            "inventory.stock.options": {
              "description": "Returns active quantity-tracked items and warehouses, including warehouse status, for stock workflows."
            },
            "inventory.stock.receive": {
              "description": "Records positive inventory ledger movements for stock received into a warehouse."
            },
            "inventory.stock.issue": {
              "description": "Records inventory ledger movements for stock issued from a warehouse."
            },
            "inventory.stock.transfer": {
              "description": "Records paired negative and positive ledger movements between warehouses."
            },
            "inventory.stock.reserve": {
              "description": "Creates active reservations against available stock without moving physical quantity."
            },
            "inventory.stock.adjust": {
              "description": "Records exceptional inventory quantity adjustments in the stock ledger."
            },
            "inventory.stock.counts": {
              "description": "Lists physical stocktake records and their adjustment counts."
            },
            "inventory.stock.createCount": {
              "description": "Creates a draft stocktake from current quantities for an active warehouse."
            },
            "inventory.stock.count": {
              "description": "Gets a stocktake with expected, counted, and variance quantities and audit metadata."
            },
            "inventory.stock.saveCount": {
              "description": "Saves draft or in-progress counted quantities for a stocktake."
            },
            "inventory.stock.completeCount": {
              "description": "Completes a stocktake and posts ledger adjustments for non-zero variances."
            },
            "inventory.stock.deleteCount": {
              "description": "Deletes a draft or in-progress stocktake; completed stocktakes are retained."
            }
          }
        }
      }
    }
  }
} as const;
