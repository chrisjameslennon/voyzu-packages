import { ComponentType } from "../core/journal-posting-components";
import type { AccountType } from "@voyzu/core/types/modules/core";
/*

    This file:
    1. Powers the document type page in the UI by providing the description and formula for the journal posting, as well as component tiles
    2. Defines the mapping of the journal posting components to the underlying General Lednger accounts and is used by the AR_INVOICE posting engine



*/



export const AR_INVOICE_JOURNAL_POSTING_COMPONENTS = {

  description: 'Customer invoices debit the AR control account and credit revenue and tax output accounts.',
  formula: 'Dr AR receivable = Cr Revenue + Cr Tax output',
  components: {
    dr_ar: {
      title: 'Accounts receivable',
      side: 'DR',
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_RECEIVABLE",
      code: 'AR_TRADE_RECEIVABLES'
    },
    cr_revenue: {
      title: 'Revenue',
      side: 'CR',
      type: ComponentType.POSTING_CODE,
      code: 'REVENUE_ACCOUNT',
      allowedAccountTypes: ["REVENUE"] satisfies readonly AccountType[],
    },
    cr_tax_output: {
      title: 'Tax output',
      side: 'CR',
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "TAX",
      code: 'TAX_ON_SALES'
    }
  }
} as const;

export const AR_INVOICE_AR_RECEIVABLE_COMPONENT = AR_INVOICE_JOURNAL_POSTING_COMPONENTS.components.dr_ar;
export const AR_INVOICE_REVENUE_COMPONENT = AR_INVOICE_JOURNAL_POSTING_COMPONENTS.components.cr_revenue;
export const AR_INVOICE_TAX_OUTPUT_COMPONENT = AR_INVOICE_JOURNAL_POSTING_COMPONENTS.components.cr_tax_output;

export default AR_INVOICE_JOURNAL_POSTING_COMPONENTS;






