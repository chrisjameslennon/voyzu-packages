export const httpApiDocumentation = {
  "sections": {
    "finance.accounts-payable": {
      "title": "Accounts Payable",
      "description": "Accounts Payable HTTP operations for @voyzu/finance.",
      "groups": {
        "finance.ap-subledger-counterparties": {
          "title": "Ap Subledger Counterparties",
          "description": "Ap Subledger Counterparties operations.",
          "routes": {
            "finance.ap-subledger-counterparties.list": {
              "description": "List AP Subledger Counterparties."
            },
            "finance.ap-subledger-counterparties.get": {
              "description": "Get AP Subledger Counterparties."
            }
          }
        },
        "finance.ap-subledger-ledger-entries": {
          "title": "Ap Subledger Ledger Entries",
          "description": "Ap Subledger Ledger Entries operations.",
          "routes": {
            "finance.ap-subledger-ledger-entries.list": {
              "description": "List AP Subledger Ledger Entries."
            },
            "finance.ap-subledger-ledger-entries.get": {
              "description": "Get AP Subledger Ledger Entries."
            }
          }
        },
        "finance.ap-subledger-statements": {
          "title": "Ap Subledger Statements",
          "description": "Ap Subledger Statements operations.",
          "routes": {
            "finance.ap-subledger-statements.summariesList": {
              "description": "Summaries List AP Subledger Statements."
            }
          }
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
          "routes": {
            "finance.ar-subledger-counterparties.list": {
              "description": "List AR Subledger Counterparties."
            },
            "finance.ar-subledger-counterparties.get": {
              "description": "Get AR Subledger Counterparties."
            }
          }
        },
        "finance.ar-subledger-ledger-entries": {
          "title": "Ar Subledger Ledger Entries",
          "description": "Ar Subledger Ledger Entries operations.",
          "routes": {
            "finance.ar-subledger-ledger-entries.list": {
              "description": "List AR Subledger Ledger Entries."
            },
            "finance.ar-subledger-ledger-entries.get": {
              "description": "Get AR Subledger Ledger Entries."
            }
          }
        },
        "finance.ar-subledger-statements": {
          "title": "Ar Subledger Statements",
          "description": "Ar Subledger Statements operations.",
          "routes": {
            "finance.ar-subledger-statements.summariesList": {
              "description": "Summaries List AR Subledger Statements."
            }
          }
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
          "routes": {
            "finance.bank-cash-accounts.list": {
              "description": "List Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.filter": {
              "description": "Filter Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.search": {
              "description": "Search Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.batchGet": {
              "description": "Batch Get Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.batchCreate": {
              "description": "Batch Create Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.batchUpdate": {
              "description": "Batch Update Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.batchPatch": {
              "description": "Batch Patch Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.batchDelete": {
              "description": "Batch Delete Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.create": {
              "description": "Create Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.get": {
              "description": "Get Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.patch": {
              "description": "Patch Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.update": {
              "description": "Update Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.delete": {
              "description": "Delete Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.activate": {
              "description": "Activate Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.deactivate": {
              "description": "Deactivate Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.batchActivate": {
              "description": "Batch Activate Company Bank Cash Accounts."
            },
            "finance.bank-cash-accounts.batchDeactivate": {
              "description": "Batch Deactivate Company Bank Cash Accounts."
            }
          }
        },
        "finance.control-accounts": {
          "title": "Control Accounts",
          "description": "Control Accounts operations.",
          "routes": {
            "finance.control-accounts.ap-list": {
              "description": "List Company AP Control Accounts."
            },
            "finance.control-accounts.ap-get": {
              "description": "Get Company AP Control Accounts."
            },
            "finance.control-accounts.ap-patch": {
              "description": "Patch Company AP Control Accounts."
            },
            "finance.control-accounts.ar-list": {
              "description": "List Company AR Control Accounts."
            },
            "finance.control-accounts.ar-get": {
              "description": "Get Company AR Control Accounts."
            },
            "finance.control-accounts.ar-patch": {
              "description": "Patch Company AR Control Accounts."
            }
          }
        },
        "finance.financial-document-defaults": {
          "title": "Financial Document Defaults",
          "description": "Financial Document Defaults operations.",
          "routes": {
            "finance.financial-document-defaults.list": {
              "description": "List Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.filter": {
              "description": "Filter Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.search": {
              "description": "Search Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.create": {
              "description": "Create Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.batchCreate": {
              "description": "Batch Create Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.batchGet": {
              "description": "Batch Get Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.batchUpdate": {
              "description": "Batch Update Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.batchPatch": {
              "description": "Batch Patch Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.batchDelete": {
              "description": "Batch Delete Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.batchActivate": {
              "description": "Batch Activate Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.batchDeactivate": {
              "description": "Batch Deactivate Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.get": {
              "description": "Get Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.update": {
              "description": "Update Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.patch": {
              "description": "Patch Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.delete": {
              "description": "Delete Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.activate": {
              "description": "Activate Company Financial Document Defaults."
            },
            "finance.financial-document-defaults.deactivate": {
              "description": "Deactivate Company Financial Document Defaults."
            }
          }
        },
        "finance.financial-document-processing-engine": {
          "title": "Financial Document Processing Engine",
          "description": "Financial Document Processing Engine operations.",
          "routes": {
            "finance.financial-document-processing-engine.apBill": {
              "description": "AP Bill Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.apBillCancellation": {
              "description": "AP Bill Cancellation Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.apCreditNote": {
              "description": "AP Credit Note Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.apOpeningBalance": {
              "description": "AP Opening Balance Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.apPayment": {
              "description": "AP Payment Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.apPaymentApplication": {
              "description": "AP Payment Application Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.apRefund": {
              "description": "AP Refund Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.apWriteOff": {
              "description": "AP Write Off Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.arCreditNote": {
              "description": "AR Credit Note Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.arInvoice": {
              "description": "AR Invoice Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.arInvoiceCancellation": {
              "description": "AR Invoice Cancellation Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.arOpeningBalance": {
              "description": "AR Opening Balance Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.arReceipt": {
              "description": "AR Receipt Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.arReceiptApplication": {
              "description": "AR Receipt Application Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.arRefund": {
              "description": "AR Refund Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.arWriteOff": {
              "description": "AR Write Off Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.inventoryAdjustment": {
              "description": "Inventory Adjustment Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.inventoryIssue": {
              "description": "Inventory Issue Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.inventoryReceipt": {
              "description": "Inventory Receipt Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.ledgerJournal": {
              "description": "Ledger Journal Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.ledgerJournalReversal": {
              "description": "Ledger Journal Reversal Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.taxAdjustment": {
              "description": "Tax Adjustment Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.taxPayment": {
              "description": "Tax Payment Financial Document Processing Engine."
            },
            "finance.financial-document-processing-engine.taxRefund": {
              "description": "Tax Refund Financial Document Processing Engine."
            }
          }
        },
        "finance.financial-document-types": {
          "title": "Financial Document Types",
          "description": "Financial Document Types operations.",
          "routes": {
            "finance.financial-document-types.list": {
              "description": "List Company Financial Document Types."
            },
            "finance.financial-document-types.filter": {
              "description": "Filter Company Financial Document Types."
            },
            "finance.financial-document-types.search": {
              "description": "Search Company Financial Document Types."
            },
            "finance.financial-document-types.batchGet": {
              "description": "Batch Get Company Financial Document Types."
            },
            "finance.financial-document-types.get": {
              "description": "Get Company Financial Document Types."
            }
          }
        },
        "finance.organization-finance": {
          "title": "Organization Finance",
          "description": "Organization Finance operations.",
          "routes": {
            "finance.organization-finance.companySelection": {
              "description": "Lists Finance-enabled companies accessible to the current user and resolves the selected company."
            },
            "finance.organization-finance.setOrganizationSelection": {
              "description": "Selects an accessible Finance-enabled company."
            },
            "finance.organization-finance.update": {
              "description": "Updates Finance-owned tax, report and standard-setting fields; ERP identity remains read-only."
            }
          }
        },
        "finance.reports": {
          "title": "Reports",
          "description": "Reports operations.",
          "routes": {
            "finance.reports.balanceSheet": {
              "description": "Balance Sheet Company Reports."
            },
            "finance.reports.balanceSheetPdf": {
              "description": "Generates a balance sheet PDF for the selected company and reporting options."
            },
            "finance.reports.financialYears": {
              "description": "Financial Years Company Reports."
            },
            "finance.reports.trialBalance": {
              "description": "Trial Balance Company Reports."
            },
            "finance.reports.taxPosition": {
              "description": "Tax Position Company Reports."
            },
            "finance.reports.bankCashMovement": {
              "description": "Bank Cash Movement Company Reports."
            },
            "finance.reports.journalEntries": {
              "description": "Journal Entries Company Reports."
            },
            "finance.reports.financialIntegrity": {
              "description": "Financial Integrity Company Reports."
            },
            "finance.reports.profitLoss": {
              "description": "Profit Loss Company Reports."
            },
            "finance.reports.profitLossAnalysis": {
              "description": "Profit Loss Analysis Company Reports."
            },
            "finance.reports.taxActivity": {
              "description": "Tax Activity Company Reports."
            },
            "finance.reports.taxActivityReconciliation": {
              "description": "Tax Activity Reconciliation Company Reports."
            },
            "finance.reports.arSubledgerEntriesAudit": {
              "description": "AR Subledger Entries Audit Company Reports."
            },
            "finance.reports.apSubledgerEntriesAudit": {
              "description": "AP Subledger Entries Audit Company Reports."
            },
            "finance.reports.inventoryLedgerEntriesAudit": {
              "description": "Inventory Ledger Entries Audit Company Reports."
            },
            "finance.reports.taxLedgerEntriesAudit": {
              "description": "Tax Ledger Entries Audit Company Reports."
            }
          }
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
          "routes": {
            "finance.country-tax-settings.list": {
              "description": "Lists Finance tax configuration for active countries."
            },
            "finance.country-tax-settings.get": {
              "description": "Gets Finance filing and tax configuration for an active country."
            }
          }
        },
        "finance.tax": {
          "title": "Tax",
          "description": "Tax operations.",
          "routes": {
            "finance.tax.authoritiesList": {
              "description": "Authorities List Tax."
            },
            "finance.tax.authoritiesGet": {
              "description": "Authorities Get Tax."
            }
          }
        },
        "finance.tax-control-accounts": {
          "title": "Tax Control Accounts",
          "description": "Tax Control Accounts operations.",
          "routes": {
            "finance.tax-control-accounts.list": {
              "description": "List Company Tax Control Accounts."
            },
            "finance.tax-control-accounts.patch": {
              "description": "Patch Company Tax Control Accounts."
            }
          }
        },
        "finance.tax-ledger": {
          "title": "Tax Ledger",
          "description": "Tax Ledger operations.",
          "routes": {
            "finance.tax-ledger.list": {
              "description": "List Tax Ledger."
            },
            "finance.tax-ledger.get": {
              "description": "Get Tax Ledger."
            }
          }
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
          "routes": {
            "finance.dimensions.list": {
              "description": "List Company Dimensions."
            },
            "finance.dimensions.filter": {
              "description": "Filter Company Dimensions."
            },
            "finance.dimensions.search": {
              "description": "Search Company Dimensions."
            },
            "finance.dimensions.create": {
              "description": "Create Company Dimensions."
            },
            "finance.dimensions.batchCreate": {
              "description": "Batch Create Company Dimensions."
            },
            "finance.dimensions.batchGet": {
              "description": "Batch Get Company Dimensions."
            },
            "finance.dimensions.batchUpdate": {
              "description": "Batch Update Company Dimensions."
            },
            "finance.dimensions.batchPatch": {
              "description": "Batch Patch Company Dimensions."
            },
            "finance.dimensions.batchDelete": {
              "description": "Batch Delete Company Dimensions."
            },
            "finance.dimensions.batchActivate": {
              "description": "Batch Activate Company Dimensions."
            },
            "finance.dimensions.batchDeactivate": {
              "description": "Batch Deactivate Company Dimensions."
            },
            "finance.dimensions.activate": {
              "description": "Activate Company Dimensions."
            },
            "finance.dimensions.deactivate": {
              "description": "Deactivate Company Dimensions."
            },
            "finance.dimensions.get": {
              "description": "Get Company Dimensions."
            },
            "finance.dimensions.update": {
              "description": "Update Company Dimensions."
            },
            "finance.dimensions.patch": {
              "description": "Patch Company Dimensions."
            },
            "finance.dimensions.delete": {
              "description": "Delete Company Dimensions."
            },
            "finance.dimensions.listValues": {
              "description": "List Values Company Dimensions."
            },
            "finance.dimensions.createValue": {
              "description": "Create Value Company Dimensions."
            },
            "finance.dimensions.patchValue": {
              "description": "Patch Value Company Dimensions."
            },
            "finance.dimensions.deleteValue": {
              "description": "Delete Value Company Dimensions."
            }
          }
        },
        "finance.financial-years": {
          "title": "Financial Years",
          "description": "Financial Years operations.",
          "routes": {
            "finance.financial-years.list": {
              "description": "List Financial Years."
            },
            "finance.financial-years.create": {
              "description": "Create Financial Years."
            },
            "finance.financial-years.exportZip": {
              "description": "Export Zip Financial Years."
            },
            "finance.financial-years.get": {
              "description": "Get Financial Years."
            },
            "finance.financial-years.patch": {
              "description": "Patch Financial Years."
            },
            "finance.financial-years.delete": {
              "description": "Delete Financial Years."
            },
            "finance.financial-years.open": {
              "description": "Open Financial Years."
            },
            "finance.financial-years.close": {
              "description": "Close Financial Years."
            },
            "finance.financial-years.reopen": {
              "description": "Reopen Financial Years."
            },
            "finance.financial-years.periodsList": {
              "description": "Periods List Financial Years."
            },
            "finance.financial-years.periodsClose": {
              "description": "Periods Close Financial Years."
            },
            "finance.financial-years.periodsReopen": {
              "description": "Periods Reopen Financial Years."
            }
          }
        },
        "finance.gl-account-categories": {
          "title": "Gl Account Categories",
          "description": "Gl Account Categories operations.",
          "routes": {
            "finance.gl-account-categories.list": {
              "description": "List Company GL Account Categories."
            },
            "finance.gl-account-categories.filter": {
              "description": "Filter Company GL Account Categories."
            },
            "finance.gl-account-categories.search": {
              "description": "Search Company GL Account Categories."
            },
            "finance.gl-account-categories.create": {
              "description": "Create Company GL Account Categories."
            },
            "finance.gl-account-categories.batchCreate": {
              "description": "Batch Create Company GL Account Categories."
            },
            "finance.gl-account-categories.batchGet": {
              "description": "Batch Get Company GL Account Categories."
            },
            "finance.gl-account-categories.batchUpdate": {
              "description": "Batch Update Company GL Account Categories."
            },
            "finance.gl-account-categories.batchPatch": {
              "description": "Batch Patch Company GL Account Categories."
            },
            "finance.gl-account-categories.batchDelete": {
              "description": "Batch Delete Company GL Account Categories."
            },
            "finance.gl-account-categories.batchActivate": {
              "description": "Batch Activate Company GL Account Categories."
            },
            "finance.gl-account-categories.batchDeactivate": {
              "description": "Batch Deactivate Company GL Account Categories."
            },
            "finance.gl-account-categories.activate": {
              "description": "Activate Company GL Account Categories."
            },
            "finance.gl-account-categories.deactivate": {
              "description": "Deactivate Company GL Account Categories."
            },
            "finance.gl-account-categories.get": {
              "description": "Get Company GL Account Categories."
            },
            "finance.gl-account-categories.update": {
              "description": "Update Company GL Account Categories."
            },
            "finance.gl-account-categories.patch": {
              "description": "Patch Company GL Account Categories."
            },
            "finance.gl-account-categories.delete": {
              "description": "Delete Company GL Account Categories."
            }
          }
        },
        "finance.gl-accounts": {
          "title": "Gl Accounts",
          "description": "Gl Accounts operations.",
          "routes": {
            "finance.gl-accounts.list": {
              "description": "List Company GL Accounts."
            },
            "finance.gl-accounts.filter": {
              "description": "Filter Company GL Accounts."
            },
            "finance.gl-accounts.search": {
              "description": "Search Company GL Accounts."
            },
            "finance.gl-accounts.create": {
              "description": "Create Company GL Accounts."
            },
            "finance.gl-accounts.batchCreate": {
              "description": "Batch Create Company GL Accounts."
            },
            "finance.gl-accounts.batchGet": {
              "description": "Batch Get Company GL Accounts."
            },
            "finance.gl-accounts.batchUpdate": {
              "description": "Batch Update Company GL Accounts."
            },
            "finance.gl-accounts.batchPatch": {
              "description": "Batch Patch Company GL Accounts."
            },
            "finance.gl-accounts.batchDelete": {
              "description": "Batch Delete Company GL Accounts."
            },
            "finance.gl-accounts.batchActivate": {
              "description": "Batch Activate Company GL Accounts."
            },
            "finance.gl-accounts.batchDeactivate": {
              "description": "Batch Deactivate Company GL Accounts."
            },
            "finance.gl-accounts.activate": {
              "description": "Activate Company GL Accounts."
            },
            "finance.gl-accounts.deactivate": {
              "description": "Deactivate Company GL Accounts."
            },
            "finance.gl-accounts.get": {
              "description": "Get Company GL Accounts."
            },
            "finance.gl-accounts.update": {
              "description": "Update Company GL Accounts."
            },
            "finance.gl-accounts.patch": {
              "description": "Patch Company GL Accounts."
            },
            "finance.gl-accounts.delete": {
              "description": "Delete Company GL Accounts."
            }
          }
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
          "routes": {
            "finance.inventory-control-accounts.list": {
              "description": "List Company Inventory Control Accounts."
            },
            "finance.inventory-control-accounts.patch": {
              "description": "Patch Company Inventory Control Accounts."
            }
          }
        },
        "finance.inventory-item-posting-profile-assignments": {
          "title": "Inventory Item Posting Profile Assignments",
          "description": "Inventory Item Posting Profile Assignments operations.",
          "routes": {
            "finance.inventory-item-posting-profile-assignments.list": {
              "description": "Lists Inventory items and their Finance-owned posting profile assignments."
            },
            "finance.inventory-item-posting-profile-assignments.assign": {
              "description": "Assigns a Finance-owned posting profile to Inventory item ids."
            }
          }
        },
        "finance.inventory-item-posting-profiles": {
          "title": "Inventory Item Posting Profiles",
          "description": "Inventory Item Posting Profiles operations.",
          "routes": {
            "finance.inventory-item-posting-profiles.list": {
              "description": "List Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.filter": {
              "description": "Filter Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.search": {
              "description": "Search Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.batchGet": {
              "description": "Batch Get Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.batchCreate": {
              "description": "Batch Create Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.batchUpdate": {
              "description": "Batch Update Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.batchPatch": {
              "description": "Batch Patch Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.batchDelete": {
              "description": "Batch Delete Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.create": {
              "description": "Create Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.get": {
              "description": "Get Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.update": {
              "description": "Update Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.patch": {
              "description": "Patch Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.delete": {
              "description": "Delete Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.activate": {
              "description": "Activate Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.deactivate": {
              "description": "Deactivate Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.batchActivate": {
              "description": "Batch Activate Company Inventory Item Posting Profiles."
            },
            "finance.inventory-item-posting-profiles.batchDeactivate": {
              "description": "Batch Deactivate Company Inventory Item Posting Profiles."
            }
          }
        },
        "finance.inventory-ledger": {
          "title": "Inventory Ledger",
          "description": "Inventory Ledger operations.",
          "routes": {
            "finance.inventory-ledger.list": {
              "description": "List Inventory Ledger."
            },
            "finance.inventory-ledger.get": {
              "description": "Get Inventory Ledger."
            }
          }
        },
        "finance.inventory-processing": {
          "title": "Inventory Processing",
          "description": "Inventory Processing operations.",
          "routes": {
            "finance.inventory-processing.listRules": {
              "description": "Lists the Finance decision matrix for Inventory activity."
            },
            "finance.inventory-processing.getRule": {
              "description": "Gets one Finance Inventory processing rule."
            },
            "finance.inventory-processing.patchRule": {
              "description": "Updates the action and offset GL account for an Inventory processing rule."
            },
            "finance.inventory-processing.listInventoryTransactions": {
              "description": "Lists Inventory financial activities received by Finance."
            },
            "finance.inventory-processing.getInventoryTransaction": {
              "description": "Gets one Inventory financial activity received by Finance."
            }
          }
        }
      }
    }
  }
} as const;
