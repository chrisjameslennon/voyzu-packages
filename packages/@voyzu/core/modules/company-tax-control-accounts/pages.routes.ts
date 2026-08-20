import { handleListTaxControlAccounts, handlePatchTaxControlAccount } from "@voyzu/core/common/tax-control-accounts/server";
import { CompanyTaxControlAccountsPage, CompanyTaxControlAccountDetailPage } from "@voyzu/core/company-tax-control-accounts/server";

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
    auth: { required: true, minRole: "COMPANY_USER" }
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
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
