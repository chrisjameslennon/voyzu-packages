export const helloModule = {
  id: "voyzu.hello-module",
  name: "Hello Module",
  pageRoutes: {
    home: {
      id: "voyzu.hello-module.page.home",
      pageTitle: "Hello Module",
      auth: {
        required: true,
        minRole: "COMPANY_USER",
      },
    },
  },
} as const;
