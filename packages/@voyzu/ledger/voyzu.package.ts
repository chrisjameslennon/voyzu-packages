import leftMenu from "./ui-surface/left-nav";
import { mergePageRoutes } from "@voyzu/types/page-routing";
import { pageRoutes as apSubledgerLedgerEntriesPageRoutes } from "./modules/ap-subledger-ledger-entries/pages.routes";
import { pageRoutes as apSubledgerLedgerEntryEnquiryPageRoutes } from "./modules/ap-subledger-ledger-entry-enquiry/pages.routes";
import { pageRoutes as arIntegrationProcessingPageRoutes } from "./modules/ar-integration-processing/pages.routes";
import { pageRoutes as arSubledgerLedgerEntriesPageRoutes } from "./modules/ar-subledger-ledger-entries/pages.routes";
import { pageRoutes as arSubledgerLedgerEntryEnquiryPageRoutes } from "./modules/ar-subledger-ledger-entry-enquiry/pages.routes";
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
import { pageRoutes as reportsPageRoutes } from "./modules/reports/pages.routes";
import { pageRoutes as taxControlAccountsPageRoutes } from "./modules/tax-control-accounts/pages.routes";
import { pageRoutes as taxLedgerPageRoutes } from "./modules/tax-ledger/pages.routes";
import { httpApiRoutes as routes1 } from "./modules/ap-subledger-ledger-entries/http-api.routes";
import { httpApiRoutes as routes4 } from "./modules/ar-subledger-ledger-entries/http-api.routes";
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

import { organizationFinanceModule } from "./modules/organization-finance/module";
import { countryTaxSettingsModule } from "./modules/country-tax-settings/module";
import { inventoryProcessingModule } from "./modules/inventory-processing/module";

export const financePackage = {
  contracts: {
    uiSurface: {
      "topnav.menu": {
        "ledger.finance": {
          "label": "Ledger",
          "routeId": "voyzu.countryTaxSettings.page.list"
        }
      },
      "leftnav.menu": {
        "/ledger": { content: leftMenu },
      },
      "leftnav.header": {
        "/ledger": {
          loadComponent: () => import("./ui-surface/left-nav-header").then(module => module.default),
        },
      },
    },
    pageRouting: {
      roots: {
        "/ledger": {
          routes: mergePageRoutes(
            apSubledgerLedgerEntriesPageRoutes,
            apSubledgerLedgerEntryEnquiryPageRoutes,
            arIntegrationProcessingPageRoutes,
            arSubledgerLedgerEntriesPageRoutes,
            arSubledgerLedgerEntryEnquiryPageRoutes,
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
            reportsPageRoutes,
            taxControlAccountsPageRoutes,
            taxLedgerPageRoutes,
          ),
        },
      },
    },
    httpApiRouting: {
      roots: ["/ledger"],
      routes: { ...routes1, ...routes4, ...routes6, ...routes7, ...routes8, ...routes9, ...routes10, ...routes11, ...routes12, ...routes13, ...routes14, ...routes15, ...routes16, ...routes17, ...routes18, ...routes19, ...routes20, ...routes21, ...routes22, ...routes23, ...routes24, ...routes25 },
    },
    httpApiDocumentation: {
  "sections": {
    "ledger.accounts-payable": {
      "title": "Accounts Payable",
      "description": "Accounts Payable HTTP operations for @voyzu/finance.",
      "groups": {
        "ledger.ap-subledger-ledger-entries": {
          "title": "Ap Subledger Ledger Entries",
          "description": "Ap Subledger Ledger Entries operations.",
          "routes": [
            "ledger.ap-subledger-ledger-entries.list",
            "ledger.ap-subledger-ledger-entries.get"
          ]
        }
      }
    },
    "ledger.accounts-receivable": {
      "title": "Accounts Receivable",
      "description": "Accounts Receivable HTTP operations for @voyzu/finance.",
      "groups": {
        "ledger.ar-subledger-ledger-entries": {
          "title": "Ar Subledger Ledger Entries",
          "description": "Ar Subledger Ledger Entries operations.",
          "routes": [
            "ledger.ar-subledger-ledger-entries.list",
            "ledger.ar-subledger-ledger-entries.get"
          ]
        }
      }
    },
    "ledger.configuration": {
      "title": "Configuration",
      "description": "Configuration HTTP operations for @voyzu/finance.",
      "groups": {
        "ledger.bank-cash-accounts": {
          "title": "Bank Cash Accounts",
          "description": "Bank Cash Accounts operations.",
          "routes": [
            "ledger.bank-cash-accounts.list",
            "ledger.bank-cash-accounts.filter",
            "ledger.bank-cash-accounts.search",
            "ledger.bank-cash-accounts.batchGet",
            "ledger.bank-cash-accounts.batchCreate",
            "ledger.bank-cash-accounts.batchUpdate",
            "ledger.bank-cash-accounts.batchPatch",
            "ledger.bank-cash-accounts.batchDelete",
            "ledger.bank-cash-accounts.create",
            "ledger.bank-cash-accounts.get",
            "ledger.bank-cash-accounts.patch",
            "ledger.bank-cash-accounts.update",
            "ledger.bank-cash-accounts.delete",
            "ledger.bank-cash-accounts.activate",
            "ledger.bank-cash-accounts.deactivate",
            "ledger.bank-cash-accounts.batchActivate",
            "ledger.bank-cash-accounts.batchDeactivate"
          ]
        },
        "ledger.control-accounts": {
          "title": "Control Accounts",
          "description": "Control Accounts operations.",
          "routes": [
            "ledger.control-accounts.ap-list",
            "ledger.control-accounts.ap-get",
            "ledger.control-accounts.ap-patch",
            "ledger.control-accounts.ar-list",
            "ledger.control-accounts.ar-get",
            "ledger.control-accounts.ar-patch"
          ]
        },
        "ledger.financial-document-defaults": {
          "title": "Financial Document Defaults",
          "description": "Financial Document Defaults operations.",
          "routes": [
            "ledger.financial-document-defaults.list",
            "ledger.financial-document-defaults.filter",
            "ledger.financial-document-defaults.search",
            "ledger.financial-document-defaults.create",
            "ledger.financial-document-defaults.batchCreate",
            "ledger.financial-document-defaults.batchGet",
            "ledger.financial-document-defaults.batchUpdate",
            "ledger.financial-document-defaults.batchPatch",
            "ledger.financial-document-defaults.batchDelete",
            "ledger.financial-document-defaults.batchActivate",
            "ledger.financial-document-defaults.batchDeactivate",
            "ledger.financial-document-defaults.get",
            "ledger.financial-document-defaults.update",
            "ledger.financial-document-defaults.patch",
            "ledger.financial-document-defaults.delete",
            "ledger.financial-document-defaults.activate",
            "ledger.financial-document-defaults.deactivate"
          ]
        },
        "ledger.financial-document-processing-engine": {
          "title": "Financial Document Processing Engine",
          "description": "Financial Document Processing Engine operations.",
          "routes": [
            "ledger.financial-document-processing-engine.apBill",
            "ledger.financial-document-processing-engine.apBillCancellation",
            "ledger.financial-document-processing-engine.apCreditNote",
            "ledger.financial-document-processing-engine.apOpeningBalance",
            "ledger.financial-document-processing-engine.apPayment",
            "ledger.financial-document-processing-engine.apPaymentApplication",
            "ledger.financial-document-processing-engine.apRefund",
            "ledger.financial-document-processing-engine.apWriteOff",
            "ledger.financial-document-processing-engine.arCreditNote",
            "ledger.financial-document-processing-engine.arInvoice",
            "ledger.financial-document-processing-engine.arInvoiceCancellation",
            "ledger.financial-document-processing-engine.arOpeningBalance",
            "ledger.financial-document-processing-engine.arReceipt",
            "ledger.financial-document-processing-engine.arReceiptApplication",
            "ledger.financial-document-processing-engine.arRefund",
            "ledger.financial-document-processing-engine.arWriteOff",
            "ledger.financial-document-processing-engine.inventoryAdjustment",
            "ledger.financial-document-processing-engine.inventoryIssue",
            "ledger.financial-document-processing-engine.inventoryReceipt",
            "ledger.financial-document-processing-engine.ledgerJournal",
            "ledger.financial-document-processing-engine.ledgerJournalReversal",
            "ledger.financial-document-processing-engine.taxAdjustment",
            "ledger.financial-document-processing-engine.taxPayment",
            "ledger.financial-document-processing-engine.taxRefund"
          ]
        },
        "ledger.financial-document-types": {
          "title": "Financial Document Types",
          "description": "Financial Document Types operations.",
          "routes": [
            "ledger.financial-document-types.list",
            "ledger.financial-document-types.filter",
            "ledger.financial-document-types.search",
            "ledger.financial-document-types.batchGet",
            "ledger.financial-document-types.get"
          ]
        },
        "ledger.organization-finance": {
          "title": "Organization Finance",
          "description": "Organization Finance operations.",
          "routes": [
            "ledger.organization-finance.companySelection",
            "ledger.organization-finance.setOrganizationSelection",
            "ledger.organization-finance.update"
          ]
        },
        "ledger.reports": {
          "title": "Reports",
          "description": "Reports operations.",
          "routes": [
            "ledger.reports.balanceSheet",
            "ledger.reports.balanceSheetPdf",
            "ledger.reports.financialYears",
            "ledger.reports.trialBalance",
            "ledger.reports.taxPosition",
            "ledger.reports.bankCashMovement",
            "ledger.reports.journalEntries",
            "ledger.reports.financialIntegrity",
            "ledger.reports.profitLoss",
            "ledger.reports.profitLossAnalysis",
            "ledger.reports.taxActivity",
            "ledger.reports.taxActivityReconciliation",
            "ledger.reports.arSubledgerEntriesAudit",
            "ledger.reports.apSubledgerEntriesAudit",
            "ledger.reports.inventoryLedgerEntriesAudit",
            "ledger.reports.taxLedgerEntriesAudit"
          ]
        }
      }
    },
    "ledger.tax": {
      "title": "Tax",
      "description": "Tax HTTP operations for @voyzu/finance.",
      "groups": {
        "ledger.country-tax-settings": {
          "title": "Country Tax Settings",
          "description": "Country Tax Settings operations.",
          "routes": [
            "ledger.country-tax-settings.list",
            "ledger.country-tax-settings.get"
          ]
        },
        "ledger.tax": {
          "title": "Tax",
          "description": "Tax operations.",
          "routes": [
            "ledger.tax.authoritiesList",
            "ledger.tax.authoritiesGet"
          ]
        },
        "ledger.tax-control-accounts": {
          "title": "Tax Control Accounts",
          "description": "Tax Control Accounts operations.",
          "routes": [
            "ledger.tax-control-accounts.list",
            "ledger.tax-control-accounts.patch"
          ]
        },
        "ledger.tax-ledger": {
          "title": "Tax Ledger",
          "description": "Tax Ledger operations.",
          "routes": [
            "ledger.tax-ledger.list",
            "ledger.tax-ledger.get"
          ]
        }
      }
    },
    "ledger.general-ledger": {
      "title": "General Ledger",
      "description": "General Ledger HTTP operations for @voyzu/finance.",
      "groups": {
        "ledger.dimensions": {
          "title": "Dimensions",
          "description": "Dimensions operations.",
          "routes": [
            "ledger.dimensions.list",
            "ledger.dimensions.filter",
            "ledger.dimensions.search",
            "ledger.dimensions.create",
            "ledger.dimensions.batchCreate",
            "ledger.dimensions.batchGet",
            "ledger.dimensions.batchUpdate",
            "ledger.dimensions.batchPatch",
            "ledger.dimensions.batchDelete",
            "ledger.dimensions.batchActivate",
            "ledger.dimensions.batchDeactivate",
            "ledger.dimensions.activate",
            "ledger.dimensions.deactivate",
            "ledger.dimensions.get",
            "ledger.dimensions.update",
            "ledger.dimensions.patch",
            "ledger.dimensions.delete",
            "ledger.dimensions.listValues",
            "ledger.dimensions.createValue",
            "ledger.dimensions.patchValue",
            "ledger.dimensions.deleteValue"
          ]
        },
        "ledger.financial-years": {
          "title": "Financial Years",
          "description": "Financial Years operations.",
          "routes": [
            "ledger.financial-years.list",
            "ledger.financial-years.create",
            "ledger.financial-years.exportZip",
            "ledger.financial-years.get",
            "ledger.financial-years.patch",
            "ledger.financial-years.delete",
            "ledger.financial-years.open",
            "ledger.financial-years.close",
            "ledger.financial-years.reopen",
            "ledger.financial-years.periodsList",
            "ledger.financial-years.periodsClose",
            "ledger.financial-years.periodsReopen"
          ]
        },
        "ledger.gl-account-categories": {
          "title": "Gl Account Categories",
          "description": "Gl Account Categories operations.",
          "routes": [
            "ledger.gl-account-categories.list",
            "ledger.gl-account-categories.filter",
            "ledger.gl-account-categories.search",
            "ledger.gl-account-categories.create",
            "ledger.gl-account-categories.batchCreate",
            "ledger.gl-account-categories.batchGet",
            "ledger.gl-account-categories.batchUpdate",
            "ledger.gl-account-categories.batchPatch",
            "ledger.gl-account-categories.batchDelete",
            "ledger.gl-account-categories.batchActivate",
            "ledger.gl-account-categories.batchDeactivate",
            "ledger.gl-account-categories.activate",
            "ledger.gl-account-categories.deactivate",
            "ledger.gl-account-categories.get",
            "ledger.gl-account-categories.update",
            "ledger.gl-account-categories.patch",
            "ledger.gl-account-categories.delete"
          ]
        },
        "ledger.gl-accounts": {
          "title": "Gl Accounts",
          "description": "Gl Accounts operations.",
          "routes": [
            "ledger.gl-accounts.list",
            "ledger.gl-accounts.filter",
            "ledger.gl-accounts.search",
            "ledger.gl-accounts.create",
            "ledger.gl-accounts.batchCreate",
            "ledger.gl-accounts.batchGet",
            "ledger.gl-accounts.batchUpdate",
            "ledger.gl-accounts.batchPatch",
            "ledger.gl-accounts.batchDelete",
            "ledger.gl-accounts.batchActivate",
            "ledger.gl-accounts.batchDeactivate",
            "ledger.gl-accounts.activate",
            "ledger.gl-accounts.deactivate",
            "ledger.gl-accounts.get",
            "ledger.gl-accounts.update",
            "ledger.gl-accounts.patch",
            "ledger.gl-accounts.delete"
          ]
        }
      }
    },
    "ledger.inventory": {
      "title": "Inventory",
      "description": "Inventory HTTP operations for @voyzu/finance.",
      "groups": {
        "ledger.inventory-control-accounts": {
          "title": "Inventory Control Accounts",
          "description": "Inventory Control Accounts operations.",
          "routes": [
            "ledger.inventory-control-accounts.list",
            "ledger.inventory-control-accounts.patch"
          ]
        },
        "ledger.inventory-item-posting-profile-assignments": {
          "title": "Inventory Item Posting Profile Assignments",
          "description": "Inventory Item Posting Profile Assignments operations.",
          "routes": [
            "ledger.inventory-item-posting-profile-assignments.list",
            "ledger.inventory-item-posting-profile-assignments.assign"
          ]
        },
        "ledger.inventory-item-posting-profiles": {
          "title": "Inventory Item Posting Profiles",
          "description": "Inventory Item Posting Profiles operations.",
          "routes": [
            "ledger.inventory-item-posting-profiles.list",
            "ledger.inventory-item-posting-profiles.filter",
            "ledger.inventory-item-posting-profiles.search",
            "ledger.inventory-item-posting-profiles.batchGet",
            "ledger.inventory-item-posting-profiles.batchCreate",
            "ledger.inventory-item-posting-profiles.batchUpdate",
            "ledger.inventory-item-posting-profiles.batchPatch",
            "ledger.inventory-item-posting-profiles.batchDelete",
            "ledger.inventory-item-posting-profiles.create",
            "ledger.inventory-item-posting-profiles.get",
            "ledger.inventory-item-posting-profiles.update",
            "ledger.inventory-item-posting-profiles.patch",
            "ledger.inventory-item-posting-profiles.delete",
            "ledger.inventory-item-posting-profiles.activate",
            "ledger.inventory-item-posting-profiles.deactivate",
            "ledger.inventory-item-posting-profiles.batchActivate",
            "ledger.inventory-item-posting-profiles.batchDeactivate"
          ]
        },
        "ledger.inventory-ledger": {
          "title": "Inventory Ledger",
          "description": "Inventory Ledger operations.",
          "routes": [
            "ledger.inventory-ledger.list",
            "ledger.inventory-ledger.get"
          ]
        },
        "ledger.inventory-processing": {
          "title": "Inventory Processing",
          "description": "Inventory Processing operations.",
          "routes": [
            "ledger.inventory-processing.listRules",
            "ledger.inventory-processing.getRule",
            "ledger.inventory-processing.patchRule",
            "ledger.inventory-processing.listInventoryTransactions",
            "ledger.inventory-processing.getInventoryTransaction"
          ]
        }
      }
    }
  }
},
    internalApi: { implements: { "@erp/ledger-posting": () => import("./internal-api/posting.implementation").then(module => ({ methods: module.postingMethods, transactionalMethods: Object.keys(module.postingMethods) })), "@erp/ledger-documents": () => import("./internal-api/documents.implementation").then(module => ({ methods: module.documentMethods })), ...organizationFinanceModule.implements, ...countryTaxSettingsModule.implements, ...inventoryProcessingModule.implements } },

  },
  install: financeInstall,
  uninstall: financeUninstall,
  scripts: {
    purgeAndRecreate,
    sampleData: installSampleData,
  },
} as const satisfies VoyzuPackageDefinition;

export default financePackage;
