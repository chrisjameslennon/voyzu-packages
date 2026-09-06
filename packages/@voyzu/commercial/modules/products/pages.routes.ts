export const pageRoutes = {
  products: {
    id: "voyzu.commercial.products.page.products",
    path: "/commercial/products",
    pageTitle: "Products",
    loadPage: () => import("./server/pages/ProductsPage").then((module) => module.ProductsPage),
    breadcrumbBase: [{ label: "Commercial" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  productOptions: {
    id: "voyzu.commercial.products.page.productOptions",
    path: "/commercial/products/options",
    pageTitle: "Product Options",
    loadPage: () => import("./server/pages/ProductOptionsPage").then((module) => module.ProductOptionsPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Products" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  productOptionLists: {
    id: "voyzu.commercial.products.page.productOptionLists",
    path: "/commercial/products/option-lists",
    pageTitle: "Product Option Lists",
    loadPage: () => import("./server/pages/ProductOptionListsPage").then((module) => module.ProductOptionListsPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Products" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  priceLists: {
    id: "voyzu.commercial.products.page.priceLists",
    path: "/commercial/products/price-lists",
    pageTitle: "Price Lists",
    loadPage: () => import("./server/pages/PriceListsPage").then((module) => module.PriceListsPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Products" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
