import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

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
      "./install/db/sql/table.organization.create.sql",
      "./install/db/sql/table.currency.create.sql",
      "./install/db/sql/table.country.create.sql",
      "./install/db/sql/table.company.create.sql",
      "./install/db/sql/table.financial_document_type.create.sql",
      "./install/db/sql/table.gl_account_category.create.sql",
      "./install/db/sql/table.gl_account.create.sql",
      "./install/db/sql/table.bank_cash_control_account.create.sql",
      "./install/db/sql/table.ap_control_account.create.sql",
      "./install/db/sql/table.ar_control_account.create.sql",
      "./install/db/sql/table.inventory_control_account.create.sql",
      "./install/db/sql/table.tax_control_account.create.sql",
      "./install/db/sql/table.item_posting_profile.create.sql",
      "./install/db/sql/table.inventory_category.create.sql",
      "./install/db/sql/table.inventory_item.create.sql",
      "./install/db/sql/table.dimension.create.sql",
      "./install/db/sql/table.dimension_value.create.sql",
      "./install/db/sql/table.fiscal_year.create.sql",
      "./install/db/sql/table.fiscal_period.create.sql",
      "./install/db/sql/table.posting_batch.create.sql",
      "./install/db/sql/table.journal_header.create.sql",
      "./install/db/sql/table.journal_line.create.sql",
      "./install/db/sql/table.journal_line_dimension.create.sql",
      "./install/db/sql/table.tax_rule.create.sql",
      "./install/db/sql/table.tax_authority.create.sql",
      "./install/db/sql/table.tax_component.create.sql",
      "./install/db/sql/table.ap_counterparty.create.sql",
      "./install/db/sql/table.ar_counterparty.create.sql",
      "./install/db/sql/table.ap_subledger_entry_header.create.sql",
      "./install/db/sql/table.ap_subledger_entry_line.create.sql",
      "./install/db/sql/table.ar_subledger_entry_header.create.sql",
      "./install/db/sql/table.ar_subledger_entry_line.create.sql",
      "./install/db/sql/table.inventory_ledger_entry_header.create.sql",
      "./install/db/sql/table.inventory_ledger_entry_line.create.sql",
      "./install/db/sql/table.tax_ledger_entry_header.create.sql",
      "./install/db/sql/table.tax_ledger_entry_line.create.sql",
      "./install/db/sql/table.financial_document_default.create.sql",
      "./install/db/sql/table.trial_balance_snapshot.create.sql",
      "./install/db/sql/trigger.gl_account_type_match.create.sql",
      "./install/db/sql/trigger.bank_cash_control_account_validate.create.sql",
      "./install/db/sql/trigger.fiscal_year_validate.create.sql",
      "./install/db/sql/trigger.fiscal_period_validate.create.sql",
      "./install/db/sql/trigger.journal_validate.create.sql",
      "./install/db/sql/trigger.journal_line_validate.create.sql",
      "./install/db/sql/triggers.business.attach.sql",
      "./install/db/sql/audit-triggers.attach.sql",
    ],
  },
} as const satisfies VoyzuPackageDefinition;

export default corePackage;
