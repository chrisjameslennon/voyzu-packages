import type { DrCr } from "@voyzu/types/modules/core";
import type { ArInvoiceDetailedInvoiceDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-invoice.response.dto";
import {
  AR_INVOICE_AR_RECEIVABLE_COMPONENT,
  AR_INVOICE_REVENUE_COMPONENT,
  AR_INVOICE_TAX_OUTPUT_COMPONENT,
} from "../journal-posting-components";
import type {
  CompanyPostingContextRow,
  ControlAccountPostingRow,
  CounterpartyPostingContextRow,
  DimensionValueLookupRow,
  FiscalPostingPeriodRow,
  PostingCodeAccountRow,
  TaxAuthorityRow,
  TaxComponentRow,
  TaxLedgerEntryRow,
  TaxMovementControlAccountRow,
  TaxRuleRow,
} from "../db/ar-invoice-posting.row.types";

export const AR_INVOICE_ENGINE_CODE = "AR_INVOICE";
export const AR_INVOICE_DOCUMENT_LABEL = "Customer Invoice";
export const REVENUE_POSTING_CODE = AR_INVOICE_REVENUE_COMPONENT.code;
export const REVENUE_POSTING_CODE_SLOT = "revenue_posting_code";
export const REVENUE_POSTING_CODE_SCOPE = "HEADER_AND_LINE";
export const AR_RECEIVABLE_CONTROL_CODE = AR_INVOICE_AR_RECEIVABLE_COMPONENT.code;
export const TAX_ON_SALES_MOVEMENT_CODE = AR_INVOICE_TAX_OUTPUT_COMPONENT.code;
export const CALLER_SUPPLIED_TAX_RULE_CODE = "CALLER_SUPPLIED";

export interface ArInvoiceResolvedDocument {
  company: CompanyPostingContextRow;
  counterparty: CounterpartyPostingContextRow;
  counterpartyWasCreated: boolean;
  detailedInvoice: ArInvoiceDetailedInvoiceDto;
}

export interface ArInvoiceResolvedPostingContext extends ArInvoiceResolvedDocument {
  period: FiscalPostingPeriodRow;
  arControlAccount: ControlAccountPostingRow;
  taxMovementControlAccount: TaxMovementControlAccountRow;
  revenueAccountsByCode: Map<string, PostingCodeAccountRow>;
  dimensionValuesByCodeAndName: Map<string, DimensionValueLookupRow>;
}

export interface ArInvoiceLineDimension {
  dimension_id: number;
  dimension_value_id: number;
  dimension_code: string;
  dimension_name: string;
  dimension_value_name: string;
}

export interface ArInvoicePostingLine {
  line_number: number;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: "ACCOUNTS_RECEIVABLE" | "TAX" | "POSTING_CODE" | null;
  source_control_account: "AR_TRADE_RECEIVABLES" | "TAX_ON_SALES" | string | null;
  dr_cr: DrCr;
  base_currency_amount: number;
  description: string;
  memo: string | null;
  dimensions?: ArInvoiceLineDimension[];
}

export interface ArInvoiceGeneratedPosting {
  journalLines: ArInvoicePostingLine[];
  totalDebitBaseAmount: number;
  totalCreditBaseAmount: number;
}

export interface ArInvoiceConfiguredTaxResolution {
  kind: "CONFIGURED";
  taxRule: TaxRuleRow;
  taxComponents: TaxComponentRow[];
}

export interface ArInvoiceNoTaxResolution {
  kind: "NO_TAX";
  taxRule: TaxRuleRow;
}

export interface ArInvoiceCallerSuppliedTaxComponentResolution {
  taxRule: TaxRuleRow;
  taxAuthority: TaxAuthorityRow;
  taxRate: number;
  invoiceLabel: string | null;
}

export interface ArInvoiceCallerSuppliedTaxResolution {
  kind: "CALLER_SUPPLIED";
  taxRule: TaxRuleRow;
  taxComponents: ArInvoiceCallerSuppliedTaxComponentResolution[];
}

export type ArInvoiceTaxResolution =
  | ArInvoiceConfiguredTaxResolution
  | ArInvoiceNoTaxResolution
  | ArInvoiceCallerSuppliedTaxResolution;

export interface ArInvoicePersistedRows {
  arSubledgerEntry: {
    id: number;
    ar_subledger_entry_code: string;
  };
  taxLedgerEntries: TaxLedgerEntryRow[];
}
