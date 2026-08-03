import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { coreInstall } from "./install/manifest";
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
import { companiesModule } from "./modules/companies/module";
import { companyApControlAccountsModule } from "./modules/company-ap-control-accounts/module";
import { companyArControlAccountsModule } from "./modules/company-ar-control-accounts/module";
import { companyAuditModule } from "./modules/company-audit/module";
import { companyBankCashAccountsModule } from "./modules/company-bank-cash-accounts/module";
import { companyDimensionsModule } from "./modules/company-dimensions/module";
import { companyFinancialDocumentDefaultsModule } from "./modules/company-financial-document-defaults/module";
import { companyFinancialDocumentTypesModule } from "./modules/company-financial-document-types/module";
import { companyGlAccountCategoriesModule } from "./modules/company-gl-account-categories/module";
import { companyGlAccountsModule } from "./modules/company-gl-accounts/module";
import { companyInventoryCategoriesModule } from "./modules/company-inventory-categories/module";
import { companyInventoryControlAccountsModule } from "./modules/company-inventory-control-accounts/module";
import { companyInventoryItemPostingProfilesModule } from "./modules/company-inventory-item-posting-profiles/module";
import { companyInventoryItemsModule } from "./modules/company-inventory-items/module";
import { companyReportsModule } from "./modules/company-reports/module";
import { companySwitcherModule } from "./modules/company-switcher/module";
import { companyTaxControlAccountsModule } from "./modules/company-tax-control-accounts/module";
import { countriesModule } from "./modules/countries/module";
import { currenciesModule } from "./modules/currencies/module";
import { financialDocumentProcessingEngineModule } from "./modules/financial-document-processing-engine/module";
import { financialYearsModule } from "./modules/financial-years/module";
import { inventoryLedgerModule } from "./modules/inventory-ledger/module";
import { journalsModule } from "./modules/journals/module";
import { organizationModule } from "./modules/organization/module";
import { organizationAuditModule } from "./modules/organization-audit/module";
import { organizationApControlAccountsModule } from "./modules/organization-ap-control-accounts/module";
import { organizationArControlAccountsModule } from "./modules/organization-ar-control-accounts/module";
import { organizationBankCashAccountsModule } from "./modules/organization-bank-cash-accounts/module";
import { organizationDimensionsModule } from "./modules/organization-dimensions/module";
import { organizationFinancialDocumentDefaultsModule } from "./modules/organization-financial-document-defaults/module";
import { organizationFinancialDocumentTypesModule } from "./modules/organization-financial-document-types/module";
import { organizationGlAccountCategoriesModule } from "./modules/organization-gl-account-categories/module";
import { organizationGlAccountsModule } from "./modules/organization-gl-accounts/module";
import { organizationInventoryCategoriesModule } from "./modules/organization-inventory-categories/module";
import { organizationInventoryControlAccountsModule } from "./modules/organization-inventory-control-accounts/module";
import { organizationInventoryItemPostingProfilesModule } from "./modules/organization-inventory-item-posting-profiles/module";
import { organizationInventoryItemsModule } from "./modules/organization-inventory-items/module";
import { organizationReportsModule } from "./modules/organization-reports/module";
import { organizationTaxControlAccountsModule } from "./modules/organization-tax-control-accounts/module";
import { taxModule } from "./modules/tax/module";
import { taxLedgerModule } from "./modules/tax-ledger/module";

export const coreOrganizationModules = [
  organizationModule,
  organizationAuditModule,
  companiesModule,
  organizationBankCashAccountsModule,
  organizationApControlAccountsModule,
  organizationArControlAccountsModule,
  organizationGlAccountsModule,
  organizationGlAccountCategoriesModule,
  organizationFinancialDocumentTypesModule,
  organizationFinancialDocumentDefaultsModule,
  organizationDimensionsModule,
  countriesModule,
  currenciesModule,
  organizationTaxControlAccountsModule,
  organizationInventoryControlAccountsModule,
  organizationInventoryCategoriesModule,
  organizationInventoryItemsModule,
  organizationInventoryItemPostingProfilesModule,
  organizationReportsModule,
] as const;

export const coreFinanceModules = [
  journalsModule,
  companyReportsModule,
  companyInventoryItemsModule,
  companyInventoryCategoriesModule,
  companyInventoryItemPostingProfilesModule,
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
  companyAuditModule,
] as const;

export const coreServiceModules = [
  companySwitcherModule,
  financialDocumentProcessingEngineModule,
  taxModule,
] as const;

export const corePackage = {
  modules: [
    organizationModule,
    organizationAuditModule,
    companiesModule,
    organizationBankCashAccountsModule,
    organizationApControlAccountsModule,
    organizationArControlAccountsModule,
    organizationGlAccountsModule,
    organizationGlAccountCategoriesModule,
    organizationFinancialDocumentTypesModule,
    organizationFinancialDocumentDefaultsModule,
    organizationDimensionsModule,
    countriesModule,
    currenciesModule,
    organizationTaxControlAccountsModule,
    organizationInventoryControlAccountsModule,
    organizationInventoryCategoriesModule,
    organizationInventoryItemsModule,
    organizationInventoryItemPostingProfilesModule,
    organizationReportsModule,
    journalsModule,
    companyReportsModule,
    companyInventoryItemsModule,
    companyInventoryCategoriesModule,
    companyInventoryItemPostingProfilesModule,
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
    companyAuditModule,
    companySwitcherModule,
    financialDocumentProcessingEngineModule,
    taxModule,
  ],
  install: coreInstall,
  scripts: {
    purgeAndRecreate,
    sampleData: installSampleData,
  },
} as const satisfies VoyzuPackageDefinition;

export default corePackage;
