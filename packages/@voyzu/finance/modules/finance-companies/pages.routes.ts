import { FinanceCompaniesListPage, FinanceCompanyDetailPage } from "@voyzu/finance/finance-companies/server";

export const pageRoutes = {
  list: {
    id: "voyzu.financeCompanies.page.list",
    pageTitle: "Financial Entities",
    path: "/finance/companies",
    Page: FinanceCompaniesListPage,
    breadcrumbBase: [{ label: "Finance Admin", href: "/finance" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  detail: {
    id: "voyzu.financeCompanies.page.detail",
    pageTitle: "Financial Entity",
    path: "/finance/companies/[code]",
    Page: FinanceCompanyDetailPage,
    breadcrumbBase: [
      { label: "Finance Admin", href: "/finance" },
      { label: "Financial Entities", href: "/finance/companies" },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
