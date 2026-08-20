import { handleProcessApBill, handleProcessApBillCancellation, handleProcessApCreditNote, handleProcessApOpeningBalance, handleProcessApPayment, handleProcessApPaymentApplication, handleProcessApRefund, handleProcessApWriteOff, handleProcessArCreditNote, handleProcessArInvoice, handleProcessArInvoiceCancellation, handleProcessArOpeningBalance, handleProcessArReceipt, handleProcessArReceiptApplication, handleProcessArRefund, handleProcessArWriteOff, handleProcessInventoryAdjustment, handleProcessInventoryIssue, handleProcessInventoryReceipt, handleProcessLedgerJournal, handleProcessLedgerJournalReversal, handleProcessTaxAdjustment, handleProcessTaxPayment, handleProcessTaxRefund } from "@voyzu/core/financial-document-processing-engine/server";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { TaxProcessingPostingResponseDto } from "../../types/modules/financial-document-processing-engine/tax-processing.response.dto";
import { TaxAdjustmentRequestDto, TaxPaymentRequestDto, TaxRefundRequestDto } from "../../types/modules/financial-document-processing-engine/tax-processing.request.dto";
import { LedgerJournalReversalPostingResponseDto } from "../../types/modules/financial-document-processing-engine/ledger-journal-reversal.response.dto";
import { LedgerJournalReversalRequestDto } from "../../types/modules/financial-document-processing-engine/ledger-journal-reversal.request.dto";
import { LedgerJournalPostingResponseDto } from "../../types/modules/financial-document-processing-engine/ledger-journal.response.dto";
import { LedgerJournalRequestDto } from "../../types/modules/financial-document-processing-engine/ledger-journal.request.dto";
import { InventoryProcessingPostingResponseDto } from "../../types/modules/financial-document-processing-engine/inventory-processing.response.dto";
import { InventoryReceiptRequestDto } from "../../types/modules/financial-document-processing-engine/inventory-receipt.request.dto";
import { InventoryIssueRequestDto } from "../../types/modules/financial-document-processing-engine/inventory-issue.request.dto";
import { InventoryAdjustmentRequestDto } from "../../types/modules/financial-document-processing-engine/inventory-adjustment.request.dto";
import { ArAdjustmentPostingResponseDto } from "../../types/modules/financial-document-processing-engine/ar-adjustment.response.dto";
import { ArWriteOffRequestDto } from "../../types/modules/financial-document-processing-engine/ar-write-off.request.dto";
import { ArRefundRequestDto } from "../../types/modules/financial-document-processing-engine/ar-refund.request.dto";
import { ArReceiptApplicationPostingResponseDto } from "../../types/modules/financial-document-processing-engine/ar-receipt-application.response.dto";
import { ArReceiptApplicationRequestDto } from "../../types/modules/financial-document-processing-engine/ar-receipt-application.request.dto";
import { ArReceiptPostingResponseDto } from "../../types/modules/financial-document-processing-engine/ar-receipt.response.dto";
import { ArReceiptRequestDto } from "../../types/modules/financial-document-processing-engine/ar-receipt.request.dto";
import { ArOpeningBalanceRequestDto } from "../../types/modules/financial-document-processing-engine/ar-opening-balance.request.dto";
import { ArInvoiceCancellationPostingResponseDto } from "../../types/modules/financial-document-processing-engine/ar-invoice-cancellation.response.dto";
import { ArInvoiceCancellationRequestDto } from "../../types/modules/financial-document-processing-engine/ar-invoice-cancellation.request.dto";
import { ArInvoicePostingResponseDto } from "../../types/modules/financial-document-processing-engine/ar-invoice.response.dto";
import { ArInvoiceRequestDto } from "../../types/modules/financial-document-processing-engine/ar-invoice.request.dto";
import { ArCreditNoteRequestDto } from "../../types/modules/financial-document-processing-engine/ar-credit-note.request.dto";
import { ApProcessingPostingResponseDto } from "../../types/modules/financial-document-processing-engine/ap-processing.response.dto";
import { ApCreditNoteRequestDto, ApOpeningBalanceRequestDto, ApRefundRequestDto, ApWriteOffRequestDto } from "../../types/modules/financial-document-processing-engine/ap-adjustment.request.dto";
import { ApPaymentApplicationRequestDto } from "../../types/modules/financial-document-processing-engine/ap-payment-application.request.dto";
import { ApPaymentRequestDto } from "../../types/modules/financial-document-processing-engine/ap-payment.request.dto";
import { ApBillCancellationRequestDto } from "../../types/modules/financial-document-processing-engine/ap-bill-cancellation.request.dto";
import { ApBillPostingResponseDto } from "../../types/modules/financial-document-processing-engine/ap-bill.response.dto";
import { ApBillRequestDto } from "../../types/modules/financial-document-processing-engine/ap-bill.request.dto";



export const apiDefinitions = {
  apBill: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_BILL",
    handler: (request: any) => handleProcessApBill(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApBillRequestDto },
    summary: "AP Bill",
    description: "AP Bill Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ApBillPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  apBillCancellation: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_BILL_CANCELLATION",
    handler: (request: any) => handleProcessApBillCancellation(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApBillCancellationRequestDto },
    summary: "AP Bill Cancellation",
    description: "AP Bill Cancellation Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  apCreditNote: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_CREDIT_NOTE",
    handler: (request: any) => handleProcessApCreditNote(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApCreditNoteRequestDto },
    summary: "AP Credit Note",
    description: "AP Credit Note Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  apOpeningBalance: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_OPENING_BALANCE",
    handler: (request: any) => handleProcessApOpeningBalance(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApOpeningBalanceRequestDto },
    summary: "AP Opening Balance",
    description: "AP Opening Balance Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  apPayment: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_PAYMENT",
    handler: (request: any) => handleProcessApPayment(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApPaymentRequestDto },
    summary: "AP Payment",
    description: "AP Payment Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  apPaymentApplication: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_PAYMENT_APPLICATION",
    handler: (request: any) => handleProcessApPaymentApplication(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApPaymentApplicationRequestDto },
    summary: "AP Payment Application",
    description: "AP Payment Application Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  apRefund: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_REFUND",
    handler: (request: any) => handleProcessApRefund(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApRefundRequestDto },
    summary: "AP Refund",
    description: "AP Refund Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  apWriteOff: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_WRITE_OFF",
    handler: (request: any) => handleProcessApWriteOff(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApWriteOffRequestDto },
    summary: "AP Write Off",
    description: "AP Write Off Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  arCreditNote: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_CREDIT_NOTE",
    handler: (request: any) => handleProcessArCreditNote(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArCreditNoteRequestDto },
    summary: "AR Credit Note",
    description: "AR Credit Note Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ArAdjustmentPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  arInvoice: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_INVOICE",
    handler: (request: any) => handleProcessArInvoice(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArInvoiceRequestDto },
    summary: "AR Invoice",
    description: "AR Invoice Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ArInvoicePostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  arInvoiceCancellation: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_INVOICE_CANCELLATION",
    handler: (request: any) => handleProcessArInvoiceCancellation(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArInvoiceCancellationRequestDto },
    summary: "AR Invoice Cancellation",
    description: "AR Invoice Cancellation Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ArInvoiceCancellationPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  arOpeningBalance: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_OPENING_BALANCE",
    handler: (request: any) => handleProcessArOpeningBalance(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArOpeningBalanceRequestDto },
    summary: "AR Opening Balance",
    description: "AR Opening Balance Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ArAdjustmentPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  arReceipt: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_RECEIPT",
    handler: (request: any) => handleProcessArReceipt(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArReceiptRequestDto },
    summary: "AR Receipt",
    description: "AR Receipt Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ArReceiptPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  arReceiptApplication: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_RECEIPT_APPLICATION",
    handler: (request: any) => handleProcessArReceiptApplication(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArReceiptApplicationRequestDto },
    summary: "AR Receipt Application",
    description: "AR Receipt Application Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ArReceiptApplicationPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  arRefund: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_REFUND",
    handler: (request: any) => handleProcessArRefund(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArRefundRequestDto },
    summary: "AR Refund",
    description: "AR Refund Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ArAdjustmentPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  arWriteOff: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_WRITE_OFF",
    handler: (request: any) => handleProcessArWriteOff(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArWriteOffRequestDto },
    summary: "AR Write Off",
    description: "AR Write Off Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: ArAdjustmentPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  inventoryAdjustment: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/INVENTORY_ADJUSTMENT",
    handler: (request: any) => handleProcessInventoryAdjustment(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryAdjustmentRequestDto },
    summary: "Inventory Adjustment",
    description: "Inventory Adjustment Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: InventoryProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  inventoryIssue: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/INVENTORY_ISSUE",
    handler: (request: any) => handleProcessInventoryIssue(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryIssueRequestDto },
    summary: "Inventory Issue",
    description: "Inventory Issue Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: InventoryProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  inventoryReceipt: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/INVENTORY_RECEIPT",
    handler: (request: any) => handleProcessInventoryReceipt(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryReceiptRequestDto },
    summary: "Inventory Receipt",
    description: "Inventory Receipt Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: InventoryProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  ledgerJournal: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/LEDGER_JOURNAL",
    handler: (request: any) => handleProcessLedgerJournal(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: LedgerJournalRequestDto },
    summary: "Ledger Journal",
    description: "Ledger Journal Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: LedgerJournalPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  ledgerJournalReversal: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/LEDGER_JOURNAL_REVERSAL",
    handler: (request: any) => handleProcessLedgerJournalReversal(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: LedgerJournalReversalRequestDto },
    summary: "Ledger Journal Reversal",
    description: "Ledger Journal Reversal Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: LedgerJournalReversalPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  taxAdjustment: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/TAX_ADJUSTMENT",
    handler: (request: any) => handleProcessTaxAdjustment(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: TaxAdjustmentRequestDto },
    summary: "Tax Adjustment",
    description: "Tax Adjustment Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: TaxProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  taxPayment: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/TAX_PAYMENT",
    handler: (request: any) => handleProcessTaxPayment(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: TaxPaymentRequestDto },
    summary: "Tax Payment",
    description: "Tax Payment Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: TaxProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  taxRefund: {
    method: "POST",
    path: "/finance/[companyCode]/process-document/TAX_REFUND",
    handler: (request: any) => handleProcessTaxRefund(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: TaxRefundRequestDto },
    summary: "Tax Refund",
    description: "Tax Refund Financial Document Processing Engine.",
    tags: ["Financial Document Processing Engine"],
    responses: {
      "200": { description: "Posted financial document result.", body: TaxProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
