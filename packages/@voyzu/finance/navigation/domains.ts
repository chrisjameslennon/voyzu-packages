import type { VoyzuPackageNavigationDomain } from "@voyzu/types/framework";

import { pageRoutes as financeCompaniesRouteManifest } from "@voyzu/finance/finance-companies/pages.routes";
import { pageRoutes as journalsRouteManifest } from "@voyzu/finance/journals/pages.routes";
import { pageRoutes as companyReportsRouteManifest } from "@voyzu/finance/company-reports/pages.routes";
import { pageRoutes as companyInventoryItemPostingProfilesRouteManifest } from "@voyzu/finance/company-inventory-item-posting-profiles/pages.routes";
import { pageRoutes as inventoryLedgerRouteManifest } from "@voyzu/finance/inventory-ledger/pages.routes";
import { pageRoutes as taxLedgerRouteManifest } from "@voyzu/finance/tax-ledger/pages.routes";
import { pageRoutes as apSubledgerLedgerEntriesRouteManifest } from "@voyzu/finance/ap-subledger-ledger-entries/pages.routes";
import { pageRoutes as apSubledgerLedgerEntryEnquiryRouteManifest } from "@voyzu/finance/ap-subledger-ledger-entry-enquiry/pages.routes";
import { pageRoutes as apSubledgerCounterpartiesRouteManifest } from "@voyzu/finance/ap-subledger-counterparties/pages.routes";
import { pageRoutes as apSubledgerStatementsRouteManifest } from "@voyzu/finance/ap-subledger-statements/pages.routes";
import { pageRoutes as apSubledgerBillsRouteManifest } from "@voyzu/finance/ap-subledger-bills/pages.routes";
import { pageRoutes as arSubledgerLedgerEntriesRouteManifest } from "@voyzu/finance/ar-subledger-ledger-entries/pages.routes";
import { pageRoutes as arSubledgerLedgerEntryEnquiryRouteManifest } from "@voyzu/finance/ar-subledger-ledger-entry-enquiry/pages.routes";
import { pageRoutes as arSubledgerCounterpartiesRouteManifest } from "@voyzu/finance/ar-subledger-counterparties/pages.routes";
import { pageRoutes as arSubledgerStatementsRouteManifest } from "@voyzu/finance/ar-subledger-statements/pages.routes";
import { pageRoutes as arSubledgerInvoicesRouteManifest } from "@voyzu/finance/ar-subledger-invoices/pages.routes";
import { pageRoutes as companyInventoryControlAccountsRouteManifest } from "@voyzu/finance/company-inventory-control-accounts/pages.routes";
import { pageRoutes as companyGlAccountsRouteManifest } from "@voyzu/finance/company-gl-accounts/pages.routes";
import { pageRoutes as companyGlAccountCategoriesRouteManifest } from "@voyzu/finance/company-gl-account-categories/pages.routes";
import { pageRoutes as companyApControlAccountsRouteManifest } from "@voyzu/finance/company-ap-control-accounts/pages.routes";
import { pageRoutes as companyArControlAccountsRouteManifest } from "@voyzu/finance/company-ar-control-accounts/pages.routes";
import { pageRoutes as companyBankCashAccountsRouteManifest } from "@voyzu/finance/company-bank-cash-accounts/pages.routes";
import { pageRoutes as companyDimensionsRouteManifest } from "@voyzu/finance/company-dimensions/pages.routes";
import { pageRoutes as companyFinancialDocumentDefaultsRouteManifest } from "@voyzu/finance/company-financial-document-defaults/pages.routes";
import { pageRoutes as companyFinancialDocumentTypesRouteManifest } from "@voyzu/finance/company-financial-document-types/pages.routes";
import { pageRoutes as companyTaxControlAccountsRouteManifest } from "@voyzu/finance/company-tax-control-accounts/pages.routes";
import { pageRoutes as financialYearsRouteManifest } from "@voyzu/finance/financial-years/pages.routes";
import { financeLeftNav } from "./finance.left-nav";
import { financeAdminLeftNav } from "./organization.left-nav";

const financeAdminPageRoutes = [
  financeCompaniesRouteManifest,
] as const;
const financePageRoutes = [
  journalsRouteManifest,
  companyReportsRouteManifest,
  companyInventoryItemPostingProfilesRouteManifest,
  inventoryLedgerRouteManifest,
  taxLedgerRouteManifest,
  apSubledgerLedgerEntriesRouteManifest,
  apSubledgerLedgerEntryEnquiryRouteManifest,
  apSubledgerCounterpartiesRouteManifest,
  apSubledgerStatementsRouteManifest,
  apSubledgerBillsRouteManifest,
  arSubledgerLedgerEntriesRouteManifest,
  arSubledgerLedgerEntryEnquiryRouteManifest,
  arSubledgerCounterpartiesRouteManifest,
  arSubledgerStatementsRouteManifest,
  arSubledgerInvoicesRouteManifest,
  companyInventoryControlAccountsRouteManifest,
  companyGlAccountsRouteManifest,
  companyGlAccountCategoriesRouteManifest,
  companyApControlAccountsRouteManifest,
  companyArControlAccountsRouteManifest,
  companyBankCashAccountsRouteManifest,
  companyDimensionsRouteManifest,
  companyFinancialDocumentDefaultsRouteManifest,
  companyFinancialDocumentTypesRouteManifest,
  companyTaxControlAccountsRouteManifest,
  financialYearsRouteManifest,
] as const;

function routeIds(modules: readonly Readonly<Record<string, { id: string }>>[]) {
  return modules.flatMap((pageRoutes) => Object.values(pageRoutes).map(({ id }) => id));
}

const domains = [
  {
    label: "Finance Admin",
    routeId: financeAdminPageRoutes[0].list.id,
    routeIds: routeIds(financeAdminPageRoutes),
    leftNav: financeAdminLeftNav,
    topNavigationVisible: false,
  },
  {
    label: "Finance",
    routeId: financePageRoutes[0].list.id,
    routeIds: routeIds(financePageRoutes),
    leftNav: financeLeftNav,
  },
] as const satisfies readonly VoyzuPackageNavigationDomain[];

export default domains;
