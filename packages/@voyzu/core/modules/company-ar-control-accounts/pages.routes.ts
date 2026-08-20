import { handleGet as handleGetControlAccount, handleListAr as handleListArControlAccounts, handlePatch as handlePatchControlAccount } from "@voyzu/core/common/control-accounts/server";
import { CompanyArControlAccountsListPage, CompanyArControlAccountDetailPage } from "@voyzu/core/company-ar-control-accounts/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-ar-control-accounts.page.list",
    pageTitle: "Accounts Receivable Control Accounts",
    helpPath: "modules-help/company-ledger/ar-control-accounts",
    path: "/finance/settings/control-accounts/ar",
    Page: CompanyArControlAccountsListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Control Accounts" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detail: {
    id: "voyzu.company-ar-control-accounts.page.detail",
    pageTitle: "Accounts Receivable Control Accounts",
    helpPath: "modules-help/company-ledger/ar-control-accounts",
    path: "/finance/settings/control-accounts/ar/[code]",
    Page: CompanyArControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Accounts Receivable Control Accounts", href: "/finance/settings/control-accounts/ar" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
