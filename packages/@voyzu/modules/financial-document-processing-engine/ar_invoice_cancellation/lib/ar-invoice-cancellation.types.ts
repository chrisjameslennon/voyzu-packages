import type { ArInvoiceCancellationDetailedDocumentDto } from "@voyzu/types/modules/financial-document-processing-engine/ar-invoice-cancellation.response.dto";

import type {
  InvoiceCancellationCompanyContextRow,
  InvoiceCancellationControlAccountRow,
  InvoiceCancellationCounterpartyContextRow,
  InvoiceCancellationDimensionValueLookupRow,
  InvoiceCancellationFiscalPeriodRow,
  InvoiceCancellationOpenInvoiceRow,
  InvoiceCancellationPostingCodeAccountRow,
  InvoiceCancellationTaxMovementControlAccountRow,
} from "../db/ar-invoice-cancellation-posting.row.types";

export const AR_INVOICE_CANCELLATION_ENGINE_CODE = "AR_INVOICE_CANCELLATION";
export const AR_INVOICE_CANCELLATION_DOCUMENT_LABEL = "Invoice withdrawal";
export const AR_RECEIVABLE_CONTROL_CODE = "AR_TRADE_RECEIVABLES";
export const TAX_ON_SALES_MOVEMENT_CODE = "TAX_ON_SALES";

export interface ArInvoiceCancellationResolvedDocument {
  company: InvoiceCancellationCompanyContextRow;
  counterparty: InvoiceCancellationCounterpartyContextRow;
  sourceInvoice: InvoiceCancellationOpenInvoiceRow;
  detailedCancellation: ArInvoiceCancellationDetailedDocumentDto;
}

export interface ArInvoiceCancellationResolvedPostingContext extends ArInvoiceCancellationResolvedDocument {
  period: InvoiceCancellationFiscalPeriodRow;
  arControlAccount: InvoiceCancellationControlAccountRow;
  taxMovementControlAccount: InvoiceCancellationTaxMovementControlAccountRow;
  revenueAccountsByCode: Map<string, InvoiceCancellationPostingCodeAccountRow>;
  dimensionValuesByCodeAndName: Map<string, InvoiceCancellationDimensionValueLookupRow>;
}

export interface ArInvoiceCancellationLineDimension {
  dimension_id: number;
  dimension_value_id: number;
  dimension_code: string;
  dimension_name: string;
  dimension_value_name: string;
}

export interface ArInvoiceCancellationPostingLine {
  line_number: number;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: "ACCOUNTS_RECEIVABLE" | "TAX" | "POSTING_CODE" | null;
  source_control_account: string | null;
  dr_cr: DrCr;
  base_currency_amount: number;
  description: string;
  memo: string | null;
  dimensions?: ArInvoiceCancellationLineDimension[];
}

export interface ArInvoiceCancellationGeneratedPosting {
  journalLines: ArInvoiceCancellationPostingLine[];
  totalDebitBaseAmount: number;
  totalCreditBaseAmount: number;
}
