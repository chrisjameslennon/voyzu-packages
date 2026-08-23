import { FinanceCompaniesListPage, FinanceCompanyDetailPage } from "@voyzu/finance/finance-companies/server";

export const pageRoutes = {
  list: {
    id: "voyzu.financeCompanies.page.list",
    pageTitle: "Companies",
    path: "/finance/companies",
    Page: FinanceCompaniesListPage,
    breadcrumbBase: [{ label: "Finance Admin", href: "/finance" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  detail: {
    id: "voyzu.financeCompanies.page.detail",
    pageTitle: "Finance Company",
    path: "/finance/companies/[code]",
    Page: FinanceCompanyDetailPage,
    breadcrumbBase: [
      { label: "Finance Admin", href: "/finance" },
      { label: "Companies", href: "/finance/companies" },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
