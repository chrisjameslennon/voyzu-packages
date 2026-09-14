import { mergePageRoutes } from "@voyzu/types/page-routing";
import { pageRoutes as apSubledgerBillsPageRoutes } from "./modules/ap-subledger-bills/pages.routes";
import { pageRoutes as apSubledgerCounterpartiesPageRoutes } from "./modules/ap-subledger-counterparties/pages.routes";
import { pageRoutes as apSubledgerLedgerEntriesPageRoutes } from "./modules/ap-subledger-ledger-entries/pages.routes";
import { pageRoutes as apSubledgerLedgerEntryEnquiryPageRoutes } from "./modules/ap-subledger-ledger-entry-enquiry/pages.routes";
import { pageRoutes as apSubledgerStatementsPageRoutes } from "./modules/ap-subledger-statements/pages.routes";
import { pageRoutes as arIntegrationProcessingPageRoutes } from "./modules/ar-integration-processing/pages.routes";
import { pageRoutes as arSubledgerCounterpartiesPageRoutes } from "./modules/ar-subledger-counterparties/pages.routes";
import { pageRoutes as arSubledgerInvoicesPageRoutes } from "./modules/ar-subledger-invoices/pages.routes";
import { pageRoutes as arSubledgerLedgerEntriesPageRoutes } from "./modules/ar-subledger-ledger-entries/pages.routes";
import { pageRoutes as arSubledgerLedgerEntryEnquiryPageRoutes } from "./modules/ar-subledger-ledger-entry-enquiry/pages.routes";
import { pageRoutes as arSubledgerStatementsPageRoutes } from "./modules/ar-subledger-statements/pages.routes";
import { pageRoutes as bankCashAccountsPageRoutes } from "./modules/bank-cash-accounts/pages.routes";
import { pageRoutes as controlAccountsApPageRoutes } from "./modules/control-accounts/ap.pages.routes";
import { pageRoutes as controlAccountsArPageRoutes } from "./modules/control-accounts/ar.pages.routes";
import { pageRoutes as countryTaxSettingsPageRoutes } from "./modules/country-tax-settings/pages.routes";
import { pageRoutes as dimensionsPageRoutes } from "./modules/dimensions/pages.routes";
import { pageRoutes as financialDocumentDefaultsPageRoutes } from "./modules/financial-document-defaults/pages.routes";
import { pageRoutes as financialDocumentTypesPageRoutes } from "./modules/financial-document-types/pages.routes";
import { pageRoutes as financialYearsPageRoutes } from "./modules/financial-years/pages.routes";
import { pageRoutes as glAccountCategoriesPageRoutes } from "./modules/gl-account-categories/pages.routes";
import { pageRoutes as glAccountsPageRoutes } from "./modules/gl-accounts/pages.routes";
import { pageRoutes as inventoryControlAccountsPageRoutes } from "./modules/inventory-control-accounts/pages.routes";
import { pageRoutes as inventoryItemPostingProfileAssignmentsPageRoutes } from "./modules/inventory-item-posting-profile-assignments/pages.routes";
import { pageRoutes as inventoryItemPostingProfilesPageRoutes } from "./modules/inventory-item-posting-profiles/pages.routes";
import { pageRoutes as inventoryLedgerPageRoutes } from "./modules/inventory-ledger/pages.routes";
import { pageRoutes as inventoryProcessingPageRoutes } from "./modules/inventory-processing/pages.routes";
import { pageRoutes as journalsPageRoutes } from "./modules/journals/pages.routes";
import { pageRoutes as operationsInvoicesPageRoutes } from "./modules/operations-invoices/pages.routes";
import { pageRoutes as reportsPageRoutes } from "./modules/reports/pages.routes";
import { pageRoutes as taxControlAccountsPageRoutes } from "./modules/tax-control-accounts/pages.routes";
import { pageRoutes as taxLedgerPageRoutes } from "./modules/tax-ledger/pages.routes";
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
    pageRouting: {
      roots: {
        "/finance": {
          routes: mergePageRoutes(
            apSubledgerBillsPageRoutes,
            apSubledgerCounterpartiesPageRoutes,
            apSubledgerLedgerEntriesPageRoutes,
            apSubledgerLedgerEntryEnquiryPageRoutes,
            apSubledgerStatementsPageRoutes,
            arIntegrationProcessingPageRoutes,
            arSubledgerCounterpartiesPageRoutes,
            arSubledgerInvoicesPageRoutes,
            arSubledgerLedgerEntriesPageRoutes,
            arSubledgerLedgerEntryEnquiryPageRoutes,
            arSubledgerStatementsPageRoutes,
            bankCashAccountsPageRoutes,
            controlAccountsApPageRoutes,
            controlAccountsArPageRoutes,
            countryTaxSettingsPageRoutes,
            dimensionsPageRoutes,
            financialDocumentDefaultsPageRoutes,
            financialDocumentTypesPageRoutes,
            financialYearsPageRoutes,
            glAccountCategoriesPageRoutes,
            glAccountsPageRoutes,
            inventoryControlAccountsPageRoutes,
            inventoryItemPostingProfileAssignmentsPageRoutes,
            inventoryItemPostingProfilesPageRoutes,
            inventoryLedgerPageRoutes,
            inventoryProcessingPageRoutes,
            journalsPageRoutes,
            operationsInvoicesPageRoutes,
            reportsPageRoutes,
            taxControlAccountsPageRoutes,
            taxLedgerPageRoutes,
          ),
        },
      },
    },
    httpApiRouting: {
      roots: ["/finance"],
      routes: { ...routes0, ...routes1, ...routes2, ...routes3, ...routes4, ...routes5, ...routes6, ...routes7, ...routes8, ...routes9, ...routes10, ...routes11, ...routes12, ...routes13, ...routes14, ...routes15, ...routes16, ...routes17, ...routes18, ...routes19, ...routes20, ...routes21, ...routes22, ...routes23, ...routes24, ...routes25 },
    },
    httpApiDocumentation: {
      "sections": {
        "finance.accounts-payable": {
          "title": "Accounts Payable",
          "description": "Accounts Payable HTTP operations for @voyzu/finance.",
          "groups": {
            "finance.ap-subledger-counterparties": {
              "title": "Ap Subledger Counterparties",
              "description": "Ap Subledger Counterparties operations.",
              "routes": [
                "finance.ap-subledger-counterparties.list",
                "finance.ap-subledger-counterparties.get"
              ]
            },
            "finance.ap-subledger-ledger-entries": {
              "title": "Ap Subledger Ledger Entries",
              "description": "Ap Subledger Ledger Entries operations.",
              "routes": [
                "finance.ap-subledger-ledger-entries.list",
                "finance.ap-subledger-ledger-entries.get"
              ]
            },
            "finance.ap-subledger-statements": {
              "title": "Ap Subledger Statements",
              "description": "Ap Subledger Statements operations.",
              "routes": [
                "finance.ap-subledger-statements.summariesList"
              ]
            }
          }
        },
        "finance.accounts-receivable": {
          "title": "Accounts Receivable",
          "description": "Accounts Receivable HTTP operations for @voyzu/finance.",
          "groups": {
            "finance.ar-subledger-counterparties": {
              "title": "Ar Subledger Counterparties",
              "description": "Ar Subledger Counterparties operations.",
              "routes": [
                "finance.ar-subledger-counterparties.list",
                "finance.ar-subledger-counterparties.get"
              ]
            },
            "finance.ar-subledger-ledger-entries": {
              "title": "Ar Subledger Ledger Entries",
              "description": "Ar Subledger Ledger Entries operations.",
              "routes": [
                "finance.ar-subledger-ledger-entries.list",
                "finance.ar-subledger-ledger-entries.get"
              ]
            },
            "finance.ar-subledger-statements": {
              "title": "Ar Subledger Statements",
              "description": "Ar Subledger Statements operations.",
              "routes": [
                "finance.ar-subledger-statements.summariesList"
              ]
            }
          }
        },
        "finance.configuration": {
          "title": "Configuration",
          "description": "Configuration HTTP operations for @voyzu/finance.",
          "groups": {
            "finance.bank-cash-accounts": {
              "title": "Bank Cash Accounts",
              "description": "Bank Cash Accounts operations.",
              "routes": [
                "finance.bank-cash-accounts.list",
                "finance.bank-cash-accounts.filter",
                "finance.bank-cash-accounts.search",
                "finance.bank-cash-accounts.batchGet",
                "finance.bank-cash-accounts.batchCreate",
                "finance.bank-cash-accounts.batchUpdate",
                "finance.bank-cash-accounts.batchPatch",
                "finance.bank-cash-accounts.batchDelete",
                "finance.bank-cash-accounts.create",
                "finance.bank-cash-accounts.get",
                "finance.bank-cash-accounts.patch",
                "finance.bank-cash-accounts.update",
                "finance.bank-cash-accounts.delete",
                "finance.bank-cash-accounts.activate",
                "finance.bank-cash-accounts.deactivate",
                "finance.bank-cash-accounts.batchActivate",
                "finance.bank-cash-accounts.batchDeactivate"
              ]
            },
            "finance.control-accounts": {
              "title": "Control Accounts",
              "description": "Control Accounts operations.",
              "routes": [
                "finance.control-accounts.ap-list",
                "finance.control-accounts.ap-get",
                "finance.control-accounts.ap-patch",
                "finance.control-accounts.ar-list",
                "finance.control-accounts.ar-get",
                "finance.control-accounts.ar-patch"
              ]
            },
            "finance.financial-document-defaults": {
              "title": "Financial Document Defaults",
              "description": "Financial Document Defaults operations.",
              "routes": [
                "finance.financial-document-defaults.list",
                "finance.financial-document-defaults.filter",
                "finance.financial-document-defaults.search",
                "finance.financial-document-defaults.create",
                "finance.financial-document-defaults.batchCreate",
                "finance.financial-document-defaults.batchGet",
                "finance.financial-document-defaults.batchUpdate",
                "finance.financial-document-defaults.batchPatch",
                "finance.financial-document-defaults.batchDelete",
                "finance.financial-document-defaults.batchActivate",
                "finance.financial-document-defaults.batchDeactivate",
                "finance.financial-document-defaults.get",
                "finance.financial-document-defaults.update",
                "finance.financial-document-defaults.patch",
                "finance.financial-document-defaults.delete",
                "finance.financial-document-defaults.activate",
                "finance.financial-document-defaults.deactivate"
              ]
            },
            "finance.financial-document-processing-engine": {
              "title": "Financial Document Processing Engine",
              "description": "Financial Document Processing Engine operations.",
              "routes": [
                "finance.financial-document-processing-engine.apBill",
                "finance.financial-document-processing-engine.apBillCancellation",
                "finance.financial-document-processing-engine.apCreditNote",
                "finance.financial-document-processing-engine.apOpeningBalance",
                "finance.financial-document-processing-engine.apPayment",
                "finance.financial-document-processing-engine.apPaymentApplication",
                "finance.financial-document-processing-engine.apRefund",
                "finance.financial-document-processing-engine.apWriteOff",
                "finance.financial-document-processing-engine.arCreditNote",
                "finance.financial-document-processing-engine.arInvoice",
                "finance.financial-document-processing-engine.arInvoiceCancellation",
                "finance.financial-document-processing-engine.arOpeningBalance",
                "finance.financial-document-processing-engine.arReceipt",
                "finance.financial-document-processing-engine.arReceiptApplication",
                "finance.financial-document-processing-engine.arRefund",
                "finance.financial-document-processing-engine.arWriteOff",
                "finance.financial-document-processing-engine.inventoryAdjustment",
                "finance.financial-document-processing-engine.inventoryIssue",
                "finance.financial-document-processing-engine.inventoryReceipt",
                "finance.financial-document-processing-engine.ledgerJournal",
                "finance.financial-document-processing-engine.ledgerJournalReversal",
                "finance.financial-document-processing-engine.taxAdjustment",
                "finance.financial-document-processing-engine.taxPayment",
                "finance.financial-document-processing-engine.taxRefund"
              ]
            },
            "finance.financial-document-types": {
              "title": "Financial Document Types",
              "description": "Financial Document Types operations.",
              "routes": [
                "finance.financial-document-types.list",
                "finance.financial-document-types.filter",
                "finance.financial-document-types.search",
                "finance.financial-document-types.batchGet",
                "finance.financial-document-types.get"
              ]
            },
            "finance.organization-finance": {
              "title": "Organization Finance",
              "description": "Organization Finance operations.",
              "routes": [
                "finance.organization-finance.companySelection",
                "finance.organization-finance.setOrganizationSelection",
                "finance.organization-finance.update"
              ]
            },
            "finance.reports": {
              "title": "Reports",
              "description": "Reports operations.",
              "routes": [
                "finance.reports.balanceSheet",
                "finance.reports.balanceSheetPdf",
                "finance.reports.financialYears",
                "finance.reports.trialBalance",
                "finance.reports.taxPosition",
                "finance.reports.bankCashMovement",
                "finance.reports.journalEntries",
                "finance.reports.financialIntegrity",
                "finance.reports.profitLoss",
                "finance.reports.profitLossAnalysis",
                "finance.reports.taxActivity",
                "finance.reports.taxActivityReconciliation",
                "finance.reports.arSubledgerEntriesAudit",
                "finance.reports.apSubledgerEntriesAudit",
                "finance.reports.inventoryLedgerEntriesAudit",
                "finance.reports.taxLedgerEntriesAudit"
              ]
            }
          }
        },
        "finance.tax": {
          "title": "Tax",
          "description": "Tax HTTP operations for @voyzu/finance.",
          "groups": {
            "finance.country-tax-settings": {
              "title": "Country Tax Settings",
              "description": "Country Tax Settings operations.",
              "routes": [
                "finance.country-tax-settings.list",
                "finance.country-tax-settings.get"
              ]
            },
            "finance.tax": {
              "title": "Tax",
              "description": "Tax operations.",
              "routes": [
                "finance.tax.authoritiesList",
                "finance.tax.authoritiesGet"
              ]
            },
            "finance.tax-control-accounts": {
              "title": "Tax Control Accounts",
              "description": "Tax Control Accounts operations.",
              "routes": [
                "finance.tax-control-accounts.list",
                "finance.tax-control-accounts.patch"
              ]
            },
            "finance.tax-ledger": {
              "title": "Tax Ledger",
              "description": "Tax Ledger operations.",
              "routes": [
                "finance.tax-ledger.list",
                "finance.tax-ledger.get"
              ]
            }
          }
        },
        "finance.general-ledger": {
          "title": "General Ledger",
          "description": "General Ledger HTTP operations for @voyzu/finance.",
          "groups": {
            "finance.dimensions": {
              "title": "Dimensions",
              "description": "Dimensions operations.",
              "routes": [
                "finance.dimensions.list",
                "finance.dimensions.filter",
                "finance.dimensions.search",
                "finance.dimensions.create",
                "finance.dimensions.batchCreate",
                "finance.dimensions.batchGet",
                "finance.dimensions.batchUpdate",
                "finance.dimensions.batchPatch",
                "finance.dimensions.batchDelete",
                "finance.dimensions.batchActivate",
                "finance.dimensions.batchDeactivate",
                "finance.dimensions.activate",
                "finance.dimensions.deactivate",
                "finance.dimensions.get",
                "finance.dimensions.update",
                "finance.dimensions.patch",
                "finance.dimensions.delete",
                "finance.dimensions.listValues",
                "finance.dimensions.createValue",
                "finance.dimensions.patchValue",
                "finance.dimensions.deleteValue"
              ]
            },
            "finance.financial-years": {
              "title": "Financial Years",
              "description": "Financial Years operations.",
              "routes": [
                "finance.financial-years.list",
                "finance.financial-years.create",
                "finance.financial-years.exportZip",
                "finance.financial-years.get",
                "finance.financial-years.patch",
                "finance.financial-years.delete",
                "finance.financial-years.open",
                "finance.financial-years.close",
                "finance.financial-years.reopen",
                "finance.financial-years.periodsList",
                "finance.financial-years.periodsClose",
                "finance.financial-years.periodsReopen"
              ]
            },
            "finance.gl-account-categories": {
              "title": "Gl Account Categories",
              "description": "Gl Account Categories operations.",
              "routes": [
                "finance.gl-account-categories.list",
                "finance.gl-account-categories.filter",
                "finance.gl-account-categories.search",
                "finance.gl-account-categories.create",
                "finance.gl-account-categories.batchCreate",
                "finance.gl-account-categories.batchGet",
                "finance.gl-account-categories.batchUpdate",
                "finance.gl-account-categories.batchPatch",
                "finance.gl-account-categories.batchDelete",
                "finance.gl-account-categories.batchActivate",
                "finance.gl-account-categories.batchDeactivate",
                "finance.gl-account-categories.activate",
                "finance.gl-account-categories.deactivate",
                "finance.gl-account-categories.get",
                "finance.gl-account-categories.update",
                "finance.gl-account-categories.patch",
                "finance.gl-account-categories.delete"
              ]
            },
            "finance.gl-accounts": {
              "title": "Gl Accounts",
              "description": "Gl Accounts operations.",
              "routes": [
                "finance.gl-accounts.list",
                "finance.gl-accounts.filter",
                "finance.gl-accounts.search",
                "finance.gl-accounts.create",
                "finance.gl-accounts.batchCreate",
                "finance.gl-accounts.batchGet",
                "finance.gl-accounts.batchUpdate",
                "finance.gl-accounts.batchPatch",
                "finance.gl-accounts.batchDelete",
                "finance.gl-accounts.batchActivate",
                "finance.gl-accounts.batchDeactivate",
                "finance.gl-accounts.activate",
                "finance.gl-accounts.deactivate",
                "finance.gl-accounts.get",
                "finance.gl-accounts.update",
                "finance.gl-accounts.patch",
                "finance.gl-accounts.delete"
              ]
            }
          }
        },
        "finance.inventory": {
          "title": "Inventory",
          "description": "Inventory HTTP operations for @voyzu/finance.",
          "groups": {
            "finance.inventory-control-accounts": {
              "title": "Inventory Control Accounts",
              "description": "Inventory Control Accounts operations.",
              "routes": [
                "finance.inventory-control-accounts.list",
                "finance.inventory-control-accounts.patch"
              ]
            },
            "finance.inventory-item-posting-profile-assignments": {
              "title": "Inventory Item Posting Profile Assignments",
              "description": "Inventory Item Posting Profile Assignments operations.",
              "routes": [
                "finance.inventory-item-posting-profile-assignments.list",
                "finance.inventory-item-posting-profile-assignments.assign"
              ]
            },
            "finance.inventory-item-posting-profiles": {
              "title": "Inventory Item Posting Profiles",
              "description": "Inventory Item Posting Profiles operations.",
              "routes": [
                "finance.inventory-item-posting-profiles.list",
                "finance.inventory-item-posting-profiles.filter",
                "finance.inventory-item-posting-profiles.search",
                "finance.inventory-item-posting-profiles.batchGet",
                "finance.inventory-item-posting-profiles.batchCreate",
                "finance.inventory-item-posting-profiles.batchUpdate",
                "finance.inventory-item-posting-profiles.batchPatch",
                "finance.inventory-item-posting-profiles.batchDelete",
                "finance.inventory-item-posting-profiles.create",
                "finance.inventory-item-posting-profiles.get",
                "finance.inventory-item-posting-profiles.update",
                "finance.inventory-item-posting-profiles.patch",
                "finance.inventory-item-posting-profiles.delete",
                "finance.inventory-item-posting-profiles.activate",
                "finance.inventory-item-posting-profiles.deactivate",
                "finance.inventory-item-posting-profiles.batchActivate",
                "finance.inventory-item-posting-profiles.batchDeactivate"
              ]
            },
            "finance.inventory-ledger": {
              "title": "Inventory Ledger",
              "description": "Inventory Ledger operations.",
              "routes": [
                "finance.inventory-ledger.list",
                "finance.inventory-ledger.get"
              ]
            },
            "finance.inventory-processing": {
              "title": "Inventory Processing",
              "description": "Inventory Processing operations.",
              "routes": [
                "finance.inventory-processing.listRules",
                "finance.inventory-processing.getRule",
                "finance.inventory-processing.patchRule",
                "finance.inventory-processing.listInventoryTransactions",
                "finance.inventory-processing.getInventoryTransaction"
              ]
            }
          }
        }
      }
    },
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
