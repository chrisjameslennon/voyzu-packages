import type { UiSurfaceMenuGroup } from "@voyzu/types/ui-surface";

export default [
  {
    "label": "Commercial",
    "items": {
      "commercial.menu1.dashboard": {
        "label": "Dashboard",
        "icon": "chart_data",
        "routeId": "voyzu.commercial.dashboard.page.dashboard"
      },
      "commercial.menu1.sales": {
        "label": "Sales",
        "icon": "sell",
        "children": {
          "commercial.menu1.sales.customers": {
            "label": "Customers",
            "routeId": "voyzu.commercial.customers.page.customers"
          },
          "commercial.menu1.sales.customer-categories": {
            "label": "Customer Categories",
            "routeId": "voyzu.commercial.customers.page.customerCategories"
          },
          "commercial.menu1.sales.customer-pricing": {
            "label": "Customer Price Lists",
            "routeId": "voyzu.commercial.customers.page.customerPriceLists"
          },
          "commercial.menu1.sales.quotes": {
            "label": "Quotes",
            "routeId": "voyzu.commercial.sales.page.quotes"
          },
          "commercial.menu1.sales.sales-orders": {
            "label": "Sales Orders",
            "routeId": "voyzu.commercial.sales.page.salesOrders"
          }
        }
      },
      "commercial.menu1.purchasing": {
        "label": "Purchasing",
        "icon": "shopping_cart",
        "children": {
          "commercial.menu1.purchasing.suppliers": {
            "label": "Suppliers",
            "routeId": "voyzu.commercial.suppliers.page.suppliers"
          },
          "commercial.menu1.purchasing.purchase-orders": {
            "label": "Purchase Orders",
            "routeId": "voyzu.commercial.purchasing.page.purchaseOrders"
          }
        }
      },
      "commercial.menu1.products": {
        "label": "Products",
        "icon": "inventory_2",
        "children": {
          "commercial.menu1.products.products": {
            "label": "Products",
            "routeId": "voyzu.commercial.products.page.products"
          },
          "commercial.menu1.products.pricing-categories": {
            "label": "Product Pricing",
            "path": "/commercial/products/pricing-categories"
          },
          "commercial.menu1.products.product-categories": {
            "label": "Product Categories",
            "routeId": "voyzu.commercial.products.page.productCategories"
          },
          "commercial.menu1.products.product-option-lists": {
            "label": "Product Option Lists",
            "routeId": "voyzu.commercial.products.page.productOptionLists"
          },
          "commercial.menu1.products.manage-lists": {
            "label": "Manage Lists",
            "routeId": "voyzu.commercial.products.page.manageLists"
          }
        }
      },
      "commercial.menu1.settings": {
        "label": "Settings",
        "icon": "settings",
        "children": {
          "commercial.menu1.settings.custom-fields": {
            "label": "Custom Fields",
            "routeId": "voyzu.commercial.settings.page.customFields"
          },
          "commercial.menu1.settings.custom-field-option-lists": {
            "label": "Custom Field Option Lists",
            "routeId": "voyzu.commercial.settings.page.customFieldOptionLists"
          }
        }
      }
    }
  }
] as const satisfies readonly UiSurfaceMenuGroup[];
