export const pageRoutes = {
  "voyzu.commercial.product-pricing-categories.page.detail": {
    path: "/commercial/products/pricing-categories/[code]", pathParams: { code: { type: "string" } }, pageTitle: "Product Pricing Category",
    loadPage: () => import("./server/pages/PricingCategoryDetailPage").then((module) => module.PricingCategoryDetailPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Products", href: "/commercial/products" }, { label: "Product Pricing", href: "/commercial/products/pricing-categories" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.commercial.product-pricing-categories.page.list": {
    path: "/commercial/products/pricing-categories", pageTitle: "Product Pricing",
    loadPage: () => import("./server/pages/PricingCategoriesPage").then((module) => module.PricingCategoriesPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Products", href: "/commercial/products" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
