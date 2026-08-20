import "server-only";

import * as service0 from "./ap_bill/lib/ap-bill.service";
import * as service1 from "./ap_bill_cancellation/lib/ap-bill-cancellation.service";
import * as service2 from "./ap_credit_note/lib/ap-credit-note.service";
import * as service3 from "./ap_opening_balance/lib/ap-opening-balance.service";
import * as service4 from "./ap_payment/lib/ap-payment.service";
import * as service5 from "./ap_payment_application/lib/ap-payment-application.service";
import * as service6 from "./ap_refund/lib/ap-refund.service";
import * as service7 from "./ap_write_off/lib/ap-write-off.service";
import * as service8 from "./ar_credit_note/lib/ar-credit-note.service";
import * as service9 from "./ar_invoice/lib/ar-invoice.service";
import * as service10 from "./ar_invoice_cancellation/lib/ar-invoice-cancellation.service";
import * as service11 from "./ar_opening_balance/lib/ar-opening-balance.service";
import * as service12 from "./ar_receipt/lib/ar-receipt.service";
import * as service13 from "./ar_receipt_application/lib/ar-receipt-application.service";
import * as service14 from "./ar_refund/lib/ar-refund.service";
import * as service15 from "./ar_write_off/lib/ar-write-off.service";
import * as service16 from "./core/ap_processing/ap-processing.service";
import * as service17 from "./core/tax_processing/tax-processing.service";
import * as service18 from "./inventory/lib/inventory-processing.service";
import * as service19 from "./ledger_journal/lib/ledger-journal-reversal.service";
import * as service20 from "./ledger_journal/lib/ledger-journal.service";
import * as service21 from "./tax_adjustment/lib/tax-adjustment.service";
import * as service22 from "./tax_payment/lib/tax-payment.service";
import * as service23 from "./tax_refund/lib/tax-refund.service";
import * as service24 from "./core/ar_adjustments/lib/ar-adjustment.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const processApBill = operation(service0.processApBill);
export const processApBillCancellation = operation(service1.processApBillCancellation);
export const processApCreditNote = operation(service2.processApCreditNote);
export const processApOpeningBalance = operation(service3.processApOpeningBalance);
export const processApPayment = operation(service4.processApPayment);
export const processApPaymentApplication = operation(service5.processApPaymentApplication);
export const processApRefund = operation(service6.processApRefund);
export const processApWriteOff = operation(service7.processApWriteOff);
export const processArCreditNote = operation(service8.processArCreditNote);
export const processArInvoice = operation(service9.processArInvoice);
export const processArInvoiceCancellation = operation(service10.processArInvoiceCancellation);
export const processArOpeningBalance = operation(service11.processArOpeningBalance);
export const processArReceipt = operation(service12.processArReceipt);
export const processArReceiptApplication = operation(service13.processArReceiptApplication);
export const processArRefund = operation(service14.processArRefund);
export const processArWriteOff = operation(service15.processArWriteOff);
export const processApDocument = operation(service16.processApDocument);
export const processTaxDocument = operation(service17.processTaxDocument);
export const processInventoryReceipt = operation(service18.processInventoryReceipt);
export const processInventoryIssue = operation(service18.processInventoryIssue);
export const processInventoryAdjustment = operation(service18.processInventoryAdjustment);
export const processLedgerJournalReversal = operation(service19.processLedgerJournalReversal);
export const processLedgerJournal = operation(service20.processLedgerJournal);
export const processTaxAdjustment = operation(service21.processTaxAdjustment);
export const processTaxPayment = operation(service22.processTaxPayment);
export const processTaxRefund = operation(service23.processTaxRefund);
export const processArAdjustment = operation(service24.processArAdjustment);

export const operations = {
  processApBill,
  processApBillCancellation,
  processApCreditNote,
  processApOpeningBalance,
  processApPayment,
  processApPaymentApplication,
  processApRefund,
  processApWriteOff,
  processArCreditNote,
  processArInvoice,
  processArInvoiceCancellation,
  processArOpeningBalance,
  processArReceipt,
  processArReceiptApplication,
  processArRefund,
  processArWriteOff,
  processApDocument,
  processTaxDocument,
  processInventoryReceipt,
  processInventoryIssue,
  processInventoryAdjustment,
  processLedgerJournalReversal,
  processLedgerJournal,
  processTaxAdjustment,
  processTaxPayment,
  processTaxRefund,
  processArAdjustment,
} as const;
