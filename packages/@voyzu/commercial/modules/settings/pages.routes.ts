export const pageRoutes = {
  entities: {
    id: "voyzu.commercial.settings.page.entities",
    path: "/commercial/settings/entities",
    pageTitle: "Entities",
    loadPage: () => import("./server/pages/EntitiesPage").then((module) => module.EntitiesPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Settings" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  customFields: {
    id: "voyzu.commercial.settings.page.customFields",
    path: "/commercial/settings/custom-fields",
    pageTitle: "Custom Fields",
    loadPage: () => import("./server/pages/CustomFieldsPage").then((module) => module.CustomFieldsPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Settings" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  customFieldOptionLists: {
    id: "voyzu.commercial.settings.page.customFieldOptionLists",
    path: "/commercial/settings/custom-field-option-lists",
    pageTitle: "Custom Field Option Lists",
    loadPage: () => import("./server/pages/CustomFieldOptionListsPage").then((module) => module.CustomFieldOptionListsPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Settings" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
