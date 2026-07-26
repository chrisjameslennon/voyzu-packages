import { companyReportsModule } from "@voyzu-modules/core/company-reports";
import { BalanceSheetReportPage } from "@voyzu-modules/core/company-reports/balance-sheet/server";
import { TrialBalanceReportPage } from "@voyzu-modules/core/company-reports/trial-balance/server";
import { TaxPositionReportPage } from "@voyzu-modules/core/company-reports/tax-position/server";
import { BankCashMovementReportPage } from "@voyzu-modules/core/company-reports/bank-cash-movement/server";
import { JournalEntriesReportPage } from "@voyzu-modules/core/company-reports/journal-entries/server";
import { AccountActivityReportPage } from "@voyzu-modules/core/company-reports/account-activity/server";
import { FinancialIntegrityReportPage } from "@voyzu-modules/core/company-reports/financial-integrity/server";
import { ProfitLossAnalysisReportPage, ProfitLossReportPage } from "@voyzu-modules/core/company-reports/profit-loss/server";
import { TaxActivityReportPage } from "@voyzu-modules/core/company-reports/tax-activity/server";
import { TaxActivityReconciliationReportPage } from "@voyzu-modules/core/company-reports/tax-activity-reconciliation/server";
import { ArSubledgerEntriesAuditReportPage } from "@voyzu-modules/core/company-reports/ar-subledger-entries-audit/server";
import { ApSubledgerEntriesAuditReportPage } from "@voyzu-modules/core/company-reports/ap-subledger-entries-audit/server";
import { InventoryLedgerEntriesAuditReportPage } from "@voyzu-modules/core/company-reports/inventory-ledger-entries-audit/server";
import { TaxLedgerEntriesAuditReportPage } from "@voyzu-modules/core/company-reports/tax-ledger-entries-audit/server";
import { apSubledgerBillsModule } from "@voyzu-modules/core/ap-subledger-bills";
import { ApBillDetailPage, ApBillsListPage } from "@voyzu-modules/core/ap-subledger-bills/server";
import { apSubledgerCounterpartiesModule } from "@voyzu-modules/core/ap-subledger-counterparties";
import { ApCounterpartiesListPage, ApCounterpartyDetailPage } from "@voyzu-modules/core/ap-subledger-counterparties/server";
import { apSubledgerLedgerEntriesModule } from "@voyzu-modules/core/ap-subledger-ledger-entries";
import { ApLedgerEntriesListPage, ApLedgerEntryDetailPage } from "@voyzu-modules/core/ap-subledger-ledger-entries/server";
import { apSubledgerLedgerEntryEnquiryModule } from "@voyzu-modules/core/ap-subledger-ledger-entry-enquiry";
import { ApLedgerEntryEnquiryDetailPage, ApLedgerEntryEnquiryListPage } from "@voyzu-modules/core/ap-subledger-ledger-entry-enquiry/server";
import { apSubledgerStatementsModule } from "@voyzu-modules/core/ap-subledger-statements";
import { ApStatementDetailPage, ApStatementsListPage } from "@voyzu-modules/core/ap-subledger-statements/server";
import { arSubledgerCounterpartiesModule } from "@voyzu-modules/core/ar-subledger-counterparties";
import { ArCounterpartiesListPage, ArCounterpartyDetailPage } from "@voyzu-modules/core/ar-subledger-counterparties/server";
import { arSubledgerInvoicesModule } from "@voyzu-modules/core/ar-subledger-invoices";
import { ArInvoiceDetailPage, ArInvoicePrintablePage, ArInvoicesListPage } from "@voyzu-modules/core/ar-subledger-invoices/server";
import { arSubledgerLedgerEntriesModule } from "@voyzu-modules/core/ar-subledger-ledger-entries";
import { ArLedgerEntriesListPage, ArLedgerEntryDetailPage } from "@voyzu-modules/core/ar-subledger-ledger-entries/server";
import { arSubledgerLedgerEntryEnquiryModule } from "@voyzu-modules/core/ar-subledger-ledger-entry-enquiry";
import { ArLedgerEntryEnquiryDetailPage, ArLedgerEntryEnquiryListPage } from "@voyzu-modules/core/ar-subledger-ledger-entry-enquiry/server";
import { arSubledgerStatementsModule } from "@voyzu-modules/core/ar-subledger-statements";
import { ArStatementDetailPage, ArStatementsListPage } from "@voyzu-modules/core/ar-subledger-statements/server";
import { financialYearsModule } from "@voyzu-modules/core/financial-years";
import { FinancialYearDetailPage, FinancialYearsListPage } from "@voyzu-modules/core/financial-years/server";
import { companyBankCashAccountsModule } from "@voyzu-modules/core/company-bank-cash-accounts";
import { CompanyBankCashAccountDetailPage, CompanyBankCashAccountsListPage } from "@voyzu-modules/core/company-bank-cash-accounts/server";
import { companyApControlAccountsModule } from "@voyzu-modules/core/company-ap-control-accounts";
import { CompanyApControlAccountDetailPage, CompanyApControlAccountsListPage } from "@voyzu-modules/core/company-ap-control-accounts/server";
import { companyArControlAccountsModule } from "@voyzu-modules/core/company-ar-control-accounts";
import { CompanyArControlAccountDetailPage, CompanyArControlAccountsListPage } from "@voyzu-modules/core/company-ar-control-accounts/server";
import { companyDimensionsModule } from "@voyzu-modules/core/company-dimensions";
import { CompanyDimensionDetailPage, CompanyDimensionsListPage } from "@voyzu-modules/core/company-dimensions/server";
import { companyFinancialDocumentTypesModule } from "@voyzu-modules/core/company-financial-document-types";
import { CompanyFinancialDocumentTypeDetailPage, CompanyFinancialDocumentTypesListPage } from "@voyzu-modules/core/company-financial-document-types/server";
import { companyGlAccountCategoriesModule } from "@voyzu-modules/core/company-gl-account-categories";
import { CompanyGlAccountCategoriesListPage, CompanyGlAccountCategoryDetailPage } from "@voyzu-modules/core/company-gl-account-categories/server";
import { companyGlAccountsModule } from "@voyzu-modules/core/company-gl-accounts";
import { CompanyGlAccountDetailPage, CompanyGlAccountsListPage } from "@voyzu-modules/core/company-gl-accounts/server";
import { companyInventoryCategoriesModule } from "@voyzu-modules/core/company-inventory-categories";
import { CompanyInventoryCategoriesListPage, CompanyInventoryCategoryDetailPage } from "@voyzu-modules/core/company-inventory-categories/server";
import { companyInventoryControlAccountsModule } from "@voyzu-modules/core/company-inventory-control-accounts";
import { CompanyInventoryControlAccountDetailPage, CompanyInventoryControlAccountsPage } from "@voyzu-modules/core/company-inventory-control-accounts/server";
import { companyInventoryItemsModule } from "@voyzu-modules/core/company-inventory-items";
import { InventoryItemDetailPage, InventoryItemsListPage } from "@voyzu-modules/core/company-inventory-items/server";
import { inventoryLedgerModule } from "@voyzu-modules/core/inventory-ledger";
import { InventoryLedgerEntriesListPage, InventoryLedgerEntryDetailPage } from "@voyzu-modules/core/inventory-ledger/server";
import { companyInventoryItemPostingProfilesModule } from "@voyzu-modules/core/company-inventory-item-posting-profiles";
import { CompanyInventoryItemPostingProfileDetailPage, CompanyInventoryItemPostingProfilesListPage } from "@voyzu-modules/core/company-inventory-item-posting-profiles/server";
import { companyFinancialDocumentDefaultsModule } from "@voyzu-modules/core/company-financial-document-defaults";
import { CompanyFinancialDocumentDefaultDetailPage, CompanyFinancialDocumentDefaultsListPage } from "@voyzu-modules/core/company-financial-document-defaults/server";
import { companyTaxControlAccountsModule } from "@voyzu-modules/core/company-tax-control-accounts";
import { CompanyTaxControlAccountDetailPage, CompanyTaxControlAccountsPage } from "@voyzu-modules/core/company-tax-control-accounts/server";
import { taxLedgerModule } from "@voyzu-modules/core/tax-ledger";
import { TaxLedgerEntriesListPage, TaxLedgerEntryDetailPage } from "@voyzu-modules/core/tax-ledger/server";
import { journalsModule } from "@voyzu-modules/core/journals";
import { JournalDetailPage, JournalsListPage } from "@voyzu-modules/core/journals/server";
import { companyAuditModule } from "@voyzu-modules/core/company-audit";
import {
  FinanceAuditEventDetailPage,
  FinanceAuditEventsPage,
} from "@voyzu-modules/core/company-audit/server";
import type { VoyzuSurfaceNavGroup, VoyzuSurfaceRoute } from "@voyzu/ui-surface/types";

const financeAuth = { required: true, minRole: "COMPANY_USER" } as const;


const financePageRouteDefinitions: VoyzuSurfaceRoute[] = [
  {
    ...journalsModule.pageRoutes.list,
    path: "/finance/journals",
    Page: JournalsListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Company General Ledger" },
    ],
  },
  {
    ...journalsModule.pageRoutes.detail,
    path: "/finance/journals/[code]",
    Page: JournalDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Company General Ledger" },
      { label: "Journal Entries", href: "/finance/journals" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.balanceSheet,
    path: "/finance/reports/balance-sheet",
    Page: BalanceSheetReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/balance-sheet" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.trialBalance,
    path: "/finance/reports/trial-balance",
    Page: TrialBalanceReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/trial-balance" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.taxPosition,
    path: "/finance/reports/tax-position",
    Page: TaxPositionReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/tax-position" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.bankCashMovement,
    path: "/finance/reports/bank-cash-movement",
    Page: BankCashMovementReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/bank-cash-movement" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.journalEntries,
    path: "/finance/reports/journal-entries",
    Page: JournalEntriesReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/journal-entries" },
      { label: "Audit", href: "/finance/reports/journal-entries" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.accountActivity,
    path: "/finance/general-ledger/account-activity",
    Page: AccountActivityReportPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Company General Ledger" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.financialIntegrity,
    path: "/finance/reports/financial-integrity",
    Page: FinancialIntegrityReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/financial-integrity" },
      { label: "Audit", href: "/finance/reports/financial-integrity" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.profitLoss,
    path: "/finance/reports/profit-loss",
    Page: ProfitLossReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/profit-loss" },
      { label: "Movement", href: "/finance/reports/profit-loss" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.profitLossAnalysis,
    path: "/finance/reports/profit-loss-analysis",
    Page: ProfitLossAnalysisReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/profit-loss-analysis" },
      { label: "Movement", href: "/finance/reports/profit-loss-analysis" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.taxActivity,
    path: "/finance/reports/tax-activity",
    Page: TaxActivityReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/tax-activity" },
      { label: "Movement", href: "/finance/reports/tax-activity" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.taxActivityReconciliation,
    path: "/finance/reports/tax-activity-reconciliation",
    Page: TaxActivityReconciliationReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/tax-activity-reconciliation" },
      { label: "Reconciliation", href: "/finance/reports/tax-activity-reconciliation" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.arSubledgerEntriesAudit,
    path: "/finance/reports/ar-subledger-entries-audit",
    Page: ArSubledgerEntriesAuditReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/ar-subledger-entries-audit" },
      { label: "Audit", href: "/finance/reports/ar-subledger-entries-audit" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.apSubledgerEntriesAudit,
    path: "/finance/reports/ap-subledger-entries-audit",
    Page: ApSubledgerEntriesAuditReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/ap-subledger-entries-audit" },
      { label: "Audit", href: "/finance/reports/ap-subledger-entries-audit" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.inventoryLedgerEntriesAudit,
    path: "/finance/reports/inventory-ledger-entries-audit",
    Page: InventoryLedgerEntriesAuditReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/inventory-ledger-entries-audit" },
      { label: "Audit", href: "/finance/reports/inventory-ledger-entries-audit" },
    ],
  },
  {
    ...companyReportsModule.pageRoutes.taxLedgerEntriesAudit,
    path: "/finance/reports/tax-ledger-entries-audit",
    Page: TaxLedgerEntriesAuditReportPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Reports", href: "/finance/reports/tax-ledger-entries-audit" },
      { label: "Audit", href: "/finance/reports/tax-ledger-entries-audit" },
    ],
  },
  {
    ...companyInventoryItemsModule.pageRoutes.list,
    path: "/finance/inventory/items",
    Page: InventoryItemsListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Inventory", href: "/finance/inventory/items" },
    ],
  },
  {
    ...companyInventoryItemsModule.pageRoutes.detail,
    path: "/finance/inventory/items/[code]",
    Page: InventoryItemDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Inventory", href: "/finance/inventory/items" },
      { label: "Items", href: "/finance/inventory/items" },
    ],
  },
  {
    ...companyInventoryCategoriesModule.pageRoutes.list,
    path: "/finance/inventory/categories",
    Page: CompanyInventoryCategoriesListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Inventory", href: "/finance/inventory/categories" },
    ],
  },
  {
    ...companyInventoryCategoriesModule.pageRoutes.detail,
    path: "/finance/inventory/categories/[code]",
    Page: CompanyInventoryCategoryDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Inventory", href: "/finance/inventory/categories" },
      { label: "Categories", href: "/finance/inventory/categories" },
    ],
  },
  {
    ...companyInventoryItemPostingProfilesModule.pageRoutes.list,
    path: "/finance/inventory/item-posting-profiles",
    Page: CompanyInventoryItemPostingProfilesListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
    ],
  },
  {
    ...companyInventoryItemPostingProfilesModule.pageRoutes.detail,
    path: "/finance/inventory/item-posting-profiles/[code]",
    Page: CompanyInventoryItemPostingProfileDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Item Posting Profiles", href: "/finance/inventory/item-posting-profiles" },
    ],
  },
  {
    ...inventoryLedgerModule.pageRoutes.list,
    path: "/finance/inventory/ledger",
    Page: InventoryLedgerEntriesListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Inventory", href: "/finance/inventory/ledger" },
    ],
  },
  {
    ...inventoryLedgerModule.pageRoutes.detail,
    path: "/finance/inventory/ledger/[code]",
    Page: InventoryLedgerEntryDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Inventory", href: "/finance/inventory/ledger" },
      { label: "Inventory Ledger Entries", href: "/finance/inventory/ledger" },
    ],
  },
  {
    ...taxLedgerModule.pageRoutes.list,
    path: "/finance/subledgers/tax/ledger-entries",
    Page: TaxLedgerEntriesListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/tax/ledger-entries" },
      { label: "Tax Ledger", href: "/finance/subledgers/tax/ledger-entries" },
    ],
  },
  {
    ...taxLedgerModule.pageRoutes.detail,
    path: "/finance/subledgers/tax/ledger-entries/[code]",
    Page: TaxLedgerEntryDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/tax/ledger-entries" },
      { label: "Tax Ledger Entries", href: "/finance/subledgers/tax/ledger-entries" },
    ],
  },
  {
    ...apSubledgerLedgerEntriesModule.pageRoutes.list,
    path: "/finance/subledgers/ap/ledger-entries",
    Page: ApLedgerEntriesListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ap/ledger-entries" },
      { label: "AP Subledger", href: "/finance/subledgers/ap/ledger-entries" },
    ],
  },
  {
    ...apSubledgerLedgerEntriesModule.pageRoutes.detail,
    path: "/finance/subledgers/ap/ledger-entries/[code]",
    Page: ApLedgerEntryDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ap/ledger-entries" },
      { label: "AP Ledger Entries", href: "/finance/subledgers/ap/ledger-entries" },
    ],
  },
  {
    ...apSubledgerLedgerEntryEnquiryModule.pageRoutes.list,
    path: "/finance/subledgers/ap/ledger-entry-enquiry",
    Page: ApLedgerEntryEnquiryListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ap/ledger-entry-enquiry" },
      { label: "Accounts Payable", href: "/finance/subledgers/ap/ledger-entries" },
    ],
  },
  {
    ...apSubledgerLedgerEntryEnquiryModule.pageRoutes.detail,
    path: "/finance/subledgers/ap/ledger-entry-enquiry/[code]",
    Page: ApLedgerEntryEnquiryDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ap/ledger-entry-enquiry" },
      { label: "AP Ledger Entry Enquiry", href: "/finance/subledgers/ap/ledger-entry-enquiry" },
    ],
  },
  {
    ...apSubledgerCounterpartiesModule.pageRoutes.list,
    path: "/finance/subledgers/ap/counterparties",
    Page: ApCounterpartiesListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ap/counterparties" },
      { label: "AP Subledger", href: "/finance/subledgers/ap/counterparties" },
    ],
  },
  {
    ...apSubledgerCounterpartiesModule.pageRoutes.detail,
    path: "/finance/subledgers/ap/counterparties/[code]",
    Page: ApCounterpartyDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ap/counterparties" },
      { label: "AP Counterparties", href: "/finance/subledgers/ap/counterparties" },
    ],
  },
  {
    ...apSubledgerStatementsModule.pageRoutes.list,
    path: "/finance/subledgers/ap/statements",
    Page: ApStatementsListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ap/statements" },
      { label: "Accounts Payable", href: "/finance/subledgers/ap/ledger-entries" },
    ],
  },
  {
    ...apSubledgerStatementsModule.pageRoutes.detail,
    path: "/finance/subledgers/ap/statements/[code]",
    Page: ApStatementDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ap/statements" },
      { label: "AP Statements", href: "/finance/subledgers/ap/statements" },
    ],
  },
  {
    ...apSubledgerBillsModule.pageRoutes.list,
    path: "/finance/subledgers/ap/bills",
    Page: ApBillsListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ap/bills" },
      { label: "Accounts Payable", href: "/finance/subledgers/ap/ledger-entries" },
    ],
  },
  {
    ...apSubledgerBillsModule.pageRoutes.detail,
    path: "/finance/subledgers/ap/bills/[documentId]",
    Page: ApBillDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ap/bills" },
      { label: "AP Bills", href: "/finance/subledgers/ap/bills" },
    ],
  },
  {
    ...arSubledgerLedgerEntriesModule.pageRoutes.list,
    path: "/finance/subledgers/ar/ledger-entries",
    Page: ArLedgerEntriesListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ar/ledger-entries" },
      { label: "AR Subledger", href: "/finance/subledgers/ar/ledger-entries" },
    ],
  },
  {
    ...arSubledgerLedgerEntriesModule.pageRoutes.detail,
    path: "/finance/subledgers/ar/ledger-entries/[code]",
    Page: ArLedgerEntryDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ar/ledger-entries" },
      { label: "AR Ledger Entries", href: "/finance/subledgers/ar/ledger-entries" },
    ],
  },
  {
    ...arSubledgerLedgerEntryEnquiryModule.pageRoutes.list,
    path: "/finance/subledgers/ar/ledger-entry-enquiry",
    Page: ArLedgerEntryEnquiryListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ar/ledger-entry-enquiry" },
      { label: "Accounts Receivable", href: "/finance/subledgers/ar/ledger-entries" },
    ],
  },
  {
    ...arSubledgerLedgerEntryEnquiryModule.pageRoutes.detail,
    path: "/finance/subledgers/ar/ledger-entry-enquiry/[code]",
    Page: ArLedgerEntryEnquiryDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ar/ledger-entry-enquiry" },
      { label: "AR Ledger Entry Enquiry", href: "/finance/subledgers/ar/ledger-entry-enquiry" },
    ],
  },
  {
    ...arSubledgerCounterpartiesModule.pageRoutes.list,
    path: "/finance/subledgers/ar/counterparties",
    Page: ArCounterpartiesListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ar/counterparties" },
      { label: "AR Subledger", href: "/finance/subledgers/ar/counterparties" },
    ],
  },
  {
    ...arSubledgerCounterpartiesModule.pageRoutes.detail,
    path: "/finance/subledgers/ar/counterparties/[code]",
    Page: ArCounterpartyDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ar/counterparties" },
      { label: "AR Counterparties", href: "/finance/subledgers/ar/counterparties" },
    ],
  },
  {
    ...arSubledgerStatementsModule.pageRoutes.list,
    path: "/finance/subledgers/ar/statements",
    Page: ArStatementsListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ar/statements" },
      { label: "Accounts Receivable", href: "/finance/subledgers/ar/ledger-entries" },
    ],
  },
  {
    ...arSubledgerStatementsModule.pageRoutes.detail,
    path: "/finance/subledgers/ar/statements/[code]",
    Page: ArStatementDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ar/statements" },
      { label: "AR Statements", href: "/finance/subledgers/ar/statements" },
    ],
  },
  {
    ...arSubledgerInvoicesModule.pageRoutes.list,
    path: "/finance/subledgers/ar/invoices",
    Page: ArInvoicesListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ar/invoices" },
      { label: "Accounts Receivable", href: "/finance/subledgers/ar/ledger-entries" },
    ],
  },
  {
    ...arSubledgerInvoicesModule.pageRoutes.detail,
    path: "/finance/subledgers/ar/invoices/[documentId]",
    Page: ArInvoiceDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Subledgers", href: "/finance/subledgers/ar/invoices" },
      { label: "AR Invoices", href: "/finance/subledgers/ar/invoices" },
    ],
  },
  {
    ...companyInventoryControlAccountsModule.pageRoutes.list,
    path: "/finance/settings/control-accounts/inventory",
    Page: CompanyInventoryControlAccountsPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/control-accounts/inventory" },
      { label: "Control Accounts", href: "/finance/settings/control-accounts/ap" },
    ],
  },
  {
    ...companyInventoryControlAccountsModule.pageRoutes.detail,
    path: "/finance/settings/control-accounts/inventory/[code]",
    Page: CompanyInventoryControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/control-accounts/inventory" },
      { label: "Inventory Control Accounts", href: "/finance/settings/control-accounts/inventory" },
    ],
  },
  {
    ...companyGlAccountsModule.pageRoutes.list,
    path: "/finance/settings/gl-accounts",
    Page: CompanyGlAccountsListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/gl-accounts" },
      { label: "General Ledger", href: "/finance/settings/gl-accounts" },
    ],
  },
  {
    ...companyGlAccountsModule.pageRoutes.detail,
    path: "/finance/settings/gl-accounts/[code]",
    Page: CompanyGlAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/gl-accounts" },
      { label: "General Ledger", href: "/finance/settings/gl-accounts" },
      { label: "General Ledger Accounts", href: "/finance/settings/gl-accounts" },
    ],
  },
  {
    ...companyGlAccountCategoriesModule.pageRoutes.list,
    path: "/finance/settings/reporting-categories",
    Page: CompanyGlAccountCategoriesListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/reporting-categories" },
      { label: "General Ledger", href: "/finance/settings/gl-accounts" },
    ],
  },
  {
    ...companyGlAccountCategoriesModule.pageRoutes.detail,
    path: "/finance/settings/reporting-categories/[code]",
    Page: CompanyGlAccountCategoryDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/reporting-categories" },
      { label: "General Ledger", href: "/finance/settings/gl-accounts" },
      { label: "Reporting Categories", href: "/finance/settings/reporting-categories" },
    ],
  },
  {
    ...companyApControlAccountsModule.pageRoutes.list,
    path: "/finance/settings/control-accounts/ap",
    Page: CompanyApControlAccountsListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/control-accounts/ap" },
      { label: "Accounts Payable Control Accounts", href: "/finance/settings/control-accounts/ap" },
    ],
  },
  {
    ...companyApControlAccountsModule.pageRoutes.detail,
    path: "/finance/settings/control-accounts/ap/[code]",
    Page: CompanyApControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/control-accounts/ap" },
      { label: "Accounts Payable Control Accounts", href: "/finance/settings/control-accounts/ap" },
    ],
  },
  {
    ...companyArControlAccountsModule.pageRoutes.list,
    path: "/finance/settings/control-accounts/ar",
    Page: CompanyArControlAccountsListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/control-accounts/ar" },
      { label: "Control Accounts", href: "/finance/settings/control-accounts/ap" },
    ],
  },
  {
    ...companyArControlAccountsModule.pageRoutes.detail,
    path: "/finance/settings/control-accounts/ar/[code]",
    Page: CompanyArControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/control-accounts/ar" },
      { label: "Accounts Receivable Control Accounts", href: "/finance/settings/control-accounts/ar" },
    ],
  },
  {
    ...companyBankCashAccountsModule.pageRoutes.list,
    path: "/finance/settings/bank-cash-accounts",
    Page: CompanyBankCashAccountsListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/bank-cash-accounts" },
      { label: "Control Accounts", href: "/finance/settings/control-accounts/ap" },
    ],
  },
  {
    ...companyBankCashAccountsModule.pageRoutes.detail,
    path: "/finance/settings/bank-cash-accounts/[code]",
    Page: CompanyBankCashAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/bank-cash-accounts" },
      { label: "Control Accounts", href: "/finance/settings/control-accounts/ap" },
      { label: "Bank / Cash Accounts", href: "/finance/settings/bank-cash-accounts" },
    ],
  },
  {
    ...companyDimensionsModule.pageRoutes.list,
    path: "/finance/settings/dimensions",
    Page: CompanyDimensionsListPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/dimensions" },
    ],
  },
  {
    ...companyDimensionsModule.pageRoutes.detail,
    path: "/finance/settings/dimensions/[code]",
    Page: CompanyDimensionDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/dimensions" },
      { label: "Dimensions", href: "/finance/settings/dimensions" },
    ],
  },
  {
    ...companyFinancialDocumentDefaultsModule.pageRoutes.list,
    path: "/finance/integration/financial-document-defaults",
    Page: () => CompanyFinancialDocumentDefaultsListPage(),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
    ],
  },
  {
    ...companyFinancialDocumentDefaultsModule.pageRoutes.detail,
    path: "/finance/integration/financial-document-defaults/[code]",
    Page: (props) => CompanyFinancialDocumentDefaultDetailPage(props),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Financial Document Defaults", href: "/finance/integration/financial-document-defaults" },
    ],
  },
  {
    ...companyFinancialDocumentTypesModule.pageRoutes.list,
    path: "/finance/integration/financial-document-types",
    Page: () => CompanyFinancialDocumentTypesListPage(),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
    ],
  },
  {
    ...companyFinancialDocumentTypesModule.pageRoutes.detail,
    path: "/finance/integration/financial-document-types/[code]",
    Page: (props) => CompanyFinancialDocumentTypeDetailPage(props),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Financial Document Types", href: "/finance/integration/financial-document-types" },
    ],
  },
  {
    ...companyTaxControlAccountsModule.pageRoutes.list,
    path: "/finance/settings/control-accounts/tax",
    Page: CompanyTaxControlAccountsPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/control-accounts/tax" },
      { label: "Control Accounts", href: "/finance/settings/control-accounts/ap" },
    ],
  },
  {
    ...companyTaxControlAccountsModule.pageRoutes.detail,
    path: "/finance/settings/control-accounts/tax/[code]",
    Page: CompanyTaxControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Settings", href: "/finance/settings/control-accounts/tax" },
      { label: "Tax Control Accounts", href: "/finance/settings/control-accounts/tax" },
    ],
  },
  {
    ...financialYearsModule.pageRoutes.list,
    path: "/finance/financial-periods",
    Page: FinancialYearsListPage,
    breadcrumbBase: [
      { label: "Finance" },
    ],
  },
  {
    ...financialYearsModule.pageRoutes.detail,
    path: "/finance/financial-periods/[code]",
    Page: FinancialYearDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Financial Periods", href: "/finance/financial-periods" },
    ],
  },
  {
    ...companyAuditModule.pageRoutes.list,
    path: "/finance/audit",
    Page: FinanceAuditEventsPage,
    breadcrumbBase: [
      { label: "Finance" },
    ],
  },
  {
    ...companyAuditModule.pageRoutes.detail,
    path: "/finance/audit/[id]",
    Page: FinanceAuditEventDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Audit Log", href: "/finance/audit" },
    ],
  },
  {
    id: `${companyReportsModule.pageRoutes.apSubledgerEntriesAudit.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.apSubledgerEntriesAudit.pageTitle,
    path: "/finance/reports/ap-subledger-entries-audit/printable",
    Page: ApSubledgerEntriesAuditReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.arSubledgerEntriesAudit.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.arSubledgerEntriesAudit.pageTitle,
    path: "/finance/reports/ar-subledger-entries-audit/printable",
    Page: ArSubledgerEntriesAuditReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.balanceSheet.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.balanceSheet.pageTitle,
    path: "/finance/reports/balance-sheet/printable",
    Page: BalanceSheetReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.bankCashMovement.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.bankCashMovement.pageTitle,
    path: "/finance/reports/bank-cash-movement/printable",
    Page: BankCashMovementReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.financialIntegrity.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.financialIntegrity.pageTitle,
    path: "/finance/reports/financial-integrity/printable",
    Page: FinancialIntegrityReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.inventoryLedgerEntriesAudit.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.inventoryLedgerEntriesAudit.pageTitle,
    path: "/finance/reports/inventory-ledger-entries-audit/printable",
    Page: InventoryLedgerEntriesAuditReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.journalEntries.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.journalEntries.pageTitle,
    path: "/finance/reports/journal-entries/printable",
    Page: JournalEntriesReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.profitLoss.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.profitLoss.pageTitle,
    path: "/finance/reports/profit-loss/printable",
    Page: ProfitLossReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.profitLossAnalysis.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.profitLossAnalysis.pageTitle,
    path: "/finance/reports/profit-loss-analysis/printable",
    Page: ProfitLossAnalysisReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.taxActivity.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.taxActivity.pageTitle,
    path: "/finance/reports/tax-activity/printable",
    Page: TaxActivityReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.taxActivityReconciliation.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.taxActivityReconciliation.pageTitle,
    path: "/finance/reports/tax-activity-reconciliation/printable",
    Page: TaxActivityReconciliationReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.taxLedgerEntriesAudit.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.taxLedgerEntriesAudit.pageTitle,
    path: "/finance/reports/tax-ledger-entries-audit/printable",
    Page: TaxLedgerEntriesAuditReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.taxPosition.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.taxPosition.pageTitle,
    path: "/finance/reports/tax-position/printable",
    Page: TaxPositionReportPage,
    unframed: true,
  },
  {
    id: `${companyReportsModule.pageRoutes.trialBalance.id}.printable`,
    pageTitle: companyReportsModule.pageRoutes.trialBalance.pageTitle,
    path: "/finance/reports/trial-balance/printable",
    Page: TrialBalanceReportPage,
    unframed: true,
  },
  {
    id: `${arSubledgerLedgerEntriesModule.pageRoutes.detail.id}.documentPrintable`,
    pageTitle: arSubledgerLedgerEntriesModule.pageRoutes.detail.pageTitle,
    path: "/finance/subledgers/ar/ledger-entries/[code]/document-printable",
    Page: ArLedgerEntryDetailPage,
    unframed: true,
  },
  {
    id: `${arSubledgerStatementsModule.pageRoutes.detail.id}.printable`,
    pageTitle: arSubledgerStatementsModule.pageRoutes.detail.pageTitle,
    path: "/finance/subledgers/ar/statements/[code]/printable",
    Page: ArStatementDetailPage,
    unframed: true,
  },
  {
    id: `${arSubledgerInvoicesModule.pageRoutes.detail.id}.printable`,
    pageTitle: arSubledgerInvoicesModule.pageRoutes.detail.pageTitle,
    path: "/finance/subledgers/ar/invoices/[documentId]/printable",
    Page: ArInvoicePrintablePage,
    unframed: true,
  },
  {
    id: `${apSubledgerLedgerEntriesModule.pageRoutes.detail.id}.documentPrintable`,
    pageTitle: apSubledgerLedgerEntriesModule.pageRoutes.detail.pageTitle,
    path: "/finance/subledgers/ap/ledger-entries/[code]/document-printable",
    Page: ApLedgerEntryDetailPage,
    unframed: true,
  },
  {
    id: `${apSubledgerStatementsModule.pageRoutes.detail.id}.printable`,
    pageTitle: apSubledgerStatementsModule.pageRoutes.detail.pageTitle,
    path: "/finance/subledgers/ap/statements/[code]/printable",
    Page: ApStatementDetailPage,
    unframed: true,
  },
];

export const financePageRoutes = financePageRouteDefinitions.map((route) => ({
  ...route,
  auth: financeAuth,
})) satisfies VoyzuSurfaceRoute[];

export const financeLeftNav: VoyzuSurfaceNavGroup[] = [
  {
    items: [
      {
        label: "Company General Ledger",
        icon: "account_balance",
        path: "/finance/journals",
        children: [
          {
            label: "Journal Entries",
            routeId: journalsModule.pageRoutes.list.id,
          },
          {
            label: "Account Activity",
            routeId: companyReportsModule.pageRoutes.accountActivity.id,
          },
        ],
      },
      {
        label: "Inventory",
        icon: "package_2",
        path: "#finance-inventory",
        children: [
          { label: "Items", routeId: companyInventoryItemsModule.pageRoutes.list.id },
          { label: "Categories", routeId: companyInventoryCategoriesModule.pageRoutes.list.id },
        ],
      },
      {
        label: "Supporting Ledgers",
        icon: "receipt_long",
        path: "#finance-subledgers",
        children: [
          {
            label: "Accounts Receivable",
            path: "/finance/subledgers/ar/ledger-entries",
            children: [
              { label: "Ledger Entries", routeId: arSubledgerLedgerEntriesModule.pageRoutes.list.id },
              { label: "Ledger Entry Enquiry", routeId: arSubledgerLedgerEntryEnquiryModule.pageRoutes.list.id },
              { label: "Counterparties", routeId: arSubledgerCounterpartiesModule.pageRoutes.list.id },
              { label: "Statements", routeId: arSubledgerStatementsModule.pageRoutes.list.id },
              { label: "Invoices", routeId: arSubledgerInvoicesModule.pageRoutes.list.id },
            ],
          },
          {
            label: "Accounts Payable",
            path: "/finance/subledgers/ap/ledger-entries",
            children: [
              { label: "Ledger Entries", routeId: apSubledgerLedgerEntriesModule.pageRoutes.list.id },
              { label: "Ledger Entry Enquiry", routeId: apSubledgerLedgerEntryEnquiryModule.pageRoutes.list.id },
              { label: "Counterparties", routeId: apSubledgerCounterpartiesModule.pageRoutes.list.id },
              { label: "Statements", routeId: apSubledgerStatementsModule.pageRoutes.list.id },
              { label: "Bills", routeId: apSubledgerBillsModule.pageRoutes.list.id },
            ],
          },
          {
            label: "Tax Ledger",
            path: "/finance/subledgers/tax/ledger-entries",
            children: [
              { label: "Ledger Entries", routeId: taxLedgerModule.pageRoutes.list.id },
            ],
          },
          {
            label: "Inventory Ledger",
            path: "/finance/inventory/ledger",
            children: [
              { label: "Ledger Entries", routeId: inventoryLedgerModule.pageRoutes.list.id },
            ],
          },
        ],
      },
      {
        label: "Financial Periods",
        icon: "calendar_month",
        routeId: financialYearsModule.pageRoutes.list.id,
      },
      {
        label: "Settings",
        icon: "settings",
        path: "#finance-settings",
        children: [
          {
            label: "General Ledger",
            path: "#finance-settings-general-ledger",
            children: [
              { label: "General Ledger Accounts", routeId: companyGlAccountsModule.pageRoutes.list.id },
              { label: "Reporting Categories", routeId: companyGlAccountCategoriesModule.pageRoutes.list.id },
            ],
          },
          {
            label: "Control Accounts",
            path: "#finance-settings-control-accounts",
            children: [
              { label: "Accounts Payable Control Accounts", routeId: companyApControlAccountsModule.pageRoutes.list.id },
              { label: "Accounts Receivable Control Accounts", routeId: companyArControlAccountsModule.pageRoutes.list.id },
              { label: "Bank / Cash Accounts", routeId: companyBankCashAccountsModule.pageRoutes.list.id },
              { label: "Tax Control Accounts", routeId: companyTaxControlAccountsModule.pageRoutes.list.id },
              { label: "Inventory Control Accounts", routeId: companyInventoryControlAccountsModule.pageRoutes.list.id },
            ],
          },
          {
            label: "Integration",
            path: "#finance-settings-integration",
            children: [
              { label: "Financial Document Types", routeId: companyFinancialDocumentTypesModule.pageRoutes.list.id },
              { label: "Financial Document Defaults", routeId: companyFinancialDocumentDefaultsModule.pageRoutes.list.id },
              { label: "Item Posting Profiles", routeId: companyInventoryItemPostingProfilesModule.pageRoutes.list.id },
            ],
          },
          { label: "Dimensions", routeId: companyDimensionsModule.pageRoutes.list.id },
        ],
      },
      {
        label: "Audit Log",
        icon: "history",
        routeId: companyAuditModule.pageRoutes.list.id,
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "Position",
        icon: "account_balance_wallet",
        path: "#finance-reports-position",
        children: [
          {
            label: "Balance Sheet",
            routeId: companyReportsModule.pageRoutes.balanceSheet.id,
          },
          { label: "Tax Position", routeId: companyReportsModule.pageRoutes.taxPosition.id },
        ],
      },
      {
        label: "Movement",
        icon: "trending_up",
        path: "#finance-reports-movement",
        children: [
          { label: "Profit & Loss", routeId: companyReportsModule.pageRoutes.profitLoss.id },
          { label: "Profit & Loss Analysis", routeId: companyReportsModule.pageRoutes.profitLossAnalysis.id },
          { label: "Bank / Cash Movement", routeId: companyReportsModule.pageRoutes.bankCashMovement.id },
          { label: "Tax Return", routeId: companyReportsModule.pageRoutes.taxActivity.id },
        ],
      },
      {
        label: "Reconciliation",
        icon: "rule",
        path: "#finance-reports-reconciliation",
        children: [
          { label: "Trial Balance", routeId: companyReportsModule.pageRoutes.trialBalance.id },
          { label: "Tax Reconciliation", routeId: companyReportsModule.pageRoutes.taxActivityReconciliation.id },
        ],
      },
      {
        label: "Audit",
        icon: "manage_search",
        path: "#finance-reports-audit",
        children: [
          { label: "Financial Integrity", routeId: companyReportsModule.pageRoutes.financialIntegrity.id },
          { label: "Journal Entries", routeId: companyReportsModule.pageRoutes.journalEntries.id },
          { label: "AR Subledger Entries", routeId: companyReportsModule.pageRoutes.arSubledgerEntriesAudit.id },
          { label: "AP Subledger Entries", routeId: companyReportsModule.pageRoutes.apSubledgerEntriesAudit.id },
          { label: "Inventory Ledger Entries", routeId: companyReportsModule.pageRoutes.inventoryLedgerEntriesAudit.id },
          { label: "Tax Ledger Entries", routeId: companyReportsModule.pageRoutes.taxLedgerEntriesAudit.id },
        ],
      },
    ],
  },
];

