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
import { controlAccountsModule } from "./modules/control-accounts/module";
import { bankCashAccountsModule } from "./modules/bank-cash-accounts/module";
import { dimensionsModule } from "./modules/dimensions/module";
import { financialDocumentDefaultsModule } from "./modules/financial-document-defaults/module";
import { financialDocumentTypesModule } from "./modules/financial-document-types/module";
import { glAccountCategoriesModule } from "./modules/gl-account-categories/module";
import { glAccountsModule } from "./modules/gl-accounts/module";
import { inventoryControlAccountsModule } from "./modules/inventory-control-accounts/module";
import { inventoryItemPostingProfilesModule } from "./modules/inventory-item-posting-profiles/module";
import { inventoryItemPostingProfileAssignmentsModule } from "./modules/inventory-item-posting-profile-assignments/module";
import { reportsModule } from "./modules/reports/module";
import { taxControlAccountsModule } from "./modules/tax-control-accounts/module";
import { financialDocumentProcessingEngineModule } from "./modules/financial-document-processing-engine/module";
import { financialYearsModule } from "./modules/financial-years/module";
import { organizationFinanceModule } from "./modules/organization-finance/module";
import { countryTaxSettingsModule } from "./modules/country-tax-settings/module";
import { inventoryLedgerModule } from "./modules/inventory-ledger/module";
import { inventoryProcessingModule } from "./modules/inventory-processing/module";
import { arIntegrationProcessingModule } from "./modules/ar-integration-processing/module";
import { journalsModule } from "./modules/journals/module";
import { taxModule } from "./modules/tax/module";
import { taxLedgerModule } from "./modules/tax-ledger/module";

export const financeModules = [
  journalsModule,
  reportsModule,
  inventoryItemPostingProfilesModule,
  inventoryItemPostingProfileAssignmentsModule,
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
  inventoryControlAccountsModule,
  glAccountsModule,
  glAccountCategoriesModule,
  controlAccountsModule,
  bankCashAccountsModule,
  dimensionsModule,
  financialDocumentDefaultsModule,
  financialDocumentTypesModule,
  taxControlAccountsModule,
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
          get: (id: number) => import("./modules/organization-finance/server/lib/finance-company.service").then(async m => {
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
          createFinancialEntity: (input: { organizationId: number }) => import("./modules/organization-finance/server/lib/finance-company.service").then(m => m.createFinancialEntity(input)),
        },
      },
    },
  },
  modules: [
    organizationFinanceModule,
    countryTaxSettingsModule,
    journalsModule,
    reportsModule,
    inventoryItemPostingProfilesModule,
    inventoryItemPostingProfileAssignmentsModule,
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
    inventoryControlAccountsModule,
    glAccountsModule,
    glAccountCategoriesModule,
    controlAccountsModule,
    bankCashAccountsModule,
    dimensionsModule,
    financialDocumentDefaultsModule,
    financialDocumentTypesModule,
    taxControlAccountsModule,
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
