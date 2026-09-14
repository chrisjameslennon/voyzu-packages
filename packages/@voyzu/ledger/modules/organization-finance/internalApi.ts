export const implementations = {
  "@erp/organization-finance": () => import("./server/lib/organization-finance.implementation").then(m => ({
    methods: m.organizationFinanceMethods, transactionalMethods: ["createFinancialEntity", "update"],
  })),
};
