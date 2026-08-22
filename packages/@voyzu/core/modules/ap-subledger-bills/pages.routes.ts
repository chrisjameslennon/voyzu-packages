import { companyFinancePageAuth } from "@voyzu/core/common/server";
import { ApBillsListPage, ApBillDetailPage } from "@voyzu/core/ap-subledger-bills/server";

export const pageRoutes = {
  list: {
    id: "voyzu.ap-subledger-bills.page.list",
    pageTitle: "AP Bills",
    helpPath: "modules-help/company-ledger/ap-bills",
    path: "/finance/subledgers/ap/bills",
    Page: ApBillsListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Accounts Payable" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.ap-subledger-bills.page.detail",
    pageTitle: "AP Bill",
    helpPath: "modules-help/company-ledger/ap-bills",
    path: "/finance/subledgers/ap/bills/[documentId]",
    Page: ApBillDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Bills", href: "/finance/subledgers/ap/bills" },
    ],
    auth: companyFinancePageAuth
  },
  detailPrintable: {
    id: "voyzu.ap-subledger-bills.page.detail.printable",
    pageTitle: "AP Bill",
    path: "/finance/subledgers/ap/bills/[documentId]/printable",
    Page: ApBillDetailPage,
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
