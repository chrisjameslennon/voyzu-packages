export const implementations = {
 "@erp/finance-documents": () => import("./finance.implementation").then(module => ({ methods: module.documentMethods, transactionalMethods: ["record"] })),
 "@erp/ar-counterparties": () => import("./finance.implementation").then(module => ({ methods: module.arMethods, transactionalMethods: ["ensure"] })),
 "@erp/ap-counterparties": () => import("./finance.implementation").then(module => ({ methods: module.apMethods, transactionalMethods: ["ensure"] })),
};
