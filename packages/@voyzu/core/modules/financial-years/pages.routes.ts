import { handleClose as handleCloseFinancialYear, handleCloseFinancialPeriod, handleCreate as handleCreateFinancialYear, handleDelete as handleDeleteFinancialYear, handleExportZip as handleExportFinancialYearsZip, handleGet as handleGetFinancialYear, handleList as handleListCompanyFinancialYears, handleListFinancialPeriods, handleOpen as handleOpenFinancialYear, handlePatch as handlePatchFinancialYear, handleReopen as handleReopenFinancialYear, handleReopenFinancialPeriod } from "@voyzu/core/financial-years/server";
import { FinancialYearsListPage, FinancialYearDetailPage } from "@voyzu/core/financial-years/server";

export const pageRoutes = {
  list: {
    id: "voyzu.financial-years.page.list",
    pageTitle: "Financial Periods",
    helpPath: "modules-help/company-ledger/financial-periods",
    path: "/finance/financial-periods",
    Page: FinancialYearsListPage,
    breadcrumbBase: [
      { label: "Finance" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detail: {
    id: "voyzu.financial-years.page.detail",
    pageTitle: "Financial Year",
    helpPath: "modules-help/company-ledger/financial-periods",
    path: "/finance/financial-periods/[code]",
    Page: FinancialYearDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Financial Periods", href: "/finance/financial-periods" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
