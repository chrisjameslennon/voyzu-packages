import { companyFinancePageAuth } from "@voyzu/finance/common/server";
import { handleGet as handleGetControlAccount, handleListAp as handleListApControlAccounts, handlePatch as handlePatchControlAccount } from "@voyzu/finance/common/control-accounts/server";
import { CompanyApControlAccountsListPage, CompanyApControlAccountDetailPage } from "@voyzu/finance/company-ap-control-accounts/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-ap-control-accounts.page.list",
    pageTitle: "Accounts Payable Control Accounts",
    helpPath: "modules-help/company-ledger/ap-control-accounts",
    path: "/finance/settings/control-accounts/ap",
    Page: CompanyApControlAccountsListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Accounts Payable Control Accounts", href: "/finance/settings/control-accounts/ap" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-ap-control-accounts.page.detail",
    pageTitle: "Accounts Payable Control Accounts",
    helpPath: "modules-help/company-ledger/ap-control-accounts",
    path: "/finance/settings/control-accounts/ap/[code]",
    Page: CompanyApControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Accounts Payable Control Accounts", href: "/finance/settings/control-accounts/ap" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
