import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.ap-subledger-bills.page.list": {
    pageTitle: "AP Bills",
    helpPath: "modules-help/company-ledger/ap-bills",
    path: "/finance/subledgers/ap/bills",
    loadPage: () => import("./server/pages/ApBillsListPage").then((module) => module.ApBillsListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Accounts Payable" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.ap-subledger-bills.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { documentId: { type: "string" } },
    pageTitle: "AP Bill",
    helpPath: "modules-help/company-ledger/ap-bills",
    path: "/finance/subledgers/ap/bills/[documentId]",
    loadPage: () => import("./server/pages/ApBillDetailPage").then((module) => module.ApBillDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Bills", href: "/finance/subledgers/ap/bills" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.ap-subledger-bills.page.detail.printable": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { documentId: { type: "string" } },
    pageTitle: "AP Bill",
    path: "/finance/subledgers/ap/bills/[documentId]/printable",
    loadPage: () => import("./server/pages/ApBillDetailPage").then((module) => module.ApBillDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
