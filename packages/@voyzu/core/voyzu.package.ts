import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

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
  dependencies: [],
  modules: [
    organizationModule,
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
  install: {
    sql: [
      "./install/db/objects/accounting-domains.sql",
      "./install/db/objects/table.organization.create.sql",
      "./install/db/objects/table.currency.create.sql",
      "./install/db/objects/table.country.create.sql",
      "./install/db/objects/table.company.create.sql",
      "./install/db/objects/table.app-user-assignment.create.sql",
      "./install/db/objects/table.financial_document_type.create.sql",
      "./install/db/objects/table.gl_account_category.create.sql",
      "./install/db/objects/table.gl_account.create.sql",
      "./install/db/objects/table.bank_cash_control_account.create.sql",
      "./install/db/objects/table.ap_control_account.create.sql",
      "./install/db/objects/table.ar_control_account.create.sql",
      "./install/db/objects/table.inventory_control_account.create.sql",
      "./install/db/objects/table.tax_control_account.create.sql",
      "./install/db/objects/table.item_posting_profile.create.sql",
      "./install/db/objects/table.inventory_category.create.sql",
      "./install/db/objects/table.inventory_item.create.sql",
      "./install/db/objects/table.dimension.create.sql",
      "./install/db/objects/table.dimension_value.create.sql",
      "./install/db/objects/table.fiscal_year.create.sql",
      "./install/db/objects/table.fiscal_period.create.sql",
      "./install/db/objects/table.posting_batch.create.sql",
      "./install/db/objects/table.journal_header.create.sql",
      "./install/db/objects/table.journal_line.create.sql",
      "./install/db/objects/table.journal_line_dimension.create.sql",
      "./install/db/objects/table.tax_rule.create.sql",
      "./install/db/objects/table.tax_authority.create.sql",
      "./install/db/objects/table.tax_component.create.sql",
      "./install/db/objects/table.ap_counterparty.create.sql",
      "./install/db/objects/table.ar_counterparty.create.sql",
      "./install/db/objects/table.ap_subledger_entry_header.create.sql",
      "./install/db/objects/table.ap_subledger_entry_line.create.sql",
      "./install/db/objects/table.ar_subledger_entry_header.create.sql",
      "./install/db/objects/table.ar_subledger_entry_line.create.sql",
      "./install/db/objects/table.inventory_ledger_entry_header.create.sql",
      "./install/db/objects/table.inventory_ledger_entry_line.create.sql",
      "./install/db/objects/table.tax_ledger_entry_header.create.sql",
      "./install/db/objects/table.tax_ledger_entry_line.create.sql",
      "./install/db/objects/table.financial_document_default.create.sql",
      "./install/db/objects/table.trial_balance_snapshot.create.sql",
      "./install/db/objects/trigger.gl_account_type_match.create.sql",
      "./install/db/objects/trigger.bank_cash_control_account_validate.create.sql",
      "./install/db/objects/trigger.fiscal_year_validate.create.sql",
      "./install/db/objects/trigger.fiscal_period_validate.create.sql",
      "./install/db/objects/trigger.journal_validate.create.sql",
      "./install/db/objects/trigger.journal_line_validate.create.sql",
      "./install/db/objects/triggers.business.attach.sql",
      "./install/db/objects/audit-triggers.attach.sql",
    ],
    seedSql: [
      "./install/db/seed/organization.seed.sql",
      "./install/db/seed/currency.seed.sql",
      "./install/db/seed/country.seed.sql",
      "./install/db/seed/tax-authority.seed.sql",
      "./install/db/seed/tax-rule.seed.sql",
      "./install/db/seed/tax-component.seed.sql",
      "./install/db/seed/company.seed.sql",
      "./install/db/seed/financial-document-type.seed.sql",
      "./install/db/seed/gl-account-category.seed.sql",
      "./install/db/seed/gl-account.seed.sql",
      "./install/db/seed/bank-cash-control-account.seed.sql",
      "./install/db/seed/ap-control-account.seed.sql",
      "./install/db/seed/ar-control-account.seed.sql",
      "./install/db/seed/inventory-control-account.seed.sql",
      "./install/db/seed/tax-control-account.seed.sql",
      "./install/db/seed/item-posting-profile.seed.sql",
      "./install/db/seed/inventory-category.seed.sql",
      "./install/db/seed/inventory-item.seed.sql",
      "./install/db/seed/dimension.seed.sql",
      "./install/db/seed/dimension-value.seed.sql",
      "./install/db/seed/financial-document-default.seed.sql",
      "./install/db/seed/fiscal-year.seed.sql",
      "./install/db/seed/fiscal-period.seed.sql",
    ],
  },
  scripts: {
    sampleData: installSampleData,
  },
} as const satisfies VoyzuPackageDefinition;

export default corePackage;
