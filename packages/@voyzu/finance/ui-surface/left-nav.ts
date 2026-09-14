import type { UiSurfaceMenuGroup } from "@voyzu/types/ui-surface";

export default [
  {
    "label": "Operations",
    "items": {
      "finance.menu1.accounts-receivable": {
        "label": "Accounts Receivable",
        "icon": "receipt_long",
        "children": {
          "finance.menu1.accounts-receivable.invoices": {
            "label": "Invoices",
            "routeId": "voyzu.operations-invoices.page.list"
          },
          "finance.menu1.accounts-receivable.sales-items": {
            "label": "Sales Items",
            "routeId": "voyzu.operations-invoices.page.sales-items"
          },
          "finance.menu1.accounts-receivable.statements": {
            "label": "Statements",
            "routeId": "voyzu.ar-subledger-statements.page.list"
          },
          "finance.menu1.accounts-receivable.counterparties": {
            "label": "Counterparties",
            "routeId": "voyzu.ar-subledger-counterparties.page.list"
          }
        }
      },
      "finance.menu1.accounts-payable": {
        "label": "Accounts Payable",
        "icon": "payments",
        "children": {
          "finance.menu1.accounts-payable.bills": {
            "label": "Bills",
            "routeId": "voyzu.ap-subledger-bills.page.list"
          },
          "finance.menu1.accounts-payable.purchase-items": {
            "label": "Purchase Items",
            "path": "/finance/operations/accounts-payable/purchase-items"
          },
          "finance.menu1.accounts-payable.statements": {
            "label": "Statements",
            "routeId": "voyzu.ap-subledger-statements.page.list"
          },
          "finance.menu1.accounts-payable.counterparties": {
            "label": "Counterparties",
            "routeId": "voyzu.ap-subledger-counterparties.page.list"
          }
        }
      }
    }
  },
  {
    "label": "Integration",
    "items": {
      "finance.menu2.financial-document-types": {
        "label": "Financial Document Types",
        "icon": "description",
        "routeId": "voyzu.company-financial-document-types.page.list"
      },
      "finance.menu2.inventory": {
        "label": "Inventory",
        "icon": "inventory_2",
        "children": {
          "finance.menu2.inventory.item-valuation": {
            "label": "Item Valuation",
            "path": "/finance/inventory/item-valuation"
          },
          "finance.menu2.inventory.movement-processing-rules": {
            "label": "Movement Processing Rules",
            "routeId": "voyzu.inventory-processing.page.rules"
          },
          "finance.menu2.inventory.inventory-transactions": {
            "label": "Inventory Transactions",
            "routeId": "voyzu.inventory-processing.page.inventory-transactions"
          }
        }
      }
    }
  },
  {
    "label": "Accounting",
    "items": {
      "finance.menu3.company-general-ledger": {
        "label": "Company General Ledger",
        "icon": "account_balance",
        "children": {
          "finance.menu3.company-general-ledger.journal-entries": {
            "label": "Journal Entries",
            "routeId": "voyzu.journals.page.list"
          },
          "finance.menu3.company-general-ledger.account-activity": {
            "label": "Account Activity",
            "routeId": "voyzu.companyReports.page.accountActivity"
          }
        }
      },
      "finance.menu3.supporting-ledgers": {
        "label": "Supporting Ledgers",
        "icon": "receipt_long",
        "children": {
          "finance.menu3.supporting-ledgers.accounts-receivable": {
            "label": "Accounts Receivable",
            "children": {
              "finance.menu3.supporting-ledgers.accounts-receivable.ledger-entries": {
                "label": "Ledger Entries",
                "routeId": "voyzu.ar-subledger-ledger-entries.page.list"
              },
              "finance.menu3.supporting-ledgers.accounts-receivable.ledger-entry-enquiry": {
                "label": "Ledger Entry Enquiry",
                "routeId": "voyzu.ar-subledger-ledger-entry-enquiry.page.list"
              },
              "finance.menu3.supporting-ledgers.accounts-receivable.counterparties": {
                "label": "Counterparties",
                "routeId": "voyzu.ar-subledger-counterparties.page.list"
              },
              "finance.menu3.supporting-ledgers.accounts-receivable.statements": {
                "label": "Statements",
                "routeId": "voyzu.ar-subledger-statements.page.list"
              },
              "finance.menu3.supporting-ledgers.accounts-receivable.invoices": {
                "label": "Invoices",
                "routeId": "voyzu.ar-subledger-invoices.page.list"
              }
            }
          },
          "finance.menu3.supporting-ledgers.accounts-payable": {
            "label": "Accounts Payable",
            "children": {
              "finance.menu3.supporting-ledgers.accounts-payable.ledger-entries": {
                "label": "Ledger Entries",
                "routeId": "voyzu.ap-subledger-ledger-entries.page.list"
              },
              "finance.menu3.supporting-ledgers.accounts-payable.ledger-entry-enquiry": {
                "label": "Ledger Entry Enquiry",
                "routeId": "voyzu.ap-subledger-ledger-entry-enquiry.page.list"
              },
              "finance.menu3.supporting-ledgers.accounts-payable.counterparties": {
                "label": "Counterparties",
                "routeId": "voyzu.ap-subledger-counterparties.page.list"
              },
              "finance.menu3.supporting-ledgers.accounts-payable.statements": {
                "label": "Statements",
                "routeId": "voyzu.ap-subledger-statements.page.list"
              },
              "finance.menu3.supporting-ledgers.accounts-payable.bills": {
                "label": "Bills",
                "routeId": "voyzu.ap-subledger-bills.page.list"
              }
            }
          },
          "finance.menu3.supporting-ledgers.tax-ledger": {
            "label": "Tax Ledger",
            "children": {
              "finance.menu3.supporting-ledgers.tax-ledger.ledger-entries": {
                "label": "Ledger Entries",
                "routeId": "voyzu.tax-ledger.page.list"
              }
            }
          },
          "finance.menu3.supporting-ledgers.inventory-ledger": {
            "label": "Inventory Ledger",
            "children": {
              "finance.menu3.supporting-ledgers.inventory-ledger.ledger-entries": {
                "label": "Ledger Entries",
                "routeId": "voyzu.inventory-ledger.page.list"
              },
              "finance.menu3.supporting-ledgers.inventory-ledger.stock-valuation": {
                "label": "Stock Valuation",
                "routeId": "voyzu.inventory-ledger.page.valuation"
              }
            }
          }
        }
      },
      "finance.menu3.financial-periods": {
        "label": "Financial Periods",
        "icon": "calendar_month",
        "routeId": "voyzu.financial-years.page.list"
      },
      "finance.menu3.settings": {
        "label": "Settings",
        "icon": "settings",
        "children": {
          "finance.menu3.settings.general-ledger": {
            "label": "General Ledger",
            "children": {
              "finance.menu3.settings.general-ledger.general-ledger-accounts": {
                "label": "General Ledger Accounts",
                "routeId": "voyzu.company-gl-accounts.page.list"
              },
              "finance.menu3.settings.general-ledger.reporting-categories": {
                "label": "Reporting Categories",
                "routeId": "voyzu.company-gl-account-categories.page.list"
              }
            }
          },
          "finance.menu3.settings.control-accounts": {
            "label": "Control Accounts",
            "children": {
              "finance.menu3.settings.control-accounts.accounts-payable-control-accounts": {
                "label": "Accounts Payable Control Accounts",
                "routeId": "voyzu.company-ap-control-accounts.page.list"
              },
              "finance.menu3.settings.control-accounts.accounts-receivable-control-accounts": {
                "label": "Accounts Receivable Control Accounts",
                "routeId": "voyzu.company-ar-control-accounts.page.list"
              },
              "finance.menu3.settings.control-accounts.bank-cash-accounts": {
                "label": "Bank / Cash Accounts",
                "routeId": "voyzu.company-bank-cash-accounts.page.list"
              },
              "finance.menu3.settings.control-accounts.tax-control-accounts": {
                "label": "Tax Control Accounts",
                "routeId": "voyzu.company-tax-control-accounts.page.list"
              },
              "finance.menu3.settings.control-accounts.inventory-control-accounts": {
                "label": "Inventory Control Accounts",
                "routeId": "voyzu.company-inventory-control-accounts.page.list"
              }
            }
          },
          "finance.menu3.settings.integration": {
            "label": "Integration",
            "children": {
              "finance.menu3.settings.integration.financial-document-defaults": {
                "label": "Financial Document Defaults",
                "routeId": "voyzu.company-financial-document-defaults.page.list"
              },
              "finance.menu3.settings.integration.item-posting-profiles": {
                "label": "Item Posting Profiles",
                "routeId": "voyzu.company-inventory-item-posting-profiles.page.list"
              },
              "finance.menu3.settings.integration.posting-profile-assignments": {
                "label": "Posting Profile Assignments",
                "routeId": "voyzu.company-inventory-item-posting-profile-assignments.page.list"
              }
            }
          },
          "finance.menu3.settings.dimensions": {
            "label": "Dimensions",
            "routeId": "voyzu.company-dimensions.page.list"
          }
        }
      },
      "finance.menu3.global-settings": {
        "label": "Global Settings",
        "icon": "public",
        "children": {
          "finance.menu3.global-settings.country-tax-settings": {
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
      "finance.menu4.position": {
        "label": "Position",
        "icon": "account_balance_wallet",
        "children": {
          "finance.menu4.position.balance-sheet": {
            "label": "Balance Sheet",
            "routeId": "voyzu.companyReports.page.balanceSheet"
          },
          "finance.menu4.position.tax-position": {
            "label": "Tax Position",
            "routeId": "voyzu.companyReports.page.taxPosition"
          }
        }
      },
      "finance.menu4.movement": {
        "label": "Movement",
        "icon": "trending_up",
        "children": {
          "finance.menu4.movement.profit-loss": {
            "label": "Profit & Loss",
            "routeId": "voyzu.companyReports.page.profitLoss"
          },
          "finance.menu4.movement.profit-loss-analysis": {
            "label": "Profit & Loss Analysis",
            "routeId": "voyzu.companyReports.page.profitLossAnalysis"
          },
          "finance.menu4.movement.bank-cash-movement": {
            "label": "Bank / Cash Movement",
            "routeId": "voyzu.companyReports.page.bankCashMovement"
          },
          "finance.menu4.movement.tax-return": {
            "label": "Tax Return",
            "routeId": "voyzu.companyReports.page.taxActivity"
          }
        }
      },
      "finance.menu4.reconciliation": {
        "label": "Reconciliation",
        "icon": "rule",
        "children": {
          "finance.menu4.reconciliation.trial-balance": {
            "label": "Trial Balance",
            "routeId": "voyzu.companyReports.page.trialBalance"
          },
          "finance.menu4.reconciliation.tax-reconciliation": {
            "label": "Tax Reconciliation",
            "routeId": "voyzu.companyReports.page.taxActivityReconciliation"
          }
        }
      },
      "finance.menu4.audit": {
        "label": "Audit",
        "icon": "manage_search",
        "children": {
          "finance.menu4.audit.financial-integrity": {
            "label": "Financial Integrity",
            "routeId": "voyzu.companyReports.page.financialIntegrity"
          },
          "finance.menu4.audit.journal-entries": {
            "label": "Journal Entries",
            "routeId": "voyzu.companyReports.page.journalEntries"
          },
          "finance.menu4.audit.ar-subledger-entries": {
            "label": "AR Subledger Entries",
            "routeId": "voyzu.companyReports.page.arSubledgerEntriesAudit"
          },
          "finance.menu4.audit.ap-subledger-entries": {
            "label": "AP Subledger Entries",
            "routeId": "voyzu.companyReports.page.apSubledgerEntriesAudit"
          },
          "finance.menu4.audit.inventory-ledger-entries": {
            "label": "Inventory Ledger Entries",
            "routeId": "voyzu.companyReports.page.inventoryLedgerEntriesAudit"
          },
          "finance.menu4.audit.tax-ledger-entries": {
            "label": "Tax Ledger Entries",
            "routeId": "voyzu.companyReports.page.taxLedgerEntriesAudit"
          }
        }
      }
    }
  }
] as const satisfies readonly UiSurfaceMenuGroup[];
