import { pageRoutes } from "../modules/items/pages.routes";

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
        path: "/inventory/item-categories",
      },
      {
        label: "Stock",
        icon: "inventory",
        path: "/inventory/stock",
      },
      {
        label: "Stock Counts",
        icon: "fact_check",
        path: "/inventory/stock-counts",
      },
      {
        label: "Stock Activity",
        icon: "history",
        path: "/inventory/stock-activity",
      },
      {
        label: "Warehouses",
        icon: "warehouse",
        path: "/inventory/warehouses",
      },
    ],
  },
  {
    label: "Integration",
    items: [
      {
        label: "Finance",
        icon: "account_balance",
        children: [
          {
            label: "View Posting Profiles",
            icon: "visibility",
            path: "/inventory/integration/finance/posting-profiles",
          },
          {
            label: "Posting Profile Assignment",
            icon: "assignment",
            path: "/inventory/integration/finance/posting-profile-assignment",
          },
        ],
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Custom Fields",
        icon: "dynamic_form",
        path: "/inventory/settings/custom-fields",
      },
      {
        label: "Custom Field Option Lists",
        icon: "list_alt",
        path: "/inventory/settings/option-lists",
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
            path: "/inventory/reports/items",
          },
          {
            label: "Item Categories",
            path: "/inventory/reports/item-categories",
          },
        ],
      },
      {
        label: "Stock",
        icon: "summarize",
        children: [
          {
            label: "Stock on Hand",
            path: "/inventory/reports/stock-on-hand",
          },
          {
            label: "Stock Availability",
            path: "/inventory/reports/stock-availability",
          },
          {
            label: "Stock Activity",
            path: "/inventory/reports/stock-activity",
          },
          {
            label: "Stock Transfers",
            path: "/inventory/reports/stock-transfers",
          },
          {
            label: "Stock Reservations",
            path: "/inventory/reports/stock-reservations",
          },
          {
            label: "Stocktake Variance",
            path: "/inventory/reports/stocktake-variance",
          },
          {
            label: "Quantity Adjustments",
            path: "/inventory/reports/quantity-adjustments",
          },
        ],
      },
    ],
  },
] as const;

export default inventoryLeftNav;
