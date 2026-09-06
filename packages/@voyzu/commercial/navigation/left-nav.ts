import type { VoyzuPackageNavigationGroup } from "@voyzu/types/framework";
import { pageRoutes as customersRoutes } from "../modules/customers/pages.routes";
import { pageRoutes as suppliersRoutes } from "../modules/suppliers/pages.routes";
import { pageRoutes as salesRoutes } from "../modules/sales/pages.routes";
import { pageRoutes as purchasingRoutes } from "../modules/purchasing/pages.routes";
import { pageRoutes as productsRoutes } from "../modules/products/pages.routes";
import { pageRoutes as settingsRoutes } from "../modules/settings/pages.routes";

export const commercialLeftNav = [
  {
    label: "Commercial",
    items: [
      {
        label: "Customers",
        icon: "group",
        routeId: customersRoutes.customers.id,
        children: [
          { label: "Customers", routeId: customersRoutes.customers.id },
          { label: "Customer Price Lists", routeId: customersRoutes.customerPriceLists.id },
        ],
      },
      {
        label: "Suppliers",
        icon: "local_shipping",
        routeId: suppliersRoutes.suppliers.id,
        children: [
          { label: "Suppliers", routeId: suppliersRoutes.suppliers.id },
        ],
      },
      {
        label: "Sales",
        icon: "sell",
        routeId: salesRoutes.quotes.id,
        children: [
          { label: "Quotes", routeId: salesRoutes.quotes.id },
          { label: "Sales Orders", routeId: salesRoutes.salesOrders.id },
        ],
      },
      {
        label: "Purchasing",
        icon: "shopping_cart",
        routeId: purchasingRoutes.purchaseOrders.id,
        children: [
          { label: "Purchase Orders", routeId: purchasingRoutes.purchaseOrders.id },
        ],
      },
      {
        label: "Products",
        icon: "inventory_2",
        routeId: productsRoutes.products.id,
        children: [
          { label: "Products", routeId: productsRoutes.products.id },
          { label: "Product Options", routeId: productsRoutes.productOptions.id },
          { label: "Product Option Lists", routeId: productsRoutes.productOptionLists.id },
          { label: "Price Lists", routeId: productsRoutes.priceLists.id },
        ],
      },
      {
        label: "Settings",
        icon: "settings",
        routeId: settingsRoutes.entities.id,
        children: [
          { label: "Entities", routeId: settingsRoutes.entities.id },
          { label: "Custom Fields", routeId: settingsRoutes.customFields.id },
          { label: "Custom Field Option Lists", routeId: settingsRoutes.customFieldOptionLists.id },
        ],
      },
    ],
  },
] as const satisfies readonly VoyzuPackageNavigationGroup[];
export default commercialLeftNav;
