import type { UiSurfaceMenuGroup } from "@voyzu/types/ui-surface";

export default [
  {
    "label": "Commercial",
    "items": {
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
            "path": "/commercial/customers/customer-categories"
          },
          "commercial.menu1.sales.customer-pricing": {
            "label": "Customer Pricing",
            "path": "/commercial/customers/pricing"
          },
          "commercial.menu1.sales.pricing-categories": {
            "label": "Customer Pricing Categories",
            "path": "/commercial/customers/pricing-categories"
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
          "commercial.menu1.products.product-categories": {
            "label": "Product Categories",
            "path": "/commercial/products/product-categories"
          },
          "commercial.menu1.products.product-option-lists": {
            "label": "Product Option Lists",
            "routeId": "voyzu.commercial.products.page.productOptionLists"
          },
          "commercial.menu1.products.product-pricing": {
            "label": "Product Pricing",
            "path": "/commercial/products/pricing"
          },
          "commercial.menu1.products.pricing-categories": {
            "label": "Product Pricing Categories",
            "path": "/commercial/products/pricing-categories"
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
