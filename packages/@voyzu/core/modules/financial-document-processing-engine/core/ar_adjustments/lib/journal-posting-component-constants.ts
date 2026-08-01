import arCreditNotePosting from "../../../ar_credit_note/journal-posting-components";
import arOpeningBalancePosting from "../../../ar_opening_balance/journal-posting-components";
import arRefundPosting from "../../../ar_refund/journal-posting-components";
import arWriteOffPosting from "../../../ar_write_off/journal-posting-components";

export const AR_CREDIT_NOTE_AR_RECEIVABLE_CONTROL_CODE =
  arCreditNotePosting.components.cr_ar_receivable.code;
export const AR_CREDIT_NOTE_UNAPPLIED_CASH_CONTROL_CODE =
  arCreditNotePosting.components.cr_unapplied_cash.code;
export const AR_CREDIT_NOTE_REVENUE_POSTING_CODE =
  arCreditNotePosting.components.dr_revenue.code;
export const AR_CREDIT_NOTE_REVENUE_POSTING_CODE_SLOT = "revenue_posting_code";
export const AR_CREDIT_NOTE_TAX_ON_SALES_MOVEMENT_CODE =
  arCreditNotePosting.components.dr_tax_output.code;

export const AR_OPENING_BALANCE_AR_RECEIVABLE_CONTROL_CODE =
  arOpeningBalancePosting.components.dr_ar_receivable.code;
export const AR_OPENING_BALANCE_EQUITY_ACCOUNT_POSTING_CODE =
  arOpeningBalancePosting.components.cr_opening_balance_equity.code;
export const AR_OPENING_BALANCE_EQUITY_ACCOUNT_POSTING_CODE_SLOT = "opening_balance_equity_posting_code";

export const AR_REFUND_UNAPPLIED_CASH_CONTROL_CODE =
  arRefundPosting.components.dr_unapplied_cash.code;
export const AR_REFUND_CASH_POSTING_CODE =
  arRefundPosting.components.cr_bank_cash.posting_code;
export const AR_REFUND_CASH_POSTING_CODE_SLOT = "bank_cash_account_code";

export const AR_WRITE_OFF_EXPENSE_POSTING_CODE =
  arWriteOffPosting.components.dr_write_off_expense.code;
export const AR_WRITE_OFF_EXPENSE_POSTING_CODE_SLOT = "write_off_expense_posting_code";
export const AR_WRITE_OFF_AR_RECEIVABLE_CONTROL_CODE =
  arWriteOffPosting.components.cr_ar_receivable.code;
