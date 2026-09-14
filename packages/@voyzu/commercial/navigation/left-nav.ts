import type { VoyzuPackageNavigationGroup } from "@voyzu/types/framework";

export const commercialLeftNav = [
  {
    label: "Commercial",
    items: [
      {
        label: "Customers",
        icon: "group",
        routeId: "voyzu.commercial.customers.page.customers",
        children: [
          { label: "Customers", routeId: "voyzu.commercial.customers.page.customers" },
          { label: "Customer Price Lists", routeId: "voyzu.commercial.customers.page.customerPriceLists" },
        ],
      },
      {
        label: "Suppliers",
        icon: "local_shipping",
        routeId: "voyzu.commercial.suppliers.page.suppliers",
        children: [
          { label: "Suppliers", routeId: "voyzu.commercial.suppliers.page.suppliers" },
        ],
      },
      {
        label: "Sales",
        icon: "sell",
        routeId: "voyzu.commercial.sales.page.quotes",
        children: [
          { label: "Quotes", routeId: "voyzu.commercial.sales.page.quotes" },
          { label: "Sales Orders", routeId: "voyzu.commercial.sales.page.salesOrders" },
        ],
      },
      {
        label: "Purchasing",
        icon: "shopping_cart",
        routeId: "voyzu.commercial.purchasing.page.purchaseOrders",
        children: [
          { label: "Purchase Orders", routeId: "voyzu.commercial.purchasing.page.purchaseOrders" },
        ],
      },
      {
        label: "Products",
        icon: "inventory_2",
        routeId: "voyzu.commercial.products.page.products",
        children: [
          { label: "Products", routeId: "voyzu.commercial.products.page.products" },
          { label: "Product Options", routeId: "voyzu.commercial.products.page.productOptions" },
          { label: "Product Option Lists", routeId: "voyzu.commercial.products.page.productOptionLists" },
          { label: "Price Lists", routeId: "voyzu.commercial.products.page.priceLists" },
        ],
      },
      {
        label: "Settings",
        icon: "settings",
        routeId: "voyzu.commercial.settings.page.entities",
        children: [
          { label: "Entities", routeId: "voyzu.commercial.settings.page.entities" },
          { label: "Custom Fields", routeId: "voyzu.commercial.settings.page.customFields" },
          { label: "Custom Field Option Lists", routeId: "voyzu.commercial.settings.page.customFieldOptionLists" },
        ],
      },
    ],
  },
] as const satisfies readonly VoyzuPackageNavigationGroup[];
export default commercialLeftNav;
