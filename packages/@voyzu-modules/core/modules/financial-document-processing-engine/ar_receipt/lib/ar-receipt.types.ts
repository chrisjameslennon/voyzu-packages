import type { DrCr } from "@voyzu/types/modules/core";
import type { ArReceiptDetailedReceiptDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-receipt.response.dto";
import {
  AR_RECEIPT_AR_RECEIVABLE_COMPONENT,
  AR_RECEIPT_BANK_CASH_COMPONENT,
  AR_RECEIPT_UNAPPLIED_CASH_COMPONENT,
} from "../journal-posting-components";

import type {
  InvoiceOpenItemRow,
  ReceiptCompanyContextRow,
  ReceiptControlAccountRow,
  ReceiptCounterpartyContextRow,
  ReceiptFiscalPeriodRow,
  ReceiptPostingCodeAccountRow,
} from "../db/ar-receipt-posting.row.types";

export const AR_RECEIPT_ENGINE_CODE = "AR_RECEIPT";
export const AR_RECEIPT_DOCUMENT_LABEL = "Customer Payment";
export const CASH_POSTING_CODE = AR_RECEIPT_BANK_CASH_COMPONENT.posting_code;
export const CASH_POSTING_CODE_SLOT = "bank_cash_account_code";
export const CASH_POSTING_CODE_SCOPE = "HEADER";
export const AR_RECEIVABLE_CONTROL_CODE = AR_RECEIPT_AR_RECEIVABLE_COMPONENT.code;
export const AR_UNAPPLIED_CASH_CONTROL_CODE = AR_RECEIPT_UNAPPLIED_CASH_COMPONENT.code;

export interface ResolvedAllocation {
  invoice: InvoiceOpenItemRow;
  requested_amount: number;
  applied_amount: number;
  surplus_to_unapplied_amount: number;
}

export interface ArReceiptResolvedDocument {
  company: ReceiptCompanyContextRow;
  counterparty: ReceiptCounterpartyContextRow;
  detailedReceipt: ArReceiptDetailedReceiptDto;
  allocations: ResolvedAllocation[];
  cashPostingCode: ReceiptPostingCodeAccountRow;
}

export interface ArReceiptResolvedPostingContext extends ArReceiptResolvedDocument {
  period: ReceiptFiscalPeriodRow;
  arControlAccount: ReceiptControlAccountRow;
  unappliedCashControlAccount: ReceiptControlAccountRow;
}

export interface ArReceiptPostingLine {
  line_number: number;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: "ACCOUNTS_RECEIVABLE" | "BANK_CASH" | null;
  source_control_account: "AR_TRADE_RECEIVABLES" | "AR_UNAPPLIED_CASH" | string | null;
  dr_cr: DrCr;
  base_currency_amount: number;
  description: string;
  memo: string | null;
}

export interface ArReceiptGeneratedPosting {
  journalLines: ArReceiptPostingLine[];
  totalDebitBaseAmount: number;
  totalCreditBaseAmount: number;
}
