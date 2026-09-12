import type { VoyzuPackageNavigationDomain } from "@voyzu/types/framework";

import { pageRoutes as journalsRouteManifest } from "../modules/journals/pages.routes";
import { pageRoutes as companyReportsRouteManifest } from "../modules/reports/pages.routes";
import { pageRoutes as companyInventoryItemPostingProfilesRouteManifest } from "../modules/inventory-item-posting-profiles/pages.routes";
import { pageRoutes as companyInventoryItemPostingProfileAssignmentsRouteManifest } from "../modules/inventory-item-posting-profile-assignments/pages.routes";
import { pageRoutes as inventoryLedgerRouteManifest } from "../modules/inventory-ledger/pages.routes";
import { pageRoutes as taxLedgerRouteManifest } from "../modules/tax-ledger/pages.routes";
import { pageRoutes as apSubledgerLedgerEntriesRouteManifest } from "../modules/ap-subledger-ledger-entries/pages.routes";
import { pageRoutes as apSubledgerLedgerEntryEnquiryRouteManifest } from "../modules/ap-subledger-ledger-entry-enquiry/pages.routes";
import { pageRoutes as apSubledgerCounterpartiesRouteManifest } from "../modules/ap-subledger-counterparties/pages.routes";
import { pageRoutes as apSubledgerStatementsRouteManifest } from "../modules/ap-subledger-statements/pages.routes";
import { pageRoutes as apSubledgerBillsRouteManifest } from "../modules/ap-subledger-bills/pages.routes";
import { pageRoutes as arSubledgerLedgerEntriesRouteManifest } from "../modules/ar-subledger-ledger-entries/pages.routes";
import { pageRoutes as arSubledgerLedgerEntryEnquiryRouteManifest } from "../modules/ar-subledger-ledger-entry-enquiry/pages.routes";
import { pageRoutes as arSubledgerCounterpartiesRouteManifest } from "../modules/ar-subledger-counterparties/pages.routes";
import { pageRoutes as arSubledgerStatementsRouteManifest } from "../modules/ar-subledger-statements/pages.routes";
import { pageRoutes as arSubledgerInvoicesRouteManifest } from "../modules/ar-subledger-invoices/pages.routes";
import { pageRoutes as operationsInvoicesRouteManifest } from "../modules/operations-invoices/pages.routes";
import { pageRoutes as companyInventoryControlAccountsRouteManifest } from "../modules/inventory-control-accounts/pages.routes";
import { pageRoutes as companyGlAccountsRouteManifest } from "../modules/gl-accounts/pages.routes";
import { pageRoutes as companyGlAccountCategoriesRouteManifest } from "../modules/gl-account-categories/pages.routes";
import { pageRoutes as companyApControlAccountsRouteManifest } from "../modules/control-accounts/ap.pages.routes";
import { pageRoutes as companyArControlAccountsRouteManifest } from "../modules/control-accounts/ar.pages.routes";
import { pageRoutes as companyBankCashAccountsRouteManifest } from "../modules/bank-cash-accounts/pages.routes";
import { pageRoutes as companyDimensionsRouteManifest } from "../modules/dimensions/pages.routes";
import { pageRoutes as companyFinancialDocumentDefaultsRouteManifest } from "../modules/financial-document-defaults/pages.routes";
import { pageRoutes as companyFinancialDocumentTypesRouteManifest } from "../modules/financial-document-types/pages.routes";
import { pageRoutes as companyTaxControlAccountsRouteManifest } from "../modules/tax-control-accounts/pages.routes";
import { pageRoutes as financialYearsRouteManifest } from "../modules/financial-years/pages.routes";
import { pageRoutes as inventoryProcessingRouteManifest } from "../modules/inventory-processing/pages.routes";
import { pageRoutes as arIntegrationProcessingRouteManifest } from "../modules/ar-integration-processing/pages.routes";
import { financeLeftNav } from "./finance.left-nav";
import { pageRoutes as countryTaxSettingsPageRoutes } from "../modules/country-tax-settings/pages.routes";
const financePageRoutes = [
  countryTaxSettingsPageRoutes,
  journalsRouteManifest,
  companyReportsRouteManifest,
  companyInventoryItemPostingProfilesRouteManifest,
  companyInventoryItemPostingProfileAssignmentsRouteManifest,
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
  operationsInvoicesRouteManifest,
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
  inventoryProcessingRouteManifest,
  arIntegrationProcessingRouteManifest,
] as const;

function routeIds(modules: readonly Readonly<Record<string, { id: string }>>[]) {
  return modules.flatMap((pageRoutes) => Object.values(pageRoutes).map(({ id }) => id));
}

const domains = [
  {
    label: "Finance",
    routeId: financePageRoutes[0].list.id,
    routeIds: routeIds(financePageRoutes),
    leftNav: financeLeftNav,
  },
] as const satisfies readonly VoyzuPackageNavigationDomain[];

export default domains;
