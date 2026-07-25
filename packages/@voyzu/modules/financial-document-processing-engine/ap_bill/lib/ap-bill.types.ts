import type { DrCr } from "@voyzu/types/modules/core";
import {
  AP_BILL_AP_PAYABLE_COMPONENT,
  AP_BILL_PURCHASE_COMPONENT,
  AP_BILL_TAX_ON_PURCHASES_COMPONENT,
} from "../journal-posting-components";

export const AP_BILL_ENGINE_CODE = "AP_BILL";
export const AP_BILL_DOCUMENT_LABEL = "Supplier Bill";
export const PURCHASE_POSTING_CODE = AP_BILL_PURCHASE_COMPONENT.code;
export const PURCHASE_POSTING_CODE_SLOT = "purchase_posting_code";
export const PURCHASE_POSTING_CODE_SCOPE = "HEADER_AND_LINE";
export const AP_PAYABLE_CONTROL_CODE = AP_BILL_AP_PAYABLE_COMPONENT.code;
export const TAX_ON_PURCHASES_MOVEMENT_CODE = AP_BILL_TAX_ON_PURCHASES_COMPONENT.code;
export const CALLER_SUPPLIED_TAX_RULE_CODE = "CALLER_SUPPLIED";

export interface ApBillLineDimension {
  dimension_id: number;
  dimension_value_id: number;
  dimension_code: string;
  dimension_name: string;
  dimension_value_name: string;
}

export interface ApBillPostingLine {
  line_number: number;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: "ACCOUNTS_PAYABLE" | "INVENTORY" | "TAX" | "POSTING_CODE" | null;
  source_control_account: "AP_TRADE_PAYABLES" | "TAX_ON_PURCHASES" | string | null;
  dr_cr: DrCr;
  base_currency_amount: number;
  description: string;
  memo: string | null;
  dimensions?: ApBillLineDimension[];
}
