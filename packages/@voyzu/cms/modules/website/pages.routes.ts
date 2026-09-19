export const pageRoutes = {
  "voyzu.cms.website.page.home": {
    path: "/website",
    pageTitle: "Website",
    loadPage: () => import("./server/pages/WebsitePage").then((module) => module.WebsitePage),
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
