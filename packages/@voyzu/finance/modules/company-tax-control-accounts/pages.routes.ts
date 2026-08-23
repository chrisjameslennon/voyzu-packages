import { companyFinancePageAuth } from "@voyzu/finance/common/server";
import { handleListTaxControlAccounts, handlePatchTaxControlAccount } from "@voyzu/finance/common/tax-control-accounts/server";
import { CompanyTaxControlAccountsPage, CompanyTaxControlAccountDetailPage } from "@voyzu/finance/company-tax-control-accounts/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-tax-control-accounts.page.list",
    pageTitle: "Tax Control Accounts",
    helpPath: "modules-help/company-ledger/tax-accounts",
    path: "/finance/settings/control-accounts/tax",
    Page: CompanyTaxControlAccountsPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Control Accounts" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-tax-control-accounts.page.detail",
    pageTitle: "Tax Control Accounts",
    helpPath: "modules-help/company-ledger/tax-accounts",
    path: "/finance/settings/control-accounts/tax/[code]",
    Page: CompanyTaxControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Tax Control Accounts", href: "/finance/settings/control-accounts/tax" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
