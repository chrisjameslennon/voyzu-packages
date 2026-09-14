import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { TaxProcessingPostingResponseDto } from "./types/tax-processing.response.dto";
import { TaxAdjustmentRequestDto, TaxPaymentRequestDto, TaxRefundRequestDto } from "./types/tax-processing.request.dto";
import { LedgerJournalReversalPostingResponseDto } from "./types/ledger-journal-reversal.response.dto";
import { LedgerJournalReversalRequestDto } from "./types/ledger-journal-reversal.request.dto";
import { LedgerJournalPostingResponseDto } from "./types/ledger-journal.response.dto";
import { LedgerJournalRequestDto } from "./types/ledger-journal.request.dto";
import { InventoryProcessingPostingResponseDto } from "./types/inventory-processing.response.dto";
import { InventoryReceiptRequestDto } from "./types/inventory-receipt.request.dto";
import { InventoryIssueRequestDto } from "./types/inventory-issue.request.dto";
import { InventoryAdjustmentRequestDto } from "./types/inventory-adjustment.request.dto";
import { ArAdjustmentPostingResponseDto } from "./types/ar-adjustment.response.dto";
import { ArWriteOffRequestDto } from "./types/ar-write-off.request.dto";
import { ArRefundRequestDto } from "./types/ar-refund.request.dto";
import { ArReceiptApplicationPostingResponseDto } from "./types/ar-receipt-application.response.dto";
import { ArReceiptApplicationRequestDto } from "./types/ar-receipt-application.request.dto";
import { ArReceiptPostingResponseDto } from "./types/ar-receipt.response.dto";
import { ArReceiptRequestDto } from "./types/ar-receipt.request.dto";
import { ArOpeningBalanceRequestDto } from "./types/ar-opening-balance.request.dto";
import { ArInvoiceCancellationPostingResponseDto } from "./types/ar-invoice-cancellation.response.dto";
import { ArInvoiceCancellationRequestDto } from "./types/ar-invoice-cancellation.request.dto";
import { ArInvoicePostingResponseDto } from "./types/ar-invoice.response.dto";
import { ArInvoiceRequestDto } from "./types/ar-invoice.request.dto";
import { ArCreditNoteRequestDto } from "./types/ar-credit-note.request.dto";
import { ApProcessingPostingResponseDto } from "./types/ap-processing.response.dto";
import { ApCreditNoteRequestDto, ApOpeningBalanceRequestDto, ApRefundRequestDto, ApWriteOffRequestDto } from "./types/ap-adjustment.request.dto";
import { ApPaymentApplicationRequestDto } from "./types/ap-payment-application.request.dto";
import { ApPaymentRequestDto } from "./types/ap-payment.request.dto";
import { ApBillCancellationRequestDto } from "./types/ap-bill-cancellation.request.dto";
import { ApBillPostingResponseDto } from "./types/ap-bill.response.dto";
import { ApBillRequestDto } from "./types/ap-bill.request.dto";



export const httpApiRoutes = {
  "finance.financial-document-processing-engine.apBill": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_BILL",
    loadHandler: () => import("./ap_bill/api/ap-bill.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApBillRequestDto },
    summary: "AP Bill",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ApBillPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.apBillCancellation": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_BILL_CANCELLATION",
    loadHandler: () => import("./ap_bill_cancellation/api/ap-bill-cancellation.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApBillCancellationRequestDto },
    summary: "AP Bill Cancellation",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.apCreditNote": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_CREDIT_NOTE",
    loadHandler: () => import("./ap_credit_note/api/ap-credit-note.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApCreditNoteRequestDto },
    summary: "AP Credit Note",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.apOpeningBalance": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_OPENING_BALANCE",
    loadHandler: () => import("./ap_opening_balance/api/ap-opening-balance.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApOpeningBalanceRequestDto },
    summary: "AP Opening Balance",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.apPayment": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_PAYMENT",
    loadHandler: () => import("./ap_payment/api/ap-payment.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApPaymentRequestDto },
    summary: "AP Payment",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.apPaymentApplication": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_PAYMENT_APPLICATION",
    loadHandler: () => import("./ap_payment_application/api/ap-payment-application.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApPaymentApplicationRequestDto },
    summary: "AP Payment Application",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.apRefund": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_REFUND",
    loadHandler: () => import("./ap_refund/api/ap-refund.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApRefundRequestDto },
    summary: "AP Refund",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.apWriteOff": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AP_WRITE_OFF",
    loadHandler: () => import("./ap_write_off/api/ap-write-off.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ApWriteOffRequestDto },
    summary: "AP Write Off",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ApProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.arCreditNote": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_CREDIT_NOTE",
    loadHandler: () => import("./ar_credit_note/api/ar-credit-note.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArCreditNoteRequestDto },
    summary: "AR Credit Note",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ArAdjustmentPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.arInvoice": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_INVOICE",
    loadHandler: () => import("./ar_invoice/api/ar-invoice.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArInvoiceRequestDto },
    summary: "AR Invoice",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ArInvoicePostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.arInvoiceCancellation": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_INVOICE_CANCELLATION",
    loadHandler: () => import("./ar_invoice_cancellation/api/ar-invoice-cancellation.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArInvoiceCancellationRequestDto },
    summary: "AR Invoice Cancellation",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ArInvoiceCancellationPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.arOpeningBalance": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_OPENING_BALANCE",
    loadHandler: () => import("./ar_opening_balance/api/ar-opening-balance.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArOpeningBalanceRequestDto },
    summary: "AR Opening Balance",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ArAdjustmentPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.arReceipt": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_RECEIPT",
    loadHandler: () => import("./ar_receipt/api/ar-receipt.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArReceiptRequestDto },
    summary: "AR Receipt",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ArReceiptPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.arReceiptApplication": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_RECEIPT_APPLICATION",
    loadHandler: () => import("./ar_receipt_application/api/ar-receipt-application.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArReceiptApplicationRequestDto },
    summary: "AR Receipt Application",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ArReceiptApplicationPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.arRefund": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_REFUND",
    loadHandler: () => import("./ar_refund/api/ar-refund.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArRefundRequestDto },
    summary: "AR Refund",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ArAdjustmentPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.arWriteOff": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/AR_WRITE_OFF",
    loadHandler: () => import("./ar_write_off/api/ar-write-off.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ArWriteOffRequestDto },
    summary: "AR Write Off",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: ArAdjustmentPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.inventoryAdjustment": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/INVENTORY_ADJUSTMENT",
    loadHandler: () => import("./inventory/api/inventory-adjustment.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryAdjustmentRequestDto },
    summary: "Inventory Adjustment",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: InventoryProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.inventoryIssue": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/INVENTORY_ISSUE",
    loadHandler: () => import("./inventory/api/inventory-issue.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryIssueRequestDto },
    summary: "Inventory Issue",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: InventoryProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.inventoryReceipt": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/INVENTORY_RECEIPT",
    loadHandler: () => import("./inventory/api/inventory-receipt.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryReceiptRequestDto },
    summary: "Inventory Receipt",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: InventoryProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.ledgerJournal": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/LEDGER_JOURNAL",
    loadHandler: () => import("./ledger_journal/api/ledger-journal.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: LedgerJournalRequestDto },
    summary: "Ledger Journal",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: LedgerJournalPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.ledgerJournalReversal": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/LEDGER_JOURNAL_REVERSAL",
    loadHandler: () => import("./ledger_journal/api/ledger-journal-reversal.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: LedgerJournalReversalRequestDto },
    summary: "Ledger Journal Reversal",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: LedgerJournalReversalPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.taxAdjustment": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/TAX_ADJUSTMENT",
    loadHandler: () => import("./tax_adjustment/api/tax-adjustment.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: TaxAdjustmentRequestDto },
    summary: "Tax Adjustment",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: TaxProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.taxPayment": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/TAX_PAYMENT",
    loadHandler: () => import("./tax_payment/api/tax-payment.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: TaxPaymentRequestDto },
    summary: "Tax Payment",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: TaxProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-processing-engine.taxRefund": {
    method: "POST",
    path: "/finance/[companyCode]/process-document/TAX_REFUND",
    loadHandler: () => import("./tax_refund/api/tax-refund.http.handlers").then((module) => module.handleProcess),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: TaxRefundRequestDto },
    summary: "Tax Refund",
    
    
    responses: {
      "200": { description: "Posted financial document result.", body: TaxProcessingPostingResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
