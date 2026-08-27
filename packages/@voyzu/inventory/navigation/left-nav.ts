import { pageRoutes } from "../modules/items/pages.routes";

export const inventoryLeftNav = [
  {
    label: "Inventory",
    items: [
      {
        label: "Items",
        icon: "deployed_code",
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
        label: "Warehouses",
        icon: "warehouse",
        path: "/inventory/settings/warehouses",
      },
      {
        label: "Custom Fields",
        icon: "dynamic_form",
        path: "/inventory/settings/custom-fields",
      },
      {
        label: "Option Lists",
        icon: "list_alt",
        path: "/inventory/settings/option-lists",
      },
    ],
  },
  {
    label: "Reports",
    items: [
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
      {
        label: "Items",
        icon: "deployed_code",
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
    ],
  },
] as const;

export default inventoryLeftNav;
