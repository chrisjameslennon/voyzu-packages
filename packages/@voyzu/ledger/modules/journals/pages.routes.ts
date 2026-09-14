import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.journals.page.list": {
    pageTitle: "Journal Entries",
    helpPath: "modules-help/company-ledger/journals",
    path: "/ledger/journals",
    loadPage: () => import("./server/pages/JournalsListPage").then((module) => module.JournalsListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Company General Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.journals.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    pageTitle: "Journal Entry",
    helpPath: "modules-help/company-ledger/journals",
    path: "/ledger/journals/[code]",
    loadPage: () => import("./server/pages/JournalDetailPage").then((module) => module.JournalDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Company General Ledger" },
      { label: "Journal Entries", href: "/ledger/journals" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
