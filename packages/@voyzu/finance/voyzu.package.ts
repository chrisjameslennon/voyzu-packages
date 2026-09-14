import { httpApiRoutes as routes0 } from "./modules/ap-subledger-counterparties/http-api.routes";
import { httpApiRoutes as routes1 } from "./modules/ap-subledger-ledger-entries/http-api.routes";
import { httpApiRoutes as routes2 } from "./modules/ap-subledger-statements/http-api.routes";
import { httpApiRoutes as routes3 } from "./modules/ar-subledger-counterparties/http-api.routes";
import { httpApiRoutes as routes4 } from "./modules/ar-subledger-ledger-entries/http-api.routes";
import { httpApiRoutes as routes5 } from "./modules/ar-subledger-statements/http-api.routes";
import { httpApiRoutes as routes6 } from "./modules/bank-cash-accounts/http-api.routes";
import { httpApiRoutes as routes7 } from "./modules/control-accounts/http-api.routes";
import { httpApiRoutes as routes8 } from "./modules/country-tax-settings/http-api.routes";
import { httpApiRoutes as routes9 } from "./modules/dimensions/http-api.routes";
import { httpApiRoutes as routes10 } from "./modules/financial-document-defaults/http-api.routes";
import { httpApiRoutes as routes11 } from "./modules/financial-document-processing-engine/http-api.routes";
import { httpApiRoutes as routes12 } from "./modules/financial-document-types/http-api.routes";
import { httpApiRoutes as routes13 } from "./modules/financial-years/http-api.routes";
import { httpApiRoutes as routes14 } from "./modules/gl-account-categories/http-api.routes";
import { httpApiRoutes as routes15 } from "./modules/gl-accounts/http-api.routes";
import { httpApiRoutes as routes16 } from "./modules/inventory-control-accounts/http-api.routes";
import { httpApiRoutes as routes17 } from "./modules/inventory-item-posting-profile-assignments/http-api.routes";
import { httpApiRoutes as routes18 } from "./modules/inventory-item-posting-profiles/http-api.routes";
import { httpApiRoutes as routes19 } from "./modules/inventory-ledger/http-api.routes";
import { httpApiRoutes as routes20 } from "./modules/inventory-processing/http-api.routes";
import { httpApiRoutes as routes21 } from "./modules/organization-finance/http-api.routes";
import { httpApiRoutes as routes22 } from "./modules/reports/http-api.routes";
import { httpApiRoutes as routes23 } from "./modules/tax/http-api.routes";
import { httpApiRoutes as routes24 } from "./modules/tax-control-accounts/http-api.routes";
import { httpApiRoutes as routes25 } from "./modules/tax-ledger/http-api.routes";
import { httpApiDocumentation } from "./http-api.contracts";
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
    httpApiRouting: {
      roots: ["/finance"],
      routes: { ...routes0, ...routes1, ...routes2, ...routes3, ...routes4, ...routes5, ...routes6, ...routes7, ...routes8, ...routes9, ...routes10, ...routes11, ...routes12, ...routes13, ...routes14, ...routes15, ...routes16, ...routes17, ...routes18, ...routes19, ...routes20, ...routes21, ...routes22, ...routes23, ...routes24, ...routes25 },
    },
    httpApiDocumentation,
    internalApi: { implements: { ...organizationFinanceModule.implements, ...countryTaxSettingsModule.implements, ...inventoryProcessingModule.implements } },

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
