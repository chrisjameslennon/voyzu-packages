import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { financeInstall } from "./install/manifest";
import { financeUninstall } from "./uninstall/manifest";
import { purgeAndRecreate } from "./scripts/db/purge-and-recreate";
import { install as installSampleData } from "./scripts/sample-data/init";

import { apSubledgerBillsModule } from "./modules/ap-subledger-bills/module";
import { apSubledgerCounterpartiesModule } from "./modules/ap-subledger-counterparties/module";
import { apSubledgerLedgerEntriesModule } from "./modules/ap-subledger-ledger-entries/module";
import { apSubledgerLedgerEntryEnquiryModule } from "./modules/ap-subledger-ledger-entry-enquiry/module";
import { apSubledgerStatementsModule } from "./modules/ap-subledger-statements/module";
import { arSubledgerCounterpartiesModule } from "./modules/ar-subledger-counterparties/module";
import { arSubledgerInvoicesModule } from "./modules/ar-subledger-invoices/module";
import { arSubledgerLedgerEntriesModule } from "./modules/ar-subledger-ledger-entries/module";
import { arSubledgerLedgerEntryEnquiryModule } from "./modules/ar-subledger-ledger-entry-enquiry/module";
import { arSubledgerStatementsModule } from "./modules/ar-subledger-statements/module";
import { companyApControlAccountsModule } from "./modules/company-ap-control-accounts/module";
import { companyArControlAccountsModule } from "./modules/company-ar-control-accounts/module";
import { companyBankCashAccountsModule } from "./modules/company-bank-cash-accounts/module";
import { companyDimensionsModule } from "./modules/company-dimensions/module";
import { companyFinancialDocumentDefaultsModule } from "./modules/company-financial-document-defaults/module";
import { companyFinancialDocumentTypesModule } from "./modules/company-financial-document-types/module";
import { companyGlAccountCategoriesModule } from "./modules/company-gl-account-categories/module";
import { companyGlAccountsModule } from "./modules/company-gl-accounts/module";
import { companyInventoryControlAccountsModule } from "./modules/company-inventory-control-accounts/module";
import { companyInventoryItemPostingProfilesModule } from "./modules/company-inventory-item-posting-profiles/module";
import { companyInventoryItemPostingProfileAssignmentsModule } from "./modules/company-inventory-item-posting-profile-assignments/module";
import { companyReportsModule } from "./modules/company-reports/module";
import { companyTaxControlAccountsModule } from "./modules/company-tax-control-accounts/module";
import { financialDocumentProcessingEngineModule } from "./modules/financial-document-processing-engine/module";
import { financialYearsModule } from "./modules/financial-years/module";
import { financeCompaniesModule } from "./modules/finance-companies/module";
import { countryTaxSettingsModule } from "./modules/country-tax-settings/module";
import { inventoryLedgerModule } from "./modules/inventory-ledger/module";
import { journalsModule } from "./modules/journals/module";
import { taxModule } from "./modules/tax/module";
import { taxLedgerModule } from "./modules/tax-ledger/module";

export const financeModules = [
  journalsModule,
  companyReportsModule,
  companyInventoryItemPostingProfilesModule,
  companyInventoryItemPostingProfileAssignmentsModule,
  inventoryLedgerModule,
  taxLedgerModule,
  apSubledgerLedgerEntriesModule,
  apSubledgerLedgerEntryEnquiryModule,
  apSubledgerCounterpartiesModule,
  apSubledgerStatementsModule,
  apSubledgerBillsModule,
  arSubledgerLedgerEntriesModule,
  arSubledgerLedgerEntryEnquiryModule,
  arSubledgerCounterpartiesModule,
  arSubledgerStatementsModule,
  arSubledgerInvoicesModule,
  companyInventoryControlAccountsModule,
  companyGlAccountsModule,
  companyGlAccountCategoriesModule,
  companyApControlAccountsModule,
  companyArControlAccountsModule,
  companyBankCashAccountsModule,
  companyDimensionsModule,
  companyFinancialDocumentDefaultsModule,
  companyFinancialDocumentTypesModule,
  companyTaxControlAccountsModule,
  financialYearsModule,
] as const;

export const financeServiceModules = [
  financialDocumentProcessingEngineModule,
  taxModule,
] as const;

export const financePackage = {
  modules: [
    financeCompaniesModule,
    countryTaxSettingsModule,
    journalsModule,
    companyReportsModule,
    companyInventoryItemPostingProfilesModule,
    companyInventoryItemPostingProfileAssignmentsModule,
    inventoryLedgerModule,
    taxLedgerModule,
    apSubledgerLedgerEntriesModule,
    apSubledgerLedgerEntryEnquiryModule,
    apSubledgerCounterpartiesModule,
    apSubledgerStatementsModule,
    apSubledgerBillsModule,
    arSubledgerLedgerEntriesModule,
    arSubledgerLedgerEntryEnquiryModule,
    arSubledgerCounterpartiesModule,
    arSubledgerStatementsModule,
    arSubledgerInvoicesModule,
    companyInventoryControlAccountsModule,
    companyGlAccountsModule,
    companyGlAccountCategoriesModule,
    companyApControlAccountsModule,
    companyArControlAccountsModule,
    companyBankCashAccountsModule,
    companyDimensionsModule,
    companyFinancialDocumentDefaultsModule,
    companyFinancialDocumentTypesModule,
    companyTaxControlAccountsModule,
    financialYearsModule,
    financialDocumentProcessingEngineModule,
    taxModule,
  ],
  install: financeInstall,
  uninstall: financeUninstall,
  scripts: {
    purgeAndRecreate,
    sampleData: installSampleData,
  },
} as const satisfies VoyzuPackageDefinition;

export default financePackage;
