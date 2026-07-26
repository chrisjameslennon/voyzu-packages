import type { ArReceiptApplicationDetailedDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-receipt-application.response.dto";

import type {
  ReceiptApplicationCompanyContextRow,
  ReceiptApplicationControlAccountRow,
  ReceiptApplicationCounterpartyContextRow,
  ReceiptApplicationFiscalPeriodRow,
  ReceiptApplicationOpenItemRow,
} from "../db/ar-receipt-application-posting.row.types";

export const AR_RECEIPT_APPLICATION_ENGINE_CODE = "AR_RECEIPT_APPLICATION";
export const AR_RECEIPT_APPLICATION_DOCUMENT_LABEL = "Customer Receipt Application";
export const AR_RECEIVABLE_CONTROL_CODE = "AR_TRADE_RECEIVABLES";
export const AR_UNAPPLIED_CASH_CONTROL_CODE = "AR_UNAPPLIED_CASH";

export interface ResolvedReceiptApplicationLine {
  sourceReceipt: ReceiptApplicationOpenItemRow;
  targetInvoice: ReceiptApplicationOpenItemRow;
  amount: number;
  source_open_amount_before: number;
  source_open_amount_after: number;
  target_open_amount_before: number;
  target_open_amount_after: number;
}

export interface ArReceiptApplicationResolvedDocument {
  company: ReceiptApplicationCompanyContextRow;
  counterparty: ReceiptApplicationCounterpartyContextRow;
  detailedApplication: ArReceiptApplicationDetailedDto;
  applications: ResolvedReceiptApplicationLine[];
}

export interface ArReceiptApplicationResolvedPostingContext extends ArReceiptApplicationResolvedDocument {
  period: ReceiptApplicationFiscalPeriodRow;
  arControlAccount: ReceiptApplicationControlAccountRow;
  unappliedCashControlAccount: ReceiptApplicationControlAccountRow;
}

export interface ArReceiptApplicationPostingLine {
  line_number: number;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: "ACCOUNTS_RECEIVABLE" | null;
  source_control_account: "AR_TRADE_RECEIVABLES" | "AR_UNAPPLIED_CASH" | null;
  dr_cr: DrCr;
  base_currency_amount: number;
  description: string;
  memo: string | null;
}

export interface ArReceiptApplicationGeneratedPosting {
  journalLines: ArReceiptApplicationPostingLine[];
  totalDebitBaseAmount: number;
  totalCreditBaseAmount: number;
}
