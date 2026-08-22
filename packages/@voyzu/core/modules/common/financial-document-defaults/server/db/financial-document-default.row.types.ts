import type { ActorType } from "@voyzu/core/types/modules/core";
export interface FinancialDocumentDefaultRow {
  finance_company_id: number;
  document_code: string;
  code: string;
  name: string;
  target_type: "GENERAL_LEDGER" | "BANK_CASH_ACCOUNT";
  allowed_account_types: string[];
  override_property_name: string;
  override_scope: "HEADER" | "LINE" | "HEADER_AND_LINE";
  gl_account_id: number | null;
  bank_cash_control_account_id: number | null;
  gl_account_code?: string;
  gl_account_name?: string;
  gl_account_type?: string;
  bank_cash_code?: string | null;
  bank_cash_type?: string | null;
  bank_cash_gl_account_id?: number | null;
  bank_cash_gl_account_code?: string | null;
  bank_cash_gl_account_name?: string | null;
  bank_cash_gl_account_type?: string | null;
  status: string;
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}

export interface InsertFinancialDocumentDefaultRow {
  finance_company_id: number;
  document_code: string;
  code: string;
  status?: string;
  name?: string;
  target_type?: "GENERAL_LEDGER" | "BANK_CASH_ACCOUNT";
  allowed_account_types?: string[];
  override_property_name?: string;
  override_scope?: "HEADER" | "LINE" | "HEADER_AND_LINE";
  gl_account_id?: number | null;
  bank_cash_control_account_id?: number | null;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
}

export interface UpdateFinancialDocumentDefaultRow {
  gl_account_id?: number | null;
  bank_cash_control_account_id?: number | null;
  updated_user_id?: string | null;
  updated_actor_type?: ActorType;
  updated_date?: string;
  updated_mutation_id?: string | null;
}

export type PatchFinancialDocumentDefaultRow = Partial<UpdateFinancialDocumentDefaultRow>;
