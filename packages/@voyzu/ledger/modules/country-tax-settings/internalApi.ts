export const implementations = {
  "@erp/country-finance": () => import("./server/lib/country-finance.implementation").then(m => ({ methods: m.countryFinanceMethods })),
};
