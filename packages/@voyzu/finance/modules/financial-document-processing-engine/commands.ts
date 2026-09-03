import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { ApCreditNoteRequestDto, ApOpeningBalanceRequestDto, ApRefundRequestDto, ApWriteOffRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-adjustment.request.dto";
import { ApBillCancellationRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-bill-cancellation.request.dto";
import { ApBillRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-bill.request.dto";
import { ApBillPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-bill.response.dto";
import { ApPaymentApplicationRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-payment-application.request.dto";
import { ApPaymentRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-payment.request.dto";
import { ApProcessingDocumentType, ApProcessingPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ap-processing.response.dto";
import { ArAdjustmentPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";
import { ArCreditNoteRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-credit-note.request.dto";
import { ArInvoiceCancellationRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-invoice-cancellation.request.dto";
import { ArInvoiceCancellationPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-invoice-cancellation.response.dto";
import { ArInvoiceRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-invoice.request.dto";
import { ArInvoicePostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-invoice.response.dto";
import { ArOpeningBalanceRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-opening-balance.request.dto";
import { ArReceiptApplicationRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt-application.request.dto";
import { ArReceiptApplicationPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt-application.response.dto";
import { ArReceiptRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt.request.dto";
import { ArReceiptPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt.response.dto";
import { ArRefundRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-refund.request.dto";
import { ArWriteOffRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-write-off.request.dto";
import { InventoryAdjustmentRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/inventory-adjustment.request.dto";
import { InventoryIssueRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/inventory-issue.request.dto";
import { InventoryProcessingPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/inventory-processing.response.dto";
import { InventoryReceiptRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/inventory-receipt.request.dto";
import { LedgerJournalReversalRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal-reversal.request.dto";
import { LedgerJournalReversalPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal-reversal.response.dto";
import { LedgerJournalRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal.request.dto";
import { LedgerJournalPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal.response.dto";
import { TaxProcessingDocumentType, TaxProcessingRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/tax-processing.request.dto";
import { TaxProcessingPostingResponseDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/tax-processing.response.dto";
import { TaxAdjustmentRequestDto, TaxPaymentRequestDto, TaxRefundRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/tax-processing.request.dto";

const PreviewOptionsDto = Type.Object({ preview: Type.Optional(Type.Boolean()) }, { additionalProperties: false });
const ApProcessingRequestDto = Type.Union([
  ApCreditNoteRequestDto, ApOpeningBalanceRequestDto, ApRefundRequestDto, ApWriteOffRequestDto,
  ApPaymentRequestDto, ApPaymentApplicationRequestDto, ApBillCancellationRequestDto,
]);
const ArAdjustmentDocumentTypeDto = Type.Union([
  Type.Literal("AR_CREDIT_NOTE"), Type.Literal("AR_OPENING_BALANCE"), Type.Literal("AR_REFUND"), Type.Literal("AR_WRITE_OFF"),
]);
const ArAdjustmentRequestDto = Type.Union([ArCreditNoteRequestDto, ArOpeningBalanceRequestDto, ArRefundRequestDto, ArWriteOffRequestDto]);


export const processApBill = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ApBillRequestDto]), Type.Tuple([ApBillRequestDto, PreviewOptionsDto])]), result: ApBillPostingResponseDto },
  () => import("./ap_bill/lib/ap-bill.service").then((module) => module.processApBill),
);
export const processApBillCancellation = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ApBillCancellationRequestDto]), Type.Tuple([ApBillCancellationRequestDto, PreviewOptionsDto])]), result: ApProcessingPostingResponseDto },
  () => import("./ap_bill_cancellation/lib/ap-bill-cancellation.service").then((module) => module.processApBillCancellation),
);
export const processApCreditNote = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ApCreditNoteRequestDto]), Type.Tuple([ApCreditNoteRequestDto, PreviewOptionsDto])]), result: ApProcessingPostingResponseDto },
  () => import("./ap_credit_note/lib/ap-credit-note.service").then((module) => module.processApCreditNote),
);
export const processApOpeningBalance = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ApOpeningBalanceRequestDto]), Type.Tuple([ApOpeningBalanceRequestDto, PreviewOptionsDto])]), result: ApProcessingPostingResponseDto },
  () => import("./ap_opening_balance/lib/ap-opening-balance.service").then((module) => module.processApOpeningBalance),
);
export const processApPayment = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ApPaymentRequestDto]), Type.Tuple([ApPaymentRequestDto, PreviewOptionsDto])]), result: ApProcessingPostingResponseDto },
  () => import("./ap_payment/lib/ap-payment.service").then((module) => module.processApPayment),
);
export const processApPaymentApplication = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ApPaymentApplicationRequestDto]), Type.Tuple([ApPaymentApplicationRequestDto, PreviewOptionsDto])]), result: ApProcessingPostingResponseDto },
  () => import("./ap_payment_application/lib/ap-payment-application.service").then((module) => module.processApPaymentApplication),
);
export const processApRefund = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ApRefundRequestDto]), Type.Tuple([ApRefundRequestDto, PreviewOptionsDto])]), result: ApProcessingPostingResponseDto },
  () => import("./ap_refund/lib/ap-refund.service").then((module) => module.processApRefund),
);
export const processApWriteOff = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ApWriteOffRequestDto]), Type.Tuple([ApWriteOffRequestDto, PreviewOptionsDto])]), result: ApProcessingPostingResponseDto },
  () => import("./ap_write_off/lib/ap-write-off.service").then((module) => module.processApWriteOff),
);
export const processArCreditNote = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ArCreditNoteRequestDto]), Type.Tuple([ArCreditNoteRequestDto, PreviewOptionsDto])]), result: ArAdjustmentPostingResponseDto },
  () => import("./ar_credit_note/lib/ar-credit-note.service").then((module) => module.processArCreditNote),
);
export const processArInvoice = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ArInvoiceRequestDto]), Type.Tuple([ArInvoiceRequestDto, PreviewOptionsDto])]), result: ArInvoicePostingResponseDto },
  () => import("./ar_invoice/lib/ar-invoice.service").then((module) => module.processArInvoice),
);
export const processArInvoiceCancellation = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ArInvoiceCancellationRequestDto]), Type.Tuple([ArInvoiceCancellationRequestDto, PreviewOptionsDto])]), result: ArInvoiceCancellationPostingResponseDto },
  () => import("./ar_invoice_cancellation/lib/ar-invoice-cancellation.service").then((module) => module.processArInvoiceCancellation),
);
export const processArOpeningBalance = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ArOpeningBalanceRequestDto]), Type.Tuple([ArOpeningBalanceRequestDto, PreviewOptionsDto])]), result: ArAdjustmentPostingResponseDto },
  () => import("./ar_opening_balance/lib/ar-opening-balance.service").then((module) => module.processArOpeningBalance),
);
export const processArReceipt = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ArReceiptRequestDto]), Type.Tuple([ArReceiptRequestDto, PreviewOptionsDto])]), result: ArReceiptPostingResponseDto },
  () => import("./ar_receipt/lib/ar-receipt.service").then((module) => module.processArReceipt),
);
export const processArReceiptApplication = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ArReceiptApplicationRequestDto]), Type.Tuple([ArReceiptApplicationRequestDto, PreviewOptionsDto])]), result: ArReceiptApplicationPostingResponseDto },
  () => import("./ar_receipt_application/lib/ar-receipt-application.service").then((module) => module.processArReceiptApplication),
);
export const processArRefund = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ArRefundRequestDto]), Type.Tuple([ArRefundRequestDto, PreviewOptionsDto])]), result: ArAdjustmentPostingResponseDto },
  () => import("./ar_refund/lib/ar-refund.service").then((module) => module.processArRefund),
);
export const processArWriteOff = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ArWriteOffRequestDto]), Type.Tuple([ArWriteOffRequestDto, PreviewOptionsDto])]), result: ArAdjustmentPostingResponseDto },
  () => import("./ar_write_off/lib/ar-write-off.service").then((module) => module.processArWriteOff),
);
export const processApDocument = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ApProcessingDocumentType, ApProcessingRequestDto]), Type.Tuple([ApProcessingDocumentType, ApProcessingRequestDto, PreviewOptionsDto])]), result: ApProcessingPostingResponseDto },
  () => import("./core/ap_processing/ap-processing.service").then((module) => module.processApDocument),
);
export const processTaxDocument = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([TaxProcessingDocumentType, TaxProcessingRequestDto]), Type.Tuple([TaxProcessingDocumentType, TaxProcessingRequestDto, PreviewOptionsDto])]), result: TaxProcessingPostingResponseDto },
  () => import("./core/tax_processing/tax-processing.service").then((module) => module.processTaxDocument),
);
export const processInventoryReceipt = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([InventoryReceiptRequestDto]), Type.Tuple([InventoryReceiptRequestDto, PreviewOptionsDto])]), result: InventoryProcessingPostingResponseDto },
  () => import("./inventory/lib/inventory-processing.service").then((module) => module.processInventoryReceipt),
);
export const processInventoryIssue = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([InventoryIssueRequestDto]), Type.Tuple([InventoryIssueRequestDto, PreviewOptionsDto])]), result: InventoryProcessingPostingResponseDto },
  () => import("./inventory/lib/inventory-processing.service").then((module) => module.processInventoryIssue),
);
export const processInventoryAdjustment = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([InventoryAdjustmentRequestDto]), Type.Tuple([InventoryAdjustmentRequestDto, PreviewOptionsDto])]), result: InventoryProcessingPostingResponseDto },
  () => import("./inventory/lib/inventory-processing.service").then((module) => module.processInventoryAdjustment),
);
export const processLedgerJournalReversal = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([LedgerJournalReversalRequestDto]), Type.Tuple([LedgerJournalReversalRequestDto, PreviewOptionsDto])]), result: LedgerJournalReversalPostingResponseDto },
  () => import("./ledger_journal/lib/ledger-journal-reversal.service").then((module) => module.processLedgerJournalReversal),
);
export const processLedgerJournal = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([LedgerJournalRequestDto]), Type.Tuple([LedgerJournalRequestDto, PreviewOptionsDto])]), result: LedgerJournalPostingResponseDto },
  () => import("./ledger_journal/lib/ledger-journal.service").then((module) => module.processLedgerJournal),
);
export const processTaxAdjustment = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([TaxAdjustmentRequestDto]), Type.Tuple([TaxAdjustmentRequestDto, PreviewOptionsDto])]), result: TaxProcessingPostingResponseDto },
  () => import("./tax_adjustment/lib/tax-adjustment.service").then((module) => module.processTaxAdjustment),
);
export const processTaxPayment = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([TaxPaymentRequestDto]), Type.Tuple([TaxPaymentRequestDto, PreviewOptionsDto])]), result: TaxProcessingPostingResponseDto },
  () => import("./tax_payment/lib/tax-payment.service").then((module) => module.processTaxPayment),
);
export const processTaxRefund = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([TaxRefundRequestDto]), Type.Tuple([TaxRefundRequestDto, PreviewOptionsDto])]), result: TaxProcessingPostingResponseDto },
  () => import("./tax_refund/lib/tax-refund.service").then((module) => module.processTaxRefund),
);
export const processArAdjustment = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([ArAdjustmentDocumentTypeDto, ArAdjustmentRequestDto]), Type.Tuple([ArAdjustmentDocumentTypeDto, ArAdjustmentRequestDto, PreviewOptionsDto])]), result: ArAdjustmentPostingResponseDto },
  () => import("./core/ar_adjustments/lib/ar-adjustment.service").then((module) => module.processArAdjustment),
);

export const commands = {
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
