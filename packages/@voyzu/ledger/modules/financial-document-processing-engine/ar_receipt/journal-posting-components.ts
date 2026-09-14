import { ComponentType } from "../core/journal-posting-components";

export const AR_RECEIPT_JOURNAL_POSTING_COMPONENTS = {
  description: "Customer receipts debit a bank or cash account and credit AR control accounts.",
  formula: "Dr Bank / cash = Cr AR receivable + Cr Unapplied cash",
  components: {
    dr_bank_cash: {
      title: "Bank / cash",
      side: "DR",
      type: ComponentType.BANK_CASH,
      ledger: "BANK_CASH",
      control_account: "BANK_OPERATING",
      posting_code: "BANK_CASH_ACCOUNT",
    },
    cr_ar_receivable: {
      title: "Accounts receivable",
      side: "CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_RECEIVABLE",
      code: "AR_TRADE_RECEIVABLES",
    },
    cr_unapplied_cash: {
      title: "Unapplied cash",
      side: "CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_RECEIVABLE",
      code: "AR_UNAPPLIED_CASH",
    },
  },
} as const;

export const AR_RECEIPT_BANK_CASH_COMPONENT = AR_RECEIPT_JOURNAL_POSTING_COMPONENTS.components.dr_bank_cash;
export const AR_RECEIPT_AR_RECEIVABLE_COMPONENT = AR_RECEIPT_JOURNAL_POSTING_COMPONENTS.components.cr_ar_receivable;
export const AR_RECEIPT_UNAPPLIED_CASH_COMPONENT = AR_RECEIPT_JOURNAL_POSTING_COMPONENTS.components.cr_unapplied_cash;

export default AR_RECEIPT_JOURNAL_POSTING_COMPONENTS;
