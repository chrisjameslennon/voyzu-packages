import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.journals.page.list": {
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
  "voyzu.journals.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
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
