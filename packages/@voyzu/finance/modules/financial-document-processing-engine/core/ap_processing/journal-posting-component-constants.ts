import apBillPosting from "../../ap_bill/journal-posting-components";
import apBillCancellationPosting from "../../ap_bill_cancellation/journal-posting-components";
import apCreditNotePosting from "../../ap_credit_note/journal-posting-components";
import apOpeningBalancePosting from "../../ap_opening_balance/journal-posting-components";
import apPaymentPosting from "../../ap_payment/journal-posting-components";
import apPaymentApplicationPosting from "../../ap_payment_application/journal-posting-components";
import apRefundPosting from "../../ap_refund/journal-posting-components";
import apWriteOffPosting from "../../ap_write_off/journal-posting-components";

export const AP_TRADE_CONTROL_CODE = apPaymentPosting.components.dr_ap_payable.code;
export const AP_UNAPPLIED_CONTROL_CODE = apPaymentPosting.components.dr_unapplied_payments.code;
export const AP_TAX_ON_PURCHASES_CONTROL_CODE = apBillPosting.components.dr_tax_on_purchases.code;

export const AP_BILL_PURCHASE_POSTING_CODE = apBillPosting.components.dr_purchase.code;

export const AP_CREDIT_NOTE_PURCHASE_POSTING_CODE = apCreditNotePosting.components.cr_purchase.code;

export const AP_OPENING_BALANCE_EQUITY_ACCOUNT_POSTING_CODE =
  apOpeningBalancePosting.components.dr_opening_balance_equity.code;

export const AP_PAYMENT_CASH_POSTING_CODE = apPaymentPosting.components.cr_bank_cash.posting_code;

export const AP_REFUND_CASH_POSTING_CODE = apRefundPosting.components.dr_bank_cash.posting_code;

export const AP_WRITE_OFF_INCOME_POSTING_CODE = apWriteOffPosting.components.cr_write_off_income.code;

export const AP_PAYMENT_APPLICATION_UNAPPLIED_CONTROL_CODE =
  apPaymentApplicationPosting.components.cr_unapplied_payments.code;
export const AP_BILL_CANCELLATION_AP_PAYABLE_CONTROL_CODE =
  apBillCancellationPosting.components.dr_ap_payable.code;
