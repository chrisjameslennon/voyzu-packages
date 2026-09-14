export const inventoryLeftNav = [
  {
    label: "Inventory",
    items: [
      {
        label: "Items",
        icon: "box",
        routeId: "voyzu.inventory.items.page.list",
      },
      {
        label: "Item Categories",
        icon: "category",
        routeId: "voyzu.inventory.categories.page.list",
      },
      {
        label: "Stock",
        icon: "inventory",
        routeId: "voyzu.inventory.stock.page.list",
      },
      {
        label: "Stock Counts",
        icon: "fact_check",
        routeId: "voyzu.inventory.stock-counts.page.list",
      },
      {
        label: "Stock Activity",
        icon: "history",
        routeId: "voyzu.inventory.stock-activity.page.list",
      },
      {
        label: "Warehouses",
        icon: "warehouse",
        routeId: "voyzu.inventory.warehouses.page.list",
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Custom Fields",
        icon: "dynamic_form",
        routeId: "voyzu.inventory.custom-fields.page.list",
      },
      {
        label: "Custom Field Option Lists",
        icon: "list_alt",
        routeId: "voyzu.inventory.option-lists.page.list",
      },
    ],
  },
  {
    label: "Integration",
    items: [
      {
        label: "Financial Activity",
        icon: "account_balance",
        routeId: "voyzu.inventory.financial-activity.page.list",
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
            routeId: "voyzu.inventory.reports.items",
          },
          {
            label: "Item Categories",
            routeId: "voyzu.inventory.reports.item-categories",
          },
        ],
      },
      {
        label: "Stock",
        icon: "summarize",
        children: [
          {
            label: "Stock on Hand",
            routeId: "voyzu.inventory.reports.stock-on-hand",
          },
          {
            label: "Stock Availability",
            routeId: "voyzu.inventory.reports.stock-availability",
          },
          {
            label: "Stocktake Variance",
            routeId: "voyzu.inventory.reports.stocktake-variance",
          },
        ],
      },
      {
        label: "Stock Activity",
        icon: "history",
        children: [
          {
            label: "Stock Issuances",
            routeId: "voyzu.inventory.reports.stock-issuances",
          },
          {
            label: "Stock Receipts",
            routeId: "voyzu.inventory.reports.stock-receipts",
          },
          {
            label: "Stock Reservation Activity",
            routeId: "voyzu.inventory.reports.stock-reservation-activity",
          },
          {
            label: "Stock Transfers",
            routeId: "voyzu.inventory.reports.stock-transfers",
          },
          {
            label: "Quantity Adjustments",
            routeId: "voyzu.inventory.reports.quantity-adjustments",
          },
          {
            label: "Stock Activity",
            routeId: "voyzu.inventory.reports.stock-activity",
          },
          {
            label: "Financial Activity",
            routeId: "voyzu.inventory.reports.financial-activity",
          },
        ],
      },
    ],
  },
] as const;

export default inventoryLeftNav;
