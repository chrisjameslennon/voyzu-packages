import { getAccessibleOrganization } from "./organization-access";
import { withFinanceDocumentCapture } from "./record-finance-document";
import { BusinessRuleError } from "@voyzu/capability/errors";
import { processApBill } from "../modules/financial-document-processing-engine/ap_bill/lib/ap-bill.service";
import { processApBillCancellation } from "../modules/financial-document-processing-engine/ap_bill_cancellation/lib/ap-bill-cancellation.service";
import { processApCreditNote } from "../modules/financial-document-processing-engine/ap_credit_note/lib/ap-credit-note.service";
import { processApOpeningBalance } from "../modules/financial-document-processing-engine/ap_opening_balance/lib/ap-opening-balance.service";
import { processApPayment } from "../modules/financial-document-processing-engine/ap_payment/lib/ap-payment.service";
import { processApPaymentApplication } from "../modules/financial-document-processing-engine/ap_payment_application/lib/ap-payment-application.service";
import { processApRefund } from "../modules/financial-document-processing-engine/ap_refund/lib/ap-refund.service";
import { processApWriteOff } from "../modules/financial-document-processing-engine/ap_write_off/lib/ap-write-off.service";
import { processArCreditNote } from "../modules/financial-document-processing-engine/ar_credit_note/lib/ar-credit-note.service";
import { processArInvoice } from "../modules/financial-document-processing-engine/ar_invoice/lib/ar-invoice.service";
import { processArInvoiceCancellation } from "../modules/financial-document-processing-engine/ar_invoice_cancellation/lib/ar-invoice-cancellation.service";
import { processArOpeningBalance } from "../modules/financial-document-processing-engine/ar_opening_balance/lib/ar-opening-balance.service";
import { processArReceipt } from "../modules/financial-document-processing-engine/ar_receipt/lib/ar-receipt.service";
import { processArReceiptApplication } from "../modules/financial-document-processing-engine/ar_receipt_application/lib/ar-receipt-application.service";
import { processArRefund } from "../modules/financial-document-processing-engine/ar_refund/lib/ar-refund.service";
import { processArWriteOff } from "../modules/financial-document-processing-engine/ar_write_off/lib/ar-write-off.service";
import { processInventoryAdjustment } from "../modules/financial-document-processing-engine/inventory/lib/inventory-processing.service";
import { processInventoryIssue } from "../modules/financial-document-processing-engine/inventory/lib/inventory-processing.service";
import { processInventoryReceipt } from "../modules/financial-document-processing-engine/inventory/lib/inventory-processing.service";
import { processLedgerJournal } from "../modules/financial-document-processing-engine/ledger_journal/lib/ledger-journal.service";
import { processLedgerJournalReversal } from "../modules/financial-document-processing-engine/ledger_journal/lib/ledger-journal-reversal.service";
import { processTaxAdjustment } from "../modules/financial-document-processing-engine/tax_adjustment/lib/tax-adjustment.service";
import { processTaxPayment } from "../modules/financial-document-processing-engine/tax_payment/lib/tax-payment.service";
import { processTaxRefund } from "../modules/financial-document-processing-engine/tax_refund/lib/tax-refund.service";
async function scopedDocument<T extends { company_code?: string | null }>(input: { organization_id: number; document: T }) {
 const organization = await getAccessibleOrganization({ organization_id: input.organization_id });
 if (input.document.company_code && input.document.company_code !== organization.code) throw new BusinessRuleError("Document company does not match organization_id");
 return { ...input.document, company_code: organization.code };
}
export const postingMethods = {
 apBill: async (input: { organization_id: number; document: Parameters<typeof processApBill>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processApBill(document)); },
 apBillCancellation: async (input: { organization_id: number; document: Parameters<typeof processApBillCancellation>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processApBillCancellation(document)); },
 apCreditNote: async (input: { organization_id: number; document: Parameters<typeof processApCreditNote>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processApCreditNote(document)); },
 apOpeningBalance: async (input: { organization_id: number; document: Parameters<typeof processApOpeningBalance>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processApOpeningBalance(document)); },
 apPayment: async (input: { organization_id: number; document: Parameters<typeof processApPayment>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processApPayment(document)); },
 apPaymentApplication: async (input: { organization_id: number; document: Parameters<typeof processApPaymentApplication>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processApPaymentApplication(document)); },
 apRefund: async (input: { organization_id: number; document: Parameters<typeof processApRefund>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processApRefund(document)); },
 apWriteOff: async (input: { organization_id: number; document: Parameters<typeof processApWriteOff>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processApWriteOff(document)); },
 arCreditNote: async (input: { organization_id: number; document: Parameters<typeof processArCreditNote>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processArCreditNote(document)); },
 arInvoice: async (input: { organization_id: number; document: Parameters<typeof processArInvoice>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processArInvoice(document)); },
 arInvoiceCancellation: async (input: { organization_id: number; document: Parameters<typeof processArInvoiceCancellation>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processArInvoiceCancellation(document)); },
 arOpeningBalance: async (input: { organization_id: number; document: Parameters<typeof processArOpeningBalance>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processArOpeningBalance(document)); },
 arReceipt: async (input: { organization_id: number; document: Parameters<typeof processArReceipt>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processArReceipt(document)); },
 arReceiptApplication: async (input: { organization_id: number; document: Parameters<typeof processArReceiptApplication>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processArReceiptApplication(document)); },
 arRefund: async (input: { organization_id: number; document: Parameters<typeof processArRefund>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processArRefund(document)); },
 arWriteOff: async (input: { organization_id: number; document: Parameters<typeof processArWriteOff>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processArWriteOff(document)); },
 inventoryAdjustment: async (input: { organization_id: number; document: Parameters<typeof processInventoryAdjustment>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processInventoryAdjustment(document)); },
 inventoryIssue: async (input: { organization_id: number; document: Parameters<typeof processInventoryIssue>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processInventoryIssue(document)); },
 inventoryReceipt: async (input: { organization_id: number; document: Parameters<typeof processInventoryReceipt>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processInventoryReceipt(document)); },
 ledgerJournal: async (input: { organization_id: number; document: Parameters<typeof processLedgerJournal>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processLedgerJournal(document)); },
 ledgerJournalReversal: async (input: { organization_id: number; document: Parameters<typeof processLedgerJournalReversal>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processLedgerJournalReversal(document)); },
 taxAdjustment: async (input: { organization_id: number; document: Parameters<typeof processTaxAdjustment>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processTaxAdjustment(document)); },
 taxPayment: async (input: { organization_id: number; document: Parameters<typeof processTaxPayment>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processTaxPayment(document)); },
 taxRefund: async (input: { organization_id: number; document: Parameters<typeof processTaxRefund>[0] }) => { const document = await scopedDocument(input); return withFinanceDocumentCapture(() => processTaxRefund(document)); },
};
