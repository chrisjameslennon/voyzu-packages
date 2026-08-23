import type { AccountType, ActorType, GlAccountPointerName, Status } from "@voyzu/finance/types/modules/core";
import type { BankCashAccountType } from "@voyzu/finance/types/modules/bank-cash-accounts";
export interface BankCashAccountRow {
  id: number;
  finance_company_id: number;
  code: string;
  ledger: "BANK_CASH";
  type: BankCashAccountType;
  gl_account_id: number;
  bank_name: string | null;
  bank_branch_name: string | null;
  bank_account_identifier: string | null;
  cash_account_identifier: string | null;
  status: Status;
  gl_account_code: string | null;
  gl_account_name: string | null;
  gl_account_type: AccountType | null;
  has_postings: boolean;
  companies_with_postings: string[];
  linked_by: Array<{
    type: GlAccountPointerName;
    code: string;
  }>;
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}

export interface InsertBankCashAccountRow {
  finance_company_id: number;
  code: string;
  ledger?: "BANK_CASH";
  type: BankCashAccountType;
  gl_account_id: number;
  bank_name?: string | null;
  bank_branch_name?: string | null;
  bank_account_identifier?: string | null;
  cash_account_identifier?: string | null;
  status?: Status;
  creation_date?: string;
  creation_actor_type?: ActorType;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
}

export type PatchBankCashAccountRow = Partial<InsertBankCashAccountRow> & {
  updated_date?: string;
  updated_actor_type?: ActorType;
  updated_user_id?: string | null;
  updated_mutation_id?: string | null;
};
