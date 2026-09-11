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
import { operationsInvoicesModule } from "./modules/operations-invoices/module";
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
import { inventoryProcessingModule } from "./modules/inventory-processing/module";
import { arIntegrationProcessingModule } from "./modules/ar-integration-processing/module";
import { journalsModule } from "./modules/journals/module";
import { taxModule } from "./modules/tax/module";
import { taxLedgerModule } from "./modules/tax-ledger/module";

export const financeModules = [
  journalsModule,
  companyReportsModule,
  companyInventoryItemPostingProfilesModule,
  companyInventoryItemPostingProfileAssignmentsModule,
  inventoryLedgerModule,
  inventoryProcessingModule,
  arIntegrationProcessingModule,
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
  operationsInvoicesModule,
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
  contracts: {
    semanticDataDefinition: {
      implements: {
        "country.finance": {
          get: (code: string) => import("./modules/country-tax-settings/server/lib/country-tax-setting.service").then(async m => {
            const value = await m.getCountryTaxSetting(code);
            if (!value) return null;
            const { financialPeriodStartMonth, taxFilingAnchorMonth, taxFilingIntervalMonths, taxAuthorities, taxRules, taxComponents } = value;
            return { code: value.code, financialPeriodStartMonth, taxFilingAnchorMonth, taxFilingIntervalMonths, taxAuthorities, taxRules, taxComponents };
          }),
        },
        "organization.finance": {
          get: (id: number) => import("./modules/finance-companies/server/lib/finance-company.service").then(async m => {
            const value = await m.getOrganizationFinanceMasterData(id);
            if (!value) return null;
            const { financeCompanyId, financeEnabled, taxFilingAnchorMonth, taxFilingIntervalMonths, reportLine1, reportLine2, reportFooter, hasPostings } = value;
            return { id, financeCompanyId, financeEnabled, taxFilingAnchorMonth, taxFilingIntervalMonths, reportLine1, reportLine2, reportFooter, hasPostings };
          }),
        },
      },
    },
    semanticCapabilityDefinition: {
      implements: {
        "erp.inventory-finance": {
          processInventoryMovement: (input: Parameters<typeof import("./modules/inventory-processing/server/lib/inventory-finance.provider").processInventoryMovementCapability>[0]) =>
            import("./modules/inventory-processing/server/lib/inventory-finance.provider").then(m => m.processInventoryMovementCapability(input)),
        },
        "erp.organization-finance": {
          createFinancialEntity: (input: { organizationId: number }) => import("./modules/finance-companies/server/lib/finance-company.service").then(m => m.createFinancialEntity(input)),
        },
      },
    },
  },
  modules: [
    financeCompaniesModule,
    countryTaxSettingsModule,
    journalsModule,
    companyReportsModule,
    companyInventoryItemPostingProfilesModule,
    companyInventoryItemPostingProfileAssignmentsModule,
    inventoryLedgerModule,
    inventoryProcessingModule,
    arIntegrationProcessingModule,
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
    operationsInvoicesModule,
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
