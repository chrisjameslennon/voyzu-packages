import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.journals.page.list",
    pageTitle: "Journal Entries",
    helpPath: "modules-help/company-ledger/journals",
    path: "/finance/journals",
    loadPage: () => import("./server/pages/JournalsListPage").then((module) => module.JournalsListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Company General Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.journals.page.detail",
    pageTitle: "Journal Entry",
    helpPath: "modules-help/company-ledger/journals",
    path: "/finance/journals/[code]",
    loadPage: () => import("./server/pages/JournalDetailPage").then((module) => module.JournalDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Company General Ledger" },
      { label: "Journal Entries", href: "/finance/journals" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
