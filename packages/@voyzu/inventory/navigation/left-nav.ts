import { pageRoutes } from "../modules/items/pages.routes";
import { pageRoutes as configurationRoutes } from "../modules/configuration/pages.routes";
import { pageRoutes as reportRoutes } from "../modules/reports/pages.routes";
import { pageRoutes as stockRoutes } from "../modules/stock/pages.routes";

export const inventoryLeftNav = [
  {
    label: "Inventory",
    items: [
      {
        label: "Items",
        icon: "box",
        routeId: pageRoutes.list.id,
      },
      {
        label: "Item Categories",
        icon: "category",
        routeId: configurationRoutes.categories.id,
      },
      {
        label: "Stock",
        icon: "inventory",
        routeId: stockRoutes.stock.id,
      },
      {
        label: "Stock Counts",
        icon: "fact_check",
        routeId: stockRoutes.counts.id,
      },
      {
        label: "Stock Activity",
        icon: "history",
        routeId: stockRoutes.activity.id,
      },
      {
        label: "Warehouses",
        icon: "warehouse",
        routeId: configurationRoutes.warehouses.id,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Custom Fields",
        icon: "dynamic_form",
        routeId: configurationRoutes.customFields.id,
      },
      {
        label: "Custom Field Option Lists",
        icon: "list_alt",
        routeId: configurationRoutes.optionLists.id,
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "Items",
        icon: "box",
        children: [
          {
            label: "Items",
            routeId: reportRoutes.items.id,
          },
          {
            label: "Item Categories",
            routeId: reportRoutes.categories.id,
          },
        ],
      },
      {
        label: "Stock",
        icon: "summarize",
        children: [
          {
            label: "Stock on Hand",
            routeId: reportRoutes.onHand.id,
          },
          {
            label: "Stock Availability",
            routeId: reportRoutes.availability.id,
          },
          {
            label: "Stocktake Variance",
            routeId: reportRoutes.variance.id,
          },
        ],
      },
      {
        label: "Stock Activity",
        icon: "history",
        children: [
          {
            label: "Stock Issuances",
            routeId: reportRoutes.issuances.id,
          },
          {
            label: "Stock Receipts",
            routeId: reportRoutes.receipts.id,
          },
          {
            label: "Stock Reservation Activity",
            routeId: reportRoutes.reservationActivity.id,
          },
          {
            label: "Stock Transfers",
            routeId: reportRoutes.transfers.id,
          },
          {
            label: "Quantity Adjustments",
            routeId: reportRoutes.adjustments.id,
          },
          {
            label: "Stock Activity",
            routeId: reportRoutes.activity.id,
          },
        ],
      },
    ],
  },
] as const;

export default inventoryLeftNav;
