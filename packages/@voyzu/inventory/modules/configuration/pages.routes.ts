const load =
  (
    name:
      | "CategoriesPage"
      | "CategoryDetailPage"
      | "WarehousesPage"
      | "WarehouseDetailPage"
      | "CustomFieldsPage"
      | "CustomFieldDetailPage"
      | "OptionListsPage"
      | "OptionListDetailPage",
  ) =>
  () =>
    import("./server/pages/ConfigurationPages").then((module) => module[name]);
export const pageRoutes = {
  categories: {
    id: "voyzu.inventory.categories.page.list",
    path: "/inventory/item-categories",
    loadPage: load("CategoriesPage"),
    pageTitle: "Item Categories",
    breadcrumbBase: [{ label: "Inventory" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  category: {
    id: "voyzu.inventory.categories.page.detail",
    path: "/inventory/item-categories/[id]",
    loadPage: load("CategoryDetailPage"),
    pageTitle: "Item Category",
    breadcrumbBase: [
      { label: "Inventory" },
      { label: "Item Categories", href: "/inventory/item-categories" },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
  warehouses: {
    id: "voyzu.inventory.warehouses.page.list",
    path: "/inventory/warehouses",
    loadPage: load("WarehousesPage"),
    pageTitle: "Warehouses",
    breadcrumbBase: [{ label: "Inventory" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  warehouse: {
    id: "voyzu.inventory.warehouses.page.detail",
    path: "/inventory/warehouses/[id]",
    loadPage: load("WarehouseDetailPage"),
    pageTitle: "Warehouse",
    breadcrumbBase: [
      { label: "Inventory" },
      { label: "Warehouses", href: "/inventory/warehouses" },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
  customFields: {
    id: "voyzu.inventory.custom-fields.page.list",
    path: "/inventory/custom-fields",
    loadPage: load("CustomFieldsPage"),
    pageTitle: "Inventory Custom Fields",
    breadcrumbBase: [{ label: "Settings" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  customField: {
    id: "voyzu.inventory.custom-fields.page.detail",
    path: "/inventory/custom-fields/[id]",
    loadPage: load("CustomFieldDetailPage"),
    pageTitle: "Custom Field",
    breadcrumbBase: [
      { label: "Settings" },
      { label: "Custom Fields", href: "/inventory/custom-fields" },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
  optionLists: {
    id: "voyzu.inventory.option-lists.page.list",
    path: "/inventory/custom-field-option-lists",
    loadPage: load("OptionListsPage"),
    pageTitle: "Custom Field Option Lists",
    breadcrumbBase: [{ label: "Settings" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  optionList: {
    id: "voyzu.inventory.option-lists.page.detail",
    path: "/inventory/custom-field-option-lists/[id]",
    loadPage: load("OptionListDetailPage"),
    pageTitle: "Custom Field Option List",
    breadcrumbBase: [
      { label: "Settings" },
      {
        label: "Custom Field Option Lists",
        href: "/inventory/custom-field-option-lists",
      },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
