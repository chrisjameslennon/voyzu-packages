import type { UiSurfaceMenuGroup } from "@voyzu/types/ui-surface";
export default [
  {
    "label": "Accounting",
    "items": {
      "ledger.menu3.company-general-ledger": {
        "label": "Company General Ledger",
        "icon": "account_balance",
        "children": {
          "ledger.menu3.company-general-ledger.journal-entries": {
            "label": "Journal Entries",
            "routeId": "voyzu.journals.page.list"
          },
          "ledger.menu3.company-general-ledger.account-activity": {
            "label": "Account Activity",
            "routeId": "voyzu.companyReports.page.accountActivity"
          }
        }
      },
      "ledger.menu3.supporting-ledgers": {
        "label": "Supporting Ledgers",
        "icon": "receipt_long",
        "children": {
          "ledger.menu3.supporting-ledgers.accounts-receivable": {
            "label": "Accounts Receivable",
            "children": {
              "ledger.menu3.supporting-ledgers.accounts-receivable.ledger-entries": {
                "label": "Ledger Entries",
                "routeId": "voyzu.ar-subledger-ledger-entries.page.list"
              },
              "ledger.menu3.supporting-ledgers.accounts-receivable.ledger-entry-enquiry": {
                "label": "Ledger Entry Enquiry",
                "routeId": "voyzu.ar-subledger-ledger-entry-enquiry.page.list"
              }
            }
          },
          "ledger.menu3.supporting-ledgers.accounts-payable": {
            "label": "Accounts Payable",
            "children": {
              "ledger.menu3.supporting-ledgers.accounts-payable.ledger-entries": {
                "label": "Ledger Entries",
                "routeId": "voyzu.ap-subledger-ledger-entries.page.list"
              },
              "ledger.menu3.supporting-ledgers.accounts-payable.ledger-entry-enquiry": {
                "label": "Ledger Entry Enquiry",
                "routeId": "voyzu.ap-subledger-ledger-entry-enquiry.page.list"
              }
            }
          },
          "ledger.menu3.supporting-ledgers.tax-ledger": {
            "label": "Tax Ledger",
            "children": {
              "ledger.menu3.supporting-ledgers.tax-ledger.ledger-entries": {
                "label": "Ledger Entries",
                "routeId": "voyzu.tax-ledger.page.list"
              }
            }
          },
          "ledger.menu3.supporting-ledgers.inventory-ledger": {
            "label": "Inventory Ledger",
            "children": {
              "ledger.menu3.supporting-ledgers.inventory-ledger.ledger-entries": {
                "label": "Ledger Entries",
                "routeId": "voyzu.inventory-ledger.page.list"
              },
              "ledger.menu3.supporting-ledgers.inventory-ledger.stock-valuation": {
                "label": "Stock Valuation",
                "routeId": "voyzu.inventory-ledger.page.valuation"
              }
            }
          }
        }
      }
    }
  },
  {
    "label": "Integration",
    "items": {
      "ledger.menu2.financial-document-types": {
        "label": "Financial Document Types",
        "icon": "description",
        "routeId": "voyzu.company-financial-document-types.page.list"
      },
      "ledger.menu2.inventory": {
        "label": "Inventory",
        "icon": "inventory_2",
        "children": {
          "ledger.menu2.inventory.item-valuation": {
            "label": "Item Valuation",
            "path": "/ledger/inventory/item-valuation"
          },
          "ledger.menu2.inventory.movement-processing-rules": {
            "label": "Movement Processing Rules",
            "routeId": "voyzu.inventory-processing.page.rules"
          },
          "ledger.menu2.inventory.inventory-transactions": {
            "label": "Inventory Transactions",
            "routeId": "voyzu.inventory-processing.page.inventory-transactions"
          }
        }
      }
    }
  },
  {
    "label": "SETTINGS",
    "items": {
      "ledger.menu3.settings": {
        "label": "Settings",
        "icon": "settings",
        "children": {
          "ledger.menu3.settings.general-ledger": {
            "label": "General Ledger",
            "children": {
              "ledger.menu3.settings.general-ledger.general-ledger-accounts": {
                "label": "General Ledger Accounts",
                "routeId": "voyzu.company-gl-accounts.page.list"
              },
              "ledger.menu3.settings.general-ledger.reporting-categories": {
                "label": "Reporting Categories",
                "routeId": "voyzu.company-gl-account-categories.page.list"
              }
            }
          },
          "ledger.menu3.settings.control-accounts": {
            "label": "Control Accounts",
            "children": {
              "ledger.menu3.settings.control-accounts.accounts-payable-control-accounts": {
                "label": "Accounts Payable Control Accounts",
                "routeId": "voyzu.company-ap-control-accounts.page.list"
              },
              "ledger.menu3.settings.control-accounts.accounts-receivable-control-accounts": {
                "label": "Accounts Receivable Control Accounts",
                "routeId": "voyzu.company-ar-control-accounts.page.list"
              },
              "ledger.menu3.settings.control-accounts.bank-cash-accounts": {
                "label": "Bank / Cash Accounts",
                "routeId": "voyzu.company-bank-cash-accounts.page.list"
              },
              "ledger.menu3.settings.control-accounts.tax-control-accounts": {
                "label": "Tax Control Accounts",
                "routeId": "voyzu.company-tax-control-accounts.page.list"
              },
              "ledger.menu3.settings.control-accounts.inventory-control-accounts": {
                "label": "Inventory Control Accounts",
                "routeId": "voyzu.company-inventory-control-accounts.page.list"
              }
            }
          },
          "ledger.menu3.settings.integration": {
            "label": "Integration",
            "children": {
              "ledger.menu3.settings.integration.financial-document-defaults": {
                "label": "Financial Document Defaults",
                "routeId": "voyzu.company-financial-document-defaults.page.list"
              },
              "ledger.menu3.settings.integration.item-posting-profiles": {
                "label": "Item Posting Profiles",
                "routeId": "voyzu.company-inventory-item-posting-profiles.page.list"
              },
              "ledger.menu3.settings.integration.posting-profile-assignments": {
                "label": "Posting Profile Assignments",
                "routeId": "voyzu.company-inventory-item-posting-profile-assignments.page.list"
              }
            }
          },
          "ledger.menu3.settings.dimensions": {
            "label": "Dimensions",
            "routeId": "voyzu.company-dimensions.page.list"
          },
          "ledger.menu3.financial-periods": {
            "label": "Financial Periods",
            "icon": "calendar_month",
            "routeId": "voyzu.financial-years.page.list"
          }
        }
      },
      "ledger.menu3.global-settings": {
        "label": "Global Settings",
        "icon": "public",
        "children": {
          "ledger.menu3.global-settings.country-tax-settings": {
            "label": "Country Tax Settings",
            "routeId": "voyzu.countryTaxSettings.page.list"
          }
        }
      }
    }
  },
  {
    "label": "Reports",
    "items": {
      "ledger.menu4.position": {
        "label": "Position",
        "icon": "account_balance_wallet",
        "children": {
          "ledger.menu4.position.balance-sheet": {
            "label": "Balance Sheet",
            "routeId": "voyzu.companyReports.page.balanceSheet"
          },
          "ledger.menu4.position.tax-position": {
            "label": "Tax Position",
            "routeId": "voyzu.companyReports.page.taxPosition"
          }
        }
      },
      "ledger.menu4.movement": {
        "label": "Movement",
        "icon": "trending_up",
        "children": {
          "ledger.menu4.movement.profit-loss": {
            "label": "Profit & Loss",
            "routeId": "voyzu.companyReports.page.profitLoss"
          },
          "ledger.menu4.movement.profit-loss-analysis": {
            "label": "Profit & Loss Analysis",
            "routeId": "voyzu.companyReports.page.profitLossAnalysis"
          },
          "ledger.menu4.movement.bank-cash-movement": {
            "label": "Bank / Cash Movement",
            "routeId": "voyzu.companyReports.page.bankCashMovement"
          },
          "ledger.menu4.movement.tax-return": {
            "label": "Tax Return",
            "routeId": "voyzu.companyReports.page.taxActivity"
          }
        }
      },
      "ledger.menu4.reconciliation": {
        "label": "Reconciliation",
        "icon": "rule",
        "children": {
          "ledger.menu4.reconciliation.trial-balance": {
            "label": "Trial Balance",
            "routeId": "voyzu.companyReports.page.trialBalance"
          },
          "ledger.menu4.reconciliation.tax-reconciliation": {
            "label": "Tax Reconciliation",
            "routeId": "voyzu.companyReports.page.taxActivityReconciliation"
          }
        }
      },
      "ledger.menu4.audit": {
        "label": "Audit",
        "icon": "manage_search",
        "children": {
          "ledger.menu4.audit.financial-integrity": {
            "label": "Financial Integrity",
            "routeId": "voyzu.companyReports.page.financialIntegrity"
          },
          "ledger.menu4.audit.journal-entries": {
            "label": "Journal Entries",
            "routeId": "voyzu.companyReports.page.journalEntries"
          },
          "ledger.menu4.audit.ar-subledger-entries": {
            "label": "AR Subledger Entries",
            "routeId": "voyzu.companyReports.page.arSubledgerEntriesAudit"
          },
          "ledger.menu4.audit.ap-subledger-entries": {
            "label": "AP Subledger Entries",
            "routeId": "voyzu.companyReports.page.apSubledgerEntriesAudit"
          },
          "ledger.menu4.audit.inventory-ledger-entries": {
            "label": "Inventory Ledger Entries",
            "routeId": "voyzu.companyReports.page.inventoryLedgerEntriesAudit"
          },
          "ledger.menu4.audit.tax-ledger-entries": {
            "label": "Tax Ledger Entries",
            "routeId": "voyzu.companyReports.page.taxLedgerEntriesAudit"
          }
        }
      }
    }
  }
] as const satisfies readonly UiSurfaceMenuGroup[];
