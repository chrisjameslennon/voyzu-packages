import { companyFinancePageAuth } from "@voyzu/core/common/server";
import { JournalsListPage, JournalDetailPage } from "@voyzu/core/journals/server";

export const pageRoutes = {
  list: {
    id: "voyzu.journals.page.list",
    pageTitle: "Journal Entries",
    helpPath: "modules-help/company-ledger/journals",
    path: "/finance/journals",
    Page: JournalsListPage,
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
    Page: JournalDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Company General Ledger" },
      { label: "Journal Entries", href: "/finance/journals" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
